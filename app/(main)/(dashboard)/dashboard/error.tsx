"use client";

import { Button } from "@/components/ui/Button";

export default function DashboardPageError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-6 py-8">
      <section className="border-border bg-card relative overflow-hidden rounded-3xl border p-6 sm:p-8">
        <div className="bg-accent/10 absolute -top-14 right-0 h-44 w-44 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
            Resume Workspace
          </p>
          <h1 className="text-foreground mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            We could not load your resumes
          </h1>
          <p className="text-muted mt-2 max-w-xl text-sm leading-6">
            Browser storage may be blocked or temporarily unavailable. Retry
            this view, or open templates to start a fresh resume.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button onClick={() => reset()}>Retry</Button>
            <Button
              variant="secondary"
              onClick={() => (window.location.href = "/templates")}
            >
              Browse Templates
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-card/70 h-40 rounded-3xl border border-dashed"
          />
        ))}
      </section>
    </div>
  );
}
