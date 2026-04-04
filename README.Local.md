# 🚀 VeriWorkly Resume

A full-stack resume builder platform built with **Next.js (App Router)** and an integrated **Express backend**, powered by **Neon PostgreSQL** and **Redis**.

## 💻 Local Development Setup

This project runs as:

- **Frontend** → Next.js (port 3000)
- **Backend** → Express (port 8080)

---

## ⚙️ Prerequisites

- Node.js **20+**
- npm / pnpm / yarn
- PostgreSQL database (Neon recommended)
- Redis (recommended)

---

## ⚡ Quick Start

```bash
git clone https://github.com/Gautam25Raj/veriworkly-resume
cd veriworkly-resume

# install dependencies
npm install
cd server && npm install

# setup env
cp .env.example .env
cp server/.env.example server/.env

# setup database
cd server
npm run db:push

# run backend
npm run dev

# in another terminal → run frontend
npm run dev
```

---

## 📦 1. Install Dependencies

```bash
npm install
cd server && npm install
```

---

## 🔐 2. Setup Environment Variables

```bash
cp .env.example .env
cp server/.env.example server/.env
```

Update required values:

- `DATABASE_URL`
- `AUTH_SECRET`
- `JWT_SECRET`

---

## 🗄 3. Setup Database

```bash
cd server
npm run db:push
```

Or (recommended):

```bash
npm run db:migrate
```

Optional:

```bash
npm run db:studio
```

---

## 🚀 4. Run Development Servers

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
npm run dev
```

---

## 📦 Production Build

### Frontend

```bash
npm run build
npm start
```

### Backend

```bash
cd server
npm run build
npm start
```

---

## 📜 Scripts Overview

### Frontend

- `npm run dev`
- `npm run build`
- `npm start`

---

### Backend (`server/`)

#### Core

- `npm run dev`
- `npm run build`
- `npm start`

#### Database

- `npm run db:push`
- `npm run db:migrate`
- `npm run db:studio`

---

## ⚠️ Configuration Notes

### 🌐 API Configuration

- `NEXT_PUBLIC_BACKEND_URL`
  → Used in browser
  → Example:

  ```
  http://localhost:8080/api/v1
  ```

---

### 🔐 Security

Always set strong values for:

- `AUTH_SECRET`
- `JWT_SECRET`

---

## ⚡ Redis (Recommended)

Redis is used for caching and rate limiting. While optional, it is **strongly recommended** for full functionality.

---

### 🚀 Option 1: Run with Docker (Recommended)

```bash
docker run -d -p 6379:6379 --name redis redis:7
```

---

### 🖥 Option 2: Local Installation

#### macOS (Homebrew)

```bash
brew install redis
brew services start redis
```

#### Ubuntu / Debian

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis
```

---

### ⚙️ Environment Configuration

Set one of the following in your `.env`:

```env
REDIS_URL=redis://localhost:6379
```

or

```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

### 🧪 Verify Redis

```bash
redis-cli ping
```

Expected response:

```
PONG
```

---

## 🐳 Docker Setup

For production-like setup using Docker:

👉 See `README.Docker.md`
