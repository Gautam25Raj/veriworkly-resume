# ✍️ VeriWorkly Blog Platform

The official blog and thought leadership platform for VeriWorkly. A high-performance, SEO-optimized content delivery system built with Next.js 15+ and Fumadocs.

**Port**: 3002 | **Framework**: Next.js 15+ App Router | **Styling**: Tailwind CSS 4

---

## 🚀 Overview

The Blog Platform (@veriworkly/blog-platform) is an independent application serving as the primary communication channel for product updates, career insights, technical guides, and community stories.

Because VeriWorkly utilizes a distributed monorepo architecture, this application is statically generated entirely independently from the Resume Builder. This ensures heavy traffic to viral blog posts has absolutely zero impact on users trying to generate CVs on the main application.

## 🛠️ Technology Stack

- **Framework**: Next.js 15+ with App Router
- **Content Engine**: Fumadocs Collections & MDX
- **Styling**: Tailwind CSS 4 + Shared UI Components (@veriworkly/ui)
- **Theme Management**: \
  ext-themes\ for seamless Dark/Light toggle
- **SEO/Metadata**: Automatically generated Open Graph and static paths

---

## 🏃 Quick Start

### Installation & Development

`ash

# From the root workspace directory:

npm install

# Start the blog platform in development mode

npm run dev -w @veriworkly/blog-platform
`

The blog platform will be available at **http://localhost:3002**.

### Build & Production

`ash

# Build statically

npm run build -w @veriworkly/blog-platform

# Start the production server

npm start -w @veriworkly/blog-platform
`

---

## 📁 Content Management (MDX)

Blog posts live entirely inside the \content/blog\ directory. Each post is an \.mdx\ file requiring strict frontmatter.

### Creating a Post

1. Create a new file: \content/blog/my-new-post.mdx\
2. Add the required YAML frontmatter:
   \\\yaml

---

title: "Your Post Title"
description: "Short SEO-friendly description."
date: 2026-05-01
author: "VeriWorkly Team"

---

\\\
3. Write content using standard Markdown syntax, injecting custom React components from \@veriworkly/ui\ when necessary.

---

## 🎨 UI & Shared Components

All global styling is inherited from our internal \@veriworkly/ui\ library.

To use branded components inside your MDX blocks or React pages:
\\\ sx
import { Button, Card } from "@veriworkly/ui";
\\\
Tailwind 4 manages the heavy lifting for spacing, nested groups, and modern arbitrary values.
