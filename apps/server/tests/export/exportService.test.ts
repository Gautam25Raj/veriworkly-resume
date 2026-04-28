import { describe, expect, it } from "vitest";

import { closeExportBrowser } from "#services/exportService";

describe("exportService", () => {
  it("closes browser safely when no browser was started", async () => {
    await expect(closeExportBrowser()).resolves.toBeUndefined();
    await expect(closeExportBrowser()).resolves.toBeUndefined();
  });
});
