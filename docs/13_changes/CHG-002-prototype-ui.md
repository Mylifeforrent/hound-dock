# CHG-002 — Stage 2 clickable UI prototype

Status: Reviewed
Complexity: Complex
Refs: TBD-BIZ-004, TBD-BIZ-005, TBD-BIZ-007, TBD-INFRA-001, TBD-INFRA-002; CONFLICT: none
Owner: Tech Lead (Docs Agent handoff)

## Plan

- **Goal:** validate the interaction model and MVP scope with a throwaway clickable mock before revising the PRD to v0.2.
- **Approach:** one static prototype with six views (chat, skills, MCP, tasks, runs, admin), synthetic mock data, and no backend, build step, package manifest, or third-party dependency. The prototype lives under `docs/03_design/prototype/` as a design artifact so it cannot be mistaken for the production frontend.
- **Affected paths:** `docs/03_design/prototype/**`, `docs/03_design/README.md`, `docs/13_changes/**`, `docs/12_reviews/**`, `README.md`.
- **Risks:** the mock is mistaken for production; the stack is implicitly locked; real data leaks into mock content. Mitigations: persistent "prototype / mock data" labeling, no framework or package manager, synthetic names and records only, no secrets or PII.
- **Verification plan:** parse the HTML, syntax-check the JavaScript, run link/status/ID/prohibited-artifact checks, walk all six views, confirm no external requests or dependencies, and obtain an independent Verifier review.
- **No production code:** this change does not create `frontend/` or `backend/` application code, a manifest, a lockfile, or a runnable product.

## Task Brief

- **Scope:** a static, clickable UX prototype for the PRD v0.1 flows. No real model calls, MCP connections, authentication, persistence, or task execution.
- **Inputs:** PRD v0.1; the three reference screens (豆包工作, DeepSeek, WorkBuddy); the user's selection of "clickable UI mock, no stack".
- **Outputs:** `docs/03_design/prototype/index.html`, `styles.css`, `app.js`, and `README.md`; design folder and navigation updates; this record; an independent review record.
- **Acceptance criteria:** all six views are reachable; the five core flows are clickable (chat with a skill/search, skill registration, MCP registration/test/allowlist, task definition/test run, run detail); mock data is clearly synthetic; no backend, dependency, package manifest, secret, or production data; keyboard focus and Escape handling work; the prototype is labeled throwaway.
- **Ownership:** Tech Lead authors the prototype while the Docs Agent is dormant, under the Stage 2 handoff pattern recorded in `AGENTS.md` and approved by the user's request in this session. The Verifier owns `docs/12_reviews/**`. Production frontend/backend paths remain untouched.

## Verification

Executed 2026-10-18 (Asia/Shanghai) on branch `docs/prototype-ui`.

| # | Check | Command / method | Result |
|---|---|---|---|
| 1 | HTML structure | `lxml.html.parse` | 6 view sections; 7 `data-view` controls (6 nav + “Run a task”) |
| 2 | JavaScript syntax | `node --check app.js` | Passed |
| 3 | CSS structure | Brace count | 360 opening / 360 closing |
| 4 | External resources | Scan for `script`/`link`/`img` with `http(s)` sources | None; only mock `https://mcp.internal/*` and `https://llm.internal/v1` strings, never fetched |
| 5 | Dependencies | Search for package manifests, lockfiles, `node_modules` | None |
| 6 | Desktop rendering | Headless Chrome, 1440×1100, all six views | All views render; visual review passed |
| 7 | Interaction smoke test | Headless Chrome + DevTools Protocol | 2 initial chat messages; skill drawer opens and returns focus to the trigger; MCP drawer shows 5 tools; tool toggle flips to `false`; task shows 3 steps; test run starts and reaches `Succeeded`; new skill publishes; chat adds 2 messages; **0 runtime exceptions** |
| 8 | Mobile layout | Emulated 390×844 | `scrollWidth = 390`; no overflowing elements |
| 9 | Secret / PII scan | Regex scan for emails, phones, keys, secrets | No matches; all names and records are synthetic |
| 10 | Scope isolation | `git status` + tree | `frontend/` and `backend/` untouched; prototype only under `docs/03_design/prototype/` |
| 11 | Prototype labeling | Manual review | Persistent “Prototype / Mock data” stamp, `MOCK` pill, and README boundary |
| 12 | Review findings closed | Re-test after fixes | Admin approval/write-tool switches replaced by locked policy rows; MCP test toast no longer invents a tool count; skill JSON schema is parsed into inputs (`week`/`date`/required); focus returns to the trigger and Tab is trapped in the drawer/modal |

Reviewer: Verifier — **PASS** with one P1 finding; the P1 and four P2 findings were closed before merge. Independent review record at `docs/12_reviews/CHG-002-review.md`.

## Dependency audit

None — no third-party dependency, package manifest, lockfile, or CDN asset is introduced. Fonts are local OS stacks; icons are inline SVG.

## Decision and conflict log

- 2026-10-18: User chose "clickable UI mock, no stack" over a technical spike, so the prototype MUST NOT lock the frontend/backend stack.
- 2026-10-18: PRD v0.1 remains `Draft`; it will be revised to v0.2 after prototype feedback rather than accepted now.
- 2026-10-18: All prototype content is synthetic; no production data, PII, or secrets are used.
- No `CONFLICT-nnn` was found.
