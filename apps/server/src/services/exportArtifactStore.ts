import { randomUUID } from "node:crypto";
import { dirname, join } from "node:path";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { config } from "#config";

import { logger } from "#utils/logger";

type ArtifactPurpose = "job-result" | "render-cache" | "direct-cache";

type ArtifactProvider = "local" | "oci";

type StoredArtifactPointer = {
  provider: ArtifactProvider;
  key: string;
  sizeBytes: number;
};

type StoreArtifactInput = {
  jobId: string;
  purpose: ArtifactPurpose;
  extension: string;
  contentType: string;
  buffer: Buffer;
  expiresAt: Date;
};

let cleanupTimer: ReturnType<typeof setInterval> | null = null;
let ociClient: S3Client | null = null;

function getProvider(): ArtifactProvider {
  const configuredProvider = config.exportArtifacts.provider;

  if (configuredProvider === "local" || configuredProvider === "oci") {
    return configuredProvider;
  }

  logger.warn(
    `Unknown EXPORT_ARTIFACT_PROVIDER '${configuredProvider}'. Falling back to local storage.`,
  );

  return "local";
}

function getLocalArtifactsRoot() {
  return join(process.cwd(), config.exportArtifacts.localDir);
}

function buildArtifactKey(input: {
  purpose: ArtifactPurpose;
  jobId: string;
  extension: string;
  expiresAtMs: number;
}) {
  const normalizedExtension = input.extension.replace(/[^a-z0-9]/gi, "").toLowerCase() || "bin";
  const compactPurpose = input.purpose.replace(/[^a-z-]/gi, "").toLowerCase();

  return `${compactPurpose}/${input.expiresAtMs}_${input.jobId}_${randomUUID()}.${normalizedExtension}`;
}

async function ensureLocalDirectoryExists() {
  await mkdir(getLocalArtifactsRoot(), { recursive: true });
}

function toLocalPathFromKey(storageKey: string) {
  return join(getLocalArtifactsRoot(), storageKey);
}

function extractExpiresAtMsFromStorageKey(storageKey: string) {
  const fileName = storageKey.split("/").pop() || "";
  const match = fileName.match(/^(\d+)_/);

  if (!match) {
    return null;
  }

  const expiresAtMs = Number.parseInt(match[1], 10);
  return Number.isFinite(expiresAtMs) ? expiresAtMs : null;
}

async function runLocalCleanup() {
  const artifactsRoot = getLocalArtifactsRoot();

  const walk = async (directory: string): Promise<void> => {
    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const absolutePath = join(directory, entry.name);

      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }

      const match = entry.name.match(/^(\d+)_/);

      if (!match) {
        continue;
      }

      const expiresAtMs = Number.parseInt(match[1], 10);

      if (!Number.isFinite(expiresAtMs)) {
        continue;
      }

      const shouldDelete =
        Date.now() > expiresAtMs + Math.max(0, config.exportArtifacts.localCleanupGraceMs);

      if (!shouldDelete) {
        continue;
      }

      await rm(absolutePath, { force: true });
    }
  };

  try {
    await walk(artifactsRoot);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return;
    }

    logger.warn("Local export artifact cleanup encountered an issue", error);
  }
}

function getOciClient() {
  if (ociClient) {
    return ociClient;
  }

  const { endpoint, region, accessKeyId, secretAccessKey, forcePathStyle } =
    config.exportArtifacts.oci;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "OCI artifact storage is enabled but required credentials or endpoint are missing.",
    );
  }

  ociClient = new S3Client({
    endpoint,
    region,
    forcePathStyle,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return ociClient;
}

function getOciObjectKey(storageKey: string) {
  const trimmedPrefix = config.exportArtifacts.oci.keyPrefix.replace(/^\/+|\/+$/g, "");

  if (!trimmedPrefix) {
    return storageKey;
  }

  return `${trimmedPrefix}/${storageKey}`;
}

export async function initExportArtifactStore() {
  const provider = getProvider();

  if (provider !== "local") {
    return;
  }

  await ensureLocalDirectoryExists();
  await runLocalCleanup();

  if (cleanupTimer) {
    return;
  }

  cleanupTimer = setInterval(
    () => {
      void runLocalCleanup();
    },
    Math.max(60_000, config.exportArtifacts.localCleanupIntervalMs),
  );

  cleanupTimer.unref?.();
}

export async function closeExportArtifactStore() {
  if (cleanupTimer) {
    clearInterval(cleanupTimer);
    cleanupTimer = null;
  }

  if (ociClient) {
    ociClient.destroy();
    ociClient = null;
  }
}

export async function storeExportArtifact(
  input: StoreArtifactInput,
): Promise<StoredArtifactPointer> {
  const provider = getProvider();
  const expiresAtMs = input.expiresAt.getTime();

  const storageKey = buildArtifactKey({
    purpose: input.purpose,
    jobId: input.jobId,
    extension: input.extension,
    expiresAtMs,
  });

  if (provider === "local") {
    const absolutePath = toLocalPathFromKey(storageKey);

    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, input.buffer);

    return {
      provider,
      key: storageKey,
      sizeBytes: input.buffer.byteLength,
    };
  }

  const client = getOciClient();
  const bucket = config.exportArtifacts.oci.bucket;

  if (!bucket) {
    throw new Error("OCI artifact storage is enabled but EXPORT_ARTIFACT_OCI_BUCKET is not set.");
  }

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: getOciObjectKey(storageKey),
      Body: input.buffer,
      ContentType: input.contentType,
      Metadata: {
        expiresat: input.expiresAt.toISOString(),
        purpose: input.purpose,
      },
    }),
  );

  return {
    provider,
    key: storageKey,
    sizeBytes: input.buffer.byteLength,
  };
}

export async function readExportArtifact(pointer: {
  provider: ArtifactProvider;
  key: string;
}): Promise<Buffer | null> {
  const expiresAtMs = extractExpiresAtMsFromStorageKey(pointer.key);

  if (expiresAtMs && Date.now() > expiresAtMs) {
    await deleteExportArtifact(pointer);
    return null;
  }

  if (pointer.provider === "local") {
    const absolutePath = toLocalPathFromKey(pointer.key);

    try {
      return await readFile(absolutePath);
    } catch {
      return null;
    }
  }

  const client = getOciClient();
  const bucket = config.exportArtifacts.oci.bucket;

  if (!bucket) {
    return null;
  }

  try {
    const result = await client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: getOciObjectKey(pointer.key),
      }),
    );

    if (!result.Body) {
      return null;
    }

    const bytes = await result.Body.transformToByteArray();
    return Buffer.from(bytes);
  } catch {
    return null;
  }
}

export async function deleteExportArtifact(pointer: { provider: ArtifactProvider; key: string }) {
  if (pointer.provider === "local") {
    const absolutePath = toLocalPathFromKey(pointer.key);
    await rm(absolutePath, { force: true });
    return;
  }

  const bucket = config.exportArtifacts.oci.bucket;

  if (!bucket) {
    return;
  }

  const client = getOciClient();

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: getOciObjectKey(pointer.key),
    }),
  );
}

export type { ArtifactProvider, StoredArtifactPointer };
