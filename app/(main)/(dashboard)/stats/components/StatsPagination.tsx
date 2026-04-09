import Link from "next/link";

import type {
  GitHubFilterKind,
  GitHubFilterStatus,
} from "@/features/github/services/github-backend";

import { PAGE_SIZE, buildSearchHref } from "./stats-utils";

interface StatsPaginationProps {
  status: GitHubFilterStatus;
  kind: GitHubFilterKind;
  currentPage: number;
  hasMore: boolean;
  updatedFrom?: string;
  updatedTo?: string;
}

export default function StatsPagination({
  status,
  kind,
  currentPage,
  hasMore,
  updatedFrom,
  updatedTo,
}: StatsPaginationProps) {
  return (
    <section className="border-border/70 bg-card/60 mt-10 flex flex-col gap-4 rounded-3xl border p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="text-foreground text-sm font-semibold">Pagination</p>

        <p className="text-muted text-sm">
          Each page returns {PAGE_SIZE} items and remains cached until the next
          sync.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={buildSearchHref({
            status,
            kind,
            page: Math.max(1, currentPage - 1),
            updatedFrom,
            updatedTo,
          })}
          aria-disabled={currentPage <= 1}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            currentPage <= 1
              ? "bg-card text-muted pointer-events-none opacity-50"
              : "bg-background text-foreground hover:bg-card"
          }`}
        >
          Previous
        </Link>

        <Link
          href={buildSearchHref({
            status,
            kind,
            page: currentPage + 1,
            updatedFrom,
            updatedTo,
          })}
          aria-disabled={!hasMore}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            hasMore
              ? "bg-accent text-accent-foreground hover:opacity-90"
              : "bg-card text-muted pointer-events-none opacity-50"
          }`}
        >
          Next
        </Link>
      </div>
    </section>
  );
}
