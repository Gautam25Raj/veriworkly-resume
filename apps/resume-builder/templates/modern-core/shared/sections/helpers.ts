import type { ResumeAdditionalSectionKind, ResumeData } from "@/types/resume";

export function getCustomSection(
  resume: ResumeData,
  kind: ResumeAdditionalSectionKind,
) {
  return resume.customSections.find((section) => section.kind === kind) ?? null;
}
