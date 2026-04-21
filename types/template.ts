import type { ComponentType } from "react";

import type { ResumeData } from "@/types/resume";

export interface TemplateRenderProps {
  resume: ResumeData;
  className?: string;
}

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  accentColor: string;
  previewImage: string;
  tags: string[];
}

export interface TemplateDefinition extends TemplateMeta {}

export type TemplateComponent = ComponentType<TemplateRenderProps>;
