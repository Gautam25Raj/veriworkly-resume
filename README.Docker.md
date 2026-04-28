# 🐳 VeriWorkly Docker Deployment Guide

VeriWorkly is designed to be fully self-hostable using Docker. We use a centralized `compose.yaml` to orchestrate all micro-applications and services.

## 🏗️ Dockerized Services

| Service          | Application         | Internal Port | External Port |
| :--------------- | :------------------ | :------------ | :------------ |
| `resume-builder` | Core Resume Editor  | 3000          | 3000          |
| `server-api`     | Backend API Service | 8080          | 8080          |
| `docs-platform`  | Documentation Hub   | 3001          | 3001          |
| `blog-platform`  | Official Blog       | 3002          | 3002          |
| `redis`          | Cache & Queue Layer | 6379          | -             |

---

## ⚙️ Prerequisites

- **Docker Engine 24+**
- **Docker Compose v2+**
- A **PostgreSQL** instance (Managed Neon or local container)

---

## 🚀 1. Configuration

Before building, ensure you have your environment files ready:

```bash
# Docker-specific global config
cp .env.docker.example .env.docker

# Application-specific configs
cp .env.example .env
cp apps/server/.env.example apps/server/.env
```

### Key Docker Variables (`.env.docker`)

- `DOCKER_IMAGE_TAG`: Versioning for your images.
- `DATABASE_URL`: PostgreSQL connection string.
- `REDIS_URL`: Should point to the `redis` service name (e.g., `redis://redis:6379`).

---

## 🧱 2. Build & Deploy

To build and start all services in detached mode:

```bash
docker compose --env-file .env.docker up -d --build
```

---

## 🔍 3. Monitoring & Management

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f resume-builder
```

### Check Health

- **Resume Builder**: `http://localhost:3000`
- **API Health**: `http://localhost:8080/api/v1/health`
- **Docs**: `http://localhost:3001`
- **Blog**: `http://localhost:3002`

---

## 🛠️ 4. Maintenance

### Update Images

```bash
git pull
docker compose build --no-cache
docker compose up -d
```

### Cleanup

```bash
# Stop and remove containers
docker compose down

# Stop and remove everything including volumes (⚠️ deletes local data)
docker compose down -v
```

---

## 🔒 Security Best Practices

1. **Reverse Proxy**: Use Nginx or Traefik as a gateway to handle SSL/TLS.
2. **Internal Network**: All backend communication (API <-> Redis <-> DB) should stay within the Docker bridge network.
3. **Secrets**: Use Docker Secrets or environment-level masking for production credentials.
