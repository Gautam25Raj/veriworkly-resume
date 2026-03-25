import type {
  ResumeData,
  ResumeSection,
  ResumeProjectItem,
  ResumeEducationItem,
  ResumeExperienceItem,
} from "@/types/resume";

import type { ReactNode } from "react";

export interface CompactBaseProps {
  resume: ResumeData;
  title: string;
  sectionClassName: string;
  bodyTextClassName: string;
  renderHeading: (title: string) => ReactNode;
}

export interface CompactExperienceProps extends CompactBaseProps {
  metaTextClassName: string;
  locationTextClassName: string;
  formatTitle: (item: ResumeExperienceItem) => string;
  formatRange?: (item: ResumeExperienceItem) => ReactNode;
  containerClassName?: string;
  itemClassName?: string;
  highlightsClassName?: string;
}

export interface CompactEducationProps extends CompactBaseProps {
  metaTextClassName: string;
  formatPrimary: (item: ResumeEducationItem) => string;
  formatSecondary: (item: ResumeEducationItem) => string;
  formatRange?: (item: ResumeEducationItem) => ReactNode;
  containerClassName?: string;
  itemClassName?: string;
}

export interface CompactProjectsProps extends CompactBaseProps {
  projectTitle: (item: ResumeProjectItem) => ReactNode;
  projectRightMeta?: (item: ResumeProjectItem) => ReactNode;
  containerClassName?: string;
  itemClassName?: string;
  highlightsClassName?: string;
}

export interface CompactAdditionalProps {
  resume: ResumeData;
  section: ResumeSection;
  sectionClassName: string;
  bodyTextClassName: string;
  metaTextClassName: string;
  renderHeading: (title: string) => ReactNode;
}
