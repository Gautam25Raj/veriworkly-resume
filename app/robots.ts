import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
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
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
