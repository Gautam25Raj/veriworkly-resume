export const DOCUMENT_TYPES = ["RESUME", "COVER_LETTER", "FORMAL_LETTER", "INVOICE"] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export function isDocumentType(value: string): value is DocumentType {
  return DOCUMENT_TYPES.includes(value as DocumentType);
}
