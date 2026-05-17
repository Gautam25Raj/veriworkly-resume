"use client";

/**
 * Resume Service - Production-ready modular export
 *
 * This is a barrel export that maintains 100% backward compatibility
 * while organizing code into focused, maintainable modules:
 *
 * - resume-core.ts: CRUD operations
 * - resume-export.ts: Multi-format export logic
 * - resume-import.ts: Import and validation
 * - resume-formatters.ts: Shared formatting utilities
 *
 * All exports are re-exported here for backward compatibility with existing imports.
 */

export {
  loadResume,
  saveResume,
  resetResume,
  createResume,
  deleteResume,
  loadResumeById,
  listSavedResumes,
  deleteResumeById,
  createResumeWithTemplate,
  setAllResumesSyncEnabled,
  type ResumeListItem,
} from "./resume-core";

export * from "@/features/documents/export";

export { importResumeFromFile } from "./resume-import";

export {
  safeText,
  escapeHtml,
  getResumeTitle,
  formatDateRange,
  isSectionVisible,
  sanitizeFileName,
  getResumeFileBaseName,
} from "./resume-formatters";

export type { SaveResumeResult } from "@/features/resume/services/local-storage";
