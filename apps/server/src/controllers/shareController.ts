import { z } from "zod";
import { promisify } from "node:util";
import { NextFunction, Request, Response } from "express";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

import type { ResumeShareLink } from "@prisma/client";

import { Prisma } from "@prisma/client";

import { requireAuthUser } from "#middleware/auth";

import { prisma } from "#utils/prisma";
import { cacheGet, cacheSet, cacheDel } from "#utils/redis";
import { ApiError, createSuccessResponse, handleValidationError } from "#utils/errors";

const shareLinkCreateSchema = z.object({
  resumeId: z.string().min(1),
  snapshot: z.record(z.any()),
  resumeTitle: z.string().min(1).optional(),
  password: z.string().min(1).optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  noExpiry: z.boolean().optional(),
});

const shareLinkPasswordSchema = z.object({
  password: z.string().min(1),
});

const scryptAsync = promisify(scrypt);

// Helper functions
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;

  return `${salt}:${derived.toString("hex")}`;
}

async function verifyPassword(password: string, hash: string) {
  const [salt, stored] = hash.split(":");

  if (!salt || !stored) return false;

  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const left = derived;
  const right = Buffer.from(stored, "hex");

  if (left.length !== right.length) return false;

  return timingSafeEqual(left, right);
}

function isExpired(expiresAt: Date | null | string) {
  if (!expiresAt) return false;

  return new Date(expiresAt).getTime() <= Date.now();
}

function recordShareViewAsync(shareLinkId: string, req: Request) {
  const ipAddress = req.ip;
  const userAgent = req.headers["user-agent"] ?? null;

  prisma.resumeShareLink
    .update({
      where: { id: shareLinkId },
      data: {
        viewCount: { increment: 1 },
        lastViewedAt: new Date(),
        views: {
          create: {
            ipAddress,
            userAgent,
          },
        },
      },
    })
    .catch((error) => {
      console.error(`Background view tracking failed for link ${shareLinkId}:`, error);
    });
}

/**
 * Create a new share link for a resume
 */

export async function createResumeShareLinkController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireAuthUser(req);

    const resumeIdFromParam = req.params.resumeId;
    const body = shareLinkCreateSchema.parse(req.body);

    const resumeId = resumeIdFromParam || body.resumeId;

    if (!resumeId) throw new ApiError(400, "Resume ID is required");

    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId: user.id },
      select: { id: true },
    });

    if (!resume) throw new ApiError(404, "Resume not found");

    const existingShareLink = await prisma.resumeShareLink.findFirst({
      where: { userId: user.id, resumeId },
      select: { id: true, expiresAt: true, token: true },
    });

    if (existingShareLink) {
      if (!isExpired(existingShareLink.expiresAt)) {
        throw new ApiError(
          409,
          "Share link already exists for this resume. Revoke it first to create a new one.",
        );
      }

      await prisma.resumeShareLink.delete({
        where: { id: existingShareLink.id },
      });

      await cacheDel(`share:public:${existingShareLink.token}`);
    }

    const token = randomBytes(18).toString("hex");

    const passwordHash = body.password ? await hashPassword(body.password) : null;
    const expiresAt = body.noExpiry ? null : body.expiresAt ? new Date(body.expiresAt) : null;

    const resumeTitle =
      body.resumeTitle ||
      (body.snapshot as { basics?: { fullName?: string } }).basics?.fullName ||
      "Shared Resume";

    const shareLink = await prisma.resumeShareLink.create({
      data: {
        userId: user.id,
        resumeId,
        resumeTitle,
        token,
        snapshot: body.snapshot,
        passwordHash,
        expiresAt,
      },
    });

    await cacheDel(`share:list:${user.id}:${resumeId}`);

    res.json(createSuccessResponse(shareLink, "Share link created successfully"));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return next(new ApiError(409, "Share link already exists for this resume. Revoke it first."));
    }

    if (error instanceof z.ZodError) return next(handleValidationError(error));

    next(error);
  }
}

/**
 * Get all share links for a resume
 */

export async function listResumeShareLinksController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireAuthUser(req);

    const { resumeId } = req.params;

    if (!resumeId) throw new ApiError(400, "Resume ID is required");

    const cacheKey = `share:list:${user.id}:${resumeId}`;
    const cachedList = await cacheGet(cacheKey);

    if (cachedList) {
      return res.json(createSuccessResponse(cachedList, "Share links fetched from cache"));
    }

    const shareLinks = await prisma.resumeShareLink.findMany({
      where: { userId: user.id, resumeId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        token: true,
        resumeTitle: true,
        expiresAt: true,
        passwordHash: true,
        viewCount: true,
        lastViewedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const formattedLinks = shareLinks.map((item) => ({
      id: item.id,
      token: item.token,
      resumeTitle: item.resumeTitle,
      expiresAt: item.expiresAt,
      passwordRequired: Boolean(item.passwordHash),
      viewCount: item.viewCount,
      lastViewedAt: item.lastViewedAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    await cacheSet(cacheKey, formattedLinks, 1800);

    res.json(createSuccessResponse(formattedLinks, "Share links fetched successfully"));
  } catch (error) {
    next(error);
  }
}

/**
 * Revoke a share link
 */

export async function revokeResumeShareLinkController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = requireAuthUser(req);
    const { resumeId, shareLinkId } = req.params;

    if (!resumeId || !shareLinkId) {
      throw new ApiError(400, "Resume ID and share link ID are required");
    }

    const existing = await prisma.resumeShareLink.findFirst({
      where: { id: shareLinkId, userId: user.id, resumeId },
      select: { id: true, token: true },
    });

    if (!existing) throw new ApiError(404, "Share link not found");

    await prisma.resumeShareLink.delete({
      where: { id: shareLinkId },
    });

    await Promise.all([
      cacheDel(`share:list:${user.id}:${resumeId}`),
      cacheDel(`share:public:${existing.token}`),
    ]);

    res.json(createSuccessResponse({ id: shareLinkId }, "Share link revoked successfully"));
  } catch (error) {
    next(error);
  }
}

/**
 * Get public share link (without auth)
 */

export async function getPublicShareLinkController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.params;

    if (!token) throw new ApiError(400, "Share token is required");

    const cacheKey = `share:public:${token}`;
    let shareLink: ResumeShareLink | null = await cacheGet<ResumeShareLink>(cacheKey);

    if (!shareLink) {
      shareLink = await prisma.resumeShareLink.findUnique({
        where: { token },
      });

      if (!shareLink) throw new ApiError(404, "Shared resume not found");

      await cacheSet(cacheKey, shareLink, 3600);
    }

    if (isExpired(shareLink.expiresAt)) {
      throw new ApiError(410, "Shared resume has expired");
    }

    if (shareLink.passwordHash) {
      return res.json(
        createSuccessResponse(
          {
            passwordRequired: true,
            resumeTitle: shareLink.resumeTitle,
            expiresAt: shareLink.expiresAt,
          },
          "Password required",
        ),
      );
    }

    recordShareViewAsync(shareLink.id, req);

    res.json(
      createSuccessResponse(
        {
          passwordRequired: false,
          resumeTitle: shareLink.resumeTitle,
          expiresAt: shareLink.expiresAt,
          snapshot: shareLink.snapshot,
        },
        "Shared resume fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Verify password and unlock public share link
 */

export async function verifyPublicShareLinkController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.params;

    if (!token) throw new ApiError(400, "Share token is required");

    const body = shareLinkPasswordSchema.parse(req.body);

    const cacheKey = `share:public:${token}`;
    let shareLink: ResumeShareLink | null = await cacheGet<ResumeShareLink>(cacheKey);

    if (!shareLink) {
      shareLink = await prisma.resumeShareLink.findUnique({ where: { token } });
      if (!shareLink) throw new ApiError(404, "Shared resume not found");
      await cacheSet(cacheKey, shareLink, 3600);
    }

    if (isExpired(shareLink.expiresAt)) {
      throw new ApiError(410, "Shared resume has expired");
    }

    if (shareLink.passwordHash) {
      const passwordMatches = await verifyPassword(body.password, shareLink.passwordHash);
      if (!passwordMatches) throw new ApiError(401, "Invalid password");
    }

    recordShareViewAsync(shareLink.id, req);

    res.json(
      createSuccessResponse(
        {
          passwordRequired: false,
          resumeTitle: shareLink.resumeTitle,
          expiresAt: shareLink.expiresAt,
          snapshot: shareLink.snapshot,
        },
        "Shared resume unlocked successfully",
      ),
    );
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));
    next(error);
  }
}
