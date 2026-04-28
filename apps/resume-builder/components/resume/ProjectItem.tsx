import type { ResumeProjectItem } from "@/types/resume";

export function ProjectItem({ item }: { item: ResumeProjectItem }) {
  return (
    <article className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base leading-(--resume-heading-leading) font-semibold text-(--resume-text)">
            {item.name}
          </h3>

          <p className="text-sm leading-(--resume-body-leading) text-(--resume-muted)">
            {item.role}
          </p>
        </div>

        <a
          className="text-accent text-sm leading-(--resume-body-leading) font-medium"
          href={item.link}
          target="_blank"
          rel="noreferrer"
        >
          <span aria-hidden="true">Visit link</span>
          <span className="sr-only">Visit project link: {item.link}</span>
        </a>
      </div>

      <p className="text-sm leading-(--resume-body-leading) text-(--resume-muted)">
        {item.summary}
      </p>

      <ul className="space-y-1 pl-5 text-sm leading-(--resume-body-leading) text-(--resume-muted)">
        {item.highlights.map((highlight) => (
          <li className="list-disc" key={highlight}>
            {highlight}
          </li>
        ))}
      </ul>
    </article>
  );
}
