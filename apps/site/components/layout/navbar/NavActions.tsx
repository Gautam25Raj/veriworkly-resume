"use client";

import Link from "next/link";

import { siteConfig } from "@/config/site";

import { Button } from "@veriworkly/ui";

import { GithubIcon } from "../SocialIcons";
import { ThemeToggle } from "../ThemeToggle";

export const NavActions = () => {
  return (
    <div className="hidden items-center gap-4 lg:flex">
      <Link
        href={siteConfig.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted hover:text-foreground hover:bg-accent/5 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
      >
        <GithubIcon className="h-5 w-5" />
      </Link>

      <ThemeToggle />

      <Button
        asChild
        variant="primary"
        className="shadow-accent/10 hover:shadow-accent/20 rounded-full px-7 font-bold shadow-lg transition-all active:scale-95"
      >
        <Link href={siteConfig.links.app}>Start Building</Link>
      </Button>
    </div>
  );
};
