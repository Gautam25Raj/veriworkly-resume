import {
  type RoadmapSort,
  fetchRoadmapFromBackend,
} from "@/features/roadmap/services/roadmap-backend";

import RoadmapPageShell from "./components/RoadmapPageShell";

export const metadata = {
  title: "Roadmap | VeriWorkly Resume",
  description: "See what features we're building and when they'll ship.",
};

function parseSort(raw: string | undefined): RoadmapSort | undefined {
  if (raw === "newest" || raw === "oldest" || raw === "recently-completed") {
    return raw;
  }

  return undefined;
}

function parseStatus(raw: string | undefined) {
  if (raw === "todo" || raw === "in-progress" || raw === "done") {
    return raw;
  }

  return undefined;
}

interface RoadmapPageProps {
  searchParams: Promise<{
    sort?: string;
    refresh?: string;
  }>;
}

export default async function RoadmapPage({ searchParams }: RoadmapPageProps) {
  const params = await searchParams;

  const data = await fetchRoadmapFromBackend({
    sort: parseSort(params.sort),
    refreshSection: parseStatus(params.refresh),
  });

  return (
    <RoadmapPageShell
      data={data}
      basePath="/roadmap"
      activeStatus="all"
      title="Product Roadmap"
      description="Track what is planned, currently shipping, and completed. Use the filters and section refresh controls to explore roadmap data."
    />
  );
}
