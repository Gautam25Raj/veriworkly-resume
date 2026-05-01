<div align="center">
  <a href="https://veriworkly.com">
    <img src="apps/resume-builder/public/og/landing-page-og.png" alt="VeriWorkly Resume" />
  </a>

  <h1>VeriWorkly Resume</h1>

  <p><strong>A professional, privacy-first, and frictionless resume building platform.</strong></p>
  <p><strong>100% Open Source • Built for the Modern Career</strong></p>

  <p>
    <a href="https://veriworkly.com"><strong>Main App</strong></a>
    ·
    <a href="https://docs.veriworkly.com"><strong>Documentation</strong></a>
    ·
    <a href="https://blog.veriworkly.com"><strong>Blog</strong></a>
    ·
    <a href="https://veriworkly.com/roadmap"><strong>Roadmap</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/github/package-json/v/Gautam25Raj/veriworkly-resume?style=flat-square" alt="VeriWorkly Resume version">
    <img src="https://img.shields.io/github/stars/Gautam25Raj/veriworkly-resume?style=flat-square" alt="GitHub Stars">
    <img src="https://img.shields.io/github/license/Gautam25Raj/veriworkly-resume?style=flat-square" alt="License" />
  </p>
</div>

## 🌟 Executive Summary

VeriWorkly is a **high-performance, privacy-centric resume building ecosystem** that challenges the traditional SaaS resume builder model. Unlike competitors that require accounts and store sensitive career data on remote servers, VeriWorkly operates on a **Local-First principle**, combining a state-of-the-art Next.js frontend with a robust Node.js/Express backend to provide a seamless, secure, and professional experience.

The platform empowers users to:

- **Build & Edit** professional resumes in real-time with instant visual feedback
- **Export** in multiple formats (ATS-optimized PDF, editable DOCX) with pixel-perfect accuracy
- **Manage** their career data locally without surveillance or tracking
- **Sync** securely to the cloud when they choose to collaborate or access across devices
- **Integrate** with external tools through a fully documented OpenAPI specification

All while maintaining **100% open-source transparency** and enabling self-hosting for enterprises.

## ✨ Core Features & Capabilities

### 🎯 Resume Editor

- **WYSIWYG Editing**: Real-time, lag-free editing with instant visual feedback
- **Multiple Templates**: 5+ professionally-designed, ATS-optimized templates
- **Sections Management**: Standard (Contact, Summary, Experience, Education, Skills, Projects) and custom sections
- **Rich Text Support**: Bold, italic, links, and formatting within text fields
- **Auto-Save**: Automatic persistence to browser localStorage

### 📤 Export & Download

- **PDF Export**: Pixel-perfect rendering via Playwright headless browser; ATS-optimized for parsing
- **DOCX Export**: Native, editable Word documents via `docx` library
- **Format Preservation**: Colors, fonts, and layout perfectly preserved across all formats
- **Multiple Downloads**: Export same resume in different formats without re-editing

### ☁️ Cloud Sync & Sharing

- **Optional Sync**: Users choose when and if to sync data to the cloud
- **Cross-Device Access**: Seamless resume access from multiple devices
- **Share Links**: Generate shareable, view-only links for potential employers
- **Collaboration**: Future support for real-time collaborative editing

### 🔐 Privacy & Security

- **Local-First Architecture**: 90% of resume data lives in the browser by default
- **Zero Tracking**: No invasive analytics or tracking pixels
- **End-to-End Privacy**: No resume content visible to third parties unless explicitly shared
- **Secure Authentication**: Passwordless login via Magic Links or OAuth
- **Data Encryption**: All data in transit encrypted via HTTPS; at-rest encryption via database

### 👤 User Management

- **Passwordless Login**: Magic link authentication for frictionless access
- **Social OAuth**: Google and GitHub login integration
- **OTP Support**: One-time password for high-security scenarios
- **Profile Management**: User preferences, saved templates, and sync history
- **Multi-Resume**: Create and manage multiple resumes

### 📊 Public Roadmap

- **Feature Voting**: Users vote on proposed features
- **Transparency**: See planned development in real-time
- **Community Input**: User feedback directly shapes the product

## 🎨 Templates

<table>
  <tr>
    <td align="center">
      <img src="public/templates/modern-resume-template.png" alt="Modern" width="150" />
      <br /><sub><b>Modern</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/minimal-resume-template.png" alt="Minimal" width="150" />
      <br /><sub><b>Minimal</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/executive-resume-template.png" alt="Executive" width="150" />
      <br /><sub><b>Executive</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/classic-resume-template.png" alt="ATS Classic" width="150" />
      <br /><sub><b>ATS Classic</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/templates/professional-resume-template.png" alt="Professional" width="150" />
      <br /><sub><b>Professional</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/structured-resume-template.png" alt="Structured" width="150" />
      <br /><sub><b>Structured</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/academic-resume-template.png" alt="Academic" width="150" />
      <br /><sub><b>Academic Serif</b></sub>
    </td>
  </tr>
</table>

## 🏛️ Local-First & Privacy Philosophy

### The Problem We Solve

Traditional resume builders lock users into:

- Account creation requirements
- Data stored on remote servers indefinitely
- Potential data breaches exposing sensitive career information
- Vendor lock-in and migration friction

### Our Solution: Local-First Architecture

VeriWorkly inverts the traditional SaaS model:

1. **Primary Storage**: User's browser (localStorage/IndexedDB)
2. **Sync Layer**: Optional cloud sync for cross-device access
3. **Sharing**: Users explicitly choose what to share and with whom
4. **Data Ownership**: Users always own their data; they can export or delete anytime

### Implementation Details

```typescript
// Example: Zustand store with localStorage persistence
const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: initialResume,
      updateResume: (data) => set({ resume: data }),
    }),
    {
      name: "resume-storage", // localStorage key
      version: 1,
    },
  ),
);
```

This middleware automatically:

- Saves resume state to `localStorage` on every edit
- Rehydrates from storage on app load
- Handles versioning and migrations
- Enables offline-first workflows

### Privacy Guarantees

- ✅ **No Resume Content** is transmitted to our servers unless the user initiates sync
- ✅ **No Tracking** of resume content, templates used, or editing patterns
- ✅ **No Third-Party Sharing** of career data
- ✅ **Full Transparency** — Open-source code, anyone can audit
- ✅ **User Control** — Users can delete all data at any time

## 📖 Documentation

Detailed guides for various parts of the ecosystem:

| Guide                                   | Description                                            |
| --------------------------------------- | ------------------------------------------------------ |
| [Local Setup](README.Local.md)          | Manual installation and environment config             |
| [Docker Deployment](README.Docker.md)   | Self-hosting with Docker Compose                       |
| [Environment Setup](ENV_SETUP.md)       | Global configuration for API and Web                   |
| [Project Architecture](ARCHITECTURE.md) | Deep dive into the frontend, backend and schema design |
| [Contributing](CONTRIBUTING.md)         | How to help build the future of VeriWorkly             |

## 🛠️ Complete Tech Stack

### Frontend Stack

| Layer                | Technology               | Purpose                                       |
| :------------------- | :----------------------- | :-------------------------------------------- |
| **Framework**        | Next.js 16+ (App Router) | React meta-framework with SSR, static export  |
| **UI Library**       | React 19                 | Modern component architecture                 |
| **Styling**          | Tailwind CSS 4           | Utility-first CSS framework with `@theme` API |
| **Design System**    | Radix UI                 | Unstyled, accessible components               |
| **State Management** | Zustand                  | Lightweight, flexible store with middleware   |
| **Forms**            | React Hook Form          | Performant form handling                      |
| **Validation**       | Zod                      | TypeScript-first schema validation            |
| **Icons**            | Lucide React             | Consistent icon library                       |
| **Markdown**         | MDX                      | JSX in Markdown for docs/blog                 |

### Backend Stack

| Layer                   | Technology          | Purpose                                    |
| :---------------------- | :------------------ | :----------------------------------------- |
| **Runtime**             | Node.js 20+         | JavaScript/TypeScript on the backend       |
| **Framework**           | Express             | Minimal, flexible HTTP server              |
| **Language**            | TypeScript (Strict) | Type safety across the backend             |
| **Database**            | PostgreSQL          | Reliable, feature-rich relational database |
| **ORM**                 | Prisma              | Type-safe database access with migrations  |
| **Cache/Queue**         | Redis + BullMQ      | Session storage, rate limiting, job queues |
| **Authentication**      | Better-Auth         | Modern, secure passwordless auth           |
| **PDF Generation**      | Playwright          | Server-side headless browser rendering     |
| **Document Generation** | `docx`              | Native Word document generation            |
| **Validation**          | Zod                 | Schema validation for API payloads         |
| **Testing**             | Vitest              | Fast unit & integration testing            |
| **Security**            | Helmet              | HTTP security headers                      |

## 🤝 Contributing & Community

### Ways to Contribute

1. **Code**: Submit bug fixes, features, or performance improvements
2. **Design**: Contribute new resume templates
3. **Documentation**: Improve guides, add examples, fix typos
4. **Translation**: Help localize content to other languages
5. **Feedback**: Report bugs, suggest features on the roadmap
6. **Sponsorship**: Support the project financially

### Development Standards

- **TypeScript**: Strict mode required; no `any` types
- **Testing**: Unit and E2E tests for new features
- **Code Style**: ESLint + Prettier enforce consistency
- **Documentation**: Update relevant docs with changes
- **Commits**: Descriptive, atomic commits with clear messages

### Quick Contribution Steps

```bash
# 1. Fork the repository
git clone https://github.com/YOUR_USERNAME/veriworkly-resume.git
cd veriworkly-resume

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes and test
npm run lint
npm run format:write
npm test

# 4. Push and create PR
git push origin feature/your-feature-name

# 5. Create Pull Request on GitHub
# Include description, testing notes, and related issues
```

### Reporting Issues

- Use GitHub Issues for bug reports and features
- Include reproduction steps, expected vs actual behavior
- Provide environment details (Node version, OS, etc.)
- Search existing issues to avoid duplicates

### Community Resources

- 📖 [Documentation](https://docs.veriworkly.com)
- 🐛 [Issue Tracker](https://github.com/Gautam25Raj/veriworkly-resume/issues)
- 💬 [Discussions](https://github.com/Gautam25Raj/veriworkly-resume/discussions)
- 📝 [Blog](https://blog.veriworkly.com)

## 📞 Support & Resources

- **Main Website**: [veriworkly.com](https://veriworkly.com)
- **Documentation**: [docs.veriworkly.com](https://docs.veriworkly.com)
- **Blog**: [blog.veriworkly.com](https://blog.veriworkly.com)
- **Roadmap**: [veriworkly.com/roadmap](https://veriworkly.com/roadmap)
- **GitHub**: [github.com/Gautam25Raj/veriworkly-resume](https://github.com/Gautam25Raj/veriworkly-resume)
- **Issues**: Report bugs and request features via GitHub Issues

### Support Channels

- 🐛 **Bug Reports**: GitHub Issues
- 💡 **Feature Requests**: GitHub Discussions or Roadmap
- ❓ **Questions**: GitHub Discussions or Documentation
- 🔒 **Security**: See [SECURITY.md](SECURITY.md)

## 🔒 Security & Privacy

### Data Protection

- **Local-First**: Resume data stored locally in browser by default
- **Encryption**: All data encrypted in transit (HTTPS) and at rest (database)
- **No Tracking**: Zero analytics or tracking of user behavior
- **Open Source**: Code transparency enables community security audits

### Reporting Vulnerabilities

Please do NOT open GitHub issues for security vulnerabilities. Instead, email security@veriworkly.com with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment

For complete security policy, see [SECURITY.md](SECURITY.md)

## 📝 License & Attribution

VeriWorkly is released under the **MIT License**. See [LICENSE](LICENSE) file for full details.

### What MIT License Means

✅ **Use**: Free to use in personal and commercial projects
✅ **Modify**: Free to modify and adapt the code
✅ **Distribute**: Free to distribute modified or original code
⚠️ **Include**: Must include license and copyright notice
❌ **Liability**: Software provided "as-is" with no warranty

## 🚀 Roadmap & Vision

### Current Phase (2026)

- ✅ Core resume editor and export functionality
- ✅ Local-first architecture with optional sync
- ✅ Multi-format export (PDF, DOCX)
- 🚀 AI-powered resume suggestions

### Future (2026+)

- Interview preparation features
- Skill matching with job postings
- Custom domain resume pages
- Resume version control and history
- Integration with LinkedIn and ATS platforms

## ❤️ Built With Love

VeriWorkly is built by a community of developers passionate about simplifying career building and protecting user privacy. Every line of code reflects our commitment to transparency, security, and user empowerment.

**Made with ❤️ by [VeriWorkly Team](https://veriworkly.com) and [Contributors](https://github.com/Gautam25Raj/veriworkly-resume/graphs/contributors)**

**Last Updated**: April 2026 | **Version**: 1.12.0 | **License**: MIT
