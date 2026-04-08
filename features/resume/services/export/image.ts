"use client";

import type { ResumeData } from "@/types/resume";

import html2canvas from "html2canvas";

import { getResumeFileBaseName } from "@/features/resume/services/resume-formatters";

export type ResumeImageFormat = "png" | "jpg";

function isCanvasBlank(canvas: HTMLCanvasElement): boolean {
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

async function captureResumeCanvas(
  node: HTMLElement,
  captureWidth: number,
): Promise<HTMLCanvasElement> {
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

export async function exportResumeAsImage(
  targetId: string,
  resume: ResumeData,
  format: ResumeImageFormat,
): Promise<boolean> {
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
