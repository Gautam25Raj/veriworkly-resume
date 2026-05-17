import type { ComponentType } from "react";

import type { DocumentType } from "./document-types";
import type { BaseDocument, ExportFormat, TemplateMeta } from "./types";

export interface DocumentDefinition<TContent = unknown> {
  type: DocumentType;
  label: string;
  icon: string;
  defaultTemplateId: string;
  exportFormats: ExportFormat[];
  templates: TemplateMeta[];
  createDefault: (id: string) => BaseDocument<TContent>;
  parse: (value: unknown) => BaseDocument<TContent> | null;
  Editor: ComponentType<{ documentId: string }>;
}
