"use client";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface LinkRect {
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

function parseCssColor(value: string): [number, number, number] {
  const normalized = value.trim().toLowerCase();

  if (!normalized || normalized === "transparent") {
    return [255, 255, 255];
  }

  const rgbMatch = normalized.match(
    /^rgba?\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+)?\)$/,
  );

  if (rgbMatch) {
    return [
      Math.min(255, Number(rgbMatch[1])),
      Math.min(255, Number(rgbMatch[2])),
      Math.min(255, Number(rgbMatch[3])),
    ];
  }

  const hexMatch = normalized.match(/^#([a-f0-9]{3}|[a-f0-9]{6})$/i);

  if (hexMatch) {
    const raw = hexMatch[1];
    const expanded =
      raw.length === 3
        ? raw
            .split("")
            .map((segment) => `${segment}${segment}`)
            .join("")
        : raw;

    return [
      Number.parseInt(expanded.slice(0, 2), 16),
      Number.parseInt(expanded.slice(2, 4), 16),
      Number.parseInt(expanded.slice(4, 6), 16),
    ];
  }

  return [255, 255, 255];
}

function extractLinkRectsFromDOM(node: HTMLElement): LinkRect[] {
  const nodeRect = node.getBoundingClientRect();
  const anchors = Array.from(node.querySelectorAll("a[href]"));

  return anchors
    .map((anchor) => {
      const href = anchor.getAttribute("href")?.trim() ?? "";

      if (!href || href.startsWith("#")) {
        return null;
      }

      const rect = anchor.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width <= 0 || height <= 0) {
        return null;
      }

      return {
        url: href,
        x: rect.left - nodeRect.left,
        y: rect.top - nodeRect.top,
        width,
        height,
      } satisfies LinkRect;
    })
    .filter((item): item is LinkRect => item !== null);
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

export async function generatePDF(targetId: string, fileName = "resume") {
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
    const sourceStyles = window.getComputedStyle(sourceNode);
    const pageBackgroundColor = parseCssColor(sourceStyles.backgroundColor);

    // Keep desktop breakpoint active while capturing so two-column layouts export correctly.
    const captureWidth = Math.max(
      1120,
      Math.ceil(sourceNode.scrollWidth || sourceRect.width || 1120),
    );

    clonedNode.style.margin = "0";
    clonedNode.style.width = "100%";
    clonedNode.style.maxWidth = "none";
    clonedNode.style.boxSizing = "border-box";

    // Keep template internals but remove editor-only frame styling in PDF.
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

    const linkRects = extractLinkRectsFromDOM(clonedNode);

    const canvas = await captureResumeCanvas(clonedNode, captureWidth);

    if (isCanvasBlank(canvas)) {
      return false;
    }

    const pdf = new jsPDF({
      format: "a4",
      orientation: "portrait",
      unit: "pt",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 0;

    const availableWidth = pageWidth - margin * 2;
    const renderWidth = availableWidth;
    const offsetX = margin;
    const scale = renderWidth / canvas.width;
    const pageContentHeight = pageHeight - margin * 2;
    const pageHeightInCanvasPx = Math.floor(pageContentHeight / scale);

    if (pageHeightInCanvasPx <= 0) {
      return false;
    }

    let sourceY = 0;
    let pageIndex = 0;

    while (sourceY < canvas.height) {
      const sliceHeight = Math.min(
        pageHeightInCanvasPx,
        canvas.height - sourceY,
      );

      const pageCanvas = document.createElement("canvas");

      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeight;

      const pageContext = pageCanvas.getContext("2d");

      if (!pageContext) {
        return false;
      }

      pageContext.fillStyle = "#ffffff";
      pageContext.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      pageContext.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sliceHeight,
        0,
        0,
        canvas.width,
        sliceHeight,
      );

      if (pageIndex > 0) {
        pdf.addPage();
      }

      // Keep page background consistent even when content doesn't fill the full page.
      pdf.setFillColor(
        pageBackgroundColor[0],
        pageBackgroundColor[1],
        pageBackgroundColor[2],
      );
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      const sliceHeightInPdf = sliceHeight * scale;
      const pageImage = pageCanvas.toDataURL("image/png", 1.0);

      pdf.addImage(
        pageImage,
        "PNG",
        offsetX,
        margin,
        renderWidth,
        sliceHeightInPdf,
      );

      sourceY += sliceHeight;
      pageIndex += 1;
    }

    // Overlay clickable links at their original visual positions on the rendered pages.
    if (linkRects.length > 0) {
      const domToCanvasScale = canvas.width / captureWidth;

      linkRects.forEach((linkRect) => {
        const xCanvas = linkRect.x * domToCanvasScale;
        let yCanvas = linkRect.y * domToCanvasScale;

        const widthCanvas = linkRect.width * domToCanvasScale;
        let heightCanvas = Math.max(1, linkRect.height * domToCanvasScale);

        while (heightCanvas > 0) {
          const pageNumber = Math.floor(yCanvas / pageHeightInCanvasPx) + 1;

          if (pageNumber > pageIndex) {
            break;
          }

          const yWithinPageCanvas = yCanvas % pageHeightInCanvasPx;

          const remainingHeightOnPageCanvas =
            pageHeightInCanvasPx - yWithinPageCanvas;

          const sliceHeightCanvas = Math.min(
            heightCanvas,
            remainingHeightOnPageCanvas,
          );

          const xPdf = offsetX + xCanvas * scale;
          const yPdf = margin + yWithinPageCanvas * scale;
          const widthPdf = Math.max(2, widthCanvas * scale);
          const heightPdf = Math.max(2, sliceHeightCanvas * scale);

          pdf.setPage(pageNumber);
          pdf.link(xPdf, yPdf, widthPdf, heightPdf, { url: linkRect.url });

          yCanvas += sliceHeightCanvas;
          heightCanvas -= sliceHeightCanvas;
        }
      });
    }

    const safeName = sanitizeFileName(fileName) || "resume";
    pdf.save(`${safeName}.pdf`);

    return true;
  } catch {
    return false;
  } finally {
    if (captureContainer && captureContainer.parentNode) {
      captureContainer.parentNode.removeChild(captureContainer);
    }
  }
}
