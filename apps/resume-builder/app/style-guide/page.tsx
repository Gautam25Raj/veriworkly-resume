import {
  Type,
  Info,
  Palette,
  Component,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layout as LayoutIcon,
} from "lucide-react";
import Link from "next/link";

import { Container, Card, Button, Badge } from "@veriworkly/ui";

export const metadata = {
  title: "Style Guide",
  description:
    "Official style guide for VeriWorkly project including colors, typography, and components.",
};

const StyleGuidePage = () => {
  return (
    <main className="surface-grid min-h-screen py-14 md:py-20">
      <Container className="space-y-16 md:space-y-24">
        <header className="space-y-4">
          <p className="text-accent text-xs font-semibold tracking-[0.28em] uppercase">
            Design System
          </p>

          <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Style Guide
          </h1>

          <p className="text-muted max-w-2xl text-base leading-8 md:text-lg">
            A comprehensive guide to the visual identity and UI components of VeriWorkly. Ensuring
            consistency across all platforms.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/" className="text-accent text-sm font-semibold hover:underline">
              Back to Home
            </Link>

            <span className="text-muted text-xs">•</span>

            <Link
              href="#colors"
              className="text-muted text-sm hover:text-foreground transition-colors"
            >
              Colors
            </Link>

            <Link
              href="#typography"
              className="text-muted text-sm hover:text-foreground transition-colors"
            >
              Typography
            </Link>

            <Link
              href="#components"
              className="text-muted text-sm hover:text-foreground transition-colors"
            >
              Components
            </Link>

            <Link
              href="#brand-assets"
              className="text-muted text-sm hover:text-foreground transition-colors"
            >
              Brand Assets
            </Link>

            <Link
              href="#layout"
              className="text-muted text-sm hover:text-foreground transition-colors"
            >
              Layout
            </Link>
          </div>
        </header>

        <section id="colors" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 flex size-10 items-center justify-center rounded-lg">
              <Palette className="text-accent size-5" />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">Colors</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ColorCard
              hex="#F5F4EF"
              name="Background"
              variable="--background"
              description="Primary page background"
            />

            <ColorCard
              hex="#171717"
              name="Foreground"
              variable="--foreground"
              description="Main text color"
            />

            <ColorCard
              hex="#2563EB"
              name="Accent (Blue)"
              variable="--accent"
              description="Primary action color"
            />

            <ColorCard
              name="Card"
              hex="#FFFFFF"
              variable="--card"
              description="Component surfaces"
            />

            <ColorCard
              name="Muted"
              hex="#5F5C54"
              variable="--muted"
              description="Secondary text and details"
            />

            <ColorCard
              name="Border"
              variable="--border"
              hex="rgba(23, 23, 23, 0.12)"
              description="Subtle dividers"
            />

            <ColorCard
              name="Destructive"
              hex="#DC2626"
              variable="--destructive"
              description="Error and danger states"
            />

            <ColorCard
              name="Accent FG"
              hex="#F8FBFF"
              variable="--accent-foreground"
              description="Text on accent background"
            />
          </div>
        </section>

        <section id="typography" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 flex size-10 items-center justify-center rounded-lg">
              <Type className="text-accent size-5" />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">Typography</h2>
          </div>

          <Card className="divide-border divide-y overflow-hidden">
            <div className="p-8 space-y-4">
              <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
                Display
              </p>

              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                Heading 1 (Hero)
              </h1>

              <p className="text-muted text-sm italic">
                text-4xl sm:text-5xl md:text-6xl / font-semibold / tracking-tight
              </p>
            </div>

            <div className="p-8 space-y-4">
              <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
                Section Header
              </p>

              <h2 className="text-3xl font-semibold tracking-tight">Heading 2 (Section)</h2>

              <p className="text-muted text-sm italic">text-3xl / font-semibold / tracking-tight</p>
            </div>

            <div className="p-8 space-y-4">
              <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
                Component Header
              </p>

              <h3 className="text-xl font-semibold tracking-tight">Heading 3 (Card Title)</h3>

              <p className="text-muted text-sm italic">text-xl / font-semibold / tracking-tight</p>
            </div>

            <div className="p-8 space-y-4">
              <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
                Body Text
              </p>

              <p className="text-base leading-8 md:text-lg">
                The quick brown fox jumps over the lazy dog. This is the primary body text used for
                descriptions and long-form content. It prioritizes readability and proper line
                spacing.
              </p>

              <p className="text-muted text-sm italic">text-base leading-8 md:text-lg</p>
            </div>

            <div className="p-8 space-y-4">
              <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
                Font Stack
              </p>

              <p className="text-base leading-7">
                Primary font token: <span className="font-mono">--font-geist-sans</span>
              </p>

              <p className="text-base leading-7">
                Monospace token: <span className="font-mono">--font-geist-mono</span>
              </p>

              <p className="text-muted text-sm italic">
                Configured through @veriworkly/ui font variables and consumed by each app.
              </p>
            </div>
          </Card>
        </section>

        <section id="components" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 flex size-10 items-center justify-center rounded-lg">
              <Component className="text-accent size-5" />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">Components</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="p-8 space-y-6">
              <h3 className="text-lg font-semibold">Buttons</h3>

              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg">
                  Primary LG
                </Button>

                <Button variant="secondary" size="lg">
                  Secondary LG
                </Button>

                <Button variant="primary">Default</Button>

                <Button variant="secondary">Secondary</Button>

                <Button variant="ghost">Ghost</Button>
              </div>
            </Card>

            <Card className="p-8 space-y-6">
              <h3 className="text-lg font-semibold">Badges</h3>

              <div className="flex flex-wrap gap-4">
                <Badge>Default Badge</Badge>

                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  Success
                </Badge>

                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  Warning
                </Badge>

                <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Error</Badge>
              </div>
            </Card>

            <Card className="p-8 space-y-6">
              <h3 className="text-lg font-semibold">Interactive Elements</h3>

              <div className="flex flex-col gap-4">
                <Link
                  href="/docs"
                  className="group flex items-center gap-2 text-sm font-bold tracking-wider text-blue-600 uppercase"
                >
                  Open Docs
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/templates"
                  className="flex items-center gap-2 text-sm font-medium hover:underline"
                >
                  Browse Templates
                </Link>

                <Link
                  href="https://blogs.veriworkly.com"
                  className="flex items-center gap-2 text-sm font-medium hover:underline"
                >
                  Visit Blog
                </Link>
              </div>
            </Card>

            <Card className="p-8 space-y-6">
              <h3 className="text-lg font-semibold">Status Icons</h3>

              <div className="flex gap-6">
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="text-emerald-500 size-6" />
                  <span className="text-[10px] uppercase font-bold text-muted">Success</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <Info className="text-blue-500 size-6" />
                  <span className="text-[10px] uppercase font-bold text-muted">Info</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <AlertTriangle className="text-amber-500 size-6" />
                  <span className="text-[10px] uppercase font-bold text-muted">Warning</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section id="brand-assets" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 flex size-10 items-center justify-center rounded-lg">
              <Info className="text-accent size-5" />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">Brand Assets</h2>
          </div>

          <Card className="p-8 space-y-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-lg font-semibold">Primary Logo</p>

                <p className="text-muted text-sm leading-6">
                  Use the standard square mark across product surfaces. Keep clear spacing and avoid
                  color manipulation.
                </p>
              </div>

              <div className="border-border bg-background rounded-2xl border p-4">
                <img width={56} height={56} alt="VeriWorkly Logo" src="/veriworkly-logo.png" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="text-sm font-semibold">Logo path</p>
                <p className="text-muted mt-1 text-xs font-mono">/veriworkly-logo.png</p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="text-sm font-semibold">Design references</p>
                <p className="text-muted mt-1 text-xs">
                  Theme tokens live in @veriworkly/ui styles.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section id="layout" className="space-y-8 pb-20 scroll-mt-24">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 flex size-10 items-center justify-center rounded-lg">
              <LayoutIcon className="text-accent size-5" />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">Layout & Spacing</h2>
          </div>

          <Card className="p-8 space-y-6">
            <p className="text-muted leading-relaxed">
              Our layout follows a modular grid system. We use standard Next.js Container components
              with consistent padding and gap values.
            </p>

            <div className="grid gap-4">
              <div className="bg-accent/5 border border-accent/10 h-12 rounded-xl flex items-center justify-center text-accent text-xs font-mono">
                Container Max-Width (1280px)
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-accent/5 border border-accent/10 h-12 rounded-xl flex items-center justify-center text-accent text-xs font-mono">
                  Gap 4 (16px)
                </div>

                <div className="bg-accent/5 border border-accent/10 h-12 rounded-xl flex items-center justify-center text-accent text-xs font-mono">
                  Gap 4 (16px)
                </div>
              </div>

              <div className="bg-accent/5 border border-accent/10 h-24 rounded-4xl flex items-center justify-center text-accent text-xs font-mono text-center px-4">
                Section Rounded (32px / rounded-4xl) <br />
                Shadow: [0_30px_90px_-50px_rgba(0,0,0,0.45)]
              </div>
            </div>
          </Card>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="secondary">
              <Link href="/">Back to Home</Link>
            </Button>

            <Button asChild variant="secondary">
              <Link href="/templates">View Templates</Link>
            </Button>

            <Button asChild variant="secondary">
              <Link href="https://docs.veriworkly.com">Read Docs</Link>
            </Button>
          </div>
        </section>
      </Container>
    </main>
  );
};

const ColorCard = ({
  name,
  hex,
  variable,
  description,
}: {
  name: string;
  hex: string;
  variable: string;
  description: string;
}) => (
  <Card className="overflow-hidden">
    <div className="h-24 w-full" style={{ backgroundColor: hex.includes("rgba") ? hex : hex }} />
    <div className="p-4 space-y-1">
      <p className="text-foreground font-semibold">{name}</p>
      <p className="text-muted text-xs font-mono uppercase">{hex}</p>
      <p className="text-muted text-[10px] font-mono">{variable}</p>
      <p className="text-muted text-xs mt-2 leading-relaxed">{description}</p>
    </div>
  </Card>
);

export default StyleGuidePage;
