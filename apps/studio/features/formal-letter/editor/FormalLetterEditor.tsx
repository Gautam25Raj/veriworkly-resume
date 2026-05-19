"use client";

import { useMemo } from "react";

import {
  loadDocumentById,
  saveDocument,
} from "@/features/documents/services/document-workspace-service";
import type { FormalLetterContent } from "@/features/formal-letter/types";

interface Props {
  documentId: string;
}

export default function FormalLetterEditor({ documentId }: Props) {
  const doc = useMemo(() => loadDocumentById("FORMAL_LETTER", documentId), [documentId]);

  if (!doc) return <p className="text-muted-foreground text-sm">Formal letter not found.</p>;

  const content = doc.content as FormalLetterContent;

  return (
    <div className="mx-auto max-w-3xl space-y-4 py-8">
      <h1 className="text-2xl font-semibold">{doc.title}</h1>
      <textarea
        className="min-h-96 w-full rounded-md border p-4"
        value={content.body}
        onChange={(event) =>
          saveDocument({
            ...doc,
            updatedAt: new Date().toISOString(),
            content: {
              ...content,
              body: event.target.value,
            },
          })
        }
      />
    </div>
  );
}
