# CHG-005 — Prototype visual system v2: quiet console, layout, and design tokens

Status: Reviewed
Complexity: Complex
Refs: TBD-BIZ-003, TBD-BIZ-004, TBD-BIZ-007, TBD-INFRA-001, TBD-INFRA-009; CONFLICT: none
Owner: Tech Lead (Docs Agent handoff)

## Plan

- **Feedback driving the change:** the prototype validates the information architecture, but the visual layer still reads as an editorial document rather than a daily workspace. The oversized page heroes push chat below the fold, the chat panel does not fill the viewport, labels are frequently 8–9.5px, hierarchy depends on tiny uppercase monospace text, and the CSS has a flat set of raw color variables with hard-coded rgba values throughout.
- **Approach:** keep the distinctive paper/ink/mint identity but recast it as a precise, calm "quiet console":
  - **Shell:** fixed 272px sidebar and 56px topbar; the content pane owns scrolling. Chat fills the viewport; registry views use a compact page header + toolbar + content rhythm.
  - **Chat-first:** remove the chat hero and context duplication; the conversation panel becomes a full-height working surface with its own header, scrolling thread, pinned composer, and a right-hand run-context rail that collapses to a drawer on narrow screens.
  - **Design tokens:** introduce a three-layer token system in `styles.css` (primitive → semantic → component), with an 8px spacing rhythm, a modular type scale, elevation/radius/motion tokens, and a complete dark-theme semantic mapping. No raw hex values in component rules.
  - **Type and contrast:** raise functional text sizes (11–14px), reserve uppercase mono for eyebrows and micro-labels, use the serif only for brand, page titles, card titles, and empty states, and meet WCAG AA for core text and controls.
  - **Components:** consistent 6/10/14px radii, pill status badges, search/filter toolbars, skill/MCP/task cards with scannable metadata, a run ledger with status summary, a usage dashboard with an accessible chart, and an audit table with actor/action filtering.
  - **Theme:** add a token-driven light/dark toggle as a design-system demonstration; the default remains light. The toggle is client-only and resets on refresh.
  - **Accessibility:** skip link, visible focus, 44px touch targets on mobile, labelled dialogs, focus trapping, chart text alternatives, and reduced-motion support.
- **Affected paths:** `docs/03_design/prototype/index.html`, `styles.css`, `app.js`, `README.md`, refreshed `preview-*.png`; new `docs/03_design/design_system.md`; `docs/03_design/README.md`; `docs/13_changes/CHG-005-prototype-visual-system.md`; `docs/13_changes/README.md`; `docs/12_reviews/CHG-005-review.md`; `docs/12_reviews/README.md`.
- **Risks:** a visual rewrite can regress the working mock flows; a dark theme can create contrast regressions; denser dashboards can reintroduce tiny type; responsive tables can overflow. Mitigations: preserve the mock state machine and event contract, run interaction smoke tests after the rewrite, compute contrast pairs for both themes, keep 11px as the minimum functional size, and verify 390px with no body overflow.
- **Verification plan:** `node --check`; HTML parse with `lxml`; CSS brace balance; token-definition audit (no undefined `var()`); contrast checks for both themes; headless-Chrome view-by-view renders at 1440×1100, 1280×900, and 390×844; interaction checks for chat, composer menus, history actions, all registries, drawers, forms, filters, test run, and theme toggle; runtime console-error capture; independent Verifier review.
- **No production code:** the prototype remains a throwaway design artifact. PRD, `frontend/`, and `backend/` remain untouched; no framework, dependency, manifest, lockfile, CDN asset, external font, secret, or production data is introduced.

## Task Brief

- **Scope:** visual system, page layout, component styling, token architecture, responsive behaviour, and accessibility of the existing throwaway prototype. Information architecture and mock data remain the same scope as CHG-004; no product requirements are added or removed.
- **Inputs:** PRD v0.1 (`docs/01_product/prd.md`); current prototype at `d57b34f`; IA decisions recorded in CHG-002/CHG-003/CHG-004; ui-ux-pro-max design-system and focused UX searches; local-only font and icon constraints.
- **Outputs:** redesigned `index.html`, `styles.css`, and `app.js`; a written design-system/token reference at `docs/03_design/design_system.md`; updated prototype README and previews; this record; an independent review record.
- **Acceptance criteria:**
  1. Chat is the first daily surface and fills the available viewport at desktop and mobile, with a pinned composer and a visible run-context rail or equivalent drawer.
  2. All eight views remain reachable and functional: Chat, Tasks, Skills, MCP, Runs, Usage, Audit, Settings.
  3. The token layer defines primitives, semantic roles, and component tokens; light and dark themes both render with AA contrast for core text.
  4. Functional text is ≥11px, interactive controls are ≥36px desktop / ≥44px mobile, and every control has a visible focus state.
  5. Registry and operations screens are scannable: status, owner/health, last activity, and primary action are visible without opening a detail panel.
  6. Existing mock flows still work: chat send, `/` and `@`, search toggle, history search/pin/rename/delete, skill/MCP/task creation, MCP test and allowlist, task test run, run detail, usage, audit filters, settings.
  7. No horizontal body overflow at 390×844; tables remain usable via their own scroll region.
  8. No backend, dependency, manifest, CDN, external font, secret, or production data; `frontend/` and `backend/` untouched.
- **Ownership:** Tech Lead authors the prototype and design system while the Docs Agent is dormant (CHG-002 handoff pattern); Verifier owns `docs/12_reviews/**`. Production frontend/backend paths remain untouched.

## Verification

Executed 2026-10-18 (Asia/Shanghai) on the working tree; the reviewed content is committed under this record after the independent re-review. Commands and headless-Chrome checks were re-runnable; screenshots are in `docs/03_design/prototype/preview-*.png`.

| # | Check | Command / method | Result |
|---|---|---|---|
| 1 | HTML structure | `lxml.html.parse` over `prototype/index.html` | 8 view panels, 8 `h1`, 0 duplicate IDs, 0 buttons without `type`, 0 external resource tags, 0 unresolved `aria-labelledby`, 2 polite live regions |
| 2 | JavaScript syntax | `node --check docs/03_design/prototype/app.js` | exit 0 |
| 3 | CSS structure and tokens | Brace count; defined-vs-used `var()` audit; raw hex and `rgba()` scans after the token layer | 660/660 braces; only per-instance custom properties `--h`, `--i`, `--w` are intentionally undefined; 0 raw hex and 0 raw `rgba()` values in component rules |
| 4 | Token architecture | Inspect `:root`, `[data-theme]`, component blocks | Primitive, semantic, and component layers present; light and dark semantic mappings; `--control-border` adds a dedicated 3:1 control boundary; `--text-card` removes the last raw card-title size; page-title scale aligned at 28/34px; the only component-level theme branch is the theme-toggle icon |
| 5 | Contrast | Calculated WCAG ratios for core light/dark pairs and control boundaries | All core text pairs pass 4.5:1; light primary 17.34, muted 5.26, accent 9.02, sidebar 15.46; dark primary 15.04, muted 5.88, accent 12.47, sidebar 15.46; dark user bubble 10.04; control border 3.20–3.73 across canvas/surface/raised (light 3.20/3.43/3.55; dark 3.73/3.55/3.31) |
| 6 | Desktop rendering | Headless Chrome via CDP, 1440×1100, all eight views | All views render; `scrollWidth = 1440`; 0 runtime exceptions; 0 console errors |
| 7 | Mid-width layout | 1280×1000, 1024×768, 860×900, 780×900, re-run after the final CSS | No body overflow on all four widths and all eight views; rail visible at 1280 and hidden at ≤1080; context drawer works; sidebar goes off-canvas at 860; KPI values align at 1280 |
| 8 | Mobile layout | CDP emulation, 390×844, all eight views | `scrollWidth = 390` on every view; sidebar off-canvas; KPI grid 2×2; no horizontal body overflow |
| 9 | Touch targets | Computed boxes at 390px | Manage 44, avatar 44, send 44, tool chip 44, icon buttons 44, history actions 44; inline chip dismiss and switches have expanded hit areas |
| 10 | Chat flows | New chat, send, typing indicator, reply, citations, `/` skills, `@` files, Search toggle, copy/retry actions | All pass; search reply shows a source and tool receipt; mock conversation title derives from the first prompt |
| 11 | Chat scroll | Open existing chat, send a message, switch chats | Opens at the top of the conversation; anchors to the bottom only after sending; avoids starting mid-tool-receipt on mobile |
| 12 | History actions | Rename, pin/unpin, delete on a fresh page | All pass after fixing a `data-chat-id` collision in the rename form; rename updates header and history; delete falls back to the first remaining chat |
| 13 | Skills | Create/publish from the modal; test panel; dependency options | New skill count 7; drawer opens; dependency list uses full MCP refs and excludes write tools; empty dependency state renders explicitly |
| 14 | MCP | Create/server auth; existing Confluence allowlist; write-tool lock | New server appears with `Needs auth`; authenticate reaches `Connected`; Confluence has 3 read-only toggles and 2 `Blocked in v1` write tools; header badge 3/5 → 2/5 after toggling `search` |
| 15 | Tasks and runs | Create task; test run; run completion; run detail | New task count 5; run navigates to Runs; run completes at `RUN-1043`; detail includes actor, task version, start/end, tokens/cost, timeline, artifact |
| 16 | Usage | KPI derivation; chart; efficiency panel | KPIs derive from state; 2×2 mobile grid; chart has labelled bars and a text alternative; efficiency meter anchors to the panel bottom |
| 17 | Audit | Category chips, actor/action/target search, All time / Today / Last 7 days | 8 total; Today = 3; Today + Tools = 1; categories and text search compose correctly |
| 18 | Settings | Model gateway, local accounts, locked policy rows, audit link | Model and identity scope clear; write-tool and publication policy rows remain visibly proposed/locked; audit link works |
| 19 | Theme | Toggle light/dark across views | Dark mapping applies without layout shift; all core contrast pairs pass; toggle returns to light; client-only reset on refresh |
| 20 | Focus and dialogs | 15 Tab presses in drawer; Escape; modal focus; label fallback | Tab stays inside the drawer; Escape closes it; focus returns to the card; skill modal focuses `#skill-name`; hidden drawer/modal retain valid `drawer-title`/`modal-title` labels |
| 21 | Isolation | Resource scan, dependency/manifest scan, secret/PII regex, `git status` | No external resource tags; no dependency or manifest; no secret/PII matches; `frontend/`, `backend/`, PRD, and governance files untouched |
| 22 | Documentation integrity | Status scan and relative-link check over `docs/**/*.md` | Every Markdown file has a valid `Status:` line; 0 broken relative links; all referenced TBD IDs resolve in `open_items.md` |
| 23 | Previews | Fresh CDP captures at 1440×1100 | `preview-chat`, `preview-manage`, `preview-skills`, `preview-tasks`, `preview-usage`, `preview-dark` refreshed and referenced by the prototype README |
| 24 | Review findings closed | Re-test after the Verifier's P1/P2 findings | P1 focus trap: `focusables()` now selects native tabbable elements only, excludes `SVGElement`/`tabIndex < 0`; Manage Tab from Settings wraps to the close button, skill-modal Tab from Publish wraps to the close dialog, 0 SVG candidates. P2 audit select: `:focus-within` border/ring visible. P2 doc drift: `--text-card` token, card-padding description, theme-icon exception, raw `rgba()` tokenization, control range 3.20–3.73. Review index updated. |
| 25 | Independent re-review | Verifier resolution in `docs/12_reviews/CHG-005-review.md` | First pass FAIL (one P1, five P2); all findings CLOSED; re-verified PASS on 2026-10-18. Mid-width matrix 1280/1024/860/780 re-run across all eight views with no overflow; 390×844 control pass. |

Reviewer: Independent Verifier — **PASS** after re-verification; first pass FAIL (P1 focus trap, five P2s), all closed. Review record: [CHG-005-review.md](../12_reviews/CHG-005-review.md).

## Dependency audit

None — no third-party dependency, package manifest, lockfile, CDN asset, or external font is introduced. Icons remain inline SVG; fonts remain local OS stacks.

## Decision and conflict log

- 2026-10-18: The user requested a further redesign of the prototype layout and design tokens from the current PRD and prototype.
- 2026-10-18: The paper/ink/mint identity is retained; the layout changes from document-first to workspace-first.
- 2026-10-18: IA decisions from CHG-004 (Tasks shortcut, topbar-only Manage, history actions, Settings/Usage/Audit) are preserved and not re-litigated.
- 2026-10-18: Dark mode is a token demonstration only, not a confirmed product requirement; the default light theme remains the reference.
- 2026-10-18: PRD v0.1 remains `Draft`; this record does not accept the PRD or resolve any TBD.
- 2026-10-18: Chat opens at the top of a conversation and anchors to the bottom only after sending; this avoids landing mid-tool-receipt on small screens.
- 2026-10-18: Read-only MCP tools are toggleable; write-capable tools are rendered as `Blocked in v1`, not as toggles. This follows the PRD guardrail rather than implying an approval flow.
- 2026-10-18: Audit adds an All time / Today / Last 7 days filter to the existing category and text filters, reflecting US-07.
- 2026-10-18: Run detail adds task version and start/end metadata alongside actor, tokens/cost, timeline, and artifacts (US-06).
- 2026-10-18: Skill dependencies use full MCP references and exclude write tools; the skill form only offers allowlisted read-only tools.
- 2026-10-18: The KPI grid stays 2×2 on small screens with stacked labels so Usage retains its first-view value; stat headers also stack at 1081–1320px to keep values aligned.
- 2026-10-18: The dark user bubble uses a dark forest surface rather than a light inversion, keeping dark mode quiet while preserving 10.04:1 text contrast.
- 2026-10-18: Verification found and fixed a rename-form `data-chat-id` collision that caused any modal button to select the chat instead of submitting or pinning/deleting. The form now uses `data-rename-chat`.
- 2026-10-18: Overlays set the app shell inert and keep hidden fallback titles so dialog labels remain valid after close.
- 2026-10-18: Functional text floor is 11px; only decorative avatar initials use 10px. Table headers and micro-labels remain uppercase mono at 11px.
- 2026-10-18: Added `--control-border` / `--control-border-hover` so buttons, inputs, chips, toggles, and the composer boundary meet the 3:1 non-text threshold (3.20–3.55:1) in both themes. Softer card outlines and dividers keep `--border` so the quiet-console hierarchy is preserved.
- 2026-10-18: Page-title scale aligned at 28px mobile/minimum and 34px desktop; the earlier 27px clamp/override mismatch was corrected.
- 2026-10-18: Audit sample target normalized to `jira.create_issue` so the sample matches the MCP tool naming.
- 2026-10-18: Independent Verifier first pass returned FAIL: SVG `<use href>` nodes leaked into the focus trap, the audit date select had no visible focus, and four documentation/token claims drifted. All were fixed; the Verifier re-ran the affected checks and the mid-width matrix and returned PASS.
- 2026-10-18: User requested the reviewed change be committed. It lands as one squash commit on `main` with `Refs: CHG-005`; no force-push, remote, or dependency change is involved.
- 2026-10-18: The design-system reference is `docs/03_design/design_system.md`; it documents the prototype and does not select a production stack.
- No `CONFLICT-nnn` was found.
