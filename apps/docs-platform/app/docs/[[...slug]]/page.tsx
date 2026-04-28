import type { Metadata } from "next";

import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/notebook/page";
import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";

import { source, getPageImage } from "@/lib/source";

import { getMDXComponents } from "@/components/mdx";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const pageData = page.data as unknown as {
    title: string;
    description: string;
    toc: any[];
    full?: boolean;
    body: any;
  };

  const MDX = pageData.body;

  return (
    <DocsPage
      tableOfContent={{
        style: "clerk",
      }}
      toc={pageData.toc}
      full={pageData.full}
    >
      <DocsTitle>{pageData.title}</DocsTitle>
      <DocsDescription>{pageData.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  const page = source.getPage(params.slug);

  if (!page) notFound();

  const pageData = page.data as unknown as {
    title: string;
    description: string;
  };

  return {
    title: pageData.title,
    description: pageData.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
