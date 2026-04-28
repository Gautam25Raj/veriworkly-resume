import type { ResumeData } from "@/types/resume";
import { structuredProfessionalStyles } from "../styles";

export function HeaderSection({
  resume,
  showLinks,
}: {
  resume: ResumeData;
  showLinks: boolean;
}) {
  const visibleLinks = resume.links.items.filter((item) => Boolean(item.url));

  return (
    <header className={structuredProfessionalStyles.header}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h1 className="text-2xl leading-(--resume-heading-leading) font-bold text-(--resume-text)">
          {resume.basics.fullName}
        </h1>
        <p className="text-sm leading-(--resume-heading-leading) font-semibold text-(--resume-muted)">
          {resume.basics.role}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm leading-(--resume-body-leading) text-(--resume-muted)">
        <span>{resume.basics.location}</span>
        <span>|</span>
        <span>{resume.basics.phone}</span>
        <span>|</span>
        <span>{resume.basics.email}</span>
      </div>

      {showLinks && visibleLinks.length ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm leading-(--resume-body-leading) text-(--resume-muted)">
          {visibleLinks.map((item, index) => (
            <span key={item.id}>
              {item.label || item.type}: {item.url.replace(/^https?:\/\//, "")}
              {index < visibleLinks.length - 1 ? " | " : ""}
            </span>
          ))}
        </div>
      ) : null}
    </header>
  );
}
