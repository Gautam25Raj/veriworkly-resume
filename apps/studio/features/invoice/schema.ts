import type { BaseDocument } from "@/features/documents/core/types";

import type { InvoiceContent } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function parseInvoiceDocument(input: unknown): BaseDocument<InvoiceContent> | null {
  if (!isRecord(input) || input.type !== "INVOICE") return null;
  if (typeof input.id !== "string" || typeof input.templateId !== "string") return null;
  const contentRaw = isRecord(input.content) ? input.content : {};
  const rawItems = Array.isArray(contentRaw.items) ? contentRaw.items : [];

  return {
    id: input.id,
    type: "INVOICE",
    title: asText(input.title) || "Invoice",
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
      invoiceNumber: asText(contentRaw.invoiceNumber),
      issueDate: asText(contentRaw.issueDate),
      dueDate: asText(contentRaw.dueDate),
      fromName: asText(contentRaw.fromName),
      fromAddress: asText(contentRaw.fromAddress),
      billToName: asText(contentRaw.billToName),
      billToAddress: asText(contentRaw.billToAddress),
      currency: asText(contentRaw.currency) || "USD",
      notes: asText(contentRaw.notes),
      items: rawItems
        .map((item, index) => {
          if (!isRecord(item)) return null;
          return {
            id: asText(item.id) || `line-${index + 1}`,
            description: asText(item.description),
            quantity: asNumber(item.quantity, 1),
            unitPrice: asNumber(item.unitPrice),
          };
        })
        .filter((item): item is InvoiceContent["items"][number] => item !== null),
    },
  };
}
