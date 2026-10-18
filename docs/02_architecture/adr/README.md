# Architecture decision records

Status: Draft
Originating stage: Stage 3 — Architecture
Scope: decisions that are expensive to reverse or that fix a boundary the rest of the architecture depends on. A reversible presentation, naming, or file-layout choice does not need an ADR.
Allowed status: `Draft` / `Reviewed` / `Frozen`; every ADR in this folder is `Draft` until the stage gate.

## Records

| ADR | Decision | Status | Revisit trigger |
|---|---|---|---|
| [ADR-001](adr_001_permission_matrix_single_source.md) | The business-model permission matrix is the single policy source; every decision is server-side, default-deny, and own-only at query scope | Draft | `TBD-BIZ-004`; `CONFLICT-001`; `CAP-031` |
| [ADR-002](adr_002_run_terminal_state_immutability.md) | Run and run-step terminal states are immutable; failure is visible; no automatic retry; a new run is the compensation | Draft | `TBD-BIZ-007`; `CAP-006`; `CAP-014` |
| [ADR-003](adr_003_registry_read_only_mvp.md) | The three registries are read-only in the MVP; authoring, publication, registration, and allowlisting are reserved and not implemented | Draft | `TBD-BIZ-004` resolved |
| [ADR-004](adr_004_no_mcp_runtime_no_hitl.md) | No MCP runtime and no HITL orchestration in the MVP; MCP material informs vocabulary and a future security boundary only | Draft | `FLOW-005` effective; `McpTool.invoke` granted; `CAP-014` effective |
| [ADR-005](adr_005_response_integrity_and_streaming_boundary.md) | A user message is retained on model failure; exactly one assistant message is appended on success; streaming is not an effective contract | Draft | `TBD-BIZ-011`; `TBD-INFRA-001/002` |

## Naming and status rules

- File names are lower-case `snake_case` with an `adr_` prefix, per RULE-001. The displayed ADR number is the stable identifier.
- Every ADR has a `Status:` line with exactly `Draft`, `Reviewed`, or `Frozen`. None is `Frozen`.
- An ADR states what it does **not** decide. No ADR selects a stack, a data store, a model provider, a transport, or an API schema.
- A superseded ADR is retained and marked `Superseded by ADR-nnn`; it is not deleted.

## Relationship to the open-item registry

An ADR is an architecture decision, not a product decision. It cannot resolve a `TBD-*` or `CONFLICT-*` entry. Where an ADR depends on an open item, the item is named in the ADR's context and revisit trigger. New open items are registered only in `docs/00_setup/open_items.md` by the Tech Lead.
