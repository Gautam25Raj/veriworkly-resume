import type { ReactNode } from "react";
import { Fragment } from "react";

import type { ResumeSectionId } from "@/types/resume";
import type { TemplateRenderProps } from "@/types/template";

import { executiveStyles } from "./styles";

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

import { BaseShell } from "@/components/resume/BaseShell";
import { ResumeHeader } from "@/components/resume/Header";

import {
  splitSectionsByPlacement,
  TEMPLATE_SECTION_PLACEMENT,
} from "@/templates/modern-core/shared/section-placement";

export default function ExecutiveTemplate(
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

  const sidebarSectionRenderers: Partial<
    Record<ResumeSectionId, () => ReactNode>
  > = {
    skills: () =>
      renderSkillsSection({
        resume,
        sectionKey: "skills",
        title: "Skills",
        containerClassName: "grid gap-3",
      }),

    education: () =>
      renderEducationSection({
        resume,
        sectionKey: "education",
        title: "Education",
        containerClassName: "space-y-6",
      }),

    languages: () =>
      renderLanguagesSection({
        resume,
        sectionKey: "languages",
        title: "Languages",
        textClassName: "text-sm",
      }),

    certifications: () =>
      renderCertificationsSection({
        resume,
        sectionKey: "certifications",
        title: "Certifications",
        variant: "issuer-only",
      }),
  };

  const mainSectionRenderers: Partial<
    Record<ResumeSectionId, () => ReactNode>
  > = {
    summary: () =>
      renderSummarySection({
        resume,
        sectionKey: "summary",
        title: "Profile",
        textClassName:
          "text-sm leading-[var(--resume-body-leading)] text-(--resume-muted)",
      }),

    experience: () =>
      renderExperienceSection({
        resume,
        sectionKey: "experience",
        title: "Work Experience",
        containerClassName: "space-y-6",
      }),

    projects: () =>
      renderProjectsSection({
        resume,
        sectionKey: "projects",
        title: "Key Projects",
        containerClassName: "space-y-6",
      }),

    awards: () =>
      renderAwardsSection({
        resume,
        sectionKey: "awards",
        title: "Awards",
        variant: "description-only",
      }),

    publications: () =>
      renderPublicationsSection({
        resume,
        sectionKey: "publications",
        title: "Publications",
        variant: "description-only",
      }),

    custom: () =>
      renderCustomSection({
        resume,
        sectionKey: "custom",
        descriptionClassName:
          "text-xs leading-[var(--resume-body-leading)] text-(--resume-muted)",
        headingClassName:
          "text-sm leading-[var(--resume-heading-leading)] font-semibold",
        showLink: false,
      }),
  };

  const { main: orderedMain, sidebar: orderedSidebar } =
    splitSectionsByPlacement(
      orderedVisibleSections,
      TEMPLATE_SECTION_PLACEMENT.executive,
    );

  return (
    <BaseShell
      customization={resume.customization}
      className={[executiveStyles.wrapper, className].filter(Boolean).join(" ")}
    >
      <div className={executiveStyles.container}>
        <aside className={executiveStyles.sidebar}>
          {orderedSidebar.map((section) => {
            const renderSection = sidebarSectionRenderers[section.id];
            return (
              <Fragment key={section.id}>
                {renderSection ? renderSection() : null}
              </Fragment>
            );
          })}
        </aside>

        <main className={executiveStyles.main}>
          {orderedVisibleSections.some((s) => s.id === "basics") && (
            <ResumeHeader
              basics={resume.basics}
              links={resume.links}
              showLinks={showHeaderLinks}
            />
          )}

          <div className="mt-8 space-y-(--section-gap)">
            {orderedMain.map((section) => {
              const renderSection = mainSectionRenderers[section.id];
              return (
                <Fragment key={section.id}>
                  {renderSection ? renderSection() : null}
                </Fragment>
              );
            })}
          </div>
        </main>
      </div>
    </BaseShell>
  );
}
