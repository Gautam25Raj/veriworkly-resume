import RoadmapPageShell from "../components/RoadmapPageShell";
import {
  fetchRoadmapFromBackend,
  type RoadmapSort,
} from "@/features/roadmap/services/roadmap-backend";

export const metadata = {
  title: "Roadmap To Do | VeriWorkly Resume",
};

function parseSort(raw: string | undefined): RoadmapSort | undefined {
  if (raw === "newest" || raw === "oldest" || raw === "recently-completed") {
    return raw;
  }

  return undefined;
}

interface TodoRoadmapPageProps {
  searchParams: Promise<{
    sort?: string;
    refresh?: string;
  }>;
}

export default async function TodoRoadmapPage({
  searchParams,
}: TodoRoadmapPageProps) {
  const params = await searchParams;

  const data = await fetchRoadmapFromBackend({
    status: "todo",
    sort: parseSort(params.sort),
    refreshSection: params.refresh === "todo" ? "todo" : undefined,
  });

  return (
    <RoadmapPageShell
      title="Roadmap: To Do"
      description="Upcoming features in planning with current priority and timeline context."
      data={data}
      basePath="/roadmap/todo"
      activeStatus="todo"
    />
  );
}
