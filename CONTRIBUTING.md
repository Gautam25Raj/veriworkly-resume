# 🤝 Contributing to VeriWorkly

First off, thank you for considering contributing to **VeriWorkly**! We are building a professional, privacy-first career ecosystem, and we value your help.

> [!IMPORTANT]
> **Detailed guides, developer workflows, and coding standards** live in our official documentation:
>
> - 📖 **[Full Contributing Guidelines](https://docs.veriworkly.com/docs/contributing/index)**
> - 🛠️ **[Detailed Local Setup Guide](https://docs.veriworkly.com/docs/getting-started/local-setup)**

---

## ⚡ Quick TL;DR Contribution Workflow

If you just need a quick heads-up on the commands and branching protocol:

### 1. Fork & Clone

1. Fork the [original repository](https://github.com/VeriWorkly/veriworkly).
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/veriworkly.git
   cd veriworkly-resume
   ```
3. Set up the upstream remote:
   ```bash
   git remote add upstream https://github.com/VeriWorkly/veriworkly.git
   ```

### 2. Branching Policy

- **Base Branch**: PRs must be based on and target the **`master`** branch.
- **Update your branch** before starting:
  ```bash
  git checkout master
  git pull upstream master
  git checkout -b feat/your-feature-name
  ```

### 3. Local Run Commands

- Install dependencies: `npm install`
- Copy environment variables: `cp .env.example .env` and `cp apps/server/.env.example apps/server/.env`
- Choose your dev flow:
  - **Frontend-only (Site/Templates at port 3000)**: `npm run dev` _(No database or backend server needed)_
  - **Full-stack (All apps/databases)**: `npm run dev:all` _(Requires running `npm run db:push -w @veriworkly/server`)_

### 4. Code Quality

Run checks before committing:

```bash
   npm run dev:all
```

---

## 🌿 Branching Policy

- `master`: Active development, integration, and production branch. **Base your PRs here.**

### Branch Naming Convention

- `feat/feature-name`
- `fix/bug-name`
- `docs/doc-update`
- `refactor/scope-of-work`

---

## 🛠️ Development Guidelines

### 1. Architecture

We use a **Monorepo** structure.

- **apps/site**: Marketing landing site.
- **apps/studio**: Builder studio application.
- **apps/server**: Express API.
- **apps/docs-platform**: Documentation (Fumadocs).
- **packages/ui**: Shared Design System.

### 2. Coding Standards

- **TypeScript**: Mandatory for all new code.
- **Linting**: Run `npm run lint` before committing.
- **Formatting**: We use Prettier. Run `npm run format:write`.

---

## 📝 Pull Request Process

1. **Create an Issue**: Discuss large changes before starting work.
2. **Submit PR**: Open a PR against the `master` branch.
3. **Checklist**:
   - [ ] Lint passes (`npm run lint`)
   - [ ] Prettier formatting succeeds (`npm run format:write`)
   - [ ] Code builds successfully (`npm run build`)
   - [ ] Tests pass (`npm test`)
   - [ ] Documentation updated (if applicable)

---

## 🤝 Code of Conduct

We expect all contributors to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Be respectful, inclusive, and collaborative.

---

Built with ❤️ by [VeriWorkly Team](https://veriworkly.com)
