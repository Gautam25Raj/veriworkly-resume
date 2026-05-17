import type { ReactNode } from "react";

import { FontStylesheetPreload } from "@/features/documents/components/FontStylesheetPreload";

export default function EditorRouteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <FontStylesheetPreload />
      <div className="bg-background min-h-dvh px-4 py-4 sm:px-6 lg:px-8">{children}</div>
    </>
  );
}
