import { modernTemplateMeta } from "@/templates/modern-core/templates/modern/meta";
import { minimalTemplateMeta } from "@/templates/modern-core/templates/minimal/meta";
import { executiveTemplateMeta } from "@/templates/modern-core/templates/leadership/meta";

import { atsClassicTemplateMeta } from "@/templates/compact-core/templates/ats-classic/meta";
import { classicAcademicTemplateMeta } from "@/templates/compact-core/templates/professional-classic/meta";
import { structuredProfessionalTemplateMeta } from "@/templates/compact-core/templates/structured-professional/meta";
import { academicSerifTemplateMeta } from "@/templates/compact-core/templates/academic-serif/meta";

import type { TemplateComponent, TemplateDefinition } from "@/types/template";

type TemplateComponentModule = {
  default: TemplateComponent;
};

type TemplateComponentLoader = () => Promise<TemplateComponentModule>;

type TemplateEntry = {
  meta: TemplateDefinition;
  loadComponent: TemplateComponentLoader;
};

function normalizeTemplateId(templateId: string) {
  return templateId === "faang" ? "ats" : templateId;
}

const templateEntries: TemplateEntry[] = [
  {
    meta: modernTemplateMeta,
    loadComponent: () => import("@/templates/modern-core/templates/modern"),
  },
  {
    meta: minimalTemplateMeta,
    loadComponent: () => import("@/templates/modern-core/templates/minimal"),
  },
  {
    meta: executiveTemplateMeta,
    loadComponent: () => import("@/templates/modern-core/templates/leadership"),
  },
  {
    meta: atsClassicTemplateMeta,
    loadComponent: () =>
      import("@/templates/compact-core/templates/ats-classic"),
  },
  {
    meta: classicAcademicTemplateMeta,
    loadComponent: () =>
      import("@/templates/compact-core/templates/professional-classic"),
  },
  {
    meta: structuredProfessionalTemplateMeta,
    loadComponent: () =>
      import("@/templates/compact-core/templates/structured-professional"),
  },
  {
    meta: academicSerifTemplateMeta,
    loadComponent: () =>
      import("@/templates/compact-core/templates/academic-serif"),
  },
];

export const templateRegistry: TemplateDefinition[] = templateEntries.map(
  (entry) => entry.meta,
);

const templateComponentLoaders: Record<string, TemplateComponentLoader> =
  Object.fromEntries(
    templateEntries.map((entry) => [entry.meta.id, entry.loadComponent]),
  ) as Record<string, TemplateComponentLoader>;

function getFallbackTemplate() {
  return templateRegistry[0];
}

export function getTemplateById(templateId: string) {
  const normalizedTemplateId = normalizeTemplateId(templateId);

  return (
    templateRegistry.find((template) => template.id === normalizedTemplateId) ??
    getFallbackTemplate()
  );
}

export async function loadTemplateComponentById(
  templateId: string,
): Promise<TemplateComponent> {
  const normalizedTemplateId = normalizeTemplateId(templateId);

  const loader =
    templateComponentLoaders[normalizedTemplateId] ??
    templateComponentLoaders[getFallbackTemplate().id];

  const module = await loader();
  return module.default;
}
