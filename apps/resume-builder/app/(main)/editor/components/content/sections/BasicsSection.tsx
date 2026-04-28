"use client";

import type { BaseSectionProps } from "./section-types";

import { Input } from "@veriworkly/ui";

import { useResume } from "@/features/resume/hooks/use-resume";
import { validateBasics } from "@/features/resume/utils/validation";

import DraggableSection from "./DraggableSection";
import { Field, invalidClass } from "../EditorFormPrimitives";

const BasicsSection = ({
  isOpen,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
  onToggle,
}: BaseSectionProps) => {
  const { resume, updateBasics } = useResume();
  const basicErrors = validateBasics(resume.basics);

  return (
    <DraggableSection
      id="basics"
      label="Basics"
      isOpen={isOpen}
      onDrop={onDrop}
      onToggle={onToggle}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragStart={onDragStart}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field error={basicErrors.fullName} label="Full name">
          <Input
            className={invalidClass(basicErrors.fullName)}
            onChange={(event) => updateBasics({ fullName: event.target.value })}
            value={resume.basics.fullName}
          />
        </Field>

        <Field error={basicErrors.role} label="Role">
          <Input
            className={invalidClass(basicErrors.role)}
            onChange={(event) => updateBasics({ role: event.target.value })}
            value={resume.basics.role}
          />
        </Field>

        <Field error={basicErrors.headline} label="Headline">
          <Input
            className={invalidClass(basicErrors.headline)}
            onChange={(event) => updateBasics({ headline: event.target.value })}
            value={resume.basics.headline}
          />
        </Field>

        <Field error={basicErrors.email} label="Email">
          <Input
            className={invalidClass(basicErrors.email)}
            onChange={(event) => updateBasics({ email: event.target.value })}
            value={resume.basics.email}
          />
        </Field>

        <Field error={basicErrors.phone} label="Phone">
          <Input
            className={invalidClass(basicErrors.phone)}
            onChange={(event) => updateBasics({ phone: event.target.value })}
            value={resume.basics.phone}
          />
        </Field>

        <Field error={basicErrors.location} label="Location">
          <Input
            className={invalidClass(basicErrors.location)}
            onChange={(event) => updateBasics({ location: event.target.value })}
            value={resume.basics.location}
          />
        </Field>

        <label className="text-foreground border-border flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium">
          <input
            checked={resume.basics.linkEmail}
            className="accent-accent h-4 w-4"
            onChange={(event) =>
              updateBasics({ linkEmail: event.target.checked })
            }
            type="checkbox"
          />
          Email opens mail app
        </label>

        <label className="text-foreground border-border flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium">
          <input
            checked={resume.basics.linkPhone}
            className="accent-accent h-4 w-4"
            onChange={(event) =>
              updateBasics({ linkPhone: event.target.checked })
            }
            type="checkbox"
          />
          Phone opens call
        </label>

        <label className="text-foreground border-border flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium md:col-span-2">
          <input
            checked={resume.basics.linkLocation}
            className="accent-accent h-4 w-4"
            onChange={(event) =>
              updateBasics({ linkLocation: event.target.checked })
            }
            type="checkbox"
          />
          Location opens Google search
        </label>
      </div>
    </DraggableSection>
  );
};

export default BasicsSection;
