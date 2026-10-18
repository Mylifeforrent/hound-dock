# docs/01_product

Status: Draft
Originating stage: Stage 2 — Product Definition; the Stage 5 business-model asset is stored here per the Stage 5 task contract (see CONFLICT-002 in `docs/00_setup/open_items.md`).
Authoritative assets:
- `docs/01_product/prd.md` — Draft v0.1 (Stage 2). Owns the confirmed goal, users, MVP scope, user stories, functional and non-functional requirements, and acceptance criteria.
- `docs/01_product/business_model.md` — Draft v0.2 (Stage 5 business model, per the Stage 5 task contract; see CONFLICT-002; revised under CHG-007). Owns three objectives, the five-CAP MVP and 31 exclusions, six flows with step time limits, 18 entities with an ER diagram, a roles-by-entity-operation matrix, six state models, eight business rules with decision expressions, twelve NFRs with measurement points and time windows, traceability, challenges, and the candidate pool. It does not accept the PRD or decide open policy.
Allowed status: Draft / Reviewed / Frozen. `Frozen` requires explicit user approval recorded in the Frozen assets section below.
Update entry point: Docs Agent through a change record in `docs/13_changes/`; open decisions only via `docs/00_setup/open_items.md`.

## Purpose

Owns product intent: the goal, target users, MVP scope, explicit non-goals, and acceptance-level requirements.

## Boundaries

- MUST NOT contain architecture, API contracts, data schemas, UI specifications, or source code.
- Goal or scope changes MUST create a new PRD version and a change record; they MUST NOT silently edit the accepted scope.

## Frozen assets

None.
