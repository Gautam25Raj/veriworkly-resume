# Visual Baseline Screenshots

This suite captures canonical template screenshots and stores baseline images using Playwright snapshots.

## Generate or update baselines

Run:

npm run test:visual:update

Baseline images are written under the Playwright snapshot directory for:

- template-modern-baseline.png
- template-minimal-baseline.png
- template-executive-baseline.png

## Validate visual regressions

Run:

npm run test:visual
