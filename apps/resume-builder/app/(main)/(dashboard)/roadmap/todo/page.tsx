import { siteConfig } from "@/config/site";

import {
  type RoadmapSort,
  fetchRoadmapFromBackend,
} from "@/features/roadmap/services/roadmap-backend";

import RoadmapPageShell from "../components/RoadmapPageShell";

export const metadata = {
  title: `Planned Features (Roadmap To Do) | ${siteConfig.name}`,
  description:
    "Explore upcoming features planned for VeriWorkly. See what’s next in our free, no-login resume builder.",

  openGraph: {
    title: `${siteConfig.shortName} Roadmap – Planned Features`,
    description:
      "Discover upcoming features and planned improvements in VeriWorkly resume builder.",
    url: `${siteConfig.url}/roadmap/todo`,
    siteName: siteConfig.shortName,
    images: [
      {
        url: "/og/roadmap/roadmap-todo-page-og.png",
        width: 1200,
        height: 630,
        alt: "VeriWorkly Planned Features Roadmap",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.shortName} Planned Features`,
    description:
      "See what features are planned next in our free resume builder.",
    images: ["/og/roadmap/roadmap-todo-page-og.png"],
    creator: "@noober_boy",
  },

  alternates: {
    canonical: `${siteConfig.url}/roadmap/todo`,
  },
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
      data={data}
      activeStatus="todo"
      basePath="/roadmap/todo"
      title="Roadmap: Upcoming Features"
      description="Upcoming features in planning with current priority and timeline context."
    />
  );
}
