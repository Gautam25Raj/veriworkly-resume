# VeriWorkly Blog Platform

The blog platform for VeriWorkly, built with [Fumadocs](https://fumadocs.vercel.app/).

## Features
- **MDX Support**: Write blog posts in MDX for rich content.
- **Optimized for SEO**: High-performance, SEO-friendly blog pages.
- **Dynamic OG Images**: Automatically generated Open Graph images for every post.
- **Privacy First**: No tracking, just content.

## Tech Stack
- **Framework**: Next.js 15
- **Content Engine**: Fumadocs
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Development
To run the blog platform locally:
```bash
npm run dev:blog
```

## Creating a new post
Add a new `.mdx` file to `apps/blog-platform/content/`.
Every post must include the following frontmatter:
```markdown
---
title: Your Title
description: Your Description
author: Author Name
date: YYYY-MM-DD
---
```
