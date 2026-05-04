import type {
  ResumeSection,
  ResumeAdditionalSectionKind,
} from "@/types/resume";
import type { TemplateRenderProps } from "@/types/template";

import { atsClassicStyles } from "../styles";

import { SectionHeading } from "./SectionHeading";

function getCustomSection(
  resume: TemplateRenderProps["resume"],
  kind: ResumeAdditionalSectionKind,
) {
  return resume.customSections.find((section) => section.kind === kind) ?? null;
}

export function renderAdditionalSection(
  resume: TemplateRenderProps["resume"],
  section: ResumeSection,
) {
  const kindMap: Partial<
    Record<ResumeSection["id"], ResumeAdditionalSectionKind>
  > = {
    certifications: "certifications",
    awards: "awards",
    publications: "publications",
    languages: "languages",
    custom: "custom",
  };

  const mappedKind = kindMap[section.id];

  if (!mappedKind) {
    return null;
  }

  const custom = getCustomSection(resume, mappedKind);

  if (!custom || !custom.items.length) {
    return null;
  }

  return (
    <section className={atsClassicStyles.section} key={section.id}>
      <SectionHeading title={custom.title} />
      <div className="space-y-2">
        {custom.items.map((item) => (
          <article className="space-y-1" key={item.id}>
            <p className="text-sm leading-(--resume-heading-leading) font-semibold text-(--resume-text)">
              {item.name}
            </p>

            <p className="text-sm leading-(--resume-body-leading) text-(--resume-muted)">
              {[item.issuer, item.referenceId, item.date]
                .filter(Boolean)
                .join(" | ")}
            </p>

            {item.description ? (
              <p className={atsClassicStyles.bodyText}>{item.description}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
