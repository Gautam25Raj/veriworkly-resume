import type { ReactNode } from "react";

import type { BaseSectionProps, PublicationsVariant } from "./types";

import { getCustomSection } from "./helpers";
import { ResumeSection } from "@/components/resume/Section";

export function renderPublicationsSection({
  resume,
  sectionKey,
  title,
  variant = "full",
}: BaseSectionProps & {
  variant?: PublicationsVariant;
}): ReactNode | null {
  const publications = getCustomSection(resume, "publications");

  if (!publications || !publications.items.length) {
    return null;
  }

  return (
    <ResumeSection key={sectionKey} title={title}>
      <div className="space-y-4">
        {publications.items.map((item) => (
          <article className="space-y-1" key={item.id}>
            <h3 className="text-foreground text-sm leading-(--resume-heading-leading) font-semibold">
              {item.name}
            </h3>

            {variant === "full" ? (
              <>
                <p className="text-muted text-sm leading-(--resume-body-leading)">
                  {[item.issuer, item.date].filter(Boolean).join(" • ")}
                </p>

                {item.link ? (
                  <a
                    className="text-accent text-xs font-medium"
                    href={item.link}
                    rel="noreferrer"
                    target="_blank"
                  >
                    View Publication
                  </a>
                ) : null}
              </>
            ) : item.description ? (
              <p className="text-xs leading-(--resume-body-leading) text-(--resume-muted)">
                {item.description}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </ResumeSection>
  );
}
