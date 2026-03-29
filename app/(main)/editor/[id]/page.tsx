import { notFound } from "next/navigation";

import EditorLayout from "@/app/(main)/editor/components/EditorLayout";

function isValidResumeRouteId(id: string) {
  return id.length > 0 && /^[a-z0-9-]+$/i.test(id);
}

export default async function EditorByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isValidResumeRouteId(id)) {
    notFound();
  }

  return <EditorLayout resumeId={id} />;
}
