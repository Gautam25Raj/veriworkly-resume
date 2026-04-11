import { describe, expect, it } from "vitest";

import { hasMasterProfileConflict } from "../../src/controllers/profileController";

describe("hasMasterProfileConflict contract", () => {
  it("returns false when no expectedUpdatedAt is supplied", () => {
    const result = hasMasterProfileConflict(new Date("2026-04-10T10:00:00.000Z"), undefined);
    expect(result).toBe(false);
  });

  it("returns false when timestamps match", () => {
    const result = hasMasterProfileConflict(
      new Date("2026-04-10T10:00:00.000Z"),
      "2026-04-10T10:00:00.000Z",
    );

    expect(result).toBe(false);
  });

  it("returns true when timestamps differ", () => {
    const result = hasMasterProfileConflict(
      new Date("2026-04-10T10:00:00.000Z"),
      "2026-04-10T10:00:01.000Z",
    );

    expect(result).toBe(true);
  });
});
