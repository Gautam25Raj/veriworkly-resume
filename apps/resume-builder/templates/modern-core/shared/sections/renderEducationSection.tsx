import type { ReactNode } from "react";

import type { BaseSectionProps } from "./types";

import { ResumeSection } from "@/components/resume/Section";
import { EducationItem } from "@/components/resume/EducationItem";

export function renderEducationSection({
  resume,
  sectionKey,
  title,
  containerClassName,
}: BaseSectionProps & {
  containerClassName?: string;
}): ReactNode | null {
  if (!resume.education.length) {
    return null;
  }

  const items = resume.education.map((item) => (
    <EducationItem item={item} key={item.id} />
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
