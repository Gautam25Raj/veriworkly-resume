import Link from "next/link";

import { Button } from "@veriworkly/ui";

const TemplateNotFound = () => {
  return (
    <div className="space-y-10 py-10">
      <header className="space-y-4 text-center">
        <p className="text-accent text-xs font-semibold tracking-[0.24em] uppercase">
          Template Preview
        </p>

        <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
          Template not found
        </h1>

        <p className="text-muted mx-auto max-w-2xl text-base leading-7">
          The template you requested does not exist or has been removed from our collection.
        </p>
      </header>

      <section className="space-y-8">
        <div className="border-border bg-accent/5 relative mx-auto flex aspect-3/4 w-full max-w-4xl flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed p-12 text-center">
          <div className="bg-accent/10 text-accent mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-foreground text-2xl font-bold">Missing Layout</h2>

          <p className="text-muted mt-2 max-w-sm">
            We couldn&apos;t locate this specific resume format. Try browsing our other modern
            templates.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button asChild size="lg" variant="primary" className="rounded-full px-8">
            <Link href="/templates">Browse Templates</Link>
          </Button>

          <Button asChild size="lg" variant="ghost" className="rounded-full px-8">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default TemplateNotFound;
