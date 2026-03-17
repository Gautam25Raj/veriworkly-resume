import type { ResumeSectionId } from "@/types/resume";

export const RESUME_STORAGE_KEY = "veriworkly:resume";

export const SECTION_LABELS: Record<ResumeSectionId, string> = {
  basics: "Basics",
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
};
