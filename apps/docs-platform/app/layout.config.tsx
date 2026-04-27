import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { siteConfig } from "@/config/site";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-md bg-zinc-950 text-[10px] font-bold text-white">
          V
        </span>
        <span className="font-semibold">{siteConfig.name}</span>
      </div>
    ),
    url: "/",
  },
  links: [
    {
      text: "Docs",
      url: "/docs",
    },
    {
      text: "API Reference",
      url: "/api-reference",
    },
    {
      text: "Blog",
      url: siteConfig.links.blog,
    },
  ],
  githubUrl: siteConfig.links.github,
};
