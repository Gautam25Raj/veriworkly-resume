# 📖 Documentation Platform: Technical Breakdown

`@veriworkly/docs-platform` is the centralized knowledge hub for VeriWorkly. Built on the **Fumadocs** framework, it provides a premium reading experience for developers and users.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15+
- **Docs Engine**: Fumadocs (MDX-based)
- **Search**: Fumadocs Search (Local/Algolia compatible)
- **API Reference**: `fumadocs-openapi`
- **Styling**: Tailwind CSS 4 + Fumadocs UI components

---

## 📁 Detailed Folder Structure

| Path                     | Purpose                                                       |
| :----------------------- | :------------------------------------------------------------ |
| `content/`               | **Documentation Source**: MDX files for guides and tutorials. |
| `content/docs/`          | User manuals and setup guides.                                |
| `content/api-reference/` | Auto-generated pages from OpenAPI specs.                      |
| `specs/`                 | **API Specifications**: The raw OpenAPI/Swagger YAML files.   |
| `openapi.yaml`           | The bundled, single-source-of-truth API specification.        |
| `openapi.config.ts`      | Configuration for the OpenAPI documentation generator.        |
| `app/`                   | Next.js routes for the documentation site.                    |
| `lib/`                   | Search and MDX configuration utilities.                       |

---

## 🔌 API Reference Integration

This platform is tightly integrated with the VeriWorkly API specification.

1. **Source**: The `specs/` directory contains modular OpenAPI definitions.
2. **Bundling**: Redocly CLI bundles these into a single `openapi.yaml`.
3. **Generation**: `fumadocs-openapi` scans the YAML and generates high-quality, interactive React components for every endpoint.
4. **Result**: A beautiful, interactive API explorer that stays in sync with the backend.

---

## 📝 MDX Content Management

- **Formatting**: Supports GFM (GitHub Flavored Markdown), Callouts, Tabs, and Code Blocks.
- **Components**: Custom React components can be embedded directly into `.mdx` files.
- **Frontmatter**: Used for SEO meta-tags, breadcrumbs, and sidebar ordering.

---

## 🚀 Development Workflow

To add a new guide:

1. Create a `.mdx` file in `content/docs/`.
2. Update the frontmatter with a `title` and `description`.
3. The sidebar will automatically update based on the directory structure.

To preview:

```bash
npm run dev -w @veriworkly/docs-platform
```

---

© 2026 VeriWorkly. Documenting the future.
