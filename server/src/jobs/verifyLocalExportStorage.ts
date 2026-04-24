import { randomUUID } from "node:crypto";

import { config } from "#config";

import { closeRedis, getRedis, initRedis } from "#utils/redis";

import {
  closeExportArtifactStore,
  initExportArtifactStore,
  readExportArtifact,
  storeExportArtifact,
} from "#services/exportArtifactStore";

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function assertOptionalHealthEndpoint() {
  const baseUrl = (process.env.VERIFY_API_BASE_URL || "").trim();

  if (!baseUrl) {
    return;
  }

  const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/api/v1/health`);

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  console.log(`Health check ok: ${baseUrl}/api/v1/health`);
}

async function run() {
  if (config.exportArtifacts.provider !== "local") {
    throw new Error(
      `This verifier is for local provider only. Current provider: ${config.exportArtifacts.provider}`,
    );
  }

  await initRedis();
  await initExportArtifactStore();

  const verificationId = randomUUID();
  const payload = Buffer.from(`veriworkly-export-verify-${verificationId}`, "utf-8");

  const pointer = await storeExportArtifact({
    jobId: `verify-${verificationId}`,
    purpose: "job-result",
    extension: "pdf",
    contentType: "application/pdf",
    buffer: payload,
    expiresAt: new Date(Date.now() + 1_500),
  });

  const redis = getRedis();
  const redisKey = `verify:local-export:${verificationId}`;

  await redis.setEx(
    redisKey,
    30,
    JSON.stringify({
      provider: pointer.provider,
      key: pointer.key,
      sizeBytes: pointer.sizeBytes,
    }),
  );

  const immediate = await readExportArtifact({
    provider: pointer.provider,
    key: pointer.key,
  });

  if (!immediate || !immediate.equals(payload)) {
    throw new Error("Immediate artifact read failed");
  }

  const metadata = await redis.get(redisKey);

  if (!metadata) {
    throw new Error("Redis metadata pointer check failed");
  }

  await sleep(1_700);

  const expired = await readExportArtifact({
    provider: pointer.provider,
    key: pointer.key,
  });

  if (expired !== null) {
    throw new Error("Expired artifact should not be readable");
  }

  await redis.del(redisKey);

  await assertOptionalHealthEndpoint();

  console.log("Local export storage verification passed");
}

run()
  .catch((error) => {
    console.error("Local export storage verification failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeExportArtifactStore();
    await closeRedis();
  });
