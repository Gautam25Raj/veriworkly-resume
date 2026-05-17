export const siteConfig = {
  name: "VeriWorkly Studio",
  shortName: "VeriWorkly",

  creator: "Gautam Raj",

  url: process.env.SITE_URL || "https://app.veriworkly.com",

  description:
    "Free, open-source, and privacy-first studio for resumes, cover letters, portfolios, link-in-bio pages, ATS checks, and AI-assisted content.",

  tagline: "Build career assets. No login. 100% private.",

  links: {
    github: "https://github.com/VeriWorkly/veriworkly",
    twitter: "https://x.com/veriworkly",
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
    { href: "/dashboard", label: "Dashboard" },
    { href: "https://veriworkly.com/templates", label: "Templates" },
    { href: "/profile", label: "Profile" },
    { href: "https://veriworkly.com/roadmap", label: "Roadmap" },
    { href: "https://veriworkly.com/stats", label: "Development" },
  ],
} as const;
