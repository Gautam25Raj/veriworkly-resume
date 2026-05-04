import type { ReactNode } from "react";

import type { BaseSectionProps } from "./types";

import { getCustomSection } from "./helpers";
import { ResumeSection } from "@/components/resume/Section";

export function renderLanguagesSection({
  resume,
  sectionKey,
  title,
  textClassName = "text-muted text-sm leading-[var(--resume-body-leading)]",
}: BaseSectionProps & {
  textClassName?: string;
}): ReactNode | null {
  const languages = getCustomSection(resume, "languages");

  if (!languages || !languages.items.length) {
    return null;
  }

  return (
    <ResumeSection key={sectionKey} title={title}>
      <ul className="space-y-2">
        {languages.items.map((item) => (
          <li className={textClassName} key={item.id}>
            <span className="text-foreground font-medium">{item.name}</span>
            {item.referenceId ? ` • ${item.referenceId}` : ""}
          </li>
        ))}
      </ul>
    </ResumeSection>
  );
}
