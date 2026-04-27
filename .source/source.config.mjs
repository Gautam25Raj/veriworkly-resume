// source.config.ts
import { defineDocs, defineConfig } from "fumadocs-mdx/config";
var docs = defineDocs({
  dir: "content/docs"
});
var api = defineDocs({
  dir: "content/api"
});
var source_config_default = defineConfig();
export {
  api,
  source_config_default as default,
  docs
};
