# docs/03_design

Status: Draft
Originating stage: Stage 4 — Design
Authoritative assets:
- `docs/03_design/prototype/` — clickable UI prototype (Draft; synthetic data only; throwaway design artifact).
- `docs/03_design/design_system.md` — visual language, layout, token architecture, and component rules for the prototype (Draft; CHG-005).
- `docs/03_design/interaction_design.md` — interaction architecture, FLOW-001 to FLOW-006 task flows, interaction rules, nine-state page matrix, and 1440px desktop layout (Draft). The sole business authority for this document is `docs/01_product/business_model.md` v0.2; it assigns only `PG-001` to `PG-012`, marks FLOW-004 to FLOW-006 as proposed and not effective, and references `TBD-BIZ` entries without redefining them.
Allowed status: Draft / Reviewed / Frozen. `Frozen` requires explicit user approval recorded in the Frozen assets section below.
Update entry point: Docs Agent through a change record in `docs/13_changes/`; open decisions only via `docs/00_setup/open_items.md`.

## Purpose

Owns UX and interface design: user flows, information architecture, interaction specifications, wireframes, and visual language.

## Boundaries

- MUST NOT define backend behavior, API contracts, or data models.
- MUST NOT contain production code. The prototype under `prototype/` is a throwaway design artifact and MUST NOT be promoted to `frontend/` unchanged.
- Synthetic mock data only; no real user data, PII, or secrets.
- Design tokens describe the prototype, not a confirmed production frontend stack (TBD-INFRA-001).
- Interaction design MUST NOT invent a capability, role, state, or field. It references the business model, assigns only page identifiers, and records an uncovered gap as “to be registered” for the Tech Lead rather than creating an identifier.
- The interaction design is desktop-only at a 1440px baseline and adopts the design-system breakpoints down to 960px; it does not design mobile or narrow layouts.

## Frozen assets

None.
