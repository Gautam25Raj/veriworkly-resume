import type { ResumeSectionId } from "@/types/resume";

export const RESUME_STORAGE_KEY = "veriworkly:resume";
export const RESUME_COLLECTION_STORAGE_KEY = "veriworkly:resumes";
export const RESUME_ACTIVE_ID_STORAGE_KEY = "veriworkly:active-resume-id";

export const WORKSPACE_SETTINGS_STORAGE_KEY = "veriworkly:workspace-settings";

export const MASTER_PROFILE_STORAGE_KEY = "veriworkly:master-profile";

const NEXT_PUBLIC_BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "";

const INTERNAL_BACKEND_BASE_URL =
  process.env.BACKEND_INTERNAL_URL?.replace(/\/$/, "") || "";

export const BACKEND_BASE_URL =
  typeof window === "undefined"
    ? INTERNAL_BACKEND_BASE_URL || NEXT_PUBLIC_BACKEND_BASE_URL
    : NEXT_PUBLIC_BACKEND_BASE_URL;

export function backendApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!BACKEND_BASE_URL) {
    throw new Error(
      "Backend base URL is not configured. Set NEXT_PUBLIC_BACKEND_URL and optionally BACKEND_INTERNAL_URL for server-side runtime.",
    );
  }

  return `${BACKEND_BASE_URL}${normalizedPath}`;
}

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
