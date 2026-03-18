import Link from "next/link";

import { Container } from "@/components/layout/Container";

import { siteConfig } from "@/config/site";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border/40 bg-card/30 border-t py-12">
      <Container className="grid gap-8 md:grid-cols-2 md:items-start">
        <div className="space-y-4">
          <Link
            href="/"
            className="text-foreground text-lg font-bold tracking-tight"
          >
            {siteConfig.name}
          </Link>

          <p className="text-muted max-w-xs text-sm leading-relaxed">
            A premium, local-first resume builder designed for speed, privacy,
            and long-term maintainability.
          </p>

          <p className="text-muted/60 text-xs">
            © {currentYear} {siteConfig.name}. Built for the community.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:gap-4 md:justify-items-end">
          <div className="flex flex-col gap-3">
            <p className="text-foreground text-xs font-semibold tracking-wider uppercase">
              Product
            </p>

            <Link
              href="/dashboard"
              className="text-muted hover:text-accent text-sm transition-colors"
            >
              Dashboard
            </Link>

            <Link
              href="/templates"
              className="text-muted hover:text-accent text-sm transition-colors"
            >
              Templates
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-foreground text-xs font-semibold tracking-wider uppercase">
              Connect
            </p>

            <Link
              target="_blank"
              rel="noreferrer"
              href={siteConfig.links.github}
              className="text-muted hover:text-accent text-sm transition-colors"
            >
              GitHub
            </Link>

            <Link
              target="_blank"
              rel="noreferrer"
              href={siteConfig.links.twitter}
              className="text-muted hover:text-accent text-sm transition-colors"
            >
              Twitter
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
