import type { FormalLetterContent } from "@/features/formal-letter/types";

export function renderFormalLetterWeb(content: FormalLetterContent) {
  return [content.greeting, content.body, content.closing, content.signature]
    .filter(Boolean)
    .join("\n\n");
}
