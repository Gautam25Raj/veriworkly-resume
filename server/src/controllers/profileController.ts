import { z } from "zod";
import { NextFunction, Request, Response } from "express";

import { requireAuthUser } from "#middleware/auth";

import { prisma } from "#utils/prisma";
import { cacheDel, cacheGet, cacheSet } from "#utils/redis";
import { ApiError, createSuccessResponse, handleValidationError } from "#utils/errors";

import { masterProfilePayloadSchema } from "#validators/masterProfileValidator";

/**
 * Check if profile has been updated from another session
 */

export function hasMasterProfileConflict(
  existingUpdatedAt: Date | null,
  expectedUpdatedAt: string | undefined,
) {
  if (!existingUpdatedAt || !expectedUpdatedAt) {
    return false;
  }

  const expectedMs = Date.parse(expectedUpdatedAt);

  if (Number.isNaN(expectedMs)) {
    return false;
  }

  return existingUpdatedAt.getTime() !== expectedMs;
}

/**
 * Get master profile with user summary
 */

export async function getMasterProfileController(req: Request, res: Response, next: NextFunction) {
  try {
    const authUser = requireAuthUser(req);

    const cacheKey = `profile:${authUser.id}`;

    const cachedData = await cacheGet(cacheKey);

    if (cachedData) {
      return res.json(createSuccessResponse(cachedData, "Master profile fetched from cache"));
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        autoSyncEnabled: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const [profile, shareResumeCount] = await prisma.$transaction([
      prisma.masterProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          content: {},
        },
        update: {},
      }),
      prisma.resumeShareLink.count({
        where: { userId: user.id },
      }),
    ]);

    const responseData = {
      profile,
      summary: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        emailVerified: user.emailVerified,
        autoSyncEnabled: user.autoSyncEnabled,
        shareResumeCount,
      },
    };

    await cacheSet(cacheKey, responseData, 3600);

    res.json(createSuccessResponse(responseData, "Master profile fetched successfully"));
  } catch (error) {
    next(error);
  }
}

/**
 * Update master profile with optimistic concurrency control
 */

export async function updateMasterProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireAuthUser(req);
    const { expectedUpdatedAt, profile } = masterProfilePayloadSchema.parse(req.body);

    const existing = await prisma.masterProfile.findUnique({
      where: { userId: user.id },
      select: { updatedAt: true },
    });

    if (hasMasterProfileConflict(existing?.updatedAt ?? null, expectedUpdatedAt)) {
      throw new ApiError(
        409,
        "Master profile was updated from another session. Refresh and retry.",
      );
    }

    if (JSON.stringify(profile).length > 1_000_000) {
      throw new ApiError(413, "Master profile payload is too large");
    }

    const updated = await prisma.masterProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        content: profile,
      },
      update: {
        content: profile,
      },
    });

    await cacheDel(`profile:${user.id}`);

    res.json(createSuccessResponse(updated, "Master profile updated successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));

    next(error);
  }
}
