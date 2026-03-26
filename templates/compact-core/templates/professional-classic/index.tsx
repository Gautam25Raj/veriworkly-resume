import { BaseShell } from "@/components/resume/BaseShell";
import { getOrderedSections } from "@/utils/resume";
import type { ResumeEducationItem, ResumeExperienceItem } from "@/types/resume";
import type { TemplateRenderProps } from "@/types/template";
import {
  CompactAdditionalSection,
  CompactEducationSection,
  CompactExperienceSection,
  CompactProjectTitle,
  CompactProjectsSection,
  CompactSkillsSection,
  CompactSummarySection,
} from "@/templates/compact-core/shared/compact-section-components";

import { SectionHeading } from "./components/SectionHeading";
import { classicAcademicStyles } from "./styles";

function formatDateLabel(value?: string) {
  if (!value) {
    return "Present";
  }

  const [year, month] = value.split("-");
  if (!year || !month) {
    return value;
  }

  const date = new Date(Number(year), Number(month) - 1);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatEducationDate(education: ResumeEducationItem) {
  const start = formatDateLabel(education.startDate);
  const end = education.current
    ? "Present"
    : formatDateLabel(education.endDate);
  return `${start} - ${end}`;
}

function formatExperienceDate(experience: ResumeExperienceItem) {
  const start = formatDateLabel(experience.startDate);
  const end = experience.current
    ? "Present"
    : formatDateLabel(experience.endDate);
  return `${start} - ${end}`;
}

export default function ClassicAcademicTemplate({
  className,
  resume,
}: TemplateRenderProps) {
  const orderedVisibleSections = getOrderedSections(resume.sections);
  const renderHeading = (title: string) => <SectionHeading title={title} />;
  const visibleLinks = resume.links.items.filter((item) => Boolean(item.url));

  return (
    <BaseShell
      customization={resume.customization}
      className={[
        classicAcademicStyles.wrapper,
        classicAcademicStyles.stack,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {orderedVisibleSections.map((section) => {
        if (section.id === "basics") {
          return (
            <header className={classicAcademicStyles.header} key={section.id}>
              <h1 className="text-center text-[1.7rem] leading-(--resume-heading-leading) font-bold tracking-[0.04em] text-(--resume-text)">
                {resume.basics.fullName}
              </h1>
              <p className="text-center text-sm leading-(--resume-heading-leading) font-semibold tracking-[0.08em] text-(--resume-muted) uppercase">
                {resume.basics.role}
              </p>
              <p className="text-center text-sm leading-(--resume-body-leading) text-(--resume-muted)">
                {resume.basics.location} • {resume.basics.phone} •{" "}
                {resume.basics.email}
              </p>
              {visibleLinks.length > 0 ? (
                <p className="text-center text-xs leading-(--resume-body-leading) tracking-[0.03em] text-(--resume-muted)">
                  {visibleLinks
                    .map((link) => link.url.replace(/^https?:\/\//, ""))
                    .join(" • ")}
                </p>
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
              bodyTextClassName={classicAcademicStyles.bodyText}
              key={section.id}
              renderHeading={renderHeading}
              resume={resume}
              sectionClassName={classicAcademicStyles.section}
              title="Summary"
            />
          );
        }

        if (section.id === "experience") {
          return (
            <CompactExperienceSection
              bodyTextClassName={classicAcademicStyles.bodyText}
              containerClassName="space-y-4"
              formatRange={formatExperienceDate}
              formatTitle={(item) => `${item.role} | ${item.company}`}
              highlightsClassName="list-[square] space-y-1 pl-5 text-sm leading-(--resume-body-leading) text-(--resume-muted)"
              itemClassName="space-y-1 border-b border-dotted border-[var(--resume-border)] pb-3 last:border-b-0 last:pb-0"
              key={section.id}
              locationTextClassName="text-xs leading-[var(--resume-body-leading)] text-[var(--resume-muted)]"
              metaTextClassName="text-xs leading-[var(--resume-body-leading)] text-[var(--resume-muted)]"
              renderHeading={renderHeading}
              resume={resume}
              sectionClassName={classicAcademicStyles.section}
              title="Experience"
            />
          );
        }

        if (section.id === "projects") {
          return (
            <CompactProjectsSection
              bodyTextClassName={classicAcademicStyles.bodyText}
              containerClassName="space-y-4"
              highlightsClassName="list-[square] space-y-1 pl-5 text-sm leading-(--resume-body-leading) text-(--resume-muted)"
              itemClassName="space-y-1 border-b border-dotted border-[var(--resume-border)] pb-3 last:border-b-0 last:pb-0"
              key={section.id}
              projectTitle={(item) => <CompactProjectTitle project={item} />}
              renderHeading={renderHeading}
              resume={resume}
              sectionClassName={classicAcademicStyles.section}
              title="Projects"
            />
          );
        }

        if (section.id === "education") {
          return (
            <CompactEducationSection
              bodyTextClassName={classicAcademicStyles.bodyText}
              containerClassName="space-y-3"
              formatPrimary={(item) => `${item.degree} in ${item.field}`}
              formatRange={formatEducationDate}
              formatSecondary={(item) => item.school}
              itemClassName="space-y-1 border-b border-dotted border-[var(--resume-border)] pb-2 last:border-b-0 last:pb-0"
              key={section.id}
              metaTextClassName="text-xs leading-[var(--resume-body-leading)] text-[var(--resume-muted)]"
              renderHeading={renderHeading}
              resume={resume}
              sectionClassName={classicAcademicStyles.section}
              title="Education"
            />
          );
        }

        if (section.id === "skills") {
          return (
            <CompactSkillsSection
              bodyTextClassName={classicAcademicStyles.bodyText}
              key={section.id}
              renderHeading={renderHeading}
              resume={resume}
              sectionClassName={classicAcademicStyles.section}
              title="Skills"
            />
          );
        }

        return (
          <CompactAdditionalSection
            bodyTextClassName={classicAcademicStyles.bodyText}
            key={section.id}
            metaTextClassName="text-xs leading-[var(--resume-body-leading)] text-[var(--resume-muted)]"
            renderHeading={renderHeading}
            resume={resume}
            section={section}
            sectionClassName={classicAcademicStyles.section}
          />
        );
      })}
    </BaseShell>
  );
}
