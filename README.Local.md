# 🚀 VeriWorkly Local Development Guide

This guide covers the manual setup process for running the VeriWorkly ecosystem on your local machine.

## ⚙️ Prerequisites

- **Node.js 20+** (LTS recommended)
- **npm** (v10+)
- **PostgreSQL** (Local or [Neon.tech](https://neon.tech))
- **Redis** (Local or [Upstash](https://upstash.com))

---

## ⚡ Quick Start (Monorepo Workflow)

The VeriWorkly repository uses **npm workspaces**. You can manage all applications from the root directory.

```bash
# 1. Clone and Install
git clone https://github.com/Gautam25Raj/veriworkly-resume.git
cd veriworkly-resume
npm install

# 2. Setup Environment
cp .env.example .env
cp apps/server/.env.example apps/server/.env

# 3. Setup Database
npm run db:push -w @veriworkly/server

# 4. Run Everything
npm run dev:all
```

---

## 📦 1. Installation

Install all dependencies for the entire monorepo with a single command:

```bash
npm install
```

---

## 🔐 2. Environment Configuration

### Root `.env` (Frontend & Shared)

Used primarily by the Resume Builder.

- `NEXT_PUBLIC_BACKEND_URL`: URL of your API (Default: `http://localhost:8080/api/v1`)

### `apps/server/.env` (Backend)

Required for the API service.

- `DATABASE_URL`: Your PostgreSQL connection string.
- `AUTH_SECRET`: Generate using `openssl rand -base64 32`.
- `JWT_SECRET`: Secret for token signing.
- `REDIS_URL`: Connection string for Redis.

---

## 🗄️ 3. Database Setup

VeriWorkly uses **Prisma** for database management.

```bash
# Push schema to database
npm run db:push -w @veriworkly/server

# Run migrations (production/dev)
npm run db:migrate -w @veriworkly/server

# Open Prisma Studio (GUI)
npm run db:studio -w @veriworkly/server
```

---

## 🚀 4. Running the Applications

You can run apps individually or all at once.

| Command              | Action                                   |
| :------------------- | :--------------------------------------- |
| `npm run dev`        | Starts Resume Builder (`localhost:3000`) |
| `npm run dev:server` | Starts Backend API (`localhost:8080`)    |
| `npm run dev:docs`   | Starts Docs Platform (`localhost:3001`)  |
| `npm run dev:blog`   | Starts Blog Platform (`localhost:3002`)  |
| `npm run dev:all`    | Starts **everything** in parallel        |

---

## 🧪 5. Testing & Quality

```bash
# Lint the whole project
npm run lint

# Format the whole project
npm run format:write

# Run backend tests
npm test -w @veriworkly/server

# Run frontend tests
npm run test:contracts -w @veriworkly/resume-builder
```

---

## ⚠️ Troubleshooting

- **Redis Error**: Ensure Redis is running locally. If not, the server will fall back to in-memory mode but some features (Rate limiting) might be degraded.
- **Port Conflicts**: If port 3000, 8080, 3001, or 3002 are occupied, Next.js/Express will try to find the next available port.
- **Prisma Client**: If you see missing type errors, run `npx prisma generate -w @veriworkly/server`.
