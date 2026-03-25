import type { ResumeData } from "@/types/resume";

import { formatRange } from "./helpers";
import { academicSerifStyles } from "../../styles";

export function ExperienceSection({ resume }: { resume: ResumeData }) {
  if (!resume.experience.length) {
    return null;
  }

  return (
    <section className={academicSerifStyles.section}>
      <h2 className={academicSerifStyles.sectionTitle}>Experience</h2>

      <div className="space-y-3">
        {resume.experience.map((item) => (
          <article key={item.id}>
            <div className="flex justify-between text-[10.5pt] font-bold text-(--resume-text)">
              <span>{item.company}</span>
              <span>{item.location}</span>
            </div>

            <div className="mb-1 flex justify-between text-[10pt] text-(--resume-muted) italic">
              <span>{item.role}</span>

              <span>
                {formatRange(item.startDate, item.endDate, item.current)}
              </span>
            </div>

            <ul className="ml-8 list-disc space-y-0.5 text-[9.5pt] leading-(--resume-body-leading) text-(--resume-muted)">
              {item.summary ? (
                <li>
                  <span className="font-bold text-(--resume-text) italic">
                    Summary:
                  </span>{" "}
                  {item.summary}
                </li>
              ) : null}

              {item.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
