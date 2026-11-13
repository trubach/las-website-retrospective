# ADR 0005: Major Refresh Criteria and URL Epoch Canonical Precedence

- **Status**: Accepted
- **Date**: 2026-11-13

## Context

Between 2000 and 2026, the College of LAS homepage experienced both visual redesigns and hostname transitions (`www.las.uiuc.edu` → `www.las.illinois.edu` → `las.illinois.edu`), including a 2008–2013 overlap window where both `uiuc.edu` and `illinois.edu` answered with HTTP 200. Conflating pure URL cutovers or incremental menu tweaks with visual redesigns would distort the historical iteration count.

## Decision

1. **Major Refresh Trigger**: Start a new **Design Iteration** strictly when there is a **substantial visual layout or template overhaul**. Navigation reorganizations that occur within an existing visual layout are recorded as **Intra-Era Drift** inside that Design Iteration rather than spawning a new Design Iteration.
2. **URL Epoch Transitions**: Pure hostname cutovers occurring without a simultaneous visual redesign are displayed as badged **URL Epoch Transitions** on the timeline.
3. **Canonical Hostname Rules**:
   - The current canonical site URL is `las.illinois.edu` (no `www`).
   - Whenever `*.uiuc.edu` transitions to or overlaps with `*.illinois.edu` (August 2008 onward), `*.illinois.edu` is treated as the canonical domain.
   - From 2019 onward (when `www.las.illinois.edu` began 301-redirecting to bare HTTPS `las.illinois.edu`), `las.illinois.edu` is treated as canonical.

## Consequences

- Each Design Iteration cleanly corresponds to an unmistakable visual era in homepage screencaps, while URL migrations remain clearly visible on the same timeline via epoch badges.
