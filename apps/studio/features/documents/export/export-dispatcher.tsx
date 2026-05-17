import { pdf } from "@react-pdf/renderer";

import type { BaseDocument, ExportFormat } from "@/features/documents/core/types";

import { downloadBlob } from "@/features/documents/export/download";
import { exportResumeAsPdf } from "@/features/documents/export/export-pdf";
import { exportResumeAsDocx } from "@/features/documents/export/export-docx";
import { exportResumeAsHtml } from "@/features/documents/export/export-html";
import { exportResumeAsJson } from "@/features/documents/export/export-json";
import { exportResumeAsText } from "@/features/documents/export/export-text";
import { exportResumeAsMarkdown } from "@/features/documents/export/export-markdown";

import { InvoicePdf } from "@/features/invoice/render/pdf";
import { CoverLetterPdf } from "@/features/cover-letter/render/pdf";
import { FormalLetterPdf } from "@/features/formal-letter/render/pdf";

function toTextDocument(value: unknown): string {
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

export async function exportDocumentByType(
  document: BaseDocument,
  format: ExportFormat,
): Promise<void> {
  const fileBase = `${document.type.toLowerCase()}-${document.id}`;

  if (document.type === "RESUME") {
    if (format === "pdf") return exportResumeAsPdf(document.content as never);
    if (format === "docx") return exportResumeAsDocx(document.content as never);
    if (format === "html") return exportResumeAsHtml(document.content as never);
    if (format === "markdown") return exportResumeAsMarkdown(document.content as never);
    if (format === "json") return exportResumeAsJson(document.content as never);
    if (format === "txt") return exportResumeAsText(document.content as never);

    return;
  }

  if (format === "json") {
    downloadBlob(
      new Blob([JSON.stringify(document.content, null, 2)], { type: "application/json" }),
      `${fileBase}.json`,
    );

    return;
  }

  if (format === "txt" || format === "markdown") {
    downloadBlob(
      new Blob([toTextDocument(document.content)], { type: "text/plain;charset=utf-8" }),
      `${fileBase}.${format === "txt" ? "txt" : "md"}`,
    );

    return;
  }

  if (format === "pdf") {
    const renderer =
      document.type === "COVER_LETTER" ? (
        <CoverLetterPdf content={document.content as never} />
      ) : document.type === "FORMAL_LETTER" ? (
        <FormalLetterPdf content={document.content as never} />
      ) : (
        <InvoicePdf content={document.content as never} />
      );

    const blob = await pdf(renderer).toBlob();
    downloadBlob(blob, `${fileBase}.pdf`);

    return;
  }
}
