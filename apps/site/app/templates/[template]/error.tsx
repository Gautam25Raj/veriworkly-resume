"use client";

import Link from "next/link";

import { Button } from "@veriworkly/ui";

export default function TemplateError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-10 py-10">
      <header className="space-y-4 text-center">
        <p className="text-destructive text-xs font-semibold tracking-[0.24em] uppercase">
          Preview Error
        </p>

        <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
          Something went wrong
        </h1>

        <p className="text-muted mx-auto max-w-2xl text-base leading-7">
          We encountered an error while trying to load the template preview.
        </p>
      </header>

      <section className="space-y-8">
        <div className="border-border/50 bg-destructive/5 relative mx-auto flex aspect-3/4 w-full max-w-4xl flex-col items-center justify-center overflow-hidden rounded-2xl border p-12 text-center">
          <div className="bg-destructive/10 text-destructive mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-foreground text-2xl font-bold">Loading Failed</h2>
          <p className="text-muted mt-2 max-w-sm">
            This might be due to a network error or a temporary service disruption.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button size="lg" variant="primary" className="rounded-full px-8" onClick={() => reset()}>
            Retry Loading
          </Button>

          <Button asChild size="lg" variant="ghost" className="rounded-full px-8">
            <Link href="/templates">Back to Templates</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
