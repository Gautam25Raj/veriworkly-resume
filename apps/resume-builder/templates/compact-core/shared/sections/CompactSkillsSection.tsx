import type { CompactBaseProps } from "./types";

export function CompactSkillsSection({
  resume,
  title,
  sectionClassName,
  bodyTextClassName,
  renderHeading,
}: CompactBaseProps) {
  if (!resume.skills.length) {
    return null;
  }

  return (
    <section className={sectionClassName}>
      {renderHeading(title)}
      <div className="space-y-1">
        {resume.skills.map((skill) => (
          <p className={bodyTextClassName} key={skill.id}>
            <span className="font-semibold text-(--resume-text)">
              {skill.name}:
            </span>{" "}
            {skill.keywords.join(", ")}
          </p>
        ))}
      </div>
    </section>
  );
}
