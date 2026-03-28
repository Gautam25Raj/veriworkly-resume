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
    fullName: "Gautam Raj",
    role: "Software Developer",
    headline:
      "Software Developer building scalable web products with clean architecture, practical execution, and a little creative flair.",
    email: "ashragautam25@gmail.com",
    phone: "+91 00000 00000",
    location: "Moon Base, Milky Way",
    linkEmail: true,
    linkPhone: true,
    linkLocation: true,
  },

  links: {
    displayMode: "icon-username",
    items: [
      {
        id: "link-1",
        type: "github",
        label: "GitHub",
        url: "https://github.com/gautam25raj",
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
        url: "https://gautam-raj.vercel.app",
      },
    ],
  },

  summary:
    "Software Developer with hands-on experience in TypeScript, React, Next.js, Node.js, and PostgreSQL. I build performant products from idea to production, balancing engineering rigor with a fun, human-centered product mindset.",

  experience: [
    {
      id: "exp-1",
      company: "XYZ",
      role: "Software Developer",
      location: "Bengaluru, India",
      startDate: "2026-03",
      endDate: "Present",
      current: true,
      summary:
        "Built and maintained full-stack product features for a multi-tenant SaaS platform used by recruiters and hiring teams.",
      highlights: [
        "Implemented end-to-end modules in Next.js and Node.js, improving feature delivery velocity by 30 percent.",
        "Designed reusable API and UI patterns that reduced duplicate code and simplified onboarding for new developers.",
        "Optimized key database queries and caching paths, reducing average dashboard load time by 40 percent.",
      ],
    },
  ],

  education: [
    {
      id: "edu-1",
      school: "ABCD University",
      degree: "B.Tech",
      field: "Computer Science and Engineering",
      startDate: "2019-06",
      endDate: "2023-06",
      current: false,
      summary:
        "Focused on software engineering, data structures, algorithms, operating systems, and database systems.",
    },
  ],

  projects: [
    {
      id: "proj-1",
      name: "Veriworkly Resume",
      role: "Lead Developer",
      link: "https://github.com/gautam25raj",
      summary:
        "Production-ready resume builder with a modular editor, multi-template rendering, local persistence, and export workflows.",
      highlights: [
        "Built with Next.js App Router, TypeScript, Zustand, and component-driven architecture for maintainability.",
        "Implemented dynamic sections, template switching, JSON import/export, and PDF generation.",
        "Structured features by domain to keep editor logic, rendering, and data normalization clean and testable.",
      ],
    },

    {
      id: "proj-2",
      name: "Realtime Task Board",
      role: "Full Stack Developer",
      link: "https://github.com/gautam25raj",
      summary:
        "Collaborative Kanban app with real-time updates, role-based access, and activity tracking.",
      highlights: [
        "Used Next.js, Node.js, PostgreSQL, and WebSocket events for low-latency collaboration.",
        "Added permission-aware actions, audit trail logs, and optimistic UI updates.",
      ],
    },
  ],

  skills: [
    {
      id: "skills-1",
      name: "Programming Languages",
      keywords: ["TypeScript", "JavaScript", "SQL", "Python", "Java"],
    },

    {
      id: "skills-2",
      name: "Frontend",
      keywords: ["React", "Next.js", "Tailwind CSS", "HTML5", "Responsive UI"],
    },

    {
      id: "skills-3",
      name: "Backend and Data",
      keywords: ["Node.js", "Express", "PostgreSQL", "Prisma", "REST APIs"],
    },

    {
      id: "skills-4",
      name: "Developer Tools and Practices",
      keywords: [
        "Git",
        "Docker",
        "CI/CD",
        "Testing",
        "Performance Optimization",
      ],
    },
  ],

  customSections: [
    {
      id: "custom-certifications",
      kind: "certifications",
      title: "Certifications",
      items: [
        {
          id: "cert-1",
          name: "AWS Certified Cloud Practitioner",
          issuer: "Amazon Web Services",
          date: "2024-03",
          link: "https://www.credly.com/",
          referenceId: "Credential available on request",
          description:
            "Validated understanding of cloud architecture, deployment models, and security fundamentals.",
          details: [
            "Applied cloud cost and reliability best practices in production-facing features.",
          ],
        },
      ],
    },

    {
      id: "custom-awards",
      kind: "awards",
      title: "Awards",
      items: [
        {
          id: "award-1",
          name: "Hackathon Winner - Product Engineering Track",
          issuer: "BuildFest India",
          date: "2023-11",
          link: "",
          referenceId: "Team Lead",
          description:
            "Led a team to build and demo a working recruiting workflow prototype in 36 hours.",
          details: [
            "Owned API design, frontend integration, and final demo delivery.",
          ],
        },
      ],
    },

    {
      id: "custom-languages",
      kind: "languages",
      title: "Languages",
      items: [
        {
          id: "lang-1",
          name: "English",
          issuer: "",
          date: "",
          link: "",
          referenceId: "Professional working proficiency",
          description: "",
          details: [],
        },
        {
          id: "lang-2",
          name: "Hindi",
          issuer: "",
          date: "",
          link: "",
          referenceId: "Native proficiency",
          description: "",
          details: [],
        },
      ],
    },

    {
      id: "custom-general",
      kind: "custom",
      title: "Community and Leadership",
      editableTitle: true,
      items: [
        {
          id: "community-1",
          name: "Mentor - Developer Community",
          issuer: "Local Tech Circle",
          date: "2022-Present",
          link: "",
          referenceId: "Volunteer",
          description:
            "Mentor early-career developers on frontend architecture, debugging workflows, and interview preparation.",
          details: [
            "Conducted mock interviews and resume reviews for 100+ participants.",
          ],
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
