# CHG-014 — PRD v0.2 revision

Status: Draft
Complexity: Complex
Refs: OBJ-001, OBJ-002, OBJ-003; CAP-001 to CAP-005; CAP-009; CAP-006 to CAP-036; BR-001 to BR-008; FLOW-001 to FLOW-006; PG-001 to PG-012; API-001 to API-015; NFR-001 to NFR-012; TBD-BIZ-003, TBD-BIZ-004, TBD-BIZ-005, TBD-BIZ-006, TBD-BIZ-007, TBD-BIZ-008, TBD-BIZ-009, TBD-BIZ-011, TBD-BIZ-012, TBD-BIZ-013, TBD-BIZ-014, TBD-BIZ-015; TBD-INFRA-003, TBD-INFRA-004, TBD-INFRA-005, TBD-INFRA-009, TBD-INFRA-011; CONFLICT-001, CONFLICT-002
Owner: Docs Agent — PRD scope for `docs/01_product/**`; change record and change index filed under the recorded Tech Lead handoff for `docs/13_changes/**` (the Tech Lead owns that path per AGENTS.md §3, and the user's task explicitly requested the change record and index update in the same batch).

## Plan

- **Trigger.** The user's PRD v0.2 task asks for an in-place revision of `docs/01_product/prd.md` that integrates five authority documents, preserves the confirmed MVP, records the Admin and audit surface conflicts, and removes the old search, audit-page, and model-configuration requirements. The task also asks for `CHG-014` and the index update in the same batch.
- **Approach.**
  1. Read the five highest-authority inputs in full: `business_model.md` v0.3, `interaction_design.md` v0.1, `api_interface_spec.md` v0.1, `architecture.md` and `02_api_workflow_and_review.md` v0.1, and the v0.1 PRD. Read the prototype coverage table, `open_items.md`, and the change-record contract on demand.
  2. Restructure the PRD around the eight required themes: objectives and context; capabilities; flows and interactions; states, exceptions, permissions; data and interface linkage; acceptance criteria; out of scope; NFRs and acceptance status.
  3. Retain only `CAP-001` to `CAP-005` and record `CAP-009` separately as in scope but blocked. Keep the 30 excluded capabilities out of the MVP.
  4. Use only `FLOW-001` to `FLOW-003` as the confirmed spine across `PG-001` to `PG-009`; record `FLOW-004` to `FLOW-006` as Proposed only, with no implementation ACs.
  5. Use the nine page-state names from `interaction_design.md` §6.1. Reproduce the prototype's ✓/N/A coverage and each N/A reason.
  6. Quote the `interaction_design.md` §2.2 permission matrix cell by cell. Keep default deny. Mark the Admin publication/audit-read divergence `[CONFLICT]` and cite API §15 CF-01.
  7. Write 57 binary ACs with one condition each, tagged by BR, API where applicable, and exactly one PG·state for every UI-visible AC. Exclude every state that is N/A on the AC's page.
  8. Add an AC↔API↔PG coverage table and verify that all 15 endpoints are cited and none is orphaned.
  9. Record `CAP-009` as blocked — scope settled, surface not covered — with no page, endpoint, or AC, and cite API §15 CF-12.
  10. Remove `US-02`, `US-07`, `US-09`, and the old §13 permission matrix. Record each removal in the v0.1-to-v0.2 disposition table.
  11. Cite `NFR-001` to `NFR-012` as-is, keep every threshold proposed under `TBD-BIZ-008` or its named `TBD`, and state that no NFR is accepted.
  12. State in §19 that `TBD-BIZ-012` is Open and this draft is not Gate 1-accepted. Do not resolve a `TBD` or adjudicate a `CONFLICT`.
- **Affected paths (write set).**
  - `docs/01_product/prd.md` — v0.1 replaced in place by v0.2.
  - `docs/01_product/README.md` — asset list refreshed for PRD v0.2 and business model v0.3.
  - `docs/13_changes/CHG-014-prd-v0.2.md` — this record.
  - `docs/13_changes/README.md` — index entry for CHG-014.
- **Read-only paths.** `docs/00_setup/**`, `docs/02_architecture/**`, `docs/03_design/**`, `docs/04_data/**`, `docs/05_api/**`, `docs/06_development/**` to `docs/12_reviews/**`, `frontend/**`, `backend/**`, and root governance. No upstream document is edited. No `docs/08_prd` directory is created.
- **Risks and mitigations.**
  1. **Reintroducing excluded surfaces.** Mitigation: §8 lists all 30 excluded CAPs; §12 records the removal of `US-02`, `US-07`, `US-09`, and old §13; no AC references search, an audit page, or model configuration.
  2. **Taking a side in the Admin divergence.** Mitigation: quote the §2.2 matrix unchanged; mark the divergence `[CONFLICT]`; cite Appendix B.3/B.4/B.5 and API §15 CF-01; write no Admin AC and no Admin page or endpoint.
  3. **Inventing an audit surface for CAP-009.** Mitigation: record `CAP-009` as blocked; assign no `PG`, `API`, or `AC`; cite API §15 CF-12; do not create a placeholder.
  4. **Adding a page, role, state, or error code.** Mitigation: fail the ID-range and state-tag checks if a new `PG`, `ROLE`, page state, or error code appears; `Blocked` is explicitly a capability status, not a page state.
  5. **Writing a compound or unverifiable AC.** Mitigation: one "Pass iff" condition per AC; a per-row tag check; a page-state check against §5.2.
  6. **Resolving a TBD or reopening a CONFLICT.** Mitigation: reference registry statuses as-is; cite `CONFLICT-001` and `CONFLICT-002` only; state that new conflicts are registered by the Tech Lead.
  7. **Overwriting upstream authority.** Mitigation: the write set is limited to the PRD, its folder index, this record, and the change index; no upstream path is modified.
  8. **Stale or inconsistent matrices.** Mitigation: compare the page-state matrix to `prototype/README.md` and the permission matrix to `interaction_design.md` §2.2 with executed checks.
- **Verification plan.** Execute documentation checks for status and version lines, required headings, AC count and uniqueness, binary form, BR coverage, API coverage, PG/state validity, N/A exclusion, state-matrix parity, permission-matrix parity, ID ranges, forbidden state/error identifiers, proposed-flow AC absence, TBD resolution, banned and technology wording, table consistency, whitespace, and the write set. Record commands, exit codes, and observed results below.

## Task Brief

- **Scope.** Revise `docs/01_product/prd.md` to v0.2 in place, and file the same-batch change record and index update. No implementation, schema, API change, UI change, stack selection, or upstream edit.
- **Inputs (highest authority first).**
  1. `docs/01_product/business_model.md` v0.3 — sole business authority: OBJ, CAP, FLOW, ENT, ROLE, STATE, BR, NFR, Appendix B.
  2. `docs/03_design/interaction_design.md` v0.1 — PG-001 to PG-012, §2.2 matrix, §5 interaction rules, §6 nine-state matrix.
  3. `docs/05_api/api_interface_spec.md` v0.1 — API-001 to API-015, error model, §15 conflicts and gaps.
  4. `docs/02_architecture/architecture.md` and `docs/02_architecture/02_api_workflow_and_review.md` v0.1 — IF-01 to IF-04 boundary and seven error classes.
  5. `docs/01_product/prd.md` v0.1 — the document being revised; US-02, US-07, US-09, and old §13 are not carried over.
  6. On demand: `docs/04_data/data_model_spec.md`, `docs/03_design/prototype/README.md`, `docs/03_design/design_system.md`, `docs/02_architecture/adr/`, `docs/00_setup/open_items.md`, `docs/13_changes/README.md`.
- **Outputs.**
  1. `docs/01_product/prd.md` — v0.2, `Status: Draft`, revised in place.
  2. `docs/01_product/README.md` — asset list update.
  3. `docs/13_changes/CHG-014-prd-v0.2.md` — this record.
  4. `docs/13_changes/README.md` — index entry.
- **Acceptance criteria.**
  1. §2 cites `OBJ-001` to `OBJ-003` and adds no goal or metric.
  2. §3 lists `CAP-001` to `CAP-005` with a BR for each, and keeps `CAP-009` separate from the `CAP-006` to `CAP-036` exclusions.
  3. §4 uses `FLOW-001` to `FLOW-003` to `PG-001` to `PG-009` as the spine; `FLOW-004` to `FLOW-006` are Proposed only with no implementation ACs.
  4. §5 uses only the nine page states, matches the prototype ✓/N/A table with a reason for every N/A, and quotes the §2.2 matrix cell by cell with default deny.
  5. §6 contains an AC↔API↔PG coverage table and no orphaned endpoint among `API-001` to `API-015`.
  6. §7 contains 57 binary ACs, one condition each, with BR tags, API tags where applicable, and one valid non-N/A PG·state tag for every UI-visible AC.
  7. §8 covers `CAP-006` to `CAP-036`, mobile, search/citations, cost, scheduling, automatic retry, and every write path beyond Admin.
  8. §9 cites `NFR-001` to `NFR-012` as-is and states that thresholds remain under `TBD-BIZ-008` or their named `TBD`; §19 states that `TBD-BIZ-012` is Open and this draft is not Gate 1-accepted.
  9. The Admin and `CAP-009` divergences carry `[CONFLICT]`; `CONFLICT-001` and `CONFLICT-002` are cited only; no `TBD` is resolved and no new ID is created.
  10. `US-02`, `US-07`, `US-09`, and old §13 are not carried over as requirements.
  11. The change record contains Plan, Task Brief, executed Verification, Dependency audit, and Decision/conflict log.
  12. The document remains `Draft`; independent review has not been performed and no implementation is authorized.
- **Ownership.**
  - `docs/01_product/**` — Docs Agent scope; authored under this task.
  - `docs/13_changes/**` — Tech Lead scope; this record and the index entry are written under the user's explicit same-batch request and the handoff recorded in the header.
  - `docs/00_setup/**`, `docs/02_architecture/**`, `docs/03_design/**`, `docs/04_data/**`, `docs/05_api/**`, `docs/06_development/**` to `docs/12_reviews/**`, `frontend/**`, `backend/**`, root governance — read-only.
- **Non-goals.** Implementation, scaffold, dependency manifest, lockfile, migration, DDL, OpenAPI generation, implementation-stack selection, UI redesign, upstream policy edits, `TBD` resolution, `CONFLICT` adjudication, merge, or independent review. The user's commit instruction of 2026-10-18 is recorded in the decision log; the commit does not make the documents `Reviewed` or `Frozen`.

## Verification

Executed 2026-10-18 (Asia/Shanghai) on the working tree. Documentation-only change: no build, runtime, API, UI, database, model call, MCP call, or network-dependent test was executed.

| # | Check | Command or method | Exit | Observed result |
|---|---|---|---|---|
| 1 | Status and version lines | `grep -n '^Status: Draft$' docs/01_product/prd.md`; `grep -n '^Version: 0.2$' docs/01_product/prd.md` | 0 | `Status: Draft` at line 3; `Version: 0.2` at line 4. |
| 2 | Required headings | `grep -c '^## ' docs/01_product/prd.md`; presence check for §2, §3, §4, §5, §6, §7, §8, §9, §19 | 0 | 19 level-two headings; all nine required headings present. |
| 3 | AC count, uniqueness, binary form | Python regex over the AC rows and the `Pass iff` conditions | 0 | 57 AC rows; 57 unique IDs; 57 `Pass iff` conditions. |
| 4 | BR coverage | Python count of BR tags in the AC rows | 0 | 8 of 8 BRs covered: BR-001=7, BR-002=13, BR-003=6, BR-004=8, BR-005=12, BR-006=2, BR-007=1, BR-008=8. |
| 5 | API coverage | Python count of API tags in the AC rows | 0 | 15 of 15 APIs covered: API-001=7, API-002=1, API-003=3, API-004=2, API-005=3, API-006=4, API-007=4, API-008=2, API-009=5, API-010=3, API-011=4, API-012=2, API-013=8, API-014=4, API-015=4. |
| 6 | Page-state matrix parity | Python comparison of the PRD §5.2 rows to `prototype/README.md` | 0 | PG-001 to PG-009 match exactly; PG-010 to PG-012 match the combined prototype row. |
| 7 | Permission-matrix parity | Python comparison of the §5.5 rows to `interaction_design.md` §2.2 | 0 | 18 of 18 rows match exactly, including the four role cells and the Source column. |
| 8 | PG/state tag validity | Python check of every AC tag against §5.2 | 0 | 53 UI ACs; 0 invalid; 4 non-UI ACs: AC-003, AC-006, AC-008, AC-049. No N/A state is used. |
| 9 | Proposed flows have no AC | Python scan of AC rows for `FLOW-004`, `FLOW-005`, `FLOW-006`, `PG-010`, `PG-011`, or `PG-012` | 0 | 0 AC rows reference a proposed flow or page. |
| 10 | ID ranges and no new state/error code | Python extraction of `PG`, `ROLE`, `API`, `CAP`, `NFR`, `BR`, and `CONFLICT` maxima; `STATE-xxx` and `4xxxx`/`5xxxx` scans | 0 | PG max 12; ROLE max 4; API max 15; CAP max 36; NFR max 12; BR max 8; CONFLICT max 2; no `STATE-xxx` reference; no error code. |
| 11 | TBD references resolve | Python extraction of every `TBD-BIZ-*` and `TBD-INFRA-*` reference; compare to `open_items.md` | 0 | 19 unique TBD IDs; all resolve; no new ID. |
| 12 | CAP-009 block | Python check for the blocked statement and for any AC mentioning `CAP-009` | 0 | `Blocked — scope settled, surface not covered` present; 0 ACs for `CAP-009`. |
| 13 | Banned and technology wording | Python substring scan over the banned/technology term list recorded in this check | 0 | No hit. |
| 14 | Removed v0.1 material | Two `grep -nE` runs: `US-0[279]` and `§13` | 0 | Occurrences are confined to the removal/disposition statements in §1.2, §8.2, §11.3, and §12; none is a requirement. |
| 15 | Table consistency and whitespace | PRD pipe-count check over 36 table blocks; trailing-whitespace and tab scan | 0 | 36 table blocks; 0 inconsistent rows; 0 trailing-whitespace lines; 0 tab lines. |
| 16 | No `docs/08_prd` directory | `test ! -d docs/08_prd` | 0 | The path does not exist; `docs/08_security` remains the security folder. |
| 17 | Write set | `git status --short` | 0 | Exactly four paths: `docs/01_product/prd.md`, `docs/01_product/README.md`, `docs/13_changes/CHG-014-prd-v0.2.md`, `docs/13_changes/README.md`. No upstream file is modified. |

**Banned/technology scan list:** `good experience`, `fast response`, `reasonable`, `friendly`, `several`, `etc.`, `appropriate`, `as much as possible`, `high-performance`, `high-availability`, `flexible`, `seamless`, `robust`, `user-friendly`, `intuitive`, `delightful`, `component`, `pixel`, `framework`, `library`, `React`, `FastAPI`, `Pydantic`, `Tailwind`, `WebSocket`. The scan reported no hit.

**Verification limits.** No API, UI, model, MCP server, store, or browser was executed. The 57 acceptance criteria are definitions, not observed results. No independent Verifier review exists for this revision; RULE-005 is not satisfied for this revision. The document remains `Draft`. `TBD-BIZ-012` is Open. The Admin publication and audit-read divergence is recorded, not resolved. `CAP-009` is blocked and has no page, endpoint, or AC. No `TBD` was answered and no `CONFLICT` was adjudicated.

**AI data classification:** No secrets, production data, or real PII were used. All references are repository `Draft` documents or synthetic identifiers. No dataset, credential, or user data was shared.

**Reviewer:** Independent Verifier review not performed. This change is not merge-ready until an independent review record for CHG-014 exists in `docs/12_reviews/` and the Admin and audit conflict dispositions are accepted.

## Dependency audit

None — no dependency, package manifest, lockfile, external runtime, or network call is added. The PRD selects no implementation stack, interface element, or provider.

## Decision and conflict log

- 2026-10-18 — **Revision shape:** v0.1 replaced in place by v0.2; the eight required themes are §2 to §9, and §19 carries the acceptance status. The old §19 acceptance conditions are withdrawn.
- 2026-10-18 — **Objectives:** only `OBJ-001` to `OBJ-003` are cited. No goal, metric, baseline, target, or time window is added. `TBD-BIZ-006` remains the target reference.
- 2026-10-18 — **Capabilities:** `CAP-001` to `CAP-005` are the MVP. `CAP-009` is kept separate and recorded as blocked because it has no page and no endpoint. The 30 excluded capabilities are listed in §8.1.
- 2026-10-18 — **Flows:** `FLOW-001` to `FLOW-003` are the only confirmed flows and map to `PG-001` to `PG-009`. `FLOW-004` to `FLOW-006` are Proposed only; no AC references them or `PG-010` to `PG-012`.
- 2026-10-18 — **States:** the nine page states are quoted from `interaction_design.md` §6.1. The ✓/N/A table is an exact match to the prototype. Run values such as `Succeeded`, `Failed`, and `Skipped` are described as business data inside `Success-Failure`, not as page states.
- 2026-10-18 — **Permissions:** the §2.2 matrix is quoted cell by cell and default deny is stated. The Admin cells remain `denied` in the quoted matrix.
- 2026-10-18 — **Admin conflict:** `[CONFLICT]` recorded between Appendix B.3/B.4/B.5 and `interaction_design.md` §2.1/§2.2; cited API §15 CF-01; no side chosen; no Admin AC; no new `CONFLICT` ID.
- 2026-10-18 — **Audit conflict:** `[CONFLICT]` recorded between Appendix B.4/B.6 and the absence of an audit page and endpoint; cited API §15 CF-12; `CAP-009` marked blocked; no page, endpoint, or AC invented.
- 2026-10-18 — **Existing conflicts:** `CONFLICT-001` is Resolved and cited only; `CONFLICT-002` is Open and cited only; neither is reopened.
- 2026-10-18 — **Removed material:** `US-02`, `US-07`, `US-09`, and old §13 are not carried over. Search/citations, the audit page, and model configuration are not promoted to requirements.
- 2026-10-18 — **TBD discipline:** no `TBD` is resolved; no new `TBD` or `CONFLICT` ID is created. Registry statuses are cited as-is, including the Resolved statuses of `TBD-BIZ-003`, `TBD-BIZ-004`, `TBD-BIZ-009`, and `TBD-BIZ-011`.
- 2026-10-18 — **Cross-ownership handoff:** `docs/13_changes/**` is Tech Lead scope. This record and the index entry are written under the user's explicit same-batch request; the header records the handoff.
- 2026-10-18 — **Commit:** the user requested a commit after the draft was completed. The four paths are committed with `Refs: CHG-014` on the current branch. No merge is performed. The documents remain `Draft`; independent review and Tech Lead acceptance are still required before merge.
