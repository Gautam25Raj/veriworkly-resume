export const RESUME_FONT_IDS = ["geist", "serif", "modern"] as const;

export type ResumeFontFamilyId = (typeof RESUME_FONT_IDS)[number];
