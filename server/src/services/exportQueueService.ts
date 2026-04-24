import IORedis from "ioredis";
import { createHash } from "node:crypto";
import { Queue, Worker, type Job } from "bullmq";

import { config } from "#config";

import { getRedis } from "#utils/redis";
import { ApiError } from "#utils/errors";

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
  storageProvider: ArtifactProvider;
  storageKey: string;
  sizeBytes: number;
  expiresAt: string;
  bufferBase64?: string;
};

const EXPORT_JOB_NAME = "render-export";
const JOB_RETENTION_SECONDS = Math.ceil(config.exportQueue.resultTtlMs / 1000);

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
          storageProvider: ArtifactProvider;
          storageKey: string;
          contentType: string;
          extension: string;
          sizeBytes: number;
        };

        const cachedBuffer = await readExportArtifact({
          provider: cachedRendered.storageProvider,
          key: cachedRendered.storageKey,
        });

        if (cachedBuffer) {
          rendered = {
            buffer: cachedBuffer,
            contentType: cachedRendered.contentType,
            extension: cachedRendered.extension,
          };
        } else {
          rendered = await withTimeout(
            exportResumeSnapshot(job.data.snapshot, job.data.format, job.data.renderHtml),
            config.exportQueue.timeoutMs,
          );

          const renderCacheExpiresAt = new Date(Date.now() + config.exportQueue.renderCacheTtlMs);
          const renderCachePointer = await storeExportArtifact({
            jobId: job.id!,
            purpose: "render-cache",
            extension: rendered.extension,
            contentType: rendered.contentType,
            buffer: rendered.buffer,
            expiresAt: renderCacheExpiresAt,
          });

          await redis.setEx(
            renderCacheKey,
            Math.ceil(config.exportQueue.renderCacheTtlMs / 1000),
            JSON.stringify({
              storageProvider: renderCachePointer.provider,
              storageKey: renderCachePointer.key,
              sizeBytes: renderCachePointer.sizeBytes,
              contentType: rendered.contentType,
              extension: rendered.extension,
            }),
          );
        }
      } else {
        rendered = await withTimeout(
          exportResumeSnapshot(job.data.snapshot, job.data.format, job.data.renderHtml),
          config.exportQueue.timeoutMs,
        );

        const renderCacheExpiresAt = new Date(Date.now() + config.exportQueue.renderCacheTtlMs);
        const renderCachePointer = await storeExportArtifact({
          jobId: job.id!,
          purpose: "render-cache",
          extension: rendered.extension,
          contentType: rendered.contentType,
          buffer: rendered.buffer,
          expiresAt: renderCacheExpiresAt,
        });

        await redis.setEx(
          renderCacheKey,
          Math.ceil(config.exportQueue.renderCacheTtlMs / 1000),
          JSON.stringify({
            storageProvider: renderCachePointer.provider,
            storageKey: renderCachePointer.key,
            sizeBytes: renderCachePointer.sizeBytes,
            contentType: rendered.contentType,
            extension: rendered.extension,
          }),
        );
      }

      const expiresAt = new Date(Date.now() + config.exportQueue.resultTtlMs);

      const resultPointer = await storeExportArtifact({
        jobId: job.id!,
        purpose: "job-result",
        extension: rendered.extension,
        contentType: rendered.contentType,
        buffer: rendered.buffer,
        expiresAt,
      });

      const artifact: StoredArtifact = {
        ownerType: job.data.ownerType,
        fileNameBase: job.data.fileNameBase,
        contentType: rendered.contentType,
        extension: rendered.extension,
        storageProvider: resultPointer.provider,
        storageKey: resultPointer.key,
        sizeBytes: resultPointer.sizeBytes,
        expiresAt: expiresAt.toISOString(),
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
        age: JOB_RETENTION_SECONDS,
        count: 5000,
      },
      removeOnFail: {
        age: JOB_RETENTION_SECONDS,
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
        age: JOB_RETENTION_SECONDS,
        count: 5000,
      },
      removeOnFail: {
        age: JOB_RETENTION_SECONDS,
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

  const buffer = artifact.bufferBase64
    ? Buffer.from(artifact.bufferBase64, "base64")
    : await readExportArtifact({
        provider: artifact.storageProvider,
        key: artifact.storageKey,
      });

  if (!buffer) {
    await getRedis().del(getArtifactKey(jobId));
    throw new ApiError(409, "Export artifact is unavailable. Please re-export.");
  }

  return {
    fileNameBase: artifact.fileNameBase,
    contentType: artifact.contentType,
    extension: artifact.extension,
    buffer,
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

  const buffer = artifact.bufferBase64
    ? Buffer.from(artifact.bufferBase64, "base64")
    : await readExportArtifact({
        provider: artifact.storageProvider,
        key: artifact.storageKey,
      });

  if (!buffer) {
    await getRedis().del(getArtifactKey(jobId));
    throw new ApiError(409, "Export artifact is unavailable. Please re-export.");
  }

  return {
    fileNameBase: artifact.fileNameBase,
    contentType: artifact.contentType,
    extension: artifact.extension,
    buffer,
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
