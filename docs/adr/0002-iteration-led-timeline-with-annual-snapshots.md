# ADR 0002: Iteration-Led Timeline with Annual Snapshots and Wayback Corpus

- **Status**: Accepted
- **Date**: 2026-11-13

## Context

Internet Archive's Wayback Machine holds continuous annual HTTP 200 captures of the College of LAS homepage from April 2000 through 2026 across `www.las.uiuc.edu`, `www.las.illinois.edu`, and `las.illinois.edu`, alongside the live `las.illinois.edu` site (with no pre-2000 captures in Wayback). Showing only redesign years hides year-to-year continuity and URL migrations, while giving all ~27 years full standalone navigation write-ups would repeat identical analyses within multi-year template eras.

## Decision

1. **Two-tier chronological structure**:
   - **Design Iterations (Eras)** anchored by **Major Refresh** years serve as the primary highlighted timeline milestones, each with a featured homepage showcase and full navigation analysis.
   - **Annual Snapshots (2000–present)** are nested inside their parent Design Iteration so visitors can scrub year-by-year and observe intra-era visual or navigation drift.
2. **Corpus & capture pipeline**:
   - Source 2000–present captures reproducibly via local Node/Playwright scripts from the Wayback Machine plus the live `las.illinois.edu` homepage.
   - Keep the snapshot/iteration JSON schema extensible so manual pre-2000 screenshots or archival records can be inserted cleanly if discovered later.

## Consequences

- Capture tooling must implement polite sequential rate-limiting, retry/backoff, and local disk caching because `web.archive.org` throttles concurrent requests (HTTP 429).
- Criteria distinguishing a **Major Refresh** from **Intra-Era Drift**—and rules for the 2008–2013 `uiuc.edu` / `illinois.edu` overlap—must be explicitly defined (tracked in subsequent ADRs).
