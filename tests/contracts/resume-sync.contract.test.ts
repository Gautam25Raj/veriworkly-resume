import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ResumeData } from "@/types/resume";

import { defaultResume } from "@/features/resume/constants/default-resume";
import { setAllResumesSyncEnabled } from "@/features/resume/services/resume-core";

const state = {
  byId: new Map<string, ResumeData>(),
  activeId: defaultResume.id,
};

function cloneResume(input: ResumeData): ResumeData {
  return JSON.parse(JSON.stringify(input)) as ResumeData;
}

vi.mock("@/features/resume/services/local-storage", () => {
  return {
    saveResumeToLocalStorage: vi.fn((resume: ResumeData) => {
      state.byId.set(resume.id, cloneResume(resume));
      state.activeId = resume.id;
      return { ok: true, queued: false };
    }),
    loadResumeFromLocalStorage: vi.fn(() => {
      return state.byId.get(state.activeId) ?? null;
    }),
    clearResumeFromLocalStorage: vi.fn(() => {
      state.byId.clear();
    }),
    listResumesFromLocalStorage: vi.fn(() => {
      return Array.from(state.byId.values()).map((resume) =>
        cloneResume(resume),
      );
    }),
    deleteResumeFromLocalStorage: vi.fn((resumeId: string) => {
      state.byId.delete(resumeId);
      const next = Array.from(state.byId.keys())[0] ?? null;
      state.activeId = next ?? "";
      return next;
    }),
    loadResumeByIdFromLocalStorage: vi.fn((resumeId: string) => {
      return state.byId.get(resumeId) ?? null;
    }),
    setActiveResumeIdInLocalStorage: vi.fn((resumeId: string) => {
      state.activeId = resumeId;
    }),
  };
});

vi.mock("@/features/resume/services/workspace-settings", () => ({
  loadWorkspaceSettingsFromLocalStorage: vi.fn(() => ({
    autoSyncEnabled: false,
  })),
}));

vi.mock("@/features/resume/services/master-profile", () => ({
  deriveResumeFromMasterProfile: vi.fn((id: string) => ({
    ...cloneResume(defaultResume),
    id,
  })),
}));

describe("resume sync contract", () => {
  beforeEach(() => {
    state.byId.clear();

    const first = cloneResume(defaultResume);
    const second = cloneResume(defaultResume);

    first.id = "resume-1";
    second.id = "resume-2";

    state.byId.set(first.id, first);
    state.byId.set(second.id, second);
    state.activeId = first.id;
  });

  it("enables sync for all saved resumes", () => {
    const result = setAllResumesSyncEnabled(true);

    expect(result.ok).toBe(true);

    const items = Array.from(state.byId.values());

    expect(items.every((resume) => resume.sync.enabled)).toBe(true);
    expect(items.every((resume) => resume.sync.status === "pending")).toBe(
      true,
    );
  });

  it("disables sync for all saved resumes", () => {
    const result = setAllResumesSyncEnabled(false);

    expect(result.ok).toBe(true);

    const items = Array.from(state.byId.values());

    expect(items.every((resume) => !resume.sync.enabled)).toBe(true);
    expect(items.every((resume) => resume.sync.status === "local-only")).toBe(
      true,
    );
  });
});
