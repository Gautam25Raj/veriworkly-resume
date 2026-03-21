import type { ReactNode } from "react";

import type { BaseSectionProps, CertificationVariant } from "./types";

import { getCustomSection } from "./helpers";
import { ResumeSection } from "@/components/resume/Section";

export function renderCertificationsSection({
  resume,
  sectionKey,
  title,
  variant = "full",
}: BaseSectionProps & {
  variant?: CertificationVariant;
}): ReactNode | null {
  const certifications = getCustomSection(resume, "certifications");

  if (!certifications || !certifications.items.length) {
    return null;
  }

  return (
    <ResumeSection key={sectionKey} title={title}>
      <div className={variant === "compact" ? "space-y-3" : "space-y-4"}>
        {certifications.items.map((item) => (
          <article className="space-y-1" key={item.id}>
            <h3 className="text-foreground text-sm leading-(--resume-heading-leading) font-semibold">
              {item.name}
            </h3>

            {variant === "issuer-only" ? (
              item.issuer ? (
                <p className="text-xs leading-(--resume-body-leading) text-(--resume-muted)">
                  {item.issuer}
                </p>
              ) : null
            ) : (
              <p
                className={
                  variant === "compact"
                    ? "text-muted text-xs leading-(--resume-body-leading)"
                    : "text-muted text-sm leading-(--resume-body-leading)"
                }
              >
                {[item.issuer, item.referenceId].filter(Boolean).join(" • ")}
              </p>
            )}

            {variant === "full" && item.link ? (
              <a
                className="text-accent text-xs font-medium"
                href={item.link}
                rel="noreferrer"
                target="_blank"
              >
                Verify Credential
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </ResumeSection>
  );
}
