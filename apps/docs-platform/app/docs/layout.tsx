import { BookOpen, Terminal } from "lucide-react";
import { DocsLayout as FumadocsDocsLayout } from "fumadocs-ui/layouts/notebook";

import { source } from "@/lib/source";

import { baseOptions } from "@/app/layout.config";

const DocsLayout = ({ children }: { children: React.ReactNode }) => {
  const { nav, ...base } = baseOptions;

  return (
    <FumadocsDocsLayout
      tree={source.getPageTree()}
      {...base}
      nav={{ ...nav }}
      tabs={[
        {
          title: "VeriWorkly Docs",
          url: "/docs",
          icon: <BookOpen className="size-4" />,
          description: "General documentation",
        },
        {
          title: "API Reference",
          url: "/api-reference",
          icon: <Terminal className="size-4" />,
          description: "OpenAPI specifications",
        },
      ]}
    >
      {children}
    </FumadocsDocsLayout>
  );
};

export default DocsLayout;
