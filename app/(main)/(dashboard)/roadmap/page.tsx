import { siteConfig } from "@/config/site";

import {
  type RoadmapSort,
  fetchRoadmapFromBackend,
} from "@/features/roadmap/services/roadmap-backend";

import RoadmapPageShell from "./components/RoadmapPageShell";
import RoadmapSEOContent from "./components/RoadmapSEOContent";

export const metadata = {
  title: `Product Roadmap | ${siteConfig.name}`,
  description:
    "Explore upcoming features, improvements, and recently completed updates for our free resume builder.",

  openGraph: {
    title: `${siteConfig.shortName} Roadmap – What’s Coming Next`,
    description:
      "Track upcoming features and improvements. See what we're building next and what's already shipped.",
    url: `${siteConfig.url}/roadmap`,
    siteName: siteConfig.shortName,
    images: [
      {
        url: "/og/roadmap-page-og.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.shortName} Product Roadmap`,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.shortName} Roadmap`,
    description:
      "See upcoming features and improvements in our free resume builder.",
    images: ["/og/roadmap-page-og.png"],
    creator: "@noober_boy",
  },

  alternates: {
    canonical: `${siteConfig.url}/roadmap`,
  },
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
    <>
      <RoadmapPageShell
        data={data}
        basePath="/roadmap"
        activeStatus="all"
        title="Product Roadmap"
        description="Track what is planned, currently shipping, and completed. Use the filters and section refresh controls to explore roadmap data."
      />

      <RoadmapSEOContent />
    </>
  );
}
