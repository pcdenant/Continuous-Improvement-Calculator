# Changelog

All notable changes to the CI Financial Impact Calculator are documented here.

---

## [v1.9b] — 2026-04-16

### Fixed
- Tooltip overflow on mobile — removed negative margin/padding technique that broke positioning context; replaced with `::after` pseudo-element for 44px touch target
- Tooltip `translateX(-50%)` on small screens caused left-side overflow; replaced with `max-width: calc(100vw - 2rem)` + JS dynamic repositioning on right overflow
- Default dates not applying — `setDefaultDates()` was called before `loadFromLocalStorage()`, so cached values overwrote dynamic dates; order corrected
- One-shot migration: localStorage entries with hardcoded dates `2024-08-01` / `2025-01-31` are purged automatically on first load

### Fixed (code quality)
- Division by zero risk on `costPerItemPrev` and `costPerItemCurr` — added ternary guards (`throughputX > 0 ? ... : 0`)
- All 14 `parseFloat()` calls missing NaN fallback — added `|| 0` (or `|| 1` for team size) across all inputs
- Dead variable `weeklyCost` removed (calculated, never used)

---

## [v1.9] — 2026-04-16

### Added
- Tooltip click/tap toggle — replaced hover-only trigger with click + mouseenter/mouseleave combo; works on mobile and desktop
- Touch target extended to 44px via `::after` pseudo-element on `.tooltip-icon`
- Tooltip auto-closes on outside tap/click
- Only one tooltip open at a time
- Dynamic repositioning: tooltip adjusts `left` offset if it overflows the right edge of the viewport

### Changed
- Tooltip icon size: 16px → 20px
- `cursor: help` → `cursor: pointer` on `.tooltip-trigger`

---

## [v1.8] — 2026-04-16

### Added
- Default dates are now dynamic: End Date = today, Start Date = 3 months prior
- Dates update on every page load without overwriting user-saved values

### Changed
- Tooltip titles: "Productivity Impact" etc. → "Why this number moves" (all 4)
- Tooltip texts: removed AI-writing patterns ("not headcount reduction", "Leadership tracks this as competitive advantage", "the metric CFOs actually track", "not process compliance, actual cost avoided")
- Tooltip blockers label: "Common Blockers" → "Blockers"

---

## [v1.7] — 2026-04-16

### Added
- Tooltip pulse animation (yellow ring) on `?` icons at first load
- Pulse stops on first tooltip open; state persisted in localStorage (`tooltips-seen`)

### Changed
- Tooltip icon: `i` → `?`
- Language toggle removed — i18n system (FR/EN) fully removed from code (~150 lines)
- Common Blockers — Productivity: replaced "Manual processes not automated" with "Too much WIP causing context-switching overhead"
- Common Blockers — WIP: rewrote 3 blockers with more specific, actionable language

### Fixed
- Double `calculate()` call and orphan `});` in DOMContentLoaded (caused loading error in v1.6)
- 27 orphan `data-i18n` attributes removed from HTML

---

## [v1.6] — 2026-04-16

### Added
- Language toggle button (ENG/FR) — later removed in v1.7
- Full FR translation of Breakdown labels, rationales, and UI strings
- Breakdown restructured: Title → Formula box → "For leadership" label + exec translation → Rationale → Numbers
- Footer simplified: `un outil de Collaboration Solved par Pierre-Cyril Denant — 2026`

### Changed
- Toggle controls: replaced verbose toggle-group components with 3 compact icon buttons (☀️, $, ENG)
- Title: `CI Impact Calculator — by Collaboration Solved` (later revised in v1.8)
- Subtitle: `Translate flow metrics into financial impact for leadership. In minutes.`
- Breakdown headers: `Productivity Details` → `Productivity — Delivery Cost Reduction` etc.

---

## [v1.5] — 2026-03-28

### Changed
- Title: `Continuous Improvement Impact Calculator` → `CI Impact Calculator — by Collaboration Solved`
- Subtitle: `Quantifies the Business Value of Continuous Improvement` → `Translate flow metrics into executive-level financial impact. In minutes.`
- Breakdown rationales: rewritten to remove AI-writing patterns
- Tooltip texts: `Execs care because` pattern removed across all 4 dimensions
- Footer: added CTA link to SM Survival Score (`sm-survival-score.vercel.app`)

### Added
- Exec translation layer in Breakdown:
  - Productivity → Delivery Cost Reduction
  - Time-to-Market → Revenue Acceleration
  - Efficiency (WIP) → Carrying Cost Reduction
  - Quality → Rework Cost Elimination

---

## [v1.4] — 2026-03-28

### Added
- Euro currency toggle: symbol placement right-aligned, consistent with dollar
- Blend Rate unit label updates dynamically (`$/hour` ↔ `€/hour`)
- Team Size split into Start / End fields (smaller end team can reflect increased efficiency)
- Tooltips with educational content on all 4 Summary dimensions
- Common Blockers per dimension in tooltips
- localStorage auto-save with 2-second toast notification
- URL parameter sharing via "Save/Share Link" button
- Clear Data with confirmation dialog
- Light/Dark mode toggle (light default)
- Bento Grid layout with brand colors: green `#006946`, yellow `#FFF200`, cream `#FBF3EB`
- Inter + JetBrains Mono fonts
- Section titles: yellow-on-cream corrected to green-on-cream for readability
- Footer: version number, report an issue link, collaborationsolved.com

### Changed
- Input labels: `Previous` / `Current` → `Start` / `End`
- Summary section: dynamic date range in title
- Savings values: color-coded (yellow = positive, red = negative)
- K$ / M$ formatting with one decimal

---

## [v1.1 – v1.3] — 2026-03-28

Initial web-based build. Core calculator logic, 4 savings dimensions, basic HTML layout. Iterative UI refinements before Bento Grid redesign.

---

## [Excel version] — 2026-02-20

First implementation in `.xlsx` via Python/openpyxl. Identified and resolved:
- Double-counting (Little's Law / WIP–Throughput–Lead Time interdependency)
- Directional logic errors in savings formulas (ABS() replaced with signed deltas)
- Decision to treat 4 dimensions as independent categories — deliberate simplification
