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
