# docs/05_api

Status: Draft
Originating stage: Stage 6 — API Design
Authoritative assets:
- `api_interface_spec.md` — `Draft` v0.1 API contract: the 15 effective operations derived from the architecture interface principles and the interaction design; no implementation.

This folder owns API contracts, versioning, error model, and request/response schemas.
Allowed status: Draft / Reviewed / Frozen. `Frozen` requires explicit user approval recorded in the Frozen assets section below.
Update entry point: Docs Agent through a change record in `docs/13_changes/`; open decisions only via `docs/00_setup/open_items.md`.

## Purpose

Owns API contracts: endpoints, request/response schemas, versioning, error model, and authentication expectations.

## Boundaries

- MUST NOT implement endpoints or contain application code.
- MUST NOT be treated as a frozen contract until its `Status:` is `Frozen` and the backend acceptance criteria reference it.

## Frozen assets

None.
