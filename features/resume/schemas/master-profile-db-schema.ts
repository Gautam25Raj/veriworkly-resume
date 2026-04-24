import { z } from "zod";

import { normalizeResumeFontFamilyId } from "@/features/resume/constants/resume-fonts";

const languageSchema = z.object({
  id: z.string(),
  language: z.string().min(1),
  fluency: z.enum([
    "elementary",
    "limited",
    "professional",
    "fluent",
    "native",
  ]),
});

const interestSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  keywords: z.array(z.string()),
});

const awardSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  awarder: z.string().min(1),
  date: z.string(),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string(),
  showLink: z.boolean(),
});

const certificateSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string(),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string(),
  showLink: z.boolean(),
});

const publicationSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  publisher: z.string().min(1),
  date: z.string(),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string(),
  showLink: z.boolean(),
});

const volunteerSchema = z.object({
  id: z.string(),
  organization: z.string().min(1),
  role: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  location: z.string(),
  summary: z.string(),
});

const referenceSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  title: z.string().min(1),
  organization: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  relationship: z.string().min(1),
});

const achievementSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string(),
});

const customItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
  link: z.string(),
  referenceId: z.string(),
  description: z.string(),
  details: z.array(z.string()),
});

const customSectionSchema = z.object({
  id: z.string(),
  kind: z.enum([
    "certifications",
    "awards",
    "publications",
    "languages",
    "interests",
    "volunteer",
    "references",
    "achievements",
    "custom",
  ]),
  title: z.string(),
  items: z.array(customItemSchema),
  editableTitle: z.boolean().optional(),
});

const sectionSchema = z.object({
  id: z.enum([
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
  ]),
  label: z.string(),
  visible: z.boolean(),
  order: z.number(),
});

const customizationSchema = z.object({
  accentColor: z.string(),
  textColor: z.string(),
  mutedTextColor: z.string(),
  pageBackgroundColor: z.string(),
  sectionBackgroundColor: z.string(),
  borderColor: z.string(),
  sectionHeadingColor: z.string(),
  fontFamily: z
    .string()
    .trim()
    .min(1)
    .max(32)
    .transform((value) => normalizeResumeFontFamilyId(value)),
  sectionSpacing: z.number(),
  pagePadding: z.number(),
  bodyLineHeight: z.number(),
  headingLineHeight: z.number(),
});

const masterProfileDbSchemaBase = z.object({
  templateId: z.string(),
  basics: z.object({
    fullName: z.string(),
    role: z.string(),
    headline: z.string(),
    email: z.string().email(),
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
        type: z.enum([
          "github",
          "linkedin",
          "dribbble",
          "twitter",
          "portfolio",
          "behance",
          "medium",
          "youtube",
          "custom",
        ]),
        label: z.string(),
        url: z.string().url(),
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
      link: z.string().url().or(z.literal("")),
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
  languages: z.array(languageSchema).default([]),
  interests: z.array(interestSchema).default([]),
  awards: z.array(awardSchema).default([]),
  certificates: z.array(certificateSchema).default([]),
  publications: z.array(publicationSchema).default([]),
  volunteer: z.array(volunteerSchema).default([]),
  references: z.array(referenceSchema).default([]),
  achievements: z.array(achievementSchema).default([]),
  customSections: z.array(customSectionSchema).default([]),
  sections: z.array(sectionSchema).default([]),
  customization: customizationSchema,
  updatedAt: z.string().optional(),
});

export const masterProfileDbSchema = masterProfileDbSchemaBase.passthrough();
