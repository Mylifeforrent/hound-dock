# docs/13_changes

Status: Draft
Originating stage: Stage 14 — Change Management (change records are opened from Stage 0 onward)
Authoritative assets:
- `docs/13_changes/README.md` — change-record contract.
- `docs/13_changes/CHG-000-stage-0-bootstrap.md` — Stage 0 repository bootstrap.
- `docs/13_changes/CHG-001-stage-2-prd.md` — Stage 2 product requirements document.
- `docs/13_changes/CHG-002-prototype-ui.md` — Stage 2 clickable UI prototype.
- `docs/13_changes/CHG-003-prototype-ia.md` — prototype IA revision: chat-first home and Manage entry.
- `docs/13_changes/CHG-004-prototype-ia-v2.md` — prototype IA v2: Tasks shortcut, history actions, expanded Manage.
- `docs/13_changes/CHG-005-prototype-visual-system.md` — prototype visual system v2: quiet-console layout, design tokens, light/dark themes, and accessibility.
- `docs/13_changes/CHG-006-business-model.md` — Stage 5 business model: confirmed core, candidate layer, traceability, new TBDs, and conflicts.
- `docs/13_changes/CHG-007-business-model-v0.2.md` — business model v0.2: acceptance-contract restructure, 3 objectives, 5 MVP CAPs, 31 exclusions, permission matrix, state diagrams, BR decision expressions, NFR measurement points, and conflict closing conditions.
- `docs/13_changes/CHG-008-prototype-interaction-build.md` — prototype rebuild: effective PG-001 to PG-009, direct-URL-only No Permission for PG-010 to PG-012, FLOW-001 to FLOW-003, nine-state coverage, and §5.3 discard confirmation.
- `docs/13_changes/CHG-009-prototype-porcelain-blue.md` — selected Porcelain Blue palette: near-white rail, light blue selection, blue action, light-rail active-state correction, and refreshed captures.
- `docs/13_changes/CHG-010-backend-architecture.md` — Stage 3 backend architecture: modules, domain model, STATE-001/002, API boundary, security/reliability/operations, review, and ADRs.
- `docs/13_changes/CHG-011-logical-data-model.md` — Stage 5 logical data model: 11 logical tables, 18/18 entity mapping, STATE-001/002 only, classification/audit/migration gates, and the recorded 04_data start-gate amendment (superseded in part by CHG-012).
- `docs/13_changes/CHG-012-enterprise-internal-baseline.md` — enterprise-internal baseline: Internal/Sensitive classification, 90/180/365 retention, Admin skill/task publication, audit, STATE-003/005 effective, PostgreSQL, internal gateway, and the 13-table data model.
- `docs/13_changes/CHG-013-api-interface-contract.md` — Stage 6 API contract: 15 effective operations, schemas, 11 segmented ERR codes plus one control code covering the seven classes, auth/matrix markings, idempotency, paging disposition, proposed rate limits, and the baseline-versus-inputs conflict register.
- `docs/13_changes/CHG-014-prd-v0.2.md` — PRD v0.2: OBJ-001 to OBJ-003, CAP-001 to CAP-005 with CAP-009 separate and blocked, FLOW-001 to FLOW-003 spine across PG-001 to PG-009, nine-state coverage, the §2.2 permission quote, AC↔API↔PG coverage, and the removal of US-02, US-07, US-09, and the old §13.
- `docs/13_changes/CHG-024-stage-7-backend-decisions-and-toolchain.md` — user decisions on `TBD-INFRA-012` (PBKDF2-HMAC-SHA256), `TBD-INFRA-013` (in-process session), and `TBD-INFRA-014` (idempotency support store); backend Stage 7 toolchain baseline with verified `uv sync` / `uv run pytest`. (Note: the asset list above lags — CHG-015 through CHG-023 predate this entry and are not listed here.)
- `docs/13_changes/CHG-025-task-execution-model-prompt-only.md` — `TBD-BIZ-007` resolved to option (a): prompt-only skills, linear steps limited to skill invocation, no MCP/tool execution or retry; PRD option-(b) proposal superseded.
- `docs/13_changes/CHG-026-nfr-thresholds-idempotency-window-rate-limits.md` — `TBD-BIZ-008` resolved: performance thresholds confirmed (`NFR-001` restated non-streaming), Stage 1 host as measurement environment, 24-hour idempotency window, proposed rate-limit set confirmed; capacity/availability best-effort.
- `docs/13_changes/CHG-027-backend-code-removal.md` — owner-directed removal of `backend/app/` and `backend/tests/`; toolchain baseline (`pyproject.toml`, `uv.lock`, `.python-version`) retained.
- `docs/13_changes/CHG-028-architecture-supplements.md` — three by-reference supplements in `docs/02_architecture/`: frontend technical architecture (06), backend technical design (07), frontend–backend boundary (08); no new identifiers.
- `docs/13_changes/CHG-029-core-interaction-chains.md` — `docs/02_architecture/09_core_interaction_chains.md`: FLOW-001/002/003 walked end to end (prototype trigger → frontend state → API call → backend chain → outcome), by reference.
Allowed status: Draft / Reviewed / Frozen. A merged record MUST be `Reviewed` before the next change lands; `CHG-000` remains `Draft` until the user's Stage 0 sign-off. `Frozen` is reserved for a record locked at a stage gate. Records MUST NOT be deleted; corrections MUST be appended.
Update entry point: Tech Lead opens every change record; other owners supply evidence through the Task Brief handoff and do not edit this folder.

## Purpose

Owns traceability: every change is described by one sequential change record containing its Plan, Task Brief, executed verification, dependency audit, and decision log.

## Change record contract

Every `CHG-nnn-<kebab-slug>.md` file MUST contain:

1. Header fields: `Status:`, `Complexity: Simple|Complex`, `Refs:` (TBD/CONFLICT IDs), `Owner:`.
2. `## Plan` — required when `Complexity: Complex`; states approach, affected paths, risks, and the verification plan.
3. `## Task Brief` — scope, inputs, outputs, acceptance criteria, and path ownership.
4. `## Verification` — commands, exit codes, observed results, and the reviewer. Required for every change.
5. `## Dependency audit` — required when any dependency is added or upgraded; otherwise state `None`.
6. `## Decision and conflict log` — decisions made, TBD/CONFLICT references, and approvals.

**User-supplied work is pre-approved** under `RULE-021` and does not require a `CHG`. A `CHG` for it is optional and, if present, is advisory.

The Complexity threshold and the review requirement are defined by RULE-018 and RULE-005; this folder MUST NOT redefine them.

## Numbering

`CHG-000` is the bootstrap record. Subsequent records are numbered sequentially and never reused. Commit trailers use `Refs: CHG-nnn`.

## Frozen assets

None.
