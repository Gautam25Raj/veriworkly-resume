import Link from "next/link";

import { type RoadmapSort } from "@/features/roadmap/services/roadmap-backend";

import { buildHref } from "./RoadmapPageShell";
import { buttonClassName } from "@veriworkly/ui";

const RoadmapSortControls = ({
  basePath,
  currentSort,
}: {
  basePath: string;
  currentSort: RoadmapSort;
}) => {
  const sorts: { label: string; value: RoadmapSort }[] = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Recently completed", value: "recently-completed" },
  ];

  return (
    <div className="flex flex-wrap gap-2 lg:justify-end">
      {sorts.map(({ label, value }) => (
        <Link
          key={value}
          href={buildHref(basePath, currentSort, { sort: value })}
          className={buttonClassName(
            currentSort === value ? "primary" : "secondary",
            "sm",
          )}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};

export default RoadmapSortControls;
