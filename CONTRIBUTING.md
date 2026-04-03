# 🤝 Contributing to VeriWorkly Resume

First off, thank you for considering contributing to **VeriWorkly**! Your contributions help make this project better for everyone.

## 🌈 Our Vision

VeriWorkly aims to provide a **professional, privacy-first, and frictionless resume building experience**.

We value:

- Simplicity
- Performance
- Clean design
- Data privacy

## 🏗️ Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm / yarn / pnpm
- Docker (optional, but recommended for full-stack testing)
- Redis (optional, recommended)
- A Neon PostgreSQL account (for backend features)

### Local Development Setup

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/your-username/veriworkly-resume.git
   cd veriworkly-resume
   ```

3. **Install dependencies**:

   ```bash
   npm install
   cd server && npm install && cd ..
   ```

4. **Setup environment variables**

   ```bash
   cp .env.example .env
   cp server/.env.example server/.env
   ```

   > 👉 See `ENV_SETUP.md` for detailed configuration.

5. **Setup database**

   ```bash id="db4x4"
   cd server
   npm run db:push
   ```

6. **Run development servers**

   Backend:

   ```bash
   npm run dev
   ```

## 🌿 Branching Policy

- `master`: Production-ready code.
- `dev`: Ongoing development. Base your PRs on this branch if it exists, otherwise use `master`.

### Branch Naming

- Feature → `feature/your-feature-name`
- Fix → `fix/issue-description`
- Refactor → `refactor/scope`

## 🛠️ Development Workflow

### 📦 Code Style

- Use **TypeScript**
- Follow existing project structure (feature-based)
- Write small, reusable components
- Prefer clear naming over clever code

### Steps to Contribute

1. **Create an issue**: Before starting significant work, please open an issue to discuss it.

2. **Implement your changes**:
   - Write clean, documented TypeScript.
   - Follow the existing project structure (feature-based architecture).

3. **Lint and Format**:

   ```bash
   npm run lint
   npm run format:write
   ```

---

## 📝 Pull Request Process

1. Ensure your code follows the coding standards.
2. Update documentation if necessary.
3. Create a pull request against the `dev` branch.
4. Provide a clear description of your changes and link to any related issues.
5. Link the PR to the relevant issue.
6. Once your PR is submitted, it will be reviewed by the maintainers.

---

### ✅ PR Checklist

- [ ] Code builds successfully
- [ ] Lint passes
- [ ] Tests pass
- [ ] No unnecessary console logs
- [ ] Documentation updated (if needed)

---

## 🤝 Code of Conduct

We expect all contributors to adhere to our Code of Conduct (details to be added). Be respectful, inclusive, and collaborative.

---

Built by [VeriWorkly](https://veriworkly.com) with ❤️.
