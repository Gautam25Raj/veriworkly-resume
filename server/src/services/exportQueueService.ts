import { Queue, Worker, type Job } from "bullmq";
import IORedis from "ioredis";
import { createHash } from "node:crypto";

import { config } from "#config";

import { ApiError } from "#utils/errors";
import { getRedis } from "#utils/redis";

import {
  type ExportFormat,
  type ResumeSnapshot,
  exportResumeSnapshot,
} from "#services/exportService";

type ExportJobStatus = "queued" | "processing" | "completed" | "failed";

type ExportJobOwnerType = "user" | "public-share";

type QueueMeta = {
  id: string;
  status: ExportJobStatus;
  createdAt: string;
};

type ExportJobData =
  | {
      ownerType: "user";
      userId: string;
      resumeId: string;
      snapshot: ResumeSnapshot;
      format: ExportFormat;
      fileNameBase: string;
      renderHtml?: string;
    }
  | {
      ownerType: "public-share";
      shareToken: string;
      snapshot: ResumeSnapshot;
      format: ExportFormat;
      fileNameBase: string;
      renderHtml?: string;
    };

type StoredArtifact = {
  ownerType: ExportJobOwnerType;
  userId?: string;
  shareToken?: string;
  fileNameBase: string;
  contentType: string;
  extension: string;
  bufferBase64: string;
  expiresAt: string;
};

const EXPORT_JOB_NAME = "render-export";

let queue: Queue<ExportJobData> | null = null;
let worker: Worker<ExportJobData> | null = null;
let redisConnection: IORedis | null = null;

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

function getArtifactKey(jobId: string) {
  return `${config.exportQueue.artifactPrefix}${jobId}`;
}

function getRenderCacheKey(snapshot: ResumeSnapshot, format: ExportFormat, renderHtml?: string) {
  const payloadHash = createHash("sha256").update(JSON.stringify(snapshot)).digest("hex");
  const htmlHash = renderHtml ? createHash("sha256").update(renderHtml).digest("hex") : "no-html";

  return `${config.exportQueue.artifactPrefix}render:${format}:${payloadHash}:${htmlHash}`;
}

function getBullRedisConnection() {
  if (redisConnection) {
    return redisConnection;
  }

  redisConnection = new IORedis(config.redis.url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  return redisConnection;
}

function getExportQueue() {
  if (queue) {
    return queue;
  }

  queue = new Queue<ExportJobData>(config.exportQueue.name, {
    connection: getBullRedisConnection(),
  });

  return queue;
}

function toQueueStatus(state: string): ExportJobStatus {
  if (state === "active") {
    return "processing";
  }

  if (state === "completed") {
    return "completed";
  }

  if (state === "failed") {
    return "failed";
  }

  return "queued";
}

async function ensureWorkerStarted() {
  if (!config.exportQueue.enableWorker) {
    return;
  }

  if (worker) {
    return;
  }

  worker = new Worker<ExportJobData>(
    config.exportQueue.name,
    async (job) => {
      const redis = getRedis();
      const renderCacheKey = getRenderCacheKey(
        job.data.snapshot,
        job.data.format,
        job.data.renderHtml,
      );
      const cachedRenderedRaw = await redis.get(renderCacheKey);

      let rendered: Awaited<ReturnType<typeof exportResumeSnapshot>>;

      if (cachedRenderedRaw) {
        const cachedRendered = JSON.parse(cachedRenderedRaw) as {
          contentType: string;
          extension: string;
          bufferBase64: string;
        };

        rendered = {
          buffer: Buffer.from(cachedRendered.bufferBase64, "base64"),
          contentType: cachedRendered.contentType,
          extension: cachedRendered.extension,
        };
      } else {
        rendered = await withTimeout(
          exportResumeSnapshot(job.data.snapshot, job.data.format, job.data.renderHtml),
          config.exportQueue.timeoutMs,
        );

        await redis.setEx(
          renderCacheKey,
          Math.ceil(config.exportQueue.renderCacheTtlMs / 1000),
          JSON.stringify({
            contentType: rendered.contentType,
            extension: rendered.extension,
            bufferBase64: rendered.buffer.toString("base64"),
          }),
        );
      }

      const expiresAtMs = Date.now() + config.exportQueue.resultTtlMs;

      const artifact: StoredArtifact = {
        ownerType: job.data.ownerType,
        fileNameBase: job.data.fileNameBase,
        contentType: rendered.contentType,
        extension: rendered.extension,
        bufferBase64: rendered.buffer.toString("base64"),
        expiresAt: new Date(expiresAtMs).toISOString(),
        ...(job.data.ownerType === "user"
          ? {
              userId: job.data.userId,
            }
          : {
              shareToken: job.data.shareToken,
            }),
      };

      await redis.setEx(
        getArtifactKey(job.id!),
        Math.ceil(config.exportQueue.resultTtlMs / 1000),
        JSON.stringify(artifact),
      );

      return true;
    },
    {
      connection: getBullRedisConnection(),
      concurrency: config.exportQueue.maxConcurrentExports,
    },
  );
}

export async function startExportQueueWorker() {
  await ensureWorkerStarted();
}

async function ensureCapacity() {
  const exportQueue = getExportQueue();
  const counts = await exportQueue.getJobCounts("waiting", "active", "delayed", "paused");
  const queued =
    (counts.waiting ?? 0) + (counts.active ?? 0) + (counts.delayed ?? 0) + (counts.paused ?? 0);

  if (queued >= config.exportQueue.maxQueuedExports) {
    throw new ApiError(429, "Export queue is full. Please retry in a moment.");
  }
}

async function getJobOrThrow(jobId: string) {
  const exportQueue = getExportQueue();
  const job = await exportQueue.getJob(jobId);

  if (!job) {
    throw new ApiError(404, "Export job not found");
  }

  return job;
}

async function getArtifact(jobId: string) {
  const redis = getRedis();
  const raw = await redis.get(getArtifactKey(jobId));

  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as StoredArtifact;
}

async function toStatusPayload(job: Job<ExportJobData>) {
  const state = await job.getState();
  const artifact = await getArtifact(job.id!);

  return {
    id: job.id!,
    status: toQueueStatus(state),
    createdAt: new Date(job.timestamp).toISOString(),
    startedAt: job.processedOn ? new Date(job.processedOn).toISOString() : null,
    finishedAt: job.finishedOn ? new Date(job.finishedOn).toISOString() : null,
    errorCode: state === "failed" ? "E_EXPORT_FAILED" : null,
    errorMessage: state === "failed" ? (job.failedReason ?? "Could not render export.") : null,
    ready: state === "completed" && Boolean(artifact),
    expiresAt:
      artifact?.expiresAt ?? new Date(job.timestamp + config.exportQueue.resultTtlMs).toISOString(),
  };
}

export async function enqueueUserExportJob(input: {
  userId: string;
  resumeId: string;
  snapshot: ResumeSnapshot;
  format: ExportFormat;
  fileNameBase: string;
  renderHtml?: string;
}): Promise<QueueMeta> {
  await ensureWorkerStarted();
  await ensureCapacity();

  const exportQueue = getExportQueue();
  const job = await exportQueue.add(
    EXPORT_JOB_NAME,
    {
      ownerType: "user",
      userId: input.userId,
      resumeId: input.resumeId,
      snapshot: input.snapshot,
      format: input.format,
      fileNameBase: input.fileNameBase,
      renderHtml: input.renderHtml,
    },
    {
      removeOnComplete: {
        age: Math.ceil((config.exportQueue.resultTtlMs * 2) / 1000),
        count: 5000,
      },
      removeOnFail: {
        age: Math.ceil((config.exportQueue.resultTtlMs * 2) / 1000),
        count: 5000,
      },
    },
  );

  return {
    id: job.id!,
    status: "queued",
    createdAt: new Date(job.timestamp).toISOString(),
  };
}

export async function enqueuePublicShareExportJob(input: {
  shareToken: string;
  snapshot: ResumeSnapshot;
  format: ExportFormat;
  fileNameBase: string;
  renderHtml?: string;
}): Promise<QueueMeta> {
  await ensureWorkerStarted();
  await ensureCapacity();

  const exportQueue = getExportQueue();
  const job = await exportQueue.add(
    EXPORT_JOB_NAME,
    {
      ownerType: "public-share",
      shareToken: input.shareToken,
      snapshot: input.snapshot,
      format: input.format,
      fileNameBase: input.fileNameBase,
      renderHtml: input.renderHtml,
    },
    {
      removeOnComplete: {
        age: Math.ceil((config.exportQueue.resultTtlMs * 2) / 1000),
        count: 5000,
      },
      removeOnFail: {
        age: Math.ceil((config.exportQueue.resultTtlMs * 2) / 1000),
        count: 5000,
      },
    },
  );

  return {
    id: job.id!,
    status: "queued",
    createdAt: new Date(job.timestamp).toISOString(),
  };
}

export async function getUserExportJobStatus(jobId: string, userId: string) {
  const job = await getJobOrThrow(jobId);

  if (job.data.ownerType !== "user" || job.data.userId !== userId) {
    throw new ApiError(404, "Export job not found");
  }

  return toStatusPayload(job);
}

export async function getPublicShareExportJobStatus(jobId: string, shareToken: string) {
  const job = await getJobOrThrow(jobId);

  if (job.data.ownerType !== "public-share" || job.data.shareToken !== shareToken) {
    throw new ApiError(404, "Export job not found");
  }

  return toStatusPayload(job);
}

export async function consumeUserExportArtifact(jobId: string, userId: string) {
  const job = await getJobOrThrow(jobId);
  const state = await job.getState();
  const artifact = await getArtifact(jobId);

  if (job.data.ownerType !== "user" || job.data.userId !== userId) {
    throw new ApiError(404, "Export job not found");
  }

  if (state !== "completed" || !artifact) {
    throw new ApiError(409, "Export job is not ready for download");
  }

  return {
    fileNameBase: artifact.fileNameBase,
    contentType: artifact.contentType,
    extension: artifact.extension,
    buffer: Buffer.from(artifact.bufferBase64, "base64"),
  };
}

export async function consumePublicShareExportArtifact(jobId: string, shareToken: string) {
  const job = await getJobOrThrow(jobId);
  const state = await job.getState();
  const artifact = await getArtifact(jobId);

  if (job.data.ownerType !== "public-share" || job.data.shareToken !== shareToken) {
    throw new ApiError(404, "Export job not found");
  }

  if (state !== "completed" || !artifact) {
    throw new ApiError(409, "Export job is not ready for download");
  }

  return {
    fileNameBase: artifact.fileNameBase,
    contentType: artifact.contentType,
    extension: artifact.extension,
    buffer: Buffer.from(artifact.bufferBase64, "base64"),
  };
}

export async function stopExportQueueCleanup() {
  if (worker) {
    await worker.close();
    worker = null;
  }

  if (queue) {
    await queue.close();
    queue = null;
  }

  if (redisConnection) {
    await redisConnection.quit();
    redisConnection = null;
  }
}
