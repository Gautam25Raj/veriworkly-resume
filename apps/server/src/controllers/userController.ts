import { z } from "zod";
import { NextFunction, Request, Response } from "express";

import { requireAuthUser } from "#middleware/auth";

import { prisma } from "#utils/prisma";
import { cacheGet, cacheSet, cacheDel } from "#utils/redis";
import { ApiError, createSuccessResponse, handleValidationError } from "#utils/errors";

// Validation schemas
const updateUserNameSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").max(255, "Name is too long"),
});

/**
 * Update the authenticated user's name.
 *
 * @param req Express request (expects { name } in body)
 * @param res Express response
 * @param next Express next middleware
 *
 * Body:
 * - name: string (required, 1–255 chars)
 *
 * Response:
 * - 200: Updated user object
 *
 * Errors:
 * - 400: Validation error
 * - 500: Server error
 */

const getCurrentUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = requireAuthUser(req);

    const cacheKey = `user:me:${authUser.id}`;

    const cachedUser = await cacheGet(cacheKey);
    if (cachedUser) {
      return res.json(createSuccessResponse(cachedUser, "User information fetched successfully"));
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
        updatedAt: true,
        _count: {
          select: {
            resumeShareLinks: true,
            resumes: true,
          },
        },
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await cacheSet(cacheKey, user, 1800);

    res.json(createSuccessResponse(user, "User information fetched successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * Get the authenticated user's profile.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next middleware
 *
 * Response:
 * - 200: User profile data
 *
 * Errors:
 * - 404: User not found
 * - 500: Server error
 */

const updateUserNameController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = requireAuthUser(req);
    const { name } = updateUserNameSchema.parse(req.body);

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        autoSyncEnabled: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            resumeShareLinks: true,
            resumes: true,
          },
        },
      },
    });

    await cacheDel(`user:me:${user.id}`);
    await cacheSet(`user:me:${user.id}`, updated, 1800);

    res.json(createSuccessResponse(updated, "User name updated successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));

    next(error);
  }
};

export { getCurrentUserController, updateUserNameController };
