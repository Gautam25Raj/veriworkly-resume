```markdown
# ⚙️ VeriWorkly Backend Server

The centralized API service and background task processor for the VeriWorkly ecosystem. Built with Node.js and Express, this server handles authentication, resume data synchronization, ATS-friendly PDF generation, user profiles, and public roadmap management.

**Base URL**: `http://localhost:8080` (development)  
**Node Version**: 20+  
**Status**: Production-ready

---

## 🚀 Quick Overview

The backend server powers the entire VeriWorkly platform. It provides secure REST APIs for the resume builder frontend, handles passwordless authentication via Better-Auth, generates ATS-optimized PDFs using headless Playwright Chromium, and manages data persistence with PostgreSQL via Neon DB. Background jobs running on Redis/BullMQ handle async tasks like GitHub syncing and export artifact management.

### Key Capabilities

- **Passwordless Authentication**: Magic links, OTP, social OAuth (Google, GitHub)
- **Resume Management**: CRUD operations, version history, sharing links
- **PDF Generation**: Headless Chromium rendering for ATS-compliant export
- **Public Roadmap**: Feature voting, feedback collection, admin management
- **Rate Limiting**: Sliding window protection on all public endpoints
- **Caching Layer**: Redis-backed cache-aside pattern for performance
- **Audit Logging**: Complete request/response logging for compliance
- **Background Jobs**: Asynchronous processing for expensive operations

---

## 🛠️ Technology Stack

| Layer              | Technology            | Purpose                                           |
| :----------------- | :-------------------- | :------------------------------------------------ |
| **Runtime**        | Node.js 20+           | Server runtime and event loop                     |
| **Framework**      | Express.js            | HTTP server, routing, middleware pipeline         |
| **Database**       | PostgreSQL (Neon)     | Primary data store, managed via Prisma            |
| **ORM**            | Prisma                | Type-safe database access and migrations          |
| **Caching**        | Redis + ioredis       | Session store, rate limiting, query cache         |
| **Job Queue**      | BullMQ                | Background task processing and workers            |
| **Authentication** | Better-Auth           | Passwordless auth, session management, OAuth      |
| **PDF Generation** | Playwright + Chromium | Headless browser-based resume rendering           |
| **Validation**     | Zod                   | Runtime schema validation, end-to-end type safety |
| **Testing**        | Vitest + Supertest    | Unit and integration tests                        |
| **Security**       | Helmet + CORS         | HTTP security headers, cross-origin protection    |
| **Logging**        | Pino                  | Structured JSON logging for debugging             |

---

## 📁 Detailed Folder Structure
```

apps/server/
├── src/
│ ├── index.ts # Application entry point, Express server initialization
│ ├── config.ts # Environment variables and configuration loading
│ │
│ ├── controllers/ # HTTP request handlers (request → response layer)
│ │ ├── admin/ # Admin-specific endpoints
│ │ │ ├── roadmapController.ts # Feature management, voting
│ │ │ └── statsController.ts # Analytics aggregation
│ │ ├── exportController.ts # Trigger and poll resume exports
│ │ ├── githubController.ts # GitHub sync endpoints
│ │ ├── healthController.ts # Liveness/readiness probes
│ │ ├── profileController.ts # User profile endpoints
│ │ ├── resumeController.ts # Resume CRUD operations
│ │ ├── roadmapController.ts # Public roadmap queries
│ │ ├── shareController.ts # Share link generation/redemption
│ │ ├── statsController.ts # Public statistics
│ │ └── userController.ts # User account management
│ │
│ ├── services/ # Business logic layer (decoupled from HTTP)
│ │ ├── admin/ # Admin service utilities
│ │ ├── exportService.ts # Coordinates PDF/image generation via Playwright
│ │ ├── exportQueueService.ts # Manages BullMQ job submissions
│ │ ├── exportArtifactStore.ts # Manages S3/local artifact storage
│ │ ├── githubService.ts # GitHub API interactions, sync logic
│ │ ├── roadmapService.ts # Roadmap feature queries, caching
│ │ └── analyticsService.ts # Statistics computation, aggregation
│ │
│ ├── routes/ # API endpoint definitions
│ │ ├── exports.ts # POST /api/v1/exports, GET /api/v1/exports/:id
│ │ ├── github.ts # POST /api/v1/github/sync
│ │ ├── health.ts # GET /api/v1/health
│ │ ├── profiles.ts # GET /api/v1/profiles/:userId
│ │ ├── resumes.ts # GET/POST/PUT /api/v1/resumes
│ │ ├── roadmap.ts # GET /api/v1/roadmap (public)
│ │ ├── share.ts # POST/GET /api/v1/share/:shareToken
│ │ ├── shares.ts # GET /api/v1/shares
│ │ ├── stats.ts # GET /api/v1/stats (public)
│ │ └── users.ts # GET /api/v1/users/me, POST /api/v1/logout
│ │
│ ├── middleware/ # Request processing pipeline
│ │ ├── auth.ts # JWT/session validation, req.user population
│ │ ├── adminAuth.ts # Admin role verification
│ │ ├── internalAuth.ts # Internal service-to-service auth (X-API-Key)
│ │ ├── cors.ts # CORS whitelist enforcement (resume-builder origin)
│ │ ├── rateLimit.ts # Sliding window rate limiter (100 req/15min)
│ │ ├── logging.ts # Request/response logging with Pino
│ │ ├── errorHandler.ts # Centralized error handler, response standardization
│ │ ├── authRequestDiagnostics.ts # Debug auth context
│ │ └── (applied in sequence in index.ts)
│ │
│ ├── auth/ # Better-Auth integration
│ │ ├── index.ts # Better-Auth client initialization
│ │ ├── runtime.ts # Runtime environment setup for auth adapter
│ │ └── mailer.ts # Email transport for magic links/OTP
│ │
│ ├── jobs/ # Background job workers
│ │ ├── githubSyncJob.ts # BullMQ worker: GitHub repos sync
│ │ ├── runGithubSyncOnce.ts # One-shot sync (for testing/manual trigger)
│ │ ├── usageMetricsJob.ts # Worker: Compute and store metrics
│ │ └── verifyLocalExportStorage.ts # Verify artifact storage integrity
│ │
│ ├── types/ # Shared TypeScript interfaces
│ │ └── (custom types, enums, request extensions)
│ │
│ ├── utils/ # Utility functions
│ │ ├── pdf/ # PDF generation utilities
│ │ │ └── playgroundGenerator.ts # Playwright HTML → PDF pipeline
│ │ ├── parseEnv.ts # Environment variable parser
│ │ └── logger.ts # Pino logger factory
│ │
│ ├── validators/ # Zod schemas for request/response validation
│ │ ├── exportSchemas.ts # Export request/response schemas
│ │ ├── resumeSchemas.ts # Resume CRUD schemas
│ │ ├── roadmapSchemas.ts # Roadmap query/mutation schemas
│ │ └── userSchemas.ts # User account schemas
│ │
│ └── db/ # Database utilities (optional, often in Prisma)
│ └── (Prisma client, seed utilities)
│
├── prisma/
│ ├── schema.prisma # Prisma ORM schema (database source of truth)
│ └── migrations/ # Auto-generated migration files from Prisma
│
├── tests/
│ ├── integration/ # End-to-end API tests
│ │ ├── exports.test.ts # Export endpoint tests
│ │ ├── resumes.test.ts # Resume CRUD tests
│ │ └── auth.test.ts # Authentication flow tests
│ ├── unit/ # Isolated function tests
│ │ ├── services/
│ │ └── utils/
│ └── fixtures/ # Mock data, database factories
│
├── package.json # Dependencies, scripts
├── tsconfig.json # TypeScript configuration
├── vitest.config.ts # Vitest test runner config
├── Dockerfile # Production container image
├── README.md # (This file)
├── DETAILS.md # Deep-dive technical documentation
├── QUICK_START.md # Local dev setup guide
└── README.Docker.md # Docker deployment guide

```

---

## 🏗️ Architecture Overview

### Request Flow

```

Client (resume-builder app)
↓
HTTP Request → CORS Middleware
↓
Auth Middleware (session/JWT validation)
↓
Rate Limit Middleware (sliding window check)
↓
Logging Middleware (Pino structured logs)
↓
Route Handler (specific endpoint)
↓
Controller (HTTP concerns: parse body, status codes)
↓
Service Layer (business logic, Prisma/Redis calls)
↓
Database/Cache (Postgres/Redis response)
↓
Response → Error Handler (standardized JSON)
↓
Client (HTTP 200/201/400/500)

```

### Data Flow (Resume Export Example)

```

1. Frontend calls POST /api/v1/exports with resume data
2. exportController validates request with Zod
3. exportController calls exportQueueService.submitJob()
4. Job queued in BullMQ (Redis) with unique job ID
5. Frontend polls GET /api/v1/exports/:jobId for status
6. BullMQ worker processes job:
   - exportService creates HTML from resume data
   - Playwright spins up headless Chromium
   - Renders resume with ATS-friendly CSS (no grid, simple floats)
   - Captures PDF/PNG/JPG output
   - Stores artifact in exportArtifactStore (S3 or local fs)
7. Frontend polls until status = "completed"
8. Artifact download link returned to user
9. Job cleaned up from Redis after TTL

```

---

## 🔐 Authentication & Security

### Better-Auth Integration

The server uses **Better-Auth** for secure, modern passwordless authentication:

- **Magic Link Flow**: User enters email → server sends OTP link → user clicks → session created
- **OTP Flow**: User enters email → server sends code → user enters code → session created
- **Social OAuth**: Google/GitHub buttons redirect to OAuth → callback → session created
- **Session Management**: Database-backed sessions with secure HTTP-only cookies
- **API Keys**: Internal services authenticate via `X-API-Key` header (internalAuth middleware)

**Session Lifecycle**:
```

User logs in via magic link
↓
Better-Auth creates session record in db.session
↓
Server sets secure, HTTP-only cookie (SameSite=Lax)
↓
Subsequent requests include cookie
↓
auth.ts middleware validates cookie → req.user populated
↓
Controller/service accesses req.user.id for authorization

```

### Security Middleware Stack

1. **Helmet**: Sets HTTP security headers (X-Frame-Options, X-Content-Type-Options, etc.)
2. **CORS**: Whitelist specific origins (resume-builder frontend, domain)
3. **Rate Limiting**: 100 requests per 15 minutes per IP
4. **Auth Middleware**: Validates session before protected routes
5. **Admin Auth**: Special middleware to verify admin role
6. **Input Validation**: Zod schemas reject malformed requests before processing

---

## 🗄️ Database & Persistence

### Prisma ORM + PostgreSQL (Neon)

The database is the single source of truth for all user data. Prisma manages schema, migrations, and provides type-safe query generation.

**Key Models** (defined in `prisma/schema.prisma`):
```

User {
id: String @id @default(cuid())
email: String @unique
name: String?
role: "user" | "admin"
createdAt: DateTime
resumes: Resume[] // User's resumes
sessions: Session[] // Active sessions
roadmapVotes: RoadmapVote[]
}

Resume {
id: String @id @default(cuid())
userId: String
title: String
data: Json // Serialized resume content
template: String // e.g., "ats-classic", "modern"
status: "draft" | "published"
createdAt: DateTime
updatedAt: DateTime
shares: ShareLink[]
}

RoadmapFeature {
id: String @id
title: String
status: "backlog" | "in-progress" | "completed"
votesCount: Int
votes: RoadmapVote[]
createdAt: DateTime
}

Session {
id: String @id
userId: String
expiresAt: DateTime
data: Json // Session metadata
}

ShareLink {
token: String @unique
resumeId: String
expiresAt: DateTime? // Optional expiration
viewCount: Int
}

```

**Migrations**: Managed automatically by Prisma. Run `npm run db:push` or `npm run db:migrate` to apply schema changes.

**Connection String**: Loaded from `DATABASE_URL` env var (typically Neon.tech PostgreSQL connection string).

---

## 💾 Caching & Performance

### Redis Strategy

Redis caches frequently accessed data to reduce database load:

- **Public Roadmap**: 1-hour TTL (invalidated on admin updates)
- **User Statistics**: 30-minute TTL
- **Session Store**: Backed by database; Redis used for fast lookup
- **Rate Limiter**: Sliding window buckets stored in Redis
- **BullMQ Jobs**: Job queue, results, and metadata

**Cache-Aside Pattern**:
```

1. Check Redis cache for key
2. If found, return cached data
3. If miss, query Postgres
4. Store result in Redis with TTL
5. Return to client

````

---

## 📊 Public API Endpoints

### Resumes
- `GET /api/v1/resumes` - List user's resumes (requires auth)
- `POST /api/v1/resumes` - Create resume (requires auth)
- `GET /api/v1/resumes/:id` - Get resume details (requires auth + ownership)
- `PUT /api/v1/resumes/:id` - Update resume (requires auth + ownership)
- `DELETE /api/v1/resumes/:id` - Delete resume (requires auth + ownership)

### Exports
- `POST /api/v1/exports` - Submit export job (returns jobId)
- `GET /api/v1/exports/:jobId` - Poll export status
- `GET /api/v1/exports/:jobId/download` - Download artifact (PDF/PNG/JPG)

### Roadmap (Public)
- `GET /api/v1/roadmap` - List all features with pagination, filtering, sorting
- `GET /api/v1/roadmap/tags` - List available feature tags
- `GET /api/v1/roadmap/stats` - Aggregated voting statistics
- `POST /api/v1/roadmap/:id/vote` - Vote on a feature (requires auth)

### User Profiles
- `GET /api/v1/profiles/:userId` - Public user profile info
- `GET /api/v1/users/me` - Current authenticated user details
- `POST /api/v1/users/logout` - Invalidate session

### Sharing
- `POST /api/v1/shares` - Create share link for resume (returns token)
- `GET /api/v1/shares/:token` - Redeem share link (returns resume data)

### Health & Admin
- `GET /api/v1/health` - Liveness probe (returns 200 if operational)
- `POST /api/v1/admin/stats/refresh` - Recompute statistics (admin only)
- `POST /api/v1/admin/roadmap/sync` - Sync roadmap from source (admin only)

---

## 🔗 Integration with Resume Builder Frontend

The resume builder (`apps/resume-builder`) interacts with this backend in several key ways:

### Authentication Flow
1. User navigates to resume-builder frontend
2. Frontend redirects to `/auth/login` or shows magic link form
3. Frontend calls `POST /api/v1/auth/signin` with email
4. Backend (Better-Auth) sends magic link email
5. User clicks link → backend validates token → creates session
6. Frontend reads session cookie (set by backend)
7. Subsequent frontend API calls include session cookie (automatically by browser)

### Resume Operations
1. User creates/edits resume in editor
2. Frontend auto-saves via `PUT /api/v1/resumes/:id` with JSON body
3. Backend validates with Zod schema, stores in Postgres via Prisma
4. Frontend UI updates with response (timestamp, version info)
5. On logout, frontend clears local cache; server invalidates session

### PDF/Export Generation
1. User clicks "Download PDF" in resume editor toolbar
2. Frontend calls `POST /api/v1/exports` with:
   ```json
   {
     "resumeId": "cuid123",
     "format": "pdf",
     "template": "ats-classic",
     "exportedHtml": "<html>...</html>"
   }
````

3. Backend queues BullMQ job, returns `{ jobId, status: "queued" }`
4. Frontend polls `GET /api/v1/exports/:jobId` every 500ms
5. Backend worker processes job:
   - Spins up Playwright headless Chromium
   - Renders provided HTML with ATS-safe CSS
   - Generates PDF (no fancy fonts/colors, simple layout for parsing)
   - Stores in exportArtifactStore
   - Updates job status to "completed" with download URL
6. Frontend receives URL, shows download button or opens in new tab

### Share Links

1. User generates share link in editor
2. Frontend calls `POST /api/v1/shares` with resumeId
3. Backend creates ShareLink record, returns token
4. Frontend generates URL: `veriworkly.com/share/:token`
5. Friend visits URL → browser calls `GET /api/v1/shares/:token`
6. Backend returns resume JSON (without user email/sensitive data)
7. Frontend renders read-only preview

---

## 📄 PDF Generation Details

### Playwright Headless Chromium

The server uses Playwright's headless Chromium for backend PDF generation. This ensures ATS (Applicant Tracking System) compatibility and visual consistency.

**Why Backend PDF?**

- Frontend HTML2Canvas can produce blank/partial images (foreignObject rendering issues)
- Server has headless Chromium pre-built and optimized for PDF
- Asynchronous processing doesn't block frontend UI
- Server caching/reuse of browser instance improves throughput

**PDF Pipeline**:

```
1. exportService receives resume JSON
2. Renders resume to HTML via template engine
3. Injects ATS-safe CSS:
   - No CSS Grid (use floats/flexbox)
   - No fancy fonts (use system fonts)
   - No gradients/complex styling
   - Fixed font sizes (pt, not px)
4. Playwright launches headless Chromium
5. Sets page content and viewport (A4, 8.5x11")
6. Calls page.pdf() to generate PDF buffer
7. Stores buffer in exportArtifactStore (S3 or local FS)
8. Returns download URL
```

**ATS-Friendly CSS Principles**:

- Simple semantic HTML structure
- Linear flow (no absolute positioning)
- Standard font families (Arial, Times New Roman, Helvetica)
- Plain text emphasis (bold, italic) instead of custom styling
- No embedded images unless necessary

---

## 🚀 Development Setup

### Prerequisites

- **Node.js**: 20+ (check with `node --version`)
- **PostgreSQL**: 14+ (local or Neon.tech account)
- **Redis**: 6+ (local Docker or cloud)
- **Git**: For cloning and version control

### Local Development

**1. Clone repository and install dependencies**:

```bash
git clone https://github.com/veriworkly/veriworkly.git
cd veriworkly
npm install
```

**2. Set up environment variables** (`.env` in `apps/server/`):

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/veriworkly_dev

# Redis
REDIS_URL=redis://localhost:6379

# Better-Auth
BETTER_AUTH_SECRET=your-random-secret-key-here
BETTER_AUTH_URL=http://localhost:8080

# Email (for magic links)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# External Services
GITHUB_CLIENT_ID=your-github-oauth-app-id
GITHUB_CLIENT_SECRET=your-github-oauth-secret

# AWS S3 (for artifact storage, optional; can use local FS)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=veriworkly-exports
AWS_REGION=us-east-1

# Admin API Key
INTERNAL_API_KEY=your-internal-service-key

# Environment
NODE_ENV=development
PORT=8080
FRONTEND_URL=http://localhost:3000
```

**3. Set up database**:

```bash
# Push Prisma schema to database
npm run db:push -w @veriworkly/server

# Optional: Open Prisma Studio to view/edit data
npm run db:studio -w @veriworkly/server
```

**4. Start development server**:

```bash
npm run dev -w @veriworkly/server
```

Server runs at `http://localhost:8080`. Test with:

```bash
curl http://localhost:8080/api/v1/health
# Response: { "status": "ok", "timestamp": "2026-04-28T..." }
```

**5. Start resume-builder frontend** (separate terminal):

```bash
npm run dev -w @veriworkly/resume-builder
```

Frontend runs at `http://localhost:3000`.

---

## 📦 Docker Deployment

### Build Image

```bash
docker build -f apps/server/Dockerfile -t veriworkly-server:latest .
```

### Run Container

```bash
docker run -d \
  --name veriworkly-server \
  -p 8080:8080 \
  -e DATABASE_URL="postgresql://user:pass@postgres-host:5432/veriworkly" \
  -e REDIS_URL="redis://redis-host:6379" \
  -e NODE_ENV="production" \
  -e BETTER_AUTH_SECRET="your-secret" \
  -e BETTER_AUTH_URL="https://api.yourdomain.com" \
  veriworkly-server:latest
```

See [README.Docker.md](README.Docker.md) for compose and orchestration details.

---

## 🧪 Testing

Run all tests:

```bash
npm test -w @veriworkly/server
```

Run specific test file:

```bash
npm test -- exports.test.ts
```

Run with coverage:

```bash
npm test -- --coverage
```

Tests use Vitest + Supertest for HTTP assertions. See `tests/` directory for examples.

---

## 📚 Further Reading

- **[DETAILS.md](DETAILS.md)**: Deep-dive into database schema, Prisma patterns, caching strategy
- **[QUICK_START.md](QUICK_START.md)**: Step-by-step local setup
- **[README.Docker.md](README.Docker.md)**: Containerization and production deployment
- **[README.Local.md](README.Local.md)**: Docker Compose for local dev (Postgres + Redis)

---

## 🆘 Troubleshooting

**"Cannot connect to database"**:

- Verify `DATABASE_URL` env var is correct
- Check PostgreSQL is running: `psql -c "SELECT 1"`
- For Neon: Test connection via Neon console dashboard

**"Redis connection refused"**:

- Verify `REDIS_URL` env var
- Check Redis is running: `redis-cli ping`
- For local dev, use Docker: `docker run -d -p 6379:6379 redis:7`

**"Session not persisting"**:

- Ensure `BETTER_AUTH_SECRET` is set and consistent
- Check cookie settings: Browser DevTools → Application → Cookies
- Verify `BETTER_AUTH_URL` matches backend origin

**"PDF export hangs"**:

- Check Playwright Chromium is installed: `npx playwright install chromium`
- Verify `exportArtifactStore` (S3 or local FS) is accessible
- Check server logs for Playwright errors: `DEBUG=pw:api npm run dev`

**"Rate limit errors (429)"**:

- Legitimate burst? Increase limit in `rateLimit.ts` middleware
- Check for bot traffic in logs (`logging.ts`)
- Implement exponential backoff on frontend

---

## 📝 Contributing

Follow the [CONTRIBUTING.md](../../../CONTRIBUTING.md) guide for code style, commit messages, and PR workflow.

Key guidelines:

- Use TypeScript strict mode
- Write tests for new features/services
- Update Prisma schema + migrations for DB changes
- Use Zod for API contract validation
- Keep services decoupled from HTTP layer

---

## 📜 License

© 2026 VeriWorkly Team. Licensed under [LICENSE](../../../LICENSE).
