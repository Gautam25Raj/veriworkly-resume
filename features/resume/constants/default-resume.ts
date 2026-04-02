import type { ResumeData, ResumeSection } from "@/types/resume";

export const defaultSections: ResumeSection[] = [
  { id: "basics", label: "Basics", visible: true, order: 0 },
  { id: "links", label: "Links", visible: true, order: 1 },
  { id: "summary", label: "Summary", visible: true, order: 2 },
  { id: "experience", label: "Experience", visible: true, order: 3 },
  { id: "education", label: "Education", visible: true, order: 4 },
  { id: "projects", label: "Projects", visible: true, order: 5 },
  { id: "skills", label: "Skills", visible: true, order: 6 },
  { id: "certifications", label: "Certifications", visible: true, order: 7 },
  { id: "awards", label: "Awards", visible: true, order: 8 },
  { id: "publications", label: "Publications", visible: true, order: 9 },
  { id: "languages", label: "Languages", visible: true, order: 10 },
  { id: "custom", label: "Custom", visible: true, order: 11 },
];

export const defaultResume: ResumeData = {
  id: "default-resume",
  templateId: "modern",

  basics: {
    fullName: "VeriWorkly User",
    role: "Indie Developer & Product Builder",
    headline:
      "Building useful, fast, and privacy-first web products — one idea at a time.",

    email: "hello@veriworkly.com",
    phone: "+91 00000 00000",
    location: "Internet (occasionally Earth 🌍)",

    linkEmail: true,
    linkPhone: true,
    linkLocation: false,
  },

  links: {
    displayMode: "icon-username",
    items: [
      {
        id: "link-1",
        type: "github",
        label: "GitHub",
        url: "https://github.com/Gautam25Raj/veriworkly",
      },
      {
        id: "link-2",
        type: "linkedin",
        label: "LinkedIn",
        url: "https://linkedin.com/in/-gautam-raj",
      },
      {
        id: "link-3",
        type: "portfolio",
        label: "Portfolio",
        url: "https://veriworkly.com",
      },
    ],
  },

  summary:
    "Self-taught developer focused on building practical, real-world products. I enjoy turning ideas into polished user experiences using modern web technologies. Currently building VeriWorkly — a privacy-first resume builder with no login and a focus on simplicity.",

  experience: [
    {
      id: "exp-1",
      company: "VeriWorkly",
      role: "Founder & Developer",
      location: "Remote",
      startDate: "2025-01",
      endDate: "Present",
      current: true,

      summary:
        "Building a modern resume builder focused on speed, privacy, and user control.",

      highlights: [
        "Designed and developed a full-featured resume builder with real-time preview and multi-template support.",
        "Implemented local-first architecture ensuring zero data storage on servers.",
        "Built modular editor system enabling dynamic sections, customization, and export workflows.",
        "Focused on performance, clean UX, and developer-friendly architecture using Next.js and TypeScript.",
      ],
    },
  ],

  education: [
    {
      id: "edu-1",
      school: "Self-Taught",
      degree: "Internet Degree™",
      field: "Computer Science (Unofficial but Effective)",
      startDate: "2019",
      endDate: "Present",
      current: true,

      summary:
        "Learned software development through building real-world projects, debugging production issues, and reading way too many docs.",
    },
  ],

  projects: [
    {
      id: "proj-1",
      name: "VeriWorkly Resume Builder",
      role: "Creator",
      link: "https://veriworkly.com",

      summary:
        "A privacy-first resume builder with no login, real-time preview, and flexible templates.",

      highlights: [
        "Built with Next.js App Router, TypeScript, and modern state management.",
        "Supports dynamic sections, JSON import/export, and PDF generation.",
        "Focused on UX simplicity and performance with a clean, minimal interface.",
      ],
    },

    {
      id: "proj-2",
      name: "Realtime Task Board",
      role: "Full Stack Developer",
      link: "https://github.com/gautam25raj",

      summary:
        "Collaborative Kanban board with real-time updates and team workflows.",

      highlights: [
        "Implemented real-time sync using WebSockets.",
        "Designed role-based permissions and activity tracking.",
        "Built scalable backend with Node.js and PostgreSQL.",
      ],
    },
  ],

  skills: [
    {
      id: "skills-1",
      name: "Languages",
      keywords: ["TypeScript", "JavaScript", "SQL"],
    },
    {
      id: "skills-2",
      name: "Frontend",
      keywords: ["React", "Next.js", "Tailwind CSS"],
    },
    {
      id: "skills-3",
      name: "Backend",
      keywords: ["Node.js", "Express", "PostgreSQL"],
    },
    {
      id: "skills-4",
      name: "Other",
      keywords: ["System Design", "Performance", "UX Thinking"],
    },
  ],

  customSections: [
    {
      id: "custom-philosophy",
      kind: "custom",
      title: "Build Philosophy",
      editableTitle: true,
      items: [
        {
          id: "philosophy-1",
          name: "How I Build Products",
          issuer: "",
          date: "",
          link: "",
          referenceId: "",
          description:
            "I believe software should be fast, simple, and respectful of user privacy.",
          details: [
            "Prefer shipping small, iterative improvements over big rewrites.",
            "Focus on real user problems instead of over-engineering.",
            "Design for clarity first, then scale.",
          ],
        },
      ],
    },

    {
      id: "custom-fun",
      kind: "custom",
      title: "Fun Facts",
      editableTitle: true,
      items: [
        {
          id: "fun-1",
          name: "Debugging Skills",
          issuer: "",
          date: "",
          link: "",
          referenceId: "",
          description:
            "Can spend 3 hours debugging and then fix it in 2 minutes.",
          details: [],
        },
        {
          id: "fun-2",
          name: "Stack Preference",
          issuer: "",
          date: "",
          link: "",
          referenceId: "",
          description: "Strong believer in TypeScript everywhere.",
          details: [],
        },
      ],
    },
  ],

  sections: defaultSections,

  customization: {
    accentColor: "#2563eb",
    textColor: "#0f172a",
    mutedTextColor: "#475569",
    pageBackgroundColor: "#ffffff",
    sectionBackgroundColor: "#f8fafc",
    borderColor: "#cbd5e1",
    sectionHeadingColor: "#334155",
    fontFamily: "geist",
    sectionSpacing: 28,
    pagePadding: 32,
    bodyLineHeight: 1.5,
    headingLineHeight: 1.2,
  },

  updatedAt: new Date().toISOString(),
};
