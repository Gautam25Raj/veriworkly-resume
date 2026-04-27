import type { ReactNode } from "react";

import { BookOpen, Terminal } from "lucide-react";
import { DocsLayout as FumadocsDocsLayout } from "fumadocs-ui/layouts/notebook";

import { apiSource } from "@/lib/source";

import { baseOptions } from "@/app/layout.config";

const APIReferenceLayout = ({ children }: { children: ReactNode }) => {
  const { nav, ...base } = baseOptions;

  return (
    <FumadocsDocsLayout
      tree={apiSource.getPageTree()}
      {...base}
      nav={{ ...nav }}
      tabs={[
        {
          title: "VeriWorkly Docs",
          url: "/docs",
          icon: <BookOpen />,
          description: "General documentation",
        },
        {
          title: "API Reference",
          url: "/api-reference",
          icon: <Terminal />,
          description: "OpenAPI specifications",
        },
      ]}
    >
      {children}
    </FumadocsDocsLayout>
  );
};

export default APIReferenceLayout;
