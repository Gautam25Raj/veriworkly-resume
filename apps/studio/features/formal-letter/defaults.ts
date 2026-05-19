import type { BaseDocument } from "@/features/documents/core/types";

import type { FormalLetterContent } from "./types";

export const FORMAL_LETTER_TEMPLATE_ID = "formal-letter-modern";

export function createDefaultFormalLetter(id: string): BaseDocument<FormalLetterContent> {
  const now = new Date().toISOString();
  return {
    id,
    type: "FORMAL_LETTER",
    title: "Formal Letter",
    templateId: FORMAL_LETTER_TEMPLATE_ID,
    updatedAt: now,
    sync: {
      enabled: false,
      status: "local-only",
      cloudDocumentId: null,
      lastSyncedAt: null,
      revision: 1,
    },
    content: {
      senderName: "",
      senderAddress: "",
      receiverName: "",
      receiverAddress: "",
      date: "",
      subject: "",
      greeting: "Dear Sir/Madam,",
      body: "",
      closing: "Yours faithfully,",
      signature: "",
    },
  };
}
