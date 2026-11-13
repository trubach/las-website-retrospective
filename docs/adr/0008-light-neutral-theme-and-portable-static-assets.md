# ADR 0008: Light Neutral Visual Theme, Chrome Separation, and Portable Static Repo

- **Status**: Accepted
- **Date**: 2026-11-13

## Context

The retrospective presents colorful, varied historical LAS screenshots and header diagrams to campus stakeholders and needs to deploy cleanly to any static hosting path without runtime dependencies on Wayback Machine.

## Decision

1. **Light Neutral Palette with Illini Accents**:
   - Use a **light-themed neutral palette of mostly white and light grays** (no dark theme) so historical homepage screencaps stand out cleanly.
   - Use **Illini Navy (`#13294B`)** for high-contrast typography, structural headers, and dark accents, and **Illini Orange (`#FF5F05`)** sparingly for emphasis/highlights while maintaining **WCAG 2.1 AA** contrast ratios.
   - Omit official `<ilw-header>` and `<ilw-footer>` campus theme wrappers so the retrospective's own chrome never visually collides with the LAS headers under analysis.
2. **Repository & Offline Asset Strategy**:
   - Initialize `git` in the project repository.
   - Commit optimized WebP screencaps and extracted JSON datasets directly into version control so `npm run build` is fast, deterministic, and independent of Wayback Machine availability/rate-limits.
   - Configure Astro with a portable `BASE_URL` (defaulting to `/`) so `dist/` deploys cleanly to root domains, campus subpaths, or GitHub Pages.

## Consequences

- Color tokens must pair `#FF5F05` highlights carefully (e.g., accent borders, indicators, or dark-on-tint / white-on-navy combinations) so text contrast always satisfies WCAG 2.1 AA (≥ 4.5:1 normal text, ≥ 3:1 large text/UI components).
