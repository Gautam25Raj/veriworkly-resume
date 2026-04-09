export type ResumeSectionId =
  | "basics"
  | "links"
  | "summary"
  | "experience"
  | "education"
  | "projects"
  | "skills"
  | "certifications"
  | "awards"
  | "publications"
  | "languages"
  | "custom";

export interface ResumeSection {
  id: ResumeSectionId;
  label: string;
  visible: boolean;
  order: number;
}

export interface ResumeBasics {
  fullName: string;
  role: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkEmail: boolean;
  linkPhone: boolean;
  linkLocation: boolean;
}

export type ResumeLinkType =
  | "github"
  | "linkedin"
  | "dribbble"
  | "twitter"
  | "portfolio"
  | "behance"
  | "medium"
  | "youtube"
  | "custom";

export type ResumeLinkDisplayMode = "icon" | "url" | "icon-username";

export interface ResumeLinkItem {
  id: string;
  type: ResumeLinkType;
  label: string;
  url: string;
}

export interface ResumeLinks {
  displayMode: ResumeLinkDisplayMode;
  items: ResumeLinkItem[];
}

export interface ResumeExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  summary: string;
  highlights: string[];
}

export interface ResumeEducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  summary: string;
}

export interface ResumeProjectItem {
  id: string;
  name: string;
  role: string;
  link: string;
  summary: string;
  highlights: string[];
}

export interface ResumeSkillGroup {
  id: string;
  name: string;
  keywords: string[];
}

export type ResumeAdditionalSectionKind =
  | "certifications"
  | "awards"
  | "publications"
  | "languages"
  | "custom";

export interface ResumeAdditionalItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
  referenceId: string;
  description: string;
  details: string[];
}

export interface ResumeCustomSection {
  id: string;
  kind: ResumeAdditionalSectionKind;
  title: string;
  items: ResumeAdditionalItem[];
  editableTitle?: boolean;
}

export interface ResumeCustomization {
  accentColor: string;
  textColor: string;
  mutedTextColor: string;
  pageBackgroundColor: string;
  sectionBackgroundColor: string;
  borderColor: string;
  sectionHeadingColor: string;
  fontFamily: "geist" | "serif" | "mono" | "modern";
  sectionSpacing: number;
  pagePadding: number;
  bodyLineHeight: number;
  headingLineHeight: number;
}

export type ResumeSyncStatus =
  | "local-only"
  | "pending"
  | "syncing"
  | "synced"
  | "conflicted";

export interface ResumeSyncState {
  enabled: boolean;
  status: ResumeSyncStatus;
  cloudResumeId: string | null;
  lastSyncedAt: string | null;
}

export interface ResumeData {
  id: string;
  templateId: string;
  basics: ResumeBasics;
  links: ResumeLinks;
  summary: string;
  experience: ResumeExperienceItem[];
  education: ResumeEducationItem[];
  projects: ResumeProjectItem[];
  skills: ResumeSkillGroup[];
  customSections: ResumeCustomSection[];
  sections: ResumeSection[];
  customization: ResumeCustomization;
  sync: ResumeSyncState;
  updatedAt: string;
}
