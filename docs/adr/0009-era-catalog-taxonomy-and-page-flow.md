# ADR 0009: Empirical Era Catalog, Debut-Year Anchoring, Concept Granularity, and Page Flow

- **Status**: Accepted
- **Date**: 2026-11-13

## Context

Inspection of Wayback Machine snapshots (2000–2026) and live `las.illinois.edu` markup identified distinct HTML/CSS template eras, intra-era menu adjustments, and the scope of navigation links across 27 years. Final structural rules were needed for anchoring multi-year iterations, sizing the canonical concept taxonomy, and ordering the single-page layout.

## Decision

1. **Empirical Design Iteration Catalog (2000–Present)**:
   - **2000** (`www.las.uiuc.edu`): Early HTML 4-table flat institutional directory.
   - **2001–2004** (`www.las.uiuc.edu`): 7-table graphical layout introducing LAS's first Audience + Topic navigation (*"For Students"*, *"For Faculty and Staff"*, *"For Alumni and Friends"*).
   - **2005–mid 2008** (`www.las.uiuc.edu`): 13-table + `/css/las.css` feature layout (with 2006–2007 `mainnav.css` dropdown additions recorded as Intra-Era Drift).
   - **2008–early 2014** (`www.las.illinois.edu`, coinciding with the Aug 2008 `uiuc.edu` → `illinois.edu` URL Epoch Transition): ATLAS tableless CSS standards layout (`/_includes/styles/screen.css`) separating a topic utility header from audience navigation.
   - **2014–2015** (`www.las.illinois.edu`): Bootstrap 3.1.1 responsive debut (`las.css`, `newnav.css`) with slate architectural header, topic utility bar, and a 100% audience-driven primary mega-menu.
   - **2016–2018** (`www.las.illinois.edu`): Illini Orange full-width header banner, white top utility bar with prominent `GIVE to LAS` CTA, and 3-column news card-grid layout overhaul while retaining the 4-audience primary mega-menu.
   - **2019–2020** (`las.illinois.edu`, coinciding with the 2019 bare-domain HTTPS URL Epoch Transition): Drupal 8 launch retiring the audience primary mega-menu in favor of topic primary navigation paired with a 6-item `"I want to..."` task utility bar, and displacing `"Resources for faculty and staff"` to the footer.
   - **2021–2024** (`las.illinois.edu`): Verified via rendered screenshots as a substantial visual layout overhaul—introducing the white Block-I campus brand header, condensing header utility CTAs to `Apply to LAS` and `Make a gift`, renaming `Life + Career Design` to `Career readiness` (and to `Student resources` in 2023 Intra-Era Drift), and adding a secondary `Faculty and staff resources` link under `About` alongside the footer menu.
   - **2025–Present** (`las.illinois.edu`): Illinois Web Theme (`illinois_framework_theme` + Campus Toolkit v3 `<ilw-header>`) implementing Recruitment-First IA (`Visit | Apply | Give` utility CTAs, prospective/student focus in primary navigation, and internal faculty/staff resources kept out of primary navigation in the footer).
2. **Debut-Year Anchor**: Anchor each Design Iteration's featured screencap and canonical navigation tree to its clean debut year, documenting notable mid-era menu adjustments in an **Intra-Era Navigation Drift** callout on that iteration.
3. **Two-Tier Canonical Concept Taxonomy**: Normalize navigation items into **~20–25 Canonical Navigation Concepts** grouped under **6–7 Concept Domains**, keeping exact verbatim link text and URLs in per-iteration trees and side-by-side diffs.
4. **Single-Page Narrative Flow & Source Verification**:
   1. **Hero & Key Executive Takeaways**
   2. **Sticky Era & Section Jump Bar**
   3. **Chronological Retrospective (2000 → Present)** with inline multi-zone navigation breakdowns, Intra-Era Drift notes, annual snapshot scrubbers, full-page screencap lightboxes, and direct Wayback Machine verification links
   4. **Cross-Era Navigation Synthesis** (Canonical Concept Continuity Matrix + Audience-to-Recruitment IA Evolution)
   5. **Interactive Side-by-Side Iteration Diff Tool**

## Consequences

- Every branch of the design tree is settled with concrete, testable rules for data extraction, screenshot capture, schema design, UI layout, and editorial narrative.
