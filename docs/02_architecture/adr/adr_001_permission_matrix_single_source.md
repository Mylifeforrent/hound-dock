# ADR-001 — The permission matrix is the single policy source

Status: Draft
Decision status: Proposed architecture baseline
Date: 2026-10-18
Owner: Lead architecture agent for the Docs Agent
Refs: ROLE-001–ROLE-004; BR-001–BR-008; NFR-007; TBD-BIZ-004; CONFLICT-001; CAP-031
Supersedes: none

## Context

The only confirmed role is ROLE-001. The effective permission matrix has 18 `entity.operation` columns and four roles; every non-denied cell belongs to ROLE-001. ROLE-002 (Admin), ROLE-003 (Author), and ROLE-004 (Auditor) are proposed and denied in every cell. `TBD-BIZ-004` is open, and `CONFLICT-001` blocks the Auditor interpretation.

If each page, route, or query invents its own check, the effective result will drift from the matrix. `NFR-007` requires 100% of the matrix columns to be enforced server-side with zero client-only checks. The interaction design also requires that a denied action does not become an existence oracle and that `own-only` and `not found` look the same.

## Decision

1. The business-model permission matrix is the **single policy source**. Every command and query asks one policy boundary for a decision.
2. Decisions use exactly the four matrix values: `allowed`, `denied`, `own-only`, `read-only`. No new verb, role hierarchy, or per-object grant is introduced.
3. The default is `denied` when no confirmed grant exists.
4. `own-only` is enforced as a query/scope predicate, not as a post-filter that can be bypassed by a direct reference.
5. `read-only` is a projection rule: the record is returned without a mutating affordance and without fields the matrix does not grant.
6. Proposed roles keep their matrix rows but every decision is `denied`. No role administration path is built.
7. The policy check runs on the server for every request, including requests that a client would not normally render.

## Consequences

### Positive

- One place to verify against `NFR-007`; a test can be generated per matrix cell.
- A stale or hidden client control cannot grant access.
- The no-existence-oracle rule is enforceable because the policy result and the retrieval result are composed in one boundary.

### Cost and limits

- A policy change is a code and test change, not a UI change.
- The policy boundary becomes a dependency of every application service; bypassing it must be treated as a defect.
- The matrix has no `McpTool.read` column and no owner-display column. These are gaps, not decisions this ADR can fill.
- The architecture cannot make the three registries operable; it can only refuse to invent authority.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Route-level checks per page | Duplicates policy, drifts from the matrix, and cannot express `own-only` at query scope reliably |
| Client-side hiding plus server trust | Violates `NFR-007`; a hidden control is not a control |
| A role hierarchy with Admin implied | `TBD-BIZ-004` is open; implying an Admin grant would resolve a product decision |
| Per-object ACLs | `CAP-031` is excluded; no confirmed grant exists to model |

## What this ADR does not decide

- Who may create, publish, register, allowlist, or administer (`TBD-BIZ-004`).
- Whether Auditor is a separate role (`CONFLICT-001`).
- Fine-grained permissions (`CAP-031`).
- Session lifetime, credential hashing, cookie flags, or CSRF mechanics.
- Any API shape or endpoint.

## Revisit trigger

`TBD-BIZ-004` resolves; `CONFLICT-001` closes; or `CAP-031` enters the MVP.
