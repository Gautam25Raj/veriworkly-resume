# 🤖 Agent Context: VeriWorkly Core

This file provides a unified context for AI agents (Claude, Gemini, OpenAI) to understand the VeriWorkly project instantly.

## 🏛️ Project Identity
- **Name**: VeriWorkly
- **Mission**: Professional, Privacy-First Resume Building.
- **Architecture**: Monorepo with npm workspaces.

## 📁 Key Directories for Agents
- `apps/resume-builder`: Main Next.js app (Editor & UI).
- `apps/server`: Backend API (Auth, Database, Logic).
- `apps/docs-platform`: Documentation Hub.
- `apps/blog-platform`: Company Blog.
- `packages/ui`: Shared Design System.

## 🛠️ Technical Stack (Cheat Sheet)
- **Frontend**: Next.js 15, React 19, Tailwind CSS 4, Zustand.
- **Backend**: Node.js, Express, Prisma, Redis.
- **Auth**: Better-Auth (OTP/Social).
- **Docs**: Fumadocs.

## 📜 Development Rules
1. **Local-First**: Always prioritize client-side state (Zustand) over server-side storage for user data.
2. **Shared UI**: Never create ad-hoc components in apps if they can be in `packages/ui`.
3. **Type Safety**: Everything must be strictly typed with TypeScript.
4. **API Sync**: Always update `specs/openapi.yaml` when changing backend routes.

## 🚀 Commands
- `npm run dev`: Start Builder.
- `npm run dev:all`: Start everything.
- `npm run generate:api`: Sync API docs.

---

For detailed implementation notes, see `PROJECT_DETAILS.md` and `PROJECT_ARCHITECTURE.md` in the root.
