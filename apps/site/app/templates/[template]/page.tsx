import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { Card, Button } from "@veriworkly/ui";

import { TemplateDetailHeader } from "../components/TemplateHeader";
import { getTemplateById, templateSummaries } from "@/config/templates";
import { siteConfig } from "@/config/site";

interface Props {
  params: Promise<{ template: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { template } = await params;
  const data = getTemplateById(template);

  if (!data) return { title: "Template Not Found" };

  return {
    title: `${data.name} Template | VeriWorkly`,
    description: data.description,
  };
}

export function generateStaticParams() {
  return templateSummaries.map((t) => ({ template: t.id }));
}

export default async function TemplatePreviewPage({ params }: Props) {
  const { template } = await params;

  const templateDefinition = getTemplateById(template);

  if (!templateDefinition || templateDefinition.id !== template) {
    notFound();
  }

  return (
    <div className="space-y-10 py-10">
      <TemplateDetailHeader template={templateDefinition} />

      <section aria-label="Template Preview" className="space-y-8">
        <Card className="overflow-hidden p-0 md:p-0 border-none bg-transparent shadow-none">
          <div className="relative aspect-3/4 w-full max-w-4xl mx-auto border border-border rounded-xl overflow-hidden shadow-2xl bg-card">
            {templateDefinition.previewImage ? (
              <Image
                src={templateDefinition.previewImage}
                alt={`${templateDefinition.name} preview`}
                fill
                className="object-cover object-top"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted">
                Preview not available
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-12">
              <Button asChild size="lg" variant="primary">
                <Link href={`${siteConfig.links.app}/editor?template=${templateDefinition.id}`}>
                  Use this template
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex justify-center pt-4">
          <Button
            asChild
            size="lg"
            variant="primary"
            className="h-14 px-10 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Link href={`${siteConfig.links.app}/editor?template=${templateDefinition.id}`}>
              Start Building with {templateDefinition.name}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
