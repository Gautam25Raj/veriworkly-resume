import RoadmapPageShell from "../components/RoadmapPageShell";
import {
  fetchRoadmapFromBackend,
  type RoadmapSort,
} from "@/features/roadmap/services/roadmap-backend";

export const metadata = {
  title: "Roadmap Done | VeriWorkly Resume",
};

export const dynamic = "force-dynamic";

function parseSort(raw: string | undefined): RoadmapSort | undefined {
  if (raw === "newest" || raw === "oldest" || raw === "recently-completed") {
    return raw;
  }

  return undefined;
}

interface DoneRoadmapPageProps {
  searchParams: Promise<{
    sort?: string;
    refresh?: string;
  }>;
}

export default async function DoneRoadmapPage({
  searchParams,
}: DoneRoadmapPageProps) {
  const params = await searchParams;

  const data = await fetchRoadmapFromBackend({
    status: "done",
    sort: parseSort(params.sort),
    refreshSection: params.refresh === "done" ? "done" : undefined,
  });

  return (
    <RoadmapPageShell
      title="Roadmap: Done"
      description="Completed features with creation, completion date, and shipped quarter history."
      data={data}
      basePath="/roadmap/done"
      activeStatus="done"
    />
  );
}
