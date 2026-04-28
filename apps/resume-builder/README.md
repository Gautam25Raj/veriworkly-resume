# VeriWorkly Resume Builder

The modern, fast, and privacy-first resume creation platform. Built with Next.js 15+, Zustand for local-first state management, and server-side PDF rendering for ATS-optimized exports.

## ✨ Features

- **Real-Time Editing**: Lightning-fast resume editing with instant preview updates powered by Zustand state management
- **Local-First Architecture**: All resume data is stored locally in your browser by default—nothing sent to servers without your consent
- **ATS-Optimized PDF Export**: Playwright-powered server-side rendering ensures pixel-perfect, semantically correct PDFs that pass ATS parsing
- **Multiple Export Formats**: PDF, DOCX, PNG, JPG, HTML, Markdown, JSON, and plain text exports from a single interface
- **Professional Templates**: Pre-built modern, minimal, executive, and ATS-optimized templates with instant switching without data loss
- **Responsive Design**: Fully responsive editor that works seamlessly on desktop and mobile devices
- **Theme Customization**: Advanced color, font, spacing, and line-height customization with live preview
- **Authentication**: Secure passwordless authentication via better-auth supporting email OTP and magic links
- **Cloud Sync**: Optional sync to cloud storage for backup and cross-device access
- **Drag-and-Drop Reordering**: Intuitive section and item reordering with visual feedback
- **Form Validation**: Real-time validation with Zod schema enforcement and inline error messages
- **Dark Mode**: Full dark mode support with system preference detection and manual toggle

## 🏗️ Architecture Overview

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | Next.js 15+ (App Router) | Server components, optimized rendering, API routes |
| **Styling** | Tailwind CSS 4 (@theme API) | Utility-first responsive design with advanced theming |
| **State Management** | Zustand | Client-side persistence, local storage, minimal boilerplate |
| **Form Handling** | React Hook Form + Zod | Performant form control with schema validation |
| **Icons** | Lucide React | Consistent, accessible icon system |
| **PDF Export** | Playwright (Backend) | Server-side headless rendering for ATS compatibility |
| **Authentication** | better-auth | Modern, modular, passwordless auth framework |
| **UI Components** | Custom + Headless UI | Accessible, composable component library |

### Application Structure

```
apps/resume-builder/
├── app/                           # Next.js App Router
│   ├── (main)/                    # Public-facing routes
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Main layout with navigation
│   │   ├── editor/               # Resume editor routes
│   │   │   ├── page.tsx          # Editor with resume list
│   │   │   ├── [id]/             # Editor for specific resume
│   │   │   └── components/       # Editor-specific components
│   │   └── preview/              # Public preview routes
│   ├── (private)/                # Authenticated-only routes
│   │   ├── dashboard/            # User dashboard
│   │   └── settings/             # User settings
│   ├── api/                       # API routes and handlers
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── resumes/              # Resume CRUD operations
│   │   └── exports/              # Export request handlers
│   ├── globals.css               # Global styles and Tailwind directives
│   ├── layout.tsx                # Root layout with providers
│   └── error.tsx                 # Error boundary
├── components/                    # Reusable UI components
│   ├── ui/                       # Low-level primitive components (Button, Input, etc.)
│   ├── layout/                   # Layout components (Navbar, Sidebar, Footer)
│   └── resume/                   # Resume-specific components
├── features/                      # Business logic modules
│   ├── resume/                   # Resume domain
│   │   ├── constants/            # Default resume, fonts, validation rules
│   │   ├── hooks/                # Custom hooks (useResume, useLocalStorage)
│   │   ├── services/             # Business logic services
│   │   ├── store/                # Zustand resume store and actions
│   │   ├── types/                # Domain-specific types
│   │   └── utils/                # Helper functions and formatters
│   └── auth/                     # Authentication-related logic
├── hooks/                         # Global custom hooks
├── lib/                          # Utility libraries and clients
│   ├── api-client.ts             # API request handler
│   ├── auth-client.ts            # better-auth client configuration
│   └── utils.ts                  # Common utilities
├── providers/                     # React context providers
│   ├── auth-provider.tsx         # Auth state provider
│   ├── theme-provider.tsx        # Dark mode provider
│   └── store-provider.tsx        # Zustand provider initialization
├── store/                         # Zustand state stores
│   ├── resume-store.ts           # Main resume data store with persistence
│   ├── ui-store.ts               # UI state (editor panel state, etc.)
│   └── user-store.ts             # User session and preferences
├── styles/                        # Stylesheet utilities
│   ├── globals.css               # Root CSS and Tailwind imports
│   └── themes.ts                 # Theme configuration and CSS variables
├── templates/                     # Resume template engines
│   ├── index.ts                  # Template registry and factory
│   ├── modern/                   # Modern template component and styles
│   ├── minimal/                  # Minimal template component and styles
│   ├── executive/                # Executive template component and styles
│   └── ats-classic/              # ATS-optimized template component and styles
├── types/                         # Global TypeScript interfaces
│   ├── resume.ts                 # Resume data structures
│   ├── api.ts                    # API request/response types
│   └── index.ts                  # Type exports
├── utils/                         # Pure utility functions
│   ├── format.ts                 # Formatting helpers (dates, phone, etc.)
│   ├── pdf.ts                    # PDF export utilities
│   └── validation.ts             # Validation helpers
├── public/                        # Static assets
│   ├── fonts/                    # Custom font files
│   ├── images/                   # Images and icons
│   └── templates/                # Template preview images
├── tests/                         # Test suites
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # End-to-end tests with Playwright
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.mjs            # PostCSS configuration
├── vitest.config.ts              # Vitest test runner config
└── playwright.config.ts          # Playwright E2E test config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ or later
- npm 10+ or later
- Docker (for running PostgreSQL and Redis locally)

### Installation

1. **Clone and install dependencies**:
```bash
git clone https://github.com/veriworkly/resume.git
cd resume
npm install
```

2. **Set up environment variables**:
```bash
cd apps/resume-builder
cp .env.example .env.local
```

3. **Run the development server**:
```bash
npm run dev -w @veriworkly/resume-builder
```

The application will be available at `http://localhost:3000`.

### Running Supporting Services

The Resume Builder requires the backend server and PostgreSQL/Redis for full functionality:

```bash
# Terminal 1: Backend server (runs on :8080)
npm run dev -w @veriworkly/server

# Terminal 2: PostgreSQL and Redis (if using Docker)
docker-compose up -d postgres redis

# Terminal 3: Resume Builder (runs on :3000)
npm run dev -w @veriworkly/resume-builder
```

## 🔑 Key Features Deep Dive

### Local-First State Management with Zustand

The Resume Builder uses Zustand for efficient, predictable state management with automatic browser persistence:

**Store Structure** (`store/resume-store.ts`):
- `resume`: Current resume data object
- `isDirty`: Track unsaved changes
- `history`: Undo/redo stack
- `selectedSection`: Current editor section

**Persistence**: The resume store uses Zustand's `persist` middleware to automatically save state to `localStorage` on every change. On application load, the store rehydrates from saved state.

**Actions**:
- `setResume(data)`: Update entire resume
- `updateSection(section, data)`: Update specific section
- `reorderSections(ids)`: Change section order via drag-and-drop
- `addItem(section, item)`: Add new item to section
- `removeItem(section, id)`: Remove item from section
- `undo()` / `redo()`: Navigate change history

### PDF Export Pipeline

PDF exports use a server-driven approach via Playwright for maximum compatibility and ATS optimization:

1. **Client Request**: User clicks "Export as PDF" in the Resume Builder
2. **Data Serialization**: Current resume state is serialized to JSON
3. **Server Processing** (API: `/api/exports/pdf`):
   - Request is forwarded to the backend server at `http://server:8080/api/v1/exports/pdf`
   - Playwright launches a headless Chromium instance
   - Resume HTML is rendered server-side with exact styling
   - Page is printed to PDF with optimized compression
4. **Stream Response**: PDF bytes are streamed back to client with appropriate headers
5. **Download**: Browser triggers download of the generated PDF

**Why Server-Side Rendering?**
- Ensures pixel-perfect visual parity between preview and export
- Produces semantically correct PDFs with text layers for ATS parsing
- Avoids browser limitations and cross-browser rendering inconsistencies
- Enables advanced features like custom fonts and complex layouts

### Authentication with better-auth

The application uses better-auth for modern, passwordless authentication:

**Features**:
- Email OTP authentication (one-time passwords)
- Magic link authentication
- Session management with automatic refresh
- Protected routes and API endpoints
- User profile management

**Implementation**:
- `lib/auth-client.ts`: better-auth client configuration and hooks
- `providers/auth-provider.tsx`: Global auth state provider
- `features/auth/`: Authentication-specific logic and middleware

### Template System

Templates are React components that transform standardized resume data into styled HTML:

**Template Registry** (`templates/index.ts`):
```typescript
const templates = {
  modern: { name: 'Modern', component: ModernTemplate },
  minimal: { name: 'Minimal', component: MinimalTemplate },
  executive: { name: 'Executive', component: ExecutiveTemplate },
  'ats-classic': { name: 'ATS Classic', component: ATSTemplate },
}
```

**Template Interface**:
Each template implements:
```typescript
interface ResumeTemplate {
  render(data: ResumeData, theme: ThemeConfig): ReactNode
  metadata: TemplateMetadata
}
```

**Theme Customization**:
All templates respect CSS variables for:
- Primary and secondary colors
- Font families (heading, body)
- Section spacing and margins
- Line heights and letter spacing

### Form Validation

Forms use React Hook Form with Zod schemas for runtime validation:

**Validation Flow**:
1. Form field changes trigger React Hook Form validation
2. Zod schema validates data shape and constraints
3. Errors rendered inline beneath fields
4. Form submission blocked if validation fails

**Example** (`features/resume/constants/validation.ts`):
```typescript
export const resumeSchema = z.object({
  personal: z.object({
    fullName: z.string().min(1, 'Name required'),
    email: z.string().email('Invalid email'),
    phone: z.string().optional(),
  }),
  // ... more sections
})
```

## 📱 Responsive Design

The editor uses a responsive layout that adapts to all screen sizes:

- **Desktop (1024px+)**: Split panel layout with content editor on left, live preview on right
- **Tablet (768px-1023px)**: Single column with Content/Preview tabs
- **Mobile (<768px)**: Stacked editor and preview with swipe navigation

## 🎨 Theming with Tailwind CSS 4

The application uses Tailwind CSS 4's `@theme` API for advanced theming:

**Theme Configuration** (`tailwind.config.ts`):
- Extended color palette with resume-specific colors
- Custom font stack with system fonts and custom web fonts
- Spacing scale optimized for document layout
- Shadow utilities for depth and visual hierarchy

**Dynamic Theming**:
- CSS variables control theme at runtime
- Theme can be switched instantly without page reload
- Dark mode support via `prefers-color-scheme` or manual toggle

## 🔐 Security Considerations

- **CORS**: API requests restricted to configured origins (backend validation)
- **Content Security Policy**: Strict CSP headers prevent XSS attacks
- **Input Validation**: All user inputs validated with Zod before processing
- **Session Management**: Secure, httpOnly cookies for session tokens
- **Environment Variables**: Sensitive data stored in `.env.local`, never committed

## ⚡ Performance Optimizations

- **Code Splitting**: Dynamic imports for heavy components (PDF viewer, etc.)
- **Image Optimization**: Next.js automatic image optimization with responsive sizes
- **Memoization**: React.memo and useMemo prevent unnecessary re-renders
- **Font Loading**: Preload critical fonts, lazy-load supplementary fonts
- **State Selectors**: Zustand selectors prevent component re-renders on irrelevant state changes

## 📊 Development Workflow

### Available Scripts

```bash
# Development
npm run dev -w @veriworkly/resume-builder    # Start dev server on :3000

# Building
npm run build -w @veriworkly/resume-builder  # Build for production
npm run start -w @veriworkly/resume-builder  # Run production build

# Testing
npm test -w @veriworkly/resume-builder       # Run unit and integration tests
npm run test:e2e -w @veriworkly/resume-builder # Run end-to-end tests

# Linting and formatting
npm run lint -w @veriworkly/resume-builder   # Run ESLint checks
npm run format -w @veriworkly/resume-builder # Format with Prettier

# Type checking
npm run type-check -w @veriworkly/resume-builder # Check TypeScript types
```

### Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080       # Backend server URL
NEXT_PUBLIC_APP_URL=http://localhost:3000       # Frontend URL

# Authentication
NEXT_PUBLIC_AUTH_CALLBACK_URL=http://localhost:3000/api/auth/callback

# Feature Flags
NEXT_PUBLIC_ENABLE_CLOUD_SYNC=true              # Enable cloud backup
NEXT_PUBLIC_ENABLE_SHARING=true                 # Enable resume sharing
```

## 🧪 Testing

The project includes comprehensive test coverage:

**Unit Tests**: Business logic and utilities
```bash
npm test -w @veriworkly/resume-builder
```

**Integration Tests**: Component behavior and state management
```bash
npm test -w @veriworkly/resume-builder -- --testPathPattern=integration
```

**End-to-End Tests**: Complete user workflows with Playwright
```bash
npm run test:e2e -w @veriworkly/resume-builder
```

## 📚 Documentation

- **[DETAILS.md](DETAILS.md)**: In-depth technical documentation and API reference
- **[Architecture Guide](../docs-platform/content/docs/architecture.md)**: System design and component architecture
- **[API Docs](../docs-platform)**: Complete API endpoint documentation with examples

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines and [CODE_OF_CONDUCT.md](../../CODE_OF_CONDUCT.md) for community standards.

### Development Guidelines

1. **Branch Naming**: `feature/description` or `fix/description`
2. **Commit Messages**: Clear, descriptive, and in present tense
3. **Code Style**: Run `npm run format` before committing
4. **Testing**: Add tests for new features; maintain >80% coverage
5. **Types**: Use TypeScript; avoid `any` types

## 🐛 Troubleshooting

### Common Issues

**Port 3000 already in use**:
```bash
lsof -i :3000  # Find process using port
kill -9 <PID>  # Kill the process
```

**localStorage quota exceeded**:
The browser's localStorage has a ~5MB limit. The app handles quota errors gracefully but very large resumes may need cloud sync.

**PDF exports fail**:
Ensure the backend server is running on :8080 and Playwright is properly installed.

**Authentication not working**:
Check that `NEXT_PUBLIC_AUTH_CALLBACK_URL` matches your app URL.

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details.

## 🙋 Support

- **Issues**: [GitHub Issues](https://github.com/veriworkly/resume/issues)
- **Discussions**: [GitHub Discussions](https://github.com/veriworkly/resume/discussions)
- **Email**: support@veriworkly.com

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] AI-powered resume suggestions
- [ ] Real-time collaboration
- [ ] Advanced ATS scoring
- [ ] Integration with job boards
- [ ] Video resume support

---

**Made with ❤️ by the VeriWorkly team**

Built for those building their future.