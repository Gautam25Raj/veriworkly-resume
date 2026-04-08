import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

import { z } from "zod";
import { NextFunction, Request, Response } from "express";

import { prisma } from "#utils/prisma";
import { ApiError, createSuccessResponse, handleValidationError } from "#utils/errors";

import { convertNodeHeadersToWebHeaders, getSessionFromRequestHeaders } from "#auth";

import {
  type ExportFormat,
  type ResumeSnapshot,
  exportResumeSnapshot,
} from "#services/exportService";
import {
  enqueueUserExportJob,
  getUserExportJobStatus,
  consumeUserExportArtifact,
  enqueuePublicShareExportJob,
  getPublicShareExportJobStatus,
  consumePublicShareExportArtifact,
} from "#services/exportQueueService";

const syncStatusSchema = z.enum(["local-only", "pending", "syncing", "synced", "conflicted"]);

const resumeSnapshotSchema = z.record(z.any());

const masterProfileSchema = z.object({
  profile: z.record(z.any()),
});

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

const exportFormatSchema = z.enum(["pdf", "png", "jpg"]);

const resumeExportSchema = z.object({
  format: exportFormatSchema,
  snapshot: z.record(z.any()),
});

const publicShareExportSchema = z.object({
  format: exportFormatSchema,
  password: z.string().optional(),
});

async function getAuthedUser(req: Request) {
  const headers = convertNodeHeadersToWebHeaders(req.headers);
  const session = await getSessionFromRequestHeaders(headers);

  if (!session?.user?.id) {
    throw new ApiError(401, "Authentication required");
  }

  return session.user;
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

async function verifyPassword(password: string, hash: string) {
  const [salt, stored] = hash.split(":");

  if (!salt || !stored) {
    return false;
  }

  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const left = derived;
  const right = Buffer.from(stored, "hex");

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

function isExpired(expiresAt: Date | null) {
  return Boolean(expiresAt && expiresAt.getTime() <= Date.now());
}

async function recordShareView(shareLinkId: string, req: Request) {
  await prisma.resumeShareLink.update({
    where: { id: shareLinkId },
    data: {
      viewCount: { increment: 1 },
      lastViewedAt: new Date(),
      views: {
        create: {
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"] ?? null,
        },
      },
    },
  });
}

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

export async function listResumesController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getAuthedUser(req);
    const { updatedSince } = resumeListQuerySchema.parse(req.query);

    const updatedSinceDate = updatedSince ? new Date(updatedSince) : null;

    const resumes = await prisma.resume.findMany({
      where: {
        userId: user.id,
        ...(updatedSinceDate
          ? {
              updatedAt: {
                gt: updatedSinceDate,
              },
            }
          : {}),
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

    res.json(createSuccessResponse(resumes, "Resumes fetched successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));

    next(error);
  }
}

export async function getResumeController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getAuthedUser(req);
    const { resumeId } = req.params;

    if (!resumeId) {
      throw new ApiError(400, "Resume ID is required");
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

    res.json(createSuccessResponse(resume, "Resume fetched successfully"));
  } catch (error) {
    next(error);
  }
}

export async function getMasterProfileController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getAuthedUser(req);

    const profile = await prisma.masterProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        content: {},
      },
      update: {},
    });

    res.json(createSuccessResponse(profile, "Master profile fetched successfully"));
  } catch (error) {
    next(error);
  }
}

export async function updateMasterProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await getAuthedUser(req);
    const { profile } = masterProfileSchema.parse(req.body);

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

    res.json(createSuccessResponse(updated, "Master profile updated successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));

    next(error);
  }
}

export async function updateResumeSyncController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getAuthedUser(req);
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

    res.json(createSuccessResponse(sync, "Resume sync state updated successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));

    next(error);
  }
}

export async function createResumeShareLinkController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await getAuthedUser(req);
    const body = shareLinkCreateSchema.parse(req.body);

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
        resumeId: body.resumeId,
        resumeTitle,
        token,
        snapshot: body.snapshot,
        passwordHash,
        expiresAt,
      },
    });

    res.json(createSuccessResponse(shareLink, "Share link created successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));

    next(error);
  }
}

export async function listResumeShareLinksController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await getAuthedUser(req);
    const { resumeId } = req.params;

    if (!resumeId) {
      throw new ApiError(400, "Resume ID is required");
    }

    const shareLinks = await prisma.resumeShareLink.findMany({
      where: {
        userId: user.id,
        resumeId,
      },
      orderBy: {
        createdAt: "desc",
      },
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

    res.json(
      createSuccessResponse(
        shareLinks.map((item) => ({
          id: item.id,
          token: item.token,
          resumeTitle: item.resumeTitle,
          expiresAt: item.expiresAt,
          passwordRequired: Boolean(item.passwordHash),
          viewCount: item.viewCount,
          lastViewedAt: item.lastViewedAt,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
        "Share links fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
}

export async function revokeResumeShareLinkController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await getAuthedUser(req);
    const { resumeId, shareLinkId } = req.params;

    if (!resumeId || !shareLinkId) {
      throw new ApiError(400, "Resume ID and share link ID are required");
    }

    const existing = await prisma.resumeShareLink.findFirst({
      where: {
        id: shareLinkId,
        userId: user.id,
        resumeId,
      },
      select: { id: true },
    });

    if (!existing) {
      throw new ApiError(404, "Share link not found");
    }

    await prisma.resumeShareLink.delete({
      where: {
        id: shareLinkId,
      },
    });

    res.json(createSuccessResponse({ id: shareLinkId }, "Share link revoked successfully"));
  } catch (error) {
    next(error);
  }
}

function buildExportFileName(baseTitle: string, extension: string) {
  const normalized = baseTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${normalized || "resume"}.${extension}`;
}

function sendDownload(
  res: Response,
  input: {
    contentType: string;
    fileNameBase: string;
    extension: string;
    buffer: Buffer;
  },
) {
  const fileName = buildExportFileName(input.fileNameBase, input.extension);

  res.setHeader("Content-Type", input.contentType);
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.send(input.buffer);
}

export async function createResumeExportJobController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await getAuthedUser(req);
    const { resumeId } = req.params;

    if (!resumeId) {
      throw new ApiError(400, "Resume ID is required");
    }

    const body = resumeExportSchema.parse(req.body);
    const snapshot = body.snapshot as ResumeSnapshot;

    const fileNameBase =
      (snapshot.basics?.fullName && String(snapshot.basics.fullName)) || "resume";

    const job = enqueueUserExportJob({
      userId: user.id,
      resumeId,
      snapshot,
      format: body.format as ExportFormat,
      fileNameBase,
    });

    res.status(202).json(
      createSuccessResponse(
        {
          jobId: job.id,
          status: job.status,
          statusPath: `resumes/export-jobs/${job.id}`,
          downloadPath: `resumes/export-jobs/${job.id}/download`,
        },
        "Export job queued",
      ),
    );
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));

    next(error);
  }
}

export async function getResumeExportJobStatusController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await getAuthedUser(req);
    const { jobId } = req.params;

    if (!jobId) {
      throw new ApiError(400, "Export job ID is required");
    }

    const status = getUserExportJobStatus(jobId, user.id);
    res.json(createSuccessResponse(status, "Export job status fetched"));
  } catch (error) {
    next(error);
  }
}

export async function downloadResumeExportJobController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await getAuthedUser(req);
    const { jobId } = req.params;

    if (!jobId) {
      throw new ApiError(400, "Export job ID is required");
    }

    const artifact = consumeUserExportArtifact(jobId, user.id);
    sendDownload(res, artifact);
  } catch (error) {
    next(error);
  }
}

export async function exportResumeController(req: Request, res: Response, next: NextFunction) {
  try {
    await getAuthedUser(req);
    const { resumeId } = req.params;

    if (!resumeId) {
      throw new ApiError(400, "Resume ID is required");
    }

    const body = resumeExportSchema.parse(req.body);
    const snapshot = body.snapshot as ResumeSnapshot;
    const format = body.format as ExportFormat;

    const rendered = await exportResumeSnapshot(snapshot, format);

    const title = (snapshot.basics?.fullName && String(snapshot.basics.fullName)) || "resume";
    const fileName = buildExportFileName(title, rendered.extension);

    res.setHeader("Content-Type", rendered.contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(rendered.buffer);
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));

    next(error);
  }
}

export async function getPublicShareLinkController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.params;

    if (!token) {
      throw new ApiError(400, "Share token is required");
    }

    const shareLink = await prisma.resumeShareLink.findUnique({
      where: { token },
    });

    if (!shareLink || isExpired(shareLink.expiresAt)) {
      throw new ApiError(404, "Shared resume not found");
    }

    if (shareLink.passwordHash) {
      return res.json(
        createSuccessResponse(
          {
            passwordRequired: true,
            resumeTitle: shareLink.resumeTitle,
            expiresAt: shareLink.expiresAt,
            viewCount: shareLink.viewCount,
          },
          "Password required",
        ),
      );
    }

    await recordShareView(shareLink.id, req);

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

export async function verifyPublicShareLinkController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.params;

    if (!token) {
      throw new ApiError(400, "Share token is required");
    }

    const body = shareLinkPasswordSchema.parse(req.body);

    const shareLink = await prisma.resumeShareLink.findUnique({
      where: { token },
    });

    if (!shareLink || isExpired(shareLink.expiresAt)) {
      throw new ApiError(404, "Shared resume not found");
    }

    if (shareLink.passwordHash) {
      const passwordMatches = await verifyPassword(body.password, shareLink.passwordHash);

      if (!passwordMatches) {
        throw new ApiError(401, "Invalid password");
      }
    }

    await recordShareView(shareLink.id, req);

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

export async function exportPublicShareLinkController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.params;

    if (!token) {
      throw new ApiError(400, "Share token is required");
    }

    const parsedQuery = publicShareExportSchema.parse(req.query);

    const shareLink = await prisma.resumeShareLink.findUnique({
      where: { token },
    });

    if (!shareLink || isExpired(shareLink.expiresAt)) {
      throw new ApiError(404, "Shared resume not found");
    }

    if (shareLink.passwordHash) {
      const providedPassword = parsedQuery.password;

      if (!providedPassword) {
        throw new ApiError(401, "Invalid password");
      }

      const passwordMatches = await verifyPassword(providedPassword, shareLink.passwordHash);

      if (!passwordMatches) {
        throw new ApiError(401, "Invalid password");
      }
    }

    const rendered = await exportResumeSnapshot(
      shareLink.snapshot as ResumeSnapshot,
      parsedQuery.format as ExportFormat,
    );

    const fileName = buildExportFileName(shareLink.resumeTitle, rendered.extension);

    res.setHeader("Content-Type", rendered.contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(rendered.buffer);
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));

    next(error);
  }
}

export async function createPublicShareExportJobController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.params;

    if (!token) {
      throw new ApiError(400, "Share token is required");
    }

    const body = publicShareExportSchema.parse(req.body);

    const shareLink = await prisma.resumeShareLink.findUnique({
      where: { token },
    });

    if (!shareLink || isExpired(shareLink.expiresAt)) {
      throw new ApiError(404, "Shared resume not found");
    }

    if (shareLink.passwordHash) {
      const providedPassword = body.password;

      if (!providedPassword) {
        throw new ApiError(401, "Invalid password");
      }

      const passwordMatches = await verifyPassword(providedPassword, shareLink.passwordHash);

      if (!passwordMatches) {
        throw new ApiError(401, "Invalid password");
      }
    }

    const job = enqueuePublicShareExportJob({
      shareToken: token,
      snapshot: shareLink.snapshot as ResumeSnapshot,
      format: body.format as ExportFormat,
      fileNameBase: shareLink.resumeTitle,
    });

    res.status(202).json(
      createSuccessResponse(
        {
          jobId: job.id,
          status: job.status,
          statusPath: `share-links/${token}/export/jobs/${job.id}`,
          downloadPath: `share-links/${token}/export/jobs/${job.id}/download`,
        },
        "Shared export job queued",
      ),
    );
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));

    next(error);
  }
}

export async function getPublicShareExportJobStatusController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token, jobId } = req.params;

    if (!token || !jobId) {
      throw new ApiError(400, "Share token and export job ID are required");
    }

    const status = getPublicShareExportJobStatus(jobId, token);
    res.json(createSuccessResponse(status, "Shared export job status fetched"));
  } catch (error) {
    next(error);
  }
}

export async function downloadPublicShareExportJobController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token, jobId } = req.params;

    if (!token || !jobId) {
      throw new ApiError(400, "Share token and export job ID are required");
    }

    const artifact = consumePublicShareExportArtifact(jobId, token);
    sendDownload(res, artifact);
  } catch (error) {
    next(error);
  }
}
