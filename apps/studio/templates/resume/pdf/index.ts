import type { PdfTemplateComponent } from "./types";

import { CompactAtsPdf } from "@/templates/resume/precision-ats/pdf";
import { CleanProfessionalPdf } from "@/templates/resume/executive-clarity/pdf";

const pdfTemplateRegistry: Record<string, PdfTemplateComponent> = {
  "executive-clarity": CleanProfessionalPdf,
  "precision-ats": CompactAtsPdf,
};

export function loadTemplatePdfComponentById(id: string | undefined): PdfTemplateComponent {
  return pdfTemplateRegistry[id ?? ""] ?? CleanProfessionalPdf;
}
