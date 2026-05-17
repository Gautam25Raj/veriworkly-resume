/**
 * Metadata type for resume templates.
 * Each template folder has a `meta.ts` that exports an object conforming to this type.
 * The `id` is the canonical slug used in URLs and stored as `templateId` in resume documents.
 */
export interface ResumeTemplateMeta {
  /** Slug-friendly ID. Used in URLs and as `templateId` in resume documents. */
  id: string;
  /** Human-readable display name shown in the UI. */
  name: string;
  /** Always "resume" for templates in this folder. */
  documentType: "resume";
  /** Short description shown in template cards and SEO meta. */
  description: string;
  /** Primary accent color (hex) used for template-picker UI. */
  accentColor: string;
  /** Path to the preview image served from the site's public directory. */
  previewImage: string;
  /** Filter/discovery tags shown in the template gallery. */
  tags: string[];
}
