import type { ResumeSectionId } from "@/types/resume";

export const RESUME_STORAGE_KEY = "veriworkly:resume";
export const RESUME_COLLECTION_STORAGE_KEY = "veriworkly:resumes";
export const RESUME_ACTIVE_ID_STORAGE_KEY = "veriworkly:active-resume-id";

export const SECTION_LABELS: Record<ResumeSectionId, string> = {
  basics: "Basics",
  links: "Links",
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  certifications: "Certifications",
  awards: "Awards",
  publications: "Publications",
  languages: "Languages",
  custom: "Custom",
};
