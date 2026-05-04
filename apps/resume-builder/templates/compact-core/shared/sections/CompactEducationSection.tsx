import type { ResumeEducationItem } from "@/types/resume";

import { defaultRange } from "./helpers";
import type { CompactEducationProps } from "./types";

export function CompactEducationSection({
  resume,
  title,
  sectionClassName,
  bodyTextClassName,
  renderHeading,
  metaTextClassName,
  formatPrimary,
  formatSecondary,
  formatRange,
  containerClassName,
  itemClassName,
}: CompactEducationProps) {
  if (!resume.education.length) {
    return null;
  }

  const range =
    formatRange ??
    ((item: ResumeEducationItem) =>
      defaultRange(item.startDate, item.endDate, item.current));

  return (
    <section className={sectionClassName}>
      {renderHeading(title)}
      <div className={containerClassName ?? "space-y-2"}>
        {resume.education.map((item) => (
          <article className={itemClassName ?? "space-y-1"} key={item.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm leading-(--resume-heading-leading) font-semibold text-(--resume-text)">
                {formatPrimary(item)}
              </p>

              <p className={metaTextClassName}>{range(item)}</p>
            </div>

            <p className={bodyTextClassName}>{formatSecondary(item)}</p>

            {item.summary ? (
              <p className={bodyTextClassName}>{item.summary}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
