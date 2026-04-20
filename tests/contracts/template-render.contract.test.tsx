import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  defaultResume,
  defaultSections,
} from "@/features/resume/constants/default-resume";
import { loadTemplateComponentById, templateRegistry } from "@/templates";
import {
  splitSectionsByPlacement,
  TEMPLATE_SECTION_PLACEMENT,
} from "@/templates/modern-core/shared/section-placement";

describe("template render contract", () => {
  it("registers core templates and keeps ids unique", () => {
    const templateIds = templateRegistry.map((template) => template.id);
    const uniqueTemplateIds = new Set(templateIds);

    expect(uniqueTemplateIds.size).toBe(templateIds.length);
    expect(templateIds).toEqual(
      expect.arrayContaining(["modern", "minimal", "executive", "ats"]),
    );
  });

  it("renders every registered template for canonical resume data", async () => {
    for (const template of templateRegistry) {
      const TemplateComponent = await loadTemplateComponentById(template.id);

      const html = renderToStaticMarkup(
        <TemplateComponent
          resume={{
            ...defaultResume,
            templateId: template.id,
          }}
        />,
      );

      expect(html.length).toBeGreaterThan(500);
      expect(html).toContain(defaultResume.basics.fullName);
    }
  });

  it("omits basics header when basics section is hidden", async () => {
    const hiddenBasicsResume = {
      ...defaultResume,
      sections: defaultResume.sections.map((section) =>
        section.id === "basics" ? { ...section, visible: false } : section,
      ),
    };

    for (const template of templateRegistry) {
      const TemplateComponent = await loadTemplateComponentById(template.id);

      const html = renderToStaticMarkup(
        <TemplateComponent
          resume={{ ...hiddenBasicsResume, templateId: template.id }}
        />,
      );

      expect(html).not.toContain(defaultResume.basics.fullName);
    }
  });
});

describe("template placement contract", () => {
  it("does not duplicate or drop sections for modern placement", () => {
    const orderedSections = [...defaultSections].sort(
      (left, right) => left.order - right.order,
    );

    const { main, sidebar } = splitSectionsByPlacement(
      orderedSections,
      TEMPLATE_SECTION_PLACEMENT.modern,
    );

    const assignedIds = [...main, ...sidebar].map((section) => section.id);
    const uniqueAssignedIds = new Set(assignedIds);

    expect(assignedIds.length).toBe(uniqueAssignedIds.size);

    const excluded = new Set(TEMPLATE_SECTION_PLACEMENT.modern.excluded);
    const expected = orderedSections
      .filter((section) => !excluded.has(section.id))
      .map((section) => section.id)
      .sort();

    expect([...uniqueAssignedIds].sort()).toEqual(expected);
  });

  it("does not duplicate or drop sections for executive placement", () => {
    const orderedSections = [...defaultSections].sort(
      (left, right) => left.order - right.order,
    );

    const { main, sidebar } = splitSectionsByPlacement(
      orderedSections,
      TEMPLATE_SECTION_PLACEMENT.executive,
    );

    const assignedIds = [...main, ...sidebar].map((section) => section.id);
    const uniqueAssignedIds = new Set(assignedIds);

    expect(assignedIds.length).toBe(uniqueAssignedIds.size);

    const excluded = new Set(TEMPLATE_SECTION_PLACEMENT.executive.excluded);
    const expected = orderedSections
      .filter((section) => !excluded.has(section.id))
      .map((section) => section.id)
      .sort();

    expect([...uniqueAssignedIds].sort()).toEqual(expected);
  });
});
