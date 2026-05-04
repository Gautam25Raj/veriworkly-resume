import type { ReactNode } from "react";

import { ResumeFontStylesheetPreload } from "@/components/resume/ResumeFontStylesheetPreload";

export default function EditorRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ResumeFontStylesheetPreload />
      <div className="min-h-dvh px-4 py-4 sm:px-6 lg:px-8">{children}</div>
    </>
  );
}
