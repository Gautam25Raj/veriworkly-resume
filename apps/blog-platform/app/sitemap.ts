import type { MetadataRoute } from "next";

import { blog } from "@/lib/source";
import { siteConfig } from "@/config/site";

export const revalidate = 86400;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const blogPages = blog.getPages().map((page) => ({
    url: `${siteConfig.url}${page.url}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...blogPages,
  ];
}
