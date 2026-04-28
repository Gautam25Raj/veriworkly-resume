import Link from "next/link";
import { ArrowRight, Clock, BookOpen, PenTool, Sparkles } from "lucide-react";

import { blog } from "@/lib/source";
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

const BlogHome = () => {
  const toBlogMeta = (data: unknown) =>
    data as {
      title: string;
      description: string;
      author: string;
      date: string;
    };

  const allPosts = blog
    .getPages()
    .sort(
      (a, b) =>
        new Date(toBlogMeta(b.data).date).getTime() - new Date(toBlogMeta(a.data).date).getTime(),
    );

  const featuredPost = allPosts[0];
  const remainingPosts = allPosts.slice(1, 4); // Show only next 3 posts

  return (
    <main className="surface-grid min-h-screen py-14 md:py-20">
      <Container className="space-y-12 md:space-y-16">
        {/* Blog Hero */}
        <section
          aria-labelledby="blog-hero-heading"
          className="border-border bg-card relative overflow-hidden rounded-4xl border px-6 py-10 shadow-[0_30px_90px_-50px_rgba(0,0,0,0.45)] md:px-10 md:py-14"
        >
          <div className="bg-accent/12 pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full blur-3xl" />
          <div className="bg-accent/10 pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full blur-3xl" />

          <div className="relative grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/50 bg-zinc-50/50 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase backdrop-blur-sm">
                <Sparkles className="size-3 text-amber-500" />
                Latest Insights
              </div>

              <h1
                id="blog-hero-heading"
                className="text-foreground text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl md:text-7xl"
              >
                Engineering <span className="text-accent">Stories.</span>
              </h1>

              <p className="text-muted max-w-2xl text-lg leading-relaxed md:text-xl">
                Thoughts from the VeriWorkly team on career engineering, privacy-first technology,
                and the future of professional storytelling.
              </p>

              <div className="flex flex-wrap items-center justify-start gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="primary"
                  className="h-14 px-8 text-base shadow-xl shadow-blue-500/20"
                >
                  <Link href="/archive" aria-label="Read articles">
                    Explore Archive
                  </Link>
                </Button>
                <div className="text-muted flex items-center gap-2 text-sm font-medium italic">
                  Powered by{" "}
                  <Link
                    href="https://fumadocs.vercel.app"
                    target="_blank"
                    className="text-foreground font-bold hover:underline"
                  >
                    Fumadocs
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Card className="bg-background/70 p-5 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 flex size-10 items-center justify-center rounded-lg">
                    <PenTool className="text-accent size-5" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">{allPosts.length}</p>
                    <p className="text-muted text-xs">Articles published</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-background/70 p-5 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 flex size-10 items-center justify-center rounded-lg">
                    <BookOpen className="text-accent size-5" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">Weekly</p>
                    <p className="text-muted text-xs">New updates</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="space-y-12">
            <div className="border-border flex items-end justify-between border-b pb-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight md:text-4xl">Featured Article</h2>
                <p className="text-muted font-medium">
                  Our latest deep dive into career engineering.
                </p>
              </div>
              <div className="hidden md:block">
                <Link href="/archive" className="text-accent text-sm font-bold hover:underline">
                  View archive
                </Link>
              </div>
            </div>

            <Link href={featuredPost.url} className="group block">
              <Card className="border-border/50 hover:border-accent/40 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5">
                <div className="grid lg:grid-cols-2">
                  <div className="relative aspect-video overflow-hidden bg-zinc-100 lg:aspect-auto dark:bg-zinc-900">
                    <div className="from-accent/20 absolute inset-0 bg-linear-to-br to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                      <div className="space-y-4 text-center transition-transform duration-500 group-hover:scale-105">
                        <div className="text-foreground text-4xl font-black tracking-tighter opacity-10 select-none lg:text-6xl">
                          VERIWORKLY
                        </div>
                        <div className="text-accent font-mono text-sm tracking-widest uppercase">
                          Case Study
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center space-y-6 p-8 md:p-12">
                    <div className="flex items-center gap-4 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                      <span>
                        {new Date(toBlogMeta(featuredPost.data).date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="size-1 rounded-full bg-zinc-300" />
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" /> 10m read
                      </span>
                    </div>

                    <h3 className="text-foreground group-hover:text-accent text-3xl leading-tight font-bold tracking-tight transition-colors md:text-5xl">
                      {toBlogMeta(featuredPost.data).title}
                    </h3>

                    <p className="text-muted line-clamp-3 text-lg leading-relaxed font-medium">
                      {toBlogMeta(featuredPost.data).description}
                    </p>

                    <div className="pt-4">
                      <span className="inline-flex items-center gap-2 text-sm font-bold tracking-wider text-blue-600 uppercase">
                        Read full article
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-2" />
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </section>
        )}

        {/* Posts Grid */}
        <section id="posts" className="space-y-12">
          <div className="flex items-end justify-between pb-6">
            <div className="space-y-2">
              <h2 className="text-foreground text-2xl font-bold tracking-tight md:text-4xl">
                Latest Articles
              </h2>
              <p className="text-muted font-medium">
                Fresh perspectives on modern work and technology.
              </p>
            </div>
            <Link
              href="/archive"
              className="text-accent hidden text-sm font-bold hover:underline md:block"
            >
              See all posts
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {remainingPosts.map((post) => {
              const meta = toBlogMeta(post.data);
              return (
                <Link key={post.url} href={post.url} className="group">
                  <Card className="border-border/50 hover:border-accent/40 h-full transition-all duration-500 group-hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/5">
                    <div className="flex h-full flex-col p-8">
                      <div className="mb-6 flex items-center gap-3 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                        <span className="text-zinc-500">
                          {new Date(meta.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="size-1 rounded-full bg-zinc-200" />
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" /> 5m
                        </span>
                      </div>

                      <h3 className="text-foreground group-hover:text-accent mb-4 text-2xl leading-tight font-bold transition-colors">
                        {meta.title}
                      </h3>

                      <p className="text-muted mb-8 line-clamp-3 text-base leading-relaxed font-medium">
                        {meta.description}
                      </p>

                      <div className="mt-auto flex items-center gap-2 text-xs font-bold tracking-wider text-blue-600 uppercase transition-colors group-hover:text-blue-500">
                        Read More{" "}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="flex justify-center pt-12 md:hidden">
            <Button
              asChild
              variant="secondary"
              className="h-12 rounded-2xl border-zinc-200/50 px-8"
            >
              <Link href="/archive">View all articles</Link>
            </Button>
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
                Blog FAQ
              </h2>

              <p className="text-muted text-sm leading-7 md:text-base">
                Common questions about our content, guest posts, and engineering updates.
              </p>
            </div>

            <Accordion type="single" collapsible className="gap-3">
              {[
                {
                  question: "How often do you publish?",
                  answer:
                    "We aim for one deep-dive technical article per week, plus smaller updates on platform features.",
                },
                {
                  question: "Can I contribute to the blog?",
                  answer:
                    "Since we are open source, we welcome guest posts that align with our privacy-first and local-first engineering philosophy.",
                },
                {
                  question: "Where can I find release notes?",
                  answer:
                    "Release notes are published both here on the blog and in our GitHub repository.",
                },
              ].map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Blog Footer/CTA */}
        <section className="border-border bg-card relative overflow-hidden rounded-4xl border px-6 py-12 text-center md:px-10 md:py-24">
          <div className="bg-accent/10 pointer-events-none absolute inset-0 blur-3xl" />
          <div className="relative mx-auto max-w-3xl space-y-8">
            <h2 className="text-foreground text-4xl font-bold tracking-tight md:text-6xl">
              Stay in the loop.
            </h2>
            <p className="text-muted mx-auto max-w-2xl text-xl leading-relaxed font-medium">
              Follow our journey as we build the best privacy-first resume builder for engineers.
              Join 5,000+ others on our newsletter.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <Button
                asChild
                variant="primary"
                size="lg"
                className="h-14 rounded-2xl px-10 text-base font-bold shadow-xl shadow-blue-500/20"
              >
                <Link href={siteConfig.links.github} target="_blank">
                  Follow on GitHub
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="h-14 rounded-2xl border-zinc-200/50 px-10 text-base font-bold"
              >
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
};

export default BlogHome;
