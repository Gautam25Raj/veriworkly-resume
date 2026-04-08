import { z } from "zod";

import type { ResumeData } from "@/types/resume";

import { normalizeResumeData } from "@/features/resume/utils/normalize-data";

const resumeSectionIdSchema = z.enum([
  "basics",
  "links",
  "summary",
  "experience",
  "education",
  "projects",
  "skills",
  "certifications",
  "awards",
  "publications",
  "languages",
  "custom",
]);

const resumeLinkTypeSchema = z.enum([
  "github",
  "linkedin",
  "dribbble",
  "twitter",
  "portfolio",
  "behance",
  "medium",
  "youtube",
  "custom",
]);

const resumeAdditionalSectionKindSchema = z.enum([
  "certifications",
  "awards",
  "publications",
  "languages",
  "custom",
]);

const resumeSyncStatusSchema = z.enum([
  "local-only",
  "pending",
  "syncing",
  "synced",
  "conflicted",
]);

const resumeFontFamilySchema = z.enum(["geist", "serif", "mono", "modern"]);

const resumeDataSchemaBase = z
  .object({
    id: z.string(),
    templateId: z.string(),
    basics: z.object({
      fullName: z.string(),
      role: z.string(),
      headline: z.string(),
      email: z.string(),
      phone: z.string(),
      location: z.string(),
      linkEmail: z.boolean(),
      linkPhone: z.boolean(),
      linkLocation: z.boolean(),
    }),

    links: z.object({
      displayMode: z.enum(["icon", "url", "icon-username"]),
      items: z.array(
        z.object({
          id: z.string(),
          type: resumeLinkTypeSchema,
          label: z.string(),
          url: z.string(),
        }),
      ),
    }),

    summary: z.string(),

    experience: z.array(
      z.object({
        id: z.string(),
        company: z.string(),
        role: z.string(),
        location: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        current: z.boolean(),
        summary: z.string(),
        highlights: z.array(z.string()),
      }),
    ),

    education: z.array(
      z.object({
        id: z.string(),
        school: z.string(),
        degree: z.string(),
        field: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        current: z.boolean(),
        summary: z.string(),
      }),
    ),

    projects: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        role: z.string(),
        link: z.string(),
        summary: z.string(),
        highlights: z.array(z.string()),
      }),
    ),

    skills: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        keywords: z.array(z.string()),
      }),
    ),

    customSections: z.array(
      z.object({
        id: z.string(),
        kind: resumeAdditionalSectionKindSchema,
        title: z.string(),
        editableTitle: z.boolean().optional(),
        items: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            issuer: z.string(),
            date: z.string(),
            link: z.string(),
            referenceId: z.string(),
            description: z.string(),
            details: z.array(z.string()),
          }),
        ),
      }),
    ),

    sections: z.array(
      z.object({
        id: resumeSectionIdSchema,
        label: z.string(),
        visible: z.boolean(),
        order: z.number(),
      }),
    ),

    customization: z.object({
      accentColor: z.string(),
      textColor: z.string(),
      mutedTextColor: z.string(),
      pageBackgroundColor: z.string(),
      sectionBackgroundColor: z.string(),
      borderColor: z.string(),
      sectionHeadingColor: z.string(),
      fontFamily: resumeFontFamilySchema,
      sectionSpacing: z.number(),
      pagePadding: z.number(),
      bodyLineHeight: z.number(),
      headingLineHeight: z.number(),
    }),

    sync: z.object({
      enabled: z.boolean(),
      status: resumeSyncStatusSchema,
      cloudResumeId: z.string().nullable(),
      lastSyncedAt: z.string().nullable(),
    }),
    updatedAt: z.string(),
  })
  .passthrough();

export const resumeDataSchema: z.ZodType<ResumeData> = resumeDataSchemaBase;

const resumeDataInputSchema = resumeDataSchemaBase.deepPartial();

export interface ResumeCollection {
  version: 1;
  items: Record<string, ResumeData>;
}

const resumeCollectionInputSchema = z
  .object({
    version: z.number().optional(),
    items: z.record(z.unknown()),
  })
  .passthrough();

export function parseResumeDataInput(value: unknown) {
  const result = resumeDataInputSchema.safeParse(value);

  if (!result.success) {
    return null;
  }

  return normalizeResumeData(result.data as Partial<ResumeData>);
}

export function parseResumeDataForExport(value: unknown) {
  const parsed = parseResumeDataInput(value);

  if (!parsed) {
    throw new Error("Resume payload is invalid");
  }

  return parsed;
}

export function parseResumeCollectionInput(value: unknown): ResumeCollection {
  const parsedCollection = resumeCollectionInputSchema.safeParse(value);

  if (!parsedCollection.success) {
    return {
      version: 1,
      items: {},
    };
  }

  const normalizedItems = Object.fromEntries(
    Object.entries(parsedCollection.data.items).flatMap(
      ([resumeId, resume]) => {
        const parsedResume = parseResumeDataInput(resume);

        if (!parsedResume) {
          return [];
        }

        return [[resumeId, parsedResume]];
      },
    ),
  );

  return {
    version: 1,
    items: normalizedItems,
  };
}
