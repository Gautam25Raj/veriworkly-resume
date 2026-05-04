# Environment Variables Configuration

VeriWorkly requires specific environment variables to function correctly across the frontend and backend.

## 🔑 Critical Variables

### Backend (`apps/server/.env`)
- `DATABASE_URL`: PostgreSQL connection string.
- `REDIS_URL`: Redis connection string.
- `AUTH_SECRET`: Random secure string for authentication.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: For sending OTP emails.

### Frontend (`.env`)
- `NEXT_PUBLIC_API_URL`: URL of the backend server (default: `http://localhost:8080/api/v1`).
- `NEXT_PUBLIC_APP_URL`: URL of the frontend (default: `http://localhost:3000`).

## 📚 Detailed Variable Reference

For a full list of all available configuration options and their defaults, visit:
[Environment Variables Guide - VeriWorkly Docs](https://docs.veriworkly.com/docs/operations/environment-variables)
