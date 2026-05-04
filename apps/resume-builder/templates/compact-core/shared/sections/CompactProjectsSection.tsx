import type { CompactProjectsProps } from "./types";

export function CompactProjectsSection({
  resume,
  title,
  sectionClassName,
  bodyTextClassName,
  renderHeading,
  projectTitle,
  projectRightMeta,
  containerClassName,
  itemClassName,
  highlightsClassName,
}: CompactProjectsProps) {
  if (!resume.projects.length) {
    return null;
  }

  return (
    <section className={sectionClassName}>
      {renderHeading(title)}
      <div className={containerClassName ?? "space-y-2"}>
        {resume.projects.map((item) => (
          <article className={itemClassName ?? "space-y-1"} key={item.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              {projectTitle(item)}
              {projectRightMeta ? projectRightMeta(item) : null}
            </div>

            <p className={bodyTextClassName}>{item.summary}</p>

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
