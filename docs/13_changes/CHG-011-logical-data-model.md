# CHG-011 — Logical data model (Stage 5 Data Design)

Status: Draft
Complexity: Complex
Refs: TBD-BIZ-003, TBD-BIZ-004, TBD-BIZ-005, TBD-BIZ-007, TBD-BIZ-008, TBD-BIZ-009, TBD-BIZ-010, TBD-BIZ-011, TBD-BIZ-012, TBD-BIZ-013, TBD-BIZ-014, TBD-BIZ-015; TBD-INFRA-003, TBD-INFRA-004, TBD-INFRA-006, TBD-INFRA-007, TBD-INFRA-009, TBD-INFRA-010, TBD-INFRA-011; CONFLICT-001, CONFLICT-002
Owner: Data architect — Docs Agent scope for `docs/04_data/**`, with a recorded handoff to the Tech Lead scope for `docs/13_changes/**` under the user's explicit “fix the issue and continue” instruction of 2026-10-18.

## Plan

- **Trigger and approval.** On 2026-10-18 the first attempt at this task was stopped because `docs/04_data/README.md` said “MUST NOT begin until TBD-BIZ-003 and TBD-INFRA-003 are resolved,” and both were `Open`. The product owner then instructed **“fix the issue and continue.”** That instruction is recorded here as explicit authorization for a **narrow logical-only start**. It does not resolve, narrow, or answer either TBD, and it does not authorize physical design, data handling, an external provider call, or implementation.
- **What “fix the issue” means in this record.** The folder gate is amended rather than ignored: `docs/04_data/README.md` now distinguishes a logical start under this record from physical design, which remains blocked. The amendment is limited to the logical model, data flows, boundaries, and open items. If this record is rejected, the original gate stands and the specification must be withdrawn.
- **Approach.** Produce a logical data model for the confirmed MVP with:
  - 18/18 entity adjudication and 11 logical tables;
  - three persistence classes: effective persisted (P1), structurally required minimal (P2), reserved/not persisted (P3);
  - only `STATE-001` and `STATE-002` effective; `STATE-003`–`STATE-006` reserved with no state fields;
  - field-level `[TBD-BIZ-003]` labels for every suspected-sensitive field, with no classification level;
  - `[P]` labels for temporal/audit fields and no audit table (`TBD-BIZ-009`);
  - migration constraints, order, rollback, and validation requirements only (`TBD-INFRA-003`);
  - a page-field disposition appendix so a page field is not promoted to a column by default;
  - traceability for data and non-data rules, and `[to be registered]` for gaps with no existing ID.
- **What is deliberately not decided.** No database engine, store, type mapping, index implementation, transaction mechanism, migration tool, command, retention period, deletion schedule, encryption algorithm, masking rule, tokenization scheme, key management, classification level, PII conclusion, residency conclusion, audit event list, or API schema. No new entity and no new `TBD`/`CONFLICT` ID.
- **Affected paths (write set).**
  - `docs/04_data/data_model_spec.md` — new logical data model.
  - `docs/04_data/README.md` — authoritative-assets entry, boundary amendment, and document map.
  - `docs/13_changes/CHG-011-logical-data-model.md` — this record.
  - `docs/13_changes/README.md` — change-index entry.
- **Read-only paths.** `docs/00_setup/**` (including `open_items.md`), `docs/01_product/**`, `docs/02_architecture/**`, `docs/03_design/**`, `docs/05_api/**` through `docs/11_quality/**`, `docs/12_reviews/**`, `frontend/**`, and `backend/**`. No new top-level directory is created.
- **Risks and mitigations.**
  1. **A `TBD` becomes a settled fact.** Mitigation: `TBD-BIZ-003` is only a field label; `TBD-INFRA-003` is only an implementation marker; `TBD-BIZ-009` is only an audit marker. No threshold, period, algorithm, level, or provider is written as a value.
  2. **A page field becomes a column.** Mitigation: Appendix A lists every page field examined; title, pin, pending status, connection type, timeout, tool count, owner display, credential indicator, and draft fields are explicitly not columns.
  3. **Proposed entities are added as full tables.** Mitigation: `ENT-007`, `ENT-012`, and `ENT-013` are P2 minimal records only because `BR-005`, `FLOW-003`, and `STATE-002` need the reference; no proposed lifecycle field is added. The remaining proposed entities are P3 and have no table.
  4. **Physical design creep.** Mitigation: logical type vocabulary only; no SQL, DDL, engine, or index syntax; §10 states requirements, not code.
  5. **The gate amendment looks like a silent override.** Mitigation: the amendment is recorded in both the folder README and this record, limited to logical design, and explicitly does not resolve either TBD.
  6. **Cross-ownership write.** Mitigation: this record states the `docs/04_data` (Docs Agent) and `docs/13_changes` (Tech Lead) handoff under the user’s instruction; no root governance or registry file is changed.
  7. **Migration code is written.** Mitigation: §10 contains order, constraints, rollback, and validation only; implementation remains `TBD-INFRA-003`.
  8. **Retention, encryption, or classification is invented.** Mitigation: §6.4, §7.1, and §7.3 repeat the gates and use `[TBD-BIZ-003]` only.
- **Verification plan.** Check exact `Status: Draft`; check RULE-001 file names; count 18 entity rows, 11 table-inventory rows, 11 field tables; resolve every `TBD`/`CONFLICT` reference against `open_items.md`; scan for DDL/store terms; scan for classification-level table cells; inspect every reserved-state mention; inspect page-field terms; count Mermaid fences and state that rendering is not executed; record the write set. Evidence goes in `## Verification`.

## Task Brief

- **Scope.** A logical data model specification for the confirmed hound-dock MVP, plus the recorded gate amendment and change record. Documentation only.
- **Inputs.**
  - `docs/01_product/business_model.md` v0.2 (`Draft`) — sole business authority; effective items only.
  - `docs/02_architecture/architecture.md` and `docs/02_architecture/01_domain_and_service_architecture.md` (`Draft`) — modules, entity classes, `STATE-001`/`STATE-002`, commands, queries, recorded tensions.
  - `docs/03_design/interaction_design.md` v0.1 (`Draft`) — page fields and page states only; not a persistence authority.
  - `docs/00_setup/open_items.md` — registry references only.
  - `docs/04_data/README.md` and `docs/08_security/README.md` — boundaries and gates.
  - `docs/00_setup/project_rules.md` — RULE-001, RULE-005, RULE-011, RULE-013, RULE-014, RULE-018, RULE-019, RULE-020.
- **Outputs.**
  1. `docs/04_data/data_model_spec.md` — logical model, ER diagram, table inventory, field definitions, keys, constraints, index candidates, state fields, lifecycle, classification gate, audit fields, migration requirements, traceability, open items, self-check, page-field appendix.
  2. `docs/04_data/README.md` — authoritative-assets entry, boundary amendment, and document map.
  3. `docs/13_changes/CHG-011-logical-data-model.md` — this record.
  4. `docs/13_changes/README.md` — index entry.
- **Acceptance criteria.**
  1. Every document is `Status: Draft` and every path complies with RULE-001.
  2. 18/18 entities have a logical table or an explicit “not persisted” explanation.
  3. Exactly 11 logical tables exist; 7 entities are not persisted; no new entity is introduced.
  4. Only `STATE-001` and `STATE-002` are effective; `STATE-003`–`STATE-006` are reserved with no state field.
  5. Every sensitive or suspected-sensitive field carries `[TBD-BIZ-003]`; no Public/Internal/Sensitive/Highly Sensitive level is assigned.
  6. No database engine, store, DDL, SQL, migration code, API schema, real PII, or secret appears.
  7. Temporal fields are `[P]`; the audit obligation is `TBD-BIZ-009`; logs are not audit; no audit table exists.
  8. Migration constraints, order, rollback, and validation are stated; implementation is `TBD-INFRA-003`.
  9. No new `TBD` or `CONFLICT` ID is created; gaps use `[to be registered]`.
  10. The folder gate amendment is recorded, limited, and does not resolve either TBD.
  11. Verification is executed with commands, exit codes, and observed results.
- **Ownership.**
  - `docs/04_data/**` — Docs Agent scope; written by the data architect under the user’s task.
  - `docs/13_changes/**` — Tech Lead scope; written under the handoff recorded here and the user’s explicit instruction.
  - `docs/00_setup/**`, root governance, `docs/01_product/**`, `docs/02_architecture/**`, `docs/03_design/**`, `docs/05_api/**`–`docs/11_quality/**`, `docs/12_reviews/**`, `frontend/**`, `backend/**` — out of scope; no writes.
- **Non-goals.** Physical schema, store selection, type mapping, index implementation, migration code, retention, encryption, masking, classification levels, audit implementation, API contract, implementation, commit, or merge.

## Verification

Executed 2026-10-18 (Asia/Shanghai) on the working tree. Documentation-only change: no build, runtime, store, model call, MCP call, or network-dependent test was executed.

| # | Check | Command / method | Exit | Observed result |
|---|---|---|---|---|
| 1 | Status lines | `grep -n '^Status: Draft$' docs/04_data/data_model_spec.md docs/04_data/README.md docs/13_changes/CHG-011-logical-data-model.md docs/13_changes/README.md` | 0 | Four matches, all line 3 |
| 2 | RULE-001 file names | `find docs/04_data -type f -name '*.md' \| grep -vE '/(README\|[a-z0-9_]+)\.md$'` | 1 | No output; no name violation |
| 3 | Entity coverage | Python extraction of `ENT-0nn` over `data_model_spec.md` | 0 | 18 unique IDs; missing `[]` |
| 4 | Table inventory | `awk` count of rows in §2.2 | 0 | 11 logical tables |
| 5 | Entity mapping | `awk` count of `**ENT-` rows in §2.3 | 0 | 18 mapping rows |
| 6 | Field-definition sections | `grep -cE '^### 4\.([2-9]\|1[0-2]) '` | 0 | 11 field tables (plus §4.1 conventions) |
| 7 | ID resolution | Python over all `TBD-`/`CONFLICT-` tokens, compared to `open_items.md` | 0 | 19 unique IDs; missing `[]`; no new-ID pattern |
| 8 | DDL / store scan | `grep -nEi 'CREATE TABLE\|ALTER TABLE\|CREATE INDEX\|DROP TABLE\|INSERT INTO\|SELECT \*\|VARCHAR\|TIMESTAMPTZ\|JSONB\|UUID\|postgres\|sqlite\|mysql\|mariadb\|mongodb\|redis\|CREATE TYPE' docs/04_data/data_model_spec.md` | 1 | No output; clean (spec only; the pattern text in this row is not DDL) |
| 9 | Classification-level table cells | `grep -nE '\| *(Public\|Internal\|Sensitive\|Highly Sensitive) *\|'` | 1 | No output; no field or table assigns a level |
| 10 | Reserved-state context | `grep -nE 'STATE-00[3-6]'` filtered for reserved/not-modelled/not-applicable context | 1 | Every reserved-state mention is in a reserved or non-applicable context; no reserved-state field |
| 11 | Page-field terms | `grep -nE 'title\|pin\|pending\|connection_type\|timeout\|tool_count\|display_name'` | 0 | All matches are in “not modelled”, “not persisted”, or Appendix A disposition rows; no such column is defined |
| 12 | Mermaid fences | `grep -c '^```mermaid'`; `grep -c '^```'` | 0 | 2 Mermaid blocks; 4 fences; balanced. Static syntax only; no renderer installed and no dependency added |
| 13 | Volume | `wc -l docs/04_data/data_model_spec.md` | 0 | 917 lines |
| 14 | Write set | `git status --short` | 0 | `M docs/04_data/README.md`; `M docs/13_changes/README.md`; `?? docs/04_data/data_model_spec.md`; `?? docs/13_changes/CHG-011-logical-data-model.md` |

**Verification limits.** The store, type system, index implementation, and migration tooling are unselected, so no physical or performance test can be executed. `TBD-BIZ-003` is open, so no classification, retention, encryption, or masking test exists. `TBD-BIZ-009` is open, so no audit test exists. The Mermaid diagrams were not rendered. No independent Verifier record exists; RULE-005 review remains pending, and `docs/12_reviews/CHG-011-review.md` is outside this task’s write scope. No commit was made.

**AI data classification:** No secrets, production data, or real PII were used. Inputs were repository `Draft` documents only; no dataset or user data was shared.

**Reviewer:** Pending independent Verifier review. This record is not merge-ready until `docs/12_reviews/CHG-011-review.md` exists and the gate amendment is accepted.

## Dependency audit

None — no dependency, package manifest, lockfile, external runtime, or network call is added. No Mermaid CLI or other tool was installed; the diagrams were statically checked only.

## Decision and conflict log

- 2026-10-18 — The first attempt was stopped because `TBD-BIZ-003` and `TBD-INFRA-003` were open and `docs/04_data/README.md` said the folder MUST NOT begin. The stop report cited the folder gate, `TBD-INFRA-003`’s “no data handling may begin” impact, `architecture.md` §18, and the dormant Docs Agent boundary.
- 2026-10-18 — The product owner instructed **“fix the issue and continue.”** This is treated as explicit authorization for a narrow logical-only start. It is not treated as a resolution of either TBD.
- 2026-10-18 — **Gate amendment.** `docs/04_data/README.md` is amended to permit a logical start only under this recorded authorization. Physical DDL, storage selection, retention, encryption/masking, and classification levels remain blocked. The amendment is limited to this logical model and is reversible by rejecting this record.
- 2026-10-18 — **P2 minimal records.** `skill_version`, `task_version`, and `task_step` are modelled as minimal structurally required records because `BR-005`, `FLOW-003`, and `STATE-002` need a version/step reference. No draft/published/retired/superseded/discarded field is added; their proposed lifecycles remain reserved. This follows `[ARCH: §5.1 and §5.5]`, not a new business rule.
- 2026-10-18 — **Not persisted by decision.** Run input values, skill-version content, MCP tool metadata, session state, credentials, artifacts, citations, audit events, role assignments, and model configuration are not tables. Each is explained in §2.4 or Appendix A and, where no existing ID covers the gap, marked `[to be registered]`.
- 2026-10-18 — **No new IDs.** No `TBD` or `CONFLICT` ID was created. `TBD-BIZ-003`, `TBD-INFRA-003`, `TBD-BIZ-009`, `TBD-BIZ-004`, `TBD-BIZ-007`, `TBD-BIZ-013`, `TBD-INFRA-009`, and the other referenced entries remain `Open` and are only referenced.
- 2026-10-18 — **CONFLICT-002 remains open.** The stage-map discrepancy is not resolved; no `docs/00_setup/README.md` change is made.
- 2026-10-18 — **Cross-ownership handoff.** `docs/04_data/**` is Docs Agent scope; `docs/13_changes/**` is Tech Lead scope. This record and the index update are written under the user’s explicit instruction and the handoff recorded in this log. No root governance, rules, or open-item registry file is changed.
- 2026-10-18 — **Index completion.** The change index now lists `CHG-010` (previously missing, as `CHG-010`’s decision log invited on the next index update) and `CHG-011`. No record content was changed.
- 2026-10-18 — **Verification executed; no commit.** The document remains `Draft`. RULE-005 independent review and the Tech Lead’s acceptance of the gate amendment are still required before any merge.
- 2026-10-18 — **Superseded in part by `CHG-012`.** The product owner selected the enterprise-internal baseline. `CHG-012` resolves `TBD-BIZ-003/004/009/011` and `TBD-INFRA-003/009`, promotes `STATE-003`/`STATE-005`, selects PostgreSQL, and replaces the logical-only gate amendment. This record remains the traceability record for the earlier logical-only step; its gate amendment and `[TBD-BIZ-003]` labels are superseded.
