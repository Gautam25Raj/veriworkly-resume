import ModernTemplate from "@/templates/modern";
import { modernTemplateMeta } from "@/templates/modern/meta";

import MinimalTemplate from "@/templates/minimal";
import { minimalTemplateMeta } from "@/templates/minimal/meta";

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
  return (
    templateRegistry.find((template) => template.id === templateId) ??
    templateRegistry[0]
  );
}
