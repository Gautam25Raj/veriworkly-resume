import { notFound } from "next/navigation";

import { PreviewClient } from "./PreviewClient";

function isValidResumeRouteId(id: string) {
  return id.length > 0 && /^[a-z0-9-]+$/i.test(id);
}

export default async function EditorPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isValidResumeRouteId(id)) {
    notFound();
  }

  return <PreviewClient resumeId={id} />;
}
