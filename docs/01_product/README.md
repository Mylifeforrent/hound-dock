# docs/01_product

Status: Draft
Originating stage: Stage 2 — Product Definition; the Stage 5 business-model asset is stored here per the Stage 5 task contract (see CONFLICT-002 in `docs/00_setup/open_items.md`).
Authoritative assets:
- `docs/01_product/prd.md` — Draft v0.2 (Stage 2; revised under CHG-014). Owns the confirmed goal, users, MVP scope, objectives, capability boundary, flow-and-page spine, nine-state coverage, permission quote, AC↔API↔PG linkage, 57 acceptance criteria, NFR references, and acceptance status.
- `docs/01_product/business_model.md` — Draft v0.3 (Stage 5 business model, per the Stage 5 task contract; see CONFLICT-002; revised under CHG-007 and CHG-012). Owns three objectives, the six-CAP scope (CAP-001 to CAP-005 plus CAP-009, with CAP-009 blocked on its surface) and 30 exclusions, six flows with step time limits, 18 entities with an ER diagram, a roles-by-entity-operation matrix, six state models, eight business rules with decision expressions, twelve NFRs with measurement points and time windows, traceability, challenges, the candidate pool, and Appendix B's enterprise-internal baseline.
Allowed status: Draft / Reviewed / Frozen. `Frozen` requires explicit user approval recorded in the Frozen assets section below.
Update entry point: Docs Agent through a change record in `docs/13_changes/`; open decisions only via `docs/00_setup/open_items.md`.

## Purpose

Owns product intent: the goal, target users, MVP scope, explicit non-goals, and acceptance-level requirements.

## Boundaries

- MUST NOT contain architecture, API contracts, data schemas, UI specifications, or source code.
- Goal or scope changes MUST create a new PRD version and a change record; they MUST NOT silently edit the accepted scope.

## Frozen assets

None.
