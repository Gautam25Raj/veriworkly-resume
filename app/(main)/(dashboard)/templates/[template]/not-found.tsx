import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const TemplateNotFound = () => {
  return (
    <div className="space-y-10 py-10">
      <header className="space-y-4">
        <p className="text-accent text-xs font-semibold tracking-[0.24em] uppercase">
          Template Preview
        </p>

        <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
          Template not found
        </h1>

        <p className="text-muted max-w-2xl text-base leading-7">
          The template you requested does not exist or has been removed.
        </p>
      </header>

      <Card className="space-y-6 p-4 md:p-6">
        <div className="bg-border border-border h-[62vh] w-full rounded-2xl border border-dashed" />

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

export default TemplateNotFound;
