import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { Container } from "@veriworkly/ui";

import { faqs } from "@/features/landing/data/faqItems";

import TrustBar from "@/features/landing/components/TrustBar";
import CTASection from "@/features/landing/components/CTASection";
import FAQSection from "@/features/landing/components/FAQSection";
import HeroSection from "@/features/landing/components/HeroSection";
import BenefitsSection from "@/features/landing/components/BenefitsSection";
import FeaturesSection from "@/features/landing/components/FeaturesSection";
import UseCasesSection from "@/features/landing/components/UseCasesSection";
import SecuritySection from "@/features/landing/components/SecuritySection";
import ResourcesSection from "@/features/landing/components/ResourcesSection";
import TemplatesPreview from "@/features/landing/components/TemplatesPreview";
import HowItWorksSection from "@/features/landing/components/HowItWorksSection";
import DocsSection from "@/features/landing/components/DocsSection";
import BlogSection from "@/features/landing/components/BlogSection";


const pageUrl = siteConfig.url;
const pageOgImage = `${siteConfig.url}/og/landing-page-og.png`;

export const metadata: Metadata = {
  title: `Free Resume Builder (No Login) | ${siteConfig.shortName}`,
  description:
    "Free, open-source, and privacy-first resume builder. Create ATS-friendly resumes online for free. No login required. Choose templates, customize easily, and download instantly.",

  openGraph: {
    title: `Free Resume Builder (No Login) | ${siteConfig.shortName}`,
    description:
      "Free, open-source, and privacy-first resume builder. Create polished resumes quickly with flexible templates, strong privacy defaults, and optional sync/share workflows.",
    url: pageUrl,
    siteName: siteConfig.shortName,
    type: "website",
    images: [
      {
        url: pageOgImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.shortName} Resume Builder`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `Free Resume Builder (No Login) | ${siteConfig.shortName}`,
    description:
      "Free, open-source, and privacy-first resume builder. Local-first resume builder with flexible templates and practical export workflows.",
    images: [pageOgImage],
  },
};

const Home = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      <main className="surface-grid min-h-screen py-14 md:py-20">
        <Container className="space-y-12 md:space-y-20">
          <HeroSection />
          <TrustBar />
          <FeaturesSection />
          <HowItWorksSection />
          <BenefitsSection />
          <TemplatesPreview />
          <UseCasesSection />
          <SecuritySection />
          <DocsSection />
          <BlogSection />
          <ResourcesSection />


          <FAQSection />
          <CTASection />
        </Container>

        <section className="sr-only">
          <h2>Free Resume Builder Online</h2>

          <p>
            VeriWorkly is a free ATS-friendly resume builder that helps you create, edit, and
            download professional resumes without login. Choose from modern resume templates,
            customize sections, and export resumes for job applications easily.
          </p>
        </section>
      </main>
    </>
  );
};

export default Home;
