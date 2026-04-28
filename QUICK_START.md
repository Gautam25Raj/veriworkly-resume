# ⚡ Quick Start Guide

Get the full VeriWorkly ecosystem up and running in less than 5 minutes.

## 🚀 Way A: Local Node.js (Recommended for Dev)

VeriWorkly uses **npm workspaces** to manage all platforms from the root.

1. **Clone & Install**:
   ```bash
   git clone https://github.com/Gautam25Raj/veriworkly-resume.git
   cd veriworkly-resume
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   cp apps/server/.env.example apps/server/.env
   # Add your DATABASE_URL to apps/server/.env
   ```

3. **Setup Database**:
   ```bash
   npm run db:push -w @veriworkly/server
   ```

4. **Launch Everything**:
   ```bash
   npm run dev:all
   ```

---

## 🐳 Way B: Using Docker (Fastest)

Fastest way to run the production-ready stack.

1. **Clone & Configure**:
   ```bash
   git clone https://github.com/Gautam25Raj/veriworkly-resume.git
   cd veriworkly-resume
   cp .env.docker.example .env.docker
   # Add your DATABASE_URL to .env.docker
   ```

2. **Launch**:
   ```bash
   docker compose --env-file .env.docker up -d --build
   ```

---

## 🔍 Verification

| Platform | URL |
| :--- | :--- |
| **Resume Builder** | [http://localhost:3000](http://localhost:3000) |
| **Backend API** | [http://localhost:8080/api/v1/health](http://localhost:8080/api/v1/health) |
| **Documentation** | [http://localhost:3001](http://localhost:3001) |
| **Blog** | [http://localhost:3002](http://localhost:3002) |

---

## 📘 Next Steps

- 🏢 **Deep Dive**: Read [PROJECT_DETAILS.md](./PROJECT_DETAILS.md)
- 📐 **Architecture**: See [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md)
- 🤝 **Contribute**: See [CONTRIBUTING.md](./CONTRIBUTING.md)
