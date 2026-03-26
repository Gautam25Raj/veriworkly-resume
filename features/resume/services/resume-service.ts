"use client";

import type { ResumeData } from "@/types/resume";

import {
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

export interface ResumeListItem {
  id: string;
  title: string;
  templateId: string;
  role: string;
  updatedAt: string;
}

function getResumeTitle(resume: ResumeData) {
  return resume.basics.fullName.trim() || "Untitled Resume";
}

function createId() {
  return `resume-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadResume() {
  return normalizeResumeData(loadResumeFromLocalStorage() ?? defaultResume);
}

export function saveResume(resume: ResumeData) {
  saveResumeToLocalStorage({
    ...resume,
    updatedAt: new Date().toISOString(),
  });
}

export function resetResume() {
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
  }));
}

export function deleteResumeById(resumeId: string) {
  return deleteResumeFromLocalStorage(resumeId);
}

export function loadResumeById(resumeId: string) {
  const resume = loadResumeByIdFromLocalStorage(resumeId);

  if (!resume) {
    return null;
  }

  setActiveResumeIdInLocalStorage(resume.id);
  return normalizeResumeData(resume);
}

export function createResume() {
  const nextResume = normalizeResumeData({
    ...defaultResume,
    id: createId(),
    updatedAt: new Date().toISOString(),
  });

  saveResume(nextResume);

  return nextResume;
}

export function deleteResume(resumeId: string) {
  const nextId = deleteResumeFromLocalStorage(resumeId);

  if (!nextId) {
    return null;
  }

  return loadResumeById(nextId);
}

export function exportResumeAsJson(resume: ResumeData) {
  const blob = new Blob([JSON.stringify(resume, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${resume.basics.fullName.toLowerCase().replace(/\s+/g, "-") || "resume"}.json`;

  link.click();

  URL.revokeObjectURL(url);
}

export async function importResumeFromFile(file: File) {
  const content = await file.text();

  return normalizeResumeData(JSON.parse(content) as ResumeData);
}
