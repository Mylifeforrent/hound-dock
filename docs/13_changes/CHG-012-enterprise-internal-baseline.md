# CHG-012 — Enterprise-internal baseline

Status: Draft
Complexity: Complex
Refs: TBD-BIZ-003, TBD-BIZ-004, TBD-BIZ-005, TBD-BIZ-006, TBD-BIZ-007, TBD-BIZ-008, TBD-BIZ-009, TBD-BIZ-010, TBD-BIZ-011, TBD-BIZ-012, TBD-BIZ-013, TBD-BIZ-014, TBD-BIZ-015; TBD-INFRA-001, TBD-INFRA-002, TBD-INFRA-003, TBD-INFRA-004, TBD-INFRA-005, TBD-INFRA-006, TBD-INFRA-007, TBD-INFRA-009, TBD-INFRA-010, TBD-INFRA-011; CONFLICT-001, CONFLICT-002
Owner: Data architect — Docs Agent scope for `docs/01_product/**`, `docs/02_architecture/**`, and `docs/04_data/**`; recorded handoff to the Tech Lead scope for `docs/00_setup/open_items.md` and `docs/13_changes/**` under the product owner's explicit selection of 2026-10-18.

## Plan

- **Trigger and approval.** On 2026-10-18 the product owner asked whether the project could be ungated for an enterprise-internal daily-work deployment. The agent presented the gate map and recommended a full enterprise-internal baseline. The product owner selected **“Full enterprise baseline”**: Internal/Sensitive data, no Highly Sensitive data, 90/180/365-day retention, PostgreSQL, Admin-only publication, audit on, internal model gateway, and the strict MVP. This record applies that decision.
- **Scope interpretation.** “Admin-only publishing” is applied to **skills and tasks**. MCP registration/allowlisting remains out of the MVP; the MCP registry stays read-only. Account administration, audit export, search, file context, cost, chat-history actions, projects, and templates remain out. This keeps the change inside the existing entity set and avoids inventing a secret-reference or account-console design.
- **Approach.**
  1. Record the resolutions in `docs/00_setup/open_items.md` with a resolution source.
  2. Add `business_model.md` v0.3 Appendix B as an authoritative amendment: classification, retention, roles, audit, effective STATE-003/005, six-CAP MVP, PostgreSQL, internal gateway, and superseded statements.
  3. Add `docs/02_architecture/05_enterprise_internal_baseline.md` as the architecture supplement for admin authoring, audit, and state changes.
  4. Replace the logical-only `data_model_spec.md` with v0.2: 13 tables, `role_assignment`, `audit_event`, version states, confirmed classification/retention, and resolved gates.
  5. Update the 04_data folder contract and the change index.
- **What changes in scope.** The MVP moves from five CAPs to six (`CAP-009` audit enters); skill and task authoring becomes effective; `STATE-003` and `STATE-005` become effective. This is a **product-scope increase**, not merely an ungate.
- **What does not change.** MCP registration, MCP invocation, MCP runtime, account administration, audit export, search, file context, cost, history, projects, templates, notifications, import/export, mobile, SSO, HITL, and external model/search egress remain out. `TBD-BIZ-014` remains open for the internal-policy reference; no compliance conclusion is issued.
- **Affected paths (write set).**
  - `docs/00_setup/open_items.md` — six resolutions, one conflict resolution, summary counts.
  - `docs/01_product/business_model.md` — v0.3 header, Appendix B, closing block, self-check note.
  - `docs/02_architecture/05_enterprise_internal_baseline.md` — new supplement.
  - `docs/02_architecture/README.md` — authoritative assets, boundary exception, document map.
  - `docs/04_data/data_model_spec.md` — v0.2 logical model.
  - `docs/04_data/README.md` — resolved-boundary contract and document map.
  - `docs/13_changes/CHG-011-logical-data-model.md` — appended supersession note.
  - `docs/13_changes/CHG-012-enterprise-internal-baseline.md` — this record.
  - `docs/13_changes/README.md` — index entry.
- **Read-only paths.** `docs/03_design/**`, `docs/05_api/**` through `docs/11_quality/**`, `docs/12_reviews/**`, `frontend/**`, `backend/**`, and root governance. No new top-level directory.
- **Risks and mitigations.**
  1. **Scope creep disguised as an ungate.** Mitigation: the Plan states the six-CAP scope and the explicit exclusions; the architecture supplement has a non-goals section.
  2. **MCP/secret scope opened accidentally.** Mitigation: MCP registration remains out; `ENT-009` and `ENT-010` are not persisted; no secret-reference field is added.
  3. **Audit becomes a log.** Mitigation: `audit_event` is append-only, separate from `MOD-06`; logs are explicitly not audit.
  4. **A TBD is treated as resolved without a source.** Mitigation: every resolution cites `CHG-012` and Appendix B; `TBD-BIZ-014` stays open.
  5. **Role/state promotion breaks the old matrix.** Mitigation: Appendix B.3/B.5 and the architecture supplement supersede only the named cells/states; the Member row and STATE-001/002 are unchanged.
  6. **Retention is invented at the job level.** Mitigation: the periods are recorded; the deletion job, exact trigger, and backup/restore are deferred.
  7. **Data model and business model drift.** Mitigation: the data model cites Appendix B and the architecture supplement; the old v0.2 statements are explicitly superseded.
  8. **Cross-ownership writes.** Mitigation: the handoff is recorded in the header and decision log; no design, review, or code path is written.
- **Verification plan.** Check status lines; check registry counts; check 18/18 entity mapping, 13 tables, and 13 field sections; resolve every `TBD`/`CONFLICT` reference; scan for DDL/SQL; check classification labels; check effective/reserved states; check the new audit and role tables; count Mermaid fences; record the write set.

## Task Brief

- **Scope.** Apply the enterprise-internal baseline to the product, architecture, and data-model documents, and record the decisions in the registry and change log.
- **Inputs.** `business_model.md` v0.2 effective items; `open_items.md`; `architecture.md`; `01_domain_and_service_architecture.md`; `interaction_design.md` v0.1 (page fields only); `04_data/README.md`; `08_security/README.md`; `project_rules.md`; the product owner’s 2026-10-18 selection.
- **Outputs.**
  1. `docs/00_setup/open_items.md` — resolved entries with sources.
  2. `docs/01_product/business_model.md` v0.3 Appendix B — authoritative amendment.
  3. `docs/02_architecture/05_enterprise_internal_baseline.md` — architecture supplement.
  4. `docs/04_data/data_model_spec.md` v0.2 — 13-table logical model.
  5. `docs/04_data/README.md` — resolved-boundary contract.
  6. `docs/13_changes/CHG-012-enterprise-internal-baseline.md` — this record.
  7. `docs/13_changes/README.md` — index.
- **Acceptance criteria.**
  1. `TBD-BIZ-003`, `-004`, `-009`, `-011`, `TBD-INFRA-003`, `-009` are `Resolved` with a resolution source; `CONFLICT-001` is `Resolved`; `TBD-BIZ-014` remains `Open`.
  2. The business model has a v0.3 amendment with classification, retention, roles, audit, effective STATE-003/005, six-CAP scope, PostgreSQL, and internal gateway.
  3. The architecture supplement records the module/state/audit changes without adding a new entity or a new TBD/CONFLICT ID.
  4. The data model has 13 tables, 18/18 entity mapping, 5 not-persisted entities, and no `[TBD-BIZ-003]` field label.
  5. `role_assignment` and `audit_event` are effective; MCP registration, account administration, and audit export remain out.
  6. No DDL, SQL, migration code, API schema, real PII, or secret appears.
  7. Retention is 90/180/365; classification is Internal/Sensitive; no Highly Sensitive field.
  8. Verification is executed with commands, exit codes, and observed results.
- **Ownership.**
  - `docs/01_product/**`, `docs/02_architecture/**`, `docs/04_data/**` — Docs Agent scope; authored by the data architect under the user’s task.
  - `docs/00_setup/open_items.md`, `docs/13_changes/**` — Tech Lead scope; written under the handoff recorded in the header and decision log.
  - `docs/03_design/**`, `docs/05_api/**`–`docs/11_quality/**`, `docs/12_reviews/**`, `frontend/**`, `backend/**`, root governance — out of scope.
- **Non-goals.** Physical schema, DDL, migration code, physical indexes, API contract, UI design for the audit/authoring surfaces, implementation, commit, merge, or independent review.

## Verification

Executed 2026-10-18 (Asia/Shanghai) on the working tree. Documentation-only change: no build, runtime, PostgreSQL instance, model call, MCP call, or network-dependent test was executed.

| # | Check | Command / method | Exit | Observed result |
|---|---|---|---|---|
| 1 | Status lines | `grep -n '^Status: Draft$'` over the changed documents plus this record | 0 | Every document has `Status: Draft` at line 3; the business-model fenced closing block also contains a Draft line |
| 2 | Registry counts | Python parse of `open_items.md` | 0 | `TBD-BIZ` 9 Open / 6 Resolved; `TBD-INFRA` 8 Open / 3 Resolved; `CONFLICT` 1 Open / 1 Resolved |
| 3 | Resolved entries | Review of `Resolution source` fields | 0 | 003, 004, 009, 011, INFRA-003, INFRA-009, CONFLICT-001 resolved; 014 remains Open |
| 4 | Entity coverage | Python `ENT-0nn` extraction over `data_model_spec.md` | 0 | 18 unique IDs; no missing entity |
| 5 | Table inventory | `awk` count in §2.2 | 0 | 13 logical tables |
| 6 | Field sections | `grep -cE '^### 4\.([2-9]\|1[0-4]) '` | 0 | 13 field tables |
| 7 | Not-persisted entities | §2.3 review | 0 | ENT-005, ENT-009, ENT-010, ENT-016, ENT-018 = 5 |
| 8 | ID resolution | Python over changed docs against `open_items.md` | 0 | 0 missing; 0 new `TBD`/`CONFLICT` IDs |
| 9 | DDL / SQL scan | `grep -nEi 'CREATE TABLE\|ALTER TABLE\|CREATE INDEX\|DROP TABLE\|INSERT INTO\|SELECT \*\|VARCHAR\|TIMESTAMPTZ\|JSONB\|UUID\|CREATE TYPE'` over the data model | 1 | No output; no DDL, SQL, or migration code. PostgreSQL is named as the selected store, not as a schema |
| 10 | Classification labels | `grep` for `[TBD-BIZ-003]` in `data_model_spec.md` | 0 | No field label remains; 003 appears only as a resolved reference in §1.3/§7/§12 |
| 11 | Sensitivity coverage | §4 field-table review | 0 | Every sensitive field is `Sensitive`; structural fields are `Internal`; no field is `Highly Sensitive`; `Public` is unused |
| 12 | State coverage | `grep -nE 'STATE-00[1-6]'` | 0 | 001/002/003/005 effective; 004/006 reserved; no reserved-state field |
| 13 | New tables | §4.13/§4.14 and §5 review | 0 | `role_assignment` and `audit_event` present; MCP tool/secret/artifact/model-config tables absent |
| 14 | Mermaid | `grep -c '^```mermaid'` over business model and data model | 0 | Data model: 2 blocks; business model: 6 flowcharts + 1 ER + 6 state diagrams + 2 Appendix B state diagrams = 15. Static syntax only; no renderer |
| 15 | Write set | `git status --short` | 0 | 9 paths: 5 modified (`open_items.md`, `business_model.md`, `02_architecture/README.md`, `04_data/README.md`, `13_changes/README.md`) and 4 untracked (`05_enterprise_internal_baseline.md`, `data_model_spec.md`, `CHG-011`, `CHG-012`); all within the declared paths |

**Verification limits.** PostgreSQL physical design, index implementation, migration code, retention job, backup/restore, and the audit/authoring UI are not implemented or tested. `TBD-BIZ-014` remains open, so no legal/compliance conclusion is issued. The Mermaid diagrams were not rendered. No independent Verifier record exists; RULE-005 review remains pending. No commit was made.

**AI data classification:** No secrets, production data, or real PII were used. Inputs were repository `Draft` documents and the product owner’s decisions; no dataset or user data was shared.

**Reviewer:** Pending independent Verifier review. This record is not merge-ready until `docs/12_reviews/CHG-012-review.md` exists and the scope interpretation is accepted.

## Dependency audit

None — no dependency, package manifest, lockfile, external runtime, or network call is added. PostgreSQL is selected as the deployment store; no driver, ORM, or migration tool is introduced in this change.

## Decision and conflict log

- 2026-10-18 — The first data-model attempt was stopped because `TBD-BIZ-003` and `TBD-INFRA-003` were open. The product owner then instructed “fix the issue and continue”; `CHG-011` recorded a narrow logical-only start.
- 2026-10-18 — The product owner asked whether the project could be ungated for enterprise-internal daily work. The agent presented the gate map and recommended the full enterprise-internal baseline.
- 2026-10-18 — **Product-owner decision:** select the full enterprise-internal baseline. This record applies it.
- 2026-10-18 — **Data classification/retention:** Internal/Sensitive; no Highly Sensitive; 90/180/365 days; TLS/at-rest; log redaction. `TBD-BIZ-003` resolved. The classification is a product-owner decision, not a legal conclusion.
- 2026-10-18 — **Store/provider:** PostgreSQL; internal OpenAI-compatible gateway; no external egress. `TBD-INFRA-003` and `TBD-INFRA-009` resolved.
- 2026-10-18 — **Roles/publication:** Admin-only skill and task publication; Member read/run; MCP registration and account administration remain out; role assignments out of band. `TBD-BIZ-004` resolved. `CONFLICT-001` resolved toward Admin audit read.
- 2026-10-18 — **Audit:** `CAP-009` effective; append-only sign-in, skill/task registry, run, and audit-read events; Admin read; no export; 365 days. `TBD-BIZ-009` resolved.
- 2026-10-18 — **Scope:** six CAPs (`CAP-001`–`005` + `CAP-009`); skill/task authoring effective; search/file/cost/history/projects/templates/MCP registration/account administration excluded. `TBD-BIZ-011` resolved.
- 2026-10-18 — **States:** `STATE-003`/`STATE-005` effective; `STATE-004`/`STATE-006` reserved; `STATE-001`/`STATE-002` unchanged.
- 2026-10-18 — **MCP boundary:** interpreted “admin-only publishing” as skills and tasks, not MCP registration. This avoids inventing a secret-reference design. If MCP registration is intended, it requires a new decision, a secret-reference design, and a new change.
- 2026-10-18 — **Design follow-up:** `interaction_design.md` v0.1 is not updated. Its `PG-010`/`PG-012` No Permission states are superseded by the baseline, and there is no audit-read page. A design change is required before UI implementation; the data model records the persistence contract only.
- 2026-10-18 — **Remaining open:** `TBD-BIZ-014` (internal policy reference), `TBD-BIZ-005/006/007/008/010/012/013/015`, `TBD-INFRA-001/002/004/005/006/007/010/011`, `CONFLICT-002`.
- 2026-10-18 — **No new IDs.** No `TBD` or `CONFLICT` ID was created; no entity was invented.
- 2026-10-18 — **Supersession.** `CHG-011` remains the record of the earlier logical-only step; its gate amendment is superseded by this record. The current 04_data boundary cites `CHG-012`.
- 2026-10-18 — **Cross-ownership handoff.** `docs/00_setup/**` and `docs/13_changes/**` are Tech Lead scope; the registry and this record are written under the product owner’s explicit selection and the handoff recorded here.
- 2026-10-18 — **No commit.** The documents remain `Draft`; independent review and Tech Lead acceptance are still required.
