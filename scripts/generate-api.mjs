import path from "node:path";
import { generateFiles } from "fumadocs-openapi";
import { createOpenAPI } from "fumadocs-openapi/server";

process.chdir(path.join(process.cwd(), "apps/docs-platform"));

const openapi = createOpenAPI({
  input: ["./openapi.yaml"],
  proxyUrl: "/api/proxy",
});

void generateFiles({
  input: openapi,
  output: "./content/api-reference",
  per: "operation",
  groupBy: "tag",
});
