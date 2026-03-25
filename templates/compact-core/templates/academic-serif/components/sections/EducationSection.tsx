import type { ResumeData } from "@/types/resume";

import { formatRange } from "./helpers";
import { academicSerifStyles } from "../../styles";

export function EducationSection({ resume }: { resume: ResumeData }) {
  if (!resume.education.length) {
    return null;
  }

  return (
    <section className={academicSerifStyles.section}>
      <h2 className={academicSerifStyles.sectionTitle}>Education</h2>

      <div className="space-y-2">
        {resume.education.map((item) => (
          <article key={item.id}>
            <div className="flex justify-between text-[10.5pt] font-bold text-(--resume-text)">
              <span>{item.school}</span>
              <span>{resume.basics.location}</span>
            </div>

            <div className="flex justify-between text-[10pt] text-(--resume-muted) italic">
              <span>
                {item.degree} - {item.field}
              </span>

              <span>
                {formatRange(item.startDate, item.endDate, item.current)}
              </span>
            </div>

            {item.summary ? (
              <p className="mt-1 text-[9.5pt] leading-(--resume-body-leading) text-(--resume-muted)">
                <span className="font-bold text-(--resume-text) italic">
                  Courses:
                </span>{" "}
                {item.summary}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
