import Link from "next/link";

import { Card } from "@/components/ui/Card";

import { templateSummaries } from "@/config/templates";

const TemplatesPreview = () => {
  const featured = templateSummaries.slice(0, 3);

  return (
    <section className="space-y-5" aria-labelledby="templates-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-muted text-xs font-semibold tracking-[0.24em] uppercase">
            Templates
          </p>

          <h2
            id="templates-heading"
            className="text-foreground text-3xl font-semibold tracking-tight"
          >
            Pick a style. Keep your content.
          </h2>
        </div>

        <Link
          className="text-accent text-sm font-medium"
          href="/templates"
          aria-label="View all resume templates"
        >
          View all templates
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {featured.map((template) => (
          <Card className="space-y-4" key={template.id}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-foreground text-lg font-semibold">
                {template.name}
              </h3>

              <span
                aria-hidden="true"
                className="h-2.5 w-10 rounded-full"
                style={{ backgroundColor: template.accentColor }}
              />
            </div>

            <p className="text-muted text-sm leading-6">
              {template.description}
            </p>

            <Link
              href={`/templates/${template.id}`}
              className="text-accent text-sm font-medium"
              aria-label={`Preview ${template.name} resume template`}
            >
              Preview
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TemplatesPreview;
