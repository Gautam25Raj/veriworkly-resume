import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { templateSummaries } from "@/config/templates";

import TemplateCard from "./components/TemplateCard";

export const metadata: Metadata = {
  title: `Templates | ${siteConfig.name}`,
  description: "Browse our collection of professional resume templates.",
};

const TemplatesPage = () => {
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
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {templateSummaries.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
};

export default TemplatesPage;
