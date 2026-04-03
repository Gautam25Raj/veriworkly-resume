# ⚡ Quick Start Guide

Get VeriWorkly up and running in less than 5 minutes.

## 🐳 Way A: Using Docker (Fastest)

The fastest way to run the full stack with all services configured.

1. **Clone & Enter**:

   ```bash
   git clone https://github.com/your-username/veriworkly-resume.git
   cd veriworkly-resume
   ```

2. **Configure**:

   ```bash
   cp .env.docker.example .env.docker
   # Edit .env.docker and add your DATABASE_URL
   ```

3. **Launch**:

   ```bash
   docker compose --env-file .env.docker up -d --build
   ```

4. **Enjoy**:
   - Web: http://localhost:3000
   - API: http://localhost:8080/api/v1/health

---

## 💻 Way B: Local Node.js Development

Run frontend and backend separately using Node.js.

### 1. Root Setup

```bash
npm install
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Update .env with your Neon/Postgres DB string
npm run db:push
npm run dev
```

### 3. Frontend Setup (New Terminal)

```bash
# From the root directory
npm run dev
```

---

## 🧪 Verification

- Open [http://localhost:3000](http://localhost:3000)
- Try clicking "Open Dashboard"
- Check [http://localhost:8080/api/v1/health](http://localhost:8080/api/v1/health) to ensure the backend is alive.

---

## 📘 Next Steps

- Read `README.md` for full project documentation
- See `README.Docker.md` for production setup
- Review `ENV_SETUP.md` for detailed environment configuration
