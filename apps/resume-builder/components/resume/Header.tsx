import Image from "next/image";

import type {
  ResumeLinks,
  ResumeBasics,
  ResumeLinkItem,
  ResumeLinkType,
} from "@/types/resume";

const LINK_TYPE_ICON: Record<ResumeLinkType, string> = {
  github: "/icons/socials/github.svg",
  linkedin: "/icons/socials/linkedIn.svg",
  dribbble: "/icons/socials/dribble.svg",
  twitter: "/icons/socials/twitter-x.svg",
  portfolio: "/icons/socials/globe.svg",
  behance: "/icons/socials/behance.svg",
  medium: "/icons/socials/medium.svg",
  youtube: "/icons/socials/youtube.svg",
  custom: "/icons/socials/globe.svg",
};

function SocialIcon({ type }: { type: ResumeLinkType }) {
  return (
    <Image
      alt={type}
      className="h-4 w-4"
      height={16}
      src={LINK_TYPE_ICON[type]}
      width={16}
    />
  );
}

function getLinkDisplayText(item: ResumeLinkItem) {
  if (item.label.trim()) {
    return item.label.trim();
  }

  try {
    const parsed = new URL(item.url);
    const firstSegment = parsed.pathname
      .replace(/^\/+|\/+$/g, "")
      .split("/")[0];

    if (firstSegment) {
      return firstSegment;
    }

    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return item.url.replace(/^https?:\/\//, "");
  }
}

function renderLinks(links: ResumeLinks) {
  if (!links.items.length) {
    return null;
  }

  if (links.displayMode === "icon") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {links.items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            title={item.label || item.type}
            className="hover:bg-accent/10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--resume-border)"
          >
            <SocialIcon type={item.type} />
          </a>
        ))}
      </div>
    );
  }

  if (links.displayMode === "url") {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        {links.items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="text-(--resume-muted) underline-offset-2 hover:text-(--resume-text) hover:underline"
          >
            {item.url.replace(/^https?:\/\//, "")}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
      {links.items.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-(--resume-muted) hover:text-(--resume-text)"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-(--resume-border)">
            <SocialIcon type={item.type} />
          </span>

          <span>{getLinkDisplayText(item)}</span>
        </a>
      ))}
    </div>
  );
}

export function ResumeHeader({
  basics,
  links,
  showLinks,
}: {
  basics: ResumeBasics;
  links: ResumeLinks;
  showLinks: boolean;
}) {
  const locationQuery = encodeURIComponent(basics.location);

  const topLinks = showLinks ? renderLinks(links) : null;
  const isIconMode = showLinks && links.displayMode === "icon";

  return (
    <header className="space-y-3 border-b border-(--resume-border) pb-6">
      <div className="space-y-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-3xl leading-(--resume-heading-leading) font-semibold tracking-tight text-(--resume-text)">
            {basics.fullName}
          </h1>

          <p className="text-base leading-(--resume-heading-leading) font-medium text-(--resume-muted)">
            {basics.role}
          </p>
        </div>

        <p className="text-base leading-(--resume-body-leading) text-(--resume-muted)">
          {basics.headline}
        </p>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-(--resume-muted)">
          {basics.linkLocation ? (
            <a
              className="underline-offset-2 hover:text-(--resume-text) hover:underline"
              href={`https://www.google.com/search?q=${locationQuery}`}
              rel="noreferrer"
              target="_blank"
            >
              {basics.location}
            </a>
          ) : (
            <span>{basics.location}</span>
          )}

          {basics.linkEmail ? (
            <a
              className="underline-offset-2 hover:text-(--resume-text) hover:underline"
              href={`mailto:${basics.email}`}
            >
              {basics.email}
            </a>
          ) : (
            <span>{basics.email}</span>
          )}

          {basics.linkPhone ? (
            <a
              className="underline-offset-2 hover:text-(--resume-text) hover:underline"
              href={`tel:${basics.phone.replace(/\s+/g, "")}`}
            >
              {basics.phone}
            </a>
          ) : (
            <span>{basics.phone}</span>
          )}

          {!isIconMode && topLinks ? topLinks : null}
        </div>

        {isIconMode && topLinks ? topLinks : null}
      </div>
    </header>
  );
}
