import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export const revalidate = 86400;

const publicRoutes = [
  {
    url: siteConfig.url,
    changeFrequency: "weekly" as const,
    priority: 1,
  },
  {
    url: `${siteConfig.url}/templates`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  },
  {
    url: `${siteConfig.url}/roadmap`,
    changeFrequency: "daily" as const,
    priority: 0.8,
  },
  {
    url: `${siteConfig.url}/roadmap/todo`,
    changeFrequency: "daily" as const,
    priority: 0.75,
  },
  {
    url: `${siteConfig.url}/roadmap/in-progress`,
    changeFrequency: "daily" as const,
    priority: 0.75,
  },
  {
    url: `${siteConfig.url}/roadmap/done`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  },
  {
    url: `${siteConfig.url}/about`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: `${siteConfig.url}/contact`,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  },
  {
    url: `${siteConfig.url}/faq`,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  },
  {
    url: `${siteConfig.url}/privacy`,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  },
  {
    url: `${siteConfig.url}/security`,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  },
  {
    url: `${siteConfig.url}/terms`,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  },
  {
    url: "https://blogs.veriworkly.com",
    changeFrequency: "weekly" as const,
    priority: 0.7,
  },
  {
    url: "https://docs.veriworkly.com",
    changeFrequency: "weekly" as const,
    priority: 0.7,
  },
] satisfies MetadataRoute.Sitemap;



export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    ...route,
    lastModified,
  }));
}
