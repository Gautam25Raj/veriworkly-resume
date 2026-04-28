import type { ReactNode } from "react";

import type { BaseSectionProps } from "./types";

import { ResumeSection } from "@/components/resume/Section";

export function renderSummarySection({
  resume,
  sectionKey,
  title,
  textClassName = "text-muted text-sm leading-[var(--resume-body-leading)]",
  wrapClassName,
}: BaseSectionProps & {
  textClassName?: string;
  wrapClassName?: string;
}): ReactNode {
  const content = (
    <ResumeSection key={sectionKey} title={title}>
      <p className={textClassName}>{resume.summary}</p>
    </ResumeSection>
  );

  if (!wrapClassName) {
    return content;
  }

  return (
    <div className={wrapClassName} key={sectionKey}>
      {content}
    </div>
  );
}
