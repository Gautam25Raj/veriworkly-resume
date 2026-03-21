import type { ReactNode } from "react";

import type { ResumeSectionId } from "@/types/resume";
import type { TemplateRenderProps } from "@/types/template";

import {
  renderAwardsSection,
  renderCustomSection,
  renderSkillsSection,
  renderSummarySection,
  renderProjectsSection,
  renderEducationSection,
  renderLanguagesSection,
  renderExperienceSection,
  renderPublicationsSection,
  renderCertificationsSection,
} from "../../shared/shared-section-renderers";

import { getOrderedSections } from "@/utils/resume";

import { ResumeHeader } from "@/components/resume/Header";
import { BaseShell } from "@/components/resume/BaseShell";

import { minimalStyles } from "@/templates/modern-core/templates/minimal/styles";

export default function MinimalTemplate({
  className,
  resume,
}: TemplateRenderProps) {
  const orderedVisibleSections = getOrderedSections(resume.sections);
  const showHeaderLinks = orderedVisibleSections.some(
    (section) => section.id === "links",
  );

  const sectionRenderers: Partial<Record<ResumeSectionId, () => ReactNode>> = {
    basics: () => (
      <ResumeHeader
        basics={resume.basics}
        key="basics"
        links={resume.links}
        showLinks={showHeaderLinks}
      />
    ),
    links: () => null,
    summary: () =>
      renderSummarySection({
        resume,
        sectionKey: "summary",
        title: "Profile",
        wrapClassName: minimalStyles.mutedBlock,
      }),
    experience: () =>
      renderExperienceSection({
        resume,
        sectionKey: "experience",
        title: "Experience",
      }),
    projects: () =>
      renderProjectsSection({
        resume,
        sectionKey: "projects",
        title: "Projects",
      }),
    education: () =>
      renderEducationSection({
        resume,
        sectionKey: "education",
        title: "Education",
      }),
    skills: () =>
      renderSkillsSection({
        resume,
        sectionKey: "skills",
        title: "Skills",
      }),
    custom: () =>
      renderCustomSection({
        resume,
        sectionKey: "custom",
      }),
    certifications: () =>
      renderCertificationsSection({
        resume,
        sectionKey: "certifications",
        title: "Certifications",
        variant: "full",
      }),
    awards: () =>
      renderAwardsSection({
        resume,
        sectionKey: "awards",
        title: "Awards",
        variant: "full",
      }),
    publications: () =>
      renderPublicationsSection({
        resume,
        sectionKey: "publications",
        title: "Publications",
        variant: "full",
      }),
    languages: () =>
      renderLanguagesSection({
        resume,
        sectionKey: "languages",
        title: "Languages",
      }),
  };

  return (
    <BaseShell
      customization={resume.customization}
      className={[minimalStyles.wrapper, minimalStyles.stack, className]
        .filter(Boolean)
        .join(" ")}
    >
      {orderedVisibleSections.map((section) => {
        const renderSection = sectionRenderers[section.id];
        return renderSection ? renderSection() : null;
      })}
    </BaseShell>
  );
}
