export const familyByTemplateId: Record<
  string,
  "Compact Core" | "Modern Core"
> = {
  modern: "Modern Core",
  minimal: "Modern Core",
  executive: "Modern Core",
  ats: "Compact Core",
  "classic-academic": "Compact Core",
  "structured-professional": "Compact Core",
  "academic-serif": "Compact Core",
};

export function getSingleParam(
  value: string | string[] | undefined,
  fallback: string,
) {
  if (!value) return fallback;
  return Array.isArray(value) ? (value[0] ?? fallback) : value;
}

export function getLayout(tags: string[]) {
  if (tags.includes("Two column")) return "Two column";
  if (tags.includes("One column")) return "One column";
  return "Other";
}

export function hrefWithFilters(family: string, layout: string) {
  const params = new URLSearchParams();

  if (family !== "All") params.set("family", family);
  if (layout !== "All") params.set("layout", layout);

  return params.toString() ? `/templates?${params.toString()}` : "/templates";
}
