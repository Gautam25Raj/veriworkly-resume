"use client";

import type { ResumeData, ResumeSyncStatus } from "@/types/resume";

import {
  type SaveResumeResult,
  saveResumeToLocalStorage,
  loadResumeFromLocalStorage,
  clearResumeFromLocalStorage,
  listResumesFromLocalStorage,
  deleteResumeFromLocalStorage,
  loadResumeByIdFromLocalStorage,
  setActiveResumeIdInLocalStorage,
} from "@/features/resume/services/local-storage";
import { defaultResume } from "@/features/resume/constants/default-resume";
import { normalizeResumeData } from "@/features/resume/utils/normalize-data";
import { deriveResumeFromMasterProfile } from "@/features/resume/services/master-profile";
import { loadWorkspaceSettingsFromLocalStorage } from "@/features/resume/services/workspace-settings";

import { getResumeTitle } from "./resume-formatters";

export interface ResumeListItem {
  id: string;
  title: string;
  templateId: string;
  role: string;
  updatedAt: string;
  sync: ResumeData["sync"];
}

function createId(): string {
  return `resume-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadResume(): ResumeData {
  return normalizeResumeData(loadResumeFromLocalStorage() ?? defaultResume);
}

export function saveResume(resume: ResumeData): SaveResumeResult {
  return saveResumeToLocalStorage({
    ...resume,
    updatedAt: new Date().toISOString(),
  });
}

export function resetResume(): ResumeData {
  clearResumeFromLocalStorage();
  return defaultResume;
}

export function listSavedResumes(): ResumeListItem[] {
  const resumes = listResumesFromLocalStorage();

  if (!resumes) return [];

  return resumes.map((resume) => ({
    id: resume.id,
    title: getResumeTitle(resume),
    templateId: resume.templateId,
    role: resume.basics.role,
    updatedAt: resume.updatedAt,
    sync: resume.sync,
  }));
}

export function deleteResumeById(resumeId: string): string | null {
  return deleteResumeFromLocalStorage(resumeId);
}

export function loadResumeById(resumeId: string): ResumeData | null {
  const resume = loadResumeByIdFromLocalStorage(resumeId);

  if (!resume) {
    return null;
  }

  setActiveResumeIdInLocalStorage(resume.id);
  return normalizeResumeData(resume);
}

export function createResume(): ResumeData {
  const workspaceSettings = loadWorkspaceSettingsFromLocalStorage();
  const nextResume = deriveResumeFromMasterProfile(createId());

  nextResume.sync = {
    ...defaultResume.sync,
    enabled: workspaceSettings.autoSyncEnabled,
    status: (workspaceSettings.autoSyncEnabled
      ? "pending"
      : "local-only") as ResumeSyncStatus,
  };

  saveResume(nextResume);

  return nextResume;
}

export function deleteResume(resumeId: string): ResumeData | null {
  const nextId = deleteResumeFromLocalStorage(resumeId);

  if (!nextId) {
    return null;
  }

  return loadResumeById(nextId);
}

export function setAllResumesSyncEnabled(enabled: boolean): SaveResumeResult {
  const collection = listSavedResumes();

  if (collection.length === 0) {
    return { ok: true, queued: false };
  }

  const updated = collection.map((resume) => {
    const fullResume = loadResumeById(resume.id);
    if (!fullResume) return null;

    return {
      ...fullResume,
      sync: {
        ...fullResume.sync,
        enabled,
        status: (enabled ? "pending" : "local-only") as ResumeSyncStatus,
      },
    };
  });

  let lastResult: SaveResumeResult = { ok: true, queued: false };

  for (const resume of updated) {
    if (!resume) continue;

    lastResult = saveResume(resume);

    if (!lastResult.ok) {
      return lastResult;
    }
  }

  return lastResult;
}
