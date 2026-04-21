"use client";

import { getResumeFontStylesheetHref } from "@/features/resume/constants/resume-fonts";

const loadedResumeFontStylesheets = new Set<string>();

export function ensureResumeFontStylesheet(
  fontFamily: string | null | undefined,
) {
  if (typeof document === "undefined") {
    return;
  }

  const href = getResumeFontStylesheetHref(fontFamily);

  if (!href || loadedResumeFontStylesheets.has(href)) {
    return;
  }

  const existingLink = document.querySelector(
    `link[rel="stylesheet"][href="${href}"]`,
  );

  if (existingLink) {
    loadedResumeFontStylesheets.add(href);
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.append(link);

  loadedResumeFontStylesheets.add(href);
}
