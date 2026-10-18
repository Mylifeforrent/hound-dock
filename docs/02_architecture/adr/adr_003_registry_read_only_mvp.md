# ADR-003 — The three registries are read-only in the MVP

Status: Draft
Decision status: Proposed architecture baseline
Date: 2026-10-18
Owner: Lead architecture agent for the Docs Agent
Refs: CAP-002; CAP-003; CAP-004; BR-003; BR-004; BR-005; ROLE-001; TBD-BIZ-004; FLOW-004; FLOW-005; FLOW-006
Supersedes: none

## Context

`CAP-002`, `CAP-003`, and `CAP-004` confirm a skill registry, an MCP registry, and task definitions with manual runs. `BR-003`, `BR-004`, and `BR-005` make the registry record the authority for what may be listed, resolved, or run.

`TBD-BIZ-004` is open. ROLE-001 has no create, publish, register, or allowlist permission; ROLE-002 and ROLE-003 are proposed and denied in every effective cell. No confirmed person can populate the registries. The confirmed MVP is therefore not operable end to end.

The architecture must not solve a product-authority gap by inventing an administrator, an implicit author, or a hidden seed API.

## Decision

1. The three registries are **read-only** in the MVP. The architecture provides list/read projections and resolution by business key.
2. There is no create, edit, publish, deprecate, register, test, allowlist, or retire command in the MVP.
3. An empty registry is a valid state, not an error.
4. There is no hidden admin route, no seed endpoint, no implicit author role, and no "first user becomes Admin" rule.
5. The authoring/registration flows (`FLOW-004`–`006`) are reserved extension points. The architecture may name where they would attach, but it does not build them.
6. A record that is absent is reported as an unrecorded reference, not as an empty object or a create form.

## Consequences

### Positive

- The architecture matches the effective matrix and does not fabricate authority.
- The read surfaces remain useful for records that already exist.
- A future authority decision can add commands behind a clear boundary instead of unwinding a hidden admin path.

### Cost and limits

- The confirmed MVP cannot be populated or demonstrated end to end under the current grants. This is a blocker, not a design defect.
- Acceptance for `CAP-002`/`003`/`004` can only use the "given a recorded entry" form.
- Operational seeding may be needed to exercise the system, but it is not a product capability and is not designed here.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Bootstrap an Admin | Resolves `TBD-BIZ-004` by assumption; no confirmed grant exists |
| Add a deployment-time seed command | Creates a second, unaudited authority path; the product decision is still missing |
| Treat ROLE-001 as an author | Contradicts the effective matrix, where `Skill.publish` and registration are `denied` |
| Hide the empty state with sample data | Fakes capability and violates the no-invention rule |

## What this ADR does not decide

- Who may create, publish, register, or allowlist (`TBD-BIZ-004`).
- Whether a future Author role exists (`ROLE-003` is proposed).
- The authoring workflow, validation rules, or publication review.
- How an operator prepares records out of band.

## Revisit trigger

`TBD-BIZ-004` resolves with a confirmed authority model; `FLOW-004`–`006` become effective.
