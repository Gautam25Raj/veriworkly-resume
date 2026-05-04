import type { ResumeExperienceItem } from "@/types/resume";

import { formatDate } from "@/features/resume/utils/format-date";

export function ExperienceItem({ item }: { item: ResumeExperienceItem }) {
  return (
    <article className="space-y-2">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
        <div>
          <h3 className="text-base leading-(--resume-heading-leading) font-semibold text-(--resume-text)">
            {item.role}
          </h3>

          <p className="text-sm leading-(--resume-body-leading) text-(--resume-muted)">
            {item.company} • {item.location}
          </p>
        </div>

        <p className="text-sm leading-(--resume-body-leading) text-(--resume-muted)">
          {formatDate(item.startDate)} -{" "}
          {item.current ? "Present" : formatDate(item.endDate)}
        </p>
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
