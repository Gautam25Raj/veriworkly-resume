import Link from "next/link";
import Image from "next/image";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    description: string;
    accentColor: string;
    previewImage: string;
    family: string;
    layout: string;
    tags: string[];
  };
}

const TemplateCard = ({ template }: TemplateCardProps) => {
  const topTags = template.tags.filter(
    (tag) => tag !== "One column" && tag !== "Two column",
  );

  return (
    <Card className="group hover:border-accent/40 relative flex flex-col justify-between space-y-6 overflow-visible transition-colors">
      <div className="pointer-events-none absolute top-4 right-4 z-30 hidden w-95 translate-y-2 opacity-0 transition-all duration-200 ease-out xl:block xl:group-hover:translate-y-0 xl:group-hover:opacity-100">
        <div className="border-border bg-card overflow-hidden rounded-xl border shadow-[0_24px_80px_-40px_rgba(15,23,42,0.6)]">
          <div
            className="h-1 w-full"
            style={{ backgroundColor: template.accentColor }}
          />

          <div className="relative h-56 bg-slate-100">
            {template.previewImage ? (
              <Image
                fill
                alt=""
                aria-hidden="true"
                src={template.previewImage}
                sizes="(min-width: 1280px) 380px, 100vw"
                className="h-full w-full object-cover object-top"
              />
            ) : null}

            <div className="absolute inset-0 bg-linear-to-b from-black/0 via-black/0 to-black/45" />

            <p className="absolute right-3 bottom-3 rounded-full border border-white/30 bg-black/45 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white/95 uppercase backdrop-blur-sm">
              Quick Preview
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div
          className="border-border relative h-32 overflow-hidden rounded-lg border"
          style={{
            background:
              "linear-gradient(145deg, color-mix(in oklab, var(--resume-page-bg) 92%, transparent), color-mix(in oklab, var(--resume-page-bg) 72%, black 4%))",
          }}
        >
          {template.previewImage ? (
            <Image
              fill
              alt=""
              aria-hidden="true"
              src={template.previewImage}
              sizes="(min-width: 1280px) 320px, 100vw"
              className="absolute inset-0 h-full w-full object-cover object-top opacity-70"
            />
          ) : null}

          <div
            className="absolute inset-x-0 top-0 h-1"
            style={{ backgroundColor: template.accentColor }}
          />

          <div className="absolute inset-0 bg-linear-to-b from-black/0 via-black/0 to-black/40" />

          <div className="text-muted absolute top-3 left-3 text-[10px] font-semibold tracking-[0.16em] uppercase">
            {template.family}
          </div>

          <div className="absolute right-3 bottom-3 rounded-full border border-white/25 bg-black/45 px-2.5 py-1 text-[10px] font-medium text-white/90 backdrop-blur-sm">
            {template.layout}
          </div>

          <p className="absolute bottom-3 left-3 hidden text-[10px] font-medium text-white/85 xl:block">
            Hover card for larger preview
          </p>

          <span className="sr-only">Preview for {template.name}</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-foreground text-2xl font-semibold tracking-tight">
            {template.name}
          </h2>

          <p className="text-muted text-sm leading-relaxed">
            {template.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>{template.layout}</Badge>
          <Badge>{template.family}</Badge>
          {topTags.slice(0, 3).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>

      <Link
        className="text-accent hover:text-accent/80 w-fit text-sm font-medium transition-colors"
        href={`/templates/${template.id}`}
      >
        Open preview →
      </Link>
    </Card>
  );
};

export default TemplateCard;
