# 📱 Resume Builder: Deep Dive Documentation

`@veriworkly/resume-builder` is the primary frontend application of the VeriWorkly ecosystem. It is a state-of-the-art Next.js application designed for speed, privacy, and user experience.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15+ (App Router with Server Components by default)
- **Runtime**: Node.js 20+
- **Styling**: Tailwind CSS 4 (using the `@theme` API for dynamic theming)
- **State Management**: Zustand (Client-side persistence with middleware)
- **Authentication**: Better-Auth (Session-based, JWT tokens, provider integrations)
- **Form Handling**: React Hook Form + Zod (Type-safe validation)
- **Icons**: Lucide React
- **PDF Export**: Playwright headless browser rendering (Backend)
- **DOCX Export**: `docx` library (Backend server-side generation)

---

## 📁 Detailed Folder Structure

| Path             | Purpose                                                                        |
| :--------------- | :----------------------------------------------------------------------------- |
| `app/`           | Routes, layouts, and API endpoints following Next.js App Router conventions.   |
| `app/(main)/`    | Public-facing pages: Home, Editor, Pricing, Documentation.                     |
| `app/(private)/` | Protected routes requiring authentication: Dashboard, Saved Resumes, Settings. |
| `app/api/`       | Backend API endpoints for authentication, export, and data sync.               |
| `components/`    | Global UI Components: Navbars, Footers, Modals, Cards, shared UI elements.     |
| `features/`      | Business logic modules: `resume-editor/`, `preview-panel/`, `export-dialog/`.  |
| `hooks/`         | Custom React hooks: `useResumeStore`, `useAuth`, `useWindowResize`, etc.       |
| `lib/`           | External client configurations: Auth client, API client, utilities.            |
| `store/`         | Zustand store definitions: Resume data, UI state, user preferences.            |
| `templates/`     | Resume design system: Professional layout components.                          |
| `types/`         | TypeScript interfaces and types for Resume, User, API responses.               |
| `utils/`         | Pure utility functions: Formatting, validation, data transformation.           |

---

## 🎯 Next.js 15+ App Router Architecture

### Server vs. Client Components

The Resume Builder leverages Next.js 15's default Server Components for optimal performance:

- **Server Components** (Layout files, page root components):
  - `app/layout.tsx`: Global layout with metadata, font loading, and provider setup.
  - `app/(main)/page.tsx`: Home page server-rendered.
  - `app/(private)/dashboard/page.tsx`: User dashboard, fetches user data server-side.
- **Client Components** (Interactive features):
  - `app/(main)/editor/page.tsx`: Main editor marked with `'use client'` for state interactivity.
  - `components/resume-editor.tsx`: Resume editing UI with Zustand state.
  - `features/preview-panel/PreviewPanel.tsx`: Live preview with template switching.

### Route Organization

The application uses two main route groups:

1. **Public Routes** (`(main)`):
   - `/` - Landing page
   - `/editor` - Resume editor (anonymous or authenticated)
   - `/templates` - Template showcase
   - `/pricing` - Pricing page

2. **Private Routes** (`(private)`):
   - `/dashboard` - User dashboard with saved resumes
   - `/settings` - User settings and preferences
   - `/my-resumes` - Saved resumes list
   - Protected via Better-Auth middleware

### API Routes

RESTful API endpoints handle backend logic:

```
/api/auth/* → Better-Auth endpoints (login, logout, register, oauth)
/api/resume/export/pdf → PDF generation via Playwright
/api/resume/export/docx → DOCX generation
/api/resume/sync → CloudSync resume data
/api/user/profile → User profile updates
```

---

## 🎨 Tailwind CSS 4: Advanced Styling Strategy

### Theme Architecture

Tailwind 4's `@theme` API enables dynamic, runtime theming without class duplication:

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #1e293b;
  --color-accent: #ec4899;
  --font-sans: "Inter", sans-serif;
  --font-serif: "Merriweather", serif;
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --spacing-editor-padding: 2rem;
}
```

### Resume Template Styling

The template engine uses CSS variables for real-time styling updates:

```tsx
// templates/ModernTemplate.tsx
export function ModernTemplate({ resume, colors }: Props) {
  return (
    <div
      style={
        {
          "--primary-color": colors.primary,
          "--accent-color": colors.accent,
          "--font-family": colors.fontFamily,
        } as React.CSSProperties
      }
    >
      {/* Resume content */}
    </div>
  );
}
```

### Utility-First Approach

Components use Tailwind utilities with custom variants:

```tsx
// components/ResumeSectionCard.tsx
export function ResumeSectionCard({ title, children }: Props) {
  return (
    <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      {children}
    </div>
  );
}
```

---

## 💾 Zustand Local-First Storage Architecture

### Store Design

The resume data is managed entirely client-side using Zustand with persistence middleware:

```typescript
// store/resumeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ResumeState {
  resume: Resume;
  uiState: UIState;
  updateResume: (data: Partial<Resume>) => void;
  updateUIState: (state: Partial<UIState>) => void;
  clearResume: () => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      resume: initialResume,
      uiState: initialUIState,
      updateResume: (data) =>
        set((state) => ({
          resume: { ...state.resume, ...data },
        })),
      updateUIState: (state) =>
        set((s) => ({
          uiState: { ...s.uiState, ...state },
        })),
      clearResume: () => set({ resume: initialResume }),
    }),
    {
      name: "resume-builder-storage",
      storage: localStorage,
      version: 1,
    },
  ),
);
```

### Data Persistence Flow

1. **Initial Load**:
   - App checks `localStorage` for `'resume-builder-storage'` key.
   - If found, Zustand deserializes and hydrates the store.
   - If not found, default `initialResume` is used.

2. **Real-Time Updates**:
   - User edits a field (e.g., job title).
   - `updateResume()` action triggered.
   - Zustand state updates.
   - Middleware automatically writes serialized state to `localStorage`.
   - UI re-renders with new data.

3. **No Server Sync by Default**:
   - Resume data stays local until user explicitly "Sync to Cloud" or "Share".
   - Enables true privacy: data never leaves the browser without consent.

### Derived State & Selectors

Custom hooks provide fine-grained subscriptions to prevent unnecessary re-renders:

```typescript
// hooks/useResumeSummary.ts
export function useResumeSummary() {
  return useResumeStore((state) => state.resume.summary);
}

// hooks/usePreviewMode.ts
export function usePreviewMode() {
  return useResumeStore((state) => state.uiState.previewMode);
}
```

---

## 🔐 Better-Auth Integration

### Authentication Flow

Better-Auth provides session-based authentication with multiple provider support:

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [
    dynamicOAuth({
      providers: ["google", "github", "microsoft"],
    }),
  ],
});
```

### Server-Side Session Verification

Protected routes use Better-Auth middleware to verify user sessions:

```typescript
// app/(private)/dashboard/page.tsx
import { auth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await auth.api.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

### Client-Side Hook

React hooks provide easy access to auth state on the client:

```typescript
// hooks/useAuth.ts
import { authClient } from "@/lib/auth-client";

export function useAuth() {
  const { data: session, isLoading } = authClient.useSession();

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading,
  };
}
```

### Session Persistence

Better-Auth automatically manages session tokens:

- Tokens stored securely in HTTPOnly cookies (backend).
- Session data cached in client-side state.
- Automatic refresh on token expiration.
- Logout clears session and redirects to home.

---

## 📄 Playwright API Integration for PDF Export

### Architecture Overview

PDF export is handled entirely on the backend to ensure ATS compatibility and visual fidelity:

```
Client (Resume Builder)
    ↓ sends resume data + template
    ↓
API Endpoint: /api/resume/export/pdf
    ↓
Playwright Service (Node.js)
    ↓ render resume HTML + CSS
    ↓
Headless Chromium Browser
    ↓ generate PDF with semantic text layer
    ↓
Client receives binary PDF blob
```

### Backend PDF Generation

```typescript
// server/src/services/pdf-export.ts
import { chromium } from "playwright";

export async function generatePDF(resumeData: Resume, template: string) {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage({
    viewport: { width: 1200, height: 1600 },
  });

  // Render HTML from template + resume data
  const html = renderResumeTemplate(resumeData, template);

  await page.setContent(html, {
    waitUntil: "networkidle",
  });

  // Generate PDF with semantic text layer for ATS
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  await browser.close();

  return pdfBuffer;
}
```

### API Endpoint

```typescript
// app/api/resume/export/pdf/route.ts
import { generatePDF } from "@/services/pdf-export";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { resumeData, template } = await req.json();

  try {
    const pdfBuffer = await generatePDF(resumeData, template);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
```

### Client-Side Export Flow

```typescript
// hooks/useExportResume.ts
export function useExportResume() {
  const resume = useResumeStore((state) => state.resume);
  const [isExporting, setIsExporting] = useState(false);

  const exportPDF = async (template: string) => {
    setIsExporting(true);

    try {
      const response = await fetch("/api/resume/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: resume, template }),
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.name || "resume"}.pdf`;
      link.click();
    } finally {
      setIsExporting(false);
    }
  };

  return { exportPDF, isExporting };
}
```

### Why Playwright on Backend?

1. **ATS Compatibility**: Ensures text layer is semantically correct for applicant tracking systems.
2. **Visual Parity**: 100% match between on-screen preview and exported PDF.
3. **Font Subsetting**: Fonts are embedded correctly in the PDF.
4. **Performance**: Heavy browser automation doesn't block client UI.
5. **Reliability**: Headless Chromium is deterministic and reproducible.

---

## 🔄 Data Flow: End-to-End

### Editing a Resume

1. User navigates to `/editor`.
2. Page loads and hydrates Zustand store from `localStorage`.
3. Resume content renders via selected template.
4. User edits a field (e.g., job title).
5. `updateResume()` action called.
6. Zustand state updates, middleware writes to `localStorage`.
7. Preview updates in real-time.

### Exporting to PDF

1. User clicks "Export as PDF".
2. Dialog opens, user selects template and color scheme.
3. Client sends `POST /api/resume/export/pdf` with resume data.
4. Backend spins up headless browser via Playwright.
5. Resume HTML is rendered with selected colors and fonts.
6. Playwright generates PDF with embedded fonts and text layer.
7. Binary PDF sent back to client as blob.
8. Browser triggers download dialog.

### Syncing to Cloud

1. User clicks "Sync to Cloud" (if authenticated).
2. Better-Auth session verified on client.
3. Resume data sent to `/api/resume/sync` endpoint.
4. Server stores resume in database associated with user ID.
5. Confirmation shown to user.
6. Resume now accessible from dashboard on any device.

---

## 🚀 Development Workflow

### Local Development

```bash
# Install dependencies
npm install -w @veriworkly/resume-builder

# Run development server
npm run dev -w @veriworkly/resume-builder
```

The dev server runs on `http://localhost:3000` with hot module replacement (HMR) enabled.

### Production Build

```bash
# Build for production
npm run build -w @veriworkly/resume-builder

# Start production server
npm start -w @veriworkly/resume-builder
```

### Testing

```bash
# Run unit tests
npm run test -w @veriworkly/resume-builder

# Run e2e tests with Playwright
npm run test:e2e -w @veriworkly/resume-builder
```

---

## 🔒 Security & Privacy Considerations

### Local-First by Design

- **No Auto-Upload**: Resume data is never sent to servers without explicit user action.
- **Encryption in Transit**: All API calls use HTTPS.
- **Session Security**: Better-Auth manages secure HTTPOnly cookies.

### Input Validation

- All form inputs validated with Zod schemas.
- Rich text sanitized before rendering.
- API endpoints validate request payloads.

### Authentication Checks

- Protected routes verified server-side via Better-Auth.
- API endpoints require valid session tokens.
- CORS properly configured for cross-origin requests.

---

## 📊 Performance Optimizations

### Image Optimization

- Next.js `<Image>` component for automatic optimization.
- WebP format with fallbacks.
- Lazy loading for below-the-fold content.

### Code Splitting

- Route-based code splitting via App Router.
- Dynamic imports for heavy components.
- Zustand store splits prevent unnecessary hydration.

### Caching Strategies

- Static pages cached at build time.
- Dynamic pages cached with `revalidateTag()`.
- Client-side caching with React Query (optional).

---

## 🎯 Future Roadmap

1. **Offline Mode**: Service Worker for full offline support.
2. **Collaborative Editing**: Real-time collaboration via WebSockets.
3. **AI Assistance**: GPT integration for content suggestions.
4. **Video Export**: Video resume rendering.
5. **ATS Scoring**: Real-time ATS compatibility feedback.

---

© 2026 VeriWorkly. Built for the future of career building.
