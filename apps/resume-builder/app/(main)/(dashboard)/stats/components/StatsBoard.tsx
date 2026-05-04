import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Badge } from "@veriworkly/ui";

import type { GitHubIssuePage } from "@/features/github/services/github-backend";

import { formatRelativeTime, statusBadgeClass } from "./stats-utils";

interface StatsBoardProps {
  issuePage: GitHubIssuePage | null;
  totalItems: number;
  offset: number;
}

export default function StatsBoard({
  issuePage,
  totalItems,
  offset,
}: StatsBoardProps) {
  const items = issuePage?.items ?? [];

  const totalPages = Math.max(1, Math.ceil((issuePage?.total ?? 0) / 20));
  const currentPage = Math.floor(offset / 20) + 1;

  const showingStart = totalItems === 0 ? 0 : offset + 1;
  const showingEnd = Math.min(offset + items.length, totalItems);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-foreground text-2xl font-semibold">
            Project Board
          </h2>

          <p className="text-muted text-sm">
            Showing {showingStart}-{showingEnd} of {totalItems} items.
          </p>
        </div>

        {issuePage ? (
          <Badge className="bg-card/70 text-muted">
            Page {currentPage} of {totalPages}
          </Badge>
        ) : null}
      </div>

      <div className="grid gap-4">
        {items.length > 0 ? (
          items.map((item) => (
            <article
              key={item.id}
              className="border-border/70 bg-card/80 hover:border-border rounded-3xl border p-5 transition-colors"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={statusBadgeClass[item.status] + " capitalize"}
                    >
                      {item.status}
                    </Badge>

                    <Badge className="bg-background/70 text-muted">
                      {item.kind === "pull-request" ? "Pull request" : "Issue"}
                    </Badge>

                    <Badge className="bg-background/70 text-muted">
                      #{item.number}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-foreground text-lg leading-snug font-semibold">
                      {item.title}
                    </h3>

                    <p className="text-muted text-sm">
                      Updated {formatRelativeTime(item.updatedAt)}
                    </p>
                  </div>

                  {item.labels.length > 0 ? (
                    <div className="flex flex-wrap gap-2 capitalize">
                      {item.labels.map((label) => (
                        <span
                          key={`${item.id}-${label}`}
                          className="border-border bg-background text-muted rounded-full border px-2.5 py-1 text-xs font-medium"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-foreground inline-flex items-center gap-2 self-start text-sm font-medium transition-colors"
                >
                  Open in GitHub
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="border-border/70 bg-card/80 rounded-3xl border p-8">
            <h3 className="text-foreground text-lg font-semibold">
              Nothing to show here
            </h3>

            <p className="text-muted mt-2 max-w-2xl text-sm leading-relaxed">
              Try a different status, type, or date range.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
