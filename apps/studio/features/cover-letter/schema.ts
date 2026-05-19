import type { BaseDocument } from "@/features/documents/core/types";

import type { CoverLetterContent } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function parseCoverLetterDocument(input: unknown): BaseDocument<CoverLetterContent> | null {
  if (!isRecord(input) || input.type !== "COVER_LETTER") return null;
  if (typeof input.id !== "string" || typeof input.templateId !== "string") return null;

  const contentRaw = isRecord(input.content) ? input.content : {};
  return {
    id: input.id,
    type: "COVER_LETTER",
    title: asText(input.title) || "Cover Letter",
    templateId: input.templateId,
    updatedAt: asText(input.updatedAt) || new Date().toISOString(),
    sync: isRecord(input.sync)
      ? {
          enabled: Boolean(input.sync.enabled),
          status: (input.sync.status as BaseDocument["sync"]["status"]) ?? "local-only",
          cloudDocumentId:
            typeof input.sync.cloudDocumentId === "string" ? input.sync.cloudDocumentId : null,
          lastSyncedAt:
            typeof input.sync.lastSyncedAt === "string" ? input.sync.lastSyncedAt : null,
          revision: typeof input.sync.revision === "number" ? input.sync.revision : 1,
        }
      : {
          enabled: false,
          status: "local-only",
          cloudDocumentId: null,
          lastSyncedAt: null,
          revision: 1,
        },
    content: {
      recipientName: asText(contentRaw.recipientName),
      recipientTitle: asText(contentRaw.recipientTitle),
      companyName: asText(contentRaw.companyName),
      subject: asText(contentRaw.subject),
      greeting: asText(contentRaw.greeting),
      opening: asText(contentRaw.opening),
      body: asText(contentRaw.body),
      closing: asText(contentRaw.closing),
      signature: asText(contentRaw.signature),
    },
  };
}
