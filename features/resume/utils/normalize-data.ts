import {
  defaultResume,
  defaultSections,
} from "@/features/resume/constants/default-resume";
import type {
  ResumeData,
  ResumeLinkItem,
  ResumeLinkType,
} from "@/types/resume";

function isKnownLinkType(value: string): value is ResumeLinkType {
  return [
    "github",
    "linkedin",
    "dribbble",
    "website",
    "twitter",
    "portfolio",
    "behance",
    "medium",
    "youtube",
    "custom",
  ].includes(value);
}

function normalizeLinks(value: Partial<ResumeData> | null | undefined) {
  const incomingLinks = value?.links;

  if (incomingLinks) {
    return {
      displayMode: incomingLinks.displayMode ?? defaultResume.links.displayMode,
      items: (incomingLinks.items ?? []).map((item, index) => ({
        id: item.id || `link-${index + 1}`,
        type: isKnownLinkType(item.type) ? item.type : "website",
        label: item.label || "",
        url: item.url || "",
      })),
    };
  }

  const legacyBasics = (value?.basics ?? {}) as Partial<
    ResumeData["basics"] & {
      website?: string;
      github?: string;
      linkedin?: string;
    }
  >;

  const migratedItems: ResumeLinkItem[] = [
    { type: "website" as ResumeLinkType, label: "", url: legacyBasics.website || "", id: "" },
    { type: "github" as ResumeLinkType, label: "", url: legacyBasics.github || "", id: "" },
    { type: "linkedin" as ResumeLinkType, label: "", url: legacyBasics.linkedin || "", id: "" },
  ]
    .filter((item) => item.url.trim().length > 0)
    .map((item, index) => ({
      ...item,
      id: `link-${index + 1}`,
    }));

  return {
    ...defaultResume.links,
    items: migratedItems,
  };
}

function normalizeCustomSections(
  value: Partial<ResumeData> | null | undefined,
) {
  const incoming = value?.customSections ?? [];

  return defaultResume.customSections.map((fallback) => {
    const matching = incoming.find((item) => item.kind === fallback.kind);

    if (!matching) {
      return fallback;
    }

    return {
      ...fallback,
      ...matching,
      items: matching.items
        ? matching.items.map((entry, index) => ({
            id: entry.id || `${matching.kind}-${index + 1}`,
            name: entry.name || "",
            issuer: entry.issuer || "",
            date: entry.date || "",
            link: entry.link || "",
            referenceId: entry.referenceId || "",
            description: entry.description || "",
            details: entry.details ?? [],
          }))
        : fallback.items,
    };
  });
}

function normalizeSections(value: Partial<ResumeData> | null | undefined) {
  const incoming = value?.sections ?? [];

  if (!incoming.length) {
    return defaultSections;
  }

  const merged = defaultSections.map((fallback) => {
    const existing = incoming.find((section) => section.id === fallback.id);

    if (!existing) {
      return fallback;
    }

    return {
      ...fallback,
      ...existing,
    };
  });

  return merged
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((section, index) => ({
      ...section,
      order: index,
    }));
}

export function normalizeResumeData(
  value: Partial<ResumeData> | null | undefined,
): ResumeData {
  const normalizedTemplateId =
    value?.templateId === "faang" ? "ats" : value?.templateId;

  return {
    ...defaultResume,
    ...value,
    templateId: normalizedTemplateId ?? defaultResume.templateId,
    basics: {
      ...defaultResume.basics,
      ...value?.basics,
    },
    links: normalizeLinks(value),
    experience: value?.experience ? value.experience : defaultResume.experience,
    education: value?.education?.length
      ? value.education.map((item) => ({
          ...item,
          current:
            item.current ?? item.endDate?.trim().toLowerCase() === "present",
        }))
      : defaultResume.education,
    projects: value?.projects ? value.projects : defaultResume.projects,
    skills: value?.skills?.length ? value.skills : defaultResume.skills,
    customSections: normalizeCustomSections(value),
    sections: normalizeSections(value),
    customization: {
      ...defaultResume.customization,
      ...value?.customization,
    },
    updatedAt: value?.updatedAt ?? new Date().toISOString(),
  };
}
