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

The Complexity threshold and the review requirement are defined by RULE-018 and RULE-005; this folder MUST NOT redefine them.

## Numbering

`CHG-000` is the bootstrap record. Subsequent records are numbered sequentially and never reused. Commit trailers use `Refs: CHG-nnn`.

## Frozen assets

None.
