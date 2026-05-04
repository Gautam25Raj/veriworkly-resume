import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

import { Card } from "@veriworkly/ui";
import { Badge } from "@veriworkly/ui";

import { PublicPageShell } from "@/components/layout/PublicPageShell";

const pageUrl = `${siteConfig.url}/privacy`;
const pageOgImage = `${siteConfig.url}/og/landing-page-og.png`;

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description:
    "Privacy-first resume builder with local storage, no login required, and optional sharing. Learn how your data stays under your control.",

  openGraph: {
    title: `Privacy Policy | ${siteConfig.name}`,
    description:
      "Understand the local-first model, optional cloud features, and public sharing behavior.",
    url: pageUrl,
    siteName: siteConfig.shortName,
    type: "website",
    images: [
      {
        url: pageOgImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.shortName} Privacy Policy`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `Privacy Policy | ${siteConfig.name}`,
    description:
      "Read how local-first storage, optional sync, and sharing are handled in VeriWorkly.",
    images: [pageOgImage],
  },
  alternates: {
    canonical: pageUrl,
  },
};

const privacyTopics = [
  {
    title: "Local storage first",
    description:
      "Resume data is meant to stay on the user's device unless they use optional sync or sharing features.",
  },
  {
    title: "Optional sharing",
    description:
      "Public links are intentionally public. Users should only share content they want others to view.",
  },
  {
    title: "Minimal tracking",
    description:
      "The product is built to avoid unnecessary tracking and to keep the public site easy to inspect.",
  },
  {
    title: "Third-party services",
    description:
      "If a user connects external services, those services may process data under their own terms.",
  },
];

const PrivacyPage = () => {
  return (
    <PublicPageShell
      eyebrow="Privacy"
      title="How resume data is handled"
      description="This page explains the current privacy model in plain language: local-first storage, optional sync, and explicit sharing choices."
      primaryAction={{ href: "/security", label: "Read security" }}
      secondaryAction={{ href: "/contact", label: "Contact us" }}
    >
      <section className="grid gap-4 md:grid-cols-2">
        {privacyTopics.map((topic) => (
          <Card key={topic.title} className="space-y-3 p-6">
            <Badge>Privacy</Badge>
            <h2 className="text-foreground text-xl font-semibold">
              {topic.title}
            </h2>
            <p className="text-muted text-sm leading-6">{topic.description}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="space-y-4 p-6 md:p-8">
          <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
            Your control
          </p>

          <h2 className="text-foreground text-2xl font-semibold tracking-tight">
            You decide where your data lives
          </h2>

          <ul className="space-y-3 text-sm leading-6">
            <li className="text-muted">
              By default, your resume is stored locally in your browser.
            </li>

            <li className="text-muted">
              You can use the builder without creating an account.
            </li>

            <li className="text-muted">
              Sharing and cloud sync are optional and only happen when you
              choose them.
            </li>

            <li className="text-muted">
              You can export your resume anytime and keep full control over your
              data.
            </li>
          </ul>
        </Card>

        <Card className="space-y-4 p-6 md:p-8">
          <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
            What this means in practice
          </p>

          <ul className="space-y-3 text-sm leading-6">
            <li className="text-muted">
              Your local resume data should remain under your control.
            </li>

            <li className="text-muted">
              Sharing is a deliberate action, not a background behavior.
            </li>

            <li className="text-muted">
              You should review any synced or connected service separately.
            </li>

            <li className="text-muted">
              Public pages exist to describe the product, not to collect profile
              data.
            </li>
          </ul>
        </Card>

        <Card className="space-y-4 p-6 md:p-8">
          <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
            Caveat
          </p>

          <h2 className="text-foreground text-2xl font-semibold tracking-tight">
            This summary is informational, not legal advice.
          </h2>

          <p className="text-muted text-sm leading-7">
            The privacy posture can evolve with new features, so the safest
            approach is to review the current app behavior, policy pages, and
            the repository before relying on any assumption.
          </p>
        </Card>

        <Card className="space-y-4 p-6 md:p-8">
          <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
            Data usage
          </p>

          <h2 className="text-foreground text-2xl font-semibold tracking-tight">
            No selling. No profiling.
          </h2>

          <p className="text-muted text-sm leading-7">
            VeriWorkly does not sell resume data or use it for advertising or
            profiling. Product analytics are minimal and focused only on
            improving reliability and usability.
          </p>
        </Card>
      </section>

      <section className="text-muted text-sm">
        Questions about privacy?{" "}
        <a
          href="mailto:info@veriworkly.com"
          className="text-accent font-medium hover:underline"
        >
          Contact us directly
        </a>
        .
      </section>
    </PublicPageShell>
  );
};

export default PrivacyPage;
