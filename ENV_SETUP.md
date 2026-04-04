# ⚙️ Environment Setup

VeriWorkly Resume requires several environment variables to function correctly, especially for backend features like sharing and the roadmap.

> This project uses multiple environment files depending on how you run the application.

## 📁 Environment Files Overview

| File           | Purpose                               |
| -------------- | ------------------------------------- |
| `.env`         | Frontend + shared configuration       |
| `server/.env`  | Backend configuration                 |
| `.env.docker`  | Docker-specific environment settings  |
| `.env.example` | Full list of all variables (template) |

> Always use `.env.example` as the source of truth for all available variables.

---

## 🌐 Frontend & Shared Variables (`.env`)

Located in the **root directory**.

| Variable                  | Description                                 | Default                        |
| ------------------------- | ------------------------------------------- | ------------------------------ |
| `NEXT_PUBLIC_BACKEND_URL` | The public URL of your API                  | `http://localhost:8080/api/v1` |
| `ADMIN_EMAIL`             | Email for admin access (roadmap management) | -                              |

---

## 🗄 Backend Variables (`server/.env`)

Located in the **`/server` directory**.

---

### 🔴 Required

| Variable       | Description                     |
| -------------- | ------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string    |
| `AUTH_SECRET`  | Secret for session/auth signing |
| `JWT_SECRET`   | Secret for JWT tokens           |

---

### 🟡 Recommended

| Variable          | Description                 |
| ----------------- | --------------------------- |
| `REDIS_URL`       | Redis connection string     |
| `REDIS_HOST`      | Redis host                  |
| `REDIS_PORT`      | Redis port                  |
| `ALLOWED_ORIGINS` | Allowed CORS origins        |
| `AUTH_BASE_URL`   | Base URL for auth callbacks |

---

### 🔵 Optional

#### Email (Nodemailer)

- `AUTH_EMAIL_PROVIDER` → `smtp` or `console` (dev)
- `AUTH_SMTP_HOST`
- `AUTH_SMTP_PORT`
- `AUTH_SMTP_USER`
- `AUTH_SMTP_PASS`

---

## 🐳 Docker Environment (`.env.docker`)

Used when running via Docker Compose.

---

### Required

| Variable       | Description                            |
| -------------- | -------------------------------------- |
| `DATABASE_URL` | External PostgreSQL (Neon recommended) |
| `AUTH_SECRET`  | Auth secret                            |
| `JWT_SECRET`   | JWT secret                             |

---

### Important

| Variable                  | Description                     | Example                        |
| ------------------------- | ------------------------------- | ------------------------------ |
| `NEXT_PUBLIC_BACKEND_URL` | Public API URL (browser access) | `http://localhost:8080/api/v1` |
| `BACKEND_INTERNAL_URL`    | Internal container API URL      | `http://api:8080/api/v1`       |

---

## 🔒 Generating Secrets

Generate secure values for secrets:

```bash id="bqz3mz"
openssl rand -base64 32
```

Use this for:

- `AUTH_SECRET`
- `JWT_SECRET`

---

## 📌 Full Variable Reference

All available environment variables — including advanced and internal ones — are defined in:

```id="jv2m8m"
.env.example
server/.env.example
```

> These files act as the **single source of truth**.

---

## ⚠️ Best Practices

- Never commit `.env` or `.env.docker`
- Always start from `.env.example`
- Use strong, unique secrets in production
- Prefer `REDIS_URL` over host/port for simplicity
- Keep environment values consistent across frontend and backend

---

## 🧠 Notes

- Some variables are **internal tuning parameters** (cache TTLs, session configs, etc.)
- These are intentionally **not documented here** to keep setup simple
- Refer to `.env.example` if you need advanced configuration
