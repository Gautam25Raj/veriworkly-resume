# @veriworkly/ui

The shared UI library for VeriWorkly platforms.

## Overview
This package contains reusable React components built with Tailwind CSS and Lucide React. It is used across the main landing page, documentation platform, and blog platform.

## Structure
- `src/components/ui`: Atomic components (Button, Card, etc.)
- `src/components/layout`: Layout-level components (Container)
- `src/utils.ts`: Shared utility functions (cn)

## Usage
Add as a dependency to your app:
```json
{
  "dependencies": {
    "@veriworkly/ui": "*"
  }
}
```

Import components:
```tsx
import { Button, Card, Container } from "@veriworkly/ui";
```

## Development
This package is part of the npm workspace. When modifying components here, they will automatically reflect in the apps during development.
