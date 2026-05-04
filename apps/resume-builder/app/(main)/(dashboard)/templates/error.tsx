"use client";

import { Button } from "@veriworkly/ui";

const TemplatesError = ({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <div className="space-y-12 py-10">
      <header className="space-y-4">
        <p className="text-accent text-xs font-semibold tracking-[0.24em] uppercase">
          Template Gallery
        </p>

        <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
          We could not load templates
        </h1>

        <p className="text-muted max-w-2xl text-base leading-7">
          Retry this gallery, or return to your dashboard and continue from
          there.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button onClick={() => reset()}>Try again</Button>

          <Button
            variant="secondary"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-card/70 h-64 rounded-3xl border border-dashed"
          />
        ))}
      </div>
    </div>
  );
};

export default TemplatesError;
