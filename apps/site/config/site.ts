export const siteConfig = {
  name: "VeriWorkly Resume",
  shortName: "VeriWorkly",

  creator: "Gautam Raj",

  url: process.env.SITE_URL || "https://veriworkly.com",

  description:
    "Free, open-source, and privacy-first resume builder. Create professional ATS-friendly resumes with flexible templates, real-time preview, and complete data privacy.",

  tagline: "Free resume builder. No login. 100% private.",

  links: {
    github: "https://github.com/Gautam25Raj/veriworkly-resume",
    twitter: "https://x.com/veriworkly",
    app: "https://app.veriworkly.com",
    linkedin: "https://linkedin.com/company/veriworkly",
    blog: "https://blogs.veriworkly.com",
    docs: "https://docs.veriworkly.com",
  },

  keywords: [
    "free resume builder",
    "ATS resume builder",
    "ATS-friendly resume builder",
    "resume builder no login",
    "online resume builder",
    "resume maker",
    "CV builder",
    "professional resume templates",
    "resume creator",
    "resume generator",
    "PDF resume builder",
    "open source resume builder",
    "privacy-first resume builder",
    "developer resume builder",
    "modern resume templates",
    "free CV maker",
    "resume templates free",
    "AI resume builder",
    "job resume maker",
    "best free resume builder",
  ],

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "VeriWorkly",
  },

  twitter: {
    handle: "@veriworkly",
    site: "@veriworkly",
    cardType: "summary_large_image",
  },

  navigation: [
    { href: "/templates", label: "Templates" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/stats", label: "Development" },

    { href: "https://app.veriworkly.com/dashboard", label: "Dashboard" },
    { href: "https://blogs.veriworkly.com", label: "Blog" },
    { href: "https://docs.veriworkly.com", label: "Docs" },
  ],
} as const;
