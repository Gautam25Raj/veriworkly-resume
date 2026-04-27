import { Badge } from "@veriworkly/ui";

import { formatAbsoluteTime, formatRelativeTime } from "./stats-utils";

interface StatsHeroProps {
  syncedAt: string | null;
  nextSyncAt: string | null;
}

export default function StatsHero({ syncedAt, nextSyncAt }: StatsHeroProps) {
  return (
    <div className="mb-10 flex flex-col gap-3">
      <Badge className="border-border/60 bg-background/80 w-fit backdrop-blur">
        Live GitHub sync
      </Badge>

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
            Development Activity
          </h1>

          <p className="text-muted max-w-2xl text-lg leading-relaxed">
            Track the public GitHub board with server-side filters, pagination,
            and cache-backed snapshots that refresh on the next sync.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
            Synced {formatRelativeTime(syncedAt)}
          </Badge>

          <Badge className="bg-card/60 text-muted">
            Next sync {formatAbsoluteTime(nextSyncAt)}
          </Badge>
        </div>
      </div>
    </div>
  );
}
