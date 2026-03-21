import ModernTemplate from "@/templates/modern-core/templates/modern";
import { modernTemplateMeta } from "@/templates/modern-core/templates/modern/meta";

import MinimalTemplate from "@/templates/modern-core/templates/minimal";
import { minimalTemplateMeta } from "@/templates/modern-core/templates/minimal/meta";

import type { TemplateDefinition } from "@/types/template";

export const templateRegistry: TemplateDefinition[] = [
  {
    ...modernTemplateMeta,
    Component: ModernTemplate,
  },

  {
    ...minimalTemplateMeta,
    Component: MinimalTemplate,
  },
];

export function getTemplateById(templateId: string) {
  const normalizedTemplateId = templateId === "faang" ? "ats" : templateId;

  return (
    templateRegistry.find((template) => template.id === normalizedTemplateId) ??
    templateRegistry[0]
  );
}
