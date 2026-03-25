import type { TemplateRenderProps } from "@/types/template";

import { academicSerifStyles } from "./styles";

import {
  HeaderSection,
  SummarySection,
  ProjectsSection,
  EducationSection,
  ExperienceSection,
  SkillsSummarySection,
  AcademicAdditionalSection,
} from "./components";

import { getOrderedSections } from "@/utils/resume";
import { BaseShell } from "@/components/resume/BaseShell";

export default function AcademicSerifTemplate({
  className,
  resume,
}: TemplateRenderProps) {
  const orderedVisibleSections = getOrderedSections(resume.sections);

  const customSectionTitle =
    resume.customSections.find((section) => section.kind === "custom")?.title ||
    "Volunteer Experience";

  return (
    <BaseShell
      customization={resume.customization}
      className={[academicSerifStyles.wrapper, className]
        .filter(Boolean)
        .join(" ")}
    >
      {orderedVisibleSections.map((section) => {
        if (section.id === "basics") {
          return <HeaderSection key={section.id} resume={resume} />;
        }

        if (section.id === "links") {
          return null;
        }

        if (section.id === "education") {
          return <EducationSection key={section.id} resume={resume} />;
        }

        if (section.id === "skills") {
          return <SkillsSummarySection key={section.id} resume={resume} />;
        }

        if (section.id === "experience") {
          return <ExperienceSection key={section.id} resume={resume} />;
        }

        if (section.id === "projects") {
          return <ProjectsSection key={section.id} resume={resume} />;
        }

        if (section.id === "publications") {
          return (
            <AcademicAdditionalSection
              key={section.id}
              kind="publications"
              resume={resume}
              title="Publications"
            />
          );
        }

        if (section.id === "awards") {
          return (
            <AcademicAdditionalSection
              key={section.id}
              kind="awards"
              resume={resume}
              title="Honors and Awards"
            />
          );
        }

        if (section.id === "custom") {
          return (
            <AcademicAdditionalSection
              key={section.id}
              kind="custom"
              resume={resume}
              title={customSectionTitle}
            />
          );
        }

        if (section.id === "certifications") {
          return (
            <AcademicAdditionalSection
              key={section.id}
              kind="certifications"
              resume={resume}
              title="Certifications"
            />
          );
        }

        if (section.id === "languages") {
          return (
            <AcademicAdditionalSection
              key={section.id}
              kind="languages"
              resume={resume}
              title="Languages"
            />
          );
        }

        if (section.id === "summary") {
          return <SummarySection key={section.id} resume={resume} />;
        }

        return null;
      })}
    </BaseShell>
  );
}
