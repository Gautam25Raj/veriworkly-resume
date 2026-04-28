# ⚙️ Environment Setup Guide

VeriWorkly uses a multi-layered environment configuration to handle the complexity of the monorepo.

## 📁 Environment Files Locations

| File               | Application           | Purpose                                          |
| :----------------- | :-------------------- | :----------------------------------------------- |
| `.env`             | Root / Resume Builder | Frontend public variables and shared configs.    |
| `apps/server/.env` | Backend API           | Database, Auth, and Secret keys.                 |
| `.env.docker`      | Docker Compose        | Container-specific networking and orchestration. |

---

## 🌐 Frontend Variables (`.env`)

These variables are prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

| Variable                  | Description                        | Default                        |
| :------------------------ | :--------------------------------- | :----------------------------- |
| `NEXT_PUBLIC_BACKEND_URL` | The public URL of the Backend API. | `http://localhost:8080/api/v1` |

---

## 🗄️ Backend Variables (`apps/server/.env`)

These are sensitive and should never be exposed to the client.

### 🔴 Required

- `DATABASE_URL`: PostgreSQL connection string (e.g., Neon.tech).
- `AUTH_SECRET`: Secret key for Better-Auth. Generate with `openssl rand -base64 32`.
- `JWT_SECRET`: Secret for signing JWT tokens.

### 🟡 Recommended (Infrastructure)

- `REDIS_URL`: Redis connection string (e.g., `redis://localhost:6379`).
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins.

---

## 🐳 Docker Variables (`.env.docker`)

Used when running via `docker compose`.

- `DATABASE_URL`: External database connection.
- `REDIS_URL`: Should be `redis://redis:6379` (using the service name).
- `NEXT_PUBLIC_BACKEND_URL`: Public-facing API URL.

---

## 🔐 Generating Secure Secrets

To generate strong, random strings for your secrets, use the following command:

```bash
openssl rand -base64 32
```

Use the output for:

- `AUTH_SECRET`
- `JWT_SECRET`

---

## ⚠️ Best Practices

1. **Never commit `.env` files** to version control. They are ignored by `.gitignore`.
2. **Use `.env.example`** as a template when adding new variables.
3. **Keep secrets unique** across development, staging, and production environments.
