import type { ResumeTemplateMeta } from "../types";

/**
 * Precision ATS – single source of truth.
 * The `id` doubles as the URL slug on veriworkly.com/templates/<id>
 * and the `templateId` stored in every resume document.
 */
export const precisionAtsMeta: ResumeTemplateMeta = {
  id: "precision-ats",
  name: "Precision ATS",
  documentType: "resume",
  description:
    "A dense, recruiter-friendly layout for longer resumes that still exports as a real matching PDF. Built for clarity and parsing accuracy above all else.",
  accentColor: "#10b981",
  previewImage: "/templates/precision-ats.png",
  tags: ["One column", "ATS-friendly", "Compact", "Simple"],
};
