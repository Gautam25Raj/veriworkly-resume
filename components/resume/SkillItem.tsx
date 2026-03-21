import type { ResumeSkillGroup } from "@/types/resume";

export function SkillItem({ item }: { item: ResumeSkillGroup }) {
  return (
    <article className="rounded-2xl border border-(--resume-border) bg-(--resume-section-bg) px-4 py-3">
      <h3 className="text-sm leading-(--resume-heading-leading) font-semibold text-(--resume-text)">
        {item.name}
      </h3>

      <p className="mt-2 text-sm leading-(--resume-body-leading) text-(--resume-muted)">
        {item.keywords.join(" • ")}
      </p>
    </article>
  );
}
