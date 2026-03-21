import type { ResumeCustomization } from "@/types/resume";

import { FONT_CSS_VARIABLES } from "@/features/resume/constants/font-css-variables";

type ResumeFontFamily = ResumeCustomization["fontFamily"];
type ResumeFontScope = "global" | "resume";

interface ResumeFontRegistryEntry {
  label: string;
  cssVariable: string;
  fallbackStack: string;
  scope: ResumeFontScope;
}

export const RESUME_FONT_REGISTRY: Record<
  ResumeFontFamily,
  ResumeFontRegistryEntry
> = {
  geist: {
    label: "Geist Sans",
    cssVariable: FONT_CSS_VARIABLES.geistSans,
    fallbackStack: "ui-sans-serif, system-ui, sans-serif",
    scope: "global",
  },

  serif: {
    label: "Merriweather Serif",
    cssVariable: FONT_CSS_VARIABLES.resumeSerif,
    fallbackStack: "ui-serif, Georgia, Cambria, serif",
    scope: "resume",
  },

  mono: {
    label: "Geist Mono",
    cssVariable: FONT_CSS_VARIABLES.geistMono,
    fallbackStack: "ui-monospace, SFMono-Regular, Menlo, monospace",
    scope: "global",
  },

  modern: {
    label: "Manrope Grotesk",
    cssVariable: FONT_CSS_VARIABLES.resumeModern,
    fallbackStack: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    scope: "resume",
  },
};

export const resumeFontOptions: Array<{
  value: ResumeFontFamily;
  label: string;
}> = (Object.keys(RESUME_FONT_REGISTRY) as ResumeFontFamily[]).map((key) => ({
  value: key,
  label: RESUME_FONT_REGISTRY[key].label,
}));

function toFontFamilyValue(font: ResumeFontRegistryEntry) {
  return `var(${font.cssVariable}), ${font.fallbackStack}`;
}

export const RESUME_FONT_FAMILY_MAP: Record<ResumeFontFamily, string> = {
  geist: toFontFamilyValue(RESUME_FONT_REGISTRY.geist),
  serif: toFontFamilyValue(RESUME_FONT_REGISTRY.serif),
  mono: toFontFamilyValue(RESUME_FONT_REGISTRY.mono),
  modern: toFontFamilyValue(RESUME_FONT_REGISTRY.modern),
};
