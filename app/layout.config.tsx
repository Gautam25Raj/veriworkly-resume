import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { siteConfig } from "@/config/site";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <div className="flex items-center gap-2">
        <img
          width={24}
          height={24}
          alt="VeriWorkly Logo"
          className="rounded-md"
          src="/veriworkly-logo.png"
        />
        <span className="font-semibold">{siteConfig.name}</span>
      </div>
    ),
    url: "/",
  },

  links: [
    {
      text: "Dashboard",
      url: "/dashboard",
    },
    {
      text: "Templates",
      url: "/templates",
    },
    {
      text: "Roadmap",
      url: "/roadmap",
    },
    {
      text: "Development",
      url: "/stats",
    },
  ],

  githubUrl: siteConfig.links.github,
};
