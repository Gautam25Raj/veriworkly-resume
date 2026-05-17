import type { ComponentType } from "react";

import type { ResumeData } from "@/types/resume";

export interface PdfTemplateProps {
  resume: ResumeData;
}

export type PdfTemplateComponent = ComponentType<PdfTemplateProps>;
