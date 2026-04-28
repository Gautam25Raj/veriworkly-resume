import {
  ArrowRight,
  BookOpen,
  Terminal,
  Shield,
  Search,
  Layout,
  Zap,
  Code,
  Lock,
  Cpu,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  Container,
  Button,
  Card,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@veriworkly/ui";
import { docsFaqs } from "../data/faq";
import { cn } from "@/lib/utils";

const HomePage = () => {
  return (
    <main className="surface-grid min-h-screen py-14 md:py-20">
      <Container className="space-y-20 md:space-y-32">
        {/* Docs Hero */}
        <section
          aria-labelledby="docs-hero-heading"
          className="border-border bg-card relative overflow-hidden rounded-4xl border px-6 py-10 shadow-[0_30px_90px_-50px_rgba(0,0,0,0.45)] md:px-10 md:py-14"
        >
          <div className="bg-accent/12 pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full blur-3xl" />
          <div className="bg-accent/10 pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full blur-3xl" />

          <div className="relative grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/50 bg-zinc-50/50 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase backdrop-blur-sm">
                <span className="flex h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                Engineering Excellence
              </div>

              <h1
                id="docs-hero-heading"
                className="text-foreground text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl md:text-7xl"
              >
                The Architecture of <span className="text-accent">Career Tech.</span>
              </h1>

              <p className="text-muted max-w-2xl text-lg leading-relaxed md:text-xl">
                Deep dive into our privacy-first engine, explore the API specs, and learn how we're
                redefining professional identity with local-first engineering.
              </p>

              <div className="flex flex-wrap items-center justify-start gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="primary"
                  className="h-14 px-8 text-base shadow-xl shadow-blue-500/20"
                >
                  <Link href="/docs" aria-label="Explore guides">
                    Start Building
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-14 border-zinc-200/50 px-8 text-base"
                >
                  <Link href="/api-reference" aria-label="API reference">
                    API Reference
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              <Card className="bg-background/80 border-border p-5 backdrop-blur transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Zap className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-foreground text-lg font-bold">100ms</p>
                    <p className="text-muted text-sm font-medium">Render Latency</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-background/80 border-border p-5 backdrop-blur transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Shield className="size-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-foreground text-lg font-bold">E2EE</p>
                    <p className="text-muted text-sm font-medium">Privacy Standard</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-background/80 border-border p-6 backdrop-blur transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-500/10">
                    <Layout className="size-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-foreground text-lg font-bold">Open Source</p>
                    <p className="text-muted text-sm font-medium">MIT Licensed</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Engineering Pillars</h2>
            <p className="text-muted mx-auto max-w-2xl text-lg">
              Our documentation is structured around the three core values that drive VeriWorkly.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Local-First Core",
                desc: "Data remains on-device until you decide to sync. Learn about our sync protocol and storage architecture.",
                icon: Cpu,
                href: "/docs/architecture",
                bg: "bg-blue-500/10",
                text: "text-blue-600",
              },
              {
                title: "API-Driven Workflows",
                desc: "Every feature is built API-first. Integrate our builder into your existing HR tech stack seamlessly.",
                icon: Code,
                href: "/api-reference",
                bg: "bg-purple-500/10",
                text: "text-purple-600",
              },
              {
                title: "Privacy & Security",
                desc: "Data ownership is at the heart of VeriWorkly. Explore our security model and local-first encryption.",
                icon: Shield,
                href: "/privacy",
                bg: "bg-emerald-500/10",
                text: "text-emerald-600",
              },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="group">
                <Card className="border-border/50 hover:border-accent/40 h-full transition-all duration-300 hover:shadow-xl">
                  <div className="flex h-full flex-col p-6">
                    <div
                      className={cn(
                        "mb-6 flex size-12 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
                        item.bg,
                      )}
                    >
                      <item.icon className={cn("size-6", item.text)} />
                    </div>
                    <h3 className="text-foreground mb-3 text-xl font-bold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-muted mb-6 text-sm leading-relaxed font-medium">
                      {item.desc}
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-[10px] font-bold tracking-widest text-blue-600 uppercase transition-colors group-hover:text-blue-500">
                      Learn More{" "}
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Start Code Section */}
        <section className="relative overflow-hidden rounded-4xl border border-white/5 bg-zinc-950 p-8 md:p-12">
          <div className="pointer-events-none absolute top-0 right-0 h-full w-1/2 bg-linear-to-l from-blue-500/10 to-transparent" />
          <div className="relative grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                Built for <span className="text-blue-400">Developers.</span>
              </h2>
              <p className="text-lg leading-relaxed font-medium text-zinc-400">
                VeriWorkly provides a comprehensive set of tools to help you build privacy-first
                career applications. Our API is designed for simplicity and power.
              </p>
              <ul className="space-y-4">
                {[
                  "RESTful API endpoints",
                  "Fully typed TypeScript SDK",
                  "Automated schema validation",
                  "Webhook support for real-time events",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 font-medium text-zinc-300">
                    <div className="size-1.5 rounded-full bg-blue-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-4 h-12 rounded-2xl bg-white px-8 font-bold text-black hover:bg-zinc-200"
              >
                <Link href="/docs/quickstart">Read Quickstart</Link>
              </Button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-2 shadow-2xl">
              <div className="overflow-x-auto rounded-2xl bg-zinc-900 p-6 font-mono text-sm text-zinc-300">
                <div className="mb-4 flex gap-2">
                  <div className="size-3 rounded-full bg-red-500/50" />
                  <div className="size-3 rounded-full bg-amber-500/50" />
                  <div className="size-3 rounded-full bg-emerald-500/50" />
                </div>
                <p className="text-blue-400"># Fetch resume data</p>
                <p>
                  <span className="text-purple-400">const</span> resume ={" "}
                  <span className="text-purple-400">await</span> veriworkly.
                  <span className="text-emerald-400">getResume</span>(
                  <span className="text-zinc-400">"user_id_123"</span>);
                </p>
                <br />
                <p className="text-blue-400"># Transform to PDF</p>
                <p>
                  <span className="text-purple-400">const</span> pdf ={" "}
                  <span className="text-purple-400">await</span> veriworkly.
                  <span className="text-emerald-400">export</span>(resume,{" "}
                </p>
                <p className="pl-4">
                  format: <span className="text-zinc-400">"pdf"</span>,
                </p>
                <p className="pl-4">
                  template: <span className="text-zinc-400">"modern-minimal"</span>
                </p>
                <p>`&rbrace;`);</p>
              </div>
            </div>
          </div>
        </section>

        {/* Universal Search Feature */}
        <section className="border-border bg-card relative overflow-hidden rounded-4xl border px-6 py-12 text-center md:px-10 md:py-24">
          <div className="bg-accent/5 pointer-events-none absolute inset-0 blur-3xl" />
          <div className="relative mx-auto max-w-2xl space-y-8">
            <div className="bg-foreground text-background mx-auto flex size-20 items-center justify-center rounded-3xl shadow-2xl shadow-black/20">
              <Search className="size-10" />
            </div>
            <div className="space-y-4">
              <h2 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
                Universal Search.
              </h2>
              <p className="text-muted text-xl leading-relaxed font-medium">
                Find documentation, blog posts, and API reference parameters in one unified search
                interface.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 pt-4">
              <kbd className="bg-background border-border rounded-2xl border px-6 py-3 font-mono text-xl font-bold shadow-sm">
                ⌘ K
              </kbd>
              <span className="text-muted text-xs font-bold tracking-[0.2em] uppercase">
                Instant Access
              </span>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-8" aria-labelledby="faq-heading">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="space-y-3 lg:sticky lg:top-24">
              <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
                Questions
              </p>

              <h2
                id="faq-heading"
                className="text-foreground text-3xl font-semibold tracking-tight"
              >
                Docs FAQ
              </h2>

              <p className="text-muted text-sm leading-7 md:text-base">
                Everything you need to know about building with VeriWorkly, our security model, and
                API usage.
              </p>
            </div>

            <Accordion type="single" collapsible className="gap-3">
              {docsFaqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="border-border bg-card relative overflow-hidden rounded-4xl border px-6 py-12 text-center md:px-10 md:py-24">
          <div className="bg-accent/10 pointer-events-none absolute inset-0 blur-3xl" />
          <div className="relative mx-auto max-w-3xl space-y-8">
            <h2 className="text-foreground text-4xl font-bold tracking-tight md:text-6xl">
              Ready to dive in?
            </h2>
            <p className="text-muted mx-auto max-w-2xl text-xl leading-relaxed font-medium">
              Join thousands of developers building better career tools with VeriWorkly. Our
              documentation is always open and free.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <Button
                asChild
                variant="primary"
                size="lg"
                className="h-14 rounded-2xl px-10 text-base font-bold shadow-xl shadow-blue-500/20"
              >
                <Link href="/docs">Get Started Now</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="h-14 rounded-2xl border-zinc-200/50 px-10 text-base font-bold"
              >
                <Link href={siteConfig.links.github} target="_blank">
                  Star on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
};

export default HomePage;
