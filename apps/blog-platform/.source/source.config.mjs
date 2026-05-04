// source.config.ts
import { defineCollections, defineConfig } from "fumadocs-mdx/config";
var blogPosts = defineCollections({
  type: "doc",
  dir: "content/blog"
});
var source_config_default = defineConfig();
export {
  blogPosts,
  source_config_default as default
};
