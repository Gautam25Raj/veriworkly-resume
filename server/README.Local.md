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
