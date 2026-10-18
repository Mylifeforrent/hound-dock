# CHG-015 — High-fidelity page construction map

Status: Draft
Complexity: Complex
Refs: TBD-BIZ-004, TBD-BIZ-012, TBD-BIZ-013, TBD-BIZ-005, TBD-BIZ-007, TBD-BIZ-008; CONFLICT-001, CONFLICT-002; TBD-INFRA-001, TBD-INFRA-004
Owner: Tech Lead (Docs Agent dormant; design handoff pattern as in CHG-001 and CHG-002)

## Plan

- **Why this change:** the repository has interaction design v0.1, PRD v0.2, a clickable prototype, and a Draft design reference, but no document that tells a high-fidelity designer which pages and states to construct, in what order, on which route, against which acceptance criterion, and which prototype values must not be inherited. Without that map, the next design pass would either re-open settled IA or treat the throwaway prototype's visuals as a design system.
- **Approach:** produce one construction map that (a) records the authority order and the closed gates, (b) assigns one row per logical page with route, states, ACs, draft decision, and desktop breakpoints, (c) enumerates all 108 page-state cells with an HF/reuse/N/A decision and a reason for every N/A, (d) traces user-visible AC coverage and lists the gaps down to the AC number, (e) names only the components that actually appear, and (f) separates inherited interaction/layout from discarded visual values.
- **Draft decision:** pages on FLOW-001 to FLOW-003 (PG-001, PG-002, PG-007, PG-008, PG-009) are the must-draft set; differing states become state boards under the same PG; PG-010 to PG-012 collapse into one No Permission panel with no per-page draft; PG-003 to PG-006 are reuse-only with no refined page draft this phase, except the two Empty boards that must be drawn.
- **Affected paths:** `docs/03_design/highfi_page_map.md` (new); `docs/13_changes/CHG-015-highfi-page-map.md` (new). No existing file is modified.
- **Risks:**
  1. The seven inputs disagree about `TBD-BIZ-004` (registry `Resolved`, interaction design still treats it as `Open`, business model Appendix B.3 grants Admin publication). Choosing a side would fabricate a decision. Mitigation: record the divergence as `[TBD-UX]`/`[CONFLICT]` with both clauses cited, keep the No Permission panel neutral, and mark the affected rows "not ready to draft".
  2. The design system and the prototype look settled because they are detailed. Mitigation: label Porcelain Blue as a candidate direction and list every visual value that must be re-decided.
  3. A state could be silently dropped while compressing nine pages into tables. Mitigation: fixed 9-row tables, a count check summing to 108, and a scripted count in verification.
  4. A page could be justified by a proposed flow (FLOW-004 to FLOW-006). Mitigation: justify the read-only registries by `CAP-002`/`BR-003`, `CAP-003`/`BR-004`, `CAP-004`/`BR-005` and cite PRD §11.2, which states that the read context does not make those flows effective.
- **Verification plan:** executed shell checks for file presence, write-set isolation, PG resolution in `interaction_design.md` §3 and §6 and in `prototype/README.md`, route presence in `prototype/app.js`, AC set comparison against PRD §7, state-cell counts summing to 108 (observed 34 HF / 25 reuse / 49 N/A), absence of invented pages and of `Figma`/`Make`, absence of any sub-960 layout instruction, Markdown link resolution, and a Frozen-asset scan. No dependency, build, or browser run is needed for a documentation-only change.

## Task Brief

- **Scope:** author the high-fidelity construction map for the effective MVP page set and record this change. No product, capability, page, route, state, navigation, role, field, visual, code, prototype, PRD, interaction-design, design-system, or registry edit.
- **Inputs (authority high to low):** `docs/03_design/interaction_design.md` v0.1 (Draft); `docs/01_product/prd.md` v0.2 (Draft); `docs/03_design/prototype/README.md` (Draft); `docs/03_design/prototype/index.html` and `preview-*.png` (Draft, opened over `file://`); `docs/03_design/design_system.md` (Draft, visual reference only); `docs/00_setup/open_items.md` (Draft, status as-is); `docs/01_product/business_model.md` v0.3 (Draft, business rules only, Appendix B overrides earlier sections, cited by path and not quoted).
- **Outputs:** `docs/03_design/highfi_page_map.md` (Status: Draft) and this record.
- **Acceptance criteria:**
  1. All 12 `PG-001` to `PG-012` resolve in `interaction_design.md` §3 and §6 and in the prototype route table, with the route stated per page.
  2. Every must-draft row names a concrete route and flow step; no page is justified by an assumption or by FLOW-004 to FLOW-006.
  3. All 108 state cells are decided as HF required, reuse, or N/A, and every N/A carries a reason drawn from `interaction_design.md` §6 and the prototype coverage table.
  4. AC-001 to AC-057 user-visible outcomes are traced to pages and states, and every uncovered outcome is listed down to the AC number.
  5. Only components that appear in the page map are listed, for Prompts B and C.
  6. Inherited behavior/layout and discarded visual values are stated separately; Porcelain Blue is a candidate only.
  7. Gate status is stated: Gate 1 not accepted (`TBD-BIZ-012`), PRD v0.2 not independently reviewed, no high-fidelity asset to cite, no design tool selected (`TBD-INFRA-001`), no Frozen asset.
  8. No new PG, navigation, capability, state, or role; nothing below 960px; no visual, code, or tool choice.
- **Ownership and handoff:** `docs/03_design/**` is Docs Agent-owned and `docs/13_changes/**` is Tech Lead-owned. The Docs Agent is dormant, so the Tech Lead authors both paths under this record, following the Stage 2 handoff pattern recorded in `AGENTS.md` §3. Docs Agent acceptance is recorded as pending, not as granted. `docs/12_reviews/**` is untouched; no Verifier review exists for this change.

## Verification

Executed 2026-10-18 (Asia/Shanghai) on the working tree. Documentation-only: no dependency install, build, server, browser, or design tool was run. The commands below are the executed checks; inline Python read the two files and the seven inputs and printed the counts shown.

| # | Check | Command or method | Result |
|---|---|---|---|
| 1 | Write-set isolation | `git status --porcelain`; `git diff --stat` | Only two untracked entries: `?? docs/03_design/highfi_page_map.md` and `?? docs/13_changes/CHG-015-highfi-page-map.md`. `git diff --stat` is empty. No existing file modified. |
| 2 | Status lines | `grep -n '^Status:'` on both new files | `Status: Draft` on both; exit 0 |
| 3 | Frozen assets | `grep -rl '^Status: Frozen' docs` | No output; grep exit 1 (expected no-match). Confirms no frozen status line. A naive substring search also matches rule text in `docs/00_setup/project_rules.md` and CHG-010, which are prose mentions, not status lines. |
| 4 | Page-map shape | Inline Python over the page-map table | 12 rows; every row has 9 columns; 12 of 12 Board ID cells blank |
| 5 | PG resolution | Inline Python occurrence counts for `PG-001` to `PG-012` across the map, ID, P-README, and `app.js` | 12 of 12 resolve in all four; counts 9–45 (map), 20–52 (ID), 1–8 (P-README), 6–13 (`app.js`) |
| 6 | State cells | Inline Python tally of the decision column in §4.2 to §4.11, with PG-010 to PG-012 multiplied by three routes | 34 HF, 25 reuse, 49 N/A = 108; all 49 N/A cells carry a non-empty reason |
| 7 | AC coverage | Extract `AC-0\d\d` from PRD §7; compare with the map | 57 ACs in the PRD; 0 unreferenced in the map |
| 8 | AC state tags | Compare ledger states with PRD §5.2 and §7.7 | 53 UI ACs and 4 non-UI ACs (AC-003, AC-006, AC-008, AC-049); every UI state is check-mark on its page |
| 9 | Prohibition scan | Inline Python term scan | No `PG-013`, `PG-014`, `PG-015`, `ROLE-005`, `CAP-037`, `STATE-007`, `AC-058`, or `NFR-013`; 0 code fences; 0 HTML or SVG tags |
| 10 | Tool assumption | Inline search for design-tool names | `Figma` and `Make link` occur once, only in the negative gate row asserting that no such asset exists. No tool is selected or named as chosen. |
| 11 | Sub-960 boundary | Inline search for 375, 390, 768, 860, 780, 560, 44px, "below 960", "sub-960" | Every occurrence is a prohibition, a reference to the 560px state-panel width, or the 36px desktop control baseline. No sub-960 viewport layout is specified. |
| 12 | Markdown integrity | Inline contiguous-table check | 0 tables with inconsistent column counts; 361 table rows |
| 13 | Reference paths | Resolve every `docs/**.md` path named in the map | All resolve except `docs/00_setup/environment_baseline.md`, which the map cites as absent under `TBD-INFRA-004` |
| 14 | Route strings | Inline search for the nine route strings | All present: `#/sign-in`, `#/chat`, `#/skills`, `#/mcp`, `#/tasks`, `#/runs`, `/tasks/:taskName/run`, `/runs/:runReference`, `/skills/:skillName` |

Author verification: **PASS**. Independent Verifier review is not performed; the Verifier role is dormant and `docs/12_reviews/` contains no CHG-015 review. This record remains `Draft`.

## Dependency audit

None. No package, manifest, lockfile, CDN asset, external font, image request, network call, design-tool plugin, or code dependency was added. No install, build, or browser command was executed, and none is claimed.

## Decision and conflict log

- 2026-10-18: Draft scope fixed to the five pages on FLOW-001 to FLOW-003. PG-003 to PG-006 are held at reuse with no refined page draft. PG-010 to PG-012 collapse into one No Permission panel. No page, route, navigation item, state, role, or field is added.
- 2026-10-18: All 108 state cells are decided. The two registry Empty boards are drawn despite the reuse-only treatment because they are the truthful reachable state; they are copy variants of the drawn registry frame, not new page drafts.
- 2026-10-18: PG-002 and PG-008 are must-draft but are marked not ready to draft because of the dialog-copy mismatch (M-06). A working label is recorded; the string is not decided.
- 2026-10-18: The `TBD-BIZ-004` divergence is recorded, not resolved. No side is chosen between BM Appendix B.3 and B.9 and ID §2.1 and §2.2. PG-010 and PG-012 and the registry no-create rules stay flagged, and the No Permission copy is written to survive either side.
- 2026-10-18: The Page-to-flow labels that route PG-003 to PG-006 through a proposed flow are recorded as M-08 and not used as the construction basis. The pages rest on CAP-002/BR-003 and CAP-003/BR-004, with PRD §11.2 as the clarification.
- 2026-10-18: No `AC`, `TBD`, `CONFLICT`, `PG`, `CAP`, `BR`, `ENT`, `STATE`, `NFR`, or registry entry is created. `G-`, `M-`, `C-`, `R`, `HF`, `Reuse`, and `N/A` are declared document-local navigation aids.
- 2026-10-18: Porcelain Blue is recorded as a candidate direction only. Palette, type faces, type sizes, shadow scale, radius values, motion values, and the dark theme are listed as visual values to discard as locked decisions.
- 2026-10-18: No existing file is modified. `docs/03_design/README.md` and `docs/13_changes/README.md` were deliberately left unchanged, so their authoritative-asset lists do not yet name the new map or this record. Adding them is a separate change and was not folded into this one.
- 2026-10-18: Path handoff. `docs/03_design/**` is Docs Agent-owned and `docs/13_changes/**` is Tech Lead-owned. The Docs Agent is dormant, so the Tech Lead authored both paths under this record. Docs Agent acceptance is pending and is not recorded as granted. No Verifier review exists.
- 2026-10-18: No design tool is selected and no handoff format is chosen (`TBD-INFRA-001`). Board IDs remain blank by decision, not by omission.
