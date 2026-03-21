import type { ResumeEducationItem } from "@/types/resume";

import { formatDate } from "@/features/resume/utils/format-date";

export function EducationItem({ item }: { item: ResumeEducationItem }) {
  const isCurrent =
    item.current || item.endDate.trim().toLowerCase() === "present";

  return (
    <article className="space-y-1">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
        <div>
          <h3 className="text-base leading-(--resume-heading-leading) font-semibold text-(--resume-text)">
            {item.school}
          </h3>

          <p className="text-sm leading-(--resume-body-leading) text-(--resume-muted)">
            {item.degree} in {item.field}
          </p>
        </div>

        <p className="text-sm leading-(--resume-body-leading) text-(--resume-muted)">
          {formatDate(item.startDate)} -{" "}
          {isCurrent ? "Present" : formatDate(item.endDate)}
        </p>
      </div>

      <p className="text-sm leading-(--resume-body-leading) text-(--resume-muted)">
        {item.summary}
      </p>
    </article>
  );
}
