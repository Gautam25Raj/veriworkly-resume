# 🚀 VeriWorkly Backend

Production-ready Express.js API server for VeriWorkly Resume. Built with TypeScript, Prisma ORM, and PostgreSQL (optimized for Neon).

<p>
  <a href="https://github.com/Gautam25Raj/veriworkly-resume"><strong>Repository</strong></a>
  ·
  <a href="https://docs.veriworkly.com"><strong>Full Docs</strong></a>
  ·
  <a href="#-api-documentation"><strong>API Reference</strong></a>
</p>

## 🛡️ Security & Performance

- **Secure by Default:** Helmet, CORS, and Zod validation.
- **Rate Limited:** Smart rate limiting (100 req/15 min) to prevent abuse.
- **Fast Caching:** Redis integration for features (1h) and stats (30m).
- **Scale Ready:** Native connection pooling via Prisma.

## 🛠️ Quick Start

```bash
# From the root directory
cd server

# Install dependencies
npm install

# Setup database (ensure PostgreSQL is running)
npm run db:push

# Start development
npm run dev
```

## 📡 API Documentation

### Roadmap Endpoints

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| `GET`  | `/api/roadmap`       | List all features with filters |
| `GET`  | `/api/roadmap/stats` | Global roadmap statistics      |
| `GET`  | `/api/roadmap/:id`   | Detailed feature info          |

### System Endpoints

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| `GET`  | `/api/health`       | Service health status     |
| `GET`  | `/api/stats/github` | Real-time project metrics |

## 🧪 Development Scripts

- `npm run dev`: Hot-reload development server
- `npm run build`: Production compilation
- `npm run db:studio`: GUI for database management
- `npm test`: Run Vitest suite

---

Distributed under the MIT License. Built by [VeriWorkly](https://veriworkly.com).
