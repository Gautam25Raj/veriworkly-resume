import type { ResumeFontFamilyId } from "@/types/resume-font";

export const DEFAULT_RESUME_FONT_FAMILY: ResumeFontFamilyId = "geist";

type ResumeFontScope = "editor" | "on-demand";

export interface ResumeFontRegistryEntry {
  id: ResumeFontFamilyId;
  label: string;
  primaryFamily: string;
  fallbackStack: string;
  stylesheetHref: string;
  scope: ResumeFontScope;
}

const resumeFontDefinitions: ResumeFontRegistryEntry[] = [
  {
    id: "geist",
    label: "Geist Sans",
    primaryFamily: "Geist",
    fallbackStack: "Inter, 'Segoe UI', Arial, sans-serif",
    stylesheetHref:
      "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&display=swap",
    scope: "editor",
  },
  {
    id: "serif",
    label: "Merriweather Serif",
    primaryFamily: "Merriweather",
    fallbackStack: "Georgia, Cambria, serif",
    stylesheetHref:
      "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap",
    scope: "editor",
  },
  {
    id: "modern",
    label: "Manrope Grotesk",
    primaryFamily: "Manrope",
    fallbackStack: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    stylesheetHref:
      "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
    scope: "editor",
  },
];

const RESUME_FONT_ALIAS_MAP: Record<string, ResumeFontFamilyId> = {
  mono: "geist",
};

const RESUME_FONT_ID_SET = new Set<ResumeFontFamilyId>(
  resumeFontDefinitions.map((font) => font.id),
);

export const RESUME_FONT_REGISTRY: Record<
  ResumeFontFamilyId,
  ResumeFontRegistryEntry
> = Object.fromEntries(
  resumeFontDefinitions.map((font) => [font.id, font]),
) as Record<ResumeFontFamilyId, ResumeFontRegistryEntry>;

export function isResumeFontFamilyId(
  value: string,
): value is ResumeFontFamilyId {
  return RESUME_FONT_ID_SET.has(value as ResumeFontFamilyId);
}

export function normalizeResumeFontFamilyId(
  value: string | null | undefined,
): ResumeFontFamilyId {
  const normalized = (value ?? "").trim().toLowerCase();

  if (isResumeFontFamilyId(normalized)) {
    return normalized;
  }

  if (normalized in RESUME_FONT_ALIAS_MAP) {
    return RESUME_FONT_ALIAS_MAP[normalized];
  }

  return DEFAULT_RESUME_FONT_FAMILY;
}

export const resumeFontOptions: Array<{
  value: ResumeFontFamilyId;
  label: string;
}> = resumeFontDefinitions.map((font) => ({
  value: font.id,
  label: font.label,
}));

function toFontFamilyValue(font: ResumeFontRegistryEntry) {
  return `'${font.primaryFamily}', ${font.fallbackStack}`;
}

export const RESUME_FONT_FAMILY_MAP: Record<ResumeFontFamilyId, string> =
  Object.fromEntries(
    resumeFontDefinitions.map((font) => [font.id, toFontFamilyValue(font)]),
  ) as Record<ResumeFontFamilyId, string>;

export function getResumeFontStylesheetHref(
  fontFamily: string | null | undefined,
) {
  const normalized = normalizeResumeFontFamilyId(fontFamily);
  return RESUME_FONT_REGISTRY[normalized].stylesheetHref;
}

export const RESUME_EDITOR_FONT_STYLESHEET_HREFS = resumeFontDefinitions
  .filter((font) => font.scope === "editor")
  .map((font) => font.stylesheetHref);
