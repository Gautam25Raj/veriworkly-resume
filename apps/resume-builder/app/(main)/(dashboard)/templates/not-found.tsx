import Link from "next/link";

import { Card } from "@veriworkly/ui";
import { Button } from "@veriworkly/ui";

const TemplatesNotFound = () => {
  return (
    <div className="space-y-12 py-10">
      <header className="space-y-4">
        <p className="text-accent text-xs font-semibold tracking-[0.24em] uppercase">
          Template Gallery
        </p>

        <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
          Template page not found
        </h1>

        <p className="text-muted max-w-2xl text-base leading-7">
          This template route may have changed, or the link might be invalid.
        </p>
      </header>

      <Card className="space-y-6 p-6 md:p-8">
        <div className="bg-border border-border h-56 w-full rounded-2xl border border-dashed" />

        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="primary">
            <Link href="/templates">Browse Templates</Link>
          </Button>

          <Button asChild variant="ghost">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TemplatesNotFound;
