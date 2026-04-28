import type { ReactNode } from "react";

import type { BaseSectionProps } from "./types";

import { getCustomSection } from "./helpers";
import { ResumeSection } from "@/components/resume/Section";

export function renderCustomSection({
  resume,
  sectionKey,
  title,
  descriptionClassName = "text-muted text-sm leading-[var(--resume-body-leading)]",
  headingClassName = "text-foreground text-sm leading-[var(--resume-heading-leading)] font-semibold",
  linkClassName = "text-accent text-xs font-medium",
  showLink = true,
}: Omit<BaseSectionProps, "title"> & {
  title?: string;
  descriptionClassName?: string;
  headingClassName?: string;
  linkClassName?: string;
  showLink?: boolean;
}): ReactNode | null {
  const custom = getCustomSection(resume, "custom");

  if (!custom || !custom.items.length) {
    return null;
  }

  return (
    <ResumeSection key={sectionKey} title={title ?? custom.title}>
      <div className="space-y-4">
        {custom.items.map((item) => (
          <article className="space-y-1" key={item.id}>
            <h3 className={headingClassName}>{item.name}</h3>

            {item.description ? (
              <p className={descriptionClassName}>{item.description}</p>
            ) : null}

            {showLink && item.link ? (
              <a
                className={linkClassName}
                href={item.link}
                rel="noreferrer"
                target="_blank"
              >
                {item.link.replace(/^https?:\/\//, "")}
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </ResumeSection>
  );
}
