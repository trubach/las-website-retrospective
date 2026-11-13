# ADR 0006: Desktop-Only Screencap Fidelity and Snapshot Selection

- **Status**: Accepted
- **Date**: 2026-11-13

## Context

Historical LAS homepages span early-2000s fixed-width desktop tables through modern responsive templates, and Wayback captures include archival artifacts such as the injected `#wm-ipp-base` toolbar, occasional missing legacy assets/Flash objects, and modern cookie overlays.

## Decision

1. **Desktop-Only Viewport**: Capture all iterations and annual snapshots exclusively at a **1280×900 desktop viewport** (no mobile viewports or responsive drawer captures) to preserve a clean, apples-to-apples visual comparison from 2000 to present.
2. **Snapshot Timing**: Prefer **early fall-semester captures (September–October)** for annual snapshots when academic-year updates are settled, falling back to the cleanest HTTP-200 capture of that year with intact stylesheets/images (and using post-launch captures whenever a Major Refresh debuted mid-year).
3. **Framing & Sanitation**:
   - Display a consistent **above-the-fold 1280×900 preview** in timeline cards, with click-to-expand **full-page scroll screencaps** in a lightbox.
   - Strip Wayback Machine's injected toolbar/overlays and modern cookie banners prior to capture.
   - Annotate degraded legacy media (e.g., dead Flash embeds or unarchived images) transparently with a subtle archival note rather than hiding or fabricating content.

## Consequences

- Screenshot pipelines produce uniform aspect-ratio thumbnails across all 27+ years while retaining full-page detail on demand.
