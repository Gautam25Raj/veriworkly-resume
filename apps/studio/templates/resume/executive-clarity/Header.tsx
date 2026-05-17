"use client";

/* eslint-disable @next/next/no-img-element */

import React from "react";

import type { ResumeData } from "@/types/resume";
import {
  cleanResumeText,
  getContactItems,
  getLinkDisplayText,
  normalizeLinkHref,
  sectionVisible,
} from "@/features/documents/rendering/resume-rendering";
import { SOCIAL_ICON_SRC_BY_TYPE } from "../../shared/social-icons";

interface HeaderProps {
  basics: ResumeData["basics"];
  links: ResumeData["links"];
  customization: ResumeData["customization"];
  sections: ResumeData["sections"];
}

export const Header: React.FC<HeaderProps> = ({ basics, links, customization, sections }) => {
  const accentColor = customization?.accentColor || "#000000";
  const mutedTextColor = customization?.mutedTextColor || "#6b7280";
  const resume = { sections } as ResumeData;
  const contactItems = basics ? getContactItems(basics) : [];

  const showBasics = sectionVisible(resume, "basics") && Boolean(basics);
  const showLinks = sectionVisible(resume, "links") && links?.items?.some((link) => link.url);

  if (!showBasics && !showLinks) return null;

  const renderedLinks = links?.items?.filter((link) => normalizeLinkHref(link.url)) ?? [];

  return (
    <header
      className="mb-6 border-b pb-6"
      style={{ borderColor: customization?.borderColor || "#e5e7eb" }}
    >
      {showBasics && basics && (
        <div>
          <div className="mb-2 flex flex-wrap items-baseline gap-3">
            <h1 className="text-3xl font-bold" style={{ color: accentColor }}>
              {cleanResumeText(basics.fullName || "Your Name")}
            </h1>
            {(basics.headline || basics.role) && (
              <p className="text-lg font-medium" style={{ color: mutedTextColor }}>
                {cleanResumeText(basics.headline || basics.role)}
              </p>
            )}
          </div>

          {contactItems.length > 0 && (
            <div
              className="flex flex-wrap gap-3"
              style={{ color: mutedTextColor, fontSize: "0.875rem" }}
            >
              {contactItems.map((item, index) => (
                <React.Fragment key={item.key}>
                  {index > 0 && <span aria-hidden="true">|</span>}
                  {item.href ? (
                    <a href={item.href} className="underline-offset-2 hover:underline">
                      {item.label}
                    </a>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {showLinks && renderedLinks.length > 0 && (
            <div
              className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1"
              style={{ color: mutedTextColor, fontSize: "0.875rem" }}
            >
              {renderedLinks.map((link, index) => (
                <React.Fragment key={link.id || index}>
                  {index > 0 && <span aria-hidden="true">|</span>}
                  <a
                    href={normalizeLinkHref(link.url)}
                    className="inline-flex items-center gap-1 align-middle leading-none underline-offset-2 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {links.displayMode !== "url" && (
                      <img
                        alt=""
                        aria-hidden="true"
                        className="size-3.5 shrink-0"
                        src={SOCIAL_ICON_SRC_BY_TYPE[link.type] || SOCIAL_ICON_SRC_BY_TYPE.custom}
                      />
                    )}
                    {links.displayMode !== "icon" && getLinkDisplayText(link, links.displayMode)}
                  </a>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}

      {!showBasics && showLinks && renderedLinks.length > 0 && (
        <div
          className="flex flex-wrap items-center gap-x-3 gap-y-1"
          style={{ color: mutedTextColor, fontSize: "0.875rem" }}
        >
          {renderedLinks.map((link, index) => (
            <React.Fragment key={link.id || index}>
              {index > 0 && <span aria-hidden="true">|</span>}
              <a
                href={normalizeLinkHref(link.url)}
                className="inline-flex items-center gap-1 align-middle leading-none underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {links.displayMode !== "url" && (
                  <img
                    alt=""
                    aria-hidden="true"
                    className="size-3.5 shrink-0"
                    src={SOCIAL_ICON_SRC_BY_TYPE[link.type] || SOCIAL_ICON_SRC_BY_TYPE.custom}
                  />
                )}
                {links.displayMode !== "icon" && getLinkDisplayText(link, links.displayMode)}
              </a>
            </React.Fragment>
          ))}
        </div>
      )}
    </header>
  );
};
