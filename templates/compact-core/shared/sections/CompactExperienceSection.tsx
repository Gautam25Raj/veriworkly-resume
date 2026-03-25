import type { ResumeExperienceItem } from "@/types/resume";

import { defaultRange } from "./helpers";
import type { CompactExperienceProps } from "./types";

export function CompactExperienceSection({
  resume,
  title,
  sectionClassName,
  bodyTextClassName,
  renderHeading,
  metaTextClassName,
  formatTitle,
  formatRange,
  locationTextClassName,
  containerClassName,
  itemClassName,
  highlightsClassName,
}: CompactExperienceProps) {
  if (!resume.experience.length) {
    return null;
  }

  const range =
    formatRange ??
    ((item: ResumeExperienceItem) =>
      defaultRange(item.startDate, item.endDate, item.current));

  return (
    <section className={sectionClassName}>
      {renderHeading(title)}
      <div className={containerClassName ?? "space-y-3"}>
        {resume.experience.map((item) => (
          <article className={itemClassName ?? "space-y-1"} key={item.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm leading-(--resume-heading-leading) font-semibold text-(--resume-text)">
                {formatTitle(item)}
              </p>

              <p className={metaTextClassName}>{range(item)}</p>
            </div>

            <p className={locationTextClassName}>{item.location}</p>

            {item.summary ? (
              <p className={bodyTextClassName}>{item.summary}</p>
            ) : null}

            {item.highlights.length ? (
              <ul
                className={
                  highlightsClassName ??
                  "list-disc space-y-1 pl-5 text-sm leading-(--resume-body-leading) text-(--resume-muted)"
                }
              >
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
