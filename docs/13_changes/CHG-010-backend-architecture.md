# CHG-010 — Backend architecture design (Stage 3)

Status: Draft
Complexity: Complex
Refs: TBD-BIZ-003, TBD-BIZ-004, TBD-BIZ-005, TBD-BIZ-006, TBD-BIZ-007, TBD-BIZ-008, TBD-BIZ-009, TBD-BIZ-010, TBD-BIZ-011, TBD-BIZ-012, TBD-BIZ-013, TBD-BIZ-014, TBD-BIZ-015; TBD-INFRA-001, TBD-INFRA-002, TBD-INFRA-003, TBD-INFRA-004, TBD-INFRA-005, TBD-INFRA-006, TBD-INFRA-007, TBD-INFRA-009, TBD-INFRA-010, TBD-INFRA-011; CONFLICT-001, CONFLICT-002
Owner: Lead architecture agent — Docs Agent scope for `docs/02_architecture/**`, with a recorded handoff to the Tech Lead scope for this record under the user's Stage 3 architecture task.

## Plan

- **Trigger and approval.** The user asked for a backend architecture design for hound-dock, using `docs/01_product/business_model.md` v0.2 as the business authority. Stage 1 (read-only input trace and task split) was delivered and the user approved Stage 2 on 2026-10-18, with these choices: use RULE-001-compliant `snake_case` file names; keep the strict ROLE-001 / empty-registries stance; do not add new TBD IDs; write the architecture documents in English.
- **Approach.** Produce a technology-neutral architecture baseline in six parts: a research and input-traceability record; a domain and service architecture; an API/workflow and state-mapping document; a security, reliability and operations document; an independent architecture review; and one integrated `architecture.md` with a small ADR set. Four drafting agents (A domain/services, B API/workflow, C security/operations, D review) work from the same effective/proposed rules; the Lead integrates and owns the final consistency pass.
- **What is deliberately not decided.** No frontend stack, backend stack, data store, dependency tooling, LLM gateway, search provider, hosting or CI is selected. No endpoint, path, JSON schema, OpenAPI document, database table, column, index, migration, deployment command, or application code is produced. No TBD is answered; no CONFLICT is resolved; PRD acceptance (`TBD-BIZ-012`) is not claimed.
- **Effective / proposed discipline.** Only `FLOW-001`–`003`, `STATE-001`/`002`, and `BR-001`–`008` are treated as rules. `FLOW-004`–`006`, `STATE-003`–`006`, skill publication, MCP registration/allowlisting, and task publication are labelled `proposed — reserved; not implemented`. Proposed entities that the effective rules structurally need (for example `ENT-012` Task Version and `ENT-015` Run Step) are handled as minimal records, not as full lifecycles.
- **Affected paths (write set).**
  - `docs/02_architecture/README.md` (authoritative-assets list, document map, and naming note; status stays `Draft`).
  - `docs/02_architecture/00_research_and_input_traceability.md`.
  - `docs/02_architecture/01_domain_and_service_architecture.md`.
  - `docs/02_architecture/02_api_workflow_and_review.md`.
  - `docs/02_architecture/03_security_reliability_and_operations.md`.
  - `docs/02_architecture/04_architecture_review.md`.
  - `docs/02_architecture/architecture.md`.
  - `docs/02_architecture/adr/README.md` and `docs/02_architecture/adr/adr_001_*.md` … `adr_005_*.md`.
  - `docs/13_changes/CHG-010-backend-architecture.md` (this record).
- **Read-only paths.** `docs/01_product/**`, `docs/03_design/**`, `docs/04_data/**`, `docs/05_api/**`, `docs/06_development/**`, `docs/07_testing/**`, `docs/08_security/**`, `docs/09_deployment/**`, `docs/10_operations/**`, `docs/11_quality/**`, `docs/12_reviews/**`, `docs/00_setup/**`, `frontend/**`, and `backend/**` are not modified. No new top-level directory is created. `adr/` is a subdirectory of `docs/02_architecture/`.
- **Risks and mitigations.**
  1. **Scope drift into stack selection.** Mitigation: every technology mention is a candidate or a port; ADRs record boundaries, not vendors; D checks for stack conclusions.
  2. **Scope drift into API contracts.** Mitigation: B states command/query and error classes only; endpoint and schema decisions are explicitly deferred to `docs/05_api/`.
  3. **Promoting proposed material.** Mitigation: an effective/proposed legend on every document; a mechanical check for `FLOW-004`–`006` and `STATE-003`–`006` claims; D reviews every promotion.
  4. **Turning an open TBD into a settled fact.** Mitigation: each dependent statement names its TBD; no numeric threshold, retention period, encryption choice, PII conclusion, role grant, or provider decision is written as settled.
  5. **The confirmed MVP is not operable.** `TBD-BIZ-004` leaves the registries without a confirmed human authority. Mitigation: the architecture states the blocker, keeps registries read-only, permits empty registries, and does not invent an administrator or a hidden seed API.
  6. **Chat versus the data boundary.** `CAP-001` requires a model call while `NFR-008` blocks external content until several TBDs close. Mitigation: the model boundary is a port with an explicit egress gate; the tension is recorded, not resolved.
  7. **Run execution without an execution model.** `TBD-BIZ-007` is open. Mitigation: the lifecycle and outcome records are designed; the executor is a port; no step semantics, retry, branch, or code execution is invented.
  8. **Naming rule violation.** RULE-001 forbids hyphens in documentation file names. Mitigation: `snake_case` names, including ADR file names; the mapping is recorded in this record and in the architecture README update.
  9. **Cross-ownership write.** `docs/13_changes/**` belongs to the Tech Lead. Mitigation: this record states the handoff; no root governance, rule, or open-item file is changed.
- **Verification plan.** Confirm every document has an exact `Status: Draft` line and a valid RULE-001 file name; confirm every `TBD`/`CONFLICT`/`CAP`/`BR`/`ENT`/`STATE`/`FLOW`/`NFR` reference resolves to `business_model.md` or `open_items.md`; grep for stack conclusions, endpoint/schema definitions, SQL/DDL, code fences containing implementation, retention/encryption/PII conclusions, and forbidden promotion of proposed flows; run the D review; re-run the mechanical checks after integration and record the commands, exit codes, and observed results in `## Verification`.

## Task Brief

- **Scope.** Write the Stage 3 backend architecture documents for the confirmed MVP only, plus the research and traceability record, the review, the ADRs, and this change record. The deliverables are documentation, not implementation.
- **Inputs.**
  - `docs/01_product/business_model.md` v0.2 (`Draft`) — the sole business authority; effective items only.
  - `docs/03_design/interaction_design.md` v0.1 (`Draft`) — page states, flows, exception feedback, unregistered gaps; interaction input only.
  - `docs/01_product/prd.md` v0.1 (`Draft`) — candidate input only; never a rule.
  - `docs/00_setup/open_items.md` — the only registry for TBD and CONFLICT IDs; referenced, never redefined.
  - `docs/02_architecture/README.md`, `docs/04_data/README.md`, `docs/05_api/README.md`, `docs/08_security/README.md`, `docs/09_deployment/README.md`, `docs/10_operations/README.md` — stage boundaries and write prohibitions.
  - `docs/00_setup/project_rules.md` — RULE-001, RULE-005, RULE-007, RULE-011, RULE-013, RULE-014, RULE-018, RULE-019, RULE-020.
  - Official MCP specification material, for the `ENT-008` registry vocabulary and security boundary only.
- **Outputs.**
  1. `00_research_and_input_traceability.md` — source register, input trace (effective, proposed, assumption, conflict, gap), official research entries, gaps without new IDs.
  2. `01_domain_and_service_architecture.md` — context, modules, domain model, effective state machines, commands/queries/events, consistency, failure recovery.
  3. `02_api_workflow_and_review.md` — interface boundary, error classes, permission enforcement points, sync/async split, progress and retry, nine-state mapping.
  4. `03_security_reliability_and_operations.md` — trust boundaries, authentication/authorization, data boundary, egress, capacity/availability, backup/durability, rate limiting, observability, cost.
  5. `04_architecture_review.md` — independent traceability and quality review.
  6. `architecture.md` — the single integrated architecture draft.
  7. `adr/README.md` and ADR records for the high-cost-to-reverse decisions.
  8. `README.md` update (authoritative assets only).
  9. This change record, completed with verification evidence.
- **Acceptance criteria.**
  1. Every architecture document is `Status: Draft` and uses a RULE-001-compliant path.
  2. The five MVP capabilities and the three effective flows are the only end-to-end capabilities designed; `FLOW-004`–`006`, `STATE-003`–`006`, and the skill/MCP/task authoring paths are explicitly reserved and not implemented.
  3. No stack, store, gateway, search provider, hosting, CI, command, endpoint, schema, DDL, migration, or code is selected or written.
  4. No `TBD` is answered; no `CONFLICT` is resolved; PRD acceptance is not claimed; no `Status: Frozen` appears.
  5. The ROLE-001 matrix, default-deny rule, own-only scoping, and read-only registry surfaces drive the authorization boundary; the absence of a confirmed registry authority is recorded as a blocker.
  6. The run and run-step state machines match `STATE-001`/`STATE-002`; terminal states are immutable; failure is visible; no automatic retry is introduced.
  7. The MCP position is explicit: internal read-only registry record and recorded health, no MCP runtime, no registration/allowlisting/invocation. The HITL position is explicit: not introduced, with a revisit trigger.
  8. The research record contains question, official link, conclusion, project impact, and adopt/reject reasoning for each researched item.
  9. D's review is completed and every finding is either fixed or explicitly carried as an open item.
  10. The change record contains executed verification with commands, exit codes, and observed results.
- **Ownership.**
  - `docs/02_architecture/**` — Docs Agent scope (dormant); authored by the Lead architecture agent under this task, with A/B/C/D producing their named files and the Lead integrating.
  - `docs/13_changes/CHG-010-backend-architecture.md` — Tech Lead scope; written by the Lead architecture agent under the user's explicit Stage 3 task, recorded here as a handoff.
  - `docs/00_setup/**`, root governance, `frontend/**`, `backend/**`, and all other `docs/**` — out of scope; no writes.
- **Non-goals.** Implementation, scaffolding, dependency manifests, migrations, deployment configuration, real model or MCP calls, dataset creation, UI design, API contract schemas, and any decision the user owns.

## Verification

Executed 2026-10-18 (Asia/Shanghai) on the working tree. This is a documentation-only change; no build, runtime, model call, MCP call, or network-dependent test was executed. The official MCP pages were read as documentation only.

| # | Check | Command / method | Exit | Observed result |
|---|---|---|---|---|
| 1 | Status lines | `find docs/02_architecture -name '*.md' -exec grep -EL '^Status: (Draft|Reviewed|Frozen)$' {} +` | 0 | No output; 13/13 files carry an exact status line and all are `Draft` |
| 2 | RULE-001 file names | `find docs/02_architecture -type f -name '*.md' \| grep -vE '/(README\|[a-z0-9_]+)\.md$'` | 1 | No output; exit 1 means no name violation |
| 3 | ID resolution | Python regex over the 13 architecture docs and this record, checked against `business_model.md`, `open_items.md`, and `interaction_design.md` | 0 | 0 unresolved `TBD`, `CONFLICT`, `CAP`, `BR`, `ENT`, `STATE`, `FLOW`, `NFR`, `ROLE`, or `PG` references |
| 4 | Relative links | Python extraction of relative Markdown links and existence check | 0 | 0 broken links across 13 files |
| 5 | Gap-family separation | `grep -rn '\bGAP-' docs/02_architecture --include='*.md'` | 1 | No output; only `AGAP-`, `BGAP-`, and `CGAP-` remain, with the crosswalk in `architecture.md` §15 |
| 6 | Scope scan | Python regex for `CREATE TABLE`, `INSERT INTO`, `SELECT *`, `/api/`, and a numeric status code | 0 | 0 matches |
| 7 | Frozen guard | `grep -rn '^Status: Frozen' docs/02_architecture` | 1 | No output; no document is Frozen |
| 8 | Write set | `git status --short` | 0 | Only `docs/02_architecture/**` and `docs/13_changes/CHG-010-backend-architecture.md` are changed or added |
| 9 | Architecture review | `docs/02_architecture/04_architecture_review.md` | — | Verdict `Pass with conditions`; 0 blockers, 4 major (2 fixed in integration, 2 accepted product conditions), 9 minor (8 fixed, 1 carried), 4 notes |
| 10 | Volume and coverage | `wc -l` over the 13 architecture documents | 0 | 2,798 lines; 12 documents plus the review; 5 ADRs; all required sections present |

**Verification limits.** The stack, store, gateway, and environment are unselected, so no runtime, performance, capacity, availability, or security-control test can be executed. The NFR thresholds are proposed or TBD, not verified. The MCP runtime and HITL flow do not exist and were not tested. The RULE-005 independent Verifier record and the `docs/13_changes/README.md` index update remain pending and are outside this task's write scope.

**AI data classification:** No secrets, production data, or PII were used. The inputs are repository `Draft` documents and official MCP documentation; no dataset or real user data was shared.

**Reviewer:** `docs/02_architecture/04_architecture_review.md` records the architecture review. It is not the RULE-005 Verifier record; that independent review remains pending.

## Dependency audit

None — no dependency, package manifest, lockfile, external runtime, or network call is added. The official MCP material is read as documentation only.

## Decision and conflict log

- 2026-10-18 — User approved Stage 2 of the architecture task with the recommended options: RULE-001-compliant `snake_case` names; strict ROLE-001 / empty registries; no new TBD IDs; documents in English.
- 2026-10-18 — The architecture treats `business_model.md` v0.2 effective items as rules and everything else as candidate, proposed, or reserved. No TBD or CONFLICT is resolved.
- 2026-10-18 — The `docs/13_changes/**` write is a recorded handoff from the Docs Agent scope to the Tech Lead scope, authorized by the user's Stage 3 task. No root governance or open-item file is changed.
- 2026-10-18 — `docs/12_reviews/**` is not written. The D review in `docs/02_architecture/04_architecture_review.md` is an architecture review, not the RULE-005 independent Verifier record; that record remains pending and is outside this task's write scope.
- 2026-10-18 — Architecture review verdict: `Pass with conditions`; 0 blockers, 2 accepted product conditions (`TBD-BIZ-004` operability; CAP-001 versus the egress gate), 2 major and 8 minor findings fixed in integration, 1 minor carried (change-index update). The two product conditions are not architecture defects and are not resolved here.
- 2026-10-18 — `docs/13_changes/README.md` was not updated because the task limits writes to `docs/02_architecture/**` plus this record. The Tech Lead should append `CHG-010` when the index is next updated.
