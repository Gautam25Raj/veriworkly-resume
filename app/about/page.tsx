import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

import { principles } from "./data/principles";

import { Card } from "@veriworkly/ui";
import { Badge } from "@veriworkly/ui";
import { Button } from "@veriworkly/ui";

import { PublicPageShell } from "@/components/layout/PublicPageShell";

const pageUrl = `${siteConfig.url}/about`;
const pageOgImage = `${siteConfig.url}/og/landing-page-og.png`;

export const metadata: Metadata = {
  title: "About VeriWorkly Resume Builder (Free & Privacy-First)",
  description:
    "Learn about VeriWorkly, a free resume builder with no login. Discover how it helps you create ATS-friendly resumes with full privacy and control.",

  openGraph: {
    title: "About VeriWorkly Resume Builder (Free & Privacy-First)",
    description:
      "A privacy-first, open-source resume builder built for fast, controlled publishing.",
    url: pageUrl,
    siteName: siteConfig.shortName,
    type: "website",
    images: [
      {
        url: pageOgImage,
        width: 1200,
        height: 630,
        alt: "About VeriWorkly Resume Builder (Free & Privacy-First)",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "About VeriWorkly Resume Builder (Free & Privacy-First)",
    description:
      "Learn how VeriWorkly is built around local-first privacy and practical resume workflows.",
    images: [pageOgImage],
  },
};

const AboutPage = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    sameAs: [siteConfig.links.github, siteConfig.links.twitter],
    founder: {
      "@type": "Person",
      name: "Gautam Raj",
    },
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "VeriWorkly Resume Builder",
    url: siteConfig.url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    description:
      "Free resume builder with no login. Create ATS-friendly resumes online with full privacy.",
  };

  return (
    <>
      <PublicPageShell
        eyebrow="About"
        primaryAction={{ href: "/dashboard", label: "Open Dashboard" }}
        secondaryAction={{ href: "/contact", label: "Contact the team" }}
        title="A free resume builder built to be fast, private, and easy to trust"
        description="VeriWorkly is a local-first resume builder focused on practical output: clean templates, simple editing, optional sharing, and a public roadmap that makes the project easy to inspect."
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, webAppSchema]),
          }}
        />

        <section className="grid gap-4 lg:grid-cols-3">
          {principles.map((principle) => (
            <Card key={principle.title} className="space-y-3 p-6">
              <Badge>Principle</Badge>

              <h2 className="text-foreground text-xl font-semibold">
                {principle.title}
              </h2>

              <p className="text-muted text-sm leading-6">
                {principle.description}
              </p>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card className="space-y-4 p-6 md:p-8">
            <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
              Why this exists
            </p>

            <h2 className="text-foreground text-2xl font-semibold tracking-tight">
              Career tools should not force people to trade privacy for utility.
            </h2>

            <p className="text-muted text-sm leading-7">
              The product is structured around a simple idea: a resume builder
              is most useful when it is easy to use, easy to audit, and easy to
              move away from if needed. That means no unnecessary account gate,
              clear export paths, and public pages that explain how the system
              works.
            </p>

            <p className="text-muted text-sm leading-7">
              The public site is intentionally small but complete. It includes
              the landing page, templates, roadmap, policy pages, and contact
              routes so people can verify the project before they trust it.
            </p>
          </Card>

          <Card className="space-y-4 p-6 md:p-8">
            <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
              What people get
            </p>

            <ul className="space-y-3 text-sm leading-6">
              <li className="text-muted">
                Free resume creation without forced sign-up or login.
              </li>

              <li className="text-muted">
                ATS-friendly resume templates with fast export options.
              </li>

              <li className="text-muted">
                Optional sharing and sync instead of mandatory storage.
              </li>

              <li className="text-muted">
                A public roadmap so upcoming changes are visible.
              </li>

              <li className="text-muted">
                Clear policy pages and contact routes for trust.
              </li>
            </ul>

            <div className="pt-2">
              <Button asChild size="md" variant="secondary">
                <a href="/faq">Read the FAQ</a>
              </Button>
            </div>
          </Card>
        </section>
      </PublicPageShell>

      <section className="sr-only">
        <h2>About the Free Resume Builder</h2>

        <p>
          VeriWorkly is a free ATS-friendly resume builder that helps users
          create, edit, and export professional resumes without login. It
          focuses on privacy-first workflows, flexible templates, and full
          control over resume data.
        </p>
      </section>
    </>
  );
};

export default AboutPage;
