# Enterprise-internal baseline — architecture supplement

Status: Draft
Version: 0.1
As-of: 2026-10-18
Owner: Data architect (Docs Agent scope for `docs/02_architecture/**`, recorded handoff under CHG-012)
Business authority: `docs/01_product/business_model.md` v0.3 Appendix B
Change record: `docs/13_changes/CHG-012-enterprise-internal-baseline.md`
Companion documents: [architecture.md](architecture.md) · [01_domain_and_service_architecture.md](01_domain_and_service_architecture.md) · [02_api_workflow_and_review.md](02_api_workflow_and_review.md) · [03_security_reliability_and_operations.md](03_security_reliability_and_operations.md) · [04_architecture_review.md](04_architecture_review.md)

## 1. Purpose and authority

This supplement records the architecture impact of the enterprise-internal baseline selected by the product owner on 2026-10-18. It is an **authoritative amendment** to the architecture set, limited to the items below. Where it conflicts with an earlier architecture document, this supplement wins for that item; every other statement in the architecture set remains valid.

The decisions themselves are in `business_model.md` Appendix B and `docs/00_setup/open_items.md`. This supplement does not create a new business rule, a new entity, or a new `TBD`/`CONFLICT` ID. It answers no legal or compliance question; `TBD-BIZ-014` remains open for the internal-policy reference.

## 2. What changes

| Area | Before (v0.1 architecture) | Enterprise-internal baseline |
|---|---|---|
| MVP scope | Five CAPs; registries read-only | Six CAPs: `CAP-001`–`CAP-005` + `CAP-009`; skill/task authoring effective; MCP registry read-only |
| Registry writes | `MOD-03` read-only; no effective writer | `MOD-03` gains an **admin authoring path** for skills and tasks; MCP remains read-only |
| Roles | `ROLE-001` only; `ROLE-002`–`004` denied | `ROLE-002` Admin effective for skill/task publication and audit read; `ROLE-003`/`004` remain denied; `CONFLICT-001` resolved toward Admin audit read |
| State models | `STATE-001`/`002` effective; `003`–`006` reserved | `STATE-003` and `STATE-005` effective; `STATE-004` and `STATE-006` remain reserved |
| Audit | Reserved (`ENT-017`, `MOD-08`) | `CAP-009` and `ENT-017` effective; append-only, Admin read, no export |
| Data store | Unselected (`TBD-INFRA-003`) | **PostgreSQL selected**; physical schema and migrations remain a separate change |
| Model provider | Unselected (`TBD-INFRA-009`) | **Internal OpenAI-compatible gateway**; no external egress |
| Retention | `TBD-BIZ-003` | 90/180/365 days per business model B.2 |
| Classification | `TBD-BIZ-003` | Internal/Sensitive; no Highly Sensitive per business model B.2 |

## 3. Module changes

### 3.1 `MOD-03` Registry Read becomes Registry Read/Admin Authoring

- The read path is unchanged: `QRY-04`–`QRY-09` remain read-only projections.
- A new **admin authoring path** is effective for skills and tasks:
  - skill: create draft, publish, deprecate, discard (version-level `STATE-003`);
  - task: create draft, publish, retire (version-level `STATE-005`).
- The authoring path is gated by `MOD-05` and restricted to `ROLE-002` Admin. It is not available to `ROLE-001` Member.
- **MCP registration, connection test, allowlisting, and retirement remain out.** `MOD-03` continues to treat `mcp_server` as a read-only projection; `STATE-004` remains reserved.
- The authoring path may write `skill`, `skill_version`, `task_definition`, `task_version`, and `task_step`; it may not write `run`, `run_step`, `message`, `conversation`, `account`, or `audit_event`.
- No hidden seed, admin console, or account-administration path is introduced.

### 3.2 `MOD-08` Change and Audit becomes effective

- `MOD-08` owns the append-only `audit_event` record and the audit read projection.
- It records the events listed in business model B.4: sign-in success/failure; skill created/published/deprecated/discarded; task created/published/retired/discarded; run initiated/succeeded/failed; audit read.
- It does not record account administration, role changes, MCP events, or export events in the MVP.
- `MOD-08` does not become a general event bus, and it does not make operational logs into audit. `MOD-06` logs remain separate and are not a substitute.

### 3.3 `MOD-05` Policy

- The effective matrix is extended by the additive Admin grants in business model B.3.
- `ROLE-002` Admin is effective for `Skill.publish`, `TaskDefinition.publish`, `Run.read` (all), and `Audit.read`.
- `ROLE-001` Member cells are unchanged.
- `ROLE-003` Author and `ROLE-004` Auditor remain `denied`; `CONFLICT-001` is resolved toward the Admin-capability side.
- Default deny and server-side enforcement remain in force. No client-side authority is introduced.

### 3.4 `MOD-06` Observability

- Operational logs may carry a correlation id, run reference, internal actor id, outcome, and error class.
- Logs must not contain message content, sign-in names, endpoint references, tool names, or credentials (business model B.2).
- Logs are not audit events and do not satisfy `CAP-009`.

## 4. State changes

| State model | Status | Architecture consequence |
|---|---|---|
| `STATE-001` Run | Effective, unchanged | `MOD-04` remains the only writer; terminals immutable |
| `STATE-002` Run Step | Effective, unchanged | `MOD-04` remains the only writer; terminals immutable |
| `STATE-003` Skill Version | **Effective** | Draft → Published → Deprecated/Superseded; Draft → Discarded; Admin publishes/deprecates/discards, system supersedes |
| `STATE-004` MCP Server health | Reserved | No test, auth, allowlist, or retire transition; read-only recorded health |
| `STATE-005` Task Version | **Effective** | Draft → Published → Retired/Superseded; Draft → Discarded; Admin publishes/retires/discards, system supersedes |
| `STATE-006` Account | Reserved | No invitation, disable, re-enable, or delete transition |

The effective transitions are the same as the business-model diagrams in Appendix B.5. The architecture does not add a `Cancelled`, `Paused`, `Queued`, or `Retried` state.

## 5. Data and security boundaries

- **Store:** PostgreSQL is selected. The persistence boundary (`PORT-01`) is satisfied by a relational store; physical schema, indexes, migrations, backup, and restore remain a separate change under the resolved store.
- **Model egress:** `PORT-02` points to an internal OpenAI-compatible gateway. No external model, search, or MCP egress is permitted for the baseline. `NFR-008` is satisfied by the internal gateway, but `TBD-BIZ-014` remains open for the policy reference.
- **Retention:** 90 days conversations/messages, 180 days runs/run steps, 365 days audit. The retention job is a later implementation.
- **Protection:** TLS in transit; encryption at rest; log redaction; Admin-only audit read. Algorithms and key management remain security design.
- **Classification:** Internal/Sensitive; no Highly Sensitive data. The architecture does not redefine the business-model classification table.
- **Audit read:** Admin only; no export. `Audit.read` is an Admin capability, not a separate Auditor role.
- **MCP:** metadata-only read; no runtime, registration, allowlisting, or invocation. The MCP no-runtime position in `architecture.md` §9 and ADR-004 still holds.
- **HITL:** no approval, interrupt, checkpoint, or resume. CAP-014 remains excluded.

## 6. Superseded statements

| Location | Earlier statement | Supplement |
|---|---|---|
| `architecture.md` §2.1 | CAP-002/003/004 read-only | CAP-002 and CAP-004 gain Admin authoring; CAP-003 remains read-only |
| `architecture.md` §2.3 ADR-003 | Registries read-only; no authoring path | Superseded for skills/tasks; MCP remains read-only |
| `architecture.md` §2.4 / §17 | MVP not operable; no admin path | Skill/task registries are operable through Admin publication; MCP remains read-only |
| `architecture.md` §5.1 | ROLE-002–004 denied | ROLE-002 Admin effective for B.3 grants; ROLE-003/004 denied |
| `architecture.md` §7.3 | STATE-003–006 reserved | STATE-003/STATE-005 effective; STATE-004/006 reserved |
| `architecture.md` §10.2 / §10.4 | Audit not implemented; logs separate | `CAP-009` and `ENT-017` effective; logs still separate |
| `architecture.md` §12 | Data store unselected | PostgreSQL selected; physical design separate |
| `01_domain_and_service_architecture.md` §4.1 | MOD-03 read-only; MOD-08 reserved | MOD-03 Admin authoring for skills/tasks; MOD-08 effective |
| `01_domain_and_service_architecture.md` §5.1 | ENT-002/ENT-017 reserved | ENT-002 Role Assignment and ENT-017 Audit Event effective |
| `01_domain_and_service_architecture.md` §6.3 | STATE-003–006 reserved | STATE-003/STATE-005 effective; STATE-004/006 reserved |
| `01_domain_and_service_architecture.md` §7.2 | Authoring commands do not exist | Admin skill/task authoring commands exist; MCP commands remain absent |

## 7. Non-goals and boundaries

- No account administration, invitation, disable, or delete.
- No MCP registration, connection test, allowlisting, invocation, or secret reference.
- No search, citations, file context, cost/token display, chat history actions, projects, task templates, notifications, import/export, or mobile.
- No audit export, no Auditor role, no approval workflow, no HITL.
- No external model, search, or MCP egress.
- No physical schema, DDL, migration, command, or implementation in this supplement.
- No new `TBD`/`CONFLICT` ID; `TBD-BIZ-014` remains open.

## 8. Self-check

| # | Check | Verdict | Evidence |
|---|---|---|---|
| 1 | The supplement is limited to recorded decisions | Pass | §1; business model Appendix B; CHG-012 |
| 2 | No new business rule or entity | Pass | §2–§5; only existing CAP/ENT/STATE/ROLE IDs |
| 3 | No DDL, schema, migration, command, or code | Pass | §5; physical design deferred |
| 4 | No TBD used as a settled value | Pass | `TBD-BIZ-014` remains open; no policy reference invented |
| 5 | MCP and HITL remain out | Pass | §3.1, §5, §7 |
| 6 | State models have terminals and no dead states | Pass | §4; same diagrams as business model B.5 |
| 7 | No legal or compliance conclusion | Pass | §5; `TBD-BIZ-014` open |

**Verdict:** Pass 7 / Fail 0. This supplement remains `Draft` until the independent review and the Tech Lead acceptance of `CHG-012`.
