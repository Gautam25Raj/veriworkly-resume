import type { TemplateRenderProps } from "@/types/template";

export function LinkRow({ resume }: { resume: TemplateRenderProps["resume"] }) {
  const items = resume.links.items.filter((item) => Boolean(item.url));

  if (!items.length) {
    return null;
  }

  return (
    <p className="text-sm leading-(--resume-body-leading) text-(--resume-muted)">
      {items.map((item, index) => (
        <span key={item.id}>
          <a
            className="underline"
            href={item.url}
            rel="noreferrer"
            target="_blank"
          >
            {item.label}
          </a>

          {index < items.length - 1 ? " | " : ""}
        </span>
      ))}
    </p>
  );
}
