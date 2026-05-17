import type { TemplateMeta } from "./types";
import type { DocumentType } from "./document-types";

/**
 * Template catalog per document type.
 *
 * IDs MUST match the `id` fields in:
 *   apps/studio/templates/resume/<id>/meta.ts
 *   apps/site/config/templates.ts
 *
 * They are used as `templateId` in stored documents and as URL slugs.
 */
export const templateCatalogByType: Record<DocumentType, TemplateMeta[]> = {
  RESUME: [
    {
      id: "executive-clarity",
      label: "Executive Clarity",
      type: "RESUME",
      description: "A polished single-column resume with refined spacing and ATS-safe structure.",
    },
    {
      id: "precision-ats",
      label: "Precision ATS",
      type: "RESUME",
      description: "A dense, recruiter-friendly layout that exports as a perfectly matching PDF.",
    },
  ],
  COVER_LETTER: [
    {
      id: "cover-letter-classic",
      label: "Classic Cover Letter",
      type: "COVER_LETTER",
      description: "Traditional business format.",
    },
  ],
  FORMAL_LETTER: [
    {
      id: "formal-letter-modern",
      label: "Modern Formal Letter",
      type: "FORMAL_LETTER",
      description: "Structured formal correspondence format.",
    },
  ],
  INVOICE: [
    {
      id: "invoice-clean",
      label: "Clean Invoice",
      type: "INVOICE",
      description: "Deterministic line-item invoice layout.",
    },
  ],
};

export const allTemplates = Object.values(templateCatalogByType).flat();
