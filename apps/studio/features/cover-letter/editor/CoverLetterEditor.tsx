"use client";

import { useMemo } from "react";

import {
  loadDocumentById,
  saveDocument,
} from "@/features/documents/services/document-workspace-service";
import type { CoverLetterContent } from "@/features/cover-letter/types";

interface Props {
  documentId: string;
}

export default function CoverLetterEditor({ documentId }: Props) {
  const doc = useMemo(() => loadDocumentById("COVER_LETTER", documentId), [documentId]);

  if (!doc) return <p className="text-muted-foreground text-sm">Cover letter not found.</p>;

  const content = doc.content as CoverLetterContent;

  return (
    <div className="mx-auto max-w-3xl space-y-4 py-8">
      <h1 className="text-2xl font-semibold">{doc.title}</h1>
      <textarea
        className="min-h-96 w-full rounded-md border p-4"
        value={[content.greeting, content.opening, content.body, content.closing, content.signature]
          .filter(Boolean)
          .join("\n\n")}
        onChange={(event) => {
          const value = event.target.value;
          saveDocument({
            ...doc,
            updatedAt: new Date().toISOString(),
            content: {
              ...content,
              body: value,
            },
          });
        }}
      />
    </div>
  );
}
