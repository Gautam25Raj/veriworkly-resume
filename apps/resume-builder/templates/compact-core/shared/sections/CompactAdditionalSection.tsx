import type {
  ResumeSection,
  ResumeAdditionalSectionKind,
} from "@/types/resume";

import { getCustomSection } from "./helpers";
import type { CompactAdditionalProps } from "./types";

export function CompactAdditionalSection({
  resume,
  section,
  sectionClassName,
  bodyTextClassName,
  metaTextClassName,
  renderHeading,
}: CompactAdditionalProps) {
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
    <section className={sectionClassName}>
      {renderHeading(custom.title)}
      <div className="space-y-2">
        {custom.items.map((item) => (
          <article className="space-y-1" key={item.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm leading-(--resume-heading-leading) font-semibold text-(--resume-text)">
                {item.name}
              </p>

              {item.date ? (
                <p className={metaTextClassName}>{item.date}</p>
              ) : null}
            </div>

            {[item.issuer, item.referenceId].filter(Boolean).length ? (
              <p className={bodyTextClassName}>
                {[item.issuer, item.referenceId].filter(Boolean).join(" | ")}
              </p>
            ) : null}

            {item.description ? (
              <p className={bodyTextClassName}>{item.description}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
