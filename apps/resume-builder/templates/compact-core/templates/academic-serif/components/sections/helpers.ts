import type { ResumeAdditionalSectionKind, ResumeData } from "@/types/resume";

import { formatDate } from "@/features/resume/utils/format-date";

export function getAdditionalSection(
  resume: ResumeData,
  kind: ResumeAdditionalSectionKind,
) {
  return resume.customSections.find((section) => section.kind === kind) ?? null;
}

export function formatRange(
  startDate: string,
  endDate: string,
  current: boolean,
) {
  return `${formatDate(startDate)} - ${current ? "Present" : formatDate(endDate)}`;
}
