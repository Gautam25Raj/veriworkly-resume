/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import type { ResumeTemplateMeta } from "./resume/types";

import { precisionAtsMeta } from "./resume/precision-ats/meta";
import { executiveClarityMeta } from "./resume/executive-clarity/meta";

// Re-export the meta type so consumers can use it without importing from the
// deeply-nested resume/types path.
export type { ResumeTemplateMeta };

/** A renderable template record used by the web editor. */
export interface TemplateDefinition extends ResumeTemplateMeta {
  renderWeb: (props: any) => React.ReactNode;
}

// ---------------------------------------------------------------------------
// Template registry
// Components are imported lazily (dynamic) in the EditorLayout so this file
// stays server-side-safe.  Here we wire up the metadata + a lightweight
// renderWeb wrapper that is replaced by the dynamic loader at runtime.
// ---------------------------------------------------------------------------

import { CompactAtsWeb } from "./resume/precision-ats/web";
import { CleanProfessionalWeb } from "./resume/executive-clarity/web";

export const templateRegistry: TemplateDefinition[] = [
  {
    ...executiveClarityMeta,
    renderWeb: (props: any) => React.createElement(CleanProfessionalWeb, props),
  },
  {
    ...precisionAtsMeta,
    renderWeb: (props: any) => React.createElement(CompactAtsWeb, props),
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export const loadTemplateComponentById = (id: string | undefined): React.ComponentType<any> => {
  const match = templateRegistry.find((t) => t.id === id);
  const template = match ?? templateRegistry[0];

  return (props: any) => template.renderWeb(props);
};

export const getTemplateById = (id: string | undefined): TemplateDefinition | undefined =>
  templateRegistry.find((t) => t.id === id);

/** Convenience list of all template metas (no render function). */
export const resumeTemplateMetas: ResumeTemplateMeta[] = [executiveClarityMeta, precisionAtsMeta];
