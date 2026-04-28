import { BaseShell } from "@/components/resume/BaseShell";
import { getOrderedSections } from "@/utils/resume";
import type { ResumeProjectItem } from "@/types/resume";
import type { TemplateRenderProps } from "@/types/template";
import {
  CompactAdditionalSection,
  CompactEducationSection,
  CompactExperienceSection,
  CompactProjectsSection,
  CompactSkillsSection,
  CompactSummarySection,
} from "@/templates/compact-core/shared/compact-section-components";

import { HeaderSection } from "./components/HeaderSection";
import { SectionHeading } from "./components/SectionHeading";
import { structuredProfessionalStyles } from "./styles";

export default function StructuredProfessionalTemplate(
  props: TemplateRenderProps | null | undefined = undefined,
) {
  const { className, resume } = props ?? {};

  if (!resume) {
    return null;
  }

  const orderedVisibleSections = getOrderedSections(resume.sections);
  const renderHeading = (title: string) => <SectionHeading title={title} />;
  const showHeader = orderedVisibleSections.some(
    (section) => section.id === "basics",
  );
  const showLinks = orderedVisibleSections.some(
    (section) => section.id === "links",
  );

  return (
    <BaseShell
      customization={resume.customization}
      className={[
        structuredProfessionalStyles.wrapper,
        structuredProfessionalStyles.stack,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showHeader ? (
        <HeaderSection resume={resume} showLinks={showLinks} />
      ) : null}

      {orderedVisibleSections.map((section) => {
        if (section.id === "basics") {
          return null;
        }

        if (section.id === "links") {
          return null;
        }

        if (section.id === "summary") {
          return (
            <CompactSummarySection
              bodyTextClassName={structuredProfessionalStyles.bodyText}
              key={section.id}
              renderHeading={renderHeading}
              resume={resume}
              sectionClassName={structuredProfessionalStyles.section}
              title="Profile"
            />
          );
        }

        if (section.id === "education") {
          return (
            <CompactEducationSection
              bodyTextClassName="text-sm leading-(--resume-body-leading) text-(--resume-muted)"
              containerClassName="space-y-4"
              formatPrimary={(item) => `${item.degree} in ${item.field}`}
              formatRange={(item) =>
                item.current
                  ? `${item.startDate} - Present`
                  : `${item.startDate} - ${item.endDate}`
              }
              formatSecondary={(item) => item.school}
              itemClassName="space-y-1"
              key={section.id}
              metaTextClassName="text-xs leading-(--resume-body-leading) text-(--resume-muted)"
              renderHeading={renderHeading}
              resume={resume}
              sectionClassName={structuredProfessionalStyles.section}
              title="Education"
            />
          );
        }

        if (section.id === "experience") {
          return (
            <CompactExperienceSection
              bodyTextClassName={structuredProfessionalStyles.bodyText}
              containerClassName="space-y-5"
              formatTitle={(item) => `${item.role} | ${item.company}`}
              highlightsClassName="list-disc space-y-1 pl-5 text-sm leading-(--resume-body-leading) text-(--resume-muted)"
              itemClassName="space-y-1"
              key={section.id}
              locationTextClassName="text-xs leading-(--resume-body-leading) text-(--resume-muted)"
              metaTextClassName="text-xs leading-(--resume-body-leading) text-(--resume-muted)"
              renderHeading={renderHeading}
              resume={resume}
              sectionClassName={structuredProfessionalStyles.section}
              title="Relevant Experience"
            />
          );
        }

        if (section.id === "projects") {
          return (
            <CompactProjectsSection
              bodyTextClassName={structuredProfessionalStyles.bodyText}
              containerClassName="space-y-5"
              highlightsClassName="list-disc space-y-1 pl-5 text-sm leading-(--resume-body-leading) text-(--resume-muted)"
              itemClassName="space-y-1"
              key={section.id}
              projectTitle={(item: ResumeProjectItem) => (
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm leading-(--resume-heading-leading) font-semibold text-(--resume-text)">
                    {item.name}
                  </p>
                  {item.link ? (
                    <a
                      className="text-xs leading-(--resume-body-leading) text-(--resume-muted) underline"
                      href={item.link}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span aria-hidden="true">Visit link</span>
                      <span className="sr-only">
                        Visit project link: {item.link}
                      </span>
                    </a>
                  ) : null}
                </div>
              )}
              projectRightMeta={(item: ResumeProjectItem) =>
                item.role ? (
                  <span className="rounded-full border border-(--resume-border) px-2 py-0.5 text-xs leading-(--resume-body-leading) text-(--resume-muted)">
                    {item.role}
                  </span>
                ) : null
              }
              renderHeading={renderHeading}
              resume={resume}
              sectionClassName={structuredProfessionalStyles.section}
              title="Selected Projects"
            />
          );
        }

        if (section.id === "skills") {
          return (
            <CompactSkillsSection
              bodyTextClassName="text-sm leading-(--resume-body-leading) text-(--resume-muted)"
              key={section.id}
              renderHeading={renderHeading}
              resume={resume}
              sectionClassName={structuredProfessionalStyles.section}
              title="Skills"
            />
          );
        }

        return (
          <CompactAdditionalSection
            bodyTextClassName={structuredProfessionalStyles.bodyText}
            key={section.id}
            metaTextClassName="text-xs leading-(--resume-body-leading) text-(--resume-muted)"
            renderHeading={renderHeading}
            resume={resume}
            section={section}
            sectionClassName={structuredProfessionalStyles.section}
          />
        );
      })}
    </BaseShell>
  );
}
