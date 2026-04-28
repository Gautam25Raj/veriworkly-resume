# 📖 VeriWorkly Documentation Platform

The centralized knowledge hub and interactive API explorer for the VeriWorkly ecosystem. This is an independent Next.js 15+ application providing comprehensive documentation, API references, and developer guides for the entire VeriWorkly platform.

**Port**: 3001 | **Framework**: Next.js 15+ App Router | **Documentation Engine**: Fumadocs | **Styling**: Tailwind CSS 4

---

## 🎯 Overview

The Documentation Platform (`@veriworkly/docs-platform`) serves as the single source of truth for all VeriWorkly technical documentation. It combines **Fumadocs**, a premium markdown-based documentation framework, with **Fumadocs OpenAPI** integration to provide an interactive, searchable API reference alongside comprehensive guides and tutorials.

This application is:

- **Completely Independent**: Runs as a standalone Next.js service on port 3001
- **Design System Integrated**: Uses `@veriworkly/ui` component library for consistent branding
- **SEO Optimized**: Server-side generated for search engine visibility
- **Dark Mode Compatible**: Full theme support via `next-themes`
- **Mobile Responsive**: Fumadocs UI ensures accessibility across all devices

---

## ✨ Key Features

### 📚 Comprehensive Documentation

- **Getting Started Guides**: Step-by-step setup instructions for all VeriWorkly components
- **Developer Guides**: Deep-dive tutorials on architecture, authentication, and API integration
- **API Reference**: Interactive, auto-generated documentation from OpenAPI specifications
- **Best Practices**: Security, performance, and scalability recommendations
- **FAQ & Troubleshooting**: Common issues and solutions with code examples

### 🔍 Advanced Search & Discovery

- **Full-Text Search**: Instant lookup across the entire knowledge base
- **Semantic Navigation**: Breadcrumb trails and intelligent sidebar ordering
- **Code Highlighting**: Syntax-highlighted code blocks with language detection
- **Custom Components**: Callouts, tabs, alerts, and embedded examples

### 🔗 Real-Time API Integration

- **OpenAPI Powered**: Single source of truth from `specs/openapi.yaml`
- **Interactive Endpoints**: Try API requests directly from the docs
- **Request/Response Examples**: Automatically generated from schema definitions
- **Endpoint Filtering**: Browse by tags, operationId, and method

### 🎨 Premium User Experience

- **Responsive Layout**: Mobile-first design optimized for all screen sizes
- **Dark Mode**: Seamless light/dark theme switching
- **Fast Load Times**: Static generation with incremental updates
- **Accessibility**: WCAG 2.1 AA compliant navigation and content

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────┐
│           Documentation Platform (Port 3001)            │
├─────────────────────────────────────────────────────────┤
│                   Next.js 15+ App Router                │
├──────────────────────┬──────────────────────────────────┤
│   Static Generation  │      Runtime Rendering           │
│   - Docs Pages       │      - Search Results            │
│   - API Reference    │      - Theme Switching           │
│   - Archive Pages    │      - Dynamic Routing           │
└──────────────────────┴──────────────────────────────────┘
         ↓                              ↓
   ┌─────────────┐            ┌─────────────────┐
   │ Fumadocs    │            │ Tailwind CSS 4  │
   │ Core Engine │            │ + UI Components │
   └─────────────┘            └─────────────────┘
         ↓
   ┌──────────────────────────────────────────┐
   │   Content & Configuration Layer          │
   ├──────────────────────────────────────────┤
   │ - content/docs/* (MDX guides)            │
   │ - content/api-reference/* (Auto-gen)     │
   │ - specs/openapi.yaml (API source)        │
   │ - openapi.config.ts (Integration)        │
   └──────────────────────────────────────────┘
         ↓
   ┌──────────────────────────────────────────┐
   │   Shared Design System                   │
   ├──────────────────────────────────────────┤
   │ - @veriworkly/ui (Components)            │
   │ - Theme Tokens (via Tailwind 4)          │
   │ - next-themes (Context Provider)         │
   └──────────────────────────────────────────┘
```

### Directory Structure

| Directory                | Purpose                                                               |
| ------------------------ | --------------------------------------------------------------------- |
| `app/`                   | Next.js App Router pages, layouts, and API routes                     |
| `content/docs/`          | MDX source files for guides and tutorials                             |
| `content/api-reference/` | Auto-generated API reference pages from OpenAPI                       |
| `specs/`                 | OpenAPI 3.0 YAML definitions organized by feature                     |
| `specs/openapi.yaml`     | Bundled single-source-of-truth API specification                      |
| `lib/`                   | Utility functions for search, MDX processing, and OpenAPI integration |
| `components/`            | React components for API explorer, MDX rendering, layouts             |
| `public/`                | Static assets, images, OpenAPI exports                                |
| `config/`                | Site configuration, metadata, and routing definitions                 |

### Key Components

**MDX Rendering**: The `mdx.tsx` component uses `fumadocs-mdx` to render markdown content with support for GitHub Flavored Markdown, custom callouts, code tabs, and embedded React components.

**API Reference Generation**: `fumadocs-openapi` automatically scans `openapi.yaml` and generates interactive documentation pages. The `openapi.config.ts` file controls how endpoints are organized, styled, and presented.

**Search Integration**: Full-text search powered by Fumadocs Search engine. Indexes all documentation pages on build time and provides instant results.

**Layout System**: The `layout/` components provide consistent header, sidebar, navigation, and footer across all pages while respecting Fumadocs conventions.

---

## 🛠️ Technology Stack

### Core Framework

- **Next.js 15+**: Latest App Router with React Server Components support
- **TypeScript 6**: Type-safe development across the entire codebase
- **React 19**: Modern component model with concurrent features

### Documentation & Content

- **Fumadocs Core**: Premium markdown-to-React documentation framework
- **Fumadocs UI**: Pre-built, accessible documentation components
- **Fumadocs OpenAPI**: Automatic API reference generation from specs
- **Fumadocs MDX**: MDX processor with extended markdown support
- **@types/mdx**: TypeScript support for MDX modules

### Styling & Theming

- **Tailwind CSS 4**: Utility-first CSS framework with advanced grouping syntax
- **next-themes**: Light/dark mode toggling with system preference detection
- **Lucide React**: Consistent icon library for UI elements

### Integration & Design System

- **@veriworkly/ui**: Shared component library with Tailwind theming
- **next/image**: Optimized image delivery and lazy loading
- **next/link**: Client-side prefetching and navigation

### Development Tools

- **ESLint 9**: Workspace-wide linting with shared configuration
- **Prettier**: Code formatting consistency
- **TypeScript**: Full type checking during builds

---

## 🚀 Development Setup

### Installation

```bash
# Install dependencies from workspace root
npm install

# Install docs-platform specific dependencies
npm install -w @veriworkly/docs-platform
```

### Running Locally

```bash
# Start development server (accessible at http://localhost:3001)
npm run dev -w @veriworkly/docs-platform

# Build for production
npm run build -w @veriworkly/docs-platform

# Start production server
npm start -w @veriworkly/docs-platform
```

### Code Quality

```bash
# Lint all files
npm run lint -w @veriworkly/docs-platform

# Format code
npm run format:write -w @veriworkly/docs-platform
```

---

## 📝 Content Management

### Adding Documentation Guides

1. **Create MDX file** in `content/docs/` with hierarchical folder structure:

   ```
   content/docs/
   ├── getting-started/
   │   ├── installation.mdx
   │   └── configuration.mdx
   ├── features/
   │   ├── resume-builder.mdx
   │   └── export.mdx
   └── deployment/
       └── production.mdx
   ```

2. **Add frontmatter** to each file:

   ```yaml
   ---
   title: "Your Guide Title"
   description: "Brief description for SEO and preview"
   ---
   ```

3. **Sidebar auto-updates** based on directory structure. Order using numeric prefixes or explicit configuration in `lib/source.ts`.

### Updating API Reference

1. **Modify specs** in `specs/` directory or `openapi.yaml`
2. **Rebuild documentation**:
   ```bash
   npm run dev -w @veriworkly/docs-platform
   ```
3. **Fumadocs automatically** regenerates API reference pages and search index

### MDX Features

- **GitHub Flavored Markdown**: Tables, strikethrough, task lists
- **Code Blocks**: Syntax highlighting, line highlighting, language detection
- **Callouts**: Info, warning, danger, success callout types
- **Tabs**: Organize content into tabbed sections
- **Custom Components**: Embed React components directly in markdown
- **Frontmatter**: SEO metadata, breadcrumbs, sidebar configuration

---

## 🔌 API Integration & OpenAPI

### Specification Structure

The OpenAPI specification is modular and organized by feature:

```
specs/
├── components/
│   ├── schemas.yaml       (Reusable data models)
│   ├── responses.yaml     (Standard response objects)
│   ├── parameters.yaml    (Common query/path parameters)
│   └── examples.yaml      (Request/response examples)
├── paths/
│   ├── auth.yaml          (Authentication endpoints)
│   ├── resumes.yaml       (Resume CRUD operations)
│   ├── exports.yaml       (Export/download endpoints)
│   └── profiles.yaml      (Profile management)
├── openapi.yaml           (Root specification)
└── [component].yaml       (Feature-specific specs)
```

### Configuration

The `openapi.config.ts` file controls how the API documentation is generated and displayed:

```typescript
// Controls OpenAPI parsing, component generation, and layout
export const openApiConfig = {
  // Your configuration here
};
```

### Auto-Generation

When content changes:

1. Fumadocs watches for changes to `specs/openapi.yaml`
2. `fumadocs-openapi` plugin scans and extracts all endpoints
3. Dynamic pages are generated at `app/api-reference/[...slug]/`
4. Search index is updated with new endpoint documentation

---

## 🎨 Styling & Theme Integration

### Tailwind CSS 4

The platform uses **Tailwind CSS 4** with advanced grouping features:

- Variables in `:root` for dynamic theming
- `group-*` selectors for nested component styling
- Arbitrary values for custom breakpoints and spacing

### Design System Integration

Uses `@veriworkly/ui` component library for:

- Consistent button, card, and form component styles
- Shared color palette and typography scale
- Icon components via Lucide React
- Accessibility utilities (ARIA labels, focus management)

### Theme Switching

- **Provider**: `next-themes` wraps the application at `layout.tsx`
- **Persistence**: Theme preference saved to localStorage
- **System Detection**: Respects user OS light/dark mode preference
- **Instant**: No flash of unstyled content (FOUC)

---

## 🚀 Deployment

### Production Build

```bash
npm run build -w @veriworkly/docs-platform
```

This generates:

- `.next/` directory with optimized server and client bundles
- Static pre-rendered pages for all documentation
- API routes ready for serverless deployment

### Hosting Options

- **Vercel** (Recommended): Auto-deploys on git push, optimal Next.js support
- **Docker**: See `Dockerfile` in root for containerized deployment
- **Self-Hosted**: Node.js 18+ with `npm start`

### Environment Configuration

The app uses Next.js `.env.local` for configuration:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

---

## 📊 Performance Optimizations

- **Static Generation**: Most pages are pre-rendered at build time
- **Incremental Static Generation**: New docs pages can be added without full rebuild
- **Code Splitting**: Route-based bundle splitting for faster page loads
- **Image Optimization**: Automatic WebP conversion and responsive sizing
- **Font Subsetting**: Only required font weights/languages loaded
- **CSS Purging**: Unused Tailwind styles removed in production

---

## 🔐 Security Considerations

- **Content Security Policy**: Configured via Next.js headers
- **XSS Protection**: MDX content is sanitized during build
- **No External Scripts**: All dependencies vendored
- **HTTPS Ready**: Works seamlessly with SSL certificates

---

## 📚 Documentation Standards

### Page Structure

- Clear, descriptive headings with proper hierarchy (H2 for sections, H3 for subsections)
- Brief overview paragraph before diving into details
- Code examples for every concept explained
- Links to related pages and external resources

### Code Examples

- Language-specific (TypeScript, JavaScript, Bash)
- Copy-paste ready without modifications
- Include expected output or behavior

### Accessibility

- Alt text for all images
- Semantic HTML structure
- Sufficient color contrast ratios
- Keyboard navigation support

---

## 🤝 Contributing

Contributions are welcome! To add documentation:

1. Fork the repository and create a feature branch
2. Add or modify MDX files in `content/docs/`
3. Test locally with `npm run dev -w @veriworkly/docs-platform`
4. Ensure code follows project standards (run `npm run lint` and `npm run format:write`)
5. Submit a pull request with a clear description

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is open source and available under the MIT License. See [LICENSE](../../LICENSE) for details.

---

## 🔗 Resources

- **Main Application**: https://veriworkly.com
- **Blog**: https://blog.veriworkly.com
- **API Specification**: See `/specs/openapi.yaml`
- **Design System**: See `/packages/ui`
- **Monorepo Structure**: See [PROJECT_ARCHITECTURE.md](../../PROJECT_ARCHITECTURE.md)


