"use client";

import { useMemo } from "react";

import {
  loadDocumentById,
  saveDocument,
} from "@/features/documents/services/document-workspace-service";
import type { InvoiceContent } from "@/features/invoice/types";

interface Props {
  documentId: string;
}

export default function InvoiceEditor({ documentId }: Props) {
  const doc = useMemo(() => loadDocumentById("INVOICE", documentId), [documentId]);

  if (!doc) return <p className="text-muted-foreground text-sm">Invoice not found.</p>;
  const content = doc.content as InvoiceContent;

  const subtotal = content.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <div className="mx-auto max-w-4xl space-y-4 py-8">
      <h1 className="text-2xl font-semibold">{doc.title}</h1>
      <p className="text-muted-foreground text-sm">
        Subtotal: {content.currency} {subtotal.toFixed(2)}
      </p>
      <textarea
        className="min-h-64 w-full rounded-md border p-4"
        value={content.notes}
        onChange={(event) =>
          saveDocument({
            ...doc,
            updatedAt: new Date().toISOString(),
            content: {
              ...content,
              notes: event.target.value,
            },
          })
        }
      />
    </div>
  );
}
