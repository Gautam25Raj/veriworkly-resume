import type { ReactNode } from "react";

export default function EditorRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="min-h-dvh px-4 py-4 sm:px-6 lg:px-8">{children}</div>;
}
