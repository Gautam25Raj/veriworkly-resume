import type { ReactNode } from "react";

import type { BaseSectionProps } from "./types";

import { ResumeSection } from "@/components/resume/Section";
import { ExperienceItem } from "@/components/resume/ExperienceItem";

export function renderExperienceSection({
  resume,
  sectionKey,
  title,
  containerClassName,
}: BaseSectionProps & {
  containerClassName?: string;
}): ReactNode | null {
  if (!resume.experience.length) {
    return null;
  }

  const items = resume.experience.map((item) => (
    <ExperienceItem item={item} key={item.id} />
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
