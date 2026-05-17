"use client";

import { pdf } from "@react-pdf/renderer";

import type { ResumeData } from "@/types/resume";

import { downloadBlob } from "./download";

import { registerPdfFont } from "@/templates/pdf/fonts";
import { loadTemplatePdfComponentById } from "@/templates/resume/pdf";

import { getResumeFileBaseName } from "@/features/resume/services/resume-formatters";

export async function exportResumeAsPdf(resume: ResumeData): Promise<void> {
  registerPdfFont(resume);

  const TemplatePdf = loadTemplatePdfComponentById(resume.templateId);
  const blob = await pdf(<TemplatePdf resume={resume} />).toBlob();

  downloadBlob(blob, `${getResumeFileBaseName(resume)}.pdf`);
}
