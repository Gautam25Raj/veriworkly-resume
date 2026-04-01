import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/components/layout/Container";

import {
  fetchRoadmapFeatureById,
  fetchSuggestedRoadmapItems,
} from "@/features/roadmap/services/roadmap-backend";

import FeatureHeader from "./components/FeatureHeader";
import FeatureDetailsContent from "./components/FeatureDetailsContent";
import SuggestedItemsSidebar from "./components/SuggestedItemsSidebar";

interface RoadmapDetailPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

const statusLabels = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

export const metadata = {
  title: "Roadmap Item | VeriWorkly Resume",
};

export default async function RoadmapDetailPage({
  params,
}: RoadmapDetailPageProps) {
  const { id } = await params;
  const feature = await fetchRoadmapFeatureById(id);

  if (!feature) {
    notFound();
  }

  const suggestedItems = await fetchSuggestedRoadmapItems(feature);

  return (
    <main className="flex min-h-screen flex-col">
      <Container className="py-8 md:py-12">
        <Link
          href={`/roadmap`}
          className="text-muted hover:text-foreground mb-8 inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <FeatureHeader feature={feature} />
            <FeatureDetailsContent feature={feature} />
          </div>

          <div className="md:col-span-1">
            <SuggestedItemsSidebar
              currentStatus={feature.status as keyof typeof statusLabels}
              suggestedItems={suggestedItems}
            />
          </div>
        </div>
      </Container>
    </main>
  );
}
