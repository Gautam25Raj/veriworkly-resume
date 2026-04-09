import Link from "next/link";

import { type RoadmapSort } from "@/features/roadmap/services/roadmap-backend";

import { buildHref } from "./RoadmapPageShell";
import { buttonClassName } from "@/components/ui/Button";

const RoadmapStatusFilters = ({
  currentSort,
  activeStatus,
  rootPath = "/roadmap",
}: {
  currentSort: RoadmapSort;
  activeStatus: string;
  rootPath?: string;
}) => {
  const normalizedRoot = rootPath.replace(/\/$/, "");

  const statuses = [
    { label: "All", value: "all", path: `${normalizedRoot}` },
    { label: "To Do", value: "todo", path: `${normalizedRoot}/todo` },
    {
      label: "In Progress",
      value: "in-progress",
      path: `${normalizedRoot}/in-progress`,
    },
    { label: "Done", value: "done", path: `${normalizedRoot}/done` },
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
