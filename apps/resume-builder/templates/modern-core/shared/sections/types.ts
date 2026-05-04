import type { ResumeData } from "@/types/resume";

export interface BaseSectionProps {
  resume: ResumeData;
  sectionKey: string;
  title: string;
}

export type CertificationVariant = "full" | "compact" | "issuer-only";
export type AwardsVariant = "full" | "compact" | "description-only";
export type PublicationsVariant = "full" | "description-only";
