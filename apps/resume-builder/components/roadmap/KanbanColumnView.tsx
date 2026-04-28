import Link from "next/link";

import { cn } from "@/lib/utils";

import { KanbanColumn } from "./KanbanBoard";
import KanbanItemCard from "./KanbanItemCard";

const KanbanColumnView = ({
  column,
  colorClass,
  columnHref,
  refreshHref,
  singleStatusMode,
  showDescription,
  showUrl,
  showRoadmapLinks,
}: {
  column: KanbanColumn;
  colorClass: string;
  columnHref?: string;
  refreshHref?: string;
  singleStatusMode: boolean;
  showDescription: boolean;
  showUrl: boolean;
  showRoadmapLinks: boolean;
}) => {
  return (
    <div className="flex min-h-0 flex-col gap-4">
      <div className="flex items-center justify-between">
        {columnHref ? (
          <Link
            href={columnHref}
            className="text-foreground hover:text-primary text-lg font-semibold transition-colors"
          >
            {column.title}
          </Link>
        ) : (
          <h3 className="text-foreground text-lg font-semibold">
            {column.title}
          </h3>
        )}

        <span
          className={cn(
            "rounded-full px-2 py-1 text-sm font-medium",
            colorClass,
          )}
        >
          {column.items.length}
        </span>
      </div>

      {refreshHref && (
        <Link
          href={refreshHref}
          className="text-muted hover:text-foreground w-fit text-xs font-medium transition-colors"
        >
          Refresh {column.title}
        </Link>
      )}

      <div
        className={cn(
          "gap-3",
          singleStatusMode
            ? "grid md:grid-cols-2 xl:grid-cols-3"
            : "flex flex-col",
        )}
      >
        {column.items.length === 0 ? (
          <div className="border-border/30 rounded-2xl border-2 border-dashed p-6 text-center">
            <p className="text-muted text-sm">No items yet</p>
          </div>
        ) : (
          column.items.map((item) => (
            <KanbanItemCard
              key={item.id}
              item={item}
              showDescription={showDescription}
              showUrl={showUrl}
              showRoadmapLinks={showRoadmapLinks}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumnView;
