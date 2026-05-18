import type { ResumeData } from "@/types/resume";

import { getResumeFileBaseName } from "@/features/resume/services/resume-formatters";
import { parseResumeDataForExport } from "@/features/resume/schemas/resume-storage-schema";

import { downloadBlob } from "./download";

export function exportResumeAsJson(resume: ResumeData): void {
  const safeResume = parseResumeDataForExport(resume);
  const blob = new Blob([JSON.stringify(safeResume, null, 2)], {
    type: "application/json",
  });
  downloadBlob(blob, `${getResumeFileBaseName(safeResume)}.json`);
}
