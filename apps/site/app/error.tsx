"use client";

import Link from "next/link";

import { Button, Container } from "@veriworkly/ui";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="surface-grid border-border/50 relative mx-4 my-8 flex min-h-[80vh] items-center justify-center overflow-hidden rounded-3xl border md:mx-8 md:my-12">
      <div className="from-background/0 via-background/20 to-background/80 pointer-events-none absolute inset-0 bg-linear-to-b" />

      <Container className="relative flex flex-col items-center py-20 text-center">
        <div className="bg-destructive/10 text-destructive shadow-destructive/5 mb-8 flex h-24 w-24 items-center justify-center rounded-full shadow-xl">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <p className="text-destructive text-sm font-bold tracking-[0.2em] uppercase">
          Application Error
        </p>

        <h1 className="text-foreground mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
          Something went wrong
        </h1>

        <p className="text-muted mt-6 max-w-md text-base leading-7">
          An unexpected error occurred. This might be a temporary issue or a problem with the server
          connection.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" variant="primary" className="rounded-full px-8" onClick={() => reset()}>
            Try again
          </Button>

          <Button asChild size="lg" variant="ghost" className="rounded-full px-8">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
