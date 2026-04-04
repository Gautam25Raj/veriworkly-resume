"use client";

import type { ResumeData } from "@/types/resume";

import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import html2canvas from "html2canvas";

import {
  saveResumeToLocalStorage,
  loadResumeFromLocalStorage,
  clearResumeFromLocalStorage,
  listResumesFromLocalStorage,
  loadResumeCollectionFromLocalStorage,
  saveResumeCollectionToLocalStorage,
  deleteResumeFromLocalStorage,
  loadResumeByIdFromLocalStorage,
  setActiveResumeIdInLocalStorage,
} from "@/features/resume/services/local-storage";
import { loadWorkspaceSettingsFromLocalStorage } from "@/features/resume/services/workspace-settings";
import { deriveResumeFromMasterProfile } from "@/features/resume/services/master-profile";
import { defaultResume } from "@/features/resume/constants/default-resume";
import { normalizeResumeData } from "@/features/resume/utils/normalize-data";
import type { ResumeSyncState, ResumeSyncStatus } from "@/types/resume";

export interface ResumeListItem {
  id: string;
  title: string;
  templateId: string;
  role: string;
  updatedAt: string;
  sync: ResumeSyncState;
}

export type ResumeImageFormat = "png" | "jpg";

function getResumeTitle(resume: ResumeData) {
  return resume.basics.fullName.trim() || "Untitled Resume";
}

function createId() {
  return `resume-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadResume() {
  return normalizeResumeData(loadResumeFromLocalStorage() ?? defaultResume);
}

export function saveResume(resume: ResumeData) {
  saveResumeToLocalStorage({
    ...resume,
    updatedAt: new Date().toISOString(),
  });
}

export function resetResume() {
  clearResumeFromLocalStorage();
  return defaultResume;
}

export function listSavedResumes(): ResumeListItem[] {
  const resumes = listResumesFromLocalStorage();

  if (!resumes) return [];

  return resumes.map((resume) => ({
    id: resume.id,
    title: getResumeTitle(resume),
    templateId: resume.templateId,
    role: resume.basics.role,
    updatedAt: resume.updatedAt,
    sync: resume.sync,
  }));
}

export function deleteResumeById(resumeId: string) {
  return deleteResumeFromLocalStorage(resumeId);
}

export function loadResumeById(resumeId: string) {
  const resume = loadResumeByIdFromLocalStorage(resumeId);

  if (!resume) {
    return null;
  }

  setActiveResumeIdInLocalStorage(resume.id);
  return normalizeResumeData(resume);
}

export function createResume() {
  const workspaceSettings = loadWorkspaceSettingsFromLocalStorage();
  const nextResume = deriveResumeFromMasterProfile(createId());

  nextResume.sync = {
    ...defaultResume.sync,
    enabled: workspaceSettings.autoSyncEnabled,
    status: workspaceSettings.autoSyncEnabled ? "pending" : "local-only",
  };

  saveResume(nextResume);

  return nextResume;
}

export function deleteResume(resumeId: string) {
  const nextId = deleteResumeFromLocalStorage(resumeId);

  if (!nextId) {
    return null;
  }

  return loadResumeById(nextId);
}

function getVisibleSectionMap(resume: ResumeData) {
  return new Map(
    resume.sections.map((section) => [section.id, section.visible]),
  );
}

function isSectionVisible(
  visibleSections: Map<string, boolean>,
  sectionId: string,
) {
  return visibleSections.get(sectionId) ?? true;
}

function safeText(value: string | undefined | null) {
  return value?.trim() ?? "";
}

function formatDateRange(startDate: string, endDate: string, current: boolean) {
  const start = safeText(startDate) || "Start";

  if (current) {
    return `${start} - Present`;
  }

  const end = safeText(endDate) || "End";
  return `${start} - ${end}`;
}

function sanitizeFileName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getResumeFileBaseName(resume: ResumeData) {
  return sanitizeFileName(resume.basics.fullName) || "resume";
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

function isCanvasBlank(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return true;
  }

  const { width, height } = canvas;

  if (width === 0 || height === 0) {
    return true;
  }

  const sampleCount = 80;
  let blankSamples = 0;

  for (let index = 0; index < sampleCount; index += 1) {
    const x = Math.floor((index / sampleCount) * (width - 1));
    const y = Math.floor(
      (((index * 37) % sampleCount) / sampleCount) * (height - 1),
    );
    const pixel = context.getImageData(x, y, 1, 1).data;
    const alpha = pixel[3];
    const red = pixel[0];
    const green = pixel[1];
    const blue = pixel[2];

    const isTransparent = alpha === 0;
    const isNearWhite = red > 248 && green > 248 && blue > 248;

    if (isTransparent || isNearWhite) {
      blankSamples += 1;
    }
  }

  return blankSamples / sampleCount > 0.98;
}

async function captureResumeCanvas(node: HTMLElement, captureWidth: number) {
  const commonOptions = {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,
    width: captureWidth,
    windowWidth: Math.max(captureWidth, 1280),
  } as const;

  const primaryCanvas = await html2canvas(node, {
    ...commonOptions,
    foreignObjectRendering: true,
  });

  if (!isCanvasBlank(primaryCanvas)) {
    return primaryCanvas;
  }

  return html2canvas(node, {
    ...commonOptions,
    foreignObjectRendering: false,
  });
}

function getComputedStyleText(style: CSSStyleDeclaration) {
  const declarations: string[] = [];

  for (let index = 0; index < style.length; index += 1) {
    const propertyName = style.item(index);
    const propertyValue = style.getPropertyValue(propertyName);

    if (!propertyValue) {
      continue;
    }

    const priority = style.getPropertyPriority(propertyName);
    declarations.push(
      `${propertyName}: ${propertyValue}${priority ? ` !${priority}` : ""};`,
    );
  }

  return declarations.join(" ");
}

function inlineComputedStyles(source: Element, clone: Element) {
  const sourceStyle = window.getComputedStyle(source);
  const clonedElement = clone as HTMLElement;

  clonedElement.style.cssText = getComputedStyleText(sourceStyle);

  const sourceChildren = Array.from(source.children);
  const cloneChildren = Array.from(clone.children);

  for (let index = 0; index < sourceChildren.length; index += 1) {
    const sourceChild = sourceChildren[index];
    const cloneChild = cloneChildren[index];

    if (!sourceChild || !cloneChild) {
      continue;
    }

    inlineComputedStyles(sourceChild, cloneChild);
  }
}

function buildRenderedHtmlDocument(targetId: string, resume: ResumeData) {
  if (typeof window === "undefined") {
    return null;
  }

  const printableNode = document.getElementById(targetId);

  if (!printableNode) {
    return null;
  }

  const sourceNode =
    (printableNode.firstElementChild as HTMLElement | null) ?? printableNode;
  const clonedResume = sourceNode.cloneNode(true) as HTMLElement;
  const sourceRect = sourceNode.getBoundingClientRect();

  inlineComputedStyles(sourceNode, clonedResume);

  clonedResume.style.margin = "0 auto";
  clonedResume.style.width = `${Math.ceil(sourceRect.width)}px`;
  clonedResume.style.maxWidth = "100%";
  clonedResume.style.boxSizing = "border-box";

  const bodyStyle = window.getComputedStyle(document.body);

  const title = `${escapeHtml(safeText(resume.basics.fullName) || "Resume")} - Resume`;

  return `<!doctype html>
<html lang="en" dir="${escapeHtml(document.documentElement.dir || "ltr")}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    :root {
      color-scheme: light;
    }
    body {
      margin: 0;
      padding: 24px 16px;
      background: ${bodyStyle.backgroundColor || "#f6f7fb"};
      display: flex;
      justify-content: center;
    }
  </style>
</head>
<body>
  ${clonedResume.outerHTML}
</body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toMarkdownSection(title: string, body: string[]) {
  if (body.length === 0) {
    return "";
  }

  return [`## ${title}`, ...body, ""].join("\n");
}

function buildMarkdown(resume: ResumeData) {
  const visibleSections = getVisibleSectionMap(resume);
  const parts: string[] = [];

  const name = safeText(resume.basics.fullName) || "Your Name";
  const role = safeText(resume.basics.role);

  parts.push(`# ${name}`);

  if (role) {
    parts.push(`_${role}_`);
  }

  const contact = [
    safeText(resume.basics.email),
    safeText(resume.basics.phone),
    safeText(resume.basics.location),
  ].filter(Boolean);

  if (contact.length > 0) {
    parts.push(contact.join(" | "));
  }

  parts.push("");

  if (
    isSectionVisible(visibleSections, "summary") &&
    safeText(resume.summary)
  ) {
    parts.push(toMarkdownSection("Summary", [safeText(resume.summary)]));
  }

  if (
    isSectionVisible(visibleSections, "experience") &&
    resume.experience.length > 0
  ) {
    const lines = resume.experience.flatMap((item) => {
      const heading = `### ${safeText(item.role) || "Role"} - ${safeText(item.company) || "Company"}`;
      const meta = [
        formatDateRange(item.startDate, item.endDate, item.current),
        safeText(item.location),
      ]
        .filter(Boolean)
        .join(" | ");
      const bullets = item.highlights
        .map((highlight) => safeText(highlight))
        .filter(Boolean)
        .map((highlight) => `- ${highlight}`);

      const summary = safeText(item.summary);

      return [
        heading,
        meta,
        ...(summary ? [summary] : []),
        ...bullets,
        "",
      ].filter(Boolean);
    });

    parts.push(toMarkdownSection("Experience", lines));
  }

  if (
    isSectionVisible(visibleSections, "education") &&
    resume.education.length > 0
  ) {
    const lines = resume.education.flatMap((item) => {
      const title = `${safeText(item.degree) || "Degree"}${safeText(item.field) ? `, ${safeText(item.field)}` : ""}`;
      const school = safeText(item.school) || "School";
      const meta = formatDateRange(item.startDate, item.endDate, item.current);
      const summary = safeText(item.summary);

      return [
        `- **${title}** - ${school} (${meta})`,
        ...(summary ? [`  - ${summary}`] : []),
      ];
    });

    parts.push(toMarkdownSection("Education", lines));
  }

  if (
    isSectionVisible(visibleSections, "projects") &&
    resume.projects.length > 0
  ) {
    const lines = resume.projects.flatMap((item) => {
      const title = safeText(item.name) || "Project";
      const roleLabel = safeText(item.role);
      const link = safeText(item.link);
      const summary = safeText(item.summary);
      const highlights = item.highlights
        .map((highlight) => safeText(highlight))
        .filter(Boolean)
        .map((highlight) => `- ${highlight}`);

      return [
        `### ${title}${roleLabel ? ` (${roleLabel})` : ""}`,
        ...(link ? [`${link}`] : []),
        ...(summary ? [summary] : []),
        ...highlights,
        "",
      ];
    });

    parts.push(toMarkdownSection("Projects", lines));
  }

  if (isSectionVisible(visibleSections, "skills") && resume.skills.length > 0) {
    const lines = resume.skills
      .map((group) => {
        const nameLabel = safeText(group.name) || "Skills";
        const keywords = group.keywords
          .map((keyword) => safeText(keyword))
          .filter(Boolean)
          .join(", ");

        return keywords ? `- **${nameLabel}:** ${keywords}` : "";
      })
      .filter(Boolean);

    parts.push(toMarkdownSection("Skills", lines));
  }

  if (
    isSectionVisible(visibleSections, "links") &&
    resume.links.items.length > 0
  ) {
    const lines = resume.links.items
      .map((link) => {
        const label = safeText(link.label) || safeText(link.type) || "Link";
        const url = safeText(link.url);

        if (!url) {
          return "";
        }

        return `- [${label}](${url})`;
      })
      .filter(Boolean);

    parts.push(toMarkdownSection("Links", lines));
  }

  if (
    isSectionVisible(visibleSections, "custom") &&
    resume.customSections.length > 0
  ) {
    resume.customSections.forEach((section) => {
      const lines = section.items.flatMap((item) => {
        const title = safeText(item.name) || "Item";
        const issuer = safeText(item.issuer);
        const date = safeText(item.date);
        const description = safeText(item.description);
        const details = item.details
          .map((detail) => safeText(detail))
          .filter(Boolean)
          .map((detail) => `- ${detail}`);

        const meta = [issuer, date].filter(Boolean).join(" | ");

        return [
          `### ${title}`,
          ...(meta ? [meta] : []),
          ...(description ? [description] : []),
          ...details,
          "",
        ];
      });

      parts.push(
        toMarkdownSection(safeText(section.title) || "Section", lines),
      );
    });
  }

  return parts.filter(Boolean).join("\n").trim();
}

function buildText(resume: ResumeData) {
  const markdown = buildMarkdown(resume);

  return markdown
    .replaceAll(/^#{1,6}\s?/gm, "")
    .replaceAll(/\*\*(.*?)\*\*/g, "$1")
    .replaceAll(/\[(.*?)\]\((.*?)\)/g, "$1: $2")
    .replaceAll(/_/g, "")
    .trim();
}

function buildHtml(resume: ResumeData) {
  const visibleSections = getVisibleSectionMap(resume);

  const name = escapeHtml(safeText(resume.basics.fullName) || "Your Name");
  const role = escapeHtml(safeText(resume.basics.role));
  const summary = escapeHtml(safeText(resume.summary));

  const contact = [
    safeText(resume.basics.email),
    safeText(resume.basics.phone),
    safeText(resume.basics.location),
  ]
    .filter(Boolean)
    .map((value) => `<span>${escapeHtml(value)}</span>`)
    .join('<span class="dot">•</span>');

  const experience = isSectionVisible(visibleSections, "experience")
    ? resume.experience
        .map((item) => {
          const highlights = item.highlights
            .map((highlight) => safeText(highlight))
            .filter(Boolean)
            .map((highlight) => `<li>${escapeHtml(highlight)}</li>`)
            .join("");

          return `
          <article>
            <h3>${escapeHtml(safeText(item.role) || "Role")} · ${escapeHtml(
              safeText(item.company) || "Company",
            )}</h3>
            <p class=\"meta\">${escapeHtml(
              formatDateRange(item.startDate, item.endDate, item.current),
            )}${safeText(item.location) ? ` · ${escapeHtml(safeText(item.location))}` : ""}</p>
            ${safeText(item.summary) ? `<p>${escapeHtml(safeText(item.summary))}</p>` : ""}
            ${highlights ? `<ul>${highlights}</ul>` : ""}
          </article>`;
        })
        .join("")
    : "";

  const education = isSectionVisible(visibleSections, "education")
    ? resume.education
        .map((item) => {
          const degree = `${safeText(item.degree) || "Degree"}${safeText(item.field) ? `, ${safeText(item.field)}` : ""}`;

          return `
          <article>
            <h3>${escapeHtml(degree)}</h3>
            <p class=\"meta\">${escapeHtml(
              safeText(item.school) || "School",
            )} · ${escapeHtml(formatDateRange(item.startDate, item.endDate, item.current))}</p>
            ${safeText(item.summary) ? `<p>${escapeHtml(safeText(item.summary))}</p>` : ""}
          </article>`;
        })
        .join("")
    : "";

  const projects = isSectionVisible(visibleSections, "projects")
    ? resume.projects
        .map((item) => {
          const highlights = item.highlights
            .map((highlight) => safeText(highlight))
            .filter(Boolean)
            .map((highlight) => `<li>${escapeHtml(highlight)}</li>`)
            .join("");

          return `
          <article>
            <h3>${escapeHtml(safeText(item.name) || "Project")}${safeText(item.role) ? ` <span class=\"sub\">(${escapeHtml(safeText(item.role))})</span>` : ""}</h3>
            ${safeText(item.link) ? `<p><a href=\"${escapeHtml(safeText(item.link))}\">${escapeHtml(safeText(item.link))}</a></p>` : ""}
            ${safeText(item.summary) ? `<p>${escapeHtml(safeText(item.summary))}</p>` : ""}
            ${highlights ? `<ul>${highlights}</ul>` : ""}
          </article>`;
        })
        .join("")
    : "";

  const skills = isSectionVisible(visibleSections, "skills")
    ? resume.skills
        .map((group) => {
          const keywords = group.keywords
            .map((keyword) => safeText(keyword))
            .filter(Boolean)
            .join(", ");

          if (!keywords) {
            return "";
          }

          return `<li><strong>${escapeHtml(safeText(group.name) || "Skills")}</strong>: ${escapeHtml(keywords)}</li>`;
        })
        .filter(Boolean)
        .join("")
    : "";

  const links = isSectionVisible(visibleSections, "links")
    ? resume.links.items
        .map((link) => {
          const label = escapeHtml(
            safeText(link.label) || safeText(link.type) || "Link",
          );
          const url = safeText(link.url);

          if (!url) {
            return "";
          }

          const safeUrl = escapeHtml(url);
          return `<li><a href=\"${safeUrl}\">${label}</a></li>`;
        })
        .filter(Boolean)
        .join("")
    : "";

  const customSections = isSectionVisible(visibleSections, "custom")
    ? resume.customSections
        .map((section) => {
          const items = section.items
            .map((item) => {
              const details = item.details
                .map((detail) => safeText(detail))
                .filter(Boolean)
                .map((detail) => `<li>${escapeHtml(detail)}</li>`)
                .join("");

              return `
              <article>
                <h3>${escapeHtml(safeText(item.name) || "Item")}</h3>
                <p class=\"meta\">${escapeHtml(
                  [safeText(item.issuer), safeText(item.date)]
                    .filter(Boolean)
                    .join(" · "),
                )}</p>
                ${safeText(item.description) ? `<p>${escapeHtml(safeText(item.description))}</p>` : ""}
                ${details ? `<ul>${details}</ul>` : ""}
              </article>`;
            })
            .join("");

          if (!items) {
            return "";
          }

          return `<section><h2>${escapeHtml(safeText(section.title) || "Section")}</h2>${items}</section>`;
        })
        .filter(Boolean)
        .join("")
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${name} - Resume</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; padding: 40px 20px; font-family: "Segoe UI", Arial, sans-serif; background: #f6f7fb; color: #111827; }
    main { max-width: 880px; margin: 0 auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 32px; }
    h1 { margin: 0 0 8px; font-size: 2rem; line-height: 1.1; }
    h2 { margin: 32px 0 12px; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.08em; color: #374151; }
    h3 { margin: 0 0 6px; font-size: 1rem; }
    p { margin: 0 0 10px; line-height: 1.55; }
    article { margin-bottom: 18px; }
    ul { margin: 0 0 10px 20px; padding: 0; }
    .meta { color: #4b5563; font-size: 0.95rem; }
    .lead { font-size: 1.05rem; color: #374151; }
    .contact { color: #4b5563; display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
    .dot { opacity: 0.5; }
    .sub { color: #4b5563; font-weight: 500; }
    a { color: #0f4dbf; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>${name}</h1>
      ${role ? `<p class="lead">${role}</p>` : ""}
      ${contact ? `<div class="contact">${contact}</div>` : ""}
    </header>
    ${isSectionVisible(visibleSections, "summary") && summary ? `<section><h2>Summary</h2><p>${summary}</p></section>` : ""}
    ${experience ? `<section><h2>Experience</h2>${experience}</section>` : ""}
    ${education ? `<section><h2>Education</h2>${education}</section>` : ""}
    ${projects ? `<section><h2>Projects</h2>${projects}</section>` : ""}
    ${skills ? `<section><h2>Skills</h2><ul>${skills}</ul></section>` : ""}
    ${links ? `<section><h2>Links</h2><ul>${links}</ul></section>` : ""}
    ${customSections}
  </main>
</body>
</html>`;
}

function createDocxParagraph(text: string) {
  return new Paragraph({
    children: [new TextRun(text)],
  });
}

async function buildDocx(resume: ResumeData) {
  const visibleSections = getVisibleSectionMap(resume);
  const children: Paragraph[] = [];

  const fullName = safeText(resume.basics.fullName) || "Your Name";
  const role = safeText(resume.basics.role);

  children.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun(fullName)],
    }),
  );

  if (role) {
    children.push(createDocxParagraph(role));
  }

  const contactLine = [
    safeText(resume.basics.email),
    safeText(resume.basics.phone),
    safeText(resume.basics.location),
  ]
    .filter(Boolean)
    .join(" | ");

  if (contactLine) {
    children.push(createDocxParagraph(contactLine));
  }

  if (
    isSectionVisible(visibleSections, "summary") &&
    safeText(resume.summary)
  ) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Summary")],
      }),
      createDocxParagraph(safeText(resume.summary)),
    );
  }

  if (
    isSectionVisible(visibleSections, "experience") &&
    resume.experience.length > 0
  ) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Experience")],
      }),
    );

    resume.experience.forEach((item) => {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun(
              `${safeText(item.role) || "Role"} - ${safeText(item.company) || "Company"}`,
            ),
          ],
        }),
        createDocxParagraph(
          [
            formatDateRange(item.startDate, item.endDate, item.current),
            safeText(item.location),
          ]
            .filter(Boolean)
            .join(" | "),
        ),
      );

      if (safeText(item.summary)) {
        children.push(createDocxParagraph(safeText(item.summary)));
      }

      item.highlights
        .map((highlight) => safeText(highlight))
        .filter(Boolean)
        .forEach((highlight) => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              children: [new TextRun(highlight)],
            }),
          );
        });
    });
  }

  if (
    isSectionVisible(visibleSections, "education") &&
    resume.education.length > 0
  ) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Education")],
      }),
    );

    resume.education.forEach((item) => {
      const degree = `${safeText(item.degree) || "Degree"}${safeText(item.field) ? `, ${safeText(item.field)}` : ""}`;

      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun(degree)],
        }),
        createDocxParagraph(
          `${safeText(item.school) || "School"} | ${formatDateRange(item.startDate, item.endDate, item.current)}`,
        ),
      );

      if (safeText(item.summary)) {
        children.push(createDocxParagraph(safeText(item.summary)));
      }
    });
  }

  if (
    isSectionVisible(visibleSections, "projects") &&
    resume.projects.length > 0
  ) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Projects")],
      }),
    );

    resume.projects.forEach((item) => {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun(
              `${safeText(item.name) || "Project"}${safeText(item.role) ? ` (${safeText(item.role)})` : ""}`,
            ),
          ],
        }),
      );

      if (safeText(item.link)) {
        children.push(createDocxParagraph(safeText(item.link)));
      }

      if (safeText(item.summary)) {
        children.push(createDocxParagraph(safeText(item.summary)));
      }

      item.highlights
        .map((highlight) => safeText(highlight))
        .filter(Boolean)
        .forEach((highlight) => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              children: [new TextRun(highlight)],
            }),
          );
        });
    });
  }

  if (isSectionVisible(visibleSections, "skills") && resume.skills.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Skills")],
      }),
    );

    resume.skills.forEach((group) => {
      const keywords = group.keywords
        .map((keyword) => safeText(keyword))
        .filter(Boolean)
        .join(", ");

      if (!keywords) {
        return;
      }

      children.push(
        createDocxParagraph(`${safeText(group.name) || "Skills"}: ${keywords}`),
      );
    });
  }

  if (
    isSectionVisible(visibleSections, "links") &&
    resume.links.items.length > 0
  ) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Links")],
      }),
    );

    resume.links.items.forEach((item) => {
      const label = safeText(item.label) || safeText(item.type) || "Link";
      const url = safeText(item.url);

      if (!url) {
        return;
      }

      children.push(createDocxParagraph(`${label}: ${url}`));
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}

export function exportResumeAsJson(resume: ResumeData) {
  const blob = new Blob([JSON.stringify(resume, null, 2)], {
    type: "application/json",
  });

  downloadBlob(blob, `${getResumeFileBaseName(resume)}.json`);
}

export function exportResumeAsMarkdown(resume: ResumeData) {
  const markdown = buildMarkdown(resume);
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });

  downloadBlob(blob, `${getResumeFileBaseName(resume)}.md`);
}

export function exportResumeAsText(resume: ResumeData) {
  const text = buildText(resume);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });

  downloadBlob(blob, `${getResumeFileBaseName(resume)}.txt`);
}

export function exportResumeAsHtml(resume: ResumeData, targetId?: string) {
  const html = targetId
    ? buildRenderedHtmlDocument(targetId, resume)
    : buildHtml(resume);
  const outputHtml = html ?? buildHtml(resume);
  const blob = new Blob([outputHtml], { type: "text/html;charset=utf-8" });

  downloadBlob(blob, `${getResumeFileBaseName(resume)}.html`);
}

export async function exportResumeAsDocx(resume: ResumeData) {
  const blob = await buildDocx(resume);
  downloadBlob(blob, `${getResumeFileBaseName(resume)}.docx`);
}

export async function exportResumeAsImage(
  targetId: string,
  resume: ResumeData,
  format: ResumeImageFormat,
) {
  if (typeof window === "undefined") {
    return false;
  }

  const printableNode = document.getElementById(targetId);

  if (!printableNode) {
    return false;
  }

  const sourceNode =
    (printableNode.firstElementChild as HTMLElement | null) ?? printableNode;

  let captureContainer: HTMLDivElement | null = null;

  try {
    const clonedNode = sourceNode.cloneNode(true) as HTMLElement;
    const sourceRect = sourceNode.getBoundingClientRect();

    const captureWidth = Math.max(
      1120,
      Math.ceil(sourceNode.scrollWidth || sourceRect.width || 1120),
    );

    clonedNode.style.margin = "0";
    clonedNode.style.width = "100%";
    clonedNode.style.maxWidth = "none";
    clonedNode.style.boxSizing = "border-box";
    clonedNode.style.border = "none";
    clonedNode.style.boxShadow = "none";
    clonedNode.style.borderRadius = "0";

    captureContainer = document.createElement("div");
    captureContainer.style.position = "fixed";
    captureContainer.style.left = "-100000px";
    captureContainer.style.top = "0";
    captureContainer.style.width = `${captureWidth}px`;
    captureContainer.style.padding = "0";
    captureContainer.style.background = "#ffffff";
    captureContainer.style.zIndex = "-1";
    captureContainer.appendChild(clonedNode);
    document.body.appendChild(captureContainer);

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    const canvas = await captureResumeCanvas(clonedNode, captureWidth);

    if (isCanvasBlank(canvas)) {
      return false;
    }

    const mimeType = format === "png" ? "image/png" : "image/jpeg";
    const quality = format === "png" ? 1 : 0.95;

    const dataUrl = canvas.toDataURL(mimeType, quality);
    const link = document.createElement("a");

    link.href = dataUrl;
    link.download = `${getResumeFileBaseName(resume)}.${format}`;
    link.click();

    return true;
  } finally {
    if (captureContainer?.parentNode) {
      captureContainer.parentNode.removeChild(captureContainer);
    }
  }
}

export async function importResumeFromFile(file: File) {
  const content = await file.text();

  return normalizeResumeData(JSON.parse(content) as ResumeData);
}
