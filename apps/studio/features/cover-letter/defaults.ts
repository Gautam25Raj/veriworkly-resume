import type { BaseDocument } from "@/features/documents/core/types";

import type { CoverLetterContent } from "./types";

export const COVER_LETTER_TEMPLATE_ID = "cover-letter-classic";

export function createDefaultCoverLetter(id: string): BaseDocument<CoverLetterContent> {
  const now = new Date().toISOString();
  return {
    id,
    type: "COVER_LETTER",
    title: "Cover Letter",
    templateId: COVER_LETTER_TEMPLATE_ID,
    updatedAt: now,
    sync: {
      enabled: false,
      status: "local-only",
      cloudDocumentId: null,
      lastSyncedAt: null,
      revision: 1,
    },
    content: {
      recipientName: "",
      recipientTitle: "",
      companyName: "",
      subject: "",
      greeting: "Dear Hiring Manager,",
      opening: "",
      body: "",
      closing: "Sincerely,",
      signature: "",
    },
  };
}
