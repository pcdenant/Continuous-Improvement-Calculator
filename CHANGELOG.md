# Changelog

All notable changes to the CI Financial Impact Calculator are documented here.

---

## [v2.13] — 2026-07-04

### Fixed — Contraste du warning de période en thème clair

* **`.period-warning` illisible en clair** : texte `var(--yellow)` (#FFF200) sur fond crème — contraste largement sous le seuil WCAG AA. Le style de base passe en ambre foncé (`#6b5d00`, ≈ 5.8:1 sur le fond du bandeau) avec bordure renforcée ; un override `[data-theme="dark"] .period-warning` conserve à l'identique le rendu jaune du thème sombre (pattern d'override par composant déjà utilisé pour `header`).

### Note

* CSS uniquement — aucune logique touchée ; `input.input-zero` utilise aussi la bordure jaune en clair (signal visuel, pas du texte) — laissé tel quel, à traiter si gênant.

---

## [v2.12] — 2026-07-04

### Added — Observé vs extrapolé (F3, RICE — absorbe F9)

* **Libellés annuels explicites** : « Projected Annual: » → « Projected Annual (×12): » sur les 4 dimensions et le Total (placeholders HTML + `updateDimensionDisplay` + `calculate`). L'extrapolation n'est plus implicite.
* **Total hero marqué observé** : « Total Financial Impact » → « Total Financial Impact — Observed over Period ».
* **Note de méthode** (`#methodNote`, sous le Total hero) : chiffres de période = observés sur la plage sélectionnée ; chiffres annuels = extrapolation ×12 ; plus la période est courte, plus la projection est indicative. **Cette phrase absorbe le finding F9** (« data-window quality flag ») — l'item F9 sort du backlog RICE, `checkPeriodWarning` couvrant déjà le cas < 1 mois.

### Tests

* **`tests/ux-regression.js` — nouveau bloc `T21`** : libellé « (×12) » sur les 5 lignes annuelles, mention « Observed over Period » sur le Total hero, présence de la note de méthode avec la mise en garde période courte.

### Note

* Zéro changement calculatoire — libellés et texte statique uniquement ; snapshots A/B inchangés.

---

## [v2.11] — 2026-07-04

### Fixed — Une seule histoire de démo (F7, RICE)

* **`value=` HTML alignés sur `DEFAULTS`** : le premier chargement racontait une régression (throughput 50→40, defects 8→25, WIP 25→25) alors que « Clear Saved Data » racontait une amélioration (`DEFAULTS` : 40→52, 8→4, 22→15). Les 6 attributs divergents (`throughputPrev/Curr`, `leadTimeCurr`, `wipPrev/Curr`, `defectsCurr`) sont alignés sur `DEFAULTS` — cohérent avec l'intention v2.0 (« defaults plausibles d'amélioration au premier chargement »).

### Tests

* **`tests/ux-regression.js` — nouveau bloc `T20`** : pour chaque clé de `DEFAULTS`, l'attribut HTML `value` (statique — pas la valeur runtime, pour que localStorage/URL ne masquent pas une divergence) doit être ≡ `DEFAULTS`. Verrouille contre toute re-divergence.

### Note

* Zéro changement de formule — seuls les attributs par défaut changent ; snapshots A/B inchangés.

---

## [v2.10] — 2026-07-04

### Removed — Input `workingDaysPerWeek` inutilisé (F8, RICE)

* **Champ "Working Days per Week" supprimé** : collecté, sauvegardé dans localStorage et partagé par URL depuis v1.x, mais jamais lu par `calculate()` (la variable dérivée `weeklyCost` avait été supprimée en v1.9b). Retiré de l'input HTML, de `DEFAULTS` et de `getAllValues`.
* **Compatibilité descendante** : les vieux localStorage / vieilles URLs contenant encore `workingDaysPerWeek` sont ignorés silencieusement — `setAllValues` a déjà un null-guard (`if (element)`), aucune migration nécessaire.

### Docs

* CLAUDE.md : param retiré de la liste « URL params » ; numéros de ligne de la table des fonctions et des constantes resynchronisés avec le fichier.
* README.md : « Working Days per Week / per Month » → « Working Days per Month ».

### Note

* Zéro changement calculatoire — le champ n'alimentait aucune formule ; snapshots A/B inchangés.

---

## [v2.9] — 2026-07-04

### Removed — Fichiers égarés à la racine du repo (F11, RICE)

* **3 fichiers de sauvegarde supprimés** : `indexV1.bak`, `index_v1.3.bak`, `index_v1.9.bak` — l'historique git est la seule source de versions précédentes.
* **2 livrables de sessions UI passées supprimés** : `ui-recommendations.html`, `ui-recommendations-v2.html` — propositions déjà implémentées (v2.x), conservées dans l'historique git.

### Note

* Zéro changement de comportement — `index.html` et les tests ne référencent aucun de ces fichiers.

---

## [v2.8] — 2026-07-03

### Test — Formula-level regression suite (F4, RICE #5)

* **`tests/formula-regression.js`** (nouveau, script Node pur, zéro dépendance, zéro navigateur) : extrait le vrai code source des 5 fonctions de calcul + `calculateMonths` depuis `index.html` (pas une réimplémentation à la main — élimine le risque de dérive silencieuse que ce ticket doit justement corriger) et vérifie 36 assertions : les 2 scénarios de baseline CLAUDE.md (valeurs exactes), le plancher de mois à 1 (G2), les entrées dérivées à zéro (division gardée en amont), `teamSizeStart === teamSizeEnd`, les signes négatifs, et la constante `CARRYING_RATE_MONTHLY`.
* **`tests/ux-regression.js` — nouveau bloc `T19`** : vérifie que les valeurs ET le texte des formules affichés dans le panneau Breakdown correspondent exactement au calcul réel (risque de dérive distinct — ces écritures DOM sont séparées des 5 fonctions pures dans `calculate()`).
* **CLAUDE.md — snapshot de régression complété** : les sections "v2.5" et "v2.7" étaient incomplètes (ne spécifiaient pas throughput/leadTime/WIP/defects, valeurs approximatives "≈"). Remplacées par deux scénarios A/B entièrement spécifiés, aux valeurs exactes, vérifiées par les deux suites de tests.

### Note

* Preuve que les deux suites ont des dents : un test de mutation (réintroduction du bug historique G1 dans `calcTTM`, puis désynchronisation d'une valeur `bd-*` du panneau Breakdown) confirme que chaque suite échoue bien sur le fichier muté et repasse au vert sur le fichier réel.
* Zéro changement de comportement — uniquement des tests et de la documentation.

---

## [v2.7] — 2026-07-03

### Added — Headcount Cost Saving (F5, RICE #2)

* **Nouvelle ligne "Headcount Cost Saving"** : nouvelle fonction pure `calcHeadcountSaving(teamSizeStart, teamSizeEnd, monthlyCostPerHead, months)` (`{ (teamSizeStart - teamSizeEnd) × monthlyCostPerHead × months }`), affichée dans une 5e `dim-row` après le "Total Financial Impact", avec onglet breakdown dédié.
* **Volontairement exclue du Total** : `totalPeriod`/`totalAnnual` restent la somme des 4 dimensions existantes uniquement — une réduction d'effectif fait déjà baisser `costPerItemCurr` (donc Productivity), l'ajouter au Total aurait doublé le comptage du même gain. Documenté en détail dans CLAUDE.md (nouvelle Gotcha G9) et README.md.
* **Croissance d'équipe → valeur négative**, pas de plancher à 0 — formule symétrique.

### Fixed — Revue post-PR (retours mobiles)

* **Ligne masquée quand headcount = 0** (effectif inchangé) : plus rien d'affiché dans le résumé, l'onglet Breakdown "HEADCOUNT" reste lui toujours accessible.
* **Badge `.memo-badge` retiré** — c'était le seul style de pastille/tag improvisé du fichier, sans précédent ailleurs, et il retombait sur sa propre ligne sur mobile. Remplacé par le texte "Memo — not included in Total" directement sur la ligne `.dim-row-annual`, déjà utilisée par les 4 autres dimensions.
* **Opacité de la ligne (`.dim-row-memo { opacity: 0.85 }`) retirée** — elle se répercutait sur le tooltip descendant, le rendant plus transparent que les 4 autres tooltips de l'app. La bordure pointillée + le texte memo suffisent comme signal visuel.

### Note

* Zéro changement aux 4 formules existantes (`calcProductivity`, `calcTTM`, `calcEfficiency`, `calcQuality`) — la nouvelle fonction est purement additive et n'entre dans aucune somme existante.
* Snapshot de régression (blendRate=100, h/d=8, équipe=5→5, mois=3) toujours valide, `headcount` masqué (effectif inchangé).

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
