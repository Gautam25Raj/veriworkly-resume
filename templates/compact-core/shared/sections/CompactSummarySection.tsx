import type { CompactBaseProps } from "./types";

export function CompactSummarySection({
  resume,
  title,
  sectionClassName,
  bodyTextClassName,
  renderHeading,
}: CompactBaseProps) {
  return (
    <section className={sectionClassName}>
      {renderHeading(title)}

      <p className={bodyTextClassName}>{resume.summary}</p>
    </section>
  );
}
