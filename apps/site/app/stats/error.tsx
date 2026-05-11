"use client";

import Link from "next/link";

import { Button, Container } from "@veriworkly/ui";

export default function StatsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="from-destructive/10 pointer-events-none absolute inset-x-0 top-0 h-64" />

      <Container className="relative py-12 text-center md:py-16">
        <header className="mx-auto mb-12 max-w-2xl space-y-4">
          <p className="text-destructive text-xs font-semibold tracking-[0.24em] uppercase">
            Sync Error
          </p>

          <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
            GitHub board sync failed
          </h1>

          <p className="text-muted text-base leading-7">
            We encountered a problem while fetching the latest development activity from GitHub. The
            board might be temporarily unavailable.
          </p>
        </header>

        <section className="border-border bg-destructive/5 mx-auto flex max-w-4xl flex-col items-center justify-center rounded-3xl border border-dashed py-20">
          <div className="bg-destructive/10 text-destructive mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>

          <h2 className="text-foreground text-2xl font-bold">API Connection Lost</h2>

          <p className="text-muted mt-2 max-w-sm px-6">
            We couldn&apos;t establish a secure connection to our development activity worker.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              variant="primary"
              className="rounded-full px-8"
              onClick={() => reset()}
            >
              Reconnect Sync
            </Button>

            <Button asChild size="lg" variant="ghost" className="rounded-full px-8">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </section>
      </Container>
    </main>
  );
}
