# ADR 0007: Interactive Views and Recruitment-First IA Framing

- **Status**: Accepted
- **Date**: 2026-11-13

## Context

Stakeholders need both per-iteration navigation clarity and a longitudinal view explaining *how* and *why* LAS navigation evolved—specifically the transition away from early persona/audience bars (*"For Students"*, *"For Faculty/Staff"*) toward the current **Recruitment-First IA** where prospective student recruitment anchors primary/utility wayfinding and internal campus audiences (faculty, staff) are intentionally kept out of primary navigation.

## Decision

1. **Dual-Level Paradigm Tagging & Footer Displacement**:
   - Tag both **Navigation Zones** and individual **items** by paradigm (`audience`, `topic`, `task`, `hybrid`).
   - Record **Footer Displacement** as a targeted exception to footer exclusion whenever a former header persona group (such as *"Resources for faculty and staff"*) moved out of header navigation into the footer.
   - Explicitly document the institutional UX rationale in modern LAS iterations: focusing primary/header navigation on student recruitment while intentionally removing internal campus audiences (`Faculty`, `Staff`) from primary navigation.
2. **Three-Part Interactive Analytical Experience**:
   - **Per-Iteration Multi-Zone Breakdown**: Visual zone cards (`Primary`, `Audience Bar`, `Utility Header`, `Sidebar`) expandable to Level 2, with paradigm-mix indicators, L1/L2 counts, and UX/IA commentary.
   - **Cross-Era Synthesis Section**: Interactive **Canonical Concept Continuity Matrix** (tracking evergreen vs. transient concepts and zone residency over time) paired with a dedicated **Audience-to-Recruitment IA Evolution** visual and narrative analysis.
   - **Side-by-Side Iteration Diff Tool**: Interactive selector comparing any two Design Iterations across screencaps and item/zone additions, removals, renames, depth changes, and displacements.

## Consequences

- Data schemas must capture item-level paradigm tags and optional `footerDisplaced` records per iteration, powering all three interactive views from a single source of truth.
