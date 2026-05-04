import type { ResumeAdditionalSectionKind, ResumeData } from "@/types/resume";

import { formatDate } from "@/features/resume/utils/format-date";

export function getCustomSection(
  resume: ResumeData,
  kind: ResumeAdditionalSectionKind,
) {
  return resume.customSections.find((section) => section.kind === kind) ?? null;
}

export function defaultRange(
  startDate: string,
  endDate: string,
  current: boolean,
) {
  return `${formatDate(startDate)} - ${current ? "Present" : formatDate(endDate)}`;
}
