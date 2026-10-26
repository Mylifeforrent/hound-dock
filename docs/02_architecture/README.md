# docs/02_architecture

Status: Draft
Originating stage: Stage 3 — Architecture
Authoritative assets:
- `docs/02_architecture/architecture.md` — the single integrated architecture draft.
- `docs/02_architecture/00_research_and_input_traceability.md` — input trace, official MCP research, and unregistered gaps.
- `docs/02_architecture/01_domain_and_service_architecture.md` — modules, domain model, effective states, commands and failure recovery.
- `docs/02_architecture/02_api_workflow_and_review.md` — interface boundary, error classes, permission points, sync/async, nine-state mapping.
- `docs/02_architecture/03_security_reliability_and_operations.md` — trust boundaries, security/data boundaries, reliability, observability, operations.
- `docs/02_architecture/04_architecture_review.md` — independent architecture review.
- `docs/02_architecture/05_enterprise_internal_baseline.md` — authoritative supplement for the enterprise-internal baseline (CHG-012): Admin skill/task authoring, audit, STATE-003/005 effective, PostgreSQL, internal gateway.
- `docs/02_architecture/06_frontend_architecture.md` — frontend technical architecture: routes, state, API client, rendering and accessibility obligations (CHG-028).
- `docs/02_architecture/07_backend_technical_design.md` — backend implementation design translating the resolved identity/session, idempotency, execution, and NFR decisions (CHG-028).
- `docs/02_architecture/08_frontend_backend_boundary.md` — the single frontend/backend integration boundary, consolidated by reference (CHG-028).
- `docs/02_architecture/09_core_interaction_chains.md` — the three confirmed core flows walked end to end (prototype behavior → frontend state → API call → backend modules → outcome), by reference (CHG-029).
- `docs/02_architecture/adr/README.md` and `adr_001_*` … `adr_005_*` — architecture decision records.
Allowed status: Draft / Reviewed / Frozen. `Frozen` requires explicit user approval recorded in the Frozen assets section below.
Update entry point: Docs Agent through a change record in `docs/13_changes/`; open decisions only via `docs/00_setup/open_items.md`.

## Purpose

Owns architecture: system structure, component responsibilities, technology decisions as ADRs, and cross-cutting constraints.

## Boundaries

- MUST NOT select a frontend or backend stack before TBD-INFRA-001 and TBD-INFRA-002 are resolved.
- MUST NOT contain implementation code, API request/response schemas, database schemas, migrations, deployment commands, or UI specifications.
- MUST NOT resolve a `TBD-*` or `CONFLICT-*` entry, or promote `FLOW-004`–`006` / `STATE-003`–`006` to effective behavior, except where a recorded product-owner decision and change record (`CHG-012`) explicitly does so in `05_enterprise_internal_baseline.md`. The supplement records the architecture impact; it does not create the decision.
- MUST NOT state a retention period, encryption choice, PII classification, capacity target, availability target, or compliance conclusion while `TBD-BIZ-003`, `TBD-BIZ-008`, and `TBD-BIZ-014` are open, except by reference to `business_model.md` Appendix B and `CHG-012`.

## Document map

| File | Purpose | Status |
|---|---|---|
| `architecture.md` | Integrated architecture draft; the entry point for reviewers | Draft |
| `00_research_and_input_traceability.md` | Source register, input trace, MCP research, gaps | Draft |
| `01_domain_and_service_architecture.md` | Domain and service architecture | Draft |
| `02_api_workflow_and_review.md` | API boundary, workflow and state mapping | Draft |
| `03_security_reliability_and_operations.md` | Security, reliability and operations | Draft |
| `04_architecture_review.md` | Independent review of the set | Draft |
| `05_enterprise_internal_baseline.md` | Enterprise-internal architecture supplement (CHG-012) | Draft |
| `06_frontend_architecture.md` | Frontend technical architecture (CHG-028) | Draft |
| `07_backend_technical_design.md` | Backend technical design (CHG-028) | Draft |
| `08_frontend_backend_boundary.md` | Frontend–backend integration boundary (CHG-028) | Draft |
| `09_core_interaction_chains.md` | Core interaction chains, end to end (CHG-029) | Draft |
| `adr/` | Decision records for high-cost-to-reverse choices | Draft |

## Naming note

RULE-001 permits only lower-case `snake_case` documentation file names (or `README.md`). The stage request used hyphenated names; this folder uses the RULE-001-compliant equivalents and records the mapping in `CHG-010`. ADR files use `adr_nnn_<slug>.md`.

## Frozen assets

None.
