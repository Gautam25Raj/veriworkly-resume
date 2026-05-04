# Local Development Setup

This guide covers setting up VeriWorkly for local development.

## Prerequisites

- **Node.js 20+**
- **npm v10+**
- **PostgreSQL** (We recommend [Neon](https://neon.tech))
- **Redis** (Local or via Docker)

## Step-by-Step Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   - Create `.env` in the root.
   - Create `.env` in `apps/server/`.
   - See `ENV_SETUP.md` for variable details.

3. **Database Migration**:
   ```bash
   npm run db:push -w @veriworkly/server
   ```

4. **Start Development Servers**:
   ```bash
   # Start everything
   npm run dev
   ```

## 📚 Detailed Guide

For a comprehensive step-by-step walkthrough, troubleshooting, and template development guides, please refer to our official documentation:
[Local Setup Guide - VeriWorkly Docs](https://docs.veriworkly.com/docs/getting-started/local-setup)
