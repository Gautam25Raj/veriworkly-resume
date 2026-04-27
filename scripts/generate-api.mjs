import { generateFiles } from "fumadocs-openapi";
import { createOpenAPI } from "fumadocs-openapi/server";

const openapi = createOpenAPI({
  input: ["./openapi.yaml"],
  proxyUrl: "/api/proxy",
});

void generateFiles({
  input: openapi,
  output: "./content/api",
  per: "operation",
  groupBy: "tag",
});
