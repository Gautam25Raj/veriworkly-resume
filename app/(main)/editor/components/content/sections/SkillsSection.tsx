"use client";

import { useMemo, useState } from "react";

import type { BaseSectionProps } from "./section-types";

import { Input } from "@veriworkly/ui";
import { Button } from "@veriworkly/ui";

import {
  Field,
  invalidClass,
  DelimitedTextArea,
} from "../EditorFormPrimitives";

import { useResume } from "@/features/resume/hooks/use-resume";
import { validateSkillGroup } from "@/features/resume/utils/validation";

import DraggableSection from "./DraggableSection";

const SkillsSection = ({
  isOpen,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
  onToggle,
}: BaseSectionProps) => {
  const { addSkillGroup, removeSkillGroup, resume, updateSkillGroup } =
    useResume();

  const [skillIndex, setSkillIndex] = useState(0);

  const safeSkillIndex = Math.min(
    skillIndex,
    Math.max(0, resume.skills.length - 1),
  );

  const activeSkillGroup = resume.skills[safeSkillIndex];

  const skillErrors = useMemo(
    () => (activeSkillGroup ? validateSkillGroup(activeSkillGroup) : {}),
    [activeSkillGroup],
  );

  if (!activeSkillGroup) {
    return null;
  }

  return (
    <DraggableSection
      id="skills"
      label="Skills"
      isOpen={isOpen}
      onDrop={onDrop}
      onToggle={onToggle}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragStart={onDragStart}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <select
          className="border-border bg-background h-10 rounded-xl border px-3 text-sm"
          onChange={(event) => setSkillIndex(Number(event.target.value))}
          value={safeSkillIndex}
        >
          {resume.skills.map((item, index) => (
            <option key={item.id} value={index}>
              {item.name || `Group ${index + 1}`}
            </option>
          ))}
        </select>

        <Button onClick={addSkillGroup} size="sm" variant="secondary">
          Add
        </Button>

        <Button
          disabled={resume.skills.length <= 1}
          onClick={() => removeSkillGroup(safeSkillIndex)}
          size="sm"
          variant="ghost"
        >
          Remove
        </Button>
      </div>

      <Field error={skillErrors.name} label="Group name">
        <Input
          className={invalidClass(skillErrors.name)}
          onChange={(event) =>
            updateSkillGroup(safeSkillIndex, {
              name: event.target.value,
            })
          }
          value={activeSkillGroup.name}
        />
      </Field>

      <Field error={skillErrors.keywords} label="Keywords (comma separated)">
        <DelimitedTextArea
          key={activeSkillGroup.id}
          value={activeSkillGroup.keywords}
          className={invalidClass(skillErrors.keywords)}
          onChange={(nextKeywords) =>
            updateSkillGroup(safeSkillIndex, {
              keywords: nextKeywords,
            })
          }
        />
      </Field>

      {activeSkillGroup.keywords.length ? (
        <div className="flex flex-wrap gap-2">
          {activeSkillGroup.keywords.map((keyword) => (
            <span
              className="border-border bg-background text-muted rounded-full border px-3 py-1 text-xs font-medium"
              key={keyword}
            >
              {keyword}
            </span>
          ))}
        </div>
      ) : null}
    </DraggableSection>
  );
};

export default SkillsSection;
