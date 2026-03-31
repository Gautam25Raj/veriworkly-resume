import RoadmapPageShell from "../components/RoadmapPageShell";
import {
  fetchRoadmapFromBackend,
  type RoadmapSort,
} from "@/features/roadmap/services/roadmap-backend";

export const metadata = {
  title: "Roadmap In Progress | VeriWorkly Resume",
};

function parseSort(raw: string | undefined): RoadmapSort | undefined {
  if (raw === "newest" || raw === "oldest" || raw === "recently-completed") {
    return raw;
  }

  return undefined;
}

interface InProgressRoadmapPageProps {
  searchParams: Promise<{
    sort?: string;
    refresh?: string;
  }>;
}

export default async function InProgressRoadmapPage({
  searchParams,
}: InProgressRoadmapPageProps) {
  const params = await searchParams;

  const data = await fetchRoadmapFromBackend({
    status: "in-progress",
    sort: parseSort(params.sort),
    refreshSection:
      params.refresh === "in-progress" ? "in-progress" : undefined,
  });

  return (
    <RoadmapPageShell
      title="Roadmap: In Progress"
      description="Features currently under active development with creation and start dates."
      data={data}
      basePath="/roadmap/in-progress"
      activeStatus="in-progress"
    />
  );
}
