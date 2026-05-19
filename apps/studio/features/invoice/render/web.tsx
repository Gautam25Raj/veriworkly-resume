import type { InvoiceContent } from "@/features/invoice/types";

export function renderInvoiceWeb(content: InvoiceContent) {
  const lines = content.items.map(
    (item) => `${item.description} | ${item.quantity} x ${item.unitPrice.toFixed(2)}`,
  );
  return [`Invoice #${content.invoiceNumber}`, ...lines, content.notes].filter(Boolean).join("\n");
}
