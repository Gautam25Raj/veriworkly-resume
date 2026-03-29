"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import { useResume } from "@/features/resume/hooks/use-resume";
import { validateExperience } from "@/features/resume/utils/validation";

import {
  Field,
  TextArea,
  invalidClass,
  DelimitedTextArea,
} from "../EditorFormPrimitives";
import DraggableSection from "./DraggableSection";
import type { BaseSectionProps } from "./section-types";

const ExperienceSection = ({
  isOpen,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
  onToggle,
}: BaseSectionProps) => {
  const { addExperience, removeExperience, resume, updateExperience } =
    useResume();

  const [experienceIndex, setExperienceIndex] = useState(0);

  const safeExperienceIndex = Math.min(
    experienceIndex,
    Math.max(0, resume.experience.length - 1),
  );

  const activeExperience = resume.experience[safeExperienceIndex];

  const experienceErrors = useMemo(
    () => (activeExperience ? validateExperience(activeExperience) : {}),
    [activeExperience],
  );

  return (
    <DraggableSection
      id="experience"
      isOpen={isOpen}
      onDrop={onDrop}
      label="Experience"
      onToggle={onToggle}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragStart={onDragStart}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {resume.experience.length ? (
          <select
            className="border-border bg-background h-10 rounded-xl border px-3 text-sm"
            onChange={(event) => setExperienceIndex(Number(event.target.value))}
            value={safeExperienceIndex}
          >
            {resume.experience.map((_, index) => (
              <option key={index} value={index}>
                Experience {index + 1}
              </option>
            ))}
          </select>
        ) : null}

        <Button onClick={addExperience} size="sm" variant="secondary">
          Add
        </Button>

        <Button
          size="sm"
          variant="ghost"
          disabled={resume.experience.length === 0}
          onClick={() => removeExperience(safeExperienceIndex)}
        >
          Remove
        </Button>
      </div>

      {activeExperience ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Field error={experienceErrors.role} label="Role">
              <Input
                value={activeExperience.role}
                className={invalidClass(experienceErrors.role)}
                onChange={(event) =>
                  updateExperience(safeExperienceIndex, {
                    role: event.target.value,
                  })
                }
              />
            </Field>

            <Field error={experienceErrors.company} label="Company">
              <Input
                value={activeExperience.company}
                className={invalidClass(experienceErrors.company)}
                onChange={(event) =>
                  updateExperience(safeExperienceIndex, {
                    company: event.target.value,
                  })
                }
              />
            </Field>

            <Field error={experienceErrors.location} label="Location">
              <Input
                value={activeExperience.location}
                className={invalidClass(experienceErrors.location)}
                onChange={(event) =>
                  updateExperience(safeExperienceIndex, {
                    location: event.target.value,
                  })
                }
              />
            </Field>

            <Field error={experienceErrors.startDate} label="Start (YYYY-MM)">
              <Input
                placeholder="2024-01"
                value={activeExperience.startDate}
                className={invalidClass(experienceErrors.startDate)}
                onChange={(event) =>
                  updateExperience(safeExperienceIndex, {
                    startDate: event.target.value,
                  })
                }
              />
            </Field>

            <Field error={experienceErrors.endDate} label="End (YYYY-MM)">
              <Input
                value={activeExperience.endDate}
                placeholder="Present or 2025-06"
                disabled={activeExperience.current}
                className={invalidClass(experienceErrors.endDate)}
                onChange={(event) =>
                  updateExperience(safeExperienceIndex, {
                    endDate: event.target.value,
                  })
                }
              />
            </Field>

            <label className="text-foreground border-border flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium">
              <input
                type="checkbox"
                checked={activeExperience.current}
                className="accent-accent h-4 w-4"
                onChange={(event) =>
                  updateExperience(safeExperienceIndex, {
                    current: event.target.checked,
                  })
                }
              />
              I currently work here
            </label>
          </div>

          <div className="mt-4 space-y-4">
            <Field error={experienceErrors.summary} label="Summary">
              <TextArea
                className={invalidClass(experienceErrors.summary)}
                onChange={(event) =>
                  updateExperience(safeExperienceIndex, {
                    summary: event.target.value,
                  })
                }
                value={activeExperience.summary}
              />
            </Field>

            <Field label="Highlights (comma separated)">
              <DelimitedTextArea
                key={activeExperience.id}
                onChange={(nextHighlights) =>
                  updateExperience(safeExperienceIndex, {
                    highlights: nextHighlights,
                  })
                }
                value={activeExperience.highlights}
              />
            </Field>
          </div>
        </>
      ) : (
        <p className="text-muted text-sm">
          No experience entries yet. Click Add to create one.
        </p>
      )}
    </DraggableSection>
  );
};

export default ExperienceSection;
