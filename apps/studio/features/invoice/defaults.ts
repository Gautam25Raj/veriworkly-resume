import type { BaseDocument } from "@/features/documents/core/types";

import type { InvoiceContent } from "./types";

export const INVOICE_TEMPLATE_ID = "invoice-clean";

export function createDefaultInvoice(id: string): BaseDocument<InvoiceContent> {
  const now = new Date().toISOString();
  return {
    id,
    type: "INVOICE",
    title: "Invoice",
    templateId: INVOICE_TEMPLATE_ID,
    updatedAt: now,
    sync: {
      enabled: false,
      status: "local-only",
      cloudDocumentId: null,
      lastSyncedAt: null,
      revision: 1,
    },
    content: {
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      issueDate: now.slice(0, 10),
      dueDate: now.slice(0, 10),
      fromName: "",
      fromAddress: "",
      billToName: "",
      billToAddress: "",
      currency: "USD",
      notes: "",
      items: [{ id: `line-${Date.now()}`, description: "", quantity: 1, unitPrice: 0 }],
    },
  };
}
