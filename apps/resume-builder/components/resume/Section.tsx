import type { ReactNode } from "react";

export function ResumeSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-(--resume-border)" />

        <h2 className="text-xs leading-(--resume-heading-leading) font-semibold tracking-[0.24em] text-(--resume-section-heading) uppercase">
          {title}
        </h2>
      </div>

      <div className="space-y-4 leading-(--resume-body-leading)">
        {children}
      </div>
    </section>
  );
}
