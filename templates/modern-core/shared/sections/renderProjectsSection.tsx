import type { ReactNode } from "react";

import type { BaseSectionProps } from "./types";

import { ResumeSection } from "@/components/resume/Section";
import { ProjectItem } from "@/components/resume/ProjectItem";

export function renderProjectsSection({
  resume,
  sectionKey,
  title,
  containerClassName,
}: BaseSectionProps & {
  containerClassName?: string;
}): ReactNode | null {
  if (!resume.projects.length) {
    return null;
  }

  const items = resume.projects.map((item) => (
    <ProjectItem item={item} key={item.id} />
  ));

  return (
    <ResumeSection key={sectionKey} title={title}>
      {containerClassName ? (
        <div className={containerClassName}>{items}</div>
      ) : (
        items
      )}
    </ResumeSection>
  );
}
