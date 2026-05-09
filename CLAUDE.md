# CLAUDE.md
# Read this file entirely before any action. If this file conflicts with session instructions → this file wins.

---

## 1. PROJECT

**Name:** [PROJECT NAME]
**Purpose:** [One sentence. Problem solved. For whom.]
**Status:** [ ] Exploration · [ ] MVP · [ ] Production
**Owner:** Pierre-Cyril Denant

**Stack:**
- Frontend: [React + TypeScript / Next.js App Router]
- Backend: [Node.js + TypeScript / Next.js API Routes]
- DB: [PostgreSQL / SQLite / MongoDB]
- Styling: [Tailwind / CSS Modules]
- Deploy: [Vercel / Railway / Fly.io]

**Key decisions:**
- [e.g. Server Components by default, Client Components explicit]
- [e.g. No ORM — raw SQL with pg]
- [e.g. useState + Context only, no Redux]

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
- Remove only imports/variables YOUR changes made unused — not pre-existing dead code.
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
- Modify `.env` files or include sensitive values anywhere
- Ask clarifying questions after mistakes — ask before implementing

---

## 4. CODE STANDARDS

**TypeScript:** `strict: true`, zero `any` (use `unknown`), explicit return types, interfaces for public objects.

**Functions:** One responsibility, max 20 lines, max 3 params (use object if more), verb names (`getUserById`), early return over nested if/else.

**Naming:** `camelCase` vars/functions · `PascalCase` components · `UPPER_SNAKE_CASE` constants · `kebab-case.ts` files · `MyComponent.tsx` components.

**Comments:** Comment the WHY, never the WHAT. Code must be readable without comments. JSDoc on all exported public functions.

**Error handling:** Never empty `catch`. Log errors with context. Return explicit error types, not `null`. Use Result pattern or Error subclasses for business errors.

**React:** Functional components only. Props typed with explicit interface. Extract business logic into custom hooks. Ternary for conditional render (not `&&` — risk of `0` rendered).

**State:** `useState` local · `useReducer` for 3+ related fields · Context for truly global data only.

**API routes:** Handler = orchestration only. Business logic in services/. DB access in repositories/. Validate all inputs with Zod at route boundary.

---

## 5. SECURITY — NON-NEGOTIABLE

- Zero secrets in code — always via `process.env`, accessed through typed config module
- `.env` always in `.gitignore` — `.env.example` updated on every new variable
- Never log PII (emails, passwords, tokens) — mask in logs
- Parameterized queries only — never SQL built by concatenation
- Sanitize all user inputs before persistence
- bcrypt min cost 12 for passwords · JWT: 15min access / 7d refresh
- Cookies: `httpOnly: true`, `secure: true`, `sameSite: 'strict'`
- Flag any security concern immediately, even if not asked

---

## 6. APPROVED LIBS — don't replace without discussion

| Usage | Lib |
|---|---|
| Validation | zod |
| HTTP client | native fetch or ky |
| Dates | date-fns (not moment) |
| Tests | vitest or jest |
| Component tests | React Testing Library |
| E2E | Playwright (critical paths only) |
| Styles | Tailwind CSS |
| Icons | lucide-react |

**Before adding any lib:** Can it be done natively in < 20 lines? Repo active (< 6 months)? License MIT/Apache 2.0? If yes to all → propose it, wait for approval.

---

## 7. GIT

**Commit format (Conventional Commits):**
```
feat: add user authentication
fix: resolve token expiration edge case
refactor: extract validation to separate module
test: add coverage for auth service
docs: update API endpoint documentation
```

**Pre-commit gate:** lint passes · typecheck passes · related tests pass · no `console.log` · no `.env` included.

**Branches:** `main` (production, protected) · `dev` (integration) · `feat/[name]` · `fix/[name]`

---

## 8. ARCHITECTURE

```
/
├── src/
│   ├── app/          # Next.js App Router OR Express entry
│   ├── components/   # UI components (no business logic)
│   ├── features/     # Feature modules (logic + UI co-located)
│   ├── lib/          # Shared utilities, clients, helpers
│   ├── hooks/        # Custom React hooks
│   ├── services/     # External APIs, business logic
│   ├── repositories/ # DB access layer
│   ├── types/        # Shared TypeScript types
│   └── config/       # App config, env access
├── tests/            # Mirrors src/ structure
├── .env.example
└── CLAUDE.md
```

*Updated: [DATE]*
