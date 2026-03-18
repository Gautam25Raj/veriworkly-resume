import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/Card";

import { TemplateDetailHeader } from "../components/TemplateHeader";

import { defaultResume } from "@/features/resume/constants/default-resume";

import { getTemplateById, templateRegistry } from "@/templates";

interface Props {
  params: Promise<{ template: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { template } = await params;
  const data = getTemplateById(template);

  return {
    title: `${data.name} Template | VeriWorkly`,
    description: data.description,
  };
}

export function generateStaticParams() {
  return templateRegistry.map((t) => ({ template: t.id }));
}

export default async function TemplatePreviewPage({ params }: Props) {
  const { template } = await params;

  const templateDefinition = getTemplateById(template);

  if (templateDefinition.id !== template) {
    notFound();
  }

  const { Component: TemplateComponent } = templateDefinition;

  return (
    <div className="space-y-10 py-10">
      <TemplateDetailHeader template={templateDefinition} />

      <section aria-label="Template Preview">
        <Card className="overflow-hidden p-2 md:p-4">
          <div className="shadow-3xl mx-auto w-full transition-transform duration-500">
            <div className="bg-background rounded-xl p-4 md:p-6">
              <TemplateComponent
                resume={{
                  ...defaultResume,
                  templateId: templateDefinition.id,
                }}
              />
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
