"use client";

import { useState } from "react";
import type { DragEvent } from "react";

import type { ResumeSectionId } from "@/types/resume";

import { useResume } from "@/features/resume/hooks/use-resume";

import LinksSection from "./content/sections/LinksSection";
import AwardsSection from "./content/sections/AwardsSection";
import BasicsSection from "./content/sections/BasicsSection";
import CustomSection from "./content/sections/CustomSection";
import SkillsSection from "./content/sections/SkillsSection";
import SummarySection from "./content/sections/SummarySection";
import ProjectsSection from "./content/sections/ProjectsSection";
import LanguagesSection from "./content/sections/LanguagesSection";
import EducationSection from "./content/sections/EducationSection";
import ExperienceSection from "./content/sections/ExperienceSection";
import PublicationsSection from "./content/sections/PublicationsSection";
import CertificationsSection from "./content/sections/CertificationsSection";

const EditorContentPanel = () => {
  const { reorderSections, resume } = useResume();

  const [draggedSectionId, setDraggedSectionId] =
    useState<ResumeSectionId | null>(null);
  const [openSectionId, setOpenSectionId] = useState<ResumeSectionId | null>(
    "basics",
  );

  function handleToggleSection(sectionId: ResumeSectionId) {
    setOpenSectionId((currentSectionId) =>
      currentSectionId === sectionId ? null : sectionId,
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-muted text-xs font-semibold tracking-[0.22em] uppercase">
          Resume Content
        </p>

        <h2 className="text-foreground text-xl font-semibold">
          Content editor
        </h2>
      </div>

      <div className="space-y-3">
        {resume.sections
          .slice()
          .sort((left, right) => left.order - right.order)
          .map((section, sectionIndex) => {
            const handleDragStart = (event: DragEvent<HTMLSpanElement>) => {
              setDraggedSectionId(section.id);

              if (event.dataTransfer) {
                event.dataTransfer.effectAllowed = "move";
              }
            };

            const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
              event.preventDefault();

              if (event.dataTransfer) {
                event.dataTransfer.dropEffect = "move";
              }
            };

            const handleDrop = (event: DragEvent<HTMLDivElement>) => {
              event.preventDefault();

              if (draggedSectionId && draggedSectionId !== section.id) {
                const draggedIndex = resume.sections.findIndex(
                  (item) => item.id === draggedSectionId,
                );

                if (draggedIndex !== -1) {
                  reorderSections(draggedIndex, sectionIndex);
                }
              }

              setDraggedSectionId(null);
            };

            const handleDragEnd = () => {
              setDraggedSectionId(null);
            };

            const sectionProps = {
              isOpen: openSectionId === section.id,
              onDragEnd: handleDragEnd,
              onDragOver: handleDragOver,
              onDragStart: handleDragStart,
              onDrop: handleDrop,
              onToggle: handleToggleSection,
            };

            if (section.id === "basics") {
              return <BasicsSection key={section.id} {...sectionProps} />;
            }

            if (section.id === "links") {
              return <LinksSection key={section.id} {...sectionProps} />;
            }

            if (section.id === "summary") {
              return <SummarySection key={section.id} {...sectionProps} />;
            }

            if (section.id === "experience") {
              return <ExperienceSection key={section.id} {...sectionProps} />;
            }

            if (section.id === "education") {
              return <EducationSection key={section.id} {...sectionProps} />;
            }

            if (section.id === "projects") {
              return <ProjectsSection key={section.id} {...sectionProps} />;
            }

            if (section.id === "skills") {
              return <SkillsSection key={section.id} {...sectionProps} />;
            }

            if (section.id === "certifications") {
              return (
                <CertificationsSection key={section.id} {...sectionProps} />
              );
            }

            if (section.id === "awards") {
              return <AwardsSection key={section.id} {...sectionProps} />;
            }

            if (section.id === "publications") {
              return <PublicationsSection key={section.id} {...sectionProps} />;
            }

            if (section.id === "languages") {
              return <LanguagesSection key={section.id} {...sectionProps} />;
            }

            if (section.id === "custom") {
              return <CustomSection key={section.id} {...sectionProps} />;
            }

            return null;
          })}
      </div>
    </div>
  );
};

export default EditorContentPanel;
