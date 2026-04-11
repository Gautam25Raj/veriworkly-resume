import { z } from "zod";

const sectionIdSchema = z.enum([
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
  "interests",
  "volunteer",
  "references",
  "achievements",
  "custom",
]);

const linkTypeSchema = z.enum([
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

const customKindSchema = z.enum([
  "certifications",
  "awards",
  "publications",
  "languages",
  "interests",
  "volunteer",
  "references",
  "achievements",
  "custom",
]);

const urlOrEmptySchema = z.string().url().or(z.literal(""));

const additionalItemSchema = z
  .object({
    id: z.string().trim().min(1).max(128),
    name: z.string().max(200),
    issuer: z.string().max(200),
    date: z.string().max(40),
    link: z.string().max(2048),
    referenceId: z.string().max(200),
    description: z.string().max(5000),
    details: z.array(z.string().max(500)).max(50),
  })
  .strict();

const customSectionSchema = z
  .object({
    id: z.string().trim().min(1).max(128),
    kind: customKindSchema,
    title: z.string().max(120),
    items: z.array(additionalItemSchema).max(200),
    editableTitle: z.boolean().optional(),
  })
  .strict();

const sectionSchema = z
  .object({
    id: sectionIdSchema,
    label: z.string().max(80),
    visible: z.boolean(),
    order: z.number().int().min(0).max(1000),
  })
  .strict();

const masterProfileContentSchema = z
  .object({
    templateId: z.string().trim().min(1).max(64),
    basics: z
      .object({
        fullName: z.string().max(120),
        role: z.string().max(120),
        headline: z.string().max(250),
        email: z.string().email(),
        phone: z.string().max(40),
        location: z.string().max(120),
        linkEmail: z.boolean(),
        linkPhone: z.boolean(),
        linkLocation: z.boolean(),
      })
      .strict(),
    links: z
      .object({
        displayMode: z.enum(["icon", "url", "icon-username"]),
        items: z
          .array(
            z
              .object({
                id: z.string().trim().min(1).max(128),
                type: linkTypeSchema,
                label: z.string().max(80),
                url: urlOrEmptySchema,
              })
              .strict(),
          )
          .max(50),
      })
      .strict(),
    summary: z.string().max(8000),
    experience: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            company: z.string().max(160),
            role: z.string().max(160),
            location: z.string().max(120),
            startDate: z.string().max(40),
            endDate: z.string().max(40),
            current: z.boolean(),
            summary: z.string().max(5000),
            highlights: z.array(z.string().max(400)).max(50),
          })
          .strict(),
      )
      .max(200),
    education: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            school: z.string().max(160),
            degree: z.string().max(160),
            field: z.string().max(160),
            startDate: z.string().max(40),
            endDate: z.string().max(40),
            current: z.boolean(),
            summary: z.string().max(5000),
          })
          .strict(),
      )
      .max(200),
    projects: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            name: z.string().max(160),
            role: z.string().max(160),
            link: urlOrEmptySchema,
            summary: z.string().max(5000),
            highlights: z.array(z.string().max(400)).max(50),
          })
          .strict(),
      )
      .max(200),
    skills: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            name: z.string().max(120),
            keywords: z.array(z.string().max(80)).max(100),
          })
          .strict(),
      )
      .max(200),
    languages: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            language: z.string().max(80),
            fluency: z.enum(["elementary", "limited", "professional", "fluent", "native"]),
          })
          .strict(),
      )
      .max(200),
    interests: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            name: z.string().max(120),
            keywords: z.array(z.string().max(80)).max(100),
          })
          .strict(),
      )
      .max(200),
    awards: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            title: z.string().max(200),
            awarder: z.string().max(200),
            date: z.string().max(40),
            website: urlOrEmptySchema.optional(),
            description: z.string().max(5000),
            showLink: z.boolean(),
          })
          .strict(),
      )
      .max(200),
    certificates: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            title: z.string().max(200),
            issuer: z.string().max(200),
            date: z.string().max(40),
            website: urlOrEmptySchema.optional(),
            description: z.string().max(5000),
            showLink: z.boolean(),
          })
          .strict(),
      )
      .max(200),
    publications: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            title: z.string().max(200),
            publisher: z.string().max(200),
            date: z.string().max(40),
            website: urlOrEmptySchema.optional(),
            description: z.string().max(5000),
            showLink: z.boolean(),
          })
          .strict(),
      )
      .max(200),
    volunteer: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            organization: z.string().max(200),
            role: z.string().max(160),
            startDate: z.string().max(40),
            endDate: z.string().max(40),
            current: z.boolean(),
            location: z.string().max(120),
            summary: z.string().max(5000),
          })
          .strict(),
      )
      .max(200),
    references: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            name: z.string().max(160),
            title: z.string().max(160),
            organization: z.string().max(200),
            email: z.string().email().or(z.literal("")),
            phone: z.string().max(40).or(z.literal("")),
            relationship: z.string().max(200),
          })
          .strict(),
      )
      .max(200),
    achievements: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            title: z.string().max(200),
            description: z.string().max(5000),
          })
          .strict(),
      )
      .max(200),
    customSections: z.array(customSectionSchema).max(200),
    sections: z.array(sectionSchema).max(200),
    customization: z
      .object({
        accentColor: z.string().max(32),
        textColor: z.string().max(32),
        mutedTextColor: z.string().max(32),
        pageBackgroundColor: z.string().max(32),
        sectionBackgroundColor: z.string().max(32),
        borderColor: z.string().max(32),
        sectionHeadingColor: z.string().max(32),
        fontFamily: z.enum(["geist", "serif", "mono", "modern"]),
        sectionSpacing: z.number().min(0).max(120),
        pagePadding: z.number().min(0).max(120),
        bodyLineHeight: z.number().min(1).max(3),
        headingLineHeight: z.number().min(1).max(3),
      })
      .strict(),
    updatedAt: z.string().datetime().optional(),
  })
  .strict();

export const masterProfilePayloadSchema = z
  .object({
    profile: masterProfileContentSchema,
    expectedUpdatedAt: z.string().datetime().optional(),
  })
  .strict();

export type MasterProfilePayload = z.infer<typeof masterProfilePayloadSchema>;
