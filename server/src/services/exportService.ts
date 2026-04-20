import { chromium, type Browser } from "playwright";

import { config } from "#config";

import { ApiError } from "#utils/errors";

type ExportFormat = "pdf" | "png" | "jpg";

type ExportResult = {
  buffer: Buffer;
  contentType: string;
  extension: string;
};

type ResumeSnapshot = {
  basics?: {
    fullName?: string;
    role?: string;
    email?: string;
    phone?: string;
    location?: string;
  };

  summary?: string;

  experience?: Array<{
    company?: string;
    role?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    summary?: string;
    highlights?: string[];
  }>;

  education?: Array<{
    school?: string;
    degree?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    summary?: string;
  }>;

  projects?: Array<{
    name?: string;
    role?: string;
    link?: string;
    summary?: string;
    highlights?: string[];
  }>;

  skills?: Array<{
    name?: string;
    keywords?: string[];
  }>;

  customization?: {
    fontFamily?: string;
  };
};

type KnownResumeFontFamily = "geist" | "serif" | "modern";

const RESUME_FONT_ALIAS_MAP: Record<string, KnownResumeFontFamily> = {
  mono: "geist",
};

const RESUME_FONT_FAMILY_CSS_MAP: Record<KnownResumeFontFamily, string> = {
  geist: '"Geist", "Inter", "Segoe UI", Arial, sans-serif',
  serif: '"Merriweather", Georgia, Cambria, serif',
  modern: '"Manrope", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
};

const RESUME_FONT_STYLESHEET_MAP: Record<KnownResumeFontFamily, string> = {
  geist: "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&display=swap",
  serif: "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap",
  modern: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
};

function isKnownResumeFontFamily(value: string): value is KnownResumeFontFamily {
  return value === "geist" || value === "serif" || value === "modern";
}

function resolveSnapshotFontFamily(snapshot: ResumeSnapshot) {
  const rawFontFamily = (snapshot.customization?.fontFamily ?? "").trim().toLowerCase();
  const normalizedFontFamily = RESUME_FONT_ALIAS_MAP[rawFontFamily] ?? rawFontFamily;
  const fontFamily: KnownResumeFontFamily = isKnownResumeFontFamily(normalizedFontFamily)
    ? normalizedFontFamily
    : "geist";

  return {
    cssFontFamily: RESUME_FONT_FAMILY_CSS_MAP[fontFamily],
    stylesheetHref: RESUME_FONT_STYLESHEET_MAP[fontFamily],
  };
}

let browserInstance: Browser | null = null;
let activeRenderCount = 0;
const pendingRenderResolvers: Array<() => void> = [];

async function acquireRenderSlot() {
  if (activeRenderCount < config.exportQueue.maxConcurrentExports) {
    activeRenderCount += 1;
    return;
  }

  await new Promise<void>((resolve) => {
    pendingRenderResolvers.push(() => {
      activeRenderCount += 1;
      resolve();
    });
  });
}

function releaseRenderSlot() {
  activeRenderCount = Math.max(0, activeRenderCount - 1);

  const next = pendingRenderResolvers.shift();
  if (next) {
    next();
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeText(value: string | null | undefined) {
  return (value ?? "").trim();
}

function formatDateRange(start: string | undefined, end: string | undefined, current = false) {
  const from = safeText(start) || "Start";

  if (current) {
    return `${from} - Present`;
  }

  return `${from} - ${safeText(end) || "End"}`;
}

function buildHtml(snapshot: ResumeSnapshot) {
  const { cssFontFamily, stylesheetHref } = resolveSnapshotFontFamily(snapshot);

  const name = escapeHtml(safeText(snapshot.basics?.fullName) || "Your Name");
  const role = escapeHtml(safeText(snapshot.basics?.role));

  const contact = [
    safeText(snapshot.basics?.email),
    safeText(snapshot.basics?.phone),
    safeText(snapshot.basics?.location),
  ]
    .filter(Boolean)
    .map((item) => `<span>${escapeHtml(item)}</span>`)
    .join('<span class="dot">•</span>');

  const summary = safeText(snapshot.summary)
    ? `<section><h2>Summary</h2><p>${escapeHtml(safeText(snapshot.summary))}</p></section>`
    : "";

  const experience = (snapshot.experience ?? [])
    .map((item) => {
      const highlights = (item.highlights ?? [])
        .filter(Boolean)
        .map((highlight) => `<li>${escapeHtml(safeText(highlight))}</li>`)
        .join("");

      return `<article>
        <h3>${escapeHtml(safeText(item.role) || "Role")} · ${escapeHtml(safeText(item.company) || "Company")}</h3>
        <p class="meta">${escapeHtml(formatDateRange(item.startDate, item.endDate, item.current))}${safeText(item.location) ? ` · ${escapeHtml(safeText(item.location))}` : ""}</p>
        ${safeText(item.summary) ? `<p>${escapeHtml(safeText(item.summary))}</p>` : ""}
        ${highlights ? `<ul>${highlights}</ul>` : ""}
      </article>`;
    })
    .join("");

  const education = (snapshot.education ?? [])
    .map((item) => {
      const degree = `${safeText(item.degree) || "Degree"}${safeText(item.field) ? `, ${safeText(item.field)}` : ""}`;

      return `<article>
        <h3>${escapeHtml(degree)}</h3>
        <p class="meta">${escapeHtml(safeText(item.school) || "School")} · ${escapeHtml(formatDateRange(item.startDate, item.endDate, item.current))}</p>
        ${safeText(item.summary) ? `<p>${escapeHtml(safeText(item.summary))}</p>` : ""}
      </article>`;
    })
    .join("");

  const projects = (snapshot.projects ?? [])
    .map((item) => {
      const highlights = (item.highlights ?? [])
        .filter(Boolean)
        .map((highlight) => `<li>${escapeHtml(safeText(highlight))}</li>`)
        .join("");

      return `<article>
        <h3>${escapeHtml(safeText(item.name) || "Project")}${safeText(item.role) ? ` <span class="sub">(${escapeHtml(safeText(item.role))})</span>` : ""}</h3>
        ${safeText(item.link) ? `<p><a href="${escapeHtml(safeText(item.link))}">${escapeHtml(safeText(item.link))}</a></p>` : ""}
        ${safeText(item.summary) ? `<p>${escapeHtml(safeText(item.summary))}</p>` : ""}
        ${highlights ? `<ul>${highlights}</ul>` : ""}
      </article>`;
    })
    .join("");

  const skills = (snapshot.skills ?? [])
    .map((item) => {
      const keywords = (item.keywords ?? [])
        .map((keyword) => safeText(keyword))
        .filter(Boolean)
        .join(", ");
      if (!keywords) {
        return "";
      }

      return `<li><strong>${escapeHtml(safeText(item.name) || "Skills")}</strong>: ${escapeHtml(keywords)}</li>`;
    })
    .filter(Boolean)
    .join("");

  return `<!doctype html>
            <html lang="en">
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <title>${name} - Resume</title>
              ${stylesheetHref ? `<link rel="preconnect" href="https://fonts.googleapis.com" />` : ""}
              ${stylesheetHref ? `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />` : ""}
              ${stylesheetHref ? `<link rel="stylesheet" href="${stylesheetHref}" />` : ""}
              <style>
                :root { color-scheme: light; }
                * { box-sizing: border-box; }
                body { margin: 0; padding: 0; font-family: ${cssFontFamily}; background: #ffffff; color: #111827; }
                main { width: 210mm; max-width: 100%; margin: 0 auto; background: #fff; border: none; border-radius: 0; padding: 20px; }
                header { border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; }
                h1 { margin: 0; font-size: 1.9rem; }
                h2 { margin: 24px 0 10px; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.08em; color: #374151; }
                h3 { margin: 0 0 4px; font-size: 0.97rem; }
                p { margin: 0 0 8px; line-height: 1.5; }
                .meta { color: #4b5563; font-size: 0.9rem; }
                .lead { margin-top: 6px; font-size: 1rem; color: #374151; }
                .contact { color: #4b5563; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
                .dot { opacity: 0.55; }
                article { margin-bottom: 14px; }
                ul { margin: 0 0 8px 20px; padding: 0; }
                .sub { color: #6b7280; font-weight: 500; }
                a { color: #0f4dbf; text-decoration: none; }
              </style>
            </head>
            <body>
              <main>
                <header>
                  <h1>${name}</h1>
                  ${role ? `<p class="lead">${role}</p>` : ""}
                  ${contact ? `<div class="contact">${contact}</div>` : ""}
                </header>
                ${summary}
                ${experience ? `<section><h2>Experience</h2>${experience}</section>` : ""}
                ${education ? `<section><h2>Education</h2>${education}</section>` : ""}
                ${projects ? `<section><h2>Projects</h2>${projects}</section>` : ""}
                ${skills ? `<section><h2>Skills</h2><ul>${skills}</ul></section>` : ""}
              </main>
            </body>
          </html>`;
}

async function getBrowser() {
  if (browserInstance) {
    return browserInstance;
  }

  try {
    browserInstance = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    browserInstance.on("disconnected", () => {
      browserInstance = null;
    });

    return browserInstance;
  } catch (error) {
    throw new ApiError(
      503,
      "Export engine is unavailable. Install Playwright browsers on server.",
      error,
    );
  }
}

export async function exportResumeSnapshot(
  snapshot: ResumeSnapshot,
  format: ExportFormat,
  renderHtml?: string,
): Promise<ExportResult> {
  await acquireRenderSlot();

  const browser = await getBrowser();
  const context = await browser.newContext({
    viewport: {
      width: 1280,
      height: 1800,
    },
    javaScriptEnabled: false,
  });
  const page = await context.newPage();

  try {
    await page.emulateMedia({ media: "screen" });

    await page.setContent(renderHtml || buildHtml(snapshot), {
      waitUntil: "networkidle",
      timeout: 30_000,
    });

    await page.evaluate(async () => {
      const fontsReady = document.fonts?.ready;

      if (fontsReady) {
        await fontsReady;
      }
    });

    if (format === "pdf") {
      const buffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: "0mm",
          right: "0mm",
          bottom: "0mm",
          left: "0mm",
        },
      });

      return {
        buffer,
        contentType: "application/pdf",
        extension: "pdf",
      };
    }

    const clip = await page.evaluate(() => {
      const doc = (
        globalThis as {
          document?: {
            getElementById: (id: string) => {
              getBoundingClientRect: () => {
                left: number;
                top: number;
                width: number;
                height: number;
              };
            } | null;
          };
        }
      ).document;

      if (!doc) {
        return null;
      }

      const exportRoot = doc.getElementById("export-root");

      if (!exportRoot) {
        return null;
      }

      const rect = exportRoot.getBoundingClientRect();

      return {
        x: Math.max(0, Math.floor(rect.left)),
        y: Math.max(0, Math.floor(rect.top)),
        width: Math.max(1, Math.ceil(rect.width)),
        height: Math.max(1, Math.ceil(rect.height)),
      };
    });

    if (format === "png") {
      const buffer = await page.screenshot({
        type: "png",
        fullPage: !clip,
        ...(clip ? { clip } : {}),
      });

      return {
        buffer,
        contentType: "image/png",
        extension: "png",
      };
    }

    const buffer = await page.screenshot({
      type: "jpeg",
      quality: 95,
      fullPage: !clip,
      ...(clip ? { clip } : {}),
    });

    return {
      buffer,
      contentType: "image/jpeg",
      extension: "jpg",
    };
  } finally {
    await page.close();
    await context.close();
    releaseRenderSlot();
  }
}

export async function closeExportBrowser() {
  if (!browserInstance) {
    return;
  }

  await browserInstance.close();
  browserInstance = null;
}

export type { ExportFormat, ResumeSnapshot };
