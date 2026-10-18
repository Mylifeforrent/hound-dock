# CHG-013 — API interface contract

Status: Draft
Complexity: Complex
Refs: TBD-BIZ-003, TBD-BIZ-004, TBD-BIZ-005, TBD-BIZ-006, TBD-BIZ-007, TBD-BIZ-008, TBD-BIZ-009, TBD-BIZ-010, TBD-BIZ-011, TBD-BIZ-012, TBD-BIZ-013, TBD-BIZ-014, TBD-BIZ-015; TBD-INFRA-001, TBD-INFRA-002, TBD-INFRA-003, TBD-INFRA-004, TBD-INFRA-005, TBD-INFRA-006, TBD-INFRA-007, TBD-INFRA-009, TBD-INFRA-010, TBD-INFRA-011; CONFLICT-001, CONFLICT-002
Owner: Docs Agent — API contract scope for `docs/05_api/**`; change record filed under the recorded Tech Lead handoff for `docs/13_changes/**` (the Tech Lead owns that path per AGENTS.md §3, and the user's task explicitly requested the change record in the same batch).

## Plan

- **Trigger.** The user's Stage 6 task contract asks for the API contract only: `docs/05_api/api_interface_spec.md`, `Status: Draft`, with version, date, input provenance, a same-batch `CHG`, and a closing “Conflicts and gaps” section. No implementation code, no new directory, and no resolution of a `TBD`/`CONFLICT`.
- **Approach.**
  1. Read inputs in the stated precedence order: `02_api_workflow_and_review.md`, `interaction_design.md` §2, `architecture.md` + `05_enterprise_internal_baseline.md`, `data_model_spec.md`, `business_model.md` §6.2.
  2. Enumerate the complete must-call set from `interaction_design.md` §2.2 and the principle-level surfaces from `02_api_workflow_and_review.md` §5.
  3. Derive 15 endpoints one-to-one from those 15 surfaces; keep append-message and request-reply separate so acceptance remains confirmable independently of completion (`02 §5`).
  4. Use the data model for field names, logical types, state vocabularies, and classification; trim owner/account, credential, secret, tool-name, dependency, step-parameter, lifecycle, and audit fields that no effective page renders.
  5. Define 12 unique codes: 11 in `4xxxx`/`5xxxx` ranges covering `ERR-01`–`ERR-07`, plus `42901` as a transport control outside the seven-class taxonomy.
  6. Define auth per endpoint against the `§6.2` ROLE-001 row, default deny, own-only query scoping, and non-disclosing `40401`.
  7. Define the `Idempotency-Key` contract, the no-paging disposition, the fixed list order, and proposed rate limits marked `[PROPOSED: TBD-BIZ-008]`.
  8. Record the baseline-versus-inputs conflict, the stale design, the data-model tensions, and every unsourced operation in §15 of the spec.
- **Affected paths (write set).**
  - `docs/05_api/api_interface_spec.md` — new contract.
  - `docs/05_api/README.md` — authoritative asset list.
  - `docs/13_changes/CHG-013-api-interface-contract.md` — this record.
  - `docs/13_changes/README.md` — index entry.
- **Read-only paths.** `docs/00_setup/**`, `docs/01_product/**`, `docs/02_architecture/**`, `docs/03_design/**`, `docs/04_data/**`, `docs/06_development/**`–`docs/12_reviews/**`, `frontend/**`, `backend/**`, root governance. No path outside the declared write set is modified.
- **Risks and mitigations.**
  1. **Adopting the baseline silently.** Mitigation: derive only inputs 1–2; record `CF-01`–`CF-03` and `G-01`–`G-04` in the closing section; add no authoring/audit/all-runs endpoint.
  2. **Inventing capabilities.** Mitigation: every endpoint cites a source; every denied matrix cell has no endpoint; unsourced operations are gaps.
  3. **Sensitive-data leakage.** Mitigation: no account/owner/initiator fields, no credential/token/hash, no secret reference, no tool name, no step parameter, no audit field; §12 lists returned and never-returned fields.
  4. **Treating a TBD as settled.** Mitigation: FastAPI, rate values, the idempotency window, the input format, the policy reference, and PRD acceptance remain labelled and referenced; no ID is defined.
  5. **Framework binding.** Mitigation: HTTP is contract notation; §13 is a conditional, non-normative Pydantic naming appendix with no model code.
  6. **Ownership violation.** Mitigation: the write set is limited to `docs/05_api/**` and the change-record handoff; the record states the handoff.
  7. **Paging/sorting/filtering omission.** Mitigation: §10 explains the confirmed absence, defines a fixed order, and reserves a cursor extension without enabling it.
- **Verification plan.** Execute documentation checks for status lines, API/code/error counts, must-call coverage, unique error codes, class coverage, no application code, no secret/PII patterns, no new directory, no new `TBD`/`CONFLICT`, ID resolution, and the write set. Record commands, exit codes, and observed results below.

## Task Brief

- **Scope.** Produce the API interface contract for the effective MVP surface derived from inputs 1–2, and file the same-batch change record. No implementation, stack selection, schema/DDL, UI change, or baseline adoption.
- **Inputs.**
  1. `docs/02_architecture/02_api_workflow_and_review.md` v0.1 — interface boundary, seven error classes, enforcement points, effective surfaces.
  2. `docs/03_design/interaction_design.md` §2 v0.1 — page/action → matrix table and the must-call set.
  3. `docs/02_architecture/architecture.md` v0.1 and `docs/02_architecture/05_enterprise_internal_baseline.md` v0.1 — module boundaries, sync/async, audit context.
  4. `docs/04_data/data_model_spec.md` v0.2 — entities, fields, keys, state vocabularies, classification.
  5. `docs/01_product/business_model.md` §6.2 v0.3 — permission matrix (single policy source, ADR-001).
  6. `docs/00_setup/open_items.md` — registry references only.
- **Outputs.**
  1. `docs/05_api/api_interface_spec.md` — `Draft` v0.1 contract.
  2. `docs/05_api/README.md` — asset list update.
  3. `docs/13_changes/CHG-013-api-interface-contract.md` — this record.
  4. `docs/13_changes/README.md` — index entry.
- **Acceptance criteria.**
  1. Every “must call an API” action in input 2 maps to an `API-xxx`; every endpoint cites a document and section.
  2. Every endpoint's auth matches its matrix cell; own-only is enforced inside the query; unknown and non-owned are indistinguishable.
  3. Error codes are globally unique, segmented `4xxxx`/`5xxxx`, cover `ERR-01`–`ERR-07`, and each has semantics and a trigger.
  4. No response returns a credential, token, password hash, secret value, owner/initiator/account field, or another account's data.
  5. Idempotency, pagination/sorting/filtering, and rate limiting are addressed; every unconfirmed numeric value is labelled `[PROPOSED: TBD-BIZ-008]`.
  6. No `TBD` is answered and no `CONFLICT` is resolved; baseline-only operations are recorded as conflicts/gaps.
  7. The document is `Status: Draft`, has a version, date, and input provenance, and the conflicts/gaps section closes it.
  8. The change record contains Plan, Task Brief, executed Verification, Dependency audit, and Decision/conflict log.
- **Ownership.**
  - `docs/05_api/**` — Docs Agent scope; authored under this task.
  - `docs/13_changes/**` — Tech Lead scope; this record and the index entry are written under the user's explicit same-batch request and the handoff recorded in the header.
  - `docs/00_setup/**`, `docs/01_product/**`, `docs/02_architecture/**`, `docs/03_design/**`, `docs/04_data/**`, `docs/06_development/**`–`docs/12_reviews/**`, `frontend/**`, `backend/**`, root governance — read-only.
- **Non-goals.** Implementation, scaffold, dependency manifest, lockfile, migration, DDL, OpenAPI tooling, framework selection, UI redesign, baseline adoption, `TBD` resolution, merge, or independent review. The commit is the user's explicit follow-up instruction; it does not make the contract `Reviewed` or `Frozen`.

## Verification

Executed 2026-10-18 (Asia/Shanghai) on the working tree. Documentation-only change: no build, runtime, database, model call, MCP call, or network-dependent test was executed.

| # | Check | Command or method | Exit | Observed result |
|---|---|---|---|---|
| 1 | Status lines | `grep -n '^Status: Draft$' docs/05_api/api_interface_spec.md docs/05_api/README.md docs/13_changes/CHG-013-api-interface-contract.md` and `grep -n '^Status: Draft$' docs/13_changes/README.md` | 0 | All four documents carry `Status: Draft`; the contract's line is line 3 |
| 2 | API count and uniqueness | Python `re.findall(r'API-\d{3}')` over the contract; catalog rows matched with `^\| \`API-\d{3}\` \|` | 0 | 15 unique IDs, `API-001`–`API-015`; 15 catalog rows |
| 3 | Error-code count and uniqueness | Python `re.findall(r'\b(4\d{4}\|5\d{4})\b')` and §8.2 row parse | 0 | 12 unique codes; 12 rows in §8.2; no duplicate |
| 4 | Seven-class coverage | Python set of `ERR-0[1-7]` over §8.1/§8.2 | 0 | `ERR-01`–`ERR-07` all present; `42901` is `CONTROL`, not an eighth class |
| 5 | Must-call coverage | Parse the §5.2 table; count action rows and classify effective versus denied | 0 | 21 action rows covering the 18 §2.2 rows plus New chat; 11 effective rows map to 15 endpoints; 10 denied rows, of which row 15 is the same `API-014`/`API-015` non-disclosure path |
| 6 | No application code | `grep -nE '^```(python\|py\|javascript\|js\|typescript\|ts\|java\|go)([[:space:]]\|$)' docs/05_api/api_interface_spec.md` | 1 | No output; only `json` and `http` example fences. The Pydantic appendix contains tables, not model code |
| 7 | Secret/PII pattern scan | `grep -nEi 'password[[:space:]]*=\|Bearer [A-Za-z0-9]\|secret[[:space:]]*=\|api[_-]?key[[:space:]]*=\|@[a-z0-9.-]+\.(com\|net\|org)' docs/05_api/api_interface_spec.md` | 1 | No output; examples use `example.*`/`example-*`, `.invalid`, and `<redacted>` |
| 8 | New directory check | `find docs -mindepth 1 -maxdepth 1 -type d` then `sort`; `git status --short` | 0 | No new `docs/` directory; only the four declared files appear |
| 9 | New `TBD`/`CONFLICT` IDs | Python extract all `TBD-BIZ-*`, `TBD-INFRA-*`, and `CONFLICT-*` IDs from the contract, compare to `docs/00_setup/open_items.md` | 0 | Every ID exists in the registry; no new ID is defined; `CF-*`/`G-*` are document-local |
| 10 | Closing section | `grep -n '^## 15. Conflicts and gaps'` and `tail -n 1` | 0 | §15 is the final section; the document ends with the “End of contract” line, after the conflicts/gaps register |
| 11 | Whitespace | `git diff --check` plus a Python trailing-whitespace/tab scan over the two new files | 0 | No whitespace errors in tracked changes; no trailing whitespace or tabs in the new files |
| 12 | Write set | `git status --short` | 0 | Exactly four paths: `docs/05_api/api_interface_spec.md`, `docs/05_api/README.md`, `docs/13_changes/CHG-013-api-interface-contract.md`, `docs/13_changes/README.md` |

**Verification limits.** No independent Verifier review exists yet; RULE-005 remains pending. The contract is `Draft` and is not a frozen acceptance. The HTTP binding was not exercised, no FastAPI/Pydantic code exists, no store or migration was touched, and no rate-limit or idempotency behavior was measured. The baseline-versus-inputs conflict is recorded, not resolved. Mermaid was not used in the contract.

**AI data classification:** No secrets, production data, or real PII were used. All examples are synthetic (`example.*`/`example-*`, `.invalid`, `<redacted>`). Inputs were repository `Draft` documents; no dataset or user data was shared.

**Reviewer:** Pending independent Verifier review. This record is not merge-ready until `docs/12_reviews/CHG-013-review.md` exists and the conflict disposition is accepted.

## Dependency audit

None — no dependency, package manifest, lockfile, external runtime, or network call is added. Pydantic is discussed only as a conditional, non-normative appendix; it is not introduced or approved.

## Decision and conflict log

- 2026-10-18 — **Scope decision:** derive APIs only from inputs 1–2, as the task requires. The enterprise-internal baseline is read for module/sync/async/audit context and recorded as a conflict source, not as an API source.
- 2026-10-18 — **Endpoint count:** 15 endpoints map one-to-one to the 15 principle-level surfaces in `02 §5`; append-message and request-reply remain separate so message acceptance is confirmable independently of reply completion.
- 2026-10-18 — **Baseline divergence:** `CF-01` records that Appendix B.3/B.4 and `05_enterprise_internal_baseline.md` make Admin skill/task publication, audit read, and all-runs read effective, while inputs 1–2 deny them. No such endpoint is added; a higher-authority update and a new `CHG` are required.
- 2026-10-18 — **Data-model trim:** `CF-02`/`CF-05` record that `version_state`, `registry_state`, `declared_tool_dependencies`, `target_tool_name`, and `step_parameters` are stored but not projected. They are used server-side or withheld, not returned.
- 2026-10-18 — **Paging:** `CF-06` records that pagination/sorting/filtering are requested by the task contract but unconfirmed by inputs 1–2. §10 defines no paging/sort/filter parameters; a cursor extension is reserved but not enabled.
- 2026-10-18 — **Idempotency:** `CF-07` records that no dedup key/window is confirmed. §9 defines a contract-level `Idempotency-Key`; the 24-hour retention window is proposed pending `TBD-BIZ-008`. No reconciliation query is invented.
- 2026-10-18 — **Session carriage:** `CF-08` records that cookie/header mechanics and session termination are undecided. §4.1 uses an `HttpOnly` cookie and no body token; no session endpoint exists.
- 2026-10-18 — **Rate limits:** `CF-13` records that all values are unconfirmed. §11 labels every value `[PROPOSED: TBD-BIZ-008]`.
- 2026-10-18 — **No new IDs:** No `TBD` or `CONFLICT` ID is created; `CF-*` and `G-*` are document-local labels. No `TBD` is answered.
- 2026-10-18 — **Cross-ownership handoff:** `docs/13_changes/**` is Tech Lead scope. This record and the index entry are written under the user's explicit same-batch request; the header records the handoff.
- 2026-10-18 — **Commit:** prepared on branch `docs/api-interface-contract` with `Refs: CHG-013`; the documents remain `Draft`; independent review and Tech Lead acceptance are still required before merge.
