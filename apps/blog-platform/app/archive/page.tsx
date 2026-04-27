import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Search } from "lucide-react";

import { blog } from "@/lib/source";
import { Container, Button, Card, Input } from "@veriworkly/ui";

const BlogArchive = () => {
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
        new Date(toBlogMeta(b.data).date).getTime() -
        new Date(toBlogMeta(a.data).date).getTime(),
    );

  return (
    <main className="surface-grid min-h-screen py-14 md:py-20">
      <Container className="space-y-12">
        <header className="space-y-8">
          <Link
            href="/"
            className="text-muted hover:text-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition"
          >
            <ArrowLeft className="size-4" /> Back to Home
          </Link>

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-6xl">
                The Archive.
              </h1>
              <p className="text-muted text-lg font-medium">
                Every story we've told about the future of career engineering.
              </p>
            </div>

            <div className="relative w-full md:max-w-sm">
              <Search className="text-muted absolute top-1/2 left-4 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search articles..."
                className="pl-11 border-zinc-200/50"
              />
            </div>
          </div>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post) => {
            const meta = toBlogMeta(post.data);
            return (
              <Link key={post.url} href={post.url} className="group">
                <Card className="border-border/50 hover:border-accent/40 h-full transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5 group-hover:-translate-y-2">
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

        {allPosts.length === 0 && (
          <div className="border-border/50 bg-card/50 flex flex-col items-center justify-center rounded-4xl border py-32 text-center">
            <p className="text-muted text-xl font-medium">No articles found.</p>
          </div>
        )}

        {/* Pagination Placeholder */}
        <div className="flex items-center justify-center gap-2 pt-12">
          <Button variant="secondary" className="rounded-xl px-4" disabled>
            Previous
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="primary" className="size-10 rounded-xl p-0">1</Button>
            <Button variant="ghost" className="size-10 rounded-xl p-0">2</Button>
            <Button variant="ghost" className="size-10 rounded-xl p-0">3</Button>
          </div>
          <Button variant="secondary" className="rounded-xl px-4">
            Next
          </Button>
        </div>
      </Container>
    </main>
  );
};

export default BlogArchive;
