import type { CoverLetterContent } from "@/features/cover-letter/types";

export function renderCoverLetterWeb(content: CoverLetterContent) {
  return [content.greeting, content.opening, content.body, content.closing, content.signature]
    .filter(Boolean)
    .join("\n\n");
}
