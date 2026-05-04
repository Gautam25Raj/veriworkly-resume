import type { ResumeSection, ResumeSectionId } from "@/types/resume";

interface TemplateSectionPlacementConfig {
  excluded: ResumeSectionId[];
  sidebar: ResumeSectionId[];
}

export const TEMPLATE_SECTION_PLACEMENT: Record<
  "modern" | "executive",
  TemplateSectionPlacementConfig
> = {
  modern: {
    excluded: ["basics", "links"],
    sidebar: ["skills", "education", "languages", "certifications", "awards"],
  },
  executive: {
    excluded: ["basics", "links"],
    sidebar: ["skills", "education", "languages", "certifications"],
  },
};

export function splitSectionsByPlacement(
  sections: ResumeSection[],
  config: TemplateSectionPlacementConfig,
) {
  const excluded = new Set<ResumeSectionId>(config.excluded);
  const sidebarIds = new Set<ResumeSectionId>(config.sidebar);

  const sidebar = sections.filter((section) => sidebarIds.has(section.id));
  const main = sections.filter(
    (section) => !excluded.has(section.id) && !sidebarIds.has(section.id),
  );

  return { main, sidebar };
}
