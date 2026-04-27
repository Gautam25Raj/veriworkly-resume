// @ts-nocheck
import * as __fd_glob_2 from "../content/blog/privacy-future-local-first-resume-builder.mdx?collection=blogPosts"
import * as __fd_glob_1 from "../content/blog/mastering-ats-friendly-resumes-2026.mdx?collection=blogPosts"
import * as __fd_glob_0 from "../content/blog/building-scalable-resume-platform-multi-app-architecture.mdx?collection=blogPosts"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const blogPosts = await create.doc("blogPosts", "content/blog", {"building-scalable-resume-platform-multi-app-architecture.mdx": __fd_glob_0, "mastering-ats-friendly-resumes-2026.mdx": __fd_glob_1, "privacy-future-local-first-resume-builder.mdx": __fd_glob_2, });