import type { ResumeTemplateMeta } from "../types";

/**
 * Executive Clarity – single source of truth.
 * The `id` doubles as the URL slug on veriworkly.com/templates/<id>
 * and the `templateId` stored in every resume document.
 */
export const executiveClarityMeta: ResumeTemplateMeta = {
  id: "executive-clarity",
  name: "Executive Clarity",
  documentType: "resume",
  description:
    "A polished single-column resume with refined spacing, strong section rhythm, and ATS-safe structure. Ideal for professionals who want a sophisticated, modern look.",
  accentColor: "#0ea5e9",
  previewImage: "/templates/executive-clarity.png",
  tags: ["One column", "ATS-friendly", "Modern", "Professional"],
};
