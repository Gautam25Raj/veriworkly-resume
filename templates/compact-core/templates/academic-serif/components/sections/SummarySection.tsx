import type { ResumeData } from "@/types/resume";

import { academicSerifStyles } from "../../styles";

export function SummarySection({ resume }: { resume: ResumeData }) {
  if (!resume.summary) {
    return null;
  }

  return (
    <section className={academicSerifStyles.section}>
      <h2 className={academicSerifStyles.sectionTitle}>Summary</h2>
      <p className={academicSerifStyles.bodyText}>{resume.summary}</p>
    </section>
  );
}
