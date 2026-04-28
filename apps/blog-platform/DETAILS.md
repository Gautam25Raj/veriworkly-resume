# ✍️ Blog Platform: Technical Breakdown

`@veriworkly/blog-platform` is the communication channel for VeriWorkly. It uses a high-performance MDX engine to deliver beautiful, SEO-optimized content to our users and the developer community.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15+
- **Content Engine**: Fumadocs Content Collections
- **Styling**: Tailwind CSS 4 + Shared UI package (`@veriworkly/ui`)
- **Metadata**: Next.js Metadata API for robust SEO

---

## 📁 Detailed Folder Structure

| Path               | Purpose                                                              |
| :----------------- | :------------------------------------------------------------------- |
| `content/`         | **Blog Posts**: Each subdirectory represents a blog post category.   |
| `app/`             | **Dynamic Routes**: Handles blog listings and individual post pages. |
| `config/`          | SEO and site-wide blog configurations.                               |
| `lib/`             | Utilities for calculating read time and formatting dates.            |
| `source.config.ts` | Definition of the blog content collection (schemas and types).       |

---

## 📈 SEO & Performance

- **Static Generation (SSG)**: All blog posts are pre-rendered at build time for instant loading.
- **Image Optimization**: Uses Next.js `Image` component for automatic WebP conversion and lazy loading.
- **OpenGraph (OG)**: Dynamic OG images generated for every post to increase social media engagement.
- **Sitemap**: Automatically updated with every new post to improve search engine indexing.

---

## 📝 Writing a Blog Post

1. Navigate to `content/`.
2. Create a new `.mdx` file.
3. Define the frontmatter:
   ```yaml
   title: "My New Post"
   description: "Summary of the post"
   date: 2026-04-28
   author: "VeriWorkly Team"
   ```
4. Write your content using standard Markdown or custom React components.

---

## 🚀 Development Workflow

To start the blog in dev mode:

```bash
npm run dev -w @veriworkly/blog-platform
```

To build for production:

```bash
npm run build -w @veriworkly/blog-platform
```

---

© 2026 VeriWorkly. Sharing insights, building careers.
