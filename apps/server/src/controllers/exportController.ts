import { z } from "zod";
import { promisify } from "node:util";
import { NextFunction, Request, Response } from "express";
import { scrypt, timingSafeEqual, createHash } from "node:crypto";

import type { ResumeShareLink } from "@prisma/client";

import { requireAuthUser } from "#middleware/auth";

import { prisma } from "#utils/prisma";
import { cacheGet, cacheSet } from "#utils/redis";
import { ApiError, createSuccessResponse, handleValidationError } from "#utils/errors";

import {
  type ExportFormat,
  type ResumeSnapshot,
  exportResumeSnapshot,
} from "#services/exportService";
import {
  type ArtifactProvider,
  readExportArtifact,
  storeExportArtifact,
} from "#services/exportArtifactStore";
import {
  enqueueUserExportJob,
  getUserExportJobStatus,
  consumeUserExportArtifact,
  enqueuePublicShareExportJob,
  getPublicShareExportJobStatus,
  consumePublicShareExportArtifact,
} from "#services/exportQueueService";

// Validation schemas
const exportFormatSchema = z.enum(["pdf", "png", "jpg"]);

const resumeExportSchema = z.object({
  format: exportFormatSchema,
  snapshot: z.record(z.any()),
  renderHtml: z.string().min(1).max(3_000_000).optional(),
});

const publicShareExportSchema = z.object({
  format: exportFormatSchema,
  password: z.string().optional(),
  renderHtml: z.string().min(1).max(3_000_000).optional(),
});

const scryptAsync = promisify(scrypt);

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

async function assertValidSharePassword(passwordHash: string, providedPassword?: string) {
  if (!providedPassword) {
    throw new ApiError(401, "Invalid password");
  }

  const [salt, stored] = passwordHash.split(":");

  if (!salt || !stored) {
    throw new ApiError(401, "Invalid password");
  }

  const derived = (await scryptAsync(providedPassword, salt, 64)) as Buffer;
  const left = derived;
  const right = Buffer.from(stored, "hex");

  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    throw new ApiError(401, "Invalid password");
  }
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

/**
 * 2. HELPER: Idempotent Direct Export
 * Hashes the snapshot to prevent redundant Playwright rendering.
 */

async function getOrRenderDirectExport(
  snapshot: ResumeSnapshot,
  format: ExportFormat,
  renderHtml?: string,
) {
  const payloadHash = createHash("sha256").update(JSON.stringify(snapshot)).digest("hex");
  const htmlHash = renderHtml ? createHash("sha256").update(renderHtml).digest("hex") : "no-html";
  const cacheKey = `export:direct:${format}:${payloadHash}:${htmlHash}`;

  type CachedArtifact = {
    storageProvider: ArtifactProvider;
    storageKey: string;
    contentType: string;
    extension: string;
    sizeBytes: number;
  };

  const cached = await cacheGet<CachedArtifact>(cacheKey);

  if (cached) {
    const cachedBuffer = await readExportArtifact({
      provider: cached.storageProvider,
      key: cached.storageKey,
    });

    if (cachedBuffer) {
      return {
        buffer: cachedBuffer,
        contentType: cached.contentType,
        extension: cached.extension,
      };
    }

    // Cache metadata may outlive file cleanup windows; fall through and re-render.
  }

  const rendered = await exportResumeSnapshot(snapshot, format, renderHtml);

  const directCacheExpiresAt = new Date(Date.now() + 120_000);
  const pointer = await storeExportArtifact({
    jobId: `direct-${payloadHash.slice(0, 12)}`,
    purpose: "direct-cache",
    extension: rendered.extension,
    contentType: rendered.contentType,
    buffer: rendered.buffer,
    expiresAt: directCacheExpiresAt,
  });

  const artifactToCache: CachedArtifact = {
    storageProvider: pointer.provider,
    storageKey: pointer.key,
    sizeBytes: pointer.sizeBytes,
    contentType: rendered.contentType,
    extension: rendered.extension,
  };

  await cacheSet(cacheKey, artifactToCache, 120);

  return rendered;
}

/**
 * Queue an export job for authenticated user
 */

async function createResumeExportJobController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireAuthUser(req);
    const { resumeId } = req.params;

    if (!resumeId) throw new ApiError(400, "Resume ID is required");

    const body = resumeExportSchema.parse(req.body);
    const snapshot = body.snapshot as ResumeSnapshot;
    const fileNameBase =
      (snapshot.basics?.fullName && String(snapshot.basics.fullName)) || "resume";

    const job = await enqueueUserExportJob({
      userId: user.id,
      resumeId,
      snapshot,
      format: body.format as ExportFormat,
      fileNameBase,
      renderHtml: body.renderHtml,
    });

    res.status(202).json(
      createSuccessResponse(
        {
          jobId: job.id,
          status: job.status,
          statusPath: `exports/jobs/${job.id}`,
          downloadPath: `exports/jobs/${job.id}/download`,
        },
        "Export job queued",
      ),
    );
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));
    next(error);
  }
}

async function getResumeExportJobStatusController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireAuthUser(req);
    const { jobId } = req.params;
    if (!jobId) throw new ApiError(400, "Export job ID is required");

    const status = await getUserExportJobStatus(jobId, user.id);
    res.json(createSuccessResponse(status, "Export job status fetched"));
  } catch (error) {
    next(error);
  }
}

async function downloadResumeExportJobController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireAuthUser(req);
    const { jobId } = req.params;
    if (!jobId) throw new ApiError(400, "Export job ID is required");

    const artifact = await consumeUserExportArtifact(jobId, user.id);
    sendDownload(res, artifact);
  } catch (error) {
    next(error);
  }
}

/**
 * Direct export without queueing (Now protected by Redis caching)
 */

async function exportResumeDirectController(req: Request, res: Response, next: NextFunction) {
  try {
    requireAuthUser(req);
    const { resumeId } = req.params;

    if (!resumeId) throw new ApiError(400, "Resume ID is required");

    const body = resumeExportSchema.parse(req.body);
    const snapshot = body.snapshot as ResumeSnapshot;
    const format = body.format as ExportFormat;

    const rendered = await getOrRenderDirectExport(snapshot, format, body.renderHtml);

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

/**
 * Queue an export job for public share link
 */

async function createPublicShareExportJobController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.params;
    if (!token) throw new ApiError(400, "Share token is required");

    const body = publicShareExportSchema.parse(req.body);

    const cacheKey = `share:public:${token}`;
    let shareLink: ResumeShareLink | null = await cacheGet<ResumeShareLink>(cacheKey);

    if (!shareLink) {
      shareLink = await prisma.resumeShareLink.findUnique({ where: { token } });
      if (!shareLink) throw new ApiError(404, "Shared resume not found");
      await cacheSet(cacheKey, shareLink, 3600); // Cache for 1 hour
    }

    if (shareLink.expiresAt && new Date(shareLink.expiresAt).getTime() <= Date.now()) {
      throw new ApiError(410, "Shared resume has expired");
    }

    if (shareLink.passwordHash) {
      await assertValidSharePassword(shareLink.passwordHash, body.password);
    }

    const job = await enqueuePublicShareExportJob({
      shareToken: token,
      snapshot: shareLink.snapshot as ResumeSnapshot,
      format: body.format as ExportFormat,
      fileNameBase: shareLink.resumeTitle,
      renderHtml: body.renderHtml,
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

async function getPublicShareExportJobStatusController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token, jobId } = req.params;
    if (!token || !jobId) throw new ApiError(400, "Share token and export job ID are required");

    const status = await getPublicShareExportJobStatus(jobId, token);
    res.json(createSuccessResponse(status, "Shared export job status fetched"));
  } catch (error) {
    next(error);
  }
}

async function downloadPublicShareExportJobController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token, jobId } = req.params;
    if (!token || !jobId) throw new ApiError(400, "Share token and export job ID are required");

    const artifact = await consumePublicShareExportArtifact(jobId, token);
    sendDownload(res, artifact);
  } catch (error) {
    next(error);
  }
}

/**
 * Direct export for public share link (Protected by Cache & Idempotency)
 */

async function exportPublicShareDirectController(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.params;
    if (!token) throw new ApiError(400, "Share token is required");

    const parsedQuery = publicShareExportSchema.parse(req.query);

    const cacheKey = `share:public:${token}`;
    let shareLink: ResumeShareLink | null = await cacheGet<ResumeShareLink>(cacheKey);

    if (!shareLink) {
      shareLink = await prisma.resumeShareLink.findUnique({ where: { token } });
      if (!shareLink) throw new ApiError(404, "Shared resume not found");
      await cacheSet(cacheKey, shareLink, 3600);
    }

    if (shareLink.expiresAt && new Date(shareLink.expiresAt).getTime() <= Date.now()) {
      throw new ApiError(410, "Shared resume has expired");
    }

    if (shareLink.passwordHash) {
      await assertValidSharePassword(shareLink.passwordHash, parsedQuery.password);
    }

    const snapshot = shareLink.snapshot as ResumeSnapshot;
    const format = parsedQuery.format as ExportFormat;

    const rendered = await getOrRenderDirectExport(snapshot, format, parsedQuery.renderHtml);

    const fileName = buildExportFileName(shareLink.resumeTitle, rendered.extension);

    res.setHeader("Content-Type", rendered.contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(rendered.buffer);
  } catch (error) {
    if (error instanceof z.ZodError) return next(handleValidationError(error));
    next(error);
  }
}

export {
  exportResumeDirectController,
  createResumeExportJobController,
  downloadResumeExportJobController,
  exportPublicShareDirectController,
  getResumeExportJobStatusController,
  createPublicShareExportJobController,
  getPublicShareExportJobStatusController,
  downloadPublicShareExportJobController,
};
