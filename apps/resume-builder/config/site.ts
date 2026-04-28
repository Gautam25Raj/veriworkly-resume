export const siteConfig = {
  name: "VeriWorkly Resume",
  shortName: "VeriWorkly",

  creator: "Gautam Raj",

  url: "https://veriworkly.com",

  description:
    "Free, open-source, and privacy-first resume builder. Create professional ATS-friendly resumes with flexible templates, real-time preview, and complete data privacy.",

  tagline: "Free resume builder. No login. 100% private.",

  links: {
    github: "https://github.com/Gautam25Raj/veriworkly-resume",
    twitter: "https://x.com/veriworkly",
  },

  keywords: [
    "resume builder",
    "free resume builder",
    "no login resume builder",
    "ATS resume builder",
    "resume templates",
    "ATS friendly resume templates",
    "online resume builder",
    "resume maker free",
    "professional resume builder",
    "modern resume templates",
    "privacy focused resume builder",
    "open source resume builder",
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
    { href: "/templates", label: "Templates" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/stats", label: "Development" },
  ],
} as const;
