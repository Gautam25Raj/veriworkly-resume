// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  blogPosts: create.doc("blogPosts", {"building-scalable-resume-platform-multi-app-architecture.mdx": () => import("../content/blog/building-scalable-resume-platform-multi-app-architecture.mdx?collection=blogPosts"), "mastering-ats-friendly-resumes-2026.mdx": () => import("../content/blog/mastering-ats-friendly-resumes-2026.mdx?collection=blogPosts"), "privacy-future-local-first-resume-builder.mdx": () => import("../content/blog/privacy-future-local-first-resume-builder.mdx?collection=blogPosts"), }),
};
export default browserCollections;