import ModernTemplate from "@/templates/modern-core/templates/modern";
import { modernTemplateMeta } from "@/templates/modern-core/templates/modern/meta";

import MinimalTemplate from "@/templates/modern-core/templates/minimal";
import { minimalTemplateMeta } from "@/templates/modern-core/templates/minimal/meta";

import ExecutiveTemplate from "@/templates/modern-core/templates/leadership";
import { executiveTemplateMeta } from "@/templates/modern-core/templates/leadership/meta";

import AtsClassicTemplate from "@/templates/compact-core/templates/ats-classic";
import { atsClassicTemplateMeta } from "@/templates/compact-core/templates/ats-classic/meta";

import ClassicAcademicTemplate from "@/templates/compact-core/templates/professional-classic";
import { classicAcademicTemplateMeta } from "@/templates/compact-core/templates/professional-classic/meta";

import StructuredProfessionalTemplate from "@/templates/compact-core/templates/structured-professional";
import { structuredProfessionalTemplateMeta } from "@/templates/compact-core/templates/structured-professional/meta";

import AcademicSerifTemplate from "@/templates/compact-core/templates/academic-serif";
import { academicSerifTemplateMeta } from "@/templates/compact-core/templates/academic-serif/meta";

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

  {
    ...executiveTemplateMeta,
    Component: ExecutiveTemplate,
  },

  {
    ...atsClassicTemplateMeta,
    Component: AtsClassicTemplate,
  },

  {
    ...classicAcademicTemplateMeta,
    Component: ClassicAcademicTemplate,
  },

  {
    ...structuredProfessionalTemplateMeta,
    Component: StructuredProfessionalTemplate,
  },

  {
    ...academicSerifTemplateMeta,
    Component: AcademicSerifTemplate,
  },
];

export function getTemplateById(templateId: string) {
  const normalizedTemplateId = templateId === "faang" ? "ats" : templateId;

  return (
    templateRegistry.find((template) => template.id === normalizedTemplateId) ??
    templateRegistry[0]
  );
}
