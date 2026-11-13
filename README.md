# LAS Website History and Retrospective

A dynamic static web application presenting a 27-year visual and information-architecture (IA) retrospective of the University of Illinois **College of Liberal Arts & Sciences** homepage from **2000 to present**.

## Historical URL Epochs (Oldest → Newest)

1. **`www.las.uiuc.edu`** (2000 – August 2008; mirrored content until 301-redirecting in 2014)
2. **`www.las.illinois.edu`** (August 2008 – 2018)
3. **`las.illinois.edu`** (2019 – present; canonical bare-domain HTTPS)

## Key Features

- **Nine Highlighted Major Design Refreshes (2000–Present)**: Chronological showcase anchored to debut-year 1280×900 desktop screencaps (`2000`, `2001`, `2005`, `2008`, `2014`, `2016`, `2019`, `2021`, `2025`), URL Epoch Transition markers, and full-page screencap lightbox inspection with Wayback Machine verification links.
- **27-Year Annual Snapshot Scrubber**: Step year-by-year (`2000`–`2026`) within multi-year design iterations to inspect intra-era visual and navigation drift.
- **Multi-Zone Navigation Breakdown**: Models Primary Navigation, Audience Bars, Utility Headers, Sidebars, Level-2 submenus, and targeted **Footer Displacement** (*"Resources for faculty and staff"*).
- **Cross-Era Synthesis & Recruitment-First IA Analysis**:
  - **26-Concept Continuity Matrix** across 7 domains with filter presets and verbatim link inspection.
  - **Audience-to-Recruitment IA Evolution**: Tracks how persona-gated navigation peaked at 90% in 2016 before pivoting to modern **Recruitment-First IA** (*Visit · Apply · Give* + student-focused primary navigation, with internal faculty/staff resources intentionally relocated out of primary navigation to the footer).
- **Interactive Side-by-Side Iteration Diff Tool**: Compare any two Design Iterations across screenshots, hierarchy metrics, and concept additions, removals, footer displacements, and zone realignments.

## Domain Model & Architecture Documentation

- [Domain Glossary (`docs/glossary.md`)](./docs/glossary.md)
- [Architecture Decision Records (`docs/adr/`)](./docs/adr/README.md) (`ADR 0001` – `ADR 0009`)

## Commands

```bash
# Start local Astro development server
npm run dev

# Type-check and build static site into dist/
npm run build

# Build for a subpath deployment (e.g., /las-retrospective/)
BASE_URL=/las-retrospective npm run build

# Preview production static build locally
npm run preview
```

### Offline Archival Pipeline Scripts

All optimized WebP screencaps (`public/screenshots/`) and structured datasets (`src/data/*.json`) are committed to version control so `npm run build` runs completely offline. To refresh archival captures:

```bash
npm run archive:fetch        # Query Wayback CDX & cache 2000–2026 + live HTML
npm run archive:capture      # Render 1280x900 fold & full-page WebP screencaps via Playwright
npm run archive:build-data   # Regenerate & validate src/data/{taxonomy,iterations,snapshots}.json
```

