# CLAUDE.md
# Read this file entirely before any action. This file wins over any session instruction.

**0 — What you are.** A read-everything, remember-nothing savant with jagged skill: superhuman in spots, confidently wrong in others, and unable to tell which, right now. You guess to fill gaps, you sound certain either way, and context is your only memory. Everything below follows from this.

**1 — Stay reviewable.** Generation is cheap; my verification is the bottleneck. Ship small, single-concern diffs. Stop at checkpoints before building further. Match autonomy to stakes: trivial path → go; data / money / auth / migrations or code I don't understand → propose first. Name any irreversible move (delete, force-push, drop, mass-rename, schema change) as one.

**2 — Think before typing.** State the assumptions you're acting on. Real ambiguity → give me the options and your pick, don't choose in the dark. Simpler path exists → say so first. I'm wrong → say so. Confused → name it; "I don't know X" beats a confident guess.

**3 — Simplicity = correctness, not style.** Fewer lines is a side effect, never the goal — don't golf. Before writing, take the first rung that holds:
1. Needs to exist at all? no → skip it (YAGNI)
2. Stdlib does it → use it
3. Native platform feature → use it (if it's actually good enough)
4. Already a dependency → use it
5. One honest line → one line
6. Else → the minimum that works

No abstraction for one caller, no unasked config, no future-proofing (add it the 3rd time, not the 1st). Lazy ≠ negligent: never cut validation at trust boundaries, data-loss handling, security, or accessibility. Mark each shortcut with its upgrade path (`// SHORTCUT: in-memory; swap for Redis at 2nd node`) so it's greppable.

**4 — Surgical edits.** Every changed line traces to my request, else revert. Don't tidy, reflow, or rename in passing. Match existing style. Delete only the orphans your change created — leave pre-existing dead or odd code (mention it); it may be load-bearing. Don't strip comments you don't understand.

**5 — Goals, not instructions.** Turn tasks into checks and loop until green: "add validation" → tests for bad inputs pass; "fix bug" → failing test reproduces it, then passes; "refactor" → tests green before and after. Multi-step → show the plan, one line + check each, then run it. Fuzzy goal ("make it work") → sharpen it with me first.

**6 — Keep me in control.** The real risk isn't bad code, it's me not understanding my own system. Leave a one-line "why" for non-obvious calls. Flag code I can no longer review. Periodically sweep the `SHORTCUT:` markers into a list for me — "later" becomes "never" otherwise.

**7 — This file.** Tune by watching where you fail: bad assumption twice → add a line; rule that never changed a diff → delete it. The value lives in the project facts below, not the principles above. Shorter beats complete.

---

## Project

**Name:** Continuous Improvement Financial Impact Calculator  
**Purpose:** Translates Agile flow metrics (throughput, lead time, WIP, defects) into executive-level financial impact — so Scrum Masters and Agile Coaches justify CI value to decision-makers (CFO, directors).  
**Stack:** HTML5 + CSS3 + JS ES6+ vanilla, zero framework, zero backend, `localStorage` only, GitHub Pages.  
**Architecture:** Single file. `index.html` (HTML + `<style>` + `<script>`). Other files: `CLAUDE.md`, `CHANGELOG.md`, `README.md`, `LICENSE`.

### Key functions in `index.html`

| Function | Line | Role |
|---|---|---|
| `calculate` | 1828 | Main orchestrator — reads all inputs, calls 5 pure calc fns (4 dimensions + 1 memo), updates DOM |
| `calcProductivity` | 1749 | Pure calc: returns `{ period, annual }` |
| `calcTTM` | 1755 | Pure calc: returns `{ period, annual }` |
| `calcEfficiency` | 1760 | Pure calc: returns `{ period, annual }` |
| `calcQuality` | 1765 | Pure calc: returns `{ period, annual }` |
| `calcHeadcountSaving` | 1770 | Pure calc: returns `{ period, annual }` — memo line, excluded from Total (see formulas below) |
| `updateDimensionDisplay` | 1775 | DOM update helper — avoids 4× (now 5×) repeated DOM pattern |
| `getAllValues` | 1438 | Serializes all inputs to JS object |
| `setAllValues` | 1460 | Fills inputs from object |
| `loadFromURL` | 1493 | URL params → inputs (takes priority over localStorage) |
| `generateShareableURL` | 1507 | Encodes all inputs as query string |
| `calculateMonths` | 1666 | Timezone-safe month diff (fixed v2.1) |
| `debouncedSave` | 1722 | 800ms debounce — fires after input silence, not every keystroke |
| `migrateOldDates` | 1404 | One-shot migration purging hardcoded dates from old sessions |
| `setDefaultDates` | 1418 | End = today, Start = 3 months prior |
| `checkPeriodWarning` | 1731 | Shows warning if date range < 1 month |
| `validateZeroInputs` | 1741 | Yellow border on `blendRate`/`hoursPerDay` if zero |
| `toggleTheme` / `loadTheme` | 1553 / 1635 | Dark/light + localStorage persistence |
| `toggleCurrency` / `loadCurrency` | 1562 / 1642 | $/€ toggle + recalculate |
| `initTooltips` | 1572 | Click/hover with 44px touch targets via `::after` pseudo-element |
| `showToast` | 1428 | Toast notification |
| `clearSavedData` | 1537 | Resets to `DEFAULTS` object (line 1386) |

### Constants

- `CARRYING_RATE_MONTHLY = 0.02` (line 1384) — 2%/month ≈ 25%/year, standard inventory carrying cost
- `DEFAULTS` (line 1386) — source of truth for all field defaults; `clearSavedData` reads from here
- `SVG_SUN`, `SVG_MOON` (lines 1381–1382) — inline SVGs for theme toggle (`currentColor`-aware)

### localStorage keys

`ci-calculator-data` · `theme` · `currency` · `tooltips-seen`

### URL params

All input IDs are used directly as param names: `blendRate`, `hoursPerDay`, `teamSizeStart`, `teamSizeEnd`, `workingDaysPerWeek`, `workingDaysPerMonth`, `startDate`, `endDate`, `throughputPrev`, `throughputCurr`, `leadTimePrev`, `leadTimeCurr`, `wipPrev`, `wipCurr`, `defectsPrev`, `defectsCurr`.

### The 4 formulas (deliberately independent) + 1 memo line

```
Productivity   -(ΔCostPerItem × throughputCurr × months)
Time-to-Market -(ΔLeadTime × dailyCostEnd × months)           ← NO throughput multiplier
Efficiency     -(ΔWIP × costPerItemCurr × 0.02 × months)      ← 2%/month carrying rate
Quality        -(ΔDefects × costPerItemCurr × months)

Headcount Cost Saving (memo, NOT in Total)
               (teamSizeStart - teamSizeEnd) × monthlyCostPerHead × months
```

The 4 dimensions are deliberately **not linked** to avoid double-counting via Little's Law. Intentional architectural decision since the Excel prototype (2026-02-20).

`calcHeadcountSaving` is a 5th, separate metric — not a 5th independent dimension. It reuses `teamSizeStart`/`teamSizeEnd`, which already feed `costPerItemCurr` (via `monthlyCostEnd`) and therefore `calcProductivity`. Summing it into `totalPeriod`/`totalAnnual` would double-count a real headcount reduction. See G9.

### Code standards

- `const`/`let` only — never `var`. No TypeScript.
- Functions: one responsibility, max 20 lines, max 3 params, verb-first names.
- Numeric inputs: always `parseFloat(value) || 0`. Exception: team size uses `|| 1` (division guard).
- Division: guard before every division — `if (divisor === 0) return 0`.
- Naming: `camelCase` vars/funcs · `UPPER_SNAKE_CASE` constants · `kebab-case` HTML IDs · `kebab-case` filenames.
- No `console.log` in production paths. No empty `catch`. No silent `null`.
- Sanitize all `URLSearchParams` values with `parseFloat || 0` before use.

### Approved libs

| Usage | Current |
|---|---|
| Fonts | Google Fonts CDN (Inter + JetBrains Mono) |
| Dates | native `Date` API |
| Persistence | native `localStorage` |
| Sharing | native `URLSearchParams` |
| Clipboard | native `navigator.clipboard` |

Rule: Can it be done natively in < 20 lines? Yes → do it. No → propose, justify, wait for approval.

### Git

Conventional Commits: `feat` / `fix` / `refactor` / `docs` / `style` / `test`.  
Branches: `main` (prod, auto-deploys to GitHub Pages) · `feat/[name]` · `fix/[name]`.  
Pre-commit gate: no `console.log` · open `index.html` in browser · verify all 4 dimensions + headcount memo line calculate correctly · test dark mode + currency toggle.

### Regression snapshot (v2.5 baseline)

`blendRate=100, h/d=8, team=5→5, 3 months` → productivity ≈ 72 K$, ttm ≈ 60 K$, efficiency ≈ 295 $, quality ≈ 14.8 K$, total ≈ 147 K$, headcount ≈ 0 $ (team unchanged). Use to verify formulas haven't drifted after any calc change.

### Regression snapshot — headcount (v2.7 baseline)

Same inputs but `team=7→5` (workingDaysPerMonth=20): `monthlyCostPerHead = 100 × 8 × 20 = 16 000$` → headcount ≈ `(7-5) × 16 000 × 3` = 96 K$ (period), 384 K$ (annual). The 4 core dimensions above are unaffected by this baseline change *except Productivity*, which already moves with `teamSizeEnd` — that's expected and pre-existing (see G9), not something this feature changes.

---

## Gotchas — highest-signal lessons from 25+ commits

These have caused real bugs. Read before touching any formula or load/save logic.

**G1 — TTM formula: no throughput multiplier.**  
`calcTTM` uses `ΔLeadTime × dailyCost × months` only. A throughput multiplier existed until v2.0 — it caused 10–100× result inflation. Do not reintroduce it.

**G2 — `calculateMonths`: do not simplify.**  
Uses year/month arithmetic, not string subtraction, to be timezone-safe. This fixed a real bug (v2.1) where UTC-parsed dates displayed as J-1 in UTC-4/5 timezones. A "simpler" rewrite will likely reintroduce it.

**G3 — 4 dimensions are deliberately independent.**  
Do not link them through Little's Law or any shared derived variable. Independence prevents double-counting — intentional since v1 (Excel prototype).

**G4 — `DEFAULTS` is the source of truth for reset.**  
`clearSavedData` resets to `DEFAULTS` (line 1144). Every new input field must be added there or it won't clear correctly.

**G5 — `loadFromURL` takes priority over localStorage.**  
URL params always win. Intentional — enables scenario sharing via link. Do not change this load order.

**G6 — Tooltip 44px touch targets via `::after` pseudo-element.**  
`.tooltip-icon::after` extends the hit area without affecting layout (CSS ~line 323). Removing it breaks mobile touch and WCAG 2.5.5 compliance.

**G7 — `migrateOldDates` is load-bearing.**  
Purges hardcoded dates (`2024-08-01` / `2025-01-31`) from stale localStorage sessions. Do not remove it — users with old sessions would get wrong date ranges silently.

**G8 — `setDefaultDates` must run after `loadFromLocalStorage`.**  
Current `DOMContentLoaded` call order: `migrateOldDates` → `loadFromLocalStorage` → `loadFromURL` → `setDefaultDates`. Reversing `loadFromLocalStorage` and `setDefaultDates` was the original v1.8 bug.

**G9 — `calcHeadcountSaving` is a memo line, never add it to `totalPeriod`/`totalAnnual`.**  
It reuses `teamSizeStart`/`teamSizeEnd`, which already feed `costPerItemCurr` and therefore `calcProductivity`. Summing both into the Total would double-count a real headcount reduction. It is deliberately excluded from the sum and labeled "Memo — not included in Total" on its `dim-row-annual` line (v2.7). Do not "fix" this by adding it to the Total without also removing team size from Productivity's cost-per-item math — that's a bigger, separate change (see backlog item "Restructure results into Cost Saving / Cost Avoidance / Working-Capital sub-totals"). `#headcountItem` is also hidden (`display: none`) whenever `headcountSaving.period === 0` (team size unchanged) — there's nothing to disclose in that case; the Breakdown tab stays available regardless.

---

*Updated: 2026-07-03*
