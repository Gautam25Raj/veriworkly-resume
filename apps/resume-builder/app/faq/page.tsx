import type { Metadata } from "next";

import Link from "next/link";

import { siteConfig } from "@/config/site";

import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@veriworkly/ui";
import { Card } from "@veriworkly/ui";

import { PublicPageShell } from "@/components/layout/PublicPageShell";

import { builderFaqs } from "./data/builderFaqs";
import { contributorFaqs } from "./data/contributorFaqs";

const pageUrl = `${siteConfig.url}/faq`;
const pageOgImage = `${siteConfig.url}/og/landing-page-og.png`;

function splitIntoColumns<T>(items: T[]): [T[], T[]] {
  const left: T[] = [];
  const right: T[] = [];

  items.forEach((item, index) => {
    if (index % 2 === 0) {
      left.push(item);
      return;
    }

    right.push(item);
  });

  return [left, right];
}

export const metadata: Metadata = {
  title: `Resume Builder FAQ (No Login, ATS-Friendly) | | ${siteConfig.name}`,
  description:
    "Find answers about using a free resume builder VeriWorkly, ATS-friendly templates, privacy, exports, and creating resumes without login.",

  openGraph: {
    title: `FAQ | ${siteConfig.name}`,
    description:
      "Frequently asked questions about the resume builder and its privacy-first workflow.",
    url: pageUrl,
    siteName: siteConfig.shortName,
    type: "website",
    images: [
      {
        url: pageOgImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.shortName} FAQ`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `FAQ | ${siteConfig.name}`,
    description:
      "Questions and answers about privacy, templates, exports, sharing, and roadmap workflows.",
    images: [pageOgImage],
  },
};

const FAQPage = () => {
  const [builderLeftColumn, builderRightColumn] = splitIntoColumns(builderFaqs);
  const [contributorLeftColumn, contributorRightColumn] =
    splitIntoColumns(contributorFaqs);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: builderFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <PublicPageShell
        eyebrow="FAQ"
        title="Resume builder frequently asked questions"
        secondaryAction={{ href: "/contact", label: "Contact" }}
        primaryAction={{ href: "/dashboard", label: "Open Dashboard" }}
        description="A plain-language answer page for the most common questions about privacy, templates, exports, and the public roadmap."
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <section className="space-y-4" aria-labelledby="builder-faq-heading">
          <div className="space-y-2">
            <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
              Builder FAQ
            </p>

            <h2
              id="builder-faq-heading"
              className="text-foreground text-2xl font-semibold tracking-tight"
            >
              Answers for resume builders and job seekers using VeriWorkly
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
            <Accordion type="single" collapsible className="gap-4">
              {builderLeftColumn.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Accordion type="single" collapsible className="gap-4">
              {builderRightColumn.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section
          className="space-y-4"
          aria-labelledby="contributor-faq-heading"
        >
          <div className="space-y-2">
            <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
              Contributor FAQ
            </p>

            <h2
              id="contributor-faq-heading"
              className="text-foreground text-2xl font-semibold tracking-tight"
            >
              Questions for contributors and maintainers
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
            <Accordion type="single" collapsible className="gap-4">
              {contributorLeftColumn.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Accordion type="single" collapsible className="gap-4">
              {contributorRightColumn.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <Card className="space-y-3 p-6">
            <h3 className="text-foreground text-lg font-semibold">
              Want to contribute now?
            </h3>

            <p className="text-muted text-sm leading-6">
              Start by reading contribution guidelines and checking open issues.
            </p>

            <p className="text-sm">
              <Link
                target="_blank"
                rel="noreferrer"
                href={siteConfig.links.github}
                className="text-accent font-medium hover:underline"
              >
                Open GitHub repository
              </Link>
            </p>
          </Card>
        </section>
      </PublicPageShell>

      <section className="sr-only">
        <h2>Free Resume Builder FAQ</h2>

        <p>
          This page answers common questions about using a free resume builder,
          creating ATS-friendly resumes, choosing templates, exporting resumes,
          and building resumes without login.
        </p>
      </section>
    </>
  );
};

export default FAQPage;
