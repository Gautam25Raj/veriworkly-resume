import Link from "next/link";

import type {
  GitHubFilterKind,
  GitHubFilterStatus,
} from "@/features/github/services/github-backend";

import { kindOptions, statusOptions, buildSearchHref } from "./stats-utils";

interface StatsFiltersProps {
  status: GitHubFilterStatus;
  kind: GitHubFilterKind;
  updatedFrom?: string;
  updatedTo?: string;
}

export default function StatsFilters({
  status,
  kind,
  updatedFrom,
  updatedTo,
}: StatsFiltersProps) {
  return (
    <section className="mb-8 space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-foreground text-xl font-semibold">
            Filter by status
          </h2>

          <p className="text-muted text-sm">
            Status, type, and date filters are applied on the server.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <Link
              key={option.value}
              href={buildSearchHref({
                status: option.value,
                kind,
                page: 1,
                updatedFrom,
                updatedTo,
              })}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                status === option.value
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted hover:text-foreground hover:bg-background"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {kindOptions.map((option) => (
          <Link
            key={option.value}
            href={buildSearchHref({
              status,
              kind: option.value,
              page: 1,
              updatedFrom,
              updatedTo,
            })}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase transition-colors ${
              kind === option.value
                ? "bg-foreground text-background"
                : "border-border text-muted hover:text-foreground border bg-transparent"
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>

      <form
        method="get"
        action="/stats"
        className="border-border/70 bg-card/60 flex flex-wrap items-end gap-3 rounded-3xl border p-4"
      >
        {status !== "all" ? (
          <input type="hidden" name="status" value={status} />
        ) : null}

        {kind !== "all" ? (
          <input type="hidden" name="kind" value={kind} />
        ) : null}

        <div className="flex flex-col gap-1">
          <label
            htmlFor="updatedFrom"
            className="text-muted text-xs font-medium"
          >
            Updated from
          </label>

          <input
            type="date"
            id="updatedFrom"
            name="updatedFrom"
            defaultValue={updatedFrom}
            className="border-border bg-background rounded-xl border px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="updatedTo" className="text-muted text-xs font-medium">
            Updated to
          </label>

          <input
            type="date"
            id="updatedTo"
            name="updatedTo"
            defaultValue={updatedTo}
            className="border-border bg-background rounded-xl border px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="bg-foreground text-background rounded-full px-4 py-2 text-sm font-medium"
        >
          Apply Date Filter
        </button>

        <Link
          href={buildSearchHref({
            status,
            kind,
            page: 1,
          })}
          className="text-muted hover:text-foreground px-2 py-2 text-sm"
        >
          Clear Dates
        </Link>
      </form>
    </section>
  );
}
