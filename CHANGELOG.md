# Changelog

All notable changes to the CI Financial Impact Calculator are documented here.

---

## [v2.7] — 2026-07-03

### Added — Headcount Cost Saving (F5, RICE #2)

* **Nouvelle ligne "Headcount Cost Saving"** : nouvelle fonction pure `calcHeadcountSaving(teamSizeStart, teamSizeEnd, monthlyCostPerHead, months)` (`{ (teamSizeStart - teamSizeEnd) × monthlyCostPerHead × months }`), affichée dans une 5e `dim-row` après le "Total Financial Impact", avec badge "Memo — not in Total" et onglet breakdown dédié.
* **Volontairement exclue du Total** : `totalPeriod`/`totalAnnual` restent la somme des 4 dimensions existantes uniquement — une réduction d'effectif fait déjà baisser `costPerItemCurr` (donc Productivity), l'ajouter au Total aurait doublé le comptage du même gain. Documenté en détail dans CLAUDE.md (nouvelle Gotcha G9) et README.md.
* **Croissance d'équipe → valeur négative**, pas de plancher à 0 — formule symétrique.

### Note

* Zéro changement aux 4 formules existantes (`calcProductivity`, `calcTTM`, `calcEfficiency`, `calcQuality`) — la nouvelle fonction est purement additive et n'entre dans aucune somme existante.
* Snapshot de régression (blendRate=100, h/d=8, équipe=5→5, mois=3) toujours valide, `headcount ≈ 0$` (effectif inchangé).

---

## [v2.6] — 2026-07-02

### Added — Disclosure (F12, RICE #1)

* **Note de lecture "Reading note" sur Time-to-Market et Quality** : nouveau bloc dans le tooltip existant de ces deux dimensions, indiquant que Lead Time et Defects partagent le même flux non stratifié — un changement de mix de travail entre deux périodes peut déplacer la moyenne sans réel gain/perte de flux. Réutilise le pattern `.tooltip-blockers` existant (nouvelles classes `.tooltip-caveat` / `.tooltip-caveat-title` / `.tooltip-caveat-text`), aucun changement JS ni de formule.

### Note

* Zéro changement de comportement calculatoire — `calcTTM`/`calcQuality` inchangées, snapshot de régression (blendRate=100, h/d=8, équipe=5, mois=3) toujours valide.

---

## [v2.5] — 2026-05-09

### Refactoring — Architecture JS

* **Constante `CARRYING_RATE_MONTHLY`** : déplacée au niveau module (était inlinée dans `calculate()`)
* **Objet `DEFAULTS` centralisé** : valeurs par défaut unifiées — `clearSavedData()` utilise désormais une source unique plutôt que 12 assignations hardcodées dispersées
* **`calculate()` décomposée** : 4 fonctions pures extraites — `calcProductivity`, `calcTTM`, `calcEfficiency`, `calcQuality` — chacune retourne `{ period, annual }` ; fonction principale réduite de 103 à 63 lignes
* **`updateDimensionDisplay()`** : helper extrait supprimant le pattern DOM dupliqué × 4 (20 lignes de répétition éliminées)
* **Convention de signe unifiée** : les 4 dimensions affichent désormais `▲ +X%` quand la métrique s'améliore — correction d'une incohérence où TTM/WIP/Qualité affichaient `▼` en texte mais coloraient en vert

### Tests

* **Suite Playwright complète** — 58 assertions couvrant : calculs des 4 dimensions (valeurs numériques exactes), signes des pourcentages d'amélioration, toggle devise, toggle thème, clear data, breakdown panel, share link, régression sur zéros, snapshot de référence

### Note

* Zéro changement de comportement observable — calculs, affichage, persistance et partage identiques
* Snapshot de régression (blendRate=100, h/d=8, équipe=5, mois=3) : productivity=72.0 K$, ttm=60.0 K$, efficiency=295$, quality=14.8 K$, total=147.1 K$

---

## [v2.4] — 2026-05-09

### Added — UX (Groupe 4)

* **Helper text Blend Rate** : `<small class="input-hint">` ajouté sous le champ — "Fully-loaded hourly cost — salary, benefits & overhead". Accessible, aucun JS requis.
* **SVG inline ☀️/🌙** : Emojis remplacés par des SVGs `currentColor` dans le bouton de thème. Rendu cohérent cross-OS/navigateur, s'adapte à la couleur du thème. Constantes `SVG_SUN`/`SVG_MOON` utilisées dans `toggleTheme()` et `loadTheme()`.
* **Avertissement période < 1 mois** : `#periodWarning` affiché si startDate et endDate sont dans le même mois. Fonction `checkPeriodWarning()` indépendante, appelée sur chaque input et au chargement.
* **Validation visuelle inputs critiques à 0** : `blendRate` et `hoursPerDay` à 0 reçoivent la classe `input-zero` (border + glow jaune). Fonction `validateZeroInputs()` indépendante. Les métriques de flux à 0 ne sont pas affectées (valeur valide).

### Tests

* Suite Playwright étendue de 38 à 46 tests — 4 nouveaux cas T14–T17 couvrant tous les fixes du Groupe 4

---

## [v2.3] — 2026-05-09

### Fixed — Accessibilité (Groupe 3)

* Landmark `<main>` ajouté : `<div class="container">` → `<main class="container">` — les technologies d'assistance peuvent maintenant naviguer directement au contenu principal
* Headings sémantiques `<h3>` dans le Breakdown : les 4 `<div class="breakdown-header">` (Productivity, Time-to-Market, Efficiency, Quality) remplacés par `<h3>` — navigabilité par headings activée

### Fixed — UX (Groupe 3)

* Bouton "Clear Saved Data" séparé visuellement (`margin-left: auto`) — éloigné des actions principales pour éviter les clics accidentels

### Note

* `cursor: pointer` sur `.btn`, `.btn-secondary`, `.btn-danger` — déjà présent avant l'audit ; verrouillé par test Playwright T12

### Tests

* Suite Playwright étendue de 30 à 38 tests — 4 nouveaux cas T10–T13 couvrant tous les fixes du Groupe 3

---

## [v2.2] — 2026-05-09

### Fixed — Accessibilité (Groupe 2)

* `prefers-reduced-motion` media query ajoutée — désactive toutes les animations et transitions (`0.01ms`) si l'utilisateur a activé "Reduce Motion" dans son OS. Couvre `pulse-ring`, `fadeIn`, et les 10+ `transition` du CSS.
* `.icon-btn` : `min-width` et `height` portés de 40px à 44px — conforme Apple HIG et WCAG 2.5.5 (touch target minimum)

### Fixed — UX (Groupe 2)

* Label WIP corrigé : "WIP (items/month)" → "WIP (items in progress)" — le WIP est un stock, pas un débit mensuel. Cohérent avec le Breakdown.

---

## [v2.1] — 2026-05-09

### Fixed — Accessibilité (Groupe 1)

* Labels `for` ajoutés sur les 10 sub-inputs Start/End (teamSizeStart/End, throughputPrev/Curr, leadTimePrev/Curr, wipPrev/Curr, defectsPrev/Curr) — screen reader compliance et click-to-focus
* Taille de texte minimum portée à 12px (0.75rem) sur `.breakdown-formula-title` et `.tooltip-blockers-title` (étaient à 11px / 0.6875rem)
* Contraste couleur dégradation `.summary-improvement.negative` : `#FF9500` → `rgba(255,255,255,0.9)` — ratio WCAG AA ≥ 4.5:1 sur fond vert `#006946` (ratio précédent ~3:1)

### Fixed — UX (Groupe 1)

* Debounce du save à 800ms — `saveToLocalStorage()` retiré de `calculate()`, remplacé par `debouncedSave()` sur les events `input`. Plus de toast spammé à chaque keystroke ; un seul toast après 800ms d'inactivité
* Bug timezone sur `formatDate()` — les dates ISO ("2026-05-09") étaient parsées en UTC et affichées J-1 dans les fuseaux UTC-4/5. Correction : parse en heure locale via `new Date(year, month-1, day)`

---

## [v2.0] — 2026-04-22

### Fixed — Formula corrections (credibility)

* **Time-to-Market**: Removed `× Items/Month End` from formula. The per-item daily cost and the throughput multiplier cancelled mathematically, producing 10–100× inflation. New formula: `-(ΔLeadTime × DailyCost × Months)`. Rationale updated accordingly.
* **Efficiency (WIP)**: Added a 2%/month carrying rate (≈ 25%/year, standard cost-of-capital proxy). WIP is a stock metric — multiplying a stock directly by months without a rate treats it as a 100%/month holding cost, which is indefensible. New formula: `-(ΔWIP × Cost/Item End × 2% × Months)`.
* **Default values in Clear Data**: Previous defaults showed throughput declining and defects tripling — all savings in red on first load. Corrected to a plausible improvement scenario (throughput +30%, lead time −38%, WIP −32%, defects −50%).

### Fixed — Display

* `formatCurrency`: Removed spurious `.0` suffix on values below 1 000 (e.g. `375.0$` → `375$`). K$ and M$ formatting unchanged.
* **Percentage direction for TTM, WIP, Quality**: The `▲/▼` indicator now reflects the real direction of the metric, not the savings direction. A lead time drop of 38% displays as `▼ −38%` (jaune). A lead time increase displays as `▲ +61%` (orange). Color logic (`updateImprovementStyle`) is unchanged — only the text display is negated for the three "less is better" metrics.
* **Removed "Positive values = Savings • Negative values = Cost increase" note**: This legend was inconsistent with the percentage display after the direction fix and has been removed. Color and arrow indicators are self-sufficient.

### Changed — Breakdown

* **Time-to-Market breakdown**: Removed "Items per Month (End)" detail row (no longer part of formula). Rationale rewritten.
* **Efficiency (WIP) breakdown**: Added "Carrying Rate (monthly)" detail row showing 2%. Rationale rewritten with plain-language explanation of carrying cost concept.
* **Formula text strings** updated in both sections to match corrected formulas.

---

## [v1.9b] — 2026-04-16

### Fixed

* Tooltip overflow on mobile — removed negative margin/padding technique that broke positioning context; replaced with `::after` pseudo-element for 44px touch target
* Tooltip `translateX(-50%)` on small screens caused left-side overflow; replaced with `max-width: calc(100vw - 2rem)` + JS dynamic repositioning on right overflow
* Default dates not applying — `setDefaultDates()` was called before `loadFromLocalStorage()`, so cached values overwrote dynamic dates; order corrected
* One-shot migration: localStorage entries with hardcoded dates `2024-08-01` / `2025-01-31` are purged automatically on first load

### Fixed (code quality)

* Division by zero risk on `costPerItemPrev` and `costPerItemCurr` — added ternary guards (`throughputX > 0 ? ... : 0`)
* All 14 `parseFloat()` calls missing NaN fallback — added `|| 0` (or `|| 1` for team size) across all inputs
* Dead variable `weeklyCost` removed (calculated, never used)

---

## [v1.9] — 2026-04-16

### Added

* Tooltip click/tap toggle — replaced hover-only trigger with click + mouseenter/mouseleave combo; works on mobile and desktop
* Touch target extended to 44px via `::after` pseudo-element on `.tooltip-icon`
* Tooltip auto-closes on outside tap/click
* Only one tooltip open at a time
* Dynamic repositioning: tooltip adjusts `left` offset if it overflows the right edge of the viewport

### Changed

* Tooltip icon size: 16px → 20px
* `cursor: help` → `cursor: pointer` on `.tooltip-trigger`

---

## [v1.8] — 2026-04-16

### Added

* Default dates are now dynamic: End Date = today, Start Date = 3 months prior
* Dates update on every page load without overwriting user-saved values

### Changed

* Tooltip titles: "Productivity Impact" etc. → "Why this number moves" (all 4)
* Tooltip texts: removed AI-writing patterns ("not headcount reduction", "Leadership tracks this as competitive advantage", "the metric CFOs actually track", "not process compliance, actual cost avoided")
* Tooltip blockers label: "Common Blockers" → "Blockers"

---

## [v1.7] — 2026-04-16

### Added

* Tooltip pulse animation (yellow ring) on `?` icons at first load
* Pulse stops on first tooltip open; state persisted in localStorage (`tooltips-seen`)

### Changed

* Tooltip icon: `i` → `?`
* Language toggle removed — i18n system (FR/EN) fully removed from code (~150 lines)
* Common Blockers — Productivity: replaced "Manual processes not automated" with "Too much WIP causing context-switching overhead"
* Common Blockers — WIP: rewrote 3 blockers with more specific, actionable language

### Fixed

* Double `calculate()` call and orphan `});` in DOMContentLoaded (caused loading error in v1.6)
* 27 orphan `data-i18n` attributes removed from HTML

---

## [v1.6] — 2026-04-16

### Added

* Language toggle button (ENG/FR) — later removed in v1.7
* Full FR translation of Breakdown labels, rationales, and UI strings
* Breakdown restructured: Title → Formula box → "For leadership" label + exec translation → Rationale → Numbers
* Footer simplified: `un outil de Collaboration Solved par Pierre-Cyril Denant — 2026`

### Changed

* Toggle controls: replaced verbose toggle-group components with 3 compact icon buttons (☀️, $, ENG)
* Title: `CI Impact Calculator — by Collaboration Solved` (later revised in v1.8)
* Subtitle: `Translate flow metrics into financial impact for leadership. In minutes.`
* Breakdown headers: `Productivity Details` → `Productivity — Delivery Cost Reduction` etc.

---

## [v1.5] — 2026-03-28

### Changed

* Title: `Continuous Improvement Impact Calculator` → `CI Impact Calculator — by Collaboration Solved`
* Subtitle: `Quantifies the Business Value of Continuous Improvement` → `Translate flow metrics into executive-level financial impact. In minutes.`
* Breakdown rationales: rewritten to remove AI-writing patterns
* Tooltip texts: `Execs care because` pattern removed across all 4 dimensions
* Footer: added CTA link to SM Survival Score (`sm-survival-score.vercel.app`)

### Added

* Exec translation layer in Breakdown:
  + Productivity → Delivery Cost Reduction
  + Time-to-Market → Revenue Acceleration
  + Efficiency (WIP) → Carrying Cost Reduction
  + Quality → Rework Cost Elimination

---

## [v1.4] — 2026-03-28

### Added

* Euro currency toggle: symbol placement right-aligned, consistent with dollar
* Blend Rate unit label updates dynamically (`$/hour` ↔ `€/hour`)
* Team Size split into Start / End fields (smaller end team can reflect increased efficiency)
* Tooltips with educational content on all 4 Summary dimensions
* Common Blockers per dimension in tooltips
* localStorage auto-save with 2-second toast notification
* URL parameter sharing via "Save/Share Link" button
* Clear Data with confirmation dialog
* Light/Dark mode toggle (light default)
* Bento Grid layout with brand colors: green `#006946`, yellow `#FFF200`, cream `#FBF3EB`
* Inter + JetBrains Mono fonts
* Section titles: yellow-on-cream corrected to green-on-cream for readability
* Footer: version number, report an issue link, collaborationsolved.com

### Changed

* Input labels: `Previous` / `Current` → `Start` / `End`
* Summary section: dynamic date range in title
* Savings values: color-coded (yellow = positive, red = negative)
* K$ / M$ formatting with one decimal

---

## [v1.1 – v1.3] — 2026-03-28

Initial web-based build. Core calculator logic, 4 savings dimensions, basic HTML layout. Iterative UI refinements before Bento Grid redesign.

---

## [Excel version] — 2026-02-20

First implementation in `.xlsx` via Python/openpyxl. Identified and resolved:

* Double-counting (Little's Law / WIP–Throughput–Lead Time interdependency)
* Directional logic errors in savings formulas (ABS() replaced with signed deltas)
* Decision to treat 4 dimensions as independent categories — deliberate simplification
