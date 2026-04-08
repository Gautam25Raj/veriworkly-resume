import { randomUUID } from "node:crypto";

import {
  type ExportFormat,
  type ResumeSnapshot,
  exportResumeSnapshot,
} from "#services/exportService";

import { ApiError } from "#utils/errors";

type ExportJobStatus = "queued" | "processing" | "completed" | "failed";
type ExportJobOwnerType = "user" | "public-share";

type ExportArtifact = {
  buffer: Buffer;
  contentType: string;
  extension: string;
};

type BaseExportJob = {
  id: string;
  status: ExportJobStatus;
  ownerType: ExportJobOwnerType;
  format: ExportFormat;
  fileNameBase: string;
  createdAt: number;
  startedAt: number | null;
  finishedAt: number | null;
  expiresAt: number;
  errorCode: string | null;
  errorMessage: string | null;
  artifact: ExportArtifact | null;
};

type UserExportJob = BaseExportJob & {
  ownerType: "user";
  userId: string;
  resumeId: string;
  snapshot: ResumeSnapshot;
};

type PublicShareExportJob = BaseExportJob & {
  ownerType: "public-share";
  shareToken: string;
  snapshot: ResumeSnapshot;
};

type ExportJob = UserExportJob | PublicShareExportJob;

type QueueMeta = {
  id: string;
  status: ExportJobStatus;
  createdAt: string;
};

const MAX_CONCURRENT_EXPORTS = 2;
const MAX_QUEUED_EXPORTS = 120;
const EXPORT_TIMEOUT_MS = 45_000;
const EXPORT_RESULT_TTL_MS = 15 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 60_000;

const jobs = new Map<string, ExportJob>();
const queue: string[] = [];
let activeCount = 0;

let cleanupTimer: NodeJS.Timeout | null = null;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new ApiError(504, "Export timed out"));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

function ensureCapacity() {
  if (queue.length + activeCount >= MAX_QUEUED_EXPORTS) {
    throw new ApiError(429, "Export queue is full. Please retry in a moment.");
  }
}

function toMeta(job: ExportJob): QueueMeta {
  return {
    id: job.id,
    status: job.status,
    createdAt: new Date(job.createdAt).toISOString(),
  };
}

function cleanExpiredJobs() {
  const now = Date.now();

  for (const [jobId, job] of jobs.entries()) {
    if (job.status === "queued" || job.status === "processing") {
      continue;
    }

    if (job.expiresAt <= now) {
      jobs.delete(jobId);
    }
  }
}

function ensureCleanupLoopStarted() {
  if (cleanupTimer) {
    return;
  }

  cleanupTimer = setInterval(() => {
    cleanExpiredJobs();
  }, CLEANUP_INTERVAL_MS);
}

async function processJob(jobId: string) {
  const job = jobs.get(jobId);

  if (!job) {
    return;
  }

  job.status = "processing";
  job.startedAt = Date.now();
  job.errorCode = null;
  job.errorMessage = null;

  try {
    const rendered = await withTimeout(
      exportResumeSnapshot(job.snapshot, job.format),
      EXPORT_TIMEOUT_MS,
    );

    job.status = "completed";
    job.finishedAt = Date.now();
    job.artifact = {
      buffer: rendered.buffer,
      contentType: rendered.contentType,
      extension: rendered.extension,
    };

    job.expiresAt = Date.now() + EXPORT_RESULT_TTL_MS;
  } catch (error) {
    job.status = "failed";
    job.finishedAt = Date.now();
    job.artifact = null;
    job.expiresAt = Date.now() + EXPORT_RESULT_TTL_MS;

    job.errorCode = error instanceof ApiError ? `E${error.statusCode}` : "E_EXPORT_FAILED";
    job.errorMessage = error instanceof Error ? error.message : "Could not render export.";
  }
}

function pumpQueue() {
  while (activeCount < MAX_CONCURRENT_EXPORTS && queue.length > 0) {
    const nextJobId = queue.shift();

    if (!nextJobId) {
      break;
    }

    activeCount += 1;

    void processJob(nextJobId).finally(() => {
      activeCount = Math.max(0, activeCount - 1);
      pumpQueue();
    });
  }
}

function createBaseJob(format: ExportFormat, fileNameBase: string): BaseExportJob {
  const now = Date.now();

  return {
    id: randomUUID(),
    status: "queued",
    format,
    fileNameBase,
    ownerType: "user",
    createdAt: now,
    startedAt: null,
    finishedAt: null,
    expiresAt: now + EXPORT_RESULT_TTL_MS,
    errorCode: null,
    errorMessage: null,
    artifact: null,
  };
}

export function enqueueUserExportJob(input: {
  userId: string;
  resumeId: string;
  snapshot: ResumeSnapshot;
  format: ExportFormat;
  fileNameBase: string;
}) {
  ensureCapacity();
  ensureCleanupLoopStarted();

  const base = createBaseJob(input.format, input.fileNameBase);
  const job: UserExportJob = {
    ...base,
    ownerType: "user",
    userId: input.userId,
    resumeId: input.resumeId,
    snapshot: input.snapshot,
  };

  jobs.set(job.id, job);
  queue.push(job.id);
  pumpQueue();

  return toMeta(job);
}

export function enqueuePublicShareExportJob(input: {
  shareToken: string;
  snapshot: ResumeSnapshot;
  format: ExportFormat;
  fileNameBase: string;
}) {
  ensureCapacity();
  ensureCleanupLoopStarted();

  const base = createBaseJob(input.format, input.fileNameBase);
  const job: PublicShareExportJob = {
    ...base,
    ownerType: "public-share",
    shareToken: input.shareToken,
    snapshot: input.snapshot,
  };

  jobs.set(job.id, job);
  queue.push(job.id);
  pumpQueue();

  return toMeta(job);
}

function getJobOrThrow(jobId: string) {
  const job = jobs.get(jobId);

  if (!job) {
    throw new ApiError(404, "Export job not found");
  }

  if (job.expiresAt <= Date.now()) {
    jobs.delete(jobId);
    throw new ApiError(410, "Export job expired");
  }

  return job;
}

export function getUserExportJobStatus(jobId: string, userId: string) {
  const job = getJobOrThrow(jobId);

  if (job.ownerType !== "user" || job.userId !== userId) {
    throw new ApiError(404, "Export job not found");
  }

  return {
    id: job.id,
    status: job.status,
    createdAt: new Date(job.createdAt).toISOString(),
    startedAt: job.startedAt ? new Date(job.startedAt).toISOString() : null,
    finishedAt: job.finishedAt ? new Date(job.finishedAt).toISOString() : null,
    errorCode: job.errorCode,
    errorMessage: job.errorMessage,
    ready: job.status === "completed" && Boolean(job.artifact),
    expiresAt: new Date(job.expiresAt).toISOString(),
  };
}

export function getPublicShareExportJobStatus(jobId: string, shareToken: string) {
  const job = getJobOrThrow(jobId);

  if (job.ownerType !== "public-share" || job.shareToken !== shareToken) {
    throw new ApiError(404, "Export job not found");
  }

  return {
    id: job.id,
    status: job.status,
    createdAt: new Date(job.createdAt).toISOString(),
    startedAt: job.startedAt ? new Date(job.startedAt).toISOString() : null,
    finishedAt: job.finishedAt ? new Date(job.finishedAt).toISOString() : null,
    errorCode: job.errorCode,
    errorMessage: job.errorMessage,
    ready: job.status === "completed" && Boolean(job.artifact),
    expiresAt: new Date(job.expiresAt).toISOString(),
  };
}

export function consumeUserExportArtifact(jobId: string, userId: string) {
  const job = getJobOrThrow(jobId);

  if (job.ownerType !== "user" || job.userId !== userId) {
    throw new ApiError(404, "Export job not found");
  }

  if (job.status !== "completed" || !job.artifact) {
    throw new ApiError(409, "Export job is not ready for download");
  }

  return {
    fileNameBase: job.fileNameBase,
    ...job.artifact,
  };
}

export function consumePublicShareExportArtifact(jobId: string, shareToken: string) {
  const job = getJobOrThrow(jobId);

  if (job.ownerType !== "public-share" || job.shareToken !== shareToken) {
    throw new ApiError(404, "Export job not found");
  }

  if (job.status !== "completed" || !job.artifact) {
    throw new ApiError(409, "Export job is not ready for download");
  }

  return {
    fileNameBase: job.fileNameBase,
    ...job.artifact,
  };
}

export function stopExportQueueCleanup() {
  if (!cleanupTimer) {
    return;
  }

  clearInterval(cleanupTimer);
  cleanupTimer = null;
}
