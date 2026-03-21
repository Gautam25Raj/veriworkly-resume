import Link from "next/link";
import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { templateSummaries } from "@/config/templates";

import TemplateCard from "./components/TemplateCard";

export const metadata: Metadata = {
  title: `Templates | ${siteConfig.name}`,
  description: "Browse our collection of professional resume templates.",
};

type PageProps = {
  searchParams?: Promise<{
    family?: string;
    layout?: string;
  }>;
};

const familyByTemplateId: Record<string, "Compact Core" | "Modern Core"> = {
  modern: "Modern Core",
  minimal: "Modern Core",
  executive: "Modern Core",
  ats: "Compact Core",
  "classic-academic": "Compact Core",
  "structured-professional": "Compact Core",
  "academic-serif": "Compact Core",
};

function getSingleParam(
  value: string | string[] | undefined,
  fallback: string,
) {
  if (!value) {
    return fallback;
  }

  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value;
}

function getLayout(tags: string[]) {
  if (tags.includes("Two column")) {
    return "Two column";
  }

  if (tags.includes("One column")) {
    return "One column";
  }

  return "Other";
}

function hrefWithFilters(family: string, layout: string) {
  const params = new URLSearchParams();

  if (family !== "All") {
    params.set("family", family);
  }

  if (layout !== "All") {
    params.set("layout", layout);
  }

  const query = params.toString();

  return query ? `/templates?${query}` : "/templates";
}

const TemplatesPage = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;

  const selectedFamily = getSingleParam(resolvedSearchParams?.family, "All");
  const selectedLayout = getSingleParam(resolvedSearchParams?.layout, "All");

  const enrichedTemplates = templateSummaries.map((template) => ({
    ...template,
    family: familyByTemplateId[template.id] ?? "Compact Core",
    layout: getLayout(template.tags),
  }));

  const visibleTemplates = enrichedTemplates.filter((template) => {
    const familyMatch =
      selectedFamily === "All" || template.family === selectedFamily;
    const layoutMatch =
      selectedLayout === "All" || template.layout === selectedLayout;

    return familyMatch && layoutMatch;
  });

  const templateGroups: Array<{
    title: string;
    items: typeof visibleTemplates;
  }> = [
    {
      title: "Modern Core",
      items: visibleTemplates.filter(
        (template) => template.family === "Modern Core",
      ),
    },
    {
      title: "Compact Core",
      items: visibleTemplates.filter(
        (template) => template.family === "Compact Core",
      ),
    },
  ];

  const familyOptions = ["All", "Modern Core", "Compact Core"];
  const layoutOptions = ["All", "One column", "Two column", "Other"];

  return (
    <div className="space-y-12 py-10">
      <header className="space-y-4">
        <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
          Template Gallery
        </p>

        <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
          Choose a starting design system
        </h1>

        <p className="text-muted max-w-2xl text-base leading-7">
          Every template is driven by the same resume data shape, which keeps
          preview, export, and future collaboration features consistent.
        </p>

        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {familyOptions.map((family) => {
              const active = selectedFamily === family;
              return (
                <Link
                  className={[
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border text-muted hover:text-foreground",
                  ].join(" ")}
                  href={hrefWithFilters(family, selectedLayout)}
                  key={family}
                >
                  {family}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {layoutOptions.map((layout) => {
              const active = selectedLayout === layout;
              return (
                <Link
                  className={[
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border text-muted hover:text-foreground",
                  ].join(" ")}
                  href={hrefWithFilters(selectedFamily, layout)}
                  key={layout}
                >
                  {layout}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {visibleTemplates.length ? (
        <div className="space-y-12">
          {templateGroups.map((group) =>
            group.items.length ? (
              <section className="space-y-5" key={group.title}>
                <h2 className="text-foreground text-2xl font-semibold tracking-tight">
                  {group.title}
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                  {group.items.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              </section>
            ) : null,
          )}
        </div>
      ) : (
        <div className="border-border bg-card rounded-xl border p-6">
          <p className="text-foreground text-base font-medium">
            No templates match these filters.
          </p>

          <p className="text-muted mt-1 text-sm">
            Try switching family or layout to see more options.
          </p>

          <Link
            className="text-accent hover:text-accent/80 mt-3 inline-block text-sm font-medium"
            href="/templates"
          >
            Reset filters
          </Link>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
