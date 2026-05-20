import { describe, expect, it } from "vitest";

import { config } from "@/proxy";

describe("studio proxy contract", () => {
  it("protects API key management routes", () => {
    expect(config.matcher).toContain("/api-keys");
    expect(config.matcher).toContain("/api-keys/:path*");
  });
});
