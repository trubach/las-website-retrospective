# ADR 0003: Multi-Zone Navigation Scope and Audience-IA Tracking

- **Status**: Accepted
- **Date**: 2026-11-13

## Context

Over 26+ years, the LAS homepage did not rely on a single navigation bar; it combined primary bars/sidebars, dedicated audience bars (*"For Students"*, *"For Faculty/Staff"*, *"Alumni"*), and utility headers. Modern UX/IA practice generally discourages primary navigation organized by user persona/audience because visitors often cross roles or guess the wrong bucket, making the historical arc of audience navigation on LAS particularly illuminating.

## Decision

1. **Multi-Zone Capture**: Model each Design Iteration's navigation as a set of distinct **Navigation Zones** (e.g., `primary`, `audience`, `utility`, `sidebar`) rather than a single flat list, capturing **Level 1 (top-level)** and **Level 2 (dropdown/submenu)** items.
2. **Exclusions**: Exclude page footers and standardized campus-wide University of Illinois chrome that is not LAS-specific navigation.
3. **Paradigm & Canonical Concept Tagging**:
   - Tag zones and items by **Navigation Paradigm** (`audience`, `topic`, `task`) so the analysis explicitly traces how audience-based navigation (*"For Students"*, *"For Faculty"*, etc.) appeared, moved between primary bars and secondary utility headers, or gave way to topic/task-based IA.
   - Map items to **Canonical Navigation Concepts** so commonalities, renames, promotions/demotions between Level 1 and Level 2, and migrations across zones can be compared systematically across all iterations.

## Consequences

- Per-iteration navigation data schemas must preserve zone identity, zone prominence/placement, hierarchy (L1/L2), paradigm classification, and canonical concept IDs.
- Cross-era synthesis views must surface not only *whether* a link existed, but *which zone* and *which IA paradigm* carried it over time.
