import {
  type RoadmapSort,
  type RoadmapResponse,
} from "@/features/roadmap/services/roadmap-backend";

import {
  KanbanBoard,
  type KanbanColumn,
} from "@/components/roadmap/KanbanBoard";
import { Container } from "@/components/layout/Container";

import RoadmapHeader from "./RoadmapHeader";
import RoadmapStatsGrid from "./RoadmapStatsGrid";
import RoadmapSortControls from "./RoadmapSortControls";
import RoadmapStatusFilters from "./RoadmapStatusFilters";

interface RoadmapPageShellProps {
  title: string;
  description: string;
  data: RoadmapResponse;
  basePath:
    | "/roadmap"
    | "/roadmap/todo"
    | "/roadmap/in-progress"
    | "/roadmap/done";
  activeStatus: "all" | "todo" | "in-progress" | "done";
}

export const buildHref = (
  path: string,
  currentSort: RoadmapSort,
  updates: Record<string, string | undefined>,
) => {
  const params = new URLSearchParams();

  if (currentSort !== "newest") params.set("sort", currentSort);

  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === "") {
      params.delete(key);
      continue;
    }
    params.set(key, value);
  }

  const query = params.toString();
  return query ? `${path}?${query}` : path;
};

const RoadmapPageShell = ({
  title,
  description,
  data,
  basePath,
  activeStatus,
}: RoadmapPageShellProps) => {
  const currentSort = data.query.sort;

  const columns: KanbanColumn[] = data.sections.map((section) => ({
    title: section.title,
    color:
      section.status === "todo"
        ? "blue"
        : section.status === "in-progress"
          ? "amber"
          : "emerald",
    items: section.items.map((item) => ({
      ...item,
      eta: item.eta ?? undefined,
      startedAt: item.startedAt ?? undefined,
      completedAt: item.completedAt ?? undefined,
      completedQuarter: item.completedQuarter ?? undefined,
    })),
  }));

  const refreshHrefMap = Object.fromEntries(
    data.sections.map((section) => [
      section.title,
      buildHref(basePath, currentSort, {
        refresh: section.status,
        r: Date.now().toString(),
      }),
    ]),
  );

  const columnHrefMap = {
    "To Do": "/roadmap/todo",
    "In Progress": "/roadmap/in-progress",
    Done: "/roadmap/done",
  };

  return (
    <main className="flex min-h-screen flex-col">
      <Container className="py-10 md:py-14">
        <RoadmapHeader title={title} description={description} />

        <div className="border-border/60 bg-card/40 mb-8 flex justify-between rounded-2xl border p-5">
          <RoadmapStatusFilters
            currentSort={currentSort}
            activeStatus={activeStatus}
          />

          <RoadmapSortControls basePath={basePath} currentSort={currentSort} />
        </div>

        <RoadmapStatsGrid sections={data.sections} />

        <KanbanBoard
          showDescription
          showRoadmapLinks
          columns={columns}
          columnHrefMap={columnHrefMap}
          refreshHrefMap={refreshHrefMap}
        />
      </Container>
    </main>
  );
};

export default RoadmapPageShell;
