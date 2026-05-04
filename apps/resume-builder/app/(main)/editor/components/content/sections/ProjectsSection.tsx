"use client";

import { useMemo, useState } from "react";

import { Button } from "@veriworkly/ui";
import { Input } from "@veriworkly/ui";

import { useResume } from "@/features/resume/hooks/use-resume";
import { validateProject } from "@/features/resume/utils/validation";

import {
  Field,
  TextArea,
  invalidClass,
  DelimitedTextArea,
} from "../EditorFormPrimitives";
import DraggableSection from "./DraggableSection";
import type { BaseSectionProps } from "./section-types";

const ProjectsSection = ({
  isOpen,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
  onToggle,
}: BaseSectionProps) => {
  const { addProject, removeProject, resume, updateProject } = useResume();

  const [projectIndex, setProjectIndex] = useState(0);

  const safeProjectIndex = Math.min(
    projectIndex,
    Math.max(0, resume.projects.length - 1),
  );

  const activeProject = resume.projects[safeProjectIndex];

  const projectErrors = useMemo(
    () => (activeProject ? validateProject(activeProject) : {}),
    [activeProject],
  );

  return (
    <DraggableSection
      id="projects"
      isOpen={isOpen}
      onDrop={onDrop}
      label="Projects"
      onToggle={onToggle}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragStart={onDragStart}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {resume.projects.length ? (
          <select
            className="border-border bg-background h-10 rounded-xl border px-3 text-sm"
            onChange={(event) => setProjectIndex(Number(event.target.value))}
            value={safeProjectIndex}
          >
            {resume.projects.map((_, index) => (
              <option key={index} value={index}>
                Project {index + 1}
              </option>
            ))}
          </select>
        ) : null}

        <Button onClick={addProject} size="sm" variant="secondary">
          Add
        </Button>

        <Button
          disabled={resume.projects.length === 0}
          onClick={() => removeProject(safeProjectIndex)}
          size="sm"
          variant="ghost"
        >
          Remove
        </Button>
      </div>

      {activeProject ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Field error={projectErrors.name} label="Project name">
              <Input
                className={invalidClass(projectErrors.name)}
                onChange={(event) =>
                  updateProject(safeProjectIndex, {
                    name: event.target.value,
                  })
                }
                value={activeProject.name}
              />
            </Field>

            <Field error={projectErrors.role} label="Role">
              <Input
                className={invalidClass(projectErrors.role)}
                onChange={(event) =>
                  updateProject(safeProjectIndex, {
                    role: event.target.value,
                  })
                }
                value={activeProject.role}
              />
            </Field>

            <Field error={projectErrors.link} label="Link">
              <Input
                className={invalidClass(projectErrors.link)}
                onChange={(event) =>
                  updateProject(safeProjectIndex, {
                    link: event.target.value,
                  })
                }
                value={activeProject.link}
              />
            </Field>
          </div>

          <div className="mt-4 space-y-4">
            <Field error={projectErrors.summary} label="Summary">
              <TextArea
                className={invalidClass(projectErrors.summary)}
                onChange={(event) =>
                  updateProject(safeProjectIndex, {
                    summary: event.target.value,
                  })
                }
                value={activeProject.summary}
              />
            </Field>

            <Field label="Highlights (comma separated)">
              <DelimitedTextArea
                key={activeProject.id}
                onChange={(nextHighlights) =>
                  updateProject(safeProjectIndex, {
                    highlights: nextHighlights,
                  })
                }
                value={activeProject.highlights}
              />
            </Field>
          </div>
        </>
      ) : (
        <p className="text-muted text-sm">
          No projects yet. Click Add to create one.
        </p>
      )}
    </DraggableSection>
  );
};

export default ProjectsSection;
