import Link from "next/link";

import { type RoadmapSort } from "@/features/roadmap/services/roadmap-backend";

import { buildHref } from "./RoadmapPageShell";
import { buttonClassName } from "@/components/ui/Button";

const RoadmapStatusFilters = ({
  currentSort,
  activeStatus,
}: {
  currentSort: RoadmapSort;
  activeStatus: string;
}) => {
  const statuses = [
    { label: "All", value: "all", path: "/roadmap" },
    { label: "To Do", value: "todo", path: "/roadmap/todo" },
    {
      label: "In Progress",
      value: "in-progress",
      path: "/roadmap/in-progress",
    },
    { label: "Done", value: "done", path: "/roadmap/done" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map(({ label, value, path }) => (
        <Link
          key={value}
          href={buildHref(path, currentSort, {})}
          className={buttonClassName(
            activeStatus === value ? "primary" : "secondary",
            "sm",
          )}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};

export default RoadmapStatusFilters;
