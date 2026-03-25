import type {
  ResumeData,
  ResumeAdditionalItem,
  ResumeAdditionalSectionKind,
} from "@/types/resume";

import { getAdditionalSection } from "./helpers";
import { academicSerifStyles } from "../../styles";

function AdditionalListSection({
  title,
  items,
}: {
  title: string;
  items: ResumeAdditionalItem[];
}) {
  if (!items.length) {
    return null;
  }

  return (
    <section className={academicSerifStyles.section}>
      <h2 className={academicSerifStyles.sectionTitle}>{title}</h2>

      <ul className="ml-5 list-disc space-y-1 text-[9.5pt] leading-(--resume-body-leading) text-(--resume-muted)">
        {items.map((item) => (
          <li key={item.id}>
            <span className="font-bold text-(--resume-text) italic">
              {item.name}
              {[item.issuer, item.date].filter(Boolean).length ? ": " : ""}
            </span>

            {[item.issuer, item.date].filter(Boolean).join(" - ")}
            {item.description ? ` ${item.description}` : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AcademicAdditionalSection({
  resume,
  kind,
  title,
}: {
  resume: ResumeData;
  kind: ResumeAdditionalSectionKind;
  title: string;
}) {
  const section = getAdditionalSection(resume, kind);

  if (!section) {
    return null;
  }

  return <AdditionalListSection items={section.items} title={title} />;
}
