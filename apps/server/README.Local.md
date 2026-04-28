## ⚙️ Backend (Express API)

This directory contains the **Express backend** and Prisma database layer for the application.

---

## 🧱 Overview

- Built with **Express + TypeScript**
- Uses **Prisma ORM**
- Connects to **PostgreSQL (Neon)**
- Supports **Redis caching & rate limiting**
- Provides API consumed by the Next.js frontend

---

## 🚀 Local Development

Run the backend locally:

```bash
npm install
npm run dev
```

Server runs on:

- http://localhost:8080

---

## 🗄 Database Commands

### Push schema (quick setup)

```bash
npm run db:push
```

### Run migrations (recommended)

```bash
npm run db:migrate
```

### Open Prisma Studio (optional)

```bash
npm run db:studio
```

---

## 📦 Build & Start

```bash
npm run build
npm start
```

---

## ⚠️ Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Make sure the following are set:

- `DATABASE_URL`
- `AUTH_SECRET`
- `JWT_SECRET`

For export reliability and scalability, also configure:

- `EXPORT_ARTIFACT_PROVIDER` (`local` or `oci`)
- `EXPORT_RESULT_TTL_MS` (recommended `300000` to `600000`)
- `EXPORT_ARTIFACT_LOCAL_DIR` (when provider is `local`)
- `EXPORT_ARTIFACT_OCI_*` (when provider is `oci`)

## 📤 Export Artifact Storage

The export queue stores only artifact metadata in Redis. Binary payloads (PDF/PNG/JPG) are written to the configured artifact store.

### Local Disk Provider

- Set `EXPORT_ARTIFACT_PROVIDER=local`
- Artifacts are written under `EXPORT_ARTIFACT_LOCAL_DIR`
- Cleanup runs periodically using:
  - `EXPORT_ARTIFACT_LOCAL_CLEANUP_INTERVAL_MS`
  - `EXPORT_ARTIFACT_LOCAL_CLEANUP_GRACE_MS`

### OCI Provider (S3-Compatible)

- Set `EXPORT_ARTIFACT_PROVIDER=oci`
- Configure:
  - `EXPORT_ARTIFACT_OCI_ENDPOINT`
  - `EXPORT_ARTIFACT_OCI_REGION`
  - `EXPORT_ARTIFACT_OCI_BUCKET`
  - `EXPORT_ARTIFACT_OCI_ACCESS_KEY_ID`
  - `EXPORT_ARTIFACT_OCI_SECRET_ACCESS_KEY`
  - Optional: `EXPORT_ARTIFACT_OCI_KEY_PREFIX`, `EXPORT_ARTIFACT_OCI_FORCE_PATH_STYLE`

Recommended production practice:

- Apply object lifecycle policies in OCI for automatic cleanup.
- Keep Redis TTLs short and predictable (`5-10` minutes).

## ✅ Local Provider Production Baseline

Use this baseline if you are not integrating OCI/S3 yet.

- `EXPORT_ARTIFACT_PROVIDER=local`
- `EXPORT_RESULT_TTL_MS=600000`
- `EXPORT_RENDER_CACHE_TTL_MS=300000`
- `EXPORT_ARTIFACT_LOCAL_DIR=tmp/export-artifacts`
- `EXPORT_ARTIFACT_LOCAL_CLEANUP_INTERVAL_MS=120000`
- `EXPORT_ARTIFACT_LOCAL_CLEANUP_GRACE_MS=120000`
- `EXPORT_MAX_CONCURRENCY=2` (increase only after CPU/RAM validation)
- `EXPORT_MAX_QUEUED=120`

## 🧪 Post-Deploy Verification

Run this inside `server/` after deployment:

```bash
npm run verify:exports:local
```

Optional live API probe:

```bash
VERIFY_API_BASE_URL=http://localhost:8080 npm run verify:exports:local
```

What this checks:

- Redis pointer metadata can be written/read
- Binary artifact write/read via local provider
- Expired artifacts are no longer readable
- Optional health endpoint availability

## 🔁 Rollback Switches

If export behavior regresses, use this quick rollback:

1. Keep provider local:

- `EXPORT_ARTIFACT_PROVIDER=local`

2. Reduce pressure:

- `EXPORT_MAX_CONCURRENCY=1`
- `EXPORT_MAX_QUEUED=60`

3. Extend availability window temporarily:

- `EXPORT_RESULT_TTL_MS=900000`
- `EXPORT_ARTIFACT_LOCAL_CLEANUP_GRACE_MS=300000`

4. Restart backend and re-run:

- `npm run verify:exports:local`

---

## 🔗 API Usage

The API is available at:

```
http://localhost:8080/api/v1
```

Health check endpoint:

```
http://localhost:8080/api/v1/health
```

---

## 🐳 Docker Note

Docker orchestration is managed at the **repository root**.

Run from root:

```bash
docker compose --env-file .env.docker up -d --build
```

For full setup and production configuration:

👉 See `README.Docker.md`

---

## 🧩 Notes

- This backend is part of a full-stack application (not standalone)
- Runs independently during local development
- Communicates with frontend via REST API
- Uses Prisma for schema management and migrations
