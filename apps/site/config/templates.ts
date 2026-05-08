export type TemplateSummary = {
  id: string;
  name: string;
  description: string;
  accentColor: string;
  previewImage: string;
  tags: string[];
};

export const templateSummaries: TemplateSummary[] = [
  {
    id: "modern",
    name: "Modern",
    description:
      "A clean, two-column resume with a bold accent sidebar. Ideal for tech, design, and creative roles where personality and structure matter equally.",
    accentColor: "#6366f1",
    previewImage: "/templates/modern-resume-template.png",
    tags: ["Two column", "ATS-friendly", "Modern", "Tech"],
  },
  {
    id: "minimal",
    name: "Minimal",
    description:
      "A whitespace-driven, single-column layout. Understated and elegant — great for senior engineers, writers, and anyone who wants substance over style.",
    accentColor: "#0ea5e9",
    previewImage: "/templates/minimal-resume-template.png",
    tags: ["One column", "ATS-friendly", "Minimal", "Clean"],
  },
  {
    id: "executive",
    name: "Leadership",
    description:
      "A structured executive layout with prominent header and clear hierarchy. Perfect for managers, directors, and senior professionals.",
    accentColor: "#10b981",
    previewImage: "/templates/executive-resume-template.png",
    tags: ["One column", "ATS-friendly", "Executive", "Management"],
  },
  {
    id: "ats",
    name: "ATS Classic",
    description:
      "A fully ATS-optimized single-column format with strict parsing compatibility. Zero visual noise — only what recruiters and bots need to see.",
    accentColor: "#f59e0b",
    previewImage: "/templates/classic-resume-template.png",
    tags: ["One column", "ATS-friendly", "Classic", "Simple"],
  },
  {
    id: "classic-academic",
    name: "Professional Classic",
    description:
      "A traditional, time-tested resume layout suited for academic, legal, medical, and corporate environments requiring formal presentation.",
    accentColor: "#8b5cf6",
    previewImage: "/templates/professional-resume-template.png",
    tags: ["One column", "ATS-friendly", "Classic", "Academic"],
  },
  {
    id: "structured-professional",
    name: "Structured Professional",
    description:
      "A grid-aligned, precision-formatted layout. Built for professionals who want systematic clarity — finance, consulting, operations, and beyond.",
    accentColor: "#ec4899",
    previewImage: "/templates/structured-resume-template.png",
    tags: ["One column", "ATS-friendly", "Professional", "Structured"],
  },
  {
    id: "academic-serif",
    name: "Academic Serif",
    description:
      "A serif-driven academic layout with classical typography. Perfect for researchers, professors, and PhDs presenting extensive academic histories.",
    accentColor: "#14b8a6",
    previewImage: "/templates/academic-resume-template.png",
    tags: ["One column", "Academic", "Serif", "Research"],
  },
];

export function getTemplateById(id: string) {
  return templateSummaries.find((t) => t.id === id) || templateSummaries[0];
}
