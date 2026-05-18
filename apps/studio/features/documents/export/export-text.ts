import type { ResumeData } from "@/types/resume";

import { getResumeFileBaseName } from "@/features/resume/services/resume-formatters";

import { downloadBlob } from "./download";
import { buildMarkdown } from "./export-markdown";

function buildText(resume: ResumeData): string {
  const markdown = buildMarkdown(resume);

  return markdown
    .replaceAll(/^#{1,6}\s?/gm, "")
    .replaceAll(/\*\*(.*?)\*\*/g, "$1")
    .replaceAll(/\[(.*?)\]\((.*?)\)/g, "$1: $2")
    .replaceAll(/_/g, "")
    .trim();
}

export function exportResumeAsText(resume: ResumeData): void {
  const text = buildText(resume);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, `${getResumeFileBaseName(resume)}.txt`);
}
