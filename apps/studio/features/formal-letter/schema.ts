import type { BaseDocument } from "@/features/documents/core/types";

import type { FormalLetterContent } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function parseFormalLetterDocument(
  input: unknown,
): BaseDocument<FormalLetterContent> | null {
  if (!isRecord(input) || input.type !== "FORMAL_LETTER") return null;
  if (typeof input.id !== "string" || typeof input.templateId !== "string") return null;
  const contentRaw = isRecord(input.content) ? input.content : {};
  return {
    id: input.id,
    type: "FORMAL_LETTER",
    title: asText(input.title) || "Formal Letter",
    templateId: input.templateId,
    updatedAt: asText(input.updatedAt) || new Date().toISOString(),
    sync: {
      enabled: false,
      status: "local-only",
      cloudDocumentId: null,
      lastSyncedAt: null,
      revision: 1,
    },
    content: {
      senderName: asText(contentRaw.senderName),
      senderAddress: asText(contentRaw.senderAddress),
      receiverName: asText(contentRaw.receiverName),
      receiverAddress: asText(contentRaw.receiverAddress),
      date: asText(contentRaw.date),
      subject: asText(contentRaw.subject),
      greeting: asText(contentRaw.greeting),
      body: asText(contentRaw.body),
      closing: asText(contentRaw.closing),
      signature: asText(contentRaw.signature),
    },
  };
}
