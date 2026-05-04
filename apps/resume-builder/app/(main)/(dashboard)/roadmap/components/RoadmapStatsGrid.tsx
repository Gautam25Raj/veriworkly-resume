import { type RoadmapSectionResponse } from "@/features/roadmap/services/roadmap-backend";

const RoadmapStatsGrid = ({
  sections,
}: {
  sections: RoadmapSectionResponse[];
}) => {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-3">
      {sections.map((section) => (
        <div
          key={section.status}
          className="border-border bg-card/40 rounded-2xl border p-5"
        >
          <p className="text-muted text-sm">{section.title}</p>

          <p className="text-foreground mt-1 text-3xl font-bold">
            {section.items.length}
          </p>

          <p className="text-muted mt-2 text-xs">
            Fetched {new Date(section.fetchedAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RoadmapStatsGrid;
