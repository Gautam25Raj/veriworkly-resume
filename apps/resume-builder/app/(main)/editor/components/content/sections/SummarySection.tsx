"use client";

import type { BaseSectionProps } from "./section-types";

import { cn } from "@/lib/utils";

import { useResume } from "@/features/resume/hooks/use-resume";
import { validateSummary } from "@/features/resume/utils/validation";

import DraggableSection from "./DraggableSection";
import { Field, invalidClass, TextArea } from "../EditorFormPrimitives";

const SummarySection = ({
  isOpen,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
  onToggle,
}: BaseSectionProps) => {
  const { resume, updateSummary } = useResume();

  const summaryErrors = validateSummary(resume.summary);

  return (
    <DraggableSection
      id="summary"
      isOpen={isOpen}
      label="Summary"
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragStart={onDragStart}
      onDrop={onDrop}
      onToggle={onToggle}
    >
      <Field error={summaryErrors.summary} label="Professional summary">
        <TextArea
          className={cn("min-h-40", invalidClass(summaryErrors.summary))}
          onChange={(event) => updateSummary(event.target.value)}
          value={resume.summary}
        />
      </Field>
    </DraggableSection>
  );
};

export default SummarySection;
