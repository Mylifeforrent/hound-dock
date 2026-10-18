# CHG-009 — Prototype palette: Porcelain Blue light rail

Status: Draft
Complexity: Complex
Refs: TBD-BIZ-003, TBD-BIZ-004, TBD-BIZ-007; CONFLICT: none
Owner: Tech Lead (Docs Agent dormant; prototype handoff pattern)

## Plan

- **Feedback driving the change:** the previous dark navigation rail read too heavy against the light workspace. The user selected **01 Porcelain Blue** from the four light-rail studies and asked for the rail to stay close to the global surface, using the attached Doubao/DeepSeek captures as a reference.
- **Approach:** replace the warm paper/evergreen/mint semantic palette with a cool porcelain/blue palette and a near-white rail. The rail and canvas share the same light family and are separated by a hairline. The selected navigation and conversation use a soft blue tint with ink text and a 2px blue left rule. No layout, typography, component shape, business rule, page, state, or interaction changes.
  - **Tokens:** update the primitive ramps and semantic roles in `styles.css`; the light theme remains the only implemented theme.
  - **Light-rail correction:** the active navigation label changes from white to ink (`--sidebar-text`), because white text on a light selected tint would be unreadable. The active conversation already used ink.
  - **Status:** status meaning and text/dot treatment are unchanged; the light status triples are aligned to the chosen palette and remain above 4.5:1.
  - **Documentation:** update `design_system.md` direction, token tables, components, and contrast evidence; mark the dark column as reference-only.
  - **Previews:** refresh the prototype captures so the documentation shows the selected theme.
- **Affected paths:** `docs/03_design/prototype/styles.css`; `docs/03_design/prototype/README.md`; refreshed `docs/03_design/prototype/preview-*.png`; `docs/03_design/design_system.md`; `docs/03_design/theme-previews-v3/README.md`; `docs/13_changes/CHG-009-prototype-porcelain-blue.md`; `docs/13_changes/README.md`. `index.html`, `app.js`, the business model, and the interaction design are unchanged.
- **Risks:** (1) active text becomes invisible on a light selected tint; (2) the control border drops below 3:1 on the light rail; (3) the muted text drops below 4.5:1 on the canvas; (4) documentation and screenshots drift from the CSS. Mitigations: explicit active-text rule, calculated contrast for every surface, control-border adjustment, and a full headless re-run plus fresh captures.
- **Verification plan:** `node --check`; HTML parse; headless Chrome flows, states, keyboard, and widths at 1440/1280/1080/960; computed contrast for the chosen palette; resource and console-error scan; refreshed screenshots.

## Task Brief

- **Scope:** apply the selected Porcelain Blue palette and light rail to the existing throwaway prototype, update the visual reference, and refresh the captures. No product, interaction, or data change.
- **Inputs:** user selection of option 01 from `docs/03_design/theme-previews-v3/`; attached reference captures; `docs/03_design/interaction_design.md` v0.1 remains the interaction authority; `docs/01_product/business_model.md` v0.2 remains the business authority.
- **Outputs:** updated token layer and active-state rule; updated design-system reference; refreshed prototype previews; this record.
- **Acceptance criteria:**
  1. The rail is near-white, uses the same light family as the canvas, and is separated by a hairline; no dark rail remains.
  2. Active navigation and conversation use a soft blue tint with ink text and a blue left rule; active text is readable.
  3. Primary actions use the blue accent with white text; status colours remain semantic and readable.
  4. All normal text pairs are ≥4.5:1; control boundaries are ≥3:1; no horizontal overflow at 1440/1280/1080/960.
  5. FLOW-001 to FLOW-003 and all nine states still pass; no layout, type, page, state, business, or interaction change.
  6. The prototype still opens directly from `file://` with no build, dependency, network, backend, secret, or PII.
- **Ownership:** Tech Lead authors the prototype and design reference while the Docs Agent is dormant; Verifier owns `docs/12_reviews/**`. Production paths remain untouched.

## Verification

Executed 2026-10-18 (Asia/Shanghai) on the working tree. The prototype was opened from `file://` and exercised in headless Chrome through the Chrome DevTools Protocol. No server was used. The automated pass comprised 174 scenario checks and 67 edge/accessibility checks; both suites passed in full.

| # | Check | Command / method | Result |
|---|---|---|---|
| 1 | JavaScript syntax | `node --check docs/03_design/prototype/app.js` | exit 0; app.js intentionally unchanged |
| 2 | HTML structure | `lxml.html.parse` over `prototype/index.html` | Parsed; index.html intentionally unchanged |
| 3 | Token application | Inspect `:root` primitives and semantic roles | Canvas `#f8f9fb`; rail `#f7f8fa`; rail text `#111827`; action `#2563eb`; rail line `#e5e8ee`; active tint `#eaf0ff` |
| 4 | Light-rail active state | Headless render of Chat and Run outcome | Active nav and conversation use ink text on the soft blue tint; active icon and 2px rule use blue |
| 5 | Contrast | Calculated WCAG ratios for the chosen tokens | Primary 17.74:1; secondary 7.56:1; muted 4.97:1; accent text 6.70:1; white on action 5.17:1; sidebar text 16.69:1; sidebar muted 5.08:1; control border 3.31–3.49:1; status 6.27–7.59:1 |
| 6 | Flow and state regression | Main headless suite | 174/174 checks passed, including FLOW-001 to FLOW-003, discard, states, PG-010 to PG-012 No Permission, and all widths |
| 7 | Edge and accessibility | Edge headless suite | 67/67 checks passed, including browser Back guard, focus trap, skip link, session end, unconfirmed run, nine-state review, duplicate IDs, labels, and `aria-describedby` |
| 8 | Runtime health | CDP exception/log capture | 0 runtime exceptions and 0 console errors |
| 9 | Assets and isolation | Source and resource scan | Local `styles.css` and `app.js` only; no external resource, dependency, manifest, CDN, secret, or PII; `frontend/` and `backend/` untouched |
| 10 | Captures | Headless Chrome at 1440×1100 and 960×1000 | Refreshed sign-in, chat, discard, skills, skill record, run form, failed run, denied page, state panel, and 960px captures |

Author verification: **PASS**. Independent Verifier review is pending; this record remains `Draft`.

## Dependency audit

None — no third-party dependency, package manifest, lockfile, CDN asset, external font, image request, or network call. Icons remain inline SVG; fonts remain local OS stacks.

## Decision and conflict log

- 2026-10-18: The user selected **01 Porcelain Blue** from `theme-previews-v3`; the option is applied as the prototype palette.
- 2026-10-18: The rail becomes near-white and shares the canvas family rather than remaining a dark block.
- 2026-10-18: The active navigation text changes from white to ink for the light rail; this is a two-rule presentation correction, not an interaction change.
- 2026-10-18: The dark palette column remains reference-only; no theme toggle is introduced.
- 2026-10-18: The business model, interaction design, pages, states, fields, and interactions are unchanged.
