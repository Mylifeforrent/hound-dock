# docs/04_data

Status: Draft
Originating stage: Stage 5 — Data Design
Authoritative assets:
- `docs/04_data/data_model_spec.md` — Draft logical data model v0.2 (CHG-012).
- `docs/04_data/README.md` — this folder contract.
This folder owns data models, schemas, retention, and migration strategy; physical design is a separate authorized change.
Allowed status: Draft / Reviewed / Frozen. `Frozen` requires explicit user approval recorded in the Frozen assets section below.
Update entry point: Docs Agent through a change record in `docs/13_changes/`; open decisions only via `docs/00_setup/open_items.md`.

## Purpose

Owns data design: entities, relationships, schemas, retention, and migration strategy.

## Boundaries

- `TBD-BIZ-003` (data sensitivity) and `TBD-INFRA-003` (data store) are resolved by the enterprise-internal baseline in `CHG-012` and `docs/01_product/business_model.md` Appendix B. Logical design and PostgreSQL physical design may proceed.
- Physical DDL, storage migration code, and retention jobs belong to a separate physical-design change; this folder MUST NOT contain them until that change is authorized.
- MUST NOT contain production data, real user PII, credentials, or secret values. Highly Sensitive data is prohibited in the MVP.
- MUST NOT resolve or redefine a `TBD-*` or `CONFLICT-*`; references only, via `docs/00_setup/open_items.md`.
- Data classification is `Internal`/`Sensitive` per business model Appendix B; `Public` is unused and `Highly Sensitive` is prohibited.

## Document map

| File | Purpose | Status |
|---|---|---|
| `data_model_spec.md` | Logical data model v0.2: 13 logical tables, 18/18 entity mapping, keys, constraints, index candidates, effective STATE-001/002/003/005, lifecycle, classification/retention, audit, migration requirements, traceability | Draft |

## Frozen assets

None.
