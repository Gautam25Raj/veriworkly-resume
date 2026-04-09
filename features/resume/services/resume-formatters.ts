"use client";

import type { ResumeData } from "@/types/resume";

export function safeText(value: string | undefined | null): string {
  return value?.trim() ?? "";
}

export function formatDateRange(
  startDate: string,
  endDate: string,
  current: boolean,
): string {
  const start = safeText(startDate) || "Start";

  if (current) {
    return `${start} - Present`;
  }

  const end = safeText(endDate) || "End";
  return `${start} - ${end}`;
}

export function sanitizeFileName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function getResumeTitle(resume: ResumeData): string {
  return resume.basics.fullName.trim() || "Untitled Resume";
}

export function getResumeFileBaseName(resume: ResumeData): string {
  return sanitizeFileName(resume.basics.fullName) || "resume";
}

export function getVisibleSectionMap(resume: ResumeData): Map<string, boolean> {
  return new Map(
    resume.sections.map((section) => [section.id, section.visible]),
  );
}

export function isSectionVisible(
  visibleSections: Map<string, boolean>,
  sectionId: string,
): boolean {
  return visibleSections.get(sectionId) ?? true;
}
