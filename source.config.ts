import { defineDocs, defineConfig } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
});

export const api = defineDocs({
  dir: "content/api",
});

export default defineConfig();
