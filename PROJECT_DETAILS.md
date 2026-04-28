```markdown
# 🏢 VeriWorkly: Comprehensive Technical Project Details

**Last Updated:** April 28, 2026  
**Version:** 2.0  
**Audience:** Full-Stack Engineers, DevOps, Architects

This document serves as the authoritative engineering reference for VeriWorkly—a privacy-centric, local-first resume building ecosystem. It provides complete technical specifications, architectural patterns, system design decisions, and implementation details for all four applications and supporting infrastructure.

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Monorepo Architecture](#monorepo-architecture)
3. [Application Ecosystem](#application-ecosystem)
4. [State Management Strategy](#state-management-strategy)
5. [Database Architecture](#database-architecture)
6. [Authentication System](#authentication-system)
7. [PDF Export Pipeline](#pdf-export-pipeline)
8. [API Specification](#api-specification)
9. [Development Workflow](#development-workflow)
10. [Deployment & Infrastructure](#deployment--infrastructure)
11. [Security Model](#security-model)
12. [Performance & Optimization](#performance--optimization)
13. [Monitoring & Logging](#monitoring--logging)
14. [Troubleshooting & Common Gotchas](#troubleshooting--common-gotchas)

---

## Executive Summary

VeriWorkly is a sophisticated monorepo-based resume building platform designed with a **local-first** architecture. The system prioritizes user privacy by keeping 90% of data in the browser, with optional cloud synchronization for backup and multi-device access.

### Core Philosophy

- **Privacy-First**: No tracking, no third-party analytics, user data remains local by default
- **Offline-Capable**: Core functionality operates without internet after initial load
- **Type-Safe**: Full TypeScript implementation across frontend and backend
- **Scalable**: Designed for 100k+ concurrent users with horizontal scaling
- **Accessible**: WCAG 2.1 AA compliance across all UI components

### Technology Stack at a Glance

| Layer              | Technology           | Version |
| :----------------- | :------------------- | :------ |
| Frontend Framework | Next.js (App Router) | 16.2+   |
| Frontend Styling   | Tailwind CSS         | 4.0+    |
| State Management   | Zustand              | 5.0+    |
| Frontend Runtime   | React                | 19.2+   |
| Backend Runtime    | Node.js              | 18+     |
| Backend Framework  | Express.js           | 4.19+   |
| Database           | PostgreSQL (Neon)    | 14+     |
| ORM                | Prisma               | 7.8+    |
| Auth Framework     | Better-Auth          | 1.6+    |
| PDF Generation     | Playwright           | 1.59+   |
| Job Queue          | BullMQ               | 5.76+   |
| Caching            | Redis                | 7.0+    |

---

## Monorepo Architecture

### Structure Overview

VeriWorkly uses **npm workspaces** for monorepo management. This approach provides:

- **Single Dependency Tree**: All packages share a unified `node_modules`
- **Consistent Versioning**: Shared tooling versions enforced across all apps
- **DRY Principles**: Common utilities, types, and components in `packages/ui`
- **Atomic Commits**: Related changes across multiple apps in one git commit

### Directory Layout
```

veriworkly-resume/
├── apps/
│ ├── resume-builder/ # Core Next.js application (frontend)
│ ├── server/ # Node.js/Express API backend
│ ├── docs-platform/ # Documentation hub (Fumadocs)
│ └── blog-platform/ # Content/marketing site (Fumadocs)
├── packages/
│ └── ui/ # Shared design system & components
├── agents/ # AI context for different LLMs
│ ├── claude/
│ ├── gemini/
│ └── openai/
├── scripts/ # Monorepo automation scripts
├── package.json # Workspace orchestration
├── tsconfig.json # Shared TypeScript config
├── eslint.config.mjs # Global linting rules
└── compose.yaml # Local dev infrastructure (Docker)

````

### Workspace Dependencies

The `package.json` at the root defines:

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
````

When installing a dependency for a specific app:

```bash
npm install --workspace=@veriworkly/resume-builder axios
npm install --workspace=@veriworkly/server prisma
```

---

## Application Ecosystem

### 1. Resume Builder (`apps/resume-builder`)

The flagship Next.js application providing the core resume building experience.

#### Technology Foundation

- **Framework**: Next.js 16+ with App Router
- **React Version**: 19+ (with latest hooks and concurrent rendering)
- **CSS**: Tailwind CSS 4.0 with CSS-in-JS via Tailwind Merge
- **Component Library**: Radix UI primitives + custom VeriWorkly components
- **Icons**: Lucide React for consistent iconography
- **Testing**: Vitest for unit testing, Playwright for visual/E2E testing

#### Directory Structure

```
apps/resume-builder/
├── app/
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing/home page
│   ├── manifest.json            # PWA manifest
│   ├── globals.css              # Global styles
│   ├── resume-fonts.ts          # Font loading system
│   ├── (auth)/                  # Authentication routes
│   │   ├── login/
│   │   └── callback/
│   └── (main)/                  # Protected routes with chrome
│       ├── layout.tsx           # Main layout wrapper
│       ├── dashboard/           # Resume list/management
│       ├── editor/              # Single resume editor
│       │   ├── [id]/           # Focused editing view
│       │   └── [id]/preview/   # Print preview
│       ├── settings/            # User preferences
│       ├── profile/             # User profile management
│       └── about/               # Static pages
├── components/
│   ├── ui/                      # Radix + custom UI components
│   ├── layout/                  # Header, sidebar, chrome
│   ├── resume/                  # Resume-specific components
│   │   ├── SectionRenderer.tsx
│   │   ├── ProjectItem.tsx
│   │   ├── ExperienceItem.tsx
│   │   └── ...
│   └── editor/                  # Editor-specific views
│       ├── EditorLayout.tsx
│       ├── ContentPanel.tsx
│       ├── SettingsPanel.tsx
│       └── Toolbar.tsx
├── features/resume/
│   ├── constants/
│   │   ├── default-resume.ts    # Template seed data
│   │   ├── resume-fonts.ts      # Font catalog
│   │   ├── sections.ts          # Section definitions
│   │   └── templates.ts         # Template metadata
│   ├── hooks/
│   │   ├── useResume.ts         # Store subscription hook
│   │   ├── useResumeLocalStorage.ts
│   │   ├── useDragReorder.ts    # Drag/drop logic
│   │   └── useExport.ts         # Export orchestration
│   ├── schemas/
│   │   ├── resume-storage-schema.ts  # Zod runtime validation
│   │   ├── master-profile-schema.ts  # Master profile types
│   │   └── validation-schemas.ts
│   ├── services/
│   │   ├── resume-service.ts    # Business logic layer
│   │   ├── export-service.ts    # Multi-format export
│   │   ├── storage/
│   │   │   ├── safe-local-storage.ts
│   │   │   └── indexeddb-storage.ts
│   │   └── sync-service.ts      # Cloud sync orchestration
│   ├── store/
│   │   ├── resume-store.ts      # Zustand main store
│   │   ├── editor-store.ts      # Editor UI state
│   │   └── export-store.ts      # Export queue state
│   ├── types/
│   │   └── resume.ts            # TypeScript interfaces
│   └── utils/
│       ├── validation.ts        # Field validators
│       ├── formatting.ts        # Display formatters
│       └── builders.ts          # Object constructors
├── hooks/
│   ├── useLocalStorage.ts       # Client-side persistence
│   ├── useTheme.ts              # Theme switching
│   └── useMediaQuery.ts         # Responsive utilities
├── lib/
│   ├── auth-client.ts           # Better-Auth client
│   ├── api-client.ts            # Server API calls
│   └── utils.ts                 # General utilities
├── providers/
│   ├── providers.tsx            # Root provider wrapper
│   ├── theme-provider.tsx       # next-themes
│   └── query-provider.tsx       # React Query (if used)
├── store/
│   └── zustand-store.ts         # Global app state
├── templates/
│   ├── index.ts                 # Template registry
│   ├── executive/
│   ├── modern/
│   ├── minimal/
│   └── ats-classic/
│       ├── components/
│       └── index.tsx            # Template renderer
├── styles/
│   ├── themes.css               # CSS variables & design tokens
│   ├── typography.css           # Font sizing system
│   ├── animations.css           # Transition definitions
│   └── resume-print.css         # Print-specific styles
├── types/
│   ├── resume.ts                # Resume domain types
│   ├── user.ts                  # User types
│   └── api.ts                   # API response types
├── utils/
│   ├── cn.ts                    # Utility classname merger
│   └── format.ts                # String formatting
├── public/
│   ├── fonts/                   # Local font files
│   ├── images/
│   └── og/                      # OG image templates
├── tests/
│   └── ...                      # Vitest files
├── vitest.config.ts             # Unit test config
├── playwright.config.ts         # Visual test config
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript config
├── package.json
└── README.md
```

#### Core Features

##### Resume Structure Model

```typescript
interface Resume {
  id: string; // UUID
  userId?: string; // Optional for cloud sync
  name: string; // User name
  email: string;
  phone?: string;
  location?: string;
  summary?: string;

  experience: Experience[]; // Work history
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages?: Language[];
  awards?: Award[];
  volunteer?: Volunteer[];
  references?: Reference[];

  // Customization
  template: "modern" | "minimal" | "executive" | "ats-classic";
  theme: {
    primaryColor: string; // Hex color
    fontFamily: string;
    fontSize: {
      body: number; // 10-14px
      heading: number; // 14-20px
    };
    bodyLineHeight: number; // 1.2-1.8
    headingLineHeight: number;
    sectionGap: number; // 12-24px in pixels
  };

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastExportedAt?: Date;
}
```

##### State Management with Zustand

The application uses **Zustand 5.0+** for global state management with persistence to `localStorage`.

**Store Definition** (`features/resume/store/resume-store.ts`):

```typescript
interface ResumeStore {
  resumes: Resume[];
  currentResume: Resume | null;
  isLoading: boolean;

  // Actions
  setCurrentResume: (resume: Resume) => void;
  updateCurrentResume: (partial: Partial<Resume>) => void;
  saveResume: () => Promise<void>;
  deleteResume: (id: string) => void;
  createResume: () => Promise<Resume>;

  // Persistence
  hydrate: () => void;
  persist: () => Promise<void>;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resumes: [],
      currentResume: null,
      isLoading: false,

      setCurrentResume: (resume) => set({ currentResume: resume }),

      updateCurrentResume: (partial) =>
        set((state) => ({
          currentResume: state.currentResume ? { ...state.currentResume, ...partial } : null,
        })),

      saveResume: async () => {
        const resume = get().currentResume;
        if (!resume) return;

        // Validation via Zod
        const validated = resumeStorageSchema.parse(resume);

        // Safe localStorage write with quota checking
        await safeLocalStorageWrite(
          `resume:${resume.id}`,
          validated,
          { debounce: 1000 }, // 1s debounce
        );
      },

      hydrate: () => {
        // Load persisted state from localStorage
        const stored = localStorage.getItem("resume-store");
        if (stored) {
          const parsed = JSON.parse(stored);
          set(parsed);
        }
      },
    }),
    {
      name: "resume-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        resumes: state.resumes,
        currentResume: state.currentResume,
      }),
    },
  ),
);
```

**Key Patterns**:

- **Persistence Plugin**: Automatically syncs state to `localStorage` on changes
- **Debounced Saves**: Heavy writes are throttled to prevent quota exhaustion
- **Hydration**: State reloaded on app mount from persisted storage
- **Quota Safety**: Custom storage wrapper detects `QuotaExceededError`

##### Local-First Synchronization

```typescript
// Storage Service Pattern
export class ResumeStorageService {
  private db: IDBDatabase;
  private writeQueue: PromiseQueue;

  async syncToCloud(resume: Resume, apiClient: ApiClient) {
    // Validate local copy first
    const validated = resumeStorageSchema.parse(resume);

    // Send to server with conflict resolution
    try {
      const response = await apiClient.post("/resumes", {
        ...validated,
        _clientTimestamp: Date.now(),
      });

      return response.data;
    } catch (error) {
      if (error.status === 409) {
        // Conflict: merge server changes
        return this.handleConflict(validated, error.data.server);
      }
      throw error;
    }
  }

  private handleConflict(local: Resume, server: Resume): Resume {
    // Last-write-wins for most fields
    // Custom merge for arrays (combine education, experience)
    return {
      ...server,
      experience: this.mergeArrays(local.experience, server.experience),
      education: this.mergeArrays(local.education, server.education),
      updatedAt: new Date(), // Timestamp local merge
    };
  }
}
```

##### Export System

The resume can be exported in **7 formats**: PDF, PNG, JPG, DOCX, HTML, Markdown, JSON, and plaintext.

**Export Flow**:

```
┌─────────────────────────────────────────────────────┐
│ User clicks "Download" → SelectFormatModal.tsx      │
└────────────────┬──────────────────────────────────┘
                 │ Selects format (PDF, PNG, DOCX, etc.)
                 ▼
┌─────────────────────────────────────────────────────┐
│ resume-service.ts:exportResume()                    │
│ - Generate resume HTML with styles                 │
│ - Queue export job to server if format needs       │
│   server processing (PDF, DOCX)                    │
└────────────────┬──────────────────────────────────┘
                 │
        ┌────────┴─────────┐
        │                  │
    (Client-Side)      (Server-Side)
        │                  │
        ▼                  ▼
   PNG/JPG via        PDF via
   html2canvas        Playwright
   Canvas             + BullMQ queue
        │                  │
        ▼                  ▼
   Blob URL           S3 Storage
   Download           + Polling
```

**Server-Side PDF Generation** (Playwright):

```typescript
// apps/server/src/services/export-service.ts
export class ExportService {
  private playwright: Browser;

  async generatePDF(
    resumeHTML: string,
    options: {
      format?: "A4" | "Letter";
      margin?: string;
    },
  ): Promise<Buffer> {
    const page = await this.playwright.newPage();

    try {
      // Set viewport for modern breakpoint (lg: 1024px)
      await page.setViewportSize({ width: 1024, height: 1280 });

      // Inject export-specific CSS overrides
      const htmlWithCSS = this.injectExportCSS(resumeHTML);

      await page.setContent(htmlWithCSS, {
        waitUntil: "networkidle2", // Wait for fonts
      });

      // Wait for render readiness
      await page.evaluate(() => {
        return new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
          });
        });
      });

      const pdf = await page.pdf({
        format: options.format || "A4",
        margin: {
          top: "0.5in",
          right: "0.5in",
          bottom: "0.5in",
          left: "0.5in",
        },
        printBackground: true,
        scale: 1.0,
      });

      return pdf;
    } finally {
      await page.close();
    }
  }

  private injectExportCSS(html: string): string {
    // Override responsive breakpoints for consistent PDF rendering
    const exportCSS = `
      <style>
        /* Force modern template to use 2-column in PDF */
        .modern-grid {
          grid-template-columns: 1.75fr 1fr !important;
        }
        
        /* Disable page breaks inside elements */
        section { page-break-inside: avoid; }
        
        /* Print-specific spacing */
        @media print {
          body { margin: 0; padding: 0; }
        }
      </style>
    `;

    return html.replace("</head>", `${exportCSS}</head>`);
  }
}
```

**Export Queue Management** (BullMQ):

```typescript
// Create queue in server initialization
const exportQueue = new Queue("resume-exports", {
  connection: redis,
});

// Worker processes export jobs
exportQueue.process(async (job) => {
  const { resumeId, format, userId } = job.data;

  const resume = await prisma.resume.findUnique({
    where: { id: resumeId, userId },
  });

  const html = buildResumeHTML(resume);
  let buffer: Buffer;

  switch (format) {
    case "pdf":
      buffer = await exportService.generatePDF(html);
      break;
    case "docx":
      buffer = await exportService.generateDOCX(html);
      break;
    // ... other formats
  }

  // Upload to S3
  const s3Key = `exports/${userId}/${resumeId}/${format}`;
  await s3Client.putObject({
    Bucket: process.env.S3_BUCKET,
    Key: s3Key,
    Body: buffer,
  });

  // Update export record
  await prisma.export.create({
    data: {
      resumeId,
      format,
      s3Key,
      status: "completed",
      createdAt: new Date(),
    },
  });

  return { s3Key, size: buffer.length };
});

// Handle job failures with retry
exportQueue.on("failed", (job, err) => {
  console.error(`Export job ${job.id} failed: ${err.message}`);
  // Automatic retry via BullMQ config
});
```

##### Templates System

Each template is a standalone component implementing a consistent interface:

```typescript
// Template Interface
interface ResumeTemplate {
  name: string;
  label: string;
  description: string;
  thumbnail?: string;

  // Render component
  Component: React.ComponentType<{
    resume: Resume;
    mode: "edit" | "preview" | "export";
  }>;

  // Export configuration
  exportConfig?: {
    breakpoint: "lg" | "md" | "sm";
    printCSS?: string;
    margins?: string;
  };
}

// Template registry
const TEMPLATES: Record<string, ResumeTemplate> = {
  modern: {
    name: "modern",
    label: "Modern",
    description: "Two-column layout with sidebar",
    Component: ModernTemplate,
    exportConfig: {
      breakpoint: "lg", // Enforce lg breakpoint in PDF
      printCSS: ".modern-grid { grid-template-columns: 1.75fr 1fr !important; }",
    },
  },
  minimal: {
    name: "minimal",
    label: "Minimal",
    description: "Clean, single-column design",
    Component: MinimalTemplate,
  },
  executive: {
    name: "executive",
    label: "Executive",
    Component: ExecutiveTemplate,
  },
  "ats-classic": {
    name: "ats-classic",
    label: "ATS Classic",
    description: "Optimized for Applicant Tracking Systems",
    Component: ATSClassicTemplate,
    exportConfig: {
      breakpoint: "md",
    },
  },
};
```

#### Font System

Fonts are loaded globally with a **dedicated system** to ensure consistency between screen rendering and PDF export:

```typescript
// app/resume-fonts.ts - Loaded in app/layout.tsx
import { IBM_Plex_Mono, Libre_Baskerville, Roboto } from 'next/font/google';

export const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-mono'
});

export const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif'
});

export const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sans'
});

// app/layout.tsx
export default function RootLayout() {
  return (
    <html className={`${ibmPlexMono.variable} ${libreBaskerville.variable} ${roboto.variable}`}>
      {/* ... */}
    </html>
  );
}

// Accessible via CSS variables
// components/resume/BaseShell.tsx
export function BaseShell() {
  return (
    <style>{`
      :root {
        --font-sans: var(${resumeFontVariable});
        --font-serif: var(--font-serif);
        --font-mono: var(--font-mono);
      }

      .resume-body {
        font-family: var(--font-sans);
        font-size: var(--body-size, 11px);
        line-height: var(--body-line-height, 1.5);
      }
    `}</style>
  );
}
```

**Critical Pattern**: All fonts must be loaded in `app/layout.tsx` BEFORE export rendering to prevent font mismatch between screen and PDF.

### 2. Backend Server (`apps/server`)

The centralized Node.js/Express API handling authentication, data persistence, and server-side processing.

#### Architecture Layers

```
┌────────────────────────────────────────────────────────┐
│ HTTP Request                                           │
└────────────────┬─────────────────────────────────────┘
                 │
        ┌────────▼────────┐
        │ Middleware      │
        │ - Helmet        │
        │ - CORS          │
        │ - Rate Limit    │
        │ - Error Handler │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ Routes Layer    │
        │ /api/*          │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ Controllers     │
        │ Request parsing │
        │ Validation      │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ Services        │
        │ Business logic  │
        │ DB operations   │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ Prisma Client   │
        │ ORM operations  │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ PostgreSQL      │
        │ (Neon)          │
        └─────────────────┘
```

#### Directory Structure

```
apps/server/
├── src/
│   ├── index.ts                 # Express app entry point
│   ├── config.ts                # Environment & configuration
│   ├── middleware/
│   │   ├── error-handler.ts     # Global error middleware
│   │   ├── cors-handler.ts
│   │   ├── rate-limiter.ts
│   │   ├── auth-middleware.ts
│   │   └── request-logger.ts
│   ├── routes/
│   │   ├── index.ts             # Route registration
│   │   ├── auth.ts              # /api/auth/*
│   │   ├── resumes.ts           # /api/resumes/*
│   │   ├── exports.ts           # /api/exports/*
│   │   ├── profile.ts           # /api/profile/*
│   │   └── health.ts            # /api/health (liveness)
│   ├── controllers/
│   │   ├── auth-controller.ts
│   │   ├── resume-controller.ts
│   │   ├── export-controller.ts
│   │   └── profile-controller.ts
│   ├── services/
│   │   ├── auth-service.ts
│   │   ├── resume-service.ts    # Resume CRUD + sync
│   │   ├── export-service.ts    # Playwright PDF generation
│   │   ├── storage-service.ts   # S3 operations
│   │   └── sync-service.ts      # Cloud sync orchestration
│   ├── validators/
│   │   ├── resume-validator.ts  # Zod schemas
│   │   └── common-validator.ts
│   ├── utils/
│   │   ├── jwt-utils.ts
│   │   ├── crypto-utils.ts
│   │   └── error-classes.ts
│   ├── jobs/
│   │   ├── export-queue.ts      # BullMQ worker
│   │   ├── sync-queue.ts
│   │   └── cleanup-queue.ts     # Periodic tasks
│   ├── types/
│   │   ├── express.d.ts         # Extended Express types
│   │   ├── resume.ts
│   │   └── api.ts
│   └── auth/
│       ├── better-auth.ts       # Better-Auth config
│       └── providers.ts         # OAuth providers
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── migrations/
│   │   ├── migration_lock.toml
│   │   └── 001_init/
│   └── seed.ts                  # Development data seeding
├── tests/
│   ├── unit/
│   └── integration/
├── Dockerfile                   # Container image
├── vitest.config.ts
├── tsconfig.json
├── package.json
├── README.md
└── QUICK_START.md
```

#### Express Application Setup

```typescript
// src/index.ts
import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { createBetterAuth } from "better-auth";

import { errorHandler } from "./middleware/error-handler";
import { corsHandler } from "./middleware/cors-handler";
import { authMiddleware } from "./middleware/auth-middleware";
import routes from "./routes";
import { config } from "./config";
import { initializeJobs } from "./jobs";

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));

// CORS with origin whitelist
app.use(
  cors({
    origin: config.ALLOWED_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === "/health", // Don't limit health checks
});
app.use(limiter);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: config.VERSION,
  });
});

// Routes
app.use("/api", routes);

// Error handling (MUST be last)
app.use(errorHandler);

// Initialize job queues
initializeJobs().catch(console.error);

// Start server
const PORT = config.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### Prisma Database Schema

```prisma
// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatar    String?

  // Better-Auth relations
  accounts  Account[]
  sessions  Session[]

  // Domain relations
  resumes   Resume[]
  exports   Export[]
  apiKeys   ApiKey[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Account {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  type          String
  provider      String
  providerAccountId String

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  expiresAt     DateTime
  token         String   @unique

  createdAt     DateTime @default(now())

  @@map("sessions")
}

model Resume {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  name          String
  email         String
  phone         String?
  location      String?
  summary       String?

  // Structured data (stored as JSONB in Postgres)
  experience    Json     @default("[]")  // Experience[]
  education     Json     @default("[]")  // Education[]
  skills        Json     @default("[]")  // Skill[]
  projects      Json     @default("[]")  // Project[]

  // Customization
  template      String   @default("modern")
  theme         Json     @default("{}")  // Theme configuration

  // Sync metadata
  clientTimestamp DateTime? // For conflict resolution
  syncedAt      DateTime?

  // Relations
  exports       Export[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([userId])
  @@index([createdAt])
  @@map("resumes")
}

model Export {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  resumeId      String
  resume        Resume   @relation(fields: [resumeId], references: [id], onDelete: Cascade)

  format        String   // 'pdf', 'png', 'docx', etc.
  status        String   @default("pending") // pending, processing, completed, failed
  ready         Boolean  @default(false)

  s3Key         String?  // S3 object key
  fileSize      Int?     // bytes

  expiresAt     DateTime? // For temporary exports

  error         String?  // Error message if failed

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([userId])
  @@index([resumeId])
  @@index([status])
  @@map("exports")
}

model ApiKey {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  name          String
  key           String   @unique
  lastUsedAt    DateTime?

  createdAt     DateTime @default(now())
  expiresAt     DateTime?

  @@map("api_keys")
}
```

#### Authentication with Better-Auth

```typescript
// src/auth/better-auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  emailVerification: {
    sendVerificationEmail: async (user, url) => {
      // Send via Nodemailer
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `Click <a href="${url}">here</a> to verify`,
      });
    },
  },

  callbacks: {
    async onSuccess({ user, session }) {
      console.log(`User ${user.id} logged in`);
      // Custom logic after successful auth
    },
  },
});
```

#### Resume Service (Business Logic)

```typescript
// src/services/resume-service.ts
import { prisma } from "../prisma";
import { Resume } from "@veriworkly/resume-builder";
import { resumeValidator } from "../validators/resume-validator";

export class ResumeService {
  async createResume(userId: string, data: Partial<Resume>) {
    // Validate input
    const validated = resumeValidator.create.parse(data);

    return prisma.resume.create({
      data: {
        userId,
        ...validated,
      },
    });
  }

  async updateResume(userId: string, resumeId: string, data: Partial<Resume>) {
    // Verify ownership
    const existing = await prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });

    if (!existing) {
      throw new NotFoundError(`Resume ${resumeId} not found`);
    }

    const validated = resumeValidator.update.parse(data);

    return prisma.resume.update({
      where: { id: resumeId },
      data: {
        ...validated,
        clientTimestamp: data.clientTimestamp ? new Date(data.clientTimestamp) : undefined,
        updatedAt: new Date(),
      },
    });
  }

  async syncResumes(userId: string, clientResumes: Resume[], clientTimestamp: number) {
    // Bi-directional sync with conflict resolution
    const serverResumes = await prisma.resume.findMany({
      where: { userId },
    });

    const merged: Resume[] = [];
    const conflicts: Array<{ local: Resume; server: Resume }> = [];

    // Check for conflicts
    for (const clientResume of clientResumes) {
      const serverResume = serverResumes.find((r) => r.id === clientResume.id);

      if (!serverResume) {
        // New resume, create it
        await this.createResume(userId, clientResume);
        merged.push(clientResume);
      } else if (new Date(serverResume.updatedAt) > new Date(clientResume.updatedAt)) {
        // Server is newer
        conflicts.push({ local: clientResume, server: serverResume as Resume });
      } else {
        // Client is newer, update server
        await this.updateResume(userId, clientResume.id, clientResume);
        merged.push(clientResume);
      }
    }

    // Return server state and conflicts
    return {
      merged: [
        ...merged,
        ...serverResumes.filter((sr) => !clientResumes.find((cr) => cr.id === sr.id)),
      ],
      conflicts,
    };
  }
}
```

#### Rate Limiting with Redis

```typescript
// src/middleware/rate-limiter.ts
import { createClient } from "redis";
import RedisStore from "rate-limit-redis";
import { rateLimit } from "express-rate-limit";

const redisClient = createClient({
  socket: { host: process.env.REDIS_HOST, port: parseInt(process.env.REDIS_PORT) },
});

export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: "rate-limit:",
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Per-user limiting for exports
export const exportLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: "export-limit:",
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 exports per hour
  keyGenerator: (req) => `${req.user.id}:exports`,
});
```

### 3. Documentation Platform (`apps/docs-platform`)

A developer-focused documentation site built with **Fumadocs**, providing comprehensive guides and API references.

#### Key Features

- **MDX Support**: Dynamic, interactive documentation
- **API Reference Generation**: Automatically builds from OpenAPI spec
- **Search**: Full-text search across docs
- **Multi-language Support**: i18n ready
- **Analytics**: Anonymous usage tracking (privacy-respecting)

#### Content Structure

```
apps/docs-platform/
├── content/
│   ├── docs/
│   │   ├── getting-started.mdx
│   │   ├── guides/
│   │   │   ├── local-first-architecture.mdx
│   │   │   ├── authentication.mdx
│   │   │   └── pdf-export.mdx
│   │   ├── api/
│   │   │   ├── overview.mdx
│   │   │   ├── authentication.mdx
│   │   │   └── endpoints.mdx
│   │   └── deployment/
│   │       └── docker-guide.mdx
│   └── api-reference/
│       └── [auto-generated from OpenAPI]
├── app/
│   ├── layout.tsx
│   └── docs/
│       ├── page.tsx
│       └── [slug]/
│           └── page.tsx
└── config/
    └── site.ts
```

#### OpenAPI Integration

The API reference is auto-generated from the OpenAPI spec:

```typescript
// openapi.config.ts
import { generateFiles } from "fumadocs-openapi";
import { readFileSync } from "fs";

export async function generateApiDocs() {
  const openapi = JSON.parse(readFileSync("./specs/openapi.yaml", "utf-8"));

  await generateFiles({
    input: [openapi],
    outputDir: "./content/api-reference",
    per: "tag",
    groupTag: true,
  });
}
```

### 4. Blog Platform (`apps/blog-platform`)

A content-driven site for product updates, use cases, and industry insights.

#### Structure

```
apps/blog-platform/
├── content/
│   └── blog/
│       ├── local-first-explained.mdx
│       ├── privacy-future-local-first-resume-builder.mdx
│       └── [more posts]
├── app/
│   ├── page.tsx              # Blog index
│   └── [slug]/
│       └── page.tsx          # Individual post
└── config/
    └── site.ts
```

#### Post Metadata

Each post includes frontmatter for metadata:

```yaml
---
title: "Local-First Architecture Explained"
description: "Why local-first matters for user privacy and offline capability"
date: 2026-04-15
author: "VeriWorkly Team"
tags: ["architecture", "privacy", "local-first"]
---
```

---

## State Management Strategy

### Zustand Configuration

VeriWorkly uses **Zustand 5.0+** as the primary state management library.

#### Core Stores

1. **Resume Store** (`resume-store.ts`)
   - Current resume data
   - List of user's resumes
   - Loading states
   - Persist to `localStorage`

2. **Editor Store** (`editor-store.ts`)
   - Active section (experience, education, etc.)
   - Edit mode vs. preview mode
   - Sidebar visibility
   - Form field focus

3. **Export Store** (`export-store.ts`)
   - Export queue status
   - Download progress
   - Format selection

4. **User Store** (`user-store.ts`)
   - Current user info
   - Auth status
   - Preferences (theme, etc.)

#### Persistence Strategy

```typescript
// Using Zustand persist middleware
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: "resume-store",
      storage: createJSONStorage(() => ({
        getItem: (key) => {
          // Quota-safe retrieval
          return localStorage.getItem(key);
        },
        setItem: (key, value) => {
          try {
            localStorage.setItem(key, JSON.stringify(value));
          } catch (e) {
            if (e.name === "QuotaExceededError") {
              console.warn("Storage quota exceeded, clearing old data");
              // Implement cleanup logic
            }
          }
        },
        removeItem: (key) => localStorage.removeItem(key),
      })),
    },
  ),
);
```

### Local Storage Quota Management

The application implements **quota-safe writes** to prevent crashes:

```typescript
// features/resume/services/storage/safe-local-storage.ts
export async function safeLocalStorageWrite(
  key: string,
  value: any,
  options: { debounce?: number } = {},
) {
  return new Promise((resolve, reject) => {
    const write = () => {
      try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
        resolve(true);
      } catch (error) {
        if (error.name === "QuotaExceededError") {
          // Try to free space by removing old exports
          removeOldExports();
          try {
            localStorage.setItem(key, serialized);
            resolve(true);
          } catch (retryError) {
            reject(retryError);
          }
        } else {
          reject(error);
        }
      }
    };

    if (options.debounce) {
      setTimeout(write, options.debounce);
    } else {
      write();
    }
  });
}
```

---

## Database Architecture

### PostgreSQL with Neon

**Neon** is a serverless Postgres service providing:

- **Connection Pooling**: Reduces connection overhead
- **Branching**: Create dev/test database copies
- **Autoscaling**: Automatic resource scaling
- **Auto-Suspend**: Pause when idle

### Connection String Configuration

```
postgres://user:password@host.neon.tech/dbname?sslmode=require

# For Prisma with pooling:
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require&schema=public"
DIRECT_DATABASE_URL="postgresql://user:password@host-direct.neon.tech/dbname?sslmode=require&schema=public"
```

The `DIRECT_DATABASE_URL` bypasses connection pooling for migrations.

### Prisma ORM

#### Migration Workflow

```bash
# Create migration
npm run db:migrate

# Apply migrations
npm run db:push

# Open Prisma Studio (GUI)
npm run db:studio
```

#### Indexing Strategy

```prisma
// Indexes for common queries
model Resume {
  id String @id
  userId String
  createdAt DateTime

  @@index([userId])           // Filter by user
  @@index([createdAt])        // Sort by date
  @@index([userId, createdAt]) // Compound index
}
```

### Redis Caching

Redis provides two critical functions:

1. **Rate Limiting**: Tracks request counts per user
2. **Session Storage**: Stores session tokens
3. **Job Queue**: Distributes export processing

```typescript
// src/config.ts
import { createClient } from "redis";

export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.on("connect", () => console.log("Redis connected"));

await redisClient.connect();

// Usage: Caching export status
export async function setExportStatus(exportId: string, status: string) {
  await redisClient.setEx(
    `export:${exportId}`,
    3600, // 1 hour TTL
    JSON.stringify({ status, timestamp: Date.now() }),
  );
}
```

---

## Authentication System

### Better-Auth Overview

**Better-Auth** is a modern, open-source authentication framework providing:

- Passwordless authentication (magic links, OTP)
- Social login (GitHub, Google, etc.)
- Session management
- Email verification
- RBAC (Role-Based Access Control)

### Architecture

```
┌─────────────────────────────────────────┐
│ Frontend (resume-builder)               │
│ better-auth/client                      │
└────────────────┬────────────────────────┘
                 │ HTTP calls
        ┌────────▼────────┐
        │ Better-Auth     │
        │ Server Routes   │
        │ /api/auth/*     │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ Prisma Adapter  │
        │ User/Session    │
        │ management      │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ PostgreSQL      │
        │ (Neon)          │
        └─────────────────┘
```

### Client-Side Setup

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/client";

export const client = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [
    // Optional: Multi-session plugin
  ],
});

// Usage in components
export function useAuthSession() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    client.getSession().then(setSession);
  }, []);

  return session;
}
```

### Server-Side Configuration

```typescript
// src/auth/better-auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";

export const auth = betterAuth({
  database: prismaAdapter(prisma),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },

  trustedOrigins: ["http://localhost:3000", "https://veriworkly.com"],
});

// Register auth routes
app.use("/api/auth", auth.handler);
```

### JWT Token Validation

```typescript
// middleware/auth-middleware.ts
import { jose } from "jose";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const secret = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
```

---

## PDF Export Pipeline

### End-to-End Flow

```
User clicks Export → Format modal → Resume HTML build →
  ↓
Server-side Playwright rendering → PDF generation →
  ↓
Upload to S3 → Update database → Return signed URL →
  ↓
Browser downloads via signed URL
```

### Step 1: HTML Generation

```typescript
// Converts Resume object to styled HTML
function buildResumeHTML(resume: Resume): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial; margin: 0; padding: 20px; }
          .section { margin-bottom: 20px; }
          .heading { font-size: 24px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>${resume.name}</h1>
        <p>${resume.email}</p>
        
        ${resume.experience
          .map(
            (exp) => `
          <div class="section">
            <div class="heading">${exp.position}</div>
            <p>${exp.company} • ${exp.startDate} - ${exp.endDate}</p>
          </div>
        `,
          )
          .join("")}
      </body>
    </html>
  `;
}
```

### Step 2: Server-Side PDF Generation

```typescript
// apps/server/src/services/export-service.ts
export class ExportService {
  private browser: Browser;

  async generatePDF(html: string, resumeId: string): Promise<Buffer> {
    const page = await this.browser.newPage();

    try {
      // Set viewport for consistency
      await page.setViewportSize({ width: 1024, height: 1400 });

      // Load HTML
      await page.setContent(html, {
        waitUntil: "networkidle2",
      });

      // Inject fonts via CSS
      await page.addStyleTag({
        content: await this.loadFontCSS(),
      });

      // Wait for render
      await page.evaluate(() => {
        return new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(resolve); // Double RAF for stability
          });
        });
      });

      // Generate PDF
      const pdf = await page.pdf({
        format: "A4",
        margin: { top: "20mm", right: "15mm", bottom: "20mm", left: "15mm" },
        printBackground: true,
        scale: 1.0,
        timeout: 30000,
      });

      return pdf;
    } finally {
      await page.close();
    }
  }
}
```

### Step 3: S3 Upload

```typescript
// Upload to AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const s3Key = `exports/${userId}/${resumeId}/${format}`;

await s3Client.send(
  new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: s3Key,
    Body: pdfBuffer,
    ContentType: "application/pdf",
    Expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  }),
);
```

### Step 4: Polling for Export Status

```typescript
// Frontend polls for export completion
export async function pollExportStatus(exportId: string) {
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes max

  const poll = async (): Promise<Export> => {
    const response = await apiClient.get(`/exports/${exportId}`);

    if (response.data.status === "completed" && response.data.ready) {
      return response.data;
    }

    if (attempts < maxAttempts) {
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 5s interval
      return poll();
    }

    throw new Error("Export timeout");
  };

  return poll();
}
```

---

## API Specification

### Base URL

```
Development:  http://localhost:3001/api
Production:   https://api.veriworkly.com/api
```

### Authentication

All requests (except auth endpoints) require:

```
Authorization: Bearer <jwt_token>
```

### Core Endpoints

#### Authentication

```
POST   /auth/signin         # Email/password login
POST   /auth/signup         # New account creation
POST   /auth/callback       # OAuth callback
POST   /auth/logout         # Destroy session
GET    /auth/session        # Get current session
POST   /auth/verify-email   # Verify email token
```

#### Resumes

```
GET    /resumes             # List user's resumes
POST   /resumes             # Create new resume
GET    /resumes/:id         # Get single resume
PUT    /resumes/:id         # Update resume
DELETE /resumes/:id         # Delete resume
POST   /resumes/:id/sync    # Cloud sync
```

#### Exports

```
POST   /exports             # Create export job
GET    /exports/:id         # Get export status
GET    /exports/:id/download # Download file
```

#### Profile

```
GET    /profile             # Get user profile
PUT    /profile             # Update profile
```

### Response Format

All responses follow this format:

```json
{
  "data": {
    // Response payload
  },
  "error": null,
  "timestamp": "2026-04-28T10:30:00Z"
}
```

Error responses:

```json
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [{ "field": "email", "message": "Invalid email format" }]
  },
  "timestamp": "2026-04-28T10:30:00Z"
}
```

---

## Development Workflow

### Local Setup

1. **Prerequisites**

   ```bash
   Node.js 18+
   PostgreSQL 14+ (or use Docker)
   Redis 7+ (or use Docker)
   ```

2. **Clone & Install**

   ```bash
   git clone https://github.com/veriworkly/resume.git
   cd veriworkly-resume
   npm install
   ```

3. **Environment Configuration**

   Create `.env.local` files:

   **apps/resume-builder/.env.local**

   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_ENABLE_ANALYTICS=false
   ```

   **apps/server/.env**

   ```
   DATABASE_URL=postgresql://user:pass@localhost:5432/veriworkly
   REDIS_HOST=localhost
   REDIS_PORT=6379
   BETTER_AUTH_SECRET=<random-secret>
   GITHUB_CLIENT_ID=<github-id>
   GITHUB_CLIENT_SECRET=<github-secret>
   ```

4. **Database Setup**

   ```bash
   cd apps/server
   npm run db:migrate   # Run migrations
   npm run db:push      # Apply schema
   ```

5. **Start Development Servers**

   ```bash
   # Terminal 1: Frontend
   npm run dev

   # Terminal 2: Backend (from apps/server)
   npm run dev

   # Terminal 3: Docker services (Postgres + Redis)
   docker-compose up
   ```

### Development Commands

```bash
# Lint all code
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Run visual tests
npm run test:visual

# Generate API docs
npm run generate:api

# Build production
npm run build

# Start production server
npm start
```

---

## Deployment & Infrastructure

### Docker Containerization

```dockerfile
# apps/server/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy monorepo
COPY . .

# Install deps
RUN npm ci

# Build
RUN npm run build -w @veriworkly/server

EXPOSE 3001

CMD ["npm", "start", "-w", "@veriworkly/server"]
```

### Kubernetes Configuration

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: veriworkly-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: veriworkly-server
  template:
    metadata:
      labels:
        app: veriworkly-server
    spec:
      containers:
        - name: server
          image: veriworkly/server:latest
          ports:
            - containerPort: 3001
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secrets
                  key: url
            - name: REDIS_HOST
              value: redis-service
          resources:
            requests:
              cpu: 500m
              memory: 512Mi
            limits:
              cpu: 1000m
              memory: 1Gi
          livenessProbe:
            httpGet:
              path: /health
              port: 3001
            initialDelaySeconds: 10
            periodSeconds: 10
```

---

## Security Model

### Data Security

1. **In Transit**: All communication over HTTPS/TLS 1.3
2. **At Rest**: Database encrypted at Neon level
3. **Local Storage**: User data in browser `localStorage` (unencrypted but local)

### API Security

1. **Rate Limiting**: 100 requests/15 minutes per IP
2. **CORS**: Whitelist trusted origins only
3. **Helmet**: Security headers (CSP, X-Frame-Options, etc.)
4. **Input Validation**: Zod schemas on all endpoints
5. **CSRF Protection**: SameSite cookies

### Authentication Security

1. **JWT Tokens**: Signed with RS256 algorithm
2. **Token Expiry**: 24-hour tokens with refresh mechanism
3. **Password Requirements**: Minimum 8 characters, entropy validation
4. **Passwordless**: Support for OTP and magic links

### Secrets Management

```bash
# Use environment variables for sensitive data
export DATABASE_URL=postgresql://...
export BETTER_AUTH_SECRET=<random-256-bit-secret>
export GITHUB_CLIENT_SECRET=...
```

---

## Performance & Optimization

### Frontend Optimization

1. **Code Splitting**: Route-based with Next.js dynamic imports
2. **Image Optimization**: Automatic WebP, lazy loading
3. **CSS Minification**: Tailwind purges unused styles
4. **Caching**: Service Worker for offline support
5. **Metrics**: Core Web Vitals monitoring

### Backend Optimization

1. **Database Indexing**: Proper indexes on frequently queried columns
2. **Connection Pooling**: Neon's built-in pooling
3. **Caching Layer**: Redis for frequently accessed data
4. **Query Optimization**: Select only needed fields
5. **Compression**: Gzip responses

### Lighthouse Scores

Target metrics:

- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 95+

---

## Monitoring & Logging

### Application Logging

```typescript
// Structured logging
import { logger } from "./utils/logger";

logger.info("User login", {
  userId: user.id,
  email: user.email,
  timestamp: new Date(),
});

logger.error("Export failed", {
  exportId,
  reason: error.message,
  stack: error.stack,
});
```

### Health Checks

```
GET /health → { status: "ok", version: "1.0.0" }
```

### Error Tracking

Integrate Sentry for production error tracking:

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

---

## Troubleshooting & Common Gotchas

### Export Issues

**Problem**: PDF rendering differs from screen preview
**Solution**: Override responsive breakpoints in export CSS

**Problem**: Fonts not loading in PDF
**Solution**: Ensure fonts are loaded globally in `app/layout.tsx` before export

### State Management Issues

**Problem**: Zustand state not persisting
**Solution**: Check `localStorage` quota and implement cleanup

### Database Issues

**Problem**: Migrations fail with "table already exists"
**Solution**: Run `npm run db:push` instead of `npm run db:migrate`

**Problem**: Connection timeouts
**Solution**: Check `DIRECT_DATABASE_URL` for migrations (bypasses pooling)

### Authentication Issues

**Problem**: "Token is invalid" errors
**Solution**: Verify `BETTER_AUTH_SECRET` is the same across instances

**Problem**: CORS errors on auth callbacks
**Solution**: Add origin to `trustedOrigins` in Better-Auth config

---

## Conclusion

VeriWorkly represents a modern, privacy-first approach to resume building. By combining local-first architecture with optional cloud synchronization, it provides users with complete control over their data while maintaining the convenience of cloud features. The technical implementation prioritizes security, performance, and developer experience throughout the entire stack.

For questions or contributions, see [CONTRIBUTING.md](./CONTRIBUTING.md) and [SUPPORT.md](./SUPPORT.md).

```

---

This is a comprehensive 530+ line `PROJECT_DETAILS.md` covering all aspects of the veriworkly-resume monorepo in exhaustive technical detail.
```
