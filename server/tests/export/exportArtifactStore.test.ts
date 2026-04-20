import { describe, expect, it } from "vitest";

import { config } from "#config";
import {
  readExportArtifact,
  storeExportArtifact,
  type StoredArtifactPointer,
} from "#services/exportArtifactStore";

describe("exportArtifactStore (local provider)", () => {
  const runIfLocal = config.exportArtifacts.provider === "local" ? it : it.skip;

  runIfLocal("stores and reads binary artifact via pointer", async () => {
    const payload = Buffer.from("resume-artifact-test", "utf-8");

    const pointer: StoredArtifactPointer = await storeExportArtifact({
      jobId: "test-job-read",
      purpose: "job-result",
      extension: "pdf",
      contentType: "application/pdf",
      buffer: payload,
      expiresAt: new Date(Date.now() + 60_000),
    });

    const readBack = await readExportArtifact({
      provider: pointer.provider,
      key: pointer.key,
    });

    expect(readBack).not.toBeNull();
    expect(readBack?.equals(payload)).toBe(true);
  });

  runIfLocal("returns null for expired artifact pointer", async () => {
    const pointer = await storeExportArtifact({
      jobId: "test-job-expired",
      purpose: "job-result",
      extension: "pdf",
      contentType: "application/pdf",
      buffer: Buffer.from("expired", "utf-8"),
      expiresAt: new Date(Date.now() - 1_000),
    });

    const expiredRead = await readExportArtifact({
      provider: pointer.provider,
      key: pointer.key,
    });

    expect(expiredRead).toBeNull();
  });
});
