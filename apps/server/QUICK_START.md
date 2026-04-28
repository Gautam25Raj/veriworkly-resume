# 🚀 Server Quick Start Guide

Run the **VeriWorkly backend (Express API)** locally in minutes.

## ⚙️ Prerequisites

- Node.js **20+**
- PostgreSQL database (Neon recommended)
- Redis (optional, recommended)

---

## Setup

### 1️⃣ Install Dependencies

```bash
cd server
npm install
```

### 2️⃣ Setup Environment

```bash
cp .env.example .env
```

Update required values:

- `DATABASE_URL`
- `AUTH_SECRET`
- `JWT_SECRET`

### 3️⃣ Start Redis

```bash
docker run -d -p 6379:6379 --name redis redis:7
```

### 4️⃣ Setup Database

```bash
npm run db:push
```

Or (recommended):

```bash
npm run db:migrate
```

### 5️⃣ Start Server

```bash
npm run dev
```

---

✅ **Server is running!**

```
Redis Client Connected
[timestamp] [INFO] Redis initialized
[timestamp] [INFO] Database connected
[timestamp] [INFO] Server running on port 8080 (development)
[timestamp] [INFO] GitHub sync job is globally disabled via config
[timestamp] [INFO] Usage metrics flush job scheduled
[timestamp] [INFO] Allowed origins: http://localhost:3000
[timestamp] [INFO] 📍 http://localhost:8080/api/health
```

## Test the API

```bash
# Health check
curl http://localhost:8080/api/health

# Get roadmap features
curl http://localhost:8080/api/roadmap

# Get roadmap stats
curl http://localhost:8080/api/roadmap/stats

# Get tags
curl http://localhost:8080/api/roadmap/tags
```

## Useful Commands

```bash
npm run dev              # Dev server with hot reload
npm run build            # Compile TypeScript
npm start                # Production build

npm run db:studio        # Prisma GUI (http://localhost:5555)
npm run lint:fix         # Auto-fix code style
npm run format:write     # Auto-format code

docker-compose down      # Stop containers
docker-compose logs -f   # View container logs
```

---

## ❗ Common Issues

### ❌ Cannot connect to database

- Check `DATABASE_URL`
- Ensure database is reachable

---

### ❌ Port already in use

Change in `.env`:

```env
PORT=8080
```

---

### ❌ Redis connection failed

- Ensure Redis is running
- Check `REDIS_URL` or `REDIS_HOST`

---

## Next Steps

- 📖 Read [README.md](../README.md) for full documentation
- 🔧 Check [ENV_SETUP.md](../ENV_SETUP.md) for production setup
- 📝 Review Prisma schema: `npx prisma studio`
- ✅ Run tests: `npm test`

## File Structure

```
server/
├── src/
│   ├── index.ts           # Express app entry
│   ├── config.ts          # Configuration loader
│   ├── middleware/        # Express middleware
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   ├── utils/             # Helper functions
│   └── types/             # TypeScript types
├── prisma/
│   ├── schema.prisma      # Database schema
├── package.json
├── tsconfig.json
├── docker-compose.yml     # Local dev services
└── README.md              # Full documentation
```

---

**Happy coding! 🎉**

Questions? Check the [README.md](../QUICK_START.md) for detailed docs.
