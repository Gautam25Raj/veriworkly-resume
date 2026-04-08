import { useMemo } from "react";

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
  basePath: string;
  activeStatus: "all" | "todo" | "in-progress" | "done";
  rootPath?: string;
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

const INITIAL_REFRESH_TIMESTAMP = Date.now().toString();

const RoadmapPageShell = ({
  title,
  description,
  data,
  basePath,
  activeStatus,
  rootPath = "/roadmap",
}: RoadmapPageShellProps) => {
  const currentSort = data.query.sort;
  const normalizedRootPath = rootPath.replace(/\/$/, "");

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

  const refreshTimestamp = useMemo(() => INITIAL_REFRESH_TIMESTAMP, []);

  const refreshHrefMap = useMemo(
    () =>
      Object.fromEntries(
        data.sections.map((section) => [
          section.title,
          buildHref(basePath, currentSort, {
            refresh: section.status,
            r: refreshTimestamp,
          }),
        ]),
      ),
    [data.sections, basePath, currentSort, refreshTimestamp],
  );

  const columnHrefMap = {
    "To Do": `${normalizedRootPath}/todo`,
    "In Progress": `${normalizedRootPath}/in-progress`,
    Done: `${normalizedRootPath}/done`,
  };

  return (
    <main className="flex min-h-screen flex-col">
      <Container className="py-10 md:py-14">
        <RoadmapHeader title={title} description={description} />

        <div className="border-border/60 bg-card/40 mb-8 flex justify-between rounded-2xl border p-5">
          <RoadmapStatusFilters
            currentSort={currentSort}
            activeStatus={activeStatus}
            rootPath={normalizedRootPath}
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
