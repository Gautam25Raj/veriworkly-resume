import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { siteConfig } from "@/config/site";

import { ThemeProvider } from "@/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: "VeriWorkly Resume Builder",
    template: "%s | VeriWorkly Resume",
  },

  description: siteConfig.description,

  keywords: [...siteConfig.keywords],

  authors: [{ name: "VeriWorkly Team" }],
  creator: "VeriWorkly",
  publisher: "VeriWorkly",

  category: "technology",

  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: "Free Resume Builder with No Login | VeriWorkly",
    description:
      "Create professional resumes instantly with VeriWorkly. No login required. 100% free, open-source, and privacy-first — your data stays on your device.",
    siteName: "VeriWorkly Resume",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "VeriWorkly Resume Builder Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Free Resume Builder (No Login) | VeriWorkly",
    description:
      "Build resumes instantly with no login. Free, open-source, and privacy-first.",
    images: ["/opengraph-image.png"],
    creator: "@noober_boy",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground font-sans antialiased`}
      >
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
