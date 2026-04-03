## 🐳 Docker Production Setup

This project uses a single root `compose.yaml` to run all required services in a production-like environment.

### Services

The root compose.yaml orchestrates the following:

- **web** → Next.js application (production standalone build)
- **api** → Node.js / Express backend (runs inside Next.js project)
- **redis** → Redis cache
- **database** → External Neon PostgreSQL (via `DATABASE_URL`)

> PostgreSQL is **not containerized** and is expected to be provided externally.

---

## ⚙️ Prerequisites

Make sure you have:

- Docker Engine **24+**
- Docker Compose **v2+**
- A valid **Neon PostgreSQL connection string**

---

## 🧱 Architecture Overview

```text
Browser
   ↓
Next.js (web)
   ↓
Express API (server/)
   ↓
PostgreSQL (Neon)
   ↓
Redis (cache)
```

---

## 📦 1. Setup Environment Variables

Copy the example files:

| File                  | Purpose                         |
| --------------------- | ------------------------------- |
| `.envdocker.example`  | Root (Docker-specific config)   |
| `.env.example`        | Root (frontend + shared config) |
| `server/.env.example` | Backend-specific config         |

### Docker Environment Variables (`.env.docker`)

```bash
cp .env.docker.example .env.docker
```

### Frontend & Shared Variables (`.env`)

```bash
cp .env.example .env
```

### Backend Variables (`server/.env`)

```bash
cp server/.env.example server/.env
```

---

## 🚀 2. Build & Start Services

Run the application in production mode:

```bash
docker compose --env-file .env.docker up -d --build
```

---

## 🔍 3. Verify Services

Once running:

- **Frontend** → http://localhost:3000
- **API Health** → http://localhost:8080/api/v1/health

Check running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

or

```bash
docker compose logs -f web
docker compose logs -f api
docker compose logs -f redis
```

---

## 🛑 Stop

Stop all containers:

```bash
docker compose down
```

Remove volumes (⚠️ deletes Redis data):

```bash
docker compose down -v
```

---

## ⚠️ Configuration Notes

### 🌐 API URLs

- `NEXT_PUBLIC_BACKEND_URL`
  → Must be accessible from the browser
  → Example: `http://localhost:8080/api/v1`

- `BACKEND_INTERNAL_URL`
  → Used for internal communication between containers
  → Example: `http://api:8080/api/v1`

---

### 🗄 Database

- Uses **Neon (managed PostgreSQL)**
- Do **not** add a local Postgres container in production

---

### ⚡ Redis

- Used for caching
- Runs as a container in Docker setup

---

## 🧩 Notes for Contributors

- The backend lives inside the `server/` directory
- It is containerized separately as the `api` service
- Frontend and backend communicate via:
  - Public URL (browser)
  - Internal Docker network (service name)

---

## 🚀 Production Recommendations

- Use a reverse proxy / TLS terminator:
  - Nginx
  - Traefik
  - Cloud Load Balancer

- Store secrets securely:
  - Docker secrets
  - Cloud environment variables
