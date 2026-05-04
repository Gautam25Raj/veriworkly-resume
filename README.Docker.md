# Docker Deployment Guide

VeriWorkly provides a comprehensive Docker Compose setup for self-hosting.

## 🚀 Quick Deploy

1. **Configure Docker environment**:
   ```bash
   cp .env.docker.example .env.docker
   cp .env.example .env
   cp apps/server/.env.example apps/server/.env
   ```

2. **Launch the ecosystem**:
   ```bash
   docker compose --env-file .env.docker up -d --build
   ```

## ⚠️ Important Note

By default, the Docker setup does **not** include a PostgreSQL container. You should provide an external `DATABASE_URL` (e.g., Neon or a managed DB) in your `.env` files.

## 📖 Full Deployment Guide

For production-ready configurations, SSL setup (Nginx/Caddy), and volume management, see:
[Docker Deployment Guide - VeriWorkly Docs](https://docs.veriworkly.com/docs/getting-started/docker-deployment)
