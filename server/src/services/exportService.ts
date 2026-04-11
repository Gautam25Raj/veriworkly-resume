import { chromium, type Browser } from "playwright";

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
};

let browserInstance: Browser | null = null;

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
              <style>
                :root { color-scheme: light; }
                * { box-sizing: border-box; }
                body { margin: 0; padding: 36px 20px; font-family: "Segoe UI", Arial, sans-serif; background: #f4f6fb; color: #111827; }
                main { width: 210mm; max-width: 100%; margin: 0 auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 28px; }
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
): Promise<ExportResult> {
  const browser = await getBrowser();
  const context = await browser.newContext({
    viewport: {
      width: 1280,
      height: 1800,
    },
  });
  const page = await context.newPage();

  try {
    await page.setContent(buildHtml(snapshot), {
      waitUntil: "networkidle",
      timeout: 30_000,
    });

    if (format === "pdf") {
      const buffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "10mm",
          right: "10mm",
          bottom: "10mm",
          left: "10mm",
        },
      });

      return {
        buffer,
        contentType: "application/pdf",
        extension: "pdf",
      };
    }

    if (format === "png") {
      const buffer = await page.screenshot({
        type: "png",
        fullPage: true,
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
      fullPage: true,
    });

    return {
      buffer,
      contentType: "image/jpeg",
      extension: "jpg",
    };
  } finally {
    await page.close();
    await context.close();
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
