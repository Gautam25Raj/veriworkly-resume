import type { ResumeData } from "@/types/resume";

import { academicSerifStyles } from "../../styles";

export function SkillsSummarySection({ resume }: { resume: ResumeData }) {
  if (!resume.skills.length) {
    return null;
  }

  return (
    <section className={academicSerifStyles.section}>
      <h2 className={academicSerifStyles.sectionTitle}>Skills Summary</h2>

      <div className="space-y-0.5 text-[10pt] leading-(--resume-body-leading) text-(--resume-muted)">
        {resume.skills.map((skill) => (
          <p key={skill.id}>
            <span className="font-bold text-(--resume-text)">
              - {skill.name}:
            </span>{" "}
            {skill.keywords.join(", ")}
          </p>
        ))}
      </div>
    </section>
  );
}
