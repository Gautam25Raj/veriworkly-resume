import { cn } from "@/lib/utils";

import KanbanColumnView from "./KanbanColumnView";

export interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  tags?: string[];
  eta?: string;
  url?: string;
  updatedAt?: string;
  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
  completedQuarter?: string;
}

export interface KanbanColumn {
  title: string;
  items: KanbanItem[];
  color?: "blue" | "amber" | "emerald" | "gray";
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  showDescription?: boolean;
  showUrl?: boolean;
  showRoadmapLinks?: boolean;
  columnHrefMap?: Partial<Record<string, string>>;
  refreshHrefMap?: Partial<Record<string, string>>;
}

const statusColorMap = {
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  gray: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
};

const KanbanBoard = ({
  columns,
  showDescription = true,
  showUrl = false,
  showRoadmapLinks = false,
  columnHrefMap,
  refreshHrefMap,
}: KanbanBoardProps) => {
  const singleStatusMode = columns.length === 1;

  return (
    <div
      className={cn(
        "grid gap-6",
        singleStatusMode ? "grid-cols-1" : "lg:grid-cols-3",
      )}
    >
      {columns.map((column, idx) => {
        const columnColor = column.color || ["blue", "amber", "emerald"][idx];
        const colorClass =
          statusColorMap[columnColor as keyof typeof statusColorMap];

        return (
          <KanbanColumnView
            key={column.title}
            column={column}
            colorClass={colorClass}
            columnHref={columnHrefMap?.[column.title]}
            refreshHref={refreshHrefMap?.[column.title]}
            singleStatusMode={singleStatusMode}
            showDescription={showDescription}
            showUrl={showUrl}
            showRoadmapLinks={showRoadmapLinks}
          />
        );
      })}
    </div>
  );
};

export { KanbanBoard };
