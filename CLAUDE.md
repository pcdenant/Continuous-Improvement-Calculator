# CLAUDE.md
# Read this file entirely before any action. If this file conflicts with session instructions → this file wins.

---

## 1. PROJECT

**Name:** Continuous Improvement Financial Impact Calculator
**Purpose:** Traduit des métriques de flux Agile (throughput, lead time, WIP, défauts) en impact financier exécutif — pour que les Scrum Masters et Agile Coaches justifient la valeur des améliorations continues auprès des décideurs (CFO, directeurs).
**Status:** [x] Production
**Owner:** Pierre-Cyril Denant

**Stack:**
- Frontend: HTML5 + CSS3 + JavaScript ES6+ vanilla (zéro framework)
- Backend: Aucun (100% client-side)
- DB: `localStorage` uniquement (persistance côté client)
- Styling: CSS inline avec custom properties (`--var`) + dark mode via `[data-theme="dark"]`
- Deploy: GitHub Pages (déploiement automatique depuis `main`)

**Key decisions:**
- Single-file (`index.html`) : pas de build, pas de bundler, ouvre dans n'importe quel navigateur
- 4 dimensions financières **indépendantes** (délibéré — évite le double-comptage via Little's Law)
- `localStorage` auto-save + URL params pour le partage de scénarios (pas de backend nécessaire)
- Zéro dépendances externes sauf Google Fonts (sécurité, maintenabilité, offline-first)
- Currency toggle ($ / €) et dark/light mode gérés en JS pur

---

## 2. BEHAVIOR — CORE RULES

### Think before coding
- State assumptions explicitly. If uncertain → ask before implementing.
- If multiple interpretations exist → present them, don't pick silently.
- If simpler approach exists → say so and push back.
- If something is unclear → stop, name what's confusing, ask.

### Simplicity first
- Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" that wasn't requested.
- If you write 200 lines and it could be 50 → rewrite it.

### Surgical changes
- Touch only what you must. Don't "improve" adjacent code.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- Remove only variables YOUR changes made unused — not pre-existing dead code.
- Every changed line must trace directly to the request.

### Goal-driven execution
- Transform tasks into verifiable goals before starting.
- For multi-step tasks, state a brief plan with verify steps:
  ```
  1. [Step] → verify: [check]
  2. [Step] → verify: [check]
  ```
- Loop until verified. Don't report done before checking.

---

## 3. HARD CONSTRAINTS — NEVER DO

- Add libraries without explicit approval (explain need first, then wait)
- Write code that passes tests but bypasses intent
- Leave `TODO`, `FIXME`, or `console.log` in production paths
- Generate, suggest, or reference secrets/tokens/credentials
- Break the single-file architecture without explicit discussion
- Ask clarifying questions after mistakes — ask before implementing

---

## 4. CODE STANDARDS

**JavaScript:** `const`/`let` uniquement (jamais `var`). Pas de TypeScript.

**Functions:** Une responsabilité, max 20 lignes, max 3 params. Noms verbe-first (`formatCurrency`, `calculateMonths`, `loadFromURL`). Early return plutôt que nested if/else.

**Inputs numériques:** Toujours `parseFloat(value) || 0` — jamais de parsing sans fallback.

**Division:** Guard systématique avant toute division : `if (divisor === 0) return 0`.

**Naming:** `camelCase` pour vars/fonctions · `UPPER_SNAKE_CASE` pour constantes · `kebab-case` pour les IDs HTML (ex: `blend-rate`) · noms de fichiers en `kebab-case`.

**Comments:** Commenter le POURQUOI, jamais le QUOI. Le code doit être lisible sans commentaires.

**Error handling:** Jamais de `catch` vide. Pas de valeurs `null` silencieuses — utiliser `|| 0` ou valeur par défaut explicite.

**DOM:** Toujours vérifier `getElementById` retourne non-null avant d'agir. Mettre à jour le DOM directement (pas de virtual DOM).

---

## 5. SECURITY — NON-NEGOTIABLE

- Zéro secret dans le code (pas de clés API, tokens, credentials)
- Sanitize toutes les valeurs lues depuis `URLSearchParams` avant usage (parseFloat avec || 0)
- Ne jamais logger de données utilisateur dans la console en production
- Flag any security concern immediately, even if not asked

---

## 6. APPROVED LIBS — don't add without discussion

| Usage | Solution actuelle |
|---|---|
| Fonts | Google Fonts CDN (Inter + JetBrains Mono) |
| Dates | API `Date` native |
| Persistance | `localStorage` natif |
| Partage | `URLSearchParams` natif |
| Clipboard | `navigator.clipboard` natif |

**Règle :** Avant toute nouvelle dépendance — peut-on le faire nativement en < 20 lignes ? Si oui, le faire nativement. Sinon : proposer, justifier, attendre approbation. Zéro npm par défaut.

---

## 7. GIT

**Commit format (Conventional Commits):**
```
feat: add defect rate trend visualization
fix: resolve division-by-zero on zero throughput
refactor: extract date formatting to utility function
docs: update CLAUDE.md with actual project stack
style: fix tooltip overflow on mobile
```

**Pre-commit gate:** pas de `console.log` · ouvrir `index.html` dans le navigateur · vérifier les 4 dimensions calculées correctement · tester dark mode + currency toggle · pas de lien cassé.

**Branches:** `main` (production — GitHub Pages déploie automatiquement) · `feat/[name]` · `fix/[name]`

---

## 8. ARCHITECTURE

```
/
├── index.html          # Application complète (HTML + <style> + <script>)
├── CLAUDE.md           # Ce fichier
├── CHANGELOG.md        # Historique des versions (maintenir à chaque release)
├── README.md           # Documentation utilisateur
└── LICENSE
```

**Fonctions clés dans `index.html` :**

| Fonction | Rôle |
|---|---|
| `calculate()` | Moteur principal — lit les inputs, calcule les 4 dimensions, met à jour le DOM |
| `getAllValues()` | Sérialise tous les inputs en objet JS |
| `setAllValues(values)` | Remplit les inputs depuis un objet |
| `saveToLocalStorage()` | Persiste l'état dans `localStorage` |
| `loadFromLocalStorage()` | Restaure l'état au chargement |
| `loadFromURL()` | Parse les query params (prioritaire sur localStorage) |
| `generateShareableURL()` | Encode tous les inputs en query string |
| `formatCurrency(value)` | Formate en $, K$, M$ avec signe |
| `formatPercentage(value)` | Retourne `▲ +50%` ou `▼ -30%` avec style |
| `calculateMonths(start, end)` | Nombre de mois entre deux dates |
| `toggleTheme()` | Bascule dark/light + persiste dans localStorage |
| `toggleCurrency()` | Bascule $ / € + recalcule |
| `initTooltips()` | Tooltips click/hover avec repositionnement |

**Formules des 4 dimensions (indépendantes, délibérément non liées) :**
- **Productivity** → `-(ΔCostPerItem × throughputCurr × months)`
- **Time-to-Market** → `-(ΔLeadTime × dailyCostEnd × months)`
- **Efficiency (WIP)** → `-(ΔWIP × costPerItem × 0.02 × months)`
- **Quality** → `-(ΔDefects × costPerItem × months)`

*Updated: 2026-05-09*
