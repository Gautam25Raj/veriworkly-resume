import type { ResumeProjectItem } from "@/types/resume";

export function CompactProjectTitle({
  project,
}: {
  project: ResumeProjectItem;
}) {
  return (
    <div className="flex w-full flex-wrap items-baseline justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm leading-(--resume-heading-leading) font-semibold text-(--resume-text)">
          {project.name}
        </p>

        {project.role ? (
          <p className="text-sm leading-(--resume-body-leading) text-(--resume-muted)">
            | {project.role}
          </p>
        ) : null}
      </div>

      {project.link ? (
        <a
          className="text-sm leading-(--resume-body-leading) font-medium underline"
          href={project.link}
          rel="noreferrer"
          target="_blank"
        >
          <span aria-hidden="true">Visit link</span>
          <span className="sr-only">Visit project link: {project.link}</span>
        </a>
      ) : null}
    </div>
  );
}
