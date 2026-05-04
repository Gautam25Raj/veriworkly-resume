import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard",
          "/editor",
          "/login",
          "/profile",
          "/settings",
          "/share/",
          "/api/",
          "/test",
          "/og-generator",
        ],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        userAgent: "CCBot",
        allow: "/",
      },
    ],

    sitemap: [
      `${siteConfig.url}/sitemap.xml`,
      "https://blogs.veriworkly.com/sitemap.xml",
      "https://docs.veriworkly.com/sitemap.xml",
    ],

  };
}
