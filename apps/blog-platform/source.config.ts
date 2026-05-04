import { defineCollections, defineConfig } from "fumadocs-mdx/config";

export const blogPosts = defineCollections({
  type: "doc",
  dir: "content/blog",
});

export default defineConfig();
