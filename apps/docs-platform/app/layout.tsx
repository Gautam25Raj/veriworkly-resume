import type { Metadata } from "next";

import "./globals.css";

import { ThemeProvider } from "next-themes";
import { RootProvider } from "fumadocs-ui/provider/next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: "VeriWorkly Docs | Guides, API & Developer Documentation",
    template: `%s | ${siteConfig.shortName} Docs`,
  },

  description:
    "Official VeriWorkly documentation. Learn how to use the resume builder, explore features, and integrate with APIs.",

  keywords: [
    "VeriWorkly docs",
    "resume builder documentation",
    "ATS resume guide",
    "VeriWorkly API",
    "developer docs",
    "open source resume builder",
  ],

  authors: [{ name: "VeriWorkly Team" }],
  creator: "VeriWorkly Team",
  publisher: "VeriWorkly",

  openGraph: {
    type: "website",
    url: `${siteConfig.url}`,
    title: "VeriWorkly Docs | Technical Guides & API Reference",
    description:
      "Comprehensive documentation for using and integrating VeriWorkly.",
    siteName: siteConfig.name,
    images: [
      {
        url: "/og/docs-og.png",
        width: 1200,
        height: 630,
        alt: "VeriWorkly Docs Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "VeriWorkly Docs | Guides & API Reference",
    description:
      "Explore guides, API references, and technical documentation for VeriWorkly.",
    images: ["/og/docs-og.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: `${siteConfig.url}/docs`,
  },
};

const DocsPlatformLayout = ({ children }: { children: React.ReactNode }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",

    name: "VeriWorkly Documentation",
    url: `${siteConfig.url}/docs`,

    description:
      "Technical documentation and guides for VeriWorkly resume builder.",

    publisher: {
      "@type": "Organization",
      name: "VeriWorkly",
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/veriworkly-logo.png`,
      },
    },
  };

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>

      <body>
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <RootProvider search={{ options: { delayMs: 500 } }}>
            {children}
          </RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default DocsPlatformLayout;
