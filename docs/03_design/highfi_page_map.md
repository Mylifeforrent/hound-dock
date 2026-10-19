# High-fidelity page construction map — hound-dock internal agent workspace

Status: Draft
Version: 0.1
As-of: 2026-10-18
Originating stage: Stage 4 — Design
Owner: Docs Agent (design ownership; authored for the high-fidelity construction-map task)
Change record: `docs/13_changes/CHG-015-highfi-page-map.md`
Scope: the pages, states, routes, acceptance traces, components, breakpoints, and inherit/discard boundaries a high-fidelity designer must construct for the effective MVP. It is a construction map, not a visual design, a design system, or an implementation contract.
Out of scope: visual composition, layout drawing, colour selection, type selection, component code, design-tool choice, APIs, data models, backend behaviour, production code, mobile or any layout below 960px.
Refs: PG-001 to PG-012; FLOW-001 to FLOW-003 (effective); FLOW-004 to FLOW-006 (proposed, not effective); CAP-001 to CAP-005; BR-001 to BR-008; AC-001 to AC-057; TBD-BIZ-004, TBD-BIZ-005, TBD-BIZ-007, TBD-BIZ-008, TBD-BIZ-012, TBD-BIZ-013; CONFLICT-001, CONFLICT-002; TBD-INFRA-001, TBD-INFRA-004; CHG-015.
Abbreviations used below: **ID** = `docs/03_design/interaction_design.md` v0.1; **PRD** = `docs/01_product/prd.md` v0.2; **P-README** = `docs/03_design/prototype/README.md`; **DS** = `docs/03_design/design_system.md`; **BM** = `docs/01_product/business_model.md` v0.3; **REG** = `docs/00_setup/open_items.md`.
Reference convention: `ID §`, `PRD §`, `BM §`, `DS §`, and `REG` are absolute; inside one evidence cell, a section reference without a source prefix continues the source named immediately before it.
Document-local labels: `G-nn` (AC gap), `M-nn` (cross-source mismatch), `C-nn` (component candidate), `R1` to `R6` (draft rules), and the decisions `HF`, `Reuse`, `N/A`. These are navigation aids in this file only. They create no `TBD`, `CONFLICT`, `CAP`, `BR`, `ENT`, `STATE`, `NFR`, `PG`, or `AC` identifier and are not registry entries. `Board ID` is deliberately blank in every row because no design tool is selected (`TBD-INFRA-001`).

## 1. Authority and gate status

### 1.1 Authority order used

The seven inputs are all `Draft`. They are used in the order below; a lower rank never overrides a higher one, and no rank may create a page, state, capability, role, or field.

| Rank | Source | Status | What it decides here | What it may not decide here |
|---|---|---|---|---|
| 1 | `docs/03_design/interaction_design.md` v0.1 | Draft | `PG-001` to `PG-012`, routes, the nine states, §2.2 permissions, §7 desktop layout, effective FLOW-001 to FLOW-003 | Cannot grant a permission, make a proposed state effective, or make FLOW-004 to FLOW-006 effective |
| 2 | `docs/01_product/prd.md` v0.2 | Draft | `AC-001` to `AC-057`, §5.2 per-page state coverage, §5.5 permission quote, §11.2 page-to-flow-to-AC map | Adds no page, route, state, visual, or endpoint; not independently reviewed |
| 3 | `docs/03_design/prototype/README.md` | Draft | Effective scope (PG-001 to PG-009, PG-010 to PG-012 No Permission only), route table, check-mark/N/A coverage table, executed evidence of 2026-10-18 | Is not production, not a high-fidelity draft, and not a design system |
| 4 | `docs/03_design/prototype/index.html` and `preview-*.png` | Draft | Interaction behaviour and layout reference as executed over `file://` | No Make or online link exists; captures are prototype evidence, not a visual source of truth |
| 5 | `docs/03_design/design_system.md` | Draft | Porcelain Blue reference direction, token roles, component notes, contrast evidence | Not a settled design system; its tokens are not production values |
| 6 | `docs/00_setup/open_items.md` | Draft | Registry status of every `TBD` and `CONFLICT`, quoted as-is | Cannot be redefined here; several entries post-date the design documents that cite them |
| 7 | `docs/01_product/business_model.md` v0.3 | Draft | Business rules only; Appendix B overrides earlier sections; cited by path, never pasted | Decides no page, state, route, layout, or visual |

### 1.2 Gate and asset status

| Gate or asset | State | Evidence | Effect on this map |
|---|---|---|---|
| **Gate 1 acceptance** | **Scope boundary accepted** | `TBD-BIZ-012` Resolved (option (b), `CHG-021`); PRD §19; PRD header status note | The Gate 1 PRD-acceptance phase gate is satisfied at the scope boundary; the design tool, independent PRD review, and high-fidelity asset remain unresolved. No board is approved, and no row below is an approved design. |
| **PRD v0.2 independent review** | **Not performed** | PRD §15, §18, §11.4; `docs/12_reviews/` holds reviews only through CHG-007 and none for CHG-014 | ACs are definitions, not observed results. AC coverage in §6 is a documentation trace, not a test pass. |
| **High-fidelity asset to cite** | **None exists** | No Figma file, Make link, `frontend_design_spec`, or `prototype_review` in the repository; `docs/03_design/README.md` Frozen assets: None | Board IDs stay blank. There is no visual source to inherit from and no fidelity claim to verify against. |
| **Prototype status** | Draft, throwaway, opened over `file://` | P-README lines 4 to 8 and 134 to 143; P-README states it MUST NOT be treated as production code | Behaviour and layout evidence only. It is not a high-fidelity draft and not a design system. |
| **Design tool** | **Not selected** | `TBD-INFRA-001` Open (REG) | No tool named, no frame link, no board or layer ID, no handoff format chosen. |
| **Frozen asset** | **None** | `docs/03_design/README.md` and `docs/13_changes/README.md` both record none; a repository-wide `^Status: Frozen` scan returns no file | Nothing to unfreeze and nothing that may be modified silently. No existing file is touched by this change. |
| **Stage 1 environment baseline** | Recorded — Stage 1 (2026-10-20) | `TBD-INFRA-004` Resolved (`CHG-022`); the baseline records the observed host and tool versions | No build, browser, or visual-regression command is claimed as project verification. |
| **Prototype verification evidence** | Executed 2026-10-18 by the prototype author | P-README: 174 scenario checks, 67 edge/accessibility checks, widths 1440/1280/1080/960 | Proves behaviour was exercised; proves nothing about high-fidelity visual quality. |

### 1.3 Referenced decisions, status as-is

| ID | Registry status | What it constrains in this map | Flag |
|---|---|---|---|
| `TBD-BIZ-004` | **Resolved** — admin-only skill and task publication; MCP registration/allowlisting and account administration remain out; role assignments provisioned out of band | ID still declares it Open and denies every Admin cell; BM Appendix B.3 grants Admin publication. Affects the terminal Empty states and the no-create rule on PG-003, PG-005, PG-007 and the PG-010 to PG-012 No Permission treatment | `[TBD-UX]` + `[CONFLICT]` M-01 |
| `TBD-BIZ-012` | **Resolved** — option (b), scope boundary (`CHG-021`) | Gate 1 is accepted at the scope boundary; the title still names PRD v0.1 while the resolution names v0.2 (M-02) | `[TBD-PRD]` M-02 |
| `TBD-BIZ-013` | **Open** | Registry ownership and offboarding; owner attribution is omitted from every page | `[TBD-UX]` M-05 |
| `CONFLICT-001` | **Resolved** — Admin-capability side; ROLE-004 remains proposed and denied | No page depends on an Auditor role | M-03 |
| `CONFLICT-002` | **Open** | Stage-label and routing metadata only; REG records that no business rule is blocked | `[CONFLICT]` M-04 |
| `TBD-INFRA-001` | **Open** | No frontend stack, no design tool, no board IDs, no handoff format | Phase gate |
| `TBD-BIZ-005` | Open | Fixture content only. No real integration, server, or task may be named | Content constraint, not a page blocker |
| `TBD-BIZ-007` | Open | Step target vocabulary and execution model. No code, branch, loop, approval, or retry surface | Content constraint, not a page blocker |
| `TBD-BIZ-008` | Open | No client timeout, loading duration, or run-refresh interval may be invented | Content constraint, not a page blocker |

### 1.4 What this map does not claim

- It does not claim more than the Gate 1 scope boundary; it does not claim an approved MVP or implementation authority.
- It does not claim that the PRD was reviewed, or that any AC in §6 has passed.
- It does not claim that the prototype is high fidelity, a design system, or a production reference.
- It does not claim a palette, type scale, shadow set, radius set, theme, tool, or handoff format.
- It does not claim a mobile or sub-960px layout, and it designs none.
- It does not resolve any `TBD` or `CONFLICT`, and it does not choose a side between the PRD/Prototype and the business model.

## 2. Draft decision

### 2.1 Rules applied

| Rule | Decision | Consequence in this map |
|---|---|---|
| **R1** | Pages on effective FLOW-001, FLOW-002, FLOW-003 are the must-draft set: PG-001, PG-002, PG-007, PG-008, PG-009 | Each gets a page frame, a concrete route, and a named flow step. No page is drafted on an assumption. |
| **R2** | A page with only differing states gets **state boards under that page**, never a new PG | PG-002 carries 9 state boards. PG-009 carries Succeeded, Failed-after-step, and Failed-before-step as three state boards under PG-009. No `PG-009a`, no "Chat error page". |
| **R3** | PG-010, PG-011, PG-012 collapse into **one No Permission panel**; no per-page drafts | One shared 560px panel serves three routes. No form, draft, test, publish, allowlist, or disabled control is drawn. The conditional targets in ID §6.11 to §6.13 are not boards. |
| **R4** | Non-critical pages get a reuse statement, not a refined page draft: PG-003, PG-004, PG-005, PG-006 | §5 names the exact components and their source boards. Exception: the Empty state on PG-003 and PG-005 must be drawn as copy variants of the drawn registry frame. |
| **R5** | No page is justified by FLOW-004, FLOW-005, or FLOW-006 | PG-003/004 rest on CAP-002 + BR-003, PG-005/006 on CAP-003 + BR-004, PG-007 on CAP-004 + BR-005. PRD §11.2 states that the read context does not make those flows effective. |
| **R6** | No new PG, route, navigation item, capability, role, field, or state; nothing below 960px | The map contains exactly the 12 PG rows and the 9 state names defined by ID §3 and §6.1. |

### 2.2 What a "board" means here

A **page frame** is the persistent shell for one page (sidebar, topbar, header, content regions). A **state board** is one frame of that page in one of the nine states. A **shared panel** is a state panel drawn once and placed inside multiple page frames with page-specific copy and one page-specific recovery action.

`Board ID` is blank in every row because no design tool is selected (`TBD-INFRA-001`). A blank is not an omission; it is the accurate state of the repository. The map names boards only by page and state so that any tool, or no tool, can host them.

### 2.3 Resulting draft set

| Artifact | Count | Detail |
|---|---|---|
| Page frames | 5 | PG-001, PG-002, PG-007, PG-008, PG-009 |
| Page-state boards | 31 | 5 (PG-001) + 8 (PG-002) + 4 (PG-007) + 7 (PG-008) + 5 (PG-009) + 2 supplemental registry Empty boards (PG-003, PG-005) |
| Shared panels | 1 | No Permission, serving PG-010, PG-011, PG-012 and reused on PG-002 to PG-009 |
| **Boards total** | **32** | 31 page-state boards + 1 shared No Permission panel |
| State cells decided | 108 | 12 pages × 9 states; 34 HF, 25 reuse, 49 N/A (§4.12) |
| Refined drafts for PG-003 to PG-006 | 0 | Reuse only; the two Empty boards are registry-frame copy variants, not page drafts |
| Refined drafts for PG-010 to PG-012 | 0 | One shared No Permission panel only |

### 2.4 Explicitly not designed

No mobile, tablet-portrait, bottom-sheet, or sub-960px layout; no new navigation destination; no Manage, Runs, Audit, Usage, or Settings surface; no account menu or sign-out; no search, filter, pager, or "load more"; no create, edit, publish, test, allowlist, invoke, delete, import, export, share, or theme control; no visual style, palette, type, shadow, icon, or motion decision; no tool selection.

## 3. Page map

One row per logical page. `States to cover` uses the nine state names from ID §6.1 in shortened form: D=Default, L=Loading, E=Empty, NR=No Result, Er=Error, NP=No Permission, Ed=Editing, S=Submitting, SF=Success-Failure. Every cell is expanded in §4.

| PG | Page name | Prototype route | States to cover | Related AC | Produce draft? | Desktop breakpoints 1440/1280/1080/960 | Board ID | Notes |
|---|---|---|---|---|---|---|---|---|
| **PG-001** | Sign in | `#/sign-in` (product path `/sign-in`) | D, Er, Ed, S, SF — 5 HF. L, E, NR, NP — N/A | AC-001, AC-002, AC-004, AC-005, AC-007. AC-003, AC-006, AC-008 are non-UI | **Yes — must.** FLOW-001 N1, D1, N2; F1, F2 | 420px panel centred at all four widths; at 960 it sits inside the 648px content; no rail at any width | *(blank)* | No page-level blocker; still gated by `TBD-INFRA-001` and the independent PRD review. No SSO, no help link, no role control. SF is a transition to PG-002, not a success screen |
| **PG-002** | Chat (own conversation list + open conversation) | `#/chat`, `#/chat/:conversationRef` (`/chat`, `/chat/:conversationRef`) | D, L, E, NR, Er, Ed, S, SF — 8 HF. NP — reuse shared panel | AC-009 to AC-021 | **Yes — must.** FLOW-002 N1 to N5; F1, F2, C1, C2 | Chat column 760 / 720 / 720 / fills 648; gutters 36 / 28 / 28 / 20 | *(blank)* | **Not ready to draft** on copy only: `[TBD-UX]` M-06 dialog string. All 9 states are otherwise constructible. The Admin chat divergence changes the matrix, not this screen |
| **PG-003** | Skills registry | `#/skills` (`/skills`) | D, L, Er — reuse. E — HF. NP — reuse. NR, Ed, S, SF — N/A | AC-022, AC-023, AC-026, AC-027 | **No page draft.** Reuse map §5; the Empty board is drawn | Grid 3 / 2 / 2 / 2 columns; card min 320 at 1440, 280 at 960 | *(blank)* | **Not ready to draft.** `[TBD-UX]` M-01 `TBD-BIZ-004` status; `[CONFLICT]` M-01 no-create rule; `[TBD-UX]` M-05 owner attribution |
| **PG-004** | Skill record | `#/skills/:skillName` (`/skills/:skillName`) | D, L, NR, Er, NP — reuse. E, Ed, S, SF — N/A | AC-024, AC-025 | **No page draft.** Reuse map §5 only | 764+300 / 644+28+280 / stacked / stacked | *(blank)* | **Not ready to draft.** `[TBD-UX]` M-05 owner attribution; `[TBD-UX]` M-08 flow-context label; version label is proposed metadata per ID §3.2 |
| **PG-005** | MCP servers registry | `#/mcp` (`/mcp`) | D, L, Er — reuse. E — HF. NP — reuse. NR, Ed, S, SF — N/A | AC-028, AC-029, AC-031, AC-032, AC-035 | **No page draft.** Reuse map §5; the Empty board is drawn | Grid 3 / 2 / 2 / 2 columns; card min 320 / 280 | *(blank)* | **Not ready to draft.** `[TBD-UX]` M-01 `TBD-BIZ-004` status; `[CONFLICT]` M-01 no-add rule; no tool name, count, or secret value |
| **PG-006** | MCP server record | `#/mcp/:serverName` (`/mcp/:serverName`) | D, L, NR, Er, NP — reuse. E, Ed, S, SF — N/A | AC-030, AC-033, AC-034 | **No page draft.** Reuse map §5 only | 764+300 / 644+28+280 / stacked / stacked | *(blank)* | **Not ready to draft.** `[TBD-UX]` M-08 flow-context label. Recorded health is confirmed by CAP-003, BR-004, AC-029; individual tool names stay withheld |
| **PG-007** | Tasks registry | `#/tasks` (`/tasks`) | D, L, E, Er — 4 HF. NP — reuse. NR, Ed, S, SF — N/A | AC-036, AC-037, AC-038, AC-045 | **Yes — must.** FLOW-003 N1 | Grid 3 / 2 / 2 / 2 columns; card min 320 / 280 | *(blank)* | **Not ready to draft.** `[TBD-UX]` M-01 `TBD-BIZ-004` + `[CONFLICT]` M-01 no-create rule. D, L, Er are constructible; the Empty board cannot be closed |
| **PG-008** | Task run | `#/tasks/:taskName/run` (`/tasks/:taskName/run`) | D, L, NR, Er, Ed, S, SF — 7 HF. NP — reuse. E — N/A | AC-039 to AC-044, AC-046 to AC-049 | **Yes — must.** FLOW-003 N1 to N3; F1, F2 | 764+300 / 644+28+280 / stacked / stacked | *(blank)* | **Not ready to draft** on copy only: `[TBD-UX]` M-06 dialog string. All 7 states are otherwise constructible. Success means a run was created, not that it succeeded. `TBD-BIZ-005` and `TBD-BIZ-007` constrain fixture content, not layout |
| **PG-009** | Run outcome | `#/runs/:runReference` (`/runs/:runReference`) | D, L, NR, Er, SF — 5 HF. NP — reuse. E, Ed, S — N/A | AC-050 to AC-057 | **Yes — must.** FLOW-003 N4 to N7; F2, C2 | 764+300 / 644+28+280 / stacked / stacked; step table 5 columns at 1440 to 1080, duration and result wrap at 960 | *(blank)* | **Not ready to draft as a whole.** `[CONFLICT]` M-01 Admin all-run read changes the permission layer and the "Initiated by you" line; Member own-only boards are unaffected |
| **PG-010** | Skill editor (proposed, not effective) | `#/skills/new`, `#/skills/:skillName/edit` | NP — 1 HF (shared panel). D — same panel. 7 N/A | None. PRD §7.7 records 0 AC | **No — collapsed.** One shared No Permission panel; no per-page draft | 560px panel centred at all four widths | *(blank)* | **Not ready to draft.** `[CONFLICT]` M-01: BM Appendix B.3 grants Admin `Skill.publish`, ID §2.2 denies every Admin cell. No form, no disabled control, no side chosen |
| **PG-011** | MCP server editor (proposed, not effective) | `#/mcp/new`, `#/mcp/:serverName/edit` | NP — 1 HF (shared panel). D — same panel. 7 N/A | None | **No — collapsed.** Same shared panel | 560px panel centred at all four widths | *(blank)* | **Not ready to draft.** Registration is denied under both BM B.3 and ID §2.2, so the panel copy is stable; the board still shares the panel held by M-01 |
| **PG-012** | Task definition editor (proposed, not effective) | `#/tasks/new`, `#/tasks/:taskName/edit` | NP — 1 HF (shared panel). D — same panel. 7 N/A | None | **No — collapsed.** Same shared panel | 560px panel centred at all four widths | *(blank)* | **Not ready to draft.** `[CONFLICT]` M-01: BM Appendix B.3 grants Admin `TaskDefinition.publish`, ID §2.2 denies it. No form, no side chosen |

**Table notes.**

1. The prototype route is the hash route opened over `file://`; the parenthesised path is the route in ID §3.2 and is the construction route. The `#` fragment is a file-protocol artifact, not a product URL design.
2. "Must" is a draft-ordering decision from R1, not an approval. Every row remains behind the independent-review and tool gates in §1.2.
3. "No page draft" is not "no work": §4 still decides every state, and §5 names the components to reuse.
4. No row marked "must" is justified by a proposed flow. PG-007 points to FLOW-003 N1, PG-008 to N1 to N3, PG-009 to N4 to N7.

### 3.1 Resolution check

Every `PG` resolves in ID §3 and §6, in the prototype route table, and in the prototype parser.

| PG | ID §3.2 page table | ID §6 state section | P-README route row | `app.js` route id | Effective flow step |
|---|---|---|---|---|---|
| PG-001 | Row present | §6.2 | Row present | `PG-001` | FLOW-001 N1, D1, N2, N3 |
| PG-002 | Row present | §6.3 | Row present | `PG-002` | FLOW-002 N1 to N5 |
| PG-003 | Row present | §6.4 | Row present | `PG-003` | CAP-002 read; no effective flow step |
| PG-004 | Row present | §6.5 | Row present | `PG-004` | CAP-002 read; no effective flow step |
| PG-005 | Row present | §6.6 | Row present | `PG-005` | CAP-003 read; no effective flow step |
| PG-006 | Row present | §6.7 | Row present | `PG-006` | CAP-003 read; no effective flow step |
| PG-007 | Row present | §6.8 | Row present | `PG-007` | FLOW-003 N1 |
| PG-008 | Row present | §6.9 | Row present | `PG-008` | FLOW-003 N1 to N3 |
| PG-009 | Row present | §6.10 | Row present | `PG-009` | FLOW-003 N4 to N7 |
| PG-010 | Row present | §6.11 | Row present, No Permission only | `PG-010` | None — FLOW-004 is proposed and not a driver |
| PG-011 | Row present | §6.12 | Row present, No Permission only | `PG-011` | None — FLOW-005 is proposed and not a driver |
| PG-012 | Row present | §6.13 | Row present, No Permission only | `PG-012` | None — FLOW-006 is proposed and not a driver |

## 4. State coverage

### 4.1 Decision vocabulary

| Decision | Meaning in this map |
|---|---|
| **HF** | High fidelity required this phase: the state must be constructed, with its own copy, recovery action, and layout state. |
| **Reuse** | The state is constructed once elsewhere and placed here with page-specific copy. The source board is named. No new visual decision. |
| **N/A** | The state cannot occur on this page. The reason is stated in place; it is never a silent omission. |

Every decision below is drawn from ID §6 and agrees with the P-README coverage table. Where they differ, ID §6 wins because it is the state authority.

### 4.2 PG-001 — Sign in

| State | Decision | Hi-fi obligation or N/A reason | Evidence |
|---|---|---|---|
| Default | HF | 420px panel, workspace identity above the heading, two fields, one primary Sign in, static account-help note with no link. No SSO, no recovery link, no role selector, no sign-up | ID §6.2; ID §7.2; AC-007 |
| Loading | N/A | Static form; it retrieves no record. Submission has its own state | ID §6.2; P-README N/A reasons |
| Empty | N/A | No collection. Empty fields are the Default, not a page Empty state | ID §6.2 |
| No Result | N/A | No record reference and no search | ID §6.2 |
| Error | HF | One generic denial for any credential failure; identical text for unknown name and wrong credential; credential cleared, sign-in name kept, focus returns to the credential field; no account-existence hint | ID §6.2; ID §5.5; ID §5.7; AC-002, AC-004 |
| No Permission | N/A | Pre-session entry. A failed credential is Error, not a page permission | ID §6.2 |
| Editing | HF | Both fields being filled; the sign-in name is retained, the credential is never retained after failure; no draft persistence | ID §6.2 |
| Submitting | HF | Sign in disabled and relabelled "Signing in…", both fields read-only, polite status announcement, no full-page overlay, second activation ignored | ID §6.2; ID §5.2; ID §5.4; AC-005 |
| Success-Failure | HF | Success enters PG-002 and does not leave PG-001 as a usable Back entry. Failure stays on PG-001 with the generic error. There is no separate success screen | ID §6.2; ID §4.1 N2, F1; AC-001 |

### 4.3 PG-002 — Chat

| State | Decision | Hi-fi obligation or N/A reason | Evidence |
|---|---|---|---|
| Default | HF | Sidebar with New chat and own conversation list; breadcrumb `Workspace / Chat`; header with conversation reference and "Private to you"; ordered thread; pinned composer with Send. No title, model chip, run rail, skill picker, file control, search toggle, or message actions | ID §6.3; ID §4.2 |
| Loading | HF | Layout-matched skeletons for list and thread; composer disabled until context loads; a load failure is Error, never an empty thread | ID §6.3; AC-020 |
| Empty | HF | Two variants: no conversations yet, and a new conversation with no messages. Serif prompt and composer only. No suggested prompts or task shortcuts | ID §6.3; AC-009 |
| No Result | HF | Unresolvable or non-owned reference shows the same generic "Conversation unavailable" panel inside the thread region; list stays usable; New chat is the recovery; no title, owner, message, or count | ID §6.3; ID §3.4; ID §5.5; AC-011 |
| Error | HF | List or message load failure shows a panel with Retry; composer stays disabled; send failure belongs to Success-Failure, not here | ID §6.3; AC-021, AC-014 |
| No Permission | Reuse | Shared No Permission panel with the back destination chosen by ID §5.5 rule 4. An unauthenticated visit goes to PG-001; a non-owned conversation already uses the No Result panel | ID §6.3; ID §5.5 |
| Editing | HF | Composer holds unsent text, kept for the conversation in this page session; leaving asks the discard dialog; a reload loses it | ID §6.3; AC-019 |
| Submitting | HF | User turn shows "Sending"; exactly one pending assistant turn shows "Assistant is responding"; composer locked; no invented assistant text; second send impossible | ID §6.3; ID §4.2 N2, N3; AC-013 |
| Success-Failure | HF | Success appends exactly one assistant message, unlocks the composer, returns focus to it. Failure removes the pending turn, keeps the accepted user message, shows an error with "Try again" that prefills the same text. A partial answer is never left as complete | ID §6.3; ID §4.2 N4, F2; ID §5.2; AC-015 to AC-018 |

### 4.4 PG-003 — Skills registry

| State | Decision | Hi-fi obligation or N/A reason | Evidence |
|---|---|---|---|
| Default | Reuse | Registry frame and card from PG-007 Default. Page-specific copy: eyebrow `Registry / Skills`, title and recorded count, description, read-only notice, cards with name, description, and neutral "Recorded" marker. No owner, lifecycle badge, dependency list, search, filter, or New action | ID §6.4; AC-023 |
| Loading | Reuse | PG-007 Loading. Header and count placeholders remain, cards become skeletons, count shows "—" and never 0 | ID §6.4; AC-026 |
| Empty | **HF** | Must be drawn. "No skills recorded. Only recorded skills appear here." Terminal Empty in the confirmed MVP; no create action. This is the truthful state of a registry that no confirmed role can populate | ID §1.4; ID §6.4; AC-022; `TBD-BIZ-004` |
| No Result | N/A | The list has no query or filter. An unrecorded skill reference does not render the list; it resolves on PG-004 | ID §6.4 |
| Error | Reuse | PG-007 Error. Error panel with Retry; never falls back to Empty or a zero count | ID §6.4; AC-027 |
| No Permission | Reuse | Shared No Permission panel. A proposed role sees No Permission, not an empty list | ID §6.4; ID §5.5 |
| Editing | N/A | No inline editing. The proposed edit entry would open PG-010, which is No Permission; no disabled edit control is shown | ID §6.4 |
| Submitting | N/A | No mutating operation. The proposed publish action is not rendered | ID §6.4 |
| Success-Failure | N/A | Read success is Default and read failure is Error. No page-level terminal operation | ID §6.4 |

### 4.5 PG-004 — Skill record

| State | Decision | Hi-fi obligation or N/A reason | Evidence |
|---|---|---|---|
| Default | Reuse | Record frame: breadcrumb and Back to Skills, name and "Recorded" marker, description, instructions, input definition, version label where present marked as proposed metadata. No owner, dependency list, lifecycle status, or edit/test/publish action | ID §6.5; ID §7.2; AC-025 |
| Loading | Reuse | Record skeleton preserving the breadcrumb and Back to Skills; no field shown partially as final | ID §6.5 |
| Empty | N/A | A record either resolves or does not. A missing field shows "Not provided", a field-level absence, not a page Empty state | ID §6.5 |
| No Result | Reuse | PG-008 No Result panel with copy "This skill is not in the registry." No record, no create action, no partial data; Back to Skills is the only recovery | ID §6.5; ID §3.4; AC-024 |
| Error | Reuse | PG-008 Error panel with Retry and Back to Skills; never renders an empty record | ID §6.5 |
| No Permission | Reuse | Shared No Permission panel. There is no own-only rule for skills | ID §6.5; ID §5.5 |
| Editing | N/A | Read-only record. The proposed edit route is PG-010 and is denied | ID §6.5 |
| Submitting | N/A | No mutating action exists on this page | ID §6.5 |
| Success-Failure | N/A | Read success is Default and read failure is Error | ID §6.5 |

### 4.6 PG-005 — MCP servers registry

| State | Decision | Hi-fi obligation or N/A reason | Evidence |
|---|---|---|---|
| Default | Reuse | Registry frame and card from PG-007 Default plus the status pill from PG-009. Copy: eyebrow `Registry / MCP`, title and recorded count, description, read-only and credential-reference notice, cards with server name, recorded health, and credential-reference indicator. No tool name, tool count, add, test, allowlist, or invoke action | ID §6.6; AC-028, AC-029, AC-032 |
| Loading | Reuse | PG-007 Loading with count "—" | ID §6.6 |
| Empty | **HF** | Must be drawn. "No MCP servers recorded. Only recorded servers appear here." No add action | ID §1.4; ID §6.6; AC-031 |
| No Result | N/A | No query or filter; an unrecorded server reference resolves on PG-006 | ID §6.6 |
| Error | Reuse | PG-007 Error panel with Retry; never renders Empty | ID §6.6; AC-035 |
| No Permission | Reuse | Shared No Permission panel; no credential value is exposed on the denied path | ID §6.6; ID §5.5 |
| Editing | N/A | No inline editing. The proposed add/test/allowlist route is PG-011 and is denied | ID §6.6 |
| Submitting | N/A | No mutating action exists on this page | ID §6.6 |
| Success-Failure | N/A | Read success is Default and read failure is Error | ID §6.6 |

### 4.7 PG-006 — MCP server record

| State | Decision | Hi-fi obligation or N/A reason | Evidence |
|---|---|---|---|
| Default | Reuse | Record frame drawn on PG-008 plus the facts panel drawn on PG-009. Copy: server name, recorded health, connection type, endpoint reference, credential-reference presence, timeout, and a recorded tool-reference count only. Individual tool names and allowlist flags withheld; "No tool references recorded" where applicable. No secret value, test, allowlist, or invoke action | ID §6.7; ID §2.4; AC-030, AC-033, AC-034 |
| Loading | Reuse | Record skeleton with breadcrumb and Back to MCP servers | ID §6.7 |
| Empty | N/A | A record either resolves or does not. A zero tool-reference count is "No tool references recorded", a field-level absence | ID §6.7 |
| No Result | Reuse | PG-008 No Result panel with copy "This server is not in the registry." No record and no create action; Back to MCP servers is the only recovery | ID §6.7; ID §3.4; AC-030 |
| Error | Reuse | PG-008 Error panel with Retry and Back; never renders a blank server | ID §6.7 |
| No Permission | Reuse | Shared No Permission panel. `McpTool.invoke` is denied, so no call control exists | ID §6.7; ID §5.5 |
| Editing | N/A | Read-only record. The proposed edit route is PG-011 and is denied | ID §6.7 |
| Submitting | N/A | No mutating action exists on this page | ID §6.7 |
| Success-Failure | N/A | Read success is Default and read failure is Error | ID §6.7 |

### 4.8 PG-007 — Tasks registry

| State | Decision | Hi-fi obligation or N/A reason | Evidence |
|---|---|---|---|
| Default | HF | Eyebrow `Registry / Tasks`, title and recorded count, description, "Manual runs only" note, read-only notice, task cards with name, description, version label, step count, and Run as the only action. No owner, New task, schedule, template, or bulk action | ID §6.8; ID §7.2; AC-036, AC-048 |
| Loading | HF | Header and count placeholders remain; cards become skeletons; count shows "—"; Run is unavailable until the card's task is loaded | ID §6.8; AC-045 |
| Empty | **HF** | Must be drawn. "No tasks recorded." No New task action, no Run action. Terminal Empty in the confirmed MVP | ID §1.4; ID §6.8; AC-037, AC-038; `TBD-BIZ-004` |
| No Result | N/A | No query or filter; an unrecorded task reference resolves on PG-008 | ID §6.8 |
| Error | HF | Error panel with Retry; never falls back to Empty | ID §6.8 |
| No Permission | Reuse | Shared No Permission panel. A proposed role is denied both read and Run | ID §6.8; ID §5.5 |
| Editing | N/A | No inline editing. The proposed authoring route is PG-012 and is denied | ID §6.8 |
| Submitting | N/A | Run navigates to PG-008, where submission is owned; the list submits nothing | ID §6.8 |
| Success-Failure | N/A | Read success is Default and read failure is Error | ID §6.8 |

### 4.9 PG-008 — Task run

| State | Decision | Hi-fi obligation or N/A reason | Evidence |
|---|---|---|---|
| Default | HF | Breadcrumb and Back to Tasks; task name, version label, description; "Manual run" note; declared inputs; Start run; read-only composition summary in the side panel. No owner, schedule, approval, retry, model, or file control | ID §6.9; ID §7.2; AC-039, AC-048 |
| Loading | HF | Task record loads before the form; header and form skeleton remain; Start run unavailable until the record and its declared inputs are known | ID §6.9; AC-044 |
| Empty | N/A | A task with no declared inputs still renders a complete run form; "No inputs required" is a field-level absence. No tasks is Empty on PG-007; an unrecorded task is No Result | ID §6.9 |
| No Result | HF | "This task is not in the registry." No run form, no Start run, no partial composition; Back to Tasks is the only recovery | ID §6.9; ID §3.4; AC-043 |
| Error | HF | Three distinct renders: load failure with Retry and Back; explicit run-creation failure with "No run was created" and preserved inputs; lost result with "Run start unconfirmed" and neither success nor failure claimed | ID §6.9; ID §5.2; ID §5.4; AC-042, AC-047 |
| No Permission | Reuse | Shared No Permission panel; an inactive session goes to PG-001; a task that is no longer recorded is No Result, not run | ID §6.9; ID §5.5 |
| Editing | HF | Declared inputs filled; values kept until submission or leaving; leaving a non-empty form asks the discard dialog; nothing survives reload | ID §6.9; AC-046 |
| Submitting | HF | Start run disabled and relabelled "Starting run…"; inputs locked; second activation ignored; no run outcome shown while unresolved | ID §6.9; ID §5.2; ID §5.4; AC-040 |
| Success-Failure | HF | Success means a run was created: PG-009 opens with the run reference. A run created and rejected before any step is still a submission success and appears on PG-009 as `Failed`. Failure to create a run stays on PG-008. No success message on PG-008 | ID §6.9; ID §4.3 N3, F2; AC-041 |

### 4.10 PG-009 — Run outcome

| State | Decision | Hi-fi obligation or N/A reason | Evidence |
|---|---|---|---|
| Default | HF | Breadcrumb, run reference, and state badge in the header; "Initiated by you"; task name and version; outcome summary; one row per step with ordinal, target kind, status, duration, and result or error. A skill target shows the skill name; an MCP tool target withholds the tool name. A run rejected before any step shows "No step results" and a generic rejection notice. Actions are Start a new run and Back to Tasks. No artifacts, cost, token, audit metadata, download, or owner name | ID §6.10; ID §7.2; AC-050, AC-056 |
| Loading | HF | Run skeleton preserving the breadcrumb and the run reference; no step status is shown as final until the run record is loaded | ID §6.10 |
| Empty | N/A | The run object has at least one run step by the business-model invariant. A rejected run may have no step results, and the step area then shows "No step results", a field-level absence. A zero-step run is invalid and is shown as Error | ID §6.10 |
| No Result | HF | "This run is not available." No task, owner, state, or step is disclosed; Back to Tasks is the only recovery; the same panel serves a non-owned reference. There is no run index to return to | ID §6.10; ID §3.4; AC-055 |
| Error | HF | Keep the last reported state, mark it "Status unavailable", and offer Retry. A terminal state is shown only when the system reports it; the page never guesses Succeeded or Failed | ID §6.10; ID §5.2; AC-054 |
| No Permission | Reuse | Shared No Permission panel. A non-owned run already uses the No Result panel; an unauthenticated visit goes to PG-001 | ID §6.10; ID §5.5 |
| Editing | N/A | The run is read-only. No step can be edited, reordered, retried, or cancelled | ID §6.10 |
| Submitting | N/A | The page submits nothing. Start a new run navigates to PG-008, where submission is owned | ID §6.10 |
| Success-Failure | HF | Succeeded: every step succeeded, terminal, success summary. Failed after a step: at least one failed step is visible and every later ordinal is Skipped. Failed before any step: terminal Failed with no step results and a generic rejection notice. Initiated and Running are non-terminal and MUST NOT be presented as success or failure | ID §6.10; ID §4.3 N4 to N7, F2; AC-051, AC-052, AC-053, AC-057 |

### 4.11 PG-010, PG-011, PG-012 — proposed editors, collapsed

The three routes share one board. The table decides all 27 cells once.

| State | Decision | Hi-fi obligation or N/A reason | Evidence |
|---|---|---|---|
| Default | Reuse | The effective Default for these routes is the shared No Permission panel. No form, draft, test, publish, allowlist, or disabled control is rendered | ID §6.11 to §6.13; P-README |
| Loading | N/A | No authorized operation can start, so there is no loading state today. The conditional draft skeleton is documented and MUST NOT be drawn | ID §6.11 to §6.13 |
| Empty | N/A | No draft is created. The conditional new-draft form is not drawn | ID §6.11 to §6.13 |
| No Result | N/A | No draft exists to resolve. The conditional "Draft not found" is not drawn | ID §6.11 to §6.13 |
| Error | N/A | No validation, connection test, or publication can run. Conditional errors are not drawn | ID §6.11 to §6.13 |
| No Permission | **HF** | One 560px panel: serif refusal headline, one explanatory paragraph, one route back to a readable page (Skills, MCP servers, or Tasks). No role name, no owner, no record title or count, no existence hint, no promise that authoring will be enabled, no disabled Publish. The copy must survive either side of M-01 | ID §6.11 to §6.13; ID §5.5; ID §5.7; P-README |
| Editing | N/A | No draft or form is created | ID §6.11 to §6.13 |
| Submitting | N/A | No authoring operation is available | ID §6.11 to §6.13 |
| Success-Failure | N/A | No version can be created today | ID §6.11 to §6.13 |

### 4.12 Count check

| PG | HF | Reuse | N/A | Total |
|---|---|---|---|---|
| PG-001 | 5 | 0 | 4 | 9 |
| PG-002 | 8 | 1 | 0 | 9 |
| PG-003 | 1 | 4 | 4 | 9 |
| PG-004 | 0 | 5 | 4 | 9 |
| PG-005 | 1 | 4 | 4 | 9 |
| PG-006 | 0 | 5 | 4 | 9 |
| PG-007 | 4 | 1 | 4 | 9 |
| PG-008 | 7 | 1 | 1 | 9 |
| PG-009 | 5 | 1 | 3 | 9 |
| PG-010 to PG-012 | 3 | 3 | 21 | 27 |
| **Total** | **34** | **25** | **49** | **108** |

34 HF cells resolve to 32 boards because the three No Permission cells are one shared panel. 49 N/A cells each carry a reason. No cell is blank.

## 5. Reuse map for non-critical pages

These pages get no refined page draft this phase. Each row names the exact components and the board they come from.

| PG | Component reused | Source board | Page-specific difference |
|---|---|---|---|
| PG-003 | Sidebar rail, topbar breadcrumb, page header with eyebrow and count, read-only notice, registry card, status pill, skeleton, Error panel, No Permission panel | PG-007 Default, Loading, Error; PG-009 Default for the pill; shared No Permission panel | Eyebrow `Registry / Skills`; card shows name, description, "Recorded"; no Run action; Empty board is its own (HF) |
| PG-004 | Sidebar, breadcrumb and Back, page header, read-only notice, facts panel, status pill, record skeleton, No Result panel, Error panel, No Permission panel | PG-008 Default and Loading; PG-009 Default for the facts panel and pill; PG-008 No Result and Error; shared No Permission panel | Facts: name, recorded marker, version label marked proposed metadata; reading column holds description, instructions, input definition |
| PG-005 | Sidebar, breadcrumb, page header and count, read-only notice, registry card, status pill (health variant), skeleton, Error panel, No Permission panel | PG-007 Default, Loading, Error; PG-009 Default for the pill; shared No Permission panel | Eyebrow `Registry / MCP`; card shows recorded health and credential-reference indicator; no tool count; Empty board is its own (HF) |
| PG-006 | Sidebar, breadcrumb and Back, page header, read-only notice, facts panel, status pill, record skeleton, No Result panel, Error panel, No Permission panel | PG-008 Default and Loading; PG-009 Default; PG-008 No Result and Error; shared No Permission panel | Facts add connection type, endpoint reference, credential-reference presence, timeout, and tool-reference count; withheld-tool note; no secret value |

Reuse does not mean "identical pixels". It means the layout decision and the component anatomy are already made on the source board; only the rows, labels, and one recovery destination change. If a page-specific difference needs a new component, it is a scope change, not a reuse.

## 6. AC coverage and gaps

### 6.1 AC-to-page ledger

`States exercised` lists only the states named by UI-visible AC tags. `States with no AC` is checked against the ID §6 coverage, not against the AC tags alone.

| PG | UI ACs | States exercised | Check-mark states with no AC |
|---|---|---|---|
| PG-001 | AC-001, AC-002, AC-004, AC-005, AC-007 (AC-003, AC-006, AC-008 non-UI) | SF, Er, S, D | Editing |
| PG-002 | AC-009, AC-010, AC-011, AC-012, AC-013, AC-014, AC-015, AC-016, AC-017, AC-018, AC-019, AC-020, AC-021 | E, D, NR, S, Er, SF, Ed, L | No Permission |
| PG-003 | AC-022, AC-023, AC-026, AC-027 | E, D, L, Er | No Permission |
| PG-004 | AC-024, AC-025 | NR, D | Loading, Error, No Permission |
| PG-005 | AC-028, AC-029, AC-031, AC-032, AC-035 | D, E, Er | Loading, No Permission |
| PG-006 | AC-030, AC-033, AC-034 | NR, D | Loading, Error, No Permission |
| PG-007 | AC-036, AC-037, AC-038, AC-045 | D, E, L | Error, No Permission |
| PG-008 | AC-039, AC-040, AC-041, AC-042, AC-043, AC-044, AC-046, AC-047, AC-048 | D, S, SF, Er, NR, L, Ed | No Permission |
| PG-009 | AC-050, AC-051, AC-052, AC-053, AC-054, AC-055, AC-056, AC-057 | D, SF, Er, NR | Loading, No Permission |
| PG-010 to PG-012 | None (PRD §7.7) | — | No Permission, Default |

### 6.2 Gap register

Every gap is a user-visible outcome that a high-fidelity board must render but that no AC-001 to AC-057 row tests. The nearest AC is named so the gap can be closed by an amendment, not by a design guess.

| G | Page · state | Gap | Nearest AC |
|---|---|---|---|
| G-01 | PG-002 to PG-012 · No Permission | No AC anywhere tests the denial panel, its copy, or the one-readable-route-back rule (ID §5.5 rule 4). Eleven pages have a check-mark No Permission state and zero ACs | AC-010, AC-011 test ownership, not denial |
| G-02 | PG-003, PG-004, PG-005, PG-006, PG-009 · Loading | No AC tests the skeleton, the reserved layout, or the disabled control during load. AC-026 tests only that the count is not 0 | AC-026, AC-045 |
| G-03 | PG-004, PG-006, PG-007 · Error | No AC tests that a failed read renders Error rather than Empty or a blank record | AC-027, AC-035 for the other registries |
| G-04 | PG-001 · Editing | No AC tests the sign-in Editing state, retained name, or cleared credential | AC-002 |
| G-05 | PG-001 · Error | AC-002 tests staying on the page, not the cleared credential, retained name, focus return, or the F1 C1 retry path | AC-002, AC-004 |
| G-06 | PG-001 · Error | No AC tests session-creation failure (FLOW-001 F2) as distinct from a rejected credential | AC-002, AC-003 |
| G-07 | PG-001 · Success-Failure | No AC tests that the sign-in page is not retained as a usable Back entry after success | AC-001 |
| G-08 | PG-002 · Empty | AC-009 covers only a new conversation with no messages, not the "no conversations yet" list variant | AC-009 |
| G-09 | PG-002 · Success-Failure | No AC tests the failure recovery "Try again" prefill, or the composer unlock and focus return after success | AC-015 to AC-018 |
| G-10 | PG-002, PG-008 · Editing confirmation | AC-019 and AC-046 test only that the discard dialog opens. No AC tests Stay versus Discard, the focus trap, Escape as Stay, or focus restoration | AC-019, AC-046 |
| G-11 | PG-008 · Error | No AC tests the explicit run-creation failure with "No run was created" and preserved inputs. AC-042 covers invalid inputs; AC-047 covers the unconfirmed result | AC-042, AC-047 |
| G-12 | PG-008 · Error | No AC tests the inactive-session rejection that routes to PG-001 without creating a run | AC-042, AC-047 |
| G-13 | PG-009 · Default | No AC tests the two recovery actions, Start a new run and Back to Tasks, or that Start a new run creates a new run rather than retrying the failed one | AC-050, AC-056 |
| G-14 | PG-009 · Error | AC-054 tests retaining the last state. No AC tests the "Status unavailable" marker with Retry, or that a terminal state is never invented | AC-054 |
| G-15 | PG-003, PG-004, PG-005, PG-006, PG-009 · all states | No AC tests the absence of excluded affordances: no create or publish on PG-003/004, no add/test/allowlist on PG-005/006, no artifacts/cost/token/audit/download on PG-009. Only AC-025, AC-032, AC-033, AC-034, AC-038, AC-048 and AC-007 test an absence | AC-025, AC-032, AC-033, AC-034, AC-038, AC-048, AC-007 |
| G-16 | PG-003, PG-005 · Empty | No AC tests that the Empty registry renders no create action. AC-038 covers only PG-007's missing Run control | AC-022, AC-031, AC-038 |
| G-17 | Global shell · session end | No AC tests the session-ended-during-action notice or the no-partial-change rule (ID §5.5 last row) | None |

### 6.3 Checked and covered

These outcomes are covered and are listed so that the check is auditable and is not mistaken for an omission.

| Outcome | AC |
|---|---|
| A non-owned conversation is indistinguishable from an unknown reference | AC-011 |
| A non-owned run is indistinguishable from an unknown reference | AC-055 |
| A failed read is Error, not Empty, on the skills and MCP registries | AC-027, AC-035 |
| The recorded count is never 0 while loading | AC-026 |
| An unrecorded task on PG-008 renders no run form | AC-043 |
| PG-007 Empty renders no Run control | AC-038 |
| PG-001 renders no SSO control | AC-007 |
| PG-008 renders no schedule control | AC-048 |
| No credential value is rendered on the MCP registry or record | AC-032, AC-033 |
| PG-006 renders no tool invocation control | AC-034 |
| PG-004 renders no edit control | AC-025 |

A publish confirmation is correctly absent from the AC set: the only effective dialog is the discard confirmation, and publish is proposed and denied. That absence is not a gap.

### 6.4 Cross-source mismatches

These rows carry the flags. A page row affected by a flag MUST NOT be marked ready to draft in §10. M-02 and M-04 are phase- and metadata-level and add no page-level blocker.

| M | Item | Side A | Side B | Status and handling | Affected rows |
|---|---|---|---|---|---|
| **M-01** | Who may author and publish, and whether the registries can be populated | BM Appendix B.3 grants ROLE-002 Admin `Skill.publish`, `TaskDefinition.publish`, all-run `Run.read`, and `Audit.read`; B.9 supersedes BM §6.1 and §6.2; REG records `TBD-BIZ-004` as **Resolved** with admin-only publication | ID §1.4 and §8.1 treat `TBD-BIZ-004` as **Open**; ID §2.1 calls Admin proposed with no effective grant; ID §2.2 denies every Admin cell; ID §3.2 marks PG-010 to PG-012 proposed and not effective; PRD §10.2 records the divergence with neither side chosen | `[TBD-UX]` + `[CONFLICT]`. This map renders the No Permission panel and no authoring form, chooses no side, and states that the Empty registries and the no-create rule are not settled | PG-003, PG-005, PG-007, PG-009, PG-010, PG-012 |
| **M-02** | Gate 1 target revision | REG `TBD-BIZ-012` is titled "Gate 1 acceptance baseline of PRD v0.1" | The resolution names PRD v0.2 and option (b); the title remains historical | `[TBD-PRD]`. Resolved by `CHG-021`; the resolution source names v0.2, so the target document is no longer ambiguous | All rows (phase gate) |
| **M-03** | Auditor role | `CONFLICT-001` is Resolved toward the Admin-capability side; BM B.3 makes audit an Admin read | ROLE-004 remains proposed and denied in ID §2.1 and PRD §5.5 | `[CONFLICT]`, resolved at the registry level and cited as-is. No page depends on an Auditor, so no board is held by it. The Admin all-run grant is folded into M-01 | PG-009 (indirectly) |
| **M-04** | What "Stage 5" denotes | `docs/00_setup/README.md` stage map assigns Stage 5 to Data Design | The product-owner Stage 5 contract produced `docs/01_product/business_model.md` | `[CONFLICT]`, Open. REG states no business rule is blocked. It constrains this document's stage label only | Document metadata |
| **M-05** | Registry ownership and offboarding | `TBD-BIZ-013` is Open; ENT-006 and ENT-011 carry owner attribution marked PII | ID §2.3 omits owner names because `Account.read` is denied; no offboarding control exists | `[TBD-UX]`. Omit owner attribution; do not invent an ownership or transfer control. A resolution could add a fact row, not a new page | PG-003, PG-004, PG-007 |
| **M-06** | Discard confirmation copy | ID §5.3 and the prototype use "Discard unsent text?" | ID §6.9 uses "Discard unsent input?" for the run form | `[TBD-UX]`. One dialog string must be chosen before build. This map uses "Discard unsent text?" as a working label only, not a decision, and forbids shipping two strings | PG-002, PG-008 |
| **M-07** | AC-056 state tag | AC-056 is tagged `PG-009 · Default` and asserts a rejected run displays "No step results" | ID §6.10 places a rejected-before-any-step run in Default and in Success-Failure; the run is terminal `Failed` | `[TBD-PRD]`. Tag is valid because both states are check-mark on PG-009. Record for the Verifier; no board change | PG-009 |
| **M-08** | Read-only registries mapped to proposed flows | ID §3.2 and §3.3 map PG-003 and PG-004 to "FLOW-004 N5 read side" and PG-005/006 to "FLOW-005 registration context"; PRD §11.2 repeats the read-side label | FLOW-004 to FLOW-006 are proposed and MUST NOT drive a page in this handoff | `[TBD-UX]`, resolved for construction by PRD §11.2, which says the read context does not make those flows effective. Pages are built on CAP-002/BR-003 and CAP-003/BR-004 only. No side is chosen about the flows' status | PG-003, PG-004, PG-005, PG-006 |

## 7. Desktop breakpoints

Only the desktop range is designed. 1440px is the baseline; 1280, 1080, and 960 are the adopted narrower steps. Nothing below 960 is designed, and no mobile, tablet-portrait, bottom-sheet, or touch layout is implied.

### 7.1 Shell at each width

The sidebar stays 272px at all four widths. The main pane owns scrolling; the document does not scroll horizontally.

| Measure | 1440 | 1280 | 1080 | 960 |
|---|---|---|---|---|
| Sidebar | 272 | 272 | 272 | 272 |
| Main pane | 1168 | 1008 | 808 | 688 |
| Page gutter | 36 | 28 | 28 | 20 |
| Content width | 1096 | 952 | 752 | 648 |
| Topbar | 56 | 56 | 56 | 56 |
| Registry grid | 3 columns | 2 columns | 2 columns | 2 columns |
| Card minimum | 320 | 320 | 320 | 280 |
| Record, run, outcome split | 764 + 32 + 300 | 644 + 28 + 280 | stacked | stacked |
| Chat column | 760 | 720 | 720 | fills 648 |
| Control height | 36 | 36 | 36 | 36 |

The side panel keeps its own width at 1280 and stacks below the main column at 1080. The registry grid never drops to one column inside the desktop range.

### 7.2 Per-page construction values

| PG | 1440 | 1280 | 1080 | 960 |
|---|---|---|---|---|
| PG-001 | 420 panel centred, no rail | 420 centred | 420 centred | 420 inside 648 |
| PG-002 | 760 chat column, 272 rail | 720 column | 720 column | column fills 648 |
| PG-003, PG-005, PG-007 | 3 columns, 1096 content | 2 columns, 952 | 2 columns, 752 | 2 columns, 648, 280 minimum |
| PG-004, PG-006 | 764 reading + 300 facts | 644 reading + 280 facts | facts stack below | single column |
| PG-008 | 764 form + 300 composition | 644 form + 280 composition | composition stacks | single column |
| PG-009 | 764 outcome + 300 summary | 644 outcome + 280 summary | summary stacks | single column; step table wraps duration and result onto a second line under each step, status stays visible |
| PG-010 to PG-012 | 560 panel centred | 560 centred | 560 centred | 560 inside 648 |

### 7.3 Breakpoint rules that must not be broken

- At 1440 no page requires horizontal scrolling.
- At 960 the step table wraps; it never scrolls sideways and never hides status.
- The registry grid stays at two columns at 960 and does not become a mobile list.
- The 1360 content cap does not bind at 1440 because the main pane is 1168; it binds only on wider viewports.
- Below 960 is out of scope. No board, note, or handoff may state a 375, 390, 768, 860, 780, or 560 viewport layout, a 44px touch target, or a bottom sheet.

## 8. Component candidates for Prompts B and C

Only components that appear in the page map above are listed. Each row names where the component is used and what the high-fidelity pass must preserve. Component anatomy is inherited; visual values are not (§9).

| C | Component | Variants | Appears on | What must be preserved |
|---|---|---|---|---|
| C-01 | Sidebar rail | default, active destination, active conversation | PG-002 to PG-009 | 272px at all desktop widths; exactly four destinations (Chat, Skills, MCP servers, Tasks); New chat; own conversation list with no search or row actions; neutral signed-in label with no menu, avatar, or sign-out |
| C-02 | Topbar and breadcrumb | `Workspace / section`, `Workspace / section / record` | PG-002 to PG-009 | 56px sticky; record label is a business name or reference, never an owner; no theme toggle; the prototype's dashed States control is not a product component |
| C-03 | Page header | registry, record, run | PG-003 to PG-009 | Eyebrow, title with recorded count, description; the count is part of the header, not a KPI |
| C-04 | Recorded count | loaded, loading | PG-003, PG-005, PG-007 | Shows a real count when loaded and "—" while loading; never 0 while the data is unknown |
| C-05 | Read-only notice | registry, record, credential-reference | PG-003 to PG-007 | States read-only in text; not a disabled toolbar and not an icon-only hint |
| C-06 | Registry card | skill, MCP server, task | PG-003, PG-005, PG-007 | Name, supporting line, and one status or metadata marker; task card adds version, step count, and Run as the only action; no owner, lifecycle stripe, or hover-only action |
| C-07 | Status pill | ok, warn, error, info, neutral | PG-005, PG-006, PG-007, PG-009 | Text label plus dot plus colour; never colour alone; maps Succeeded to ok, Failed to error, Running to info, Needs authentication to warn, Recorded and Skipped to neutral |
| C-08 | Button | primary, secondary, ghost, disabled-in-flight | PG-001, PG-002, PG-007 to PG-009, plus state-panel recovery actions on PG-003 to PG-006 | 36px; 2px focus ring; disabled only while its own operation is in flight; label changes to a verb in progress; no disabled "coming soon" or denied capability |
| C-09 | Input and field group | text, credential, declared input | PG-001, PG-008 | 36px control; adjacent label, hint, and error; first invalid field takes focus; more than one error adds a summary above the primary action; error uses text, not colour alone |
| C-10 | Composer | idle, editing, locked | PG-002 | Pinned; plain text; Enter sends and Shift+Enter inserts a line; locked while one message is pending; no attachment, mention, slash menu, model chip, or search toggle |
| C-11 | Run-step table | loaded, wrapped at 960 | PG-009 | Caption and scoped headers; one row per step with ordinal, target kind, status, duration, result or error; at 960 duration and result move to a second line under the step |
| C-12 | Facts and summary panel | record facts, run summary, composition summary | PG-004, PG-006, PG-008, PG-009 | Read-only label and value rows; 300px at 1440, 280px at 1280, stacked at 1080; withholds owner, secret, and individual tool names |
| C-13 | State panel | Empty, No Result, Error, No Permission | PG-002 to PG-012 | 560px; serif headline; one explanatory paragraph; at most one primary recovery action; page header and Back stay visible where the page has them |
| C-14 | Dialog | discard confirmation | PG-002, PG-008 | The only effective overlay; alertdialog semantics; Stay and Discard; Tab trap; Escape acts as Stay; focus returns to the trigger; shell inert while open |
| C-15 | Live region | polite status | PG-001, PG-002, PG-008, PG-009 | Announces sign-in result, chat completion, run state change; the chat thread itself is not a live region |
| C-16 | Skeleton | list, card grid, record | PG-002 to PG-009 | Layout-matched placeholders that preserve the header and count; never a spinner-only page and never an Empty state before load |
| C-17 | Back link | record back, run back | PG-004, PG-006, PG-008, PG-009 | Destination is the readable parent page; a No Permission panel renders a back link only when its destination is readable |

Not components in this map, and therefore not listed for Prompts B or C: search field, filter chip, pager, tab bar, toast, notification, avatar, account menu, theme toggle, run-context rail, tool receipt, artifact card, cost meter, audit table, publish confirmation, editor form, allowlist toggle.

## 9. Inherit versus discard

### 9.1 Inherit — interaction behaviour

| Behaviour | Source | Why it is inherited |
|---|---|---|
| Route per page, record references as route keys, no owner in the route | ID §3.4; P-README route table | It is the effective IA and is executable today |
| Page change moves focus to the page heading, not to the composer or primary action | ID §5.6; DS §6 | Keyboard rule, independent of visual style |
| Composer locks while one message is pending; one assistant message per accepted user message | ID §4.2; ID §5.4 | Prevents duplicate sends; no queue is invented |
| "Sending" and "Assistant is responding" are visible pending states, never a fabricated answer | ID §5.2; P-README step 3 | No fabricated success |
| Start run locks the form and says "Starting run…"; a created run is not a successful run | ID §4.3; ID §5.2; P-README step 2 | The core "run created is not run succeeded" distinction |
| No Result is distinct from Empty; a failed read is Error, never Empty or zero | ID §6.1; ID §5.2 | Prevents fabricated emptiness |
| Non-owned and non-existent references render the same generic panel | ID §3.4; ID §5.5 | Prevents an existence oracle |
| Read-only means no edit affordance at all, not a greyed-out control | ID §2.3; ID §5.5 | Denied capability is absent, not teased |
| One discard dialog with Stay and Discard; no delete, publish, or sign-out anywhere | ID §5.3; P-README | The only effective confirmation |
| Polite live regions for sign-in, chat completion, and run state | ID §5.6; DS §6 | Accessibility behaviour, not styling |
| Skip link, focusable main region, 2px visible focus ring, reduced-motion support | ID §5.6; ID §7.5; DS §6 | Accessibility baseline |
| Desktop control baseline of 36px; no 44px mobile target | ID §5.6; ID §7.5 | The scope stops at desktop |

### 9.2 Inherit — layout structure

| Structure | Source | What is inherited |
|---|---|---|
| Authenticated shell with a fixed rail and a fluid main pane that owns scrolling | ID §7.1; DS §4 | The two-region grid and the `100dvh` behaviour |
| 272px rail, 56px topbar, 36px gutter, 1096px content at 1440 | ID §7.1 | The baseline grid, not the pixel of every element |
| Page patterns: standalone sign-in, chat workspace, registry list, record, run form, run outcome, proposed editor, state panel | ID §7.2 | The pattern per page, which §3 and §7.2 preserve |
| Registry grid 3 to 2 columns; record and run split that stacks at 1080; step table that wraps at 960 | ID §7.3; DS §4 | The breakpoint behaviour, which is the only responsive contract in scope |
| Chat column capped below 72ch of prose | ID §7.1; DS §3.2 | Readability constraint, not a fixed pixel |
| State panel width and one-recovery-action rule | ID §7.2; DS §5 | The state-panel anatomy |

### 9.3 Discard — visual values

These are reference values from a Draft prototype. They are **not** locked tokens and must be re-decided by the visual pass. They are listed so the next prompt does not silently inherit them as a design system.

| To discard as a locked value | Current reference | What may be inherited instead |
|---|---|---|
| Porcelain Blue palette values | `--canvas #f8f9fb`, `--surface #ffffff`, `--accent #2563eb`, near-white rail `#f7f8fa`, and the status triples in DS §3.1 | The direction only: a calm light workspace, one action accent, amber for attention, red for failure. Porcelain Blue is a **candidate**, not a settled palette |
| Type faces | `"Avenir Next"`, `"Segoe UI"`, `"Iowan Old Style"`, `"Palatino"`, `"SF Mono"` local stacks (DS §3.2) | The hierarchy intent: a display serif for page, card, and state headlines; a sans for body and controls; a mono for micro-labels. The families are not selected |
| Type sizes and weights | 34px page title, 20px card title, 13.5px body, 11px micro (DS §3.2) | The relative hierarchy and the 11px functional-text floor. Exact sizes belong to the visual pass |
| Shadow scale | `--shadow-xs` to `--shadow-lg`, 1px border plus low-contrast shadow, 2px hover lift (DS §3.3) | "Quiet elevation" as intent, not the values |
| Radius values | 14px panels, 10px cards and tables, 6px controls, 3px tags (DS §3.3) | The distinction between panel, card, and control radius, not the numbers |
| Motion values | 120, 180, 260ms with one ease-out curve (DS §3.3) | Reduced-motion support and the rule that no information depends on motion |
| Dark theme | The full dark column in DS §3.1 and §6 | Nothing. It is reference-only, the prototype is light-only, and a theme was never confirmed |
| Prototype-only chrome | Dashed States review control, prototype stamps, synthetic fixture labels ("weekly-digest", "ticket-triage", "health-check", `RUN-7K2M`) | The state names and flows they exercise, not the chrome or the labels |

### 9.4 Prototype claims that must not be repeated

- The prototype is not a high-fidelity draft, not a design system, and not production code. It is a throwaway `file://` artifact with synthetic data.
- It was verified in headless Chrome at 1440, 1280, 1080, and 960; that evidence covers behaviour and overflow, not visual quality or accessibility conformance.
- Its `body { min-width: 960px }` is a desktop floor, not a responsive design.
- Its in-memory session reset is a prototype simplification, not product session behaviour; session termination is an unregistered gap in ID §8.2.
- Its hash routes are a file-protocol artifact; the construction routes are the ID §3.2 paths.
- Its light-only theme is not a theme decision.

## 10. Readiness and gates

### 10.1 Reading the readiness column

Two different things are separated here. The **phase gate** remains partly closed: independent PRD review, high-fidelity asset, and tool selection (`TBD-INFRA-001`) are unresolved; Gate 1 (`TBD-BIZ-012`) is accepted at the scope boundary (`CHG-021`). **Page construction readiness** is per row: "no page-level blocker" means the row adds no ambiguity of its own; it does not mean approved or ready to draft. Any row carrying `[TBD-UX]`, `[TBD-PRD]`, or `[CONFLICT]` is marked **Not ready to draft** and must not be scheduled as a final board. Of the five must-draft pages, only PG-001 has no page-level blocker; PG-002 and PG-008 are held by the dialog-copy flag alone.

| PG | Page construction readiness | Page-level blockers | What can be constructed now |
|---|---|---|---|
| PG-001 | No page-level blocker | None. Phase gate only | All 5 HF states |
| PG-002 | **Not ready to draft** | M-06 `[TBD-UX]` dialog copy only | All 9 HF states, pending one dialog string |
| PG-003 | **Not ready to draft** | M-01 `[TBD-UX]` `TBD-BIZ-004` status and `[CONFLICT]` no-create rule; M-05 `[TBD-UX]` | Reuse map only; the Empty board can be drawn but not closed |
| PG-004 | **Not ready to draft** | M-05 `[TBD-UX]`; M-08 `[TBD-UX]`; proposed-metadata version label | Reuse map only |
| PG-005 | **Not ready to draft** | M-01 `[TBD-UX]` and `[CONFLICT]` no-add rule | Reuse map only; the Empty board can be drawn but not closed |
| PG-006 | **Not ready to draft** | M-08 `[TBD-UX]` | Reuse map only |
| PG-007 | **Not ready to draft** | M-01 `[TBD-UX]` and `[CONFLICT]` no-create rule, which the Empty board depends on | Default, Loading, Error; Empty can be drawn but not closed |
| PG-008 | **Not ready to draft** | M-06 `[TBD-UX]` dialog copy only. `TBD-BIZ-005` and `TBD-BIZ-007` constrain fixture content, not layout | All 7 HF states, pending one dialog string |
| PG-009 | **Not ready to draft** | M-01 `[CONFLICT]` Admin all-run read changes the "Initiated by you" line and the permission layer | Member own-only boards |
| PG-010 | **Not ready to draft** | M-01 `[CONFLICT]` Admin `Skill.publish` | Shared No Permission panel only |
| PG-011 | **Not ready to draft** | Shares the panel held by M-01; registration denied under both sides | Shared No Permission panel only |
| PG-012 | **Not ready to draft** | M-01 `[CONFLICT]` Admin `TaskDefinition.publish` | Shared No Permission panel only |

### 10.2 What must close before any board is treated as final

1. Independent Verifier review of PRD v0.2, so that AC-001 to AC-057 are reviewed definitions rather than an unreviewed draft.
2. `TBD-BIZ-004` / M-01 — whether Admin authoring is effective. This decides whether PG-010 and PG-012 stay denied, whether PG-003/005/007 keep a terminal Empty state, and whether a create affordance exists at all.
3. `TBD-INFRA-001` — the frontend stack and, separately, whether any design tool is selected. Board IDs, handoff format, and any token pipeline depend on it.
4. `TBD-BIZ-013` / M-05 — whether owner attribution or an offboarding state appears on registry records.
5. The copy decision in M-06, so the shared dialog ships one string.
6. `TBD-INFRA-004` — resolved by `CHG-022` (Stage 1 baseline recorded); no visual-regression or browser verification command is named until `TBD-INFRA-007`.

### 10.3 What does not block a board

`TBD-BIZ-005` (first integrations and tasks) constrains fixture content only; clearly synthetic labels are acceptable and no real integration may be named. `TBD-BIZ-007` (execution model) constrains the step vocabulary, not the layout; no code, branch, loop, approval, or retry surface is drawn either way. `TBD-BIZ-008` (NFR thresholds) constrains loading durations and refresh intervals; the boards show pending states that persist until the system reports, with no invented timer. `CONFLICT-002` blocks metadata and routing text, not page content. `CONFLICT-001` is resolved and no page depends on an Auditor.

## 11. Self-check

### 11.1 Checks

| # | Criterion | Verdict | Evidence | Residual limit |
|---|---|---|---|---|
| 1 | Every PG-001 to PG-012 resolves in ID §3 and §6 and in the prototype route table | Pass | §3.1, 12 of 12 rows; ID §3 map has 12 rows | The three proposed editors resolve as routes but have one effective state |
| 2 | Every must-draft page points to a concrete route and flow step, not an assumption | Pass | PG-001 `/sign-in` FLOW-001 N1 to N2; PG-002 `/chat` FLOW-002 N1 to N5; PG-007 `/tasks` FLOW-003 N1; PG-008 `/tasks/:taskName/run` FLOW-003 N1 to N3; PG-009 `/runs/:runReference` FLOW-003 N4 to N7 | Four of the five carry at least one page-level flag (PG-002 and PG-008 on dialog copy; PG-007 and PG-009 on M-01), which §10 states rather than hides |
| 3 | No applicable state is silently missed; every N/A has a reason | Pass | §4.2 to §4.11: 108 cells; 49 N/A each with a reason; §4.12 counts | The reasons are the ID and P-README reasons, restated, not independently re-derived |
| 4 | AC coverage is traced and gaps reach the AC number | Pass | §6.1 ledger; §6.2 G-01 to G-17 each names its nearest AC; §6.3 lists covered outcomes | 11 pages have a check-mark No Permission state and no AC (G-01); that is a real PRD gap, not a transcription error |
| 5 | Only components that appear in the table are listed | Pass | C-01 to C-17 are each used by at least one row in §3; §8 names what is excluded | A component may split once the visual pass starts, which would change the list |
| 6 | Inherit and discard are separated; Porcelain Blue is a candidate only | Pass | §9.1 and §9.2 inherit behaviour and structure; §9.3 discards palette, type, shadow, radius, motion, and dark theme as locked values | The visual pass still has to choose every discarded value |
| 7 | Gate status is stated | Pass | §1.2: Gate 1 scope boundary accepted, PRD review not performed, no high-fidelity asset, no tool, no Frozen asset, no baseline | The prototype's 174 and 67 checks are author-executed; no Verifier re-ran them for this map |
| 8 | No new PG, navigation, capability, state, role, field, or tool; nothing below 960px | Pass | 12 PG rows only; §7.3 and §2.4; no tool named; no board ID assigned | None |
| 9 | The `file://` prototype is not described as a high-fidelity draft or a design system | Pass | §1.1 rank 4, §1.2, §9.4 | None |
| 10 | No existing file was modified and no Frozen asset was touched | Pass | Write set: two new files only; Frozen assets: none in the repository | `docs/03_design/README.md` and `docs/13_changes/README.md` do not yet list the new file; updating them would have modified an existing file and was therefore not done |

### 11.2 Residual limits

- Gate 1 is accepted at the scope boundary, but the PRD is unreviewed and the tool gate is open, so this map orders work; it does not authorize it.
- `TBD-BIZ-004` is Resolved in the registry while the interaction design still treats it as Open. This map records both and resolves neither, which is why the registry and authoring rows stay flagged and only PG-001 has no page-level blocker.
- The AC gap register describes the PRD as written. It does not propose new AC identifiers or amend the PRD.
- The map uses the state names and N/A reasons of interaction design v0.1. If a state definition changes, every corresponding cell must be re-checked.
- No visual, layout, type, colour, motion, or component-code decision was made, and none should be inferred from the reference values in §9.3.
- No board exists. The next design pass must first close or explicitly accept the blockers in §10.2.
