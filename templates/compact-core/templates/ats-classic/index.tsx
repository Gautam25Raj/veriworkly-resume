import type { ResumeProjectItem } from "@/types/resume";
import type { TemplateRenderProps } from "@/types/template";

import { atsClassicStyles } from "./styles";

import {
  CompactSkillsSection,
  CompactSummarySection,
  CompactProjectsSection,
  CompactEducationSection,
  CompactExperienceSection,
  CompactAdditionalSection,
} from "@/templates/compact-core/shared/compact-section-components";

import { getOrderedSections } from "@/utils/resume";

import { BaseShell } from "@/components/resume/BaseShell";

import { LinkRow } from "./components/LinkRow";
import { DateRange } from "./components/DateRange";
import { SectionHeading } from "./components/SectionHeading";

export default function AtsClassicTemplate({
  className,
  resume,
}: TemplateRenderProps) {
  const orderedVisibleSections = getOrderedSections(resume.sections);
  const renderHeading = (title: string) => <SectionHeading title={title} />;

  return (
    <BaseShell
      customization={resume.customization}
      className={[atsClassicStyles.wrapper, atsClassicStyles.stack, className]
        .filter(Boolean)
        .join(" ")}
    >
      {orderedVisibleSections.map((section) => {
        if (section.id === "basics") {
          return (
            <header className="space-y-1" key={section.id}>
              <h1 className="text-2xl leading-(--resume-heading-leading) font-bold tracking-tight text-(--resume-text)">
                {resume.basics.fullName}
              </h1>

              <p className="text-sm leading-(--resume-heading-leading) font-medium text-(--resume-text)">
                {resume.basics.role}
              </p>

              <p className="text-sm leading-(--resume-body-leading) text-(--resume-muted)">
                {resume.basics.location} | {resume.basics.phone} |{" "}
                {resume.basics.email}
              </p>

              {orderedVisibleSections.some((item) => item.id === "links") ? (
                <LinkRow resume={resume} />
              ) : null}
            </header>
          );
        }

        if (section.id === "links") {
          return null;
        }

        if (section.id === "summary") {
          return (
            <CompactSummarySection
              bodyTextClassName={atsClassicStyles.bodyText}
              key={section.id}
              renderHeading={renderHeading}
              resume={resume}
              sectionClassName={atsClassicStyles.section}
              title="Summary"
            />
          );
        }

        if (section.id === "experience") {
          return (
            <CompactExperienceSection
              bodyTextClassName={atsClassicStyles.bodyText}
              formatRange={(item) => (
                <DateRange
                  current={item.current}
                  endDate={item.endDate}
                  startDate={item.startDate}
                />
              )}
              formatTitle={(item) => `${item.role} | ${item.company}`}
              key={section.id}
              locationTextClassName="text-xs leading-[var(--resume-body-leading)] text-[var(--resume-muted)]"
              metaTextClassName="text-xs leading-[var(--resume-body-leading)] text-[var(--resume-muted)]"
              renderHeading={renderHeading}
              resume={resume}
              sectionClassName={atsClassicStyles.section}
              title="Experience"
            />
          );
        }

        if (section.id === "projects") {
          return (
            <CompactProjectsSection
              bodyTextClassName={atsClassicStyles.bodyText}
              key={section.id}
              projectRightMeta={(item: ResumeProjectItem) =>
                item.link ? (
                  <a
                    className="text-sm leading-(--resume-body-leading) font-medium underline"
                    href={item.link}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span aria-hidden="true">Visit link</span>
                    <span className="sr-only">
                      Visit project link: {item.link}
                    </span>
                  </a>
                ) : null
              }
              projectTitle={(item: ResumeProjectItem) => (
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm leading-(--resume-heading-leading) font-semibold text-(--resume-text)">
                    {item.name}
                  </p>
                  {item.role ? (
                    <p className="text-sm leading-(--resume-body-leading) text-(--resume-muted)">
                      | {item.role}
                    </p>
                  ) : null}
                </div>
              )}
              renderHeading={renderHeading}
              resume={resume}
              sectionClassName={atsClassicStyles.section}
              title="Projects"
            />
          );
        }

        if (section.id === "education") {
          return (
            <CompactEducationSection
              bodyTextClassName="text-sm leading-[var(--resume-body-leading)] text-[var(--resume-muted)]"
              formatPrimary={(item) => `${item.degree} in ${item.field}`}
              formatRange={(item) => (
                <DateRange
                  current={item.current}
                  endDate={item.endDate}
                  startDate={item.startDate}
                />
              )}
              formatSecondary={(item) => item.school}
              key={section.id}
              metaTextClassName="text-xs leading-[var(--resume-body-leading)] text-[var(--resume-muted)]"
              renderHeading={renderHeading}
              resume={resume}
              sectionClassName={atsClassicStyles.section}
              title="Education"
            />
          );
        }

        if (section.id === "skills") {
          return (
            <CompactSkillsSection
              bodyTextClassName="text-sm leading-[var(--resume-body-leading)] text-[var(--resume-muted)]"
              key={section.id}
              renderHeading={renderHeading}
              resume={resume}
              sectionClassName={atsClassicStyles.section}
              title="Skills"
            />
          );
        }

        return (
          <CompactAdditionalSection
            bodyTextClassName={atsClassicStyles.bodyText}
            key={section.id}
            metaTextClassName="text-xs leading-[var(--resume-body-leading)] text-[var(--resume-muted)]"
            renderHeading={renderHeading}
            resume={resume}
            section={section}
            sectionClassName={atsClassicStyles.section}
          />
        );
      })}
    </BaseShell>
  );
}
