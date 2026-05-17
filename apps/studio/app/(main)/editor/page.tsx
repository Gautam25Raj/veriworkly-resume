import { redirect } from "next/navigation";

import { getTemplateById, templateRegistry } from "@/templates";

interface EditorEntryPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditorEntryPage({ searchParams }: EditorEntryPageProps) {
  const params = await searchParams;

  const templateParam = typeof params.template === "string" ? params.template : undefined;
  const typeParam = typeof params.type === "string" ? params.type.toLowerCase() : "resume";

  if (typeParam !== "resume") {
    redirect("/");
  }

  const resolvedTemplate =
    (templateParam ? getTemplateById(templateParam) : null) ?? templateRegistry[0];

  redirect(`/editor/resume/new?template=${resolvedTemplate.id}`);
}
