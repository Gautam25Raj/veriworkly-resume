"use client";

import { useState } from "react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import { useResume } from "@/features/resume/hooks/use-resume";

import { Field } from "../EditorFormPrimitives";
import DraggableSection from "./DraggableSection";
import { linkTypeOptions } from "../editor-options";
import type { BaseSectionProps } from "./section-types";

const LinksSection = ({
  isOpen,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
  onToggle,
}: BaseSectionProps) => {
  const {
    resume,
    addLinkItem,
    removeLinkItem,
    updateLinkItem,
    updateLinkDisplayMode,
  } = useResume();
  const [linkIndex, setLinkIndex] = useState(0);

  const safeLinkIndex = Math.min(
    linkIndex,
    Math.max(0, resume.links.items.length - 1),
  );

  const activeLink = resume.links.items[safeLinkIndex];

  return (
    <DraggableSection
      id="links"
      label="Links"
      isOpen={isOpen}
      onDrop={onDrop}
      onToggle={onToggle}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragStart={onDragStart}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {resume.links.items.length ? (
          <select
            className="border-border bg-background h-10 rounded-xl border px-3 text-sm"
            onChange={(event) => setLinkIndex(Number(event.target.value))}
            value={safeLinkIndex}
          >
            {resume.links.items.map((item, index) => (
              <option key={item.id} value={index}>
                {item.type || `Link ${index + 1}`}
              </option>
            ))}
          </select>
        ) : null}

        <Button onClick={addLinkItem} size="sm" variant="secondary">
          Add link
        </Button>

        <Button
          disabled={!resume.links.items.length}
          onClick={() => removeLinkItem(safeLinkIndex)}
          size="sm"
          variant="ghost"
        >
          Remove
        </Button>
      </div>

      <Field label="Display style">
        <select
          className="border-border bg-background h-11 w-full rounded-2xl border px-4 text-sm"
          onChange={(event) =>
            updateLinkDisplayMode(
              event.target.value as "icon" | "url" | "icon-username",
            )
          }
          value={resume.links.displayMode}
        >
          <option value="icon">Icons only</option>
          <option value="url">URL only</option>
          <option value="icon-username">Icon + username</option>
        </select>
      </Field>

      {activeLink ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Link type">
            <select
              value={activeLink.type}
              className="border-border bg-background h-11 w-full rounded-2xl border px-4 text-sm"
              onChange={(event) =>
                updateLinkItem(safeLinkIndex, {
                  type: event.target.value as (typeof linkTypeOptions)[number],
                })
              }
            >
              {linkTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Label (optional)">
            <Input
              value={activeLink.label}
              placeholder="e.g. myusername"
              onChange={(event) =>
                updateLinkItem(safeLinkIndex, {
                  label: event.target.value,
                })
              }
            />
          </Field>

          <Field label="URL">
            <Input
              value={activeLink.url}
              placeholder="https://..."
              onChange={(event) =>
                updateLinkItem(safeLinkIndex, {
                  url: event.target.value,
                })
              }
            />
          </Field>
        </div>
      ) : (
        <p className="text-muted text-sm">
          No links yet. Add GitHub, LinkedIn, portfolio, X, or custom links.
        </p>
      )}
    </DraggableSection>
  );
};

export default LinksSection;
