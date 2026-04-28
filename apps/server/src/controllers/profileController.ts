import { z } from "zod";
import { NextFunction, Request, Response } from "express";

import { requireAuthUser } from "#middleware/auth";

import { prisma } from "#utils/prisma";
import { cacheDel, cacheGet, cacheSet } from "#utils/redis";
import { ApiError, createSuccessResponse, handleValidationError } from "#utils/errors";

import { masterProfilePayloadSchema } from "#validators/masterProfileValidator";

/**
 * Check for optimistic concurrency conflict using updatedAt.
 */

const hasMasterProfileConflict = (
  existingUpdatedAt: Date | null,
  expectedUpdatedAt: string | undefined,
) => {
  if (!existingUpdatedAt || !expectedUpdatedAt) {
    return false;
  }

  const expectedMs = Date.parse(expectedUpdatedAt);

  if (Number.isNaN(expectedMs)) {
    return false;
  }

  return existingUpdatedAt.getTime() !== expectedMs;
};

/**
 * Get the authenticated user's master profile and summary.
 * Uses cache for faster reads.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next middleware
 *
 * Response:
 * - 200: Profile + user summary
 *
 * Errors:
 * - 404: User not found
 * - 500: Server error
 */

const getMasterProfileController = async (req: Request, res: Response, next: NextFunction) => {
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
};

/**
 * Update the authenticated user's master profile.
 * Uses optimistic concurrency control and invalidates cache.
 *
 * @param req Express request (body: profile, expectedUpdatedAt)
 * @param res Express response
 * @param next Express next middleware
 *
 * Response:
 * - 200: Updated profile
 *
 * Errors:
 * - 400: Validation error
 * - 409: Update conflict
 * - 413: Payload too large
 * - 500: Server error
 */

const updateMasterProfileController = async (req: Request, res: Response, next: NextFunction) => {
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
};

export { hasMasterProfileConflict, getMasterProfileController, updateMasterProfileController };
