"use client";

import { useState } from "react";

import type { BaseSectionProps } from "./section-types";

import { Input } from "@veriworkly/ui";
import { Button } from "@veriworkly/ui";

import { Field } from "../EditorFormPrimitives";
import DraggableSection from "./DraggableSection";

import { useResume } from "@/features/resume/hooks/use-resume";

const ReferencesSection = ({
  isOpen,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
  onToggle,
}: BaseSectionProps) => {
  const {
    resume,
    addCustomSectionItem,
    removeCustomSectionItem,
    updateCustomSectionItem,
  } = useResume();

  const [referenceIndex, setReferenceIndex] = useState(0);

  const referencesSection =
    resume.customSections.find((section) => section.kind === "references") ??
    null;

  if (!referencesSection) {
    return null;
  }

  const safeReferenceIndex = Math.min(
    referenceIndex,
    Math.max(0, referencesSection.items.length - 1),
  );

  const activeReference = referencesSection.items[safeReferenceIndex];

  return (
    <DraggableSection
      id="references"
      label="References"
      isOpen={isOpen}
      onDrop={onDrop}
      onToggle={onToggle}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragStart={onDragStart}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {referencesSection.items.length ? (
          <select
            className="border-border bg-background h-10 rounded-xl border px-3 text-sm"
            onChange={(event) => setReferenceIndex(Number(event.target.value))}
            value={safeReferenceIndex}
          >
            {referencesSection.items.map((item, index) => (
              <option key={item.id} value={index}>
                {item.name || `Reference ${index + 1}`}
              </option>
            ))}
          </select>
        ) : null}

        <Button
          onClick={() => addCustomSectionItem("references")}
          size="sm"
          variant="secondary"
        >
          Add reference
        </Button>

        <Button
          disabled={referencesSection.items.length === 0}
          onClick={() =>
            removeCustomSectionItem("references", safeReferenceIndex)
          }
          size="sm"
          variant="ghost"
        >
          Remove
        </Button>
      </div>

      {activeReference ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name">
            <Input
              onChange={(event) =>
                updateCustomSectionItem("references", safeReferenceIndex, {
                  name: event.target.value,
                })
              }
              value={activeReference.name}
            />
          </Field>

          <Field label="Title">
            <Input
              onChange={(event) =>
                updateCustomSectionItem("references", safeReferenceIndex, {
                  issuer: event.target.value,
                })
              }
              value={activeReference.issuer}
            />
          </Field>

          <Field label="Organization">
            <Input
              onChange={(event) =>
                updateCustomSectionItem("references", safeReferenceIndex, {
                  description: event.target.value,
                })
              }
              value={activeReference.description}
            />
          </Field>

          <Field label="Relationship">
            <Input
              onChange={(event) =>
                updateCustomSectionItem("references", safeReferenceIndex, {
                  referenceId: event.target.value,
                })
              }
              value={activeReference.referenceId}
            />
          </Field>

          <Field label="Email (optional)">
            <Input
              onChange={(event) =>
                updateCustomSectionItem("references", safeReferenceIndex, {
                  link: event.target.value,
                })
              }
              value={activeReference.link}
            />
          </Field>

          <Field label="Phone (optional)">
            <Input
              onChange={(event) =>
                updateCustomSectionItem("references", safeReferenceIndex, {
                  date: event.target.value,
                })
              }
              value={activeReference.date}
            />
          </Field>
        </div>
      ) : (
        <p className="text-muted text-sm">
          No references yet. Click Add reference.
        </p>
      )}
    </DraggableSection>
  );
};

export default ReferencesSection;
