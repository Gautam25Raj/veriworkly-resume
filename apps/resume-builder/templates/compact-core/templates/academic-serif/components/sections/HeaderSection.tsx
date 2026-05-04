import type { ResumeData } from "@/types/resume";

export function HeaderSection({ resume }: { resume: ResumeData }) {
  const links = resume.links.items.filter((item) => Boolean(item.url));

  const leftLinks = links.slice(0, 2);
  const rightLinks = links.slice(2);

  return (
    <header className="mb-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[26pt] leading-none font-bold text-(--resume-text)">
            {resume.basics.fullName}
          </h1>

          <div className="mt-2 space-y-0.5 text-[10pt] leading-(--resume-body-leading) text-(--resume-muted)">
            {leftLinks.map((item) => (
              <p key={item.id}>
                {item.label || item.type}:{" "}
                <a
                  href={item.url}
                  rel="noreferrer"
                  target="_blank"
                  className="underline"
                >
                  {item.url.replace(/^https?:\/\//, "")}
                </a>
              </p>
            ))}

            {!leftLinks.length && resume.basics.headline ? (
              <p>{resume.basics.headline}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-0.5 text-right text-[10pt] leading-(--resume-body-leading) text-(--resume-muted)">
          <p>
            Email:{" "}
            <a href={`mailto:${resume.basics.email}`} className="underline">
              {resume.basics.email}
            </a>
          </p>

          <p>Mobile: {resume.basics.phone}</p>

          {rightLinks.map((item) => (
            <p key={item.id}>
              {item.label || item.type}:{" "}
              <a
                href={item.url}
                rel="noreferrer"
                target="_blank"
                className="underline"
              >
                {item.url.replace(/^https?:\/\//, "")}
              </a>
            </p>
          ))}
        </div>
      </div>
    </header>
  );
}
