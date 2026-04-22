import type { ReactNode } from "react";
import { Fragment } from "react";

import type { ResumeSectionId } from "@/types/resume";
import type { TemplateRenderProps } from "@/types/template";

import { ResumeHeader } from "@/components/resume/Header";

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

import { BaseShell } from "@/components/resume/BaseShell";

import { getOrderedSections } from "@/utils/resume";

import {
  splitSectionsByPlacement,
  TEMPLATE_SECTION_PLACEMENT,
} from "@/templates/modern-core/shared/section-placement";
import { modernStyles } from "@/templates/modern-core/templates/modern/styles";

export default function ModernTemplate(
  props: TemplateRenderProps | null | undefined = undefined,
) {
  const { className, resume } = props ?? {};

  if (!resume) {
    return null;
  }

  const orderedVisibleSections = getOrderedSections(resume.sections);
  const showHeaderLinks = orderedVisibleSections.some(
    (section) => section.id === "links",
  );

  const mainSectionRenderers: Partial<
    Record<ResumeSectionId, () => ReactNode>
  > = {
    summary: () =>
      renderSummarySection({
        resume,
        sectionKey: "summary",
        title: "Summary",
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

  const sidebarSectionRenderers: Partial<
    Record<ResumeSectionId, () => ReactNode>
  > = {
    skills: () =>
      renderSkillsSection({
        resume,
        sectionKey: "skills",
        title: "Skills",
      }),
    education: () =>
      renderEducationSection({
        resume,
        sectionKey: "education",
        title: "Education",
      }),
    languages: () =>
      renderLanguagesSection({
        resume,
        sectionKey: "languages",
        title: "Languages",
      }),
    certifications: () =>
      renderCertificationsSection({
        resume,
        sectionKey: "certifications",
        title: "Certifications",
        variant: "compact",
      }),
    awards: () =>
      renderAwardsSection({
        resume,
        sectionKey: "awards",
        title: "Awards",
        variant: "compact",
      }),
  };

  const { main: orderedMain, sidebar: orderedSidebar } =
    splitSectionsByPlacement(
      orderedVisibleSections,
      TEMPLATE_SECTION_PLACEMENT.modern,
    );

  return (
    <BaseShell
      customization={resume.customization}
      className={[modernStyles.wrapper, className].filter(Boolean).join(" ")}
    >
      {orderedVisibleSections.some((section) => section.id === "basics") ? (
        <ResumeHeader
          basics={resume.basics}
          links={resume.links}
          showLinks={showHeaderLinks}
        />
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.75fr_1fr]">
        <div className={modernStyles.content}>
          {orderedMain.map((section) => {
            const renderSection = mainSectionRenderers[section.id];
            return (
              <Fragment key={section.id}>
                {renderSection ? renderSection() : null}
              </Fragment>
            );
          })}
        </div>

        <div className={modernStyles.sidebar}>
          {orderedSidebar.map((section) => {
            const renderSection = sidebarSectionRenderers[section.id];
            return (
              <Fragment key={section.id}>
                {renderSection ? renderSection() : null}
              </Fragment>
            );
          })}
        </div>
      </div>
    </BaseShell>
  );
}
