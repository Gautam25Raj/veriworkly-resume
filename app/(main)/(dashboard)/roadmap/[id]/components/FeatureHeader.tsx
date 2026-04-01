import { Badge } from "@/components/ui/Badge";

import type { RoadmapFeature } from "@/features/roadmap/services/roadmap-backend";

const statusColors = {
  todo: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  "in-progress": "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  done: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

const statusLabels = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

const FeatureHeader = ({ feature }: { feature: RoadmapFeature }) => {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <Badge
            className={
              statusColors[feature.status as keyof typeof statusColors]
            }
          >
            {statusLabels[feature.status as keyof typeof statusLabels]}
          </Badge>

          {feature.eta && (
            <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-300">
              ETA: {feature.eta}
            </Badge>
          )}

          {feature.completedQuarter && (
            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              {feature.completedQuarter}
            </Badge>
          )}
        </div>

        <h1 className="text-foreground mb-4 text-4xl font-bold">
          {feature.title}
        </h1>

        <p className="text-muted text-lg leading-relaxed">
          {feature.description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-border bg-card/40 rounded-xl border p-4">
          <p className="text-muted text-xs">Created</p>

          <p className="text-foreground mt-1 text-sm font-semibold">
            {new Date(feature.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="border-border bg-card/40 rounded-xl border p-4">
          <p className="text-muted text-xs">Started</p>

          <p className="text-foreground mt-1 text-sm font-semibold">
            {feature.startedAt
              ? new Date(feature.startedAt).toLocaleDateString()
              : "Not started"}
          </p>
        </div>

        <div className="border-border bg-card/40 rounded-xl border p-4">
          <p className="text-muted text-xs">Completed</p>

          <p className="text-foreground mt-1 text-sm font-semibold">
            {feature.completedAt
              ? new Date(feature.completedAt).toLocaleDateString()
              : "In progress"}
          </p>
        </div>

        <div className="border-border bg-card/40 rounded-xl border p-4">
          <p className="text-muted text-xs">Last update</p>

          <p className="text-foreground mt-1 text-sm font-semibold">
            {new Date(feature.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {feature.tags && feature.tags.length > 0 && (
        <div>
          <h3 className="text-foreground mb-3 font-semibold">Tags</h3>

          <div className="flex flex-wrap gap-2">
            {feature.tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-slate-500/10 text-slate-700 dark:text-slate-300"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureHeader;
