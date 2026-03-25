import type { ResumeData } from "@/types/resume";

import { academicSerifStyles } from "../../styles";

export function ProjectsSection({ resume }: { resume: ResumeData }) {
  if (!resume.projects.length) {
    return null;
  }

  return (
    <section className={academicSerifStyles.section}>
      <h2 className={academicSerifStyles.sectionTitle}>Projects</h2>

      <ul className="ml-5 list-disc space-y-1.5 text-[9.5pt] leading-(--resume-body-leading) text-(--resume-muted)">
        {resume.projects.map((item) => (
          <li key={item.id}>
            <span className="font-bold text-(--resume-text)">
              {item.name}
              {item.role ? ` (${item.role})` : ""}:
            </span>{" "}
            {item.summary}
            {item.highlights.length ? ` ${item.highlights.join(" ")}` : ""}
            {item.link ? (
              <>
                {" "}
                <a
                  className="underline"
                  href={item.link}
                  rel="noreferrer"
                  target="_blank"
                >
                  {item.link.replace(/^https?:\/\//, "")}
                </a>
              </>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
