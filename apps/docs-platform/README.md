# VeriWorkly Documentation Platform

The documentation and API reference platform for VeriWorkly, built with [Fumadocs](https://fumadocs.vercel.app/).

## Features
- **API Reference**: Automatically generated from OpenAPI specs.
- **Developer Guides**: Clear, concise documentation for building with VeriWorkly.
- **Search**: Integrated search across all documentation.
- **Architecture**: In-depth look at the VeriWorkly privacy-first model.

## Tech Stack
- **Framework**: Next.js 15
- **Content Engine**: Fumadocs
- **API Generation**: Fumadocs OpenAPI
- **Styling**: Tailwind CSS

## Development
To run the documentation platform locally:
```bash
npm run dev:docs
```

## Adding Documentation
- **Guides**: Add `.mdx` files to `apps/docs-platform/content/docs/`.
- **API**: The API reference is generated from `specs/openapi.yaml` in the root.
