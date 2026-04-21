"use client";

function toAbsoluteUrl(url: string) {
  try {
    return new URL(url, window.location.origin).toString();
  } catch {
    return url;
  }
}

function collectStylesAndLinks() {
  const styleTags = Array.from(document.querySelectorAll("style"))
    .map((tag) => tag.outerHTML)
    .join("\n");

  const stylesheetLinks = Array.from(
    document.querySelectorAll('link[rel="stylesheet"]'),
  )
    .map((linkTag) => {
      const href = linkTag.getAttribute("href");

      if (!href) {
        return "";
      }

      return `<link rel="stylesheet" href="${toAbsoluteUrl(href)}" />`;
    })
    .filter(Boolean)
    .join("\n");

  return `${stylesheetLinks}\n${styleTags}`;
}

function collectFontVariables(style: CSSStyleDeclaration) {
  const variables: Record<string, string> = {};

  for (let index = 0; index < style.length; index += 1) {
    const propertyName = style.item(index);

    if (!propertyName.startsWith("--font")) {
      continue;
    }

    const value = style.getPropertyValue(propertyName).trim();

    if (!value) {
      continue;
    }

    variables[propertyName] = value;
  }

  return variables;
}

function collectFontVariableNamesFromFontFamily(fontFamily: string) {
  const names = new Set<string>();
  const matches = fontFamily.matchAll(/var\((--font[\w-]+)\)/g);

  for (const match of matches) {
    const variableName = match[1]?.trim();

    if (variableName) {
      names.add(variableName);
    }
  }

  return names;
}

function resolveFontVariableValue(
  variableName: string,
  stylesInPriorityOrder: CSSStyleDeclaration[],
) {
  for (const style of stylesInPriorityOrder) {
    const value = style.getPropertyValue(variableName).trim();

    if (value) {
      return value;
    }
  }

  return "";
}

function toCssVariablesBlock(variables: Record<string, string>) {
  const entries = Object.entries(variables);

  if (entries.length === 0) {
    return "";
  }

  return entries.map(([key, value]) => `${key}: ${value};`).join("\n");
}

function resolveExportGridTemplateColumns(className: string) {
  const arbitraryMatch = className.match(
    /^(?:[a-z0-9-]+:)*grid-cols-\[(.+)\]$/i,
  );

  if (arbitraryMatch?.[1]) {
    const raw = arbitraryMatch[1].trim();

    if (raw.includes("_")) {
      return raw.replaceAll("_", " ");
    }
  }

  const numericMatch = className.match(/^(?:[a-z0-9-]+:)*grid-cols-(\d+)$/i);

  if (numericMatch?.[1]) {
    const count = Number.parseInt(numericMatch[1], 10);

    if (Number.isFinite(count) && count > 1) {
      return `repeat(${count}, minmax(0, 1fr))`;
    }
  }

  return null;
}

function forceTwoColumnLayoutForExport(rootNode: HTMLElement) {
  let hasForcedGrid = false;

  const applyForcedGrid = (element: HTMLElement) => {
    const classTokens = Array.from(element.classList);

    for (const classToken of classTokens) {
      const gridTemplateColumns = resolveExportGridTemplateColumns(classToken);

      if (!gridTemplateColumns) {
        continue;
      }

      element.style.display = "grid";
      element.style.gridTemplateColumns = gridTemplateColumns;
      element.style.alignItems = "start";
      element.style.height = "100%";
      element.style.minHeight = "100%";

      for (const child of Array.from(element.children)) {
        if (!(child instanceof HTMLElement)) {
          continue;
        }

        child.style.alignSelf = "stretch";
        child.style.height = "100%";
        child.style.minHeight = "100%";
      }

      hasForcedGrid = true;
      return;
    }
  };

  applyForcedGrid(rootNode);

  if (rootNode.children.length === 1) {
    const onlyChild = rootNode.firstElementChild as HTMLElement | null;

    if (onlyChild) {
      onlyChild.style.minHeight = "100%";
      onlyChild.style.height = "100%";
    }
  }

  const descendants = rootNode.querySelectorAll<HTMLElement>("*");

  descendants.forEach((element) => {
    applyForcedGrid(element);
  });

  return hasForcedGrid;
}

export function buildExportHtml(targetId: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const targetNode = document.getElementById(targetId);

  if (!targetNode) {
    return null;
  }

  const sourceNode =
    (targetNode.firstElementChild as HTMLElement | null) ?? targetNode;

  const sourceRect = sourceNode.getBoundingClientRect();
  const sourceWidth = Math.max(1, Math.round(sourceRect.width));

  const sourceStyle = window.getComputedStyle(sourceNode);

  const sourceFontFamily = sourceStyle.fontFamily;

  const rootStyle = window.getComputedStyle(document.documentElement);
  const bodyStyle = window.getComputedStyle(document.body);

  const rootFontVariables = collectFontVariables(rootStyle);
  const bodyFontVariables = collectFontVariables(bodyStyle);
  const sourceFontVariables = collectFontVariables(sourceStyle);

  const mergedFontVariables = {
    ...rootFontVariables,
    ...bodyFontVariables,
    ...sourceFontVariables,
  };

  const sourceFontFamilyVariables =
    collectFontVariableNamesFromFontFamily(sourceFontFamily);

  const fontVariableNames = new Set<string>([
    ...Object.keys(mergedFontVariables),
    ...sourceFontFamilyVariables,
  ]);

  for (const variableName of fontVariableNames) {
    const resolvedValue = resolveFontVariableValue(variableName, [
      sourceStyle,
      bodyStyle,
      rootStyle,
    ]);

    if (resolvedValue) {
      mergedFontVariables[variableName] = resolvedValue;
    }
  }

  const clonedNode = sourceNode.cloneNode(true) as HTMLElement;

  clonedNode.removeAttribute("id");
  clonedNode.style.margin = "0";
  clonedNode.style.border = "none";
  clonedNode.style.borderRadius = "0";
  clonedNode.style.boxShadow = "none";
  clonedNode.style.outline = "none";

  const hasForcedGrid = forceTwoColumnLayoutForExport(clonedNode);

  const headContent = collectStylesAndLinks();
  const htmlClass = document.documentElement.className;
  const bodyClass = document.body.className;

  const exportTemplatePrintOverrides = hasForcedGrid
    ? `
      #export-root [style*="grid-template-columns"] {
        align-items: start !important;
      }
    `
    : "";

  return `<!doctype html>
          <html lang="en" class="${htmlClass}">
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <base href="${window.location.origin}/" />
              ${headContent}
              <style>
                @page {
                  margin: 0;
                }

                :root {
                  ${toCssVariablesBlock(mergedFontVariables)}
                }

                html, body {
                  margin: 0;
                  padding: 0;
                  background: #ffffff;
                  height: 100%;
                }

                body {
                  font-family: ${sourceFontFamily};
                }

                #export-root {
                  margin: 0;
                  padding: 0;
                  width: ${sourceWidth}px;
                  max-width: ${sourceWidth}px;
                  min-height: 100%;
                }

                #export-root > * {
                  margin: 0 !important;
                  border: none !important;
                  border-radius: 0 !important;
                  box-shadow: none !important;
                  outline: none !important;
                  min-height: 100% !important;
                }

                @media print {
                  html, body, #export-root {
                    height: 100% !important;
                  }

                  #export-root > * {
                    min-height: 100% !important;
                  }
                }

                ${exportTemplatePrintOverrides}
              </style>
            </head>
            <body class="${bodyClass}">
              <div id="export-root">${clonedNode.outerHTML}</div>
            </body>
          </html>`;
}
