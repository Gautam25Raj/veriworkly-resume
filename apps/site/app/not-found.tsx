import Link from "next/link";

import { Button, Container } from "@veriworkly/ui";

const NotFound = () => {
  return (
    <div className="surface-grid border-border/50 relative mx-4 my-8 flex min-h-[80vh] items-center justify-center overflow-hidden rounded-3xl border md:mx-8 md:my-12">
      <div className="from-background/0 via-background/20 to-background/80 pointer-events-none absolute inset-0 bg-linear-to-b" />

      <Container className="relative flex flex-col items-center py-20 text-center">
        <div className="bg-accent/10 text-accent shadow-accent/5 mb-8 flex h-24 w-24 items-center justify-center rounded-full shadow-xl">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <p className="text-accent text-sm font-bold tracking-[0.2em] uppercase">404 Error</p>

        <h1 className="text-foreground mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
          Lost in Space
        </h1>

        <p className="text-muted mt-6 max-w-md text-base leading-7">
          The page you&apos;re looking for has vanished into the digital void. Don&apos;t worry, we
          can help you find your way back.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" variant="primary" className="rounded-full px-8">
            <Link href="/">Back to Home</Link>
          </Button>

          <Button asChild size="lg" variant="ghost" className="rounded-full px-8">
            <Link href="/templates">View Templates</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default NotFound;
