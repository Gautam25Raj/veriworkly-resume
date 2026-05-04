import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";

import { blogPosts } from "collections/server";

export const blog = loader({
  baseUrl: "/",
  source: toFumadocsSource(blogPosts, []),
});
