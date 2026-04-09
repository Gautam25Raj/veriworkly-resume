import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface StatsOverviewProps {
  projectName: string;
  projectUrl: string;
  totalItems: number;
  issueCount: number;
  pullRequestCount: number;
  completionRate: string;
}

export default function StatsOverview({
  projectName,
  projectUrl,
  totalItems,
  issueCount,
  pullRequestCount,
  completionRate,
}: StatsOverviewProps) {
  return (
    <section className="border-border/70 bg-card/80 mb-10 rounded-4xl border p-7 shadow-sm backdrop-blur md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-foreground text-2xl font-semibold">
              {projectName}
            </h2>

            <Link
              target="_blank"
              href={projectUrl}
              rel="noopener noreferrer"
              aria-label="Open GitHub project"
              className="text-muted hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
            </Link>
          </div>

          <p className="text-muted max-w-2xl leading-relaxed">
            Filters run in the backend against normalized sync items, so status,
            type, and date filtering stays accurate as history grows.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="border-border/60 bg-background/70 rounded-2xl border px-4 py-3">
            <p className="text-muted text-xs font-medium tracking-[0.2em] uppercase">
              Total
            </p>

            <p className="text-foreground mt-2 text-xl font-semibold">
              {totalItems}
            </p>
          </div>

          <div className="border-border/60 bg-background/70 rounded-2xl border px-4 py-3">
            <p className="text-muted text-xs font-medium tracking-[0.2em] uppercase">
              Issues
            </p>

            <p className="text-foreground mt-2 text-xl font-semibold">
              {issueCount}
            </p>
          </div>

          <div className="border-border/60 bg-background/70 rounded-2xl border px-4 py-3">
            <p className="text-muted text-xs font-medium tracking-[0.2em] uppercase">
              PR
            </p>

            <p className="text-foreground mt-2 text-xl font-semibold">
              {pullRequestCount}
            </p>
          </div>

          <div className="border-border/60 bg-background/70 rounded-2xl border px-4 py-3">
            <p className="text-muted text-xs font-medium tracking-[0.2em] uppercase">
              Completion
            </p>

            <p className="mt-2 text-xl font-semibold text-emerald-500 dark:text-emerald-300">
              {completionRate}%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
