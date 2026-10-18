# CHG-008 — Prototype interaction build: effective pages PG-001 to PG-009

Status: Draft
Complexity: Complex
Refs: TBD-BIZ-003, TBD-BIZ-004, TBD-BIZ-005, TBD-BIZ-007, TBD-BIZ-008, TBD-BIZ-009, TBD-BIZ-010, TBD-BIZ-011, TBD-BIZ-013; CONFLICT-001 referenced only
Owner: Tech Lead (Docs Agent dormant; prototype handoff pattern from CHG-002 and CHG-005)

## Plan

- **Feedback driving the change:** the interaction design v0.1 settles a nine-page effective surface (PG-001 to PG-009) with three direct-URL-only denied surfaces (PG-010 to PG-012). The existing prototype under `docs/03_design/prototype/` still implements the superseded information architecture: a Manage drawer, Runs/Audit/Usage/Settings destinations, conversation row actions, a run-context rail, and authoring forms. Those surfaces are excluded by the interaction design and must not survive.
- **Approach:** rebuild the throwaway prototype as a single static bundle (`index.html`, `styles.css`, `app.js`) with a hash router so `index.html` opens directly from `file://`. Implement only PG-001 to PG-009 as navigable pages, plus direct-URL-only No Permission panels for PG-010 to PG-012. Keep the settled business model and interaction rules unchanged; the prototype only renders them.
  - **Flows:** FLOW-001 sign-in, FLOW-002 chat send, and FLOW-003 manual run are clickable end to end, including the confirmed success and failure feedback.
  - **States:** every page implements the nine-state matrix from interaction design §6; N/A states are explained in a prototype-only state-coverage panel and in the prototype README. Forced states are review controls, not product states.
  - **Confirmation:** the only dialog is the §5.3 `Discard unsent text?` confirmation. No delete, publish, rename, pin, sign-out, or account affordance is rendered.
  - **Visual layer:** the design-system semantic tokens and local OS font stacks are used as presentation reference only. No dark theme, no theme toggle, no brand decision, and no mobile layout below 960px.
- **Affected paths:** `docs/03_design/prototype/index.html`, `styles.css`, `app.js`, `README.md`; refreshed prototype captures and removal of the stale `preview-manage`, `preview-tasks`, `preview-usage`, and `preview-dark` captures; a supersession note in `docs/03_design/design_system.md`; `docs/13_changes/CHG-008-prototype-interaction-build.md`; `docs/13_changes/README.md`. No `frontend/**`, `backend/**`, product document, or business-model edit.
- **Risks:** (1) carrying over an excluded capability or field; (2) a state matrix that is claimed but not rendered; (3) direct-URL routes resolving to the wrong page; (4) a static hash router failing on `file://`; (5) responsive overflow at 960px; (6) inventing sample records that are mistaken for settled integrations. Mitigations: a page/field trace to the interaction design, per-page state coverage in the review panel and README, route-order tests for reserved names (`new`, `edit`, `run`), no module imports or network requests, headless-Chrome width checks at 1440/1280/1080/960, and clearly synthetic fixtures.
- **Verification plan:** `node --check`; HTML parse and duplicate-ID scan; local-resource-only scan; route and flow smoke tests in headless Chrome via CDP; nine-state coverage walk; keyboard/focus and discard-dialog checks; screenshots at the desktop baseline and 960px; `frontend/`/`backend/` untouched; no dependency, build, network, secret, or PII.

## Task Brief

- **Scope:** rebuild the clickable design prototype for the confirmed MVP and the three denied authoring surfaces, with synthetic data only. The prototype is a throwaway design artifact and MUST NOT be promoted to `frontend/`.
- **Inputs (authority order):**
  1. `docs/01_product/business_model.md` v0.2 — business rules.
  2. `docs/03_design/interaction_design.md` v0.1 — IA, FLOW-001 to FLOW-003, nine-state matrix, 1440px layout, exclusions.
  3. `docs/03_design/design_system.md` — presentation-layer reference only.
- **Outputs:** static `index.html`, `styles.css`, `app.js`, refreshed prototype `README.md`, this record, and updated change-record index.
- **Acceptance criteria:**
  1. FLOW-001, FLOW-002, and FLOW-003 are clickable end to end from entry to completion.
  2. PG-001 to PG-009 navigate to one another and show the specified success and failure feedback.
  3. Every page covers the nine states of interaction design §6; every N/A has a stated reason.
  4. The only dialog is `Discard unsent text?`; there is no delete or publish entry point anywhere.
  5. Layout holds at the 1440px baseline and down to 960px; no mobile design is claimed.
  6. PG-010 to PG-012 are absent from navigation, render only No Permission with a readable recovery, and expose no write affordance.
  7. No capability, role, page-level action, field, or state outside the input documents; no production code; no build, dependency, network, backend, secret, or PII.
- **Ownership:** Tech Lead authors the prototype while the Docs Agent is dormant; Verifier owns `docs/12_reviews/**`. `frontend/**` and `backend/**` remain untouched.

## Verification

Executed 2026-10-18 (Asia/Shanghai) on the working tree. The prototype was opened from `file://` and exercised in headless Chrome through the Chrome DevTools Protocol. No server was used. The automated pass comprised 174 scenario checks and 67 edge/accessibility checks; both suites passed in full.

| # | Check | Command / method | Result |
|---|---|---|---|
| 1 | JavaScript syntax | `node --check docs/03_design/prototype/app.js` | exit 0 |
| 2 | HTML structure | `lxml.html.parse` over `prototype/index.html` | Parsed; no duplicate static IDs; one local stylesheet and one local script |
| 3 | Local-only assets | Resource scan and source scan | Only `styles.css` and `app.js` are requested; no CDN, external font, image request, `fetch`, XHR, or remote URL |
| 4 | FLOW-001 | Headless Chrome: sign-in form submit, submitting state, failure inspection, success | Success enters Chat; generic denial is leak-free; missing fields focus the first invalid field; submitting locks both fields |
| 5 | FLOW-002 | New chat, empty message, send, pending turn, assistant completion, failure inspection | Exactly one assistant message on success; composer locks while pending; failure removes the pending assistant turn, keeps the user message, and offers Try again |
| 6 | FLOW-003 | Task selection, validation, submit, Initiated/Running/terminal, failed step, rejected run | `weekly-digest` succeeds; `ticket-triage` fails at step 2 with step 3 `Skipped`; `health-check` is rejected before any step; invalid inputs create no run; no-run and unconfirmed states stay on PG-008 |
| 7 | Discard confirmation | In-app navigation and browser Back with unsent chat text; run-input leave | The only dialog is `Discard unsent text?`; Stay preserves text and focus; Discard clears the relevant draft and navigates; Escape acts as Stay; focus is trapped |
| 8 | State coverage | Review panel on all 12 routes; forced specified states | Nine rows on every page; N/A reasons present; specified states render without exceptions |
| 9 | Permissions | Direct PG-010 to PG-012 URLs | No Permission only; readable back route; no form, input, textarea, or write button; no navigation link to these routes |
| 10 | Desktop layout | Headless Chrome at 1440, 1280, 1080, 960 over seven representative routes | No horizontal page overflow; 3/2/2 column registry grid; split stacks at 1080; step table stacks at 960 while keeping status; chat column 760/720/648 |
| 11 | Content exclusions | Product-copy scan over the shell and page | No Manage, Usage, Audit, Settings, Rename, Pin, Delete, Publish, Mock, or Prototype copy in product surfaces |
| 12 | Accessibility structure | Duplicate IDs, labels, `type` attributes, `aria-describedby` | 0 duplicate IDs, 0 unlabelled fields, 0 buttons without `type`, 0 dangling descriptions; skip link focuses `#main`; page changes focus the page heading |
| 13 | Runtime health | CDP exception/log capture across flows and forced states | 0 runtime exceptions and 0 console errors |
| 14 | Contrast | WCAG calculation on the token values | Primary 17.34:1, secondary 7.52:1, muted 5.26:1, accent text 9.02:1, sidebar 15.46:1, control border 3.20–3.55:1, status pairs 6.57–8.24:1 |
| 15 | Preview captures | 1440×1100 and 960×1000 | `preview-signin`, `preview-chat`, `preview-skills`, `preview-skill-record`, `preview-run-form`, `preview-run-failed`, `preview-denied`, `preview-states`, `preview-960` |
| 16 | Isolation | `git status`, dependency/manifest scan, secret/PII pattern scan | `frontend/` and `backend/` untouched; no manifest, lockfile, package, CDN, secret, or PII; synthetic fixtures only |

Author verification: **PASS**. Independent Verifier review is pending; this record remains `Draft`.

## Dependency audit

None — no third-party dependency, package manifest, lockfile, CDN asset, external font, image request, or network call. Icons are inline SVG; fonts are local OS stacks.

## Decision and conflict log

- 2026-10-18: Rebuild rather than patch the superseded prototype. The excluded Manage/Runs/Audit/Usage/Settings surfaces and conversation row actions are removed.
- 2026-10-18: Synthetic fixture records are used only to exercise the confirmed flows; they do not select a first integration, task, skill, or input set (TBD-BIZ-005 remains open).
- 2026-10-18: The prototype-only state-coverage panel is a review control, not a product surface. It exposes only the nine states already specified and never links PG-010 to PG-012.
- 2026-10-18: Session and data are in memory and reset on refresh; no client or server persistence. A direct URL to PG-010 to PG-012 requires an existing session, as any authenticated route does.
- 2026-10-18: Light theme only. The design-system dark theme remains a prototype demonstration, not a confirmed product requirement.
- 2026-10-18: The run fixtures are synthetic demo records, not a first integration or task selection. `weekly-digest`, `ticket-triage`, and `health-check` only exercise success, step failure, and pre-step rejection; TBD-BIZ-005 remains open.
- 2026-10-18: A hash router is used so `index.html` opens from `file://` without a server. Session and fixtures are in memory; refresh returns to PG-001. Direct entry to PG-010 to PG-012 requires an existing session, as every authenticated route does.
- 2026-10-18: The state review control is deliberately outside the product chrome, dashed and labelled “States”; it is the only prototype-only surface. It is hidden in product preview captures and shown only in the dedicated state-coverage capture.
- 2026-10-18: The only dialog is the §5.3 discard confirmation. No delete, publish, sign-out, account, or authoring dialog exists.
