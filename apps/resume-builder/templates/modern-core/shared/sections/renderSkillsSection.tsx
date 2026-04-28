import type { ReactNode } from "react";

import type { BaseSectionProps } from "./types";

import { SkillItem } from "@/components/resume/SkillItem";
import { ResumeSection } from "@/components/resume/Section";

export function renderSkillsSection({
  resume,
  sectionKey,
  title,
  containerClassName,
}: BaseSectionProps & {
  containerClassName?: string;
}): ReactNode | null {
  if (!resume.skills.length) {
    return null;
  }

  const items = resume.skills.map((item) => (
    <SkillItem item={item} key={item.id} />
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
