import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Share2, MoreHorizontal, Calendar } from "lucide-react";
import { DocsBody } from "fumadocs-ui/layouts/notebook/page";

import { blog } from "@/lib/source";
import { getMDXComponents } from "@/components/mdx";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage(props: PageProps) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  const data = page.data as unknown as {
    title: string;
    description: string;
    author: string;
    date: string;
    body: ComponentType<{ components: any }>;
  };

  const MDX = data.body;

  return (
    <main className="surface-grid min-h-screen py-14 md:py-20">
      <Container>
        <article className="border-border bg-card relative overflow-hidden rounded-4xl border px-6 py-10 shadow-[0_30px_90px_-50px_rgba(0,0,0,0.45)] md:px-16 md:py-20">
          <div className="bg-accent/5 pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full blur-3xl" />

          <nav className="relative mb-12 flex items-center justify-between">
            <Link
              href="/"
              className="text-muted hover:text-foreground flex items-center gap-2 text-sm font-bold tracking-widest uppercase transition"
            >
              <ArrowLeft className="size-4" /> Back to Blog
            </Link>
            <div className="flex items-center gap-4">
              <button className="text-muted hover:text-foreground transition">
                <Share2 className="size-4" />
              </button>
              <button className="text-muted hover:text-foreground transition">
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </nav>

          <header className="relative mb-16 space-y-8">
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-zinc-400">
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                {new Date(data.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4" />6 min read
              </div>
              <div className="bg-accent/10 text-accent rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase">
                Engineering
              </div>
            </div>

            <h1 className="text-foreground text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl md:text-6xl">
              {data.title}
            </h1>

            <p className="text-muted max-w-3xl text-xl leading-relaxed font-medium">
              {data.description}
            </p>

            <div className="flex items-center gap-4 pt-4">
              <div className="bg-foreground text-background flex size-12 items-center justify-center rounded-full text-lg font-bold shadow-lg">
                V
              </div>
              <div>
                <p className="text-foreground leading-none font-bold">VeriWorkly Team</p>
                <p className="text-muted mt-1 text-xs">Core Contributors</p>
              </div>
            </div>
          </header>

          <div className="relative">
            <DocsBody className="">
              <MDX components={getMDXComponents()} />
            </DocsBody>
          </div>

          <footer className="border-border mt-20 border-t pt-16">
            <div className="bg-accent/5 rounded-3xl p-8 md:p-12">
              <div className="flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
                <div className="bg-foreground text-background flex size-20 shrink-0 items-center justify-center rounded-2xl text-4xl font-bold shadow-2xl">
                  V
                </div>
                <div className="space-y-4">
                  <h3 className="text-foreground text-2xl font-bold">Written by VeriWorkly</h3>
                  <p className="text-muted text-lg leading-relaxed">
                    We're on a mission to build the most private and professional career engineering
                    platform. Join us in redefining how professional stories are told.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 pt-2 md:justify-start">
                    <Link
                      href={siteConfig.links.github}
                      className="text-accent text-sm font-bold tracking-wider uppercase hover:underline"
                    >
                      Follow our progress
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </article>
      </Container>
    </main>
  );
}

export function generateStaticParams() {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  const ogUrl = new URL(`${siteConfig.url}/api/og`);
  ogUrl.searchParams.set("title", page.data.title || siteConfig.name);
  ogUrl.searchParams.set("description", page.data.description || siteConfig.description);

  return {
    title: page.data.title,
    description: page.data.description,
    authors: [{ name: "VeriWorkly Team" }],
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      type: "article",
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: page.data.title || siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description,
      images: [ogUrl.toString()],
    },
  };
}
