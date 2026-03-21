import type { ReactNode } from "react";

import type { AwardsVariant, BaseSectionProps } from "./types";

import { getCustomSection } from "./helpers";

import { ResumeSection } from "@/components/resume/Section";

export function renderAwardsSection({
  resume,
  sectionKey,
  title,
  variant = "full",
}: BaseSectionProps & {
  variant?: AwardsVariant;
}): ReactNode | null {
  const awards = getCustomSection(resume, "awards");

  if (!awards || !awards.items.length) {
    return null;
  }

  return (
    <ResumeSection key={sectionKey} title={title}>
      <div className={variant === "compact" ? "space-y-3" : "space-y-4"}>
        {awards.items.map((item) => (
          <article className="space-y-1" key={item.id}>
            <h3 className="text-foreground text-sm leading-(--resume-heading-leading) font-semibold">
              {item.name}
            </h3>

            {variant !== "description-only" ? (
              <p
                className={
                  variant === "compact"
                    ? "text-muted text-xs leading-(--resume-body-leading)"
                    : "text-muted text-sm leading-(--resume-body-leading)"
                }
              >
                {[item.issuer, item.date].filter(Boolean).join(" • ")}
              </p>
            ) : null}

            {(variant === "full" || variant === "description-only") &&
            item.description ? (
              <p
                className={
                  variant === "description-only"
                    ? "text-xs leading-(--resume-body-leading) text-(--resume-muted)"
                    : "text-muted text-sm leading-(--resume-body-leading)"
                }
              >
                {item.description}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </ResumeSection>
  );
}
