Now I'll create a comprehensive, detailed README that merges all the information:

```markdown
<div align="center">
  <a href="https://veriworkly.com">
    <img src="apps/resume-builder/public/og/landing-page-og.png" alt="VeriWorkly Resume" />
  </a>

  <h1>VeriWorkly: The Complete Career Ecosystem</h1>

  <p><strong>A professional, privacy-first, and frictionless resume building platform.</strong></p>
  <p><strong>100% Open Source • Built for the Modern Career</strong></p>

  <p>
    <a href="https://veriworkly.com"><strong>Main App</strong></a>
    ·
    <a href="https://docs.veriworkly.com"><strong>Documentation</strong></a>
    ·
    <a href="https://blog.veriworkly.com"><strong>Blog</strong></a>
    ·
    <a href="https://veriworkly.com/roadmap"><strong>Roadmap</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/github/package-json/v/Gautam25Raj/veriworkly-resume?style=flat-square" alt="VeriWorkly Resume version">
    <img src="https://img.shields.io/github/stars/Gautam25Raj/veriworkly-resume?style=flat-square" alt="GitHub Stars">
    <img src="https://img.shields.io/github/license/Gautam25Raj/veriworkly-resume?style=flat-square" alt="License" />
  </p>
</div>

---

## 🌟 Executive Summary

VeriWorkly is a **high-performance, privacy-centric resume building ecosystem** that challenges the traditional SaaS resume builder model. Unlike competitors that require accounts and store sensitive career data on remote servers, VeriWorkly operates on a **Local-First principle**, combining a state-of-the-art Next.js frontend with a robust Node.js/Express backend to provide a seamless, secure, and professional experience.

The platform empowers users to:

- **Build & Edit** professional resumes in real-time with instant visual feedback
- **Export** in multiple formats (ATS-optimized PDF, editable DOCX) with pixel-perfect accuracy
- **Manage** their career data locally without surveillance or tracking
- **Sync** securely to the cloud when they choose to collaborate or access across devices
- **Integrate** with external tools through a fully documented OpenAPI specification

All while maintaining **100% open-source transparency** and enabling self-hosting for enterprises.

---

## 🏗️ Monorepo Architecture: npm workspaces

VeriWorkly is architected as a **scalable, decoupled monorepo** using **npm workspaces**, enabling independent development of frontend, backend, documentation, and blog platforms while maintaining a unified dependency management strategy and shared design system.

### 📂 Root Directory Organization
```

veriworkly-resume/
├── apps/ # Standalone applications
│ ├── resume-builder/ # Core Next.js editor (localhost:3000)
│ ├── server/ # Node.js/Express API (localhost:8080)
│ ├── docs-platform/ # Developer documentation (localhost:3001)
│ └── blog-platform/ # Company blog & updates (localhost:3002)
├── packages/ # Shared libraries & design system
│ └── ui/ # Centralized React component library
├── agents/ # AI agent context files
│ ├── claude/
│ ├── gemini/
│ ├── openai/
│ └── common/
├── scripts/ # Global automation (API generation, etc.)
├── package.json # Root workspace orchestration
├── compose.yaml # Docker Compose configuration
├── tsconfig.json # Shared TypeScript configuration
├── eslint.config.mjs # ESLint rules (v9+)
└── README.md # This file

````

### 📦 Workspace Management

The root `package.json` defines all workspaces and provides global scripts. Each application (`apps/*` and `packages/*`) is independently versioned and can have its own dependencies, though we maintain strict version alignment for critical packages.

**Key Commands:**
```bash
npm install                         # Install dependencies across all workspaces
npm install <pkg> -w @veriworkly/app-name  # Install specific package for an app
npm run dev                         # Start Resume Builder only
npm run dev:all                     # Start all applications in parallel
npm run build --workspaces          # Build all applications
npm run lint                        # Lint entire codebase
npm run format:write                # Format entire codebase with Prettier
````

---

## 📱 Applications Overview

### 1. Resume Builder (`apps/resume-builder`)

**The flagship product** — A high-performance Next.js 15+ application that delivers the core resume editing experience.

#### Core Responsibilities

- Real-time, lag-free resume editing with instant visual preview
- Multiple professionally-designed, ATS-optimized templates
- Export to PDF (via Playwright server-side rendering) and DOCX
- Local-first data persistence using Zustand with `localStorage` middleware
- User authentication and profile management
- Seamless sync and share capabilities with the backend

#### Technology Stack

| Component            | Technology                               |
| :------------------- | :--------------------------------------- |
| **Framework**        | Next.js 15+ (App Router)                 |
| **Runtime**          | Node.js 20+                              |
| **UI Library**       | React 19                                 |
| **Styling**          | Tailwind CSS 4 with `@theme` API         |
| **State Management** | Zustand (client-side)                    |
| **Form Handling**    | React Hook Form + Zod validation         |
| **Icons**            | Lucide React                             |
| **PDF Export**       | Playwright (headless browser on backend) |
| **DOCX Export**      | `docx` library (server-side generation)  |

#### Directory Structure

```
apps/resume-builder/
├── app/                           # Next.js App Router
│   ├── (main)/                   # Public-facing routes
│   │   ├── page.tsx              # Landing page
│   │   ├── editor/               # Resume editor
│   │   └── ...
│   ├── (private)/                # Authenticated routes
│   │   ├── dashboard/            # User dashboard
│   │   └── saved-resumes/        # Saved resume management
│   ├── api/                      # API routes & external integrations
│   ├── layout.tsx                # Root layout & providers
│   └── globals.css               # Global styles
├── components/                   # Global UI components
│   ├── layout/                   # Navigation, footers, modals
│   ├── common/                   # Reusable UI primitives
│   └── ...
├── features/                     # Business logic modules (encapsulated)
│   ├── resume-editor/            # Editor module with local state
│   ├── preview-panel/            # Live preview engine
│   ├── export/                   # Export logic & UI
│   ├── template-switcher/        # Template selection & switching
│   └── ...
├── hooks/                        # Custom React hooks
│   ├── useLocalStorage.ts        # localStorage persistence
│   ├── useResume.ts              # Resume data access
│   ├── useAuth.ts                # Authentication state
│   └── ...
├── lib/                          # External clients & utilities
│   ├── api-client.ts             # Backend API communication
│   ├── auth.ts                   # Auth provider initialization
│   ├── utils.ts                  # Helper functions
│   └── ...
├── store/                        # Zustand stores (global state)
│   ├── resume-store.ts           # Resume data with persistence
│   ├── ui-store.ts               # UI state (modal visibility, etc.)
│   ├── user-store.ts             # User profile & preferences
│   └── ...
├── templates/                    # Resume design templates
│   ├── modern/                   # Modern template component
│   ├── classic/                  # Classic template component
│   ├── minimal/                  # Minimal template component
│   └── ...
├── types/                        # TypeScript definitions
│   ├── resume.ts                 # Resume data structure
│   ├── user.ts                   # User profile types
│   └── ...
├── utils/                        # Pure utility functions
│   ├── formatting.ts             # Text formatting helpers
│   ├── validation.ts             # Data validation logic
│   └── ...
├── public/                       # Static assets
│   ├── og/                       # Open Graph images
│   ├── templates/                # Template preview images
│   └── ...
├── tests/                        # E2E tests with Playwright
├── playwright.config.ts          # Playwright configuration
├── vitest.config.ts              # Unit test configuration
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # App-specific dependencies
```

#### Key Features

- **Local-First Persistence**: Resume data automatically saved to browser's `localStorage` via Zustand middleware
- **Real-Time Preview**: See all changes reflected instantly in the selected template
- **Template Engine**: Switch between designs without losing data; all templates consume the same normalized `ResumeData` object
- **Export Pipeline**:
  - PDF: Streamed to backend Playwright service for precise rendering and ATS optimization
  - DOCX: Server-side generation using `docx` library for native Word compatibility
- **Responsive Design**: Mobile-friendly editor with collapsible sections
- **Accessibility**: WCAG 2.1 AA compliance using Radix UI primitives

---

### 2. Backend Server (`apps/server`)

**The API powerhouse** — A Node.js/Express service handling authentication, data synchronization, job management, and the public roadmap.

#### Core Responsibilities

- User authentication and session management (Better-Auth)
- Resume data persistence and synchronization
- PDF/DOCX export job processing (Playwright integration)
- Public roadmap and feature voting management
- Rate limiting and abuse prevention
- Email notifications and background tasks

#### Technology Stack

| Component               | Technology                                   |
| :---------------------- | :------------------------------------------- |
| **Runtime**             | Node.js 20+                                  |
| **Framework**           | Express (with middleware ecosystem)          |
| **ORM**                 | Prisma (PostgreSQL)                          |
| **Database**            | PostgreSQL (Managed via Neon or self-hosted) |
| **Caching & Queues**    | Redis + BullMQ                               |
| **Authentication**      | Better-Auth (Magic Link, Social OAuth, OTP)  |
| **Validation**          | Zod (end-to-end type safety)                 |
| **Testing**             | Vitest (unit & integration tests)            |
| **Browser Automation**  | Playwright (`@playwright/test`)              |
| **Document Generation** | `docx` library                               |
| **HTTP Security**       | Helmet, CORS middleware                      |

#### Directory Structure

```
apps/server/
├── src/                          # Main application code
│   ├── controllers/              # Request handlers
│   │   ├── auth.controller.ts    # Authentication endpoints
│   │   ├── resume.controller.ts  # Resume CRUD operations
│   │   ├── export.controller.ts  # PDF/DOCX export handlers
│   │   ├── jobs.controller.ts    # Job board endpoints
│   │   └── ...
│   ├── services/                 # Business logic (decoupled from HTTP)
│   │   ├── auth.service.ts
│   │   ├── resume.service.ts
│   │   ├── export.service.ts     # Playwright PDF generation logic
│   │   ├── email.service.ts      # Email notifications
│   │   └── ...
│   ├── routes/                   # API route definitions
│   │   ├── auth.routes.ts
│   │   ├── resume.routes.ts
│   │   ├── export.routes.ts
│   │   └── index.ts
│   ├── middleware/               # Request lifecycle middleware
│   │   ├── auth.middleware.ts    # JWT verification
│   │   ├── rate-limit.middleware.ts  # Redis-backed rate limiting
│   │   ├── error.middleware.ts   # Centralized error handling
│   │   ├── logging.middleware.ts # Request logging
│   │   └── ...
│   ├── db/                       # Database access
│   │   ├── client.ts             # Prisma client initialization
│   │   └── utils.ts              # Database utilities
│   ├── jobs/                     # Background job workers
│   │   ├── export-queue.ts       # PDF/DOCX export worker
│   │   ├── email-queue.ts        # Email sending worker
│   │   └── ...
│   └── index.ts                  # Express app initialization
├── prisma/                       # Database schema & migrations
│   ├── schema.prisma             # Source of truth for database structure
│   ├── migrations/               # Generated migration files
│   └── seed.ts                   # Database seeding script
├── tests/                        # Test suite
│   ├── unit/                     # Unit tests for services
│   ├── integration/              # Integration tests for API endpoints
│   └── fixtures/                 # Test data & mocks
├── vitest.config.ts              # Vitest configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Backend dependencies
└── README.md                     # Backend-specific documentation
```

#### Key Features

- **Better-Auth Integration**: Secure, passwordless authentication with Magic Links, Google OAuth, GitHub OAuth, and OTP
- **Prisma ORM**: Type-safe database queries with automatic migrations
- **Redis Caching**: Session management and frequently accessed data caching
- **BullMQ Job Queue**: Asynchronous processing for long-running tasks (PDF export, email)
- **Rate Limiting**: Sliding window algorithm via Redis to prevent abuse
- **OpenAPI Specification**: Fully documented API for developer integration
- **Zod Validation**: End-to-end type safety for all request/response payloads

---

### 3. Documentation Platform (`apps/docs-platform`)

**The knowledge hub** — A Fumadocs-powered documentation site with interactive API explorer.

#### Core Responsibilities

- Developer guides and getting started documentation
- Interactive OpenAPI API reference with request/response examples
- FAQ and troubleshooting sections
- Architecture deep-dives and best practices

#### Technology Stack

- Framework: Fumadocs (Next.js-based)
- Content: MDX with syntax highlighting
- API Docs: Generated from OpenAPI specification
- Styling: Tailwind CSS 4

#### Directory Structure

```
apps/docs-platform/
├── app/                          # Next.js routes
│   ├── docs/                     # Documentation pages
│   ├── api-reference/            # OpenAPI explorer
│   ├── layout.tsx                # Main layout
│   └── ...
├── content/                      # MDX documentation content
│   ├── docs/                     # User guides, tutorials
│   └── api-reference/            # Auto-generated from OpenAPI
├── public/                       # Static files
│   ├── openapi.json              # Generated OpenAPI specification
│   └── ...
├── specs/                        # OpenAPI specification files
│   ├── components/               # Reusable OpenAPI schemas
│   ├── paths/                    # API endpoint definitions
│   └── openapi.yaml              # Compiled specification
└── config/                       # Fumadocs configuration
```

---

### 4. Blog Platform (`apps/blog-platform`)

**The story platform** — A Fumadocs-powered blog for product updates and career insights.

#### Core Responsibilities

- Company announcements and product releases
- Career advice and industry insights
- Case studies and user success stories

#### Technology Stack

- Framework: Fumadocs / Next.js
- Content: MDX files for high performance and SEO
- Styling: Tailwind CSS 4

#### Directory Structure

```
apps/blog-platform/
├── app/                          # Next.js routes
│   ├── page.tsx                  # Blog home
│   ├── [slug]/                   # Individual post pages
│   └── ...
├── content/                      # MDX blog posts
│   └── blog/
├── components/                   # Blog-specific components
└── config/                       # Site configuration
```

---

## 📦 Shared UI Package (`packages/ui`)

**The design system** — A centralized, accessible React component library ensuring 100% visual consistency across all platforms.

### Purpose & Design Philosophy

Instead of duplicating components across Resume Builder, Docs, and Blog, we maintain a single source of truth in `packages/ui`. This approach ensures:

- Consistent branding and user experience
- Reduced maintenance burden
- Unified accessibility standards
- Faster development cycles

### Components Library

```
packages/ui/
├── src/
│   ├── components/               # Reusable React components
│   │   ├── button/
│   │   ├── card/
│   │   ├── modal/
│   │   ├── form/
│   │   ├── input/
│   │   ├── select/
│   │   ├── tabs/
│   │   └── ...
│   ├── hooks/                    # Shared custom hooks
│   ├── styles/                   # CSS modules & global styles
│   │   ├── themes.css            # CSS variables for theming
│   │   ├── globals.css           # Global resets
│   │   └── ...
│   └── index.ts                  # Barrel export
├── package.json                  # Published as scoped package
└── README.md                     # Component documentation
```

### Standards

- **Accessibility**: Radix UI primitives as base for A11y compliance
- **Styling**: Tailwind CSS 4 with custom theme tokens
- **TypeScript**: Strict mode, fully typed components
- **Documentation**: Storybook integration for component exploration

---

## 🛠️ Complete Tech Stack

### Frontend Stack

| Layer                | Technology               | Purpose                                       |
| :------------------- | :----------------------- | :-------------------------------------------- |
| **Framework**        | Next.js 15+ (App Router) | React meta-framework with SSR, static export  |
| **UI Library**       | React 19                 | Modern component architecture                 |
| **Styling**          | Tailwind CSS 4           | Utility-first CSS framework with `@theme` API |
| **Design System**    | Radix UI                 | Unstyled, accessible components               |
| **State Management** | Zustand                  | Lightweight, flexible store with middleware   |
| **Forms**            | React Hook Form          | Performant form handling                      |
| **Validation**       | Zod                      | TypeScript-first schema validation            |
| **Icons**            | Lucide React             | Consistent icon library                       |
| **Markdown**         | MDX                      | JSX in Markdown for docs/blog                 |

### Backend Stack

| Layer                   | Technology          | Purpose                                    |
| :---------------------- | :------------------ | :----------------------------------------- |
| **Runtime**             | Node.js 20+         | JavaScript/TypeScript on the backend       |
| **Framework**           | Express             | Minimal, flexible HTTP server              |
| **Language**            | TypeScript (Strict) | Type safety across the backend             |
| **Database**            | PostgreSQL          | Reliable, feature-rich relational database |
| **ORM**                 | Prisma              | Type-safe database access with migrations  |
| **Cache/Queue**         | Redis + BullMQ      | Session storage, rate limiting, job queues |
| **Authentication**      | Better-Auth         | Modern, secure passwordless auth           |
| **PDF Generation**      | Playwright          | Server-side headless browser rendering     |
| **Document Generation** | `docx`              | Native Word document generation            |
| **Validation**          | Zod                 | Schema validation for API payloads         |
| **Testing**             | Vitest              | Fast unit & integration testing            |
| **Security**            | Helmet              | HTTP security headers                      |

### DevOps & Deployment

| Component            | Technology              | Purpose                                     |
| :------------------- | :---------------------- | :------------------------------------------ |
| **Containerization** | Docker + Docker Compose | Standardized deployment across environments |
| **Linting**          | ESLint 9+               | Code quality and consistency                |
| **Formatting**       | Prettier                | Code formatting standard                    |
| **Package Manager**  | npm (workspaces)        | Monorepo dependency management              |
| **TypeScript**       | v6+                     | Static type checking                        |

---

## ✨ Core Features & Capabilities

### 🎯 Resume Editor

- **WYSIWYG Editing**: Real-time, lag-free editing with instant visual feedback
- **Multiple Templates**: 5+ professionally-designed, ATS-optimized templates
- **Sections Management**: Standard (Contact, Summary, Experience, Education, Skills, Projects) and custom sections
- **Rich Text Support**: Bold, italic, links, and formatting within text fields
- **Auto-Save**: Automatic persistence to browser localStorage

### 📤 Export & Download

- **PDF Export**: Pixel-perfect rendering via Playwright headless browser; ATS-optimized for parsing
- **DOCX Export**: Native, editable Word documents via `docx` library
- **Format Preservation**: Colors, fonts, and layout perfectly preserved across all formats
- **Multiple Downloads**: Export same resume in different formats without re-editing

### ☁️ Cloud Sync & Sharing

- **Optional Sync**: Users choose when and if to sync data to the cloud
- **Cross-Device Access**: Seamless resume access from multiple devices
- **Share Links**: Generate shareable, view-only links for potential employers
- **Collaboration**: Future support for real-time collaborative editing

### 🔐 Privacy & Security

- **Local-First Architecture**: 90% of resume data lives in the browser by default
- **Zero Tracking**: No invasive analytics or tracking pixels
- **End-to-End Privacy**: No resume content visible to third parties unless explicitly shared
- **Secure Authentication**: Passwordless login via Magic Links or OAuth
- **Data Encryption**: All data in transit encrypted via HTTPS; at-rest encryption via database

### 👤 User Management

- **Passwordless Login**: Magic link authentication for frictionless access
- **Social OAuth**: Google and GitHub login integration
- **OTP Support**: One-time password for high-security scenarios
- **Profile Management**: User preferences, saved templates, and sync history
- **Multi-Resume**: Create and manage multiple resumes

### 📊 Public Roadmap

- **Feature Voting**: Users vote on proposed features
- **Transparency**: See planned development in real-time
- **Community Input**: User feedback directly shapes the product

---

## 🏛️ Local-First & Privacy Philosophy

### The Problem We Solve

Traditional resume builders lock users into:

- Account creation requirements
- Data stored on remote servers indefinitely
- Potential data breaches exposing sensitive career information
- Vendor lock-in and migration friction

### Our Solution: Local-First Architecture

VeriWorkly inverts the traditional SaaS model:

1. **Primary Storage**: User's browser (localStorage/IndexedDB)
2. **Sync Layer**: Optional cloud sync for cross-device access
3. **Sharing**: Users explicitly choose what to share and with whom
4. **Data Ownership**: Users always own their data; they can export or delete anytime

### Implementation Details

```typescript
// Example: Zustand store with localStorage persistence
const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: initialResume,
      updateResume: (data) => set({ resume: data }),
    }),
    {
      name: "resume-storage", // localStorage key
      version: 1,
    },
  ),
);
```

This middleware automatically:

- Saves resume state to `localStorage` on every edit
- Rehydrates from storage on app load
- Handles versioning and migrations
- Enables offline-first workflows

### Privacy Guarantees

✅ **No Resume Content** is transmitted to our servers unless the user initiates sync
✅ **No Tracking** of resume content, templates used, or editing patterns
✅ **No Third-Party Sharing** of career data
✅ **Full Transparency** — Open-source code, anyone can audit
✅ **User Control** — Users can delete all data at any time

---

## 🖨️ Playwright PDF Generation Architecture

VeriWorkly's PDF export pipeline guarantees **pixel-perfect accuracy** and **ATS compatibility** through a sophisticated server-side rendering system.

### The Challenge

Client-side PDF libraries (html2pdf, jsPDF, etc.) have significant limitations:

- Font rendering inconsistencies across browsers
- Layout shifts between preview and PDF
- Complex CSS handling (gradients, shadows, custom fonts)
- No semantic text layer for ATS parsing
- Performance issues with large documents

### Our Solution: Playwright Headless Browser

#### High-Level Flow

```
User clicks "Export PDF"
    ↓
Frontend sends resume JSON to backend
    ↓
Backend validates and prepares HTML template
    ↓
Playwright launches headless Chromium instance
    ↓
Loads HTML + CSS into browser context
    ↓
Waits for all fonts and resources to load
    ↓
Renders to PDF with exact print styling
    ↓
Streams PDF to user's download
```

#### Backend Implementation

**Export Service (`src/services/export.service.ts`):**

```typescript
export async function generatePDF(resumeData: ResumeData): Promise<Buffer> {
  // 1. Validate resume data against schema
  const validated = resumeSchema.parse(resumeData);

  // 2. Generate HTML from template + data
  const html = renderTemplateToHTML(validated);

  // 3. Launch Playwright browser
  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-dev-shm-usage"], // Important for production
  });

  const page = await browser.newPage();

  // 4. Set viewport to match print dimensions
  await page.setViewportSize({ width: 1200, height: 1600 });

  // 5. Load HTML content
  await page.setContent(html, { waitUntil: "networkidle" });

  // 6. Wait for fonts to load (critical for accuracy)
  await page.waitForLoadState("networkidle");

  // 7. Render to PDF with print settings
  const pdf = await page.pdf({
    format: "A4",
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    printBackground: true,
  });

  await browser.close();
  return pdf;
}
```

#### Key Advantages

✅ **Perfect Accuracy**: Exact visual match to browser preview
✅ **Font Handling**: All fonts render identically to editor
✅ **Complex Layouts**: CSS gradients, shadows, and transforms preserved
✅ **ATS Compatibility**: Semantic HTML produces proper text layers
✅ **Performance**: BullMQ queue prevents blocking; long-running tasks processed asynchronously

#### Async Processing with BullMQ

For production scalability, export requests are queued:

```typescript
// Controller: Accept export request and queue it
app.post("/api/v1/export/pdf", authenticate, async (req, res) => {
  const { resumeId } = req.body;

  // Queue the job
  const job = await exportQueue.add("generate-pdf", {
    resumeId,
    userId: req.user.id,
  });

  // Return job ID immediately
  res.json({ jobId: job.id, status: "queued" });
});

// Worker: Process queued export jobs
exportQueue.process(async (job) => {
  const { resumeId, userId } = job.data;
  const resume = await getResume(resumeId, userId);
  const pdf = await generatePDF(resume);

  // Store PDF or stream to S3
  await storePDF(resumeId, pdf);

  return { pdfPath, size: pdf.length };
});

// Frontend: Poll for job completion
async function waitForPDF(jobId: string) {
  let attempts = 0;
  while (attempts < 30) {
    const { status, result } = await api.get(`/api/v1/export/status/${jobId}`);

    if (status === "completed") return result.pdfPath;
    if (status === "failed") throw new Error(result.error);

    await sleep(1000);
    attempts++;
  }
}
```

#### Performance Optimization

- **Connection Pooling**: Reuse Playwright instances across requests
- **Resource Limits**: Cap concurrent exports to prevent resource exhaustion
- **Timeout Handling**: Kill stuck jobs after 30 seconds
- **Error Recovery**: Automatic retry on transient failures
- **Caching**: Cache rendered PDFs for identical resume versions

---

## 🚀 Development Workflows

### Local Development (No Docker)

**Prerequisites:**

- Node.js 20+ (LTS recommended)
- npm 10+
- PostgreSQL database (local or managed)
- Redis server (local or managed)

**Setup:**

```bash
# 1. Clone repository
git clone https://github.com/Gautam25Raj/veriworkly-resume.git
cd veriworkly-resume

# 2. Install all dependencies
npm install

# 3. Setup environment files
cp .env.example .env
cp apps/server/.env.example apps/server/.env

# 4. Configure .env
# NEXT_PUBLIC_BACKEND_URL=http://localhost:8080/api/v1

# 5. Configure apps/server/.env
# DATABASE_URL=postgresql://user:password@localhost:5432/veriworkly
# REDIS_URL=redis://localhost:6379
# AUTH_SECRET=$(openssl rand -base64 32)
# JWT_SECRET=$(openssl rand -base64 32)

# 6. Setup database
npm run db:push -w @veriworkly/server

# 7. Start all services
npm run dev:all
```

**Running Individual Services:**

```bash
npm run dev                        # Resume Builder (localhost:3000)
npm run dev:server                 # Backend API (localhost:8080)
npm run dev:docs                   # Docs Platform (localhost:3001)
npm run dev:blog                   # Blog Platform (localhost:3002)
```

**Development Commands:**

```bash
npm run build                      # Build all applications
npm run lint                       # Lint entire codebase
npm run format:write               # Format code with Prettier
npm test -w @veriworkly/server     # Run backend tests
npm run test:contracts -w @veriworkly/resume-builder  # Run frontend tests
npm run db:studio -w @veriworkly/server  # Open Prisma Studio GUI
npm run generate:api               # Generate API documentation from OpenAPI spec
```

### Docker Deployment

**Architecture:**

```
Docker Compose Network
├── resume-builder (Next.js) → localhost:3000
├── server-api (Express) → localhost:8080
├── docs-platform (Next.js) → localhost:3001
├── blog-platform (Next.js) → localhost:3002
└── redis (Cache) → internal only
```

**Prerequisites:**

- Docker Engine 24+
- Docker Compose v2+
- PostgreSQL database (external managed service recommended)

**Setup:**

```bash
# 1. Configure environment
cp .env.docker.example .env.docker

# 2. Edit .env.docker with your values:
# DATABASE_URL=postgresql://...
# REDIS_URL=redis://redis:6379  (internal service name)
# NEXT_PUBLIC_BACKEND_URL=http://localhost:8080/api/v1

# 3. Build and start all services
docker compose --env-file .env.docker up -d --build

# 4. Check service health
docker compose ps
docker compose logs -f

# 5. Verify endpoints
curl http://localhost:3000              # Resume Builder
curl http://localhost:8080/api/v1/health  # API health
curl http://localhost:3001              # Docs
curl http://localhost:3002              # Blog
```

**Docker Compose Configuration (`compose.yaml`):**

```yaml
version: "3.9"
services:
  resume-builder:
    build:
      context: .
      dockerfile: apps/resume-builder/Dockerfile
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_BACKEND_URL: http://localhost:8080/api/v1
    depends_on:
      - server-api

  server-api:
    build:
      context: .
      dockerfile: apps/server/Dockerfile
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: redis://redis:6379
      AUTH_SECRET: ${AUTH_SECRET}
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  docs-platform:
    build:
      context: .
      dockerfile: apps/docs-platform/Dockerfile
    ports:
      - "3001:3001"

  blog-platform:
    build:
      context: .
      dockerfile: apps/blog-platform/Dockerfile
    ports:
      - "3002:3002"
```

**Common Operations:**

```bash
# View logs from specific service
docker compose logs -f server-api

# Run database migrations
docker compose exec server-api npm run db:migrate

# Access Prisma Studio
docker compose exec server-api npm run db:studio

# Rebuild specific service
docker compose build --no-cache server-api

# Stop all services
docker compose down

# Stop and remove all data
docker compose down -v
```

**Production Deployment Checklist:**

- [ ] Use managed PostgreSQL (Neon, AWS RDS, DigitalOcean)
- [ ] Use managed Redis (Upstash, AWS ElastiCache)
- [ ] Set strong `AUTH_SECRET` and `JWT_SECRET` with `openssl rand -base64 32`
- [ ] Configure reverse proxy (Nginx, Traefik) for SSL/TLS
- [ ] Set `ALLOWED_ORIGINS` to trusted domains only
- [ ] Enable database backups and point-in-time recovery
- [ ] Monitor application logs and error rates
- [ ] Set resource limits on containers (`memory: 512m`, `cpus: 0.5`)

---

## 🗄️ Database & Infrastructure

### PostgreSQL Schema (Prisma)

**Core Entities:**

```prisma
// User model with auth metadata
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  name            String?
  avatar          String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  resumes         Resume[]
  sessions        Session[]
}

// Resume document storage
model Resume {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  title           String
  data            Json      // Entire resume data as JSON
  template        String    @default("modern")
  isPublic        Boolean   @default(false)
  shareToken      String?   @unique // For public sharing
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  exports         Export[]
}

// Export history and artifacts
model Export {
  id              String    @id @default(cuid())
  resumeId        String
  resume          Resume    @relation(fields: [resumeId], references: [id], onDelete: Cascade)
  format          String    // "pdf" | "docx"
  filePath        String    // S3 or local storage path
  size            Int       // File size in bytes
  createdAt       DateTime  @default(now())
}

// Session management
model Session {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  token           String    @unique
  expiresAt       DateTime
  createdAt       DateTime  @default(now())
}
```

**Database Initialization:**

```bash
npm run db:push -w @veriworkly/server     # Push schema to DB
npm run db:seed -w @veriworkly/server     # Seed initial data
npm run db:migrate -w @veriworkly/server  # Run migrations (production)
```

### Redis Caching Strategy

**Use Cases:**

| Data                | TTL      | Purpose                          |
| :------------------ | :------- | :------------------------------- |
| Session tokens      | 30 days  | User authentication              |
| Rate limit counters | 1 hour   | API abuse prevention             |
| Roadmap cache       | 24 hours | Frequently accessed feature list |
| Export job results  | 7 days   | PDF download links               |

**Example:**

```typescript
// Rate limiting middleware
import { rateLimit } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "redis";

const redisClient = redis.createClient({ url: process.env.REDIS_URL });

const limiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: "rate-limit:",
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
});

app.use("/api/", limiter);
```

---

## 🔐 Authentication & Security

### Better-Auth Integration

**Supported Methods:**

1. **Magic Link**: Email-based passwordless authentication
2. **Google OAuth**: Seamless Google account login
3. **GitHub OAuth**: Developer-friendly GitHub authentication
4. **OTP**: One-Time Password for high-security scenarios

**Session Flow:**

```
User clicks "Login"
    ↓
Provides email
    ↓
Better-Auth sends Magic Link to email
    ↓
User clicks link
    ↓
Session token stored in database
    ↓
Session cookie set in browser
    ↓
Redirected to dashboard
```

### Security Headers

```typescript
import helmet from "helmet";

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // Adjust for your needs
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "https:"],
      },
    },
  }),
);
```

### API Validation

```typescript
import { z } from "zod";

const resumeSchema = z.object({
  title: z.string().min(1).max(100),
  contact: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
  experience: z.array(
    z.object({
      company: z.string(),
      position: z.string(),
      startDate: z.string().datetime(),
      endDate: z.string().datetime().optional(),
    }),
  ),
});

app.post("/api/v1/resume", authenticate, (req, res) => {
  const validated = resumeSchema.parse(req.body);
  // Process validated data
});
```

---

## 📊 Development Scripts & Commands

### Root Workspace Commands

```bash
# Installation & Setup
npm install                              # Install all dependencies

# Development
npm run dev                              # Start Resume Builder
npm run dev:all                          # Start all apps in parallel
npm run dev:server                       # Start only API server
npm run dev:docs                         # Start only docs
npm run dev:blog                         # Start only blog

# Building
npm run build                            # Build all apps
npm run build:resume                     # Build Resume Builder
npm run build:blog                       # Build Blog
npm run build:docs                       # Build Docs

# Code Quality
npm run lint                             # Lint all code
npm run format                           # Check formatting
npm run format:write                     # Fix formatting

# Database
npm run db:push -w @veriworkly/server    # Push schema
npm run db:migrate -w @veriworkly/server # Run migrations
npm run db:studio -w @veriworkly/server  # Open Prisma Studio
npm run db:seed -w @veriworkly/server    # Seed database

# Testing
npm test -w @veriworkly/server           # Backend tests
npm run test:contracts -w @veriworkly/resume-builder  # Frontend tests
npm run test:e2e -w @veriworkly/resume-builder  # E2E tests

# API & Documentation
npm run generate:api                     # Generate API docs from OpenAPI
```

---

## 📁 Complete Directory Reference

```
veriworkly-resume/                    # Root monorepo
├── apps/
│   ├── resume-builder/                # Next.js frontend editor
│   │   ├── app/                      # App Router pages & layouts
│   │   ├── components/               # Global UI components
│   │   ├── features/                 # Business logic modules
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── lib/                      # Utilities & external clients
│   │   ├── store/                    # Zustand state management
│   │   ├── templates/                # Resume design templates
│   │   ├── types/                    # TypeScript definitions
│   │   ├── utils/                    # Helper functions
│   │   ├── public/                   # Static assets
│   │   ├── tests/                    # Test files
│   │   ├── next.config.ts            # Next.js configuration
│   │   ├── tsconfig.json             # TypeScript config
│   │   ├── package.json              # Dependencies
│   │   └── README.md
│   ├── server/                        # Node.js/Express backend
│   │   ├── src/
│   │   │   ├── controllers/          # Request handlers
│   │   │   ├── services/             # Business logic
│   │   │   ├── routes/               # API endpoints
│   │   │   ├── middleware/           # Request lifecycle
│   │   │   ├── db/                   # Database clients
│   │   │   ├── jobs/                 # Background workers
│   │   │   └── index.ts              # App entry point
│   │   ├── prisma/                   # Database schema
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── tests/                    # Test files
│   │   ├── package.json
│   │   └── README.md
│   ├── docs-platform/                 # Fumadocs documentation
│   │   ├── app/                      # Doc pages
│   │   ├── content/                  # MDX documentation
│   │   ├── specs/                    # OpenAPI specifications
│   │   └── package.json
│   └── blog-platform/                 # Fumadocs blog
│       ├── app/                      # Blog pages
│       ├── content/                  # MDX blog posts
│       └── package.json
├── packages/
│   └── ui/                           # Shared component library
│       ├── src/
│       │   ├── components/           # React components
│       │   ├── hooks/                # Custom hooks
│       │   ├── styles/               # CSS & themes
│       │   └── index.ts              # Exports
│       └── package.json
├── agents/                           # AI agent context
│   ├── claude/
│   ├── gemini/
│   ├── openai/
│   └── common/
├── scripts/                          # Global automation
│   ├── generate-api.mjs              # API generation script
│   └── ...
├── package.json                      # Root workspace config
├── compose.yaml                      # Docker Compose setup
├── tsconfig.json                     # Shared TypeScript config
├── eslint.config.mjs                 # ESLint configuration
├── README.md                         # Main documentation
├── PROJECT_DETAILS.md                # Detailed project info
├── PROJECT_ARCHITECTURE.md           # Architecture documentation
├── ENV_SETUP.md                      # Environment configuration
├── README.Local.md                   # Local development guide
├── README.Docker.md                  # Docker deployment guide
├── QUICK_START.md                    # Quick setup guide
├── CONTRIBUTING.md                   # Contribution guidelines
├── SECURITY.md                       # Security policy
├── CODE_OF_CONDUCT.md                # Community guidelines
├── LICENSE                           # MIT License
└── SUPPORT.md                        # Support resources
```

---

## 🤝 Contributing & Community

### Ways to Contribute

1. **Code**: Submit bug fixes, features, or performance improvements
2. **Design**: Contribute new resume templates
3. **Documentation**: Improve guides, add examples, fix typos
4. **Translation**: Help localize content to other languages
5. **Feedback**: Report bugs, suggest features on the roadmap
6. **Sponsorship**: Support the project financially

### Development Standards

- **TypeScript**: Strict mode required; no `any` types
- **Testing**: Unit and E2E tests for new features
- **Code Style**: ESLint + Prettier enforce consistency
- **Documentation**: Update relevant docs with changes
- **Commits**: Descriptive, atomic commits with clear messages

### Quick Contribution Steps

```bash
# 1. Fork the repository
git clone https://github.com/YOUR_USERNAME/veriworkly-resume.git
cd veriworkly-resume

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes and test
npm run lint
npm run format:write
npm test

# 4. Push and create PR
git push origin feature/your-feature-name

# 5. Create Pull Request on GitHub
# Include description, testing notes, and related issues
```

### Reporting Issues

- Use GitHub Issues for bug reports and features
- Include reproduction steps, expected vs actual behavior
- Provide environment details (Node version, OS, etc.)
- Search existing issues to avoid duplicates

### Community Resources

- 📖 [Documentation](https://docs.veriworkly.com)
- 🐛 [Issue Tracker](https://github.com/Gautam25Raj/veriworkly-resume/issues)
- 💬 [Discussions](https://github.com/Gautam25Raj/veriworkly-resume/discussions)
- 📝 [Blog](https://blog.veriworkly.com)

---

## 📞 Support & Resources

- **Main Website**: [veriworkly.com](https://veriworkly.com)
- **Documentation**: [docs.veriworkly.com](https://docs.veriworkly.com)
- **Blog**: [blog.veriworkly.com](https://blog.veriworkly.com)
- **Roadmap**: [veriworkly.com/roadmap](https://veriworkly.com/roadmap)
- **GitHub**: [github.com/Gautam25Raj/veriworkly-resume](https://github.com/Gautam25Raj/veriworkly-resume)
- **Issues**: Report bugs and request features via GitHub Issues

### Support Channels

- 🐛 **Bug Reports**: GitHub Issues
- 💡 **Feature Requests**: GitHub Discussions or Roadmap
- ❓ **Questions**: GitHub Discussions or Documentation
- 🔒 **Security**: See [SECURITY.md](SECURITY.md)

---

## 🔒 Security & Privacy

### Data Protection

- **Local-First**: Resume data stored locally in browser by default
- **Encryption**: All data encrypted in transit (HTTPS) and at rest (database)
- **No Tracking**: Zero analytics or tracking of user behavior
- **Open Source**: Code transparency enables community security audits

### Reporting Vulnerabilities

Please do NOT open GitHub issues for security vulnerabilities. Instead, email security@veriworkly.com with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment

For complete security policy, see [SECURITY.md](SECURITY.md)

---

## 📝 License & Attribution

VeriWorkly is released under the **MIT License**. See [LICENSE](LICENSE) file for full details.

### What MIT License Means

✅ **Use**: Free to use in personal and commercial projects
✅ **Modify**: Free to modify and adapt the code
✅ **Distribute**: Free to distribute modified or original code
⚠️ **Include**: Must include license and copyright notice
❌ **Liability**: Software provided "as-is" with no warranty

---

## 🚀 Roadmap & Vision

### Current Phase (2026)

- ✅ Core resume editor and export functionality
- ✅ Local-first architecture with optional sync
- ✅ Multi-format export (PDF, DOCX)
- 🚀 AI-powered resume suggestions
- 🚀 Collaborative editing features
- 🚀 Advanced analytics (privacy-preserving)

### Future (2026+)

- Interview preparation features
- Skill matching with job postings
- Custom domain resume pages
- Resume version control and history
- Integration with LinkedIn and ATS platforms

---

## ❤️ Built With Love

VeriWorkly is built by a community of developers passionate about simplifying career building and protecting user privacy. Every line of code reflects our commitment to transparency, security, and user empowerment.

**Made with ❤️ by [VeriWorkly Team](https://veriworkly.com) and [Contributors](https://github.com/Gautam25Raj/veriworkly-resume/graphs/contributors)**

---

**Last Updated**: April 2026 | **Version**: 1.12.0 | **License**: MIT

```

```
