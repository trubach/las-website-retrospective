# Domain Glossary — LAS Website History & Retrospective

This glossary defines the ubiquitous language used across the codebase, data schemas, Architecture Decision Records (ADRs), and editorial copy.

## Core Historical & Timeline Terms

- **URL Epoch**: One of the three canonical hostname eras of the College of LAS homepage, ordered oldest to newest (with `las.illinois.edu`—no `www`—as the canonical modern hostname, and `*.illinois.edu` always taking canonical precedence whenever overlapping `*.uiuc.edu`):
  1. `www.las.uiuc.edu` (earliest Wayback captures April 2000; canonical through summer 2008).
  2. `www.las.illinois.edu` (canonical from August 2008 through 2018).
  3. `las.illinois.edu` (canonical bare-domain HTTPS era from 2019 to present).
- **URL Epoch Transition**: A hostname cutover between URL Epochs that occurs *without* a simultaneous visual layout overhaul; displayed as a distinct badge on the timeline rather than treated as a separate Design Iteration.
- **Design Iteration (Era)**: A contiguous multi-year period in which the LAS homepage shared the same fundamental visual layout and template system. A new Design Iteration is triggered strictly by a **Major Refresh** (substantial visual layout/template overhaul) and receives a dedicated navigation analysis.
- **Major Refresh**: A milestone year in which the homepage underwent a substantial visual layout/template overhaul. Highlighted prominently on the timeline with its launch year and full navigation breakdown.
- **Annual Snapshot**: A single representative desktop homepage capture (1280×900 screencap + source metadata + archival link, preferring clean early-fall captures) for a calendar year (2000–present, extensible to pre-2000 manual entries), nested within its parent Design Iteration so visitors can step year-by-year through subtle intra-era changes.
- **Intra-Era Drift**: Navigation edits, label renames, item additions/removals, secondary bar adjustments, or minor CSS tweaks occurring between Annual Snapshots inside the same visual Design Iteration without constituting a Major Refresh.

## Navigation & Information Architecture (IA) Terms

- **Navigation Zone (Navigation Element)**: A distinct structural navigation container on the homepage, modeled separately rather than flattened into one list. Standard zone types:
  - **Primary Navigation**: The main horizontal menu bar, mega-menu, or primary left-hand navigation column presenting core college sections.
  - **Audience Bar**: A dedicated bar, menu, or portal cluster segmented by user persona/role (e.g., *"Prospective Students"*, *"Current Students"*, *"Faculty & Staff"*, *"Alumni & Friends"*, *"Parents"*).
  - **Utility Header**: Secondary top-of-page links for high-intent actions or meta-tools (e.g., *"Give"*, *"Directory"*, *"Contact"*, *"MyLAS / Intranet"*, search triggers, or condensed *"Info For..."* triggers).
  - **Contextual / Hero Sidebar**: Secondary homepage navigation lists when functioning as structural site wayfinding rather than transient news links.
  - *(Excluded from scope)*: Page footers and standardized campus-wide University of Illinois chrome that is not LAS-specific wayfinding.
- **Navigation Depth**: The hierarchy level of a link within a Navigation Zone:
  - **Level 1 (Top-Level)**: Immediately visible bar/sidebar items or top-level dropdown triggers.
  - **Level 2 (Submenu / Dropdown)**: Direct child items revealed via hover, click, mega-menu column, or nested sublist under a Level 1 item. (Analysis stops at Level 2.)
- **Navigation Paradigm**: The organizing principle behind a Navigation Zone or item:
  - **Audience-Based IA**: Wayfinding organized around *who the visitor is* (e.g., *"For Students"*, *"For Faculty"*). Tracked specifically across iterations to document its early prominence, migration between primary and utility zones, and decline/transformation under modern task-oriented UX conventions.
  - **Topic / Domain-Based IA**: Wayfinding organized around institutional subject areas (e.g., *"Academics"*, *"Research"*, *"Departments & Programs"*, *"News"*).
  - **Task / Action-Based IA**: Wayfinding organized around concrete user goals (e.g., *"Apply"*, *"Give"*, *"Find a Major"*, *"Make an Advising Appointment"*).
- **Canonical Navigation Concept**: One of ~20–25 normalized, era-agnostic concepts (e.g., `academics-units`, `majors-programs`, `admissions-apply`, `advising-support`, `research`, `alumni`, `giving`, `audience-students`, `audience-faculty-staff`) grouped under 6–7 high-level **Concept Domains**, linking equivalent navigation items across eras despite wording, depth, or zone changes while preserving verbatim labels in per-era trees and diffs.
- **Concept Domain**: One of the 6–7 top-level thematic groupings organizing Canonical Navigation Concepts in the Cross-Era Continuity Matrix (e.g., *About & Organization*, *Admissions & Recruitment*, *Academics & Curricula*, *Student Support & Experience*, *Research & Impact*, *Alumni & Giving*, *Audience Gateways*).
- **Debut-Year Anchor**: The rule that each Design Iteration's primary showcase screencap and canonical navigation tree represent its clean debut/launch year, while mid-era menu edits are summarized separately as **Intra-Era Drift**.
- **Footer Displacement**: The targeted analytical exception to footer exclusion—recorded when an entire audience navigation group previously housed in header navigation (e.g., *"Resources for faculty and staff"*) is intentionally removed from primary/header navigation and relocated to the page footer.
- **Recruitment-First IA**: The modern LAS navigation strategy prioritizing prospective/current student recruitment and external engagement (`Visit`, `Apply`, `Give`, `Admissions`, `Academics`, `Student resources`) in primary and utility header zones while intentionally keeping internal campus audiences (`Faculty`, `Staff`) out of primary navigation.

