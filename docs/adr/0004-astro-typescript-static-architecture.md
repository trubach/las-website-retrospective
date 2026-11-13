# ADR 0004: Astro + TypeScript Static Site Architecture

- **Status**: Accepted
- **Date**: 2026-11-13

## Context

The project requires a "dynamic static web page": zero runtime backend dependencies (deployable to any static file host), paired with rich client-side interactivity for timeline filtering, annual snapshot scrubbing, screencap inspection, and cross-era navigation comparison.

## Decision

Build the site with **Astro + TypeScript**, compiling to a self-contained static `dist/` bundle:

- Store historical iterations, annual snapshots, navigation trees, and canonical concept mappings as strictly typed JSON/TS data files in the repository.
- Use Astro components for zero-overhead static rendering of editorial content and lightweight interactive client components (islands) for timeline scrubbing, screencap lightbox/comparison, and interactive navigation analysis views.
- Maintain offline Node.js + Playwright scripts in `scripts/` for fetching Wayback metadata, extracting navigation candidates, and capturing normalized homepage screenshots.

## Consequences

- All archival scraping happens ahead of time during data-curation scripts; production builds (`npm run build`) run entirely against committed local data and optimized image assets without depending on live Wayback Machine availability.
