import { z } from "zod";
import { NextFunction, Request, Response } from "express";

import { requireAuthUser } from "#middleware/auth";

import { prisma } from "#utils/prisma";
import { cacheGet, cacheSet, cacheDel } from "#utils/redis";
import { ApiError, createSuccessResponse, handleValidationError } from "#utils/errors";

const syncStatusSchema = z.enum(["local-only", "pending", "syncing", "synced", "conflicted"]);

const resumeSnapshotSchema = z.record(z.any());

const syncStateSchema = z.object({
  syncEnabled: z.boolean(),
  syncStatus: syncStatusSchema.optional(),
  cloudResumeId: z.string().nullable().optional(),
  lastSyncedAt: z.string().datetime().nullable().optional(),
  force: z.boolean().optional(),
  clientUpdatedAt: z.string().datetime().optional(),
  resume: resumeSnapshotSchema.optional(),
});

const resumeListQuerySchema = z.object({
  updatedSince: z.string().datetime().optional(),
});

function extractResumeTitle(snapshot: Record<string, unknown>, fallback: string) {
  const basics = snapshot.basics;

  if (basics && typeof basics === "object" && !Array.isArray(basics)) {
    const title = (basics as { fullName?: unknown }).fullName;

    if (typeof title === "string" && title.trim()) {
      return title.trim();
    }
  }

  return fallback;
}

function extractResumeTemplate(snapshot: Record<string, unknown>) {
  const templateId = snapshot.templateId;

  if (typeof templateId === "string" && templateId.trim()) {
    return templateId.trim();
  }

  return "modern";
}

function toResumeCloudId(resumeId: string, cloudResumeId?: string | null) {
  return cloudResumeId && cloudResumeId.trim() ? cloudResumeId : resumeId;
}

function extractSnapshotUpdatedAt(snapshot: Record<string, unknown> | null | undefined) {
  const value = snapshot?.updatedAt;

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : new Date(parsed);
}

/**
 * List all resumes for authenticated user
 */

export async function listResumesController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireAuthUser(req);

    const { updatedSince } = resumeListQuerySchema.parse(req.query);
    const updatedSinceDate = updatedSince ? new Date(updatedSince) : null;

    const listCacheKey = `resumes:list:${user.id}`;

    if (!updatedSinceDate) {
      const cachedList = await cacheGet(listCacheKey);

      if (cachedList) {
        return res.json(createSuccessResponse(cachedList, "Resumes fetched from cache"));
      }
    }

    const resumes = await prisma.resume.findMany({
      where: {
        userId: user.id,
        ...(updatedSinceDate ? { updatedAt: { gt: updatedSinceDate } } : {}),
      },

      orderBy: { updatedAt: "desc" },

      select: {
        id: true,
        title: true,
        content: true,
        template: true,
        isPublic: true,
        syncEnabled: true,
        syncStatus: true,
        cloudResumeId: true,
        lastSyncedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!updatedSinceDate) {
      await cacheSet(listCacheKey, resumes, 1800);
    }

    res.json(createSuccessResponse(resumes, "Resumes fetched successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));
    next(error);
  }
}

/**
 * Get a specific resume
 */

export async function getResumeController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireAuthUser(req);

    const { resumeId } = req.params;

    if (!resumeId) {
      throw new ApiError(400, "Resume ID is required");
    }

    const resumeCacheKey = `resume:${user.id}:${resumeId}`;
    const cachedResume = await cacheGet(resumeCacheKey);

    if (cachedResume) {
      return res.json(createSuccessResponse(cachedResume, "Resume fetched from cache"));
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: user.id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        template: true,
        isPublic: true,
        syncEnabled: true,
        syncStatus: true,
        cloudResumeId: true,
        lastSyncedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!resume) {
      throw new ApiError(404, "Resume not found");
    }

    await cacheSet(resumeCacheKey, resume, 3600);

    res.json(createSuccessResponse(resume, "Resume fetched successfully"));
  } catch (error) {
    next(error);
  }
}

/**
 * Update resume sync state
 */

export async function updateResumeSyncController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireAuthUser(req);

    const { resumeId } = req.params;

    if (!resumeId) {
      throw new ApiError(400, "Resume ID is required");
    }

    const body = syncStateSchema.parse(req.body);
    const snapshot = body.resume ? resumeSnapshotSchema.parse(body.resume) : null;

    const incomingUpdatedAt =
      (body.clientUpdatedAt ? new Date(body.clientUpdatedAt) : null) ??
      extractSnapshotUpdatedAt(snapshot);

    const syncedAt = body.lastSyncedAt ? new Date(body.lastSyncedAt) : new Date();
    const cloudResumeId = toResumeCloudId(resumeId, body.cloudResumeId);

    const sync = await prisma.$transaction(async (tx) => {
      const existingResume = await tx.resume.findFirst({
        where: {
          id: resumeId,
          userId: user.id,
        },
        select: {
          updatedAt: true,
          content: true,
        },
      });

      if (snapshot && incomingUpdatedAt && !body.force) {
        const serverSnapshotUpdatedAt = extractSnapshotUpdatedAt(
          (existingResume?.content as Record<string, unknown> | null) ?? null,
        );

        const serverUpdatedAt = serverSnapshotUpdatedAt ?? existingResume?.updatedAt ?? null;

        if (serverUpdatedAt && serverUpdatedAt.getTime() > incomingUpdatedAt.getTime()) {
          throw new ApiError(409, "Conflict detected. Cloud resume has newer changes.");
        }
      }

      if (snapshot) {
        const title = extractResumeTitle(snapshot, "My Resume");
        const template = extractResumeTemplate(snapshot);

        await tx.resume.upsert({
          where: { id: resumeId },
          create: {
            id: resumeId,
            userId: user.id,
            title,
            content: snapshot,
            template,
            isPublic: false,
            syncEnabled: body.syncEnabled,
            syncStatus: body.syncStatus ?? (body.syncEnabled ? "pending" : "local-only"),
            cloudResumeId,
            lastSyncedAt: syncedAt,
          },
          update: {
            title,
            content: snapshot,
            template,
            syncEnabled: body.syncEnabled,
            syncStatus: body.syncStatus ?? (body.syncEnabled ? "pending" : "local-only"),
            cloudResumeId,
            lastSyncedAt: syncedAt,
          },
        });
      }

      return tx.resumeCloudSync.upsert({
        where: {
          userId_resumeId: {
            userId: user.id,
            resumeId,
          },
        },
        create: {
          userId: user.id,
          resumeId,
          syncEnabled: body.syncEnabled,
          syncStatus: body.syncStatus ?? (body.syncEnabled ? "pending" : "local-only"),
          cloudResumeId,
          lastSyncedAt: syncedAt,
        },
        update: {
          syncEnabled: body.syncEnabled,
          syncStatus: body.syncStatus ?? (body.syncEnabled ? "pending" : "local-only"),
          cloudResumeId,
          lastSyncedAt: syncedAt,
        },
      });
    });

    await Promise.all([
      cacheDel(`resume:${user.id}:${resumeId}`),
      cacheDel(`resumes:list:${user.id}`),
    ]);

    res.json(createSuccessResponse(sync, "Resume sync state updated successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));
    next(error);
  }
}
