import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { source, apiSource } from "@/lib/source";

export const revalidate = 86400;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const docPages = source.getPages().map((page) => ({
    url: `${siteConfig.url}${page.url}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const apiPages = apiSource.getPages().map((page) => ({
    url: `${siteConfig.url}${page.url}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...docPages,
    ...apiPages,
  ];
}
