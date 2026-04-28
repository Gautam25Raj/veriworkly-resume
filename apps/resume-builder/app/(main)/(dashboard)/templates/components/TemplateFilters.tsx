import Link from "next/link";

import { hrefWithFilters } from "./utils";

const familyOptions = ["All", "Modern Core", "Compact Core"];
const layoutOptions = ["All", "One column", "Two column", "Other"];

type Props = {
  selectedFamily: string;
  selectedLayout: string;
};

const TemplateFilters = ({ selectedFamily, selectedLayout }: Props) => {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex flex-wrap gap-2">
        {familyOptions.map((family) => {
          const active = selectedFamily === family;

          return (
            <Link
              key={family}
              href={hrefWithFilters(family, selectedLayout)}
              className={[
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                active
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border text-muted hover:text-foreground",
              ].join(" ")}
            >
              {family}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {layoutOptions.map((layout) => {
          const active = selectedLayout === layout;

          return (
            <Link
              key={layout}
              href={hrefWithFilters(selectedFamily, layout)}
              className={[
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                active
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border text-muted hover:text-foreground",
              ].join(" ")}
            >
              {layout}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateFilters;
