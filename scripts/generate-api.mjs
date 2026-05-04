import { generateFiles } from "fumadocs-openapi";
import { createOpenAPI } from "fumadocs-openapi/server";
import { copyFileSync } from "node:fs";

const openapi = createOpenAPI({
  input: ["./apps/docs-platform/openapi.yaml"],
  proxyUrl: "/api/proxy",
});

void generateFiles({
  input: openapi,
  output: "./apps/docs-platform/content/api-reference",
  per: "operation",
  groupBy: "tag",
});
