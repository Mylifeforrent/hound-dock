# Security, reliability, and operations architecture — hound-dock backend

Status: Draft
Version: 0.1
As-of: 2026-10-18
Owner: Lead architecture agent for the Docs Agent
Document: `docs/02_architecture/03_security_reliability_and_operations.md`
Change record: `docs/13_changes/CHG-010-backend-architecture.md`
Originating stage: Stage 3 — Architecture, under CHG-010
Inputs: `docs/01_product/business_model.md` v0.2 (`Draft`); `docs/03_design/interaction_design.md` v0.1 (`Draft`); `docs/00_setup/open_items.md`; `docs/08_security/README.md`; `docs/09_deployment/README.md`; `docs/10_operations/README.md`
Document-local IDs: SEC-01 to SEC-13 (security control objectives), RUN-01 to RUN-07 (reliability requirements), OPS-01 to OPS-05 (operations boundary items), MEAS-01 to MEAS-12 (measurement points), CGAP-01 to CGAP-13 (architecture gaps). These identifiers are declared architecture-local: they are not registered in `open_items.md`, are not `TBD`, `CONFLICT`, `CAP`, `BR`, `ENT`, `STATE`, or `NFR` identifiers, and carry no authority outside this document.

**Status discipline.** This document is a draft architecture boundary, not an accepted security, reliability, or operations commitment. It does not claim `Reviewed`, does not claim PRD acceptance, and closes no `TBD` or `CONFLICT`. `CONFLICT-002` concerns document routing, not a rule in this document; it is noted and not resolved.

**Tag legend.** `[SRC: file#section]` is direct evidence. `[DERIVED: reasoning]` is a logical entailment of named evidence. `[ASSUMPTION: statement]` marks an architecture assumption that is not a decision and must be confirmed or removed before it is relied on. Local identifiers `SEC-`, `RUN-`, `OPS-`, `MEAS-`, and `CGAP-` are this document's own vocabulary, not business rules.

## 1. Purpose, scope, authority and non-goals

### 1.1 Purpose

This document fixes the security, reliability, and operations boundary of the confirmed MVP: where trust changes hands, what data crosses which boundary, what must be enforced at a single point, what must be measured, and what must remain unclaimed while the underlying decisions are open. It is intentionally a boundary document, not a control specification, threat-model sign-off, or operations manual. `[SRC: CHG-010#Task Brief]`

### 1.2 Effective rules, proposed material, and open decisions

Only the items in the first row below are rules. Everything else is proposed, reserved, or open and is never used here to grant a permission, deny a permission, or reach a data conclusion. `[SRC: business_model.md#§1.2]`

| Class | Items | Treatment in this document |
|---|---|---|
| Effective rule | `CAP-001` to `CAP-005`; `FLOW-001` to `FLOW-003`; `STATE-001` and `STATE-002`; `BR-001` to `BR-008`; `ROLE-001`; the effective matrix in `business_model.md` §6.2 | Binding. The architecture may not contradict these, and every enforcement claim must trace to one of them. `[SRC: business_model.md#§6.2]` |
| Proposed or reserved | `FLOW-004` to `FLOW-006`; `STATE-003` to `STATE-006`; `ROLE-002` to `ROLE-004`; the proposed or lifecycle-proposed entities (`ENT-002`, `ENT-005`, `ENT-007`, `ENT-009`, `ENT-010`, `ENT-012`, `ENT-013`, `ENT-015`, `ENT-016`, `ENT-017`, `ENT-018`); all `NFR-*`; all `CAND-*`; the Draft PRD; interaction-design conventions | Not effective. Referenced only with an explicit proposed or reserved label; never used as a grant, a state guarantee, or a data rule. `[SRC: business_model.md#§7.0]` |
| Open | `TBD-BIZ-*`, `TBD-INFRA-*`, `CONFLICT-*` | Referenced at the decision point they block; no entry is defined, redefined, or resolved here. `[SRC: open_items.md#Registry rules]` |

`ENT-001`, `ENT-003`, `ENT-004`, `ENT-006`, `ENT-008`, `ENT-011`, and `ENT-014` are existence-confirmed by the business model. `ENT-012`, `ENT-013`, and `ENT-015` are proposed but may be structurally required by an effective rule; this document does not treat their lifecycles as effective. `[SRC: business_model.md#§5.1]`

`NFR-001` to `NFR-012` are proposed quality targets or `TBD` targets, not effective rules. Section 13 uses them only as measurement references and adopts no threshold. `[SRC: business_model.md#§9]`

### 1.3 Authority and precedence

The business model's effective items outrank this document. Where this document and an effective item conflict, the effective item wins and the conflict must be recorded rather than resolved by this file. The interaction design is a design input: its page states and its own "design rule" items constrain the interface, but they are not security rules and do not create a permission. `[SRC: interaction_design.md#§1.2]` `[SRC: CHG-010#Plan]`

### 1.4 Non-goals

This document does not: select a stack, store, gateway, hosting, CI, backup tool, or vendor; define endpoints, schemas, tables, migrations, commands, or code; set an SLO, availability target, capacity target, rate-limit threshold, timeout value, RTO, or RPO; define a data classification, retention period, deletion rule, encryption algorithm, key-management design, PII conclusion, residency conclusion, or compliance conclusion; resolve `CONFLICT-001` or `CONFLICT-002`; claim PRD acceptance; or claim that the confirmed MVP is operable. `[SRC: CHG-010#Task Brief]` `[SRC: 08_security/README.md#Boundaries]` `[SRC: 10_operations/README.md#Boundaries]`

### 1.5 No-conclusion discipline for TBD-BIZ-003 and TBD-BIZ-014

`TBD-BIZ-003` (data sensitivity and PII boundaries) and `TBD-BIZ-014` (legal, platform, and contractual constraints) are open. This document therefore writes only boundaries, data flows, control objectives, measurement points, and open questions. It contains no data classification, no PII conclusion, no retention period, no deletion rule, no residency conclusion, no encryption algorithm, no key-management design, and no compliance conclusion. A sentence here is not a data-handling policy and must not be implemented as one. `[SRC: open_items.md#TBD-BIZ-003]` `[SRC: open_items.md#TBD-BIZ-014]`

The absence of a supplied legal or contractual constraint is missing input, not a finding that no constraint applies. It cannot be used to authorize egress, retention, disclosure, or any processing purpose. `[SRC: business_model.md#§1.1 SRC-006]` `[TBD-BIZ-014]`

## 2. Trust boundaries and assets

### 2.1 Boundary status vocabulary

**Confirmed** means the boundary exists under an effective rule and must be enforced now. **Boundary only** means the boundary is identified and must be enforced at the runtime, but its mechanism or governing policy is undecided. **Deferred** means the boundary is outside the confirmed MVP. The status of a boundary is not a statement that its controls were verified. `[DERIVED: §1.2 effective/proposed split]`

| Boundary | Crossing | Data | Control objective | Status | Source |
|---|---|---|---|---|---|
| Browser/client | Member to workspace runtime | Credential input; message text; run inputs; rendered responses | No client assertion is authoritative; the client cannot grant, widen, or prove a permission; a request is judged as if it arrived without the client | Confirmed | `SEC-08`; `NFR-007` proposed; `[SRC: interaction_design.md#§5.5]` |
| Workspace runtime | Every inbound request; every outbound integration | Session and authorization context; content; record references | One server-side authorization decision before any data read, data write, or outbound call; no module bypasses it | Confirmed | `SEC-03`; `[SRC: business_model.md#§6.2]` |
| Persistence boundary | Workspace runtime to product records | Accounts; conversations; messages; runs; run steps; registry records; secret references | Only the runtime reads or writes product records; completed-run outcomes survive a restart; protection at rest is not concluded | Boundary only | `RUN-01` to `RUN-05`; `[TBD-INFRA-003]` `[TBD-BIZ-003]` |
| Model provider | Workspace runtime to a model endpoint | Prompt and response content, only through the gated model port | No content egress until the four named `TBD`s close; then only the minimum payload, and no credential value | Boundary only | `SEC-06`; `[SRC: business_model.md#§9 NFR-008]` |
| MCP server | Workspace runtime to a registered server (not active) | Registry metadata only in the MVP; no tool invocation payload | No network path to a server is authorized in the MVP; a recorded server and its metadata remain internal read-only records | Boundary only | `[SRC: business_model.md#§3.1 CAP-003]` `[TBD-BIZ-007]` |
| Operator | Human with infrastructure access to the host, process, or store | Anything the infrastructure exposes, including records at rest | Operator access is outside the effective matrix; the product creates no privileged operator account; how that access is governed is an open gap, not a permission | Boundary only | `SEC-09`; `CGAP-07`; `[SRC: 10_operations/README.md#Boundaries]` |
| Future IdP | External identity assertion to the runtime (not active) | Identity assertion and attributes | No external identity assertion creates an MVP session; introducing SSO changes the identity and session boundary and is not a configuration toggle | Deferred | `[SRC: business_model.md#§8 BR-001]` `[TBD-INFRA-010]` |

### 2.2 Assets

Assets are named, not classified. No asset below is asserted to be personal data, sensitive, regulated, safe to log, or safe to retain. Each classification question is `TBD-BIZ-003`; each retention question is `TBD-BIZ-003`, and `NFR-009` is the retention measurement reference whose target is also a `TBD`. `[SRC: business_model.md#§5.1]`

**Table tag:** every row is a boundary statement, not a classification; the unknown cell names the open question rather than an answer.

| Asset | Boundary exposure | Why it matters | What is not concluded |
|---|---|---|---|
| Account identity and status | Persistence; internal identifier in logs | Attribution and every access decision depend on it | Whether it is personal data; who may read a display name; retention. `[SRC: business_model.md#§5.1 ENT-001]` |
| Credential verification material | Authentication path only | Compromise would defeat `BR-001` | Storage mechanism, hashing, recovery, rotation. `[TBD-INFRA-004]`; `CAND-023` proposed |
| Session binding | Browser to runtime | Forgery would impersonate an account | Lifetime, expiry, revocation, fixation handling. `CGAP-01` |
| Conversation and message content | Browser; persistence; model port | Core product content with the widest unknown boundary | Classification, egress permission, retention, deletion. `[TBD-BIZ-003]` `[TBD-BIZ-014]` |
| Run and run-step records | Browser; persistence; operational logs | Outcome integrity and initiator attribution | Retention; whether error detail is safe to log. `[SRC: business_model.md#§7.1]` |
| Registry records | Browser projection; persistence | Governance integrity; a tampered instruction matters if invocation is ever enabled | Authority, owner display, lifecycle, retention. `[TBD-BIZ-004]` `[TBD-BIZ-003]` |
| Secret references | Persistence to runtime | A pointer to a credential; a value crossing the boundary is a credential compromise | Resolution, rotation, protection, whether a value is stored at all. `[TBD-BIZ-003]`; `CAND-021` proposed |
| Operational logs | Runtime to a log sink | Diagnosis and `NFR-010` measurement | Access, retention, whether an internal actor identifier is personal data. `[TBD-BIZ-009]` |
| Audit events (reserved) | No producer in the MVP | An accountability record, if the product owner requires one | Existence, event scope, store, reader, export. `[TBD-BIZ-009]`; `[SRC: business_model.md#§5.1 ENT-017]` |

## 3. Authentication and session boundary

### 3.1 Local-account-only authentication

`BR-001` permits exactly one authentication path: a workspace-local account whose credential matches, after which `SYS-001` may create a session. An external identity-provider assertion creates no session. `CAP-005` fixes self-hosted deployment with local accounts. `[SRC: business_model.md#§8 BR-001]` `[SRC: business_model.md#§3.1 CAP-005]`

Authentication is a system check, not a role permission. Sign-in is a person-level action available before any role decision; the matrix applies after a session is bound to an account. A successful authentication therefore proves identity only, never authorization. `[SRC: interaction_design.md#§2.2]` `[DERIVED: BR-001 creates a session; §6.2 grants entity operations by role]`

### 3.2 Denial behavior and non-disclosure

An unknown sign-in name and a wrong credential must produce the same generic denial, no session, and no account-existence signal in content, state transition, or redirect. `FLOW-001 F1` requires this directly; the interaction copy rules forbid "account not found", any existence hint, and any credential echo. `[SRC: business_model.md#§4 FLOW-001]` `[SRC: interaction_design.md#§5.7]`

Whether response timing or another observable difference can disclose existence is not designed here. No constant-time claim is made; the question is recorded as `CGAP-02` and belongs to the `CAND-023` security layer and the missing environment baseline, not to this document. `[TBD-INFRA-004]`

### 3.3 Session binding

A session must resolve to exactly one internal account identifier, and that identifier is the actor for every subsequent request. A session is created only by `SYS-001` after local verification; a request-supplied actor identifier is never trusted as identity. A session-store failure creates no session and returns an error (`FLOW-001 F2`). `[SRC: business_model.md#§4 FLOW-001]` `[DERIVED: BR-001 binds the account as the actor]`

### 3.4 Session lifecycle gaps

Session termination, idle expiry, sign-out, credential recovery, and disabled-account behavior are gaps. No rule states them, and no registered `TBD` closes the session lifecycle. This document does not invent a TTL, a cookie attribute, a hashing method, or a CSRF mechanism; those are security decisions pending `TBD-INFRA-004` and the `CAND-023` layer, which is proposed and not effective. `SEC-01` fixes the only authentication path; `SEC-02` fixes the non-disclosure behavior of a denial. `[SRC: interaction_design.md#§8.2]` `[SRC: business_model.md#Appendix A CAND-023]`

| Gap | Registered status | Consequence here | What is not written |
|---|---|---|---|
| Sign-out and session termination | No business rule; flagged in interaction design §8.2 | There is no confirmed way for a member to end a session; the architecture cannot claim one | No sign-out design, no termination trigger |
| Idle and absolute expiry | Not stated by `BR-001` or any `TBD` | A session may persist for an undefined period; no expiry guarantee is made | No duration, no renewal rule |
| Credential recovery | `CAP-021` excluded; `FLOW-001 C1` help destination does not exist | A member who cannot authenticate has no in-product recovery path | No reset flow, no recovery credential |
| Disabled-account behavior | `STATE-006` proposed; `TBD-BIZ-013` open | A disabled account cannot be guaranteed to fail sign-in by this architecture | No disable-enforcement claim |
| Revocation and concurrent sessions | Not stated | A compromised session has no confirmed revocation point and no concurrency limit | No revocation mechanism, no session count |
| Session mechanics | `CAND-023` proposed; `TBD-INFRA-004` missing | Credential storage, session material, and request-forgery protection are unselected | No algorithm, no attribute, no mechanism |

**Table tag:** each row references an existing gap or open item; no duration, flag, algorithm, or mechanism is defined here.

The business model states a proposed invariant that a disabled account cannot authenticate; because `STATE-006` is proposed, this document treats that as a proposed intention and not as an effective guarantee. `[SRC: business_model.md#§5.2]` `[SRC: business_model.md#§7.6]`

## 4. Authorization and isolation

### 4.1 The matrix is the policy source

The effective matrix in `business_model.md` §6.2 is the only source of human permissions. Every cell is `allowed`, `denied`, `own-only`, or `read-only`; there is no blank cell and no implicit grant. The default is deny: an operation with no confirmed grant is denied even if a page, capability, or workflow appears to require it. `ROLE-001` has the only non-denied cells; `ROLE-002`, `ROLE-003`, and `ROLE-004` are proposed and denied in every cell. `[SRC: business_model.md#§6.2]` `[SRC: business_model.md#§6.2.1]`

### 4.2 Enforcement point

`SEC-03` places one authorization decision at the workspace runtime request boundary, before any record read, record write, or outbound call. The decision resolves, in order: the session to one account; the account as a holder of the confirmed base role (`ROLE-001`); the requested operation to exactly one matrix cell; and the cell to an outcome. A denied cell returns a generic denial with no data. An `own-only` cell adds an owner predicate to the data access. A `read-only` cell projects only the fields the confirmed capability requires. `[DERIVED: §6.2 cells and BR-002/BR-008 ownership]` `[ASSUMPTION: the confirmed MVP has one logical request boundary; no separate service boundary is confirmed by any effective rule]`

Treating every local account as a holder of `ROLE-001` is an architecture assumption, not a confirmed assignment rule; no role-assignment flow is effective and `TBD-BIZ-004` is open. `[ASSUMPTION: ROLE-001 is the implicit base role for a local account]`

`NFR-007` proposes that every matrix column be enforced server-side with no client-only check. That target is proposed, not adopted. The architecture nevertheless treats server-side enforcement as the only coherent reading of a matrix that binds entity operations to roles, because a client check cannot bind the runtime. `[SRC: business_model.md#§9 NFR-007]`

### 4.3 Why a client-side check is insufficient

The browser is outside the enforcement boundary. A request can be issued without the client, replayed, or altered; a rendered control proves nothing; a stale page can show an action after a permission changes. The interaction design states the same rule from the interface side: visibility is convenience, not authority, and the system's denial wins. `[SRC: interaction_design.md#§2.3]` `[SRC: interaction_design.md#§5.5]` `SEC-08`

### 4.4 Own-only scoping and non-disclosure

`SEC-04` requires that, for `Conversation.read`, `Message.read`, `Run.read`, and `RunStep.read`, the owning account is part of the data query, not a filter applied after retrieval. A reference to another account's conversation or run returns the same generic "not available" outcome as a reference that does not exist; no title, owner, state, count, or step is disclosed. This is simultaneously a confidentiality control and an anti-enumeration control. `[SRC: business_model.md#§6.2]` `[SRC: interaction_design.md#§5.5]`

### 4.5 Read-only registry projections

`Skill.read`, `McpServer.read`, and `TaskDefinition.read` are `read-only` for `ROLE-001`. The projection contains recorded entries and the fields the confirmed capability needs; it contains no authoring control and no draft state. Owner attribution is withheld because `Account.read` is denied, and individual MCP tool names are withheld because the matrix has no `McpTool.read` column. Those two display questions are recorded gaps, not resolved here. `[SRC: business_model.md#§6.2]` `[SRC: business_model.md#§8 BR-003]` `[SRC: business_model.md#§8 BR-004]` `[SRC: business_model.md#§8 BR-005]` `[SRC: interaction_design.md#§8.2]`

### 4.6 Proposed roles and the prohibition on hidden intake

`ROLE-002` (Admin), `ROLE-003` (Author), and `ROLE-004` (Auditor) are proposed and denied. There is no admin console (`CAP-026` excluded), no role assignment flow, and no confirmed human authority to create, publish, register, or allowlist a registry entry (`TBD-BIZ-004`). `[SRC: interaction_design.md#§2.1]` The architecture must not make the registries operable by adding a seed endpoint, a migration fixture, a command-line write path, a service account, a debug route, or a direct product write to the store. Empty registries are a valid state. `SEC-12` `[SRC: interaction_design.md#§1.4]` `[TBD-BIZ-004]`

This is a blocker, not a defect in this document. The confirmed MVP is not operable until a product-owner decision assigns registry authority. `[SRC: business_model.md#§11 CHL-002]`

### 4.7 Single workspace, no tenant isolation model

`CAP-005` and `BR-007` fix one self-hosted workspace. `CAP-023` (multi-tenant SaaS) is excluded. There is no tenant identifier and no tenant-scoping model; isolation is between accounts inside one workspace. This is not a claim that account isolation is sufficient for a future multi-tenant product. If multi-tenancy is later introduced, this architecture has no isolation model to extend: it requires a new design and a new product decision. `[SRC: business_model.md#§3.2 CAP-023]` `[SRC: business_model.md#§8 BR-007]`

### 4.8 System actors do not bypass the matrix

`SYS-001` to `SYS-005` are system actors whose actions are bounded by the business rules, not by matrix cells. `SYS-004` may create a run only with a signed-in initiator (`BR-006`); `SYS-003` has no confirmed authority to store a registry entry; `SYS-005` may not invoke a tool in the MVP. A system actor is never a shortcut around a denied human operation. `[SRC: business_model.md#§6.4]` `[SRC: business_model.md#§8 BR-006]`

## 5. Data boundary and handling

### 5.1 Data flow in the confirmed scope

1. A credential enters at the browser and is verified only at `SYS-001`; no product path writes it into conversation content or logs. `SEC-07` `[SRC: business_model.md#§4 FLOW-001]`
2. A signed-in member creates or continues a conversation; the message is stored in persistence and, only after the gate in §6 opens, the minimum prompt context crosses the model port. `[SRC: business_model.md#§4 FLOW-002]` `SEC-06`
3. On a successful model response, exactly one assistant message is appended; on failure, no assistant message is appended and an error is shown. `[SRC: business_model.md#§8 BR-002]`
4. A run request is validated, then a run is created with one initiator and one recorded task version; run steps are recorded as the run executes, while the step execution model itself remains `TBD-BIZ-007`. `[SRC: business_model.md#§4 FLOW-003]`
5. Registry reads project recorded entries from persistence to the browser; no registry write path exists in the MVP. `[SRC: business_model.md#§3.1 CAP-002]` `[SRC: business_model.md#§3.1 CAP-003]`
6. Recorded MCP health is read from the registry record; it is not a live probe in the MVP. `CGAP-06` `[SRC: business_model.md#§3.1 CAP-003]`
7. A secret reference may be resolved by the runtime when an integration path is authorized; the reference is not a value, and the value is required never to enter a response, message, or log. `SEC-07` `[SRC: business_model.md#§5.2]`
8. The runtime emits operational logs to a sink whose location and retention are undefined. `[TBD-BIZ-003]` `[TBD-BIZ-009]`
9. An audit event has no producer, store, viewer, or export in the MVP; it remains reserved. `[SRC: business_model.md#§3.2 CAP-009]` `[TBD-BIZ-009]`

### 5.2 Data-object boundary table

| Data object | Where it crosses | What is unknown | What must not be concluded | Tag |
|---|---|---|---|---|
| Conversation | Browser to runtime; runtime to persistence | Classification, access scope, retention, deletion, residency | That it is personal data; that it may be retained, shared, exported, or deleted | `[TBD-BIZ-003]` |
| Message | Browser to runtime; persistence; model port only via the gate | Whether content may leave the workspace at all; retention; deletion | That egress is permitted; that a message is safe to log; that it can be deleted on request | `[TBD-BIZ-003]` `[TBD-BIZ-014]` |
| Run | Browser to runtime; persistence; run reference in logs | Classification of inputs and outputs; retention | That a run is visible to anyone other than its initiator; that it may be purged | `[SRC: business_model.md#§6.2]` |
| Run step | Runtime to persistence; error detail to logs | Whether error text contains content or identifiers | That error detail is safe to log or show outside the initiator | `[TBD-BIZ-003]` |
| Registry record | Persistence to browser projection | Owner attribution; lifecycle; retention | That an owner name may be displayed; that a record may be deleted | `[TBD-BIZ-004]` `[TBD-BIZ-013]` |
| Health snapshot | Registry record to browser | Provenance; whether it reflects live connectivity | That recorded health is current or was produced by a connection test | `CGAP-06` |
| Secret reference | Persistence to runtime | Resolution mechanism; rotation; whether a value is stored | That a reference is encrypted, rotated, recoverable, or safe by construction | `[TBD-BIZ-003]`; `CAND-021` proposed |
| Operational log | Runtime to log sink | Sink location; access; retention; whether actor identifiers are personal data | That logs are audit-grade, tamper-evident, or free of personal data | `[TBD-BIZ-009]` `[TBD-BIZ-003]` |
| Audit event (reserved) | No crossing in the MVP | Whether it exists; event scope; reader; export | That operational logs satisfy an audit obligation | `[TBD-BIZ-009]` |

### 5.3 Handling control objectives

- Collect and project only what a confirmed capability needs; a projection allowlist is safer than fetch-then-redact, because redaction can miss a field. `SEC-05` `[DERIVED: read-only cells in §6.2]`
- No direct browser-to-persistence path; every record access passes the runtime decision point. `SEC-03`
- No credential value in any response, message, error, or log; a secret reference is a pointer, never a value. `SEC-07` `[SRC: business_model.md#§5.2]`
- No content in operational logs; correlation identifiers and record references take the place of content. `SEC-13`
- Do not implement retention, deletion, archive, or export: each is unresolved and belongs to the product owner. `[TBD-BIZ-003]` `[TBD-BIZ-009]`
- Protection at rest and in transit is not selected; the control objective is boundary discipline, and no encryption or key-management claim is made. `[TBD-BIZ-003]` `[TBD-INFRA-004]`

### 5.4 Open questions, not decisions

Whether any object is personal data or sensitive; whether a retention period exists and what it is; whether deletion exists and who may request it; where records are stored or processed; who may read logs and the store; whether a secret reference resolves to a stored value at all. These are questions for `TBD-BIZ-003`, `TBD-BIZ-014`, and `TBD-INFRA-003`, not conclusions of this document. `[SRC: open_items.md#TBD-BIZ-003]`

## 6. External integrations and egress

### 6.1 Egress inventory

| Integration | Direction | What would cross | Status | Gate and source |
|---|---|---|---|---|
| Model gateway / model provider | Outbound | Prompt context and returned content, only through the model port | Boundary only; gate closed; no gateway selected | `SEC-06`; `[SRC: business_model.md#§9 NFR-008]` |
| MCP server | Outbound | None in the MVP; registry metadata is internal | Not active | `[SRC: business_model.md#§3.1 CAP-003]` `[TBD-BIZ-007]` |
| Search provider | Outbound | Nothing; search is excluded from the confirmed MVP | Excluded | `[SRC: business_model.md#§3.2 CAP-008]` `[TBD-INFRA-011]` |
| Future SSO/IdP | Inbound assertion | No identity assertion is accepted in the MVP | Deferred | `[SRC: business_model.md#§8 BR-001]` `[TBD-INFRA-010]` |
| Package, update, or telemetry traffic | Outbound | Undefined; no confirmed runtime capability requires it | Not defined; development-time dependency traffic is `docs/06_development/` scope | `[DERIVED: no confirmed runtime capability requires it]` |

### 6.2 The NFR-008 egress gate

The model gateway is treated as a model port: this document defines the crossing and the gate, not the product that implements it. No gateway is selected. `SEC-06` adopts a **closed-by-default posture**: under this posture, no conversation, message, run, or registry content leaves the workspace process until `TBD-BIZ-003`, `TBD-BIZ-014`, `TBD-INFRA-009`, and `TBD-INFRA-011` close. This is an architecture posture, not a resolution of `NFR-008` or of any TBD. The gate is enforced where the outbound payload would be constructed, not by hiding a control in the interface and not by a note in a configuration file. A request that would require egress returns an explicit error; it must not return a cached answer, an invented answer, or a partial answer presented as complete. `[SRC: business_model.md#§9 NFR-008]` `[SRC: business_model.md#§8 BR-002]`

The gate has four properties. It covers every outbound path, including a future MCP path and any future identity-provider exchange. It is observable as open or closed without exposing content. The product exposes no request parameter, client flag, or operator shortcut that opens it. It remains closed if only some of the four `TBD`s close. `[DERIVED: NFR-008 names all four conditions]`

The architecture does not classify a model endpoint as internal or external; that is `TBD-INFRA-009`. Therefore every model call sits behind the gate until that decision names a permitted boundary. `[TBD-INFRA-009]`

### 6.3 The CAP-001 tension

`CAP-001` requires an assistant message after a successful model response. Under the closed-by-default posture, with the four `TBD`s open, `CAP-001` cannot be exercised end-to-end against a provider. The architecture does not resolve this: it records that the confirmed capability's acceptance criterion and the security posture cannot both be satisfied until a product-owner decision narrows the data boundary, closes the `TBD`s, or changes the capability. `[SRC: business_model.md#§3.1 CAP-001]` `[SRC: business_model.md#§9 NFR-008]` `[TBD-BIZ-003]` `[TBD-BIZ-014]`

### 6.4 BR-007: external providers are dependencies, not a control plane

The product may depend on an external model, MCP, or search provider as a function and data dependency; it must not require a vendor-hosted multi-tenant control plane for sign-in or core data. A provider's own management console is outside the product architecture. This does not authorize egress: `BR-007` governs where the product runs, while `NFR-008` and the four `TBD`s govern what content may leave. Both apply. `[SRC: business_model.md#§8 BR-007]` `[DERIVED: BR-007 Exceptions name external providers as dependencies]`

### 6.5 MCP and future SSO

The MVP has a read-only MCP registry and no MCP runtime: no connection test, no tool discovery, no allowlist action, and no invocation. No network path to an MCP server is authorized, and a recorded server's metadata remains an internal record. If invocation is ever enabled, `BR-004` requires a recorded server and the policy questions in `TBD-BIZ-004` and `TBD-BIZ-007` must close first. `[SRC: business_model.md#§3.1 CAP-003]` `[SRC: business_model.md#§8 BR-004]`

SSO is deferred. `BR-001` forbids an external identity path in the MVP, and `CAP-007` is excluded. The MVP has no dormant SSO route, callback, or enabled feature flag. Introducing SSO later replaces part of the identity and session boundary; it is not a plugin behind the current session model. `[SRC: business_model.md#§3.2 CAP-007]` `[TBD-INFRA-010]`

## 7. Capacity and availability

### 7.1 Status

`NFR-004` (capacity) and `NFR-005` (availability) use a `TBD` target plus a suggested baseline that is explicitly not a commitment. This document adopts neither. It makes no sizing, redundancy, failover, or multi-instance claim; the product is one self-hosted workspace whose availability is a property of team-controlled infrastructure. `[SRC: business_model.md#§9 NFR-004]` `[SRC: business_model.md#§9 NFR-005]` `[SRC: business_model.md#§8 BR-007]`

### 7.2 Measurement points and load assumptions

The architecture must expose: request outcomes and error classes at the runtime boundary; active session count; active run count; run-step state transitions; persistence operation outcomes; model-port outcomes when the gate is open; and health-signal transitions. These are counters and timestamps, not thresholds. `[DERIVED: §13 MEAS-04]`

| Assumption to confirm | Suggested baseline (not a commitment) | Status |
|---|---|---|
| Accounts in the workspace | 50 accounts | `TBD-BIZ-004`; not adopted |
| Concurrent sessions | 20 sessions | `TBD-BIZ-008`; not adopted |
| Concurrent runs | 10 runs | `TBD-BIZ-008`; not adopted |
| Peak measurement window | One 30-minute window | `TBD-BIZ-008`; not adopted |
| Measurement environment | One local machine | `TBD-INFRA-004`; unavailable |

**Table tag:** every row is an unconfirmed assumption; none is adopted and none is an acceptance threshold.

The numbers above are quoted only to keep the open assumption visible. They are not a capacity target and must not be used as an acceptance threshold. `[SRC: business_model.md#§9]`

### 7.3 Failure modes and expected behavior

| Failure | Expected behavior and source | Limit or unknown |
|---|---|---|
| Session store unavailable | No session is created; an error is returned (`FLOW-001 F2`) | Recovery and retry behavior is unconfirmed |
| Model unavailable or slow | An error is shown; no assistant message is appended (`BR-002`) | Timeout value is `TBD-BIZ-008`; no retry policy |
| Persistence unavailable at run creation | The request is rejected; the interaction design keeps the inputs | `FLOW-003` routes creation failure to `F2`, which describes finalizing a run; the "no run exists" case is ambiguous (`CGAP-09`) |
| Process restart during a run | Completed runs remain readable (`NFR-012` proposed) | An in-flight run can be left `Running` with no legal transition (`CGAP-04`) |
| MCP health stale or unavailable | The registry shows recorded health; there is no live probe | Provenance is undefined (`CGAP-06`) |
| Log sink unavailable | No confirmed requirement to block or to continue | Whether logging is best-effort or required is undecided (`CGAP-10`) |
| Client disconnect during a request | The operation may complete server-side | No idempotency key is confirmed; duplicate-run risk (`CGAP-09`) |
| Resource exhaustion | No admission control is confirmed | No capacity target and no degradation threshold |

**Table tag:** a row citing a `BR-*` or `FLOW-*` states effective behavior; a row citing the interaction design is design input; "no confirmed requirement" marks an open gap.

### 7.4 Degradation behavior

Degradation is fail-closed for authorization and writes, and fail-explicit for reads: a denial is a denial, a failed load is an error rather than an empty state, and an unconfirmed run start is never shown as success. `RUN-07` `[SRC: interaction_design.md#§5.2]` `[SRC: interaction_design.md#§5.4]`

The interface provides no queue and no automatic retry; a failed run is not retried in place, and a new attempt is a new run. `BR-008` does not define a retry policy. `[SRC: business_model.md#§8 BR-008]` `[SRC: interaction_design.md#§5.4]`

A stale run status is shown as unavailable with a retry, not guessed. `[SRC: interaction_design.md#§5.2]`

No availability claim is made while the runtime is degraded, and no "partial availability" is asserted for a dependency outage. `OPS-04`

## 8. Durability, backup and recovery

### 8.1 Persistence guarantees at the boundary

`NFR-012` proposes that every completed run is readable after a process restart. `CAP-034` (backup, restore, disaster recovery) is excluded. The store is `TBD-INFRA-003`. This section states what persistence must guarantee, not how; it selects no store, replication, backup tool, schedule, RTO, or RPO. `[SRC: business_model.md#§9 NFR-012]` `[SRC: business_model.md#§3.2 CAP-034]` `[TBD-INFRA-003]`

| ID | Guarantee at the persistence boundary | Status and source |
|---|---|---|
| `RUN-01` | A terminal run state and every step's terminal state are durable before the initiator is shown a terminal outcome | Derived from `NFR-012` and `BR-008`; proposed requirement |
| `RUN-02` | Run creation persists the initiator and the recorded task version with the run | Derived from `BR-005` and `BR-006`; effective attribution |
| `RUN-03` | A restart does not change a terminal state or lose a completed run's readable outcome | Derived from `NFR-012`; proposed target |
| `RUN-04` | A partial write is never surfaced as a completed run, and a read model never synthesizes a step result | Derived from `BR-008` and `STATE-001`; effective visibility |
| `RUN-05` | Recovery does not fabricate an assistant message for an interrupted chat | Derived from `BR-002`; effective response integrity |
| `RUN-06` | No orphaned `Running` run is silently finalized | Architecture position; no legal transition exists (`CGAP-04`) |
| `RUN-07` | Degradation fails closed for writes and authorization and fails explicit for reads | Architecture position; see §7.4 |

### 8.2 Orphaned Running run

`STATE-001` allows `Running` to `Failed` only when a step fails or times out. A process death is neither. There is no restart, abandonment, or recovery transition in the effective model, so an interrupted run can remain `Running` indefinitely. This document does not invent a transition, a timeout, or an automatic finalization: any resolution is a product-owner state decision. The initiator sees a stale state; `NFR-012` does not cover this case because the run never completed. `CGAP-04` `[SRC: business_model.md#§7.1]` `[SRC: interaction_design.md#§5.2]`

### 8.3 Backup is excluded, and restart durability is not disaster recovery

`NFR-012` covers a process restart against an intact store. It does not cover store loss, corruption, or site loss; those are `CAP-034` and are excluded. Without a backup contract, a store loss can destroy completed runs, and this architecture must not claim otherwise. No backup tool, schedule, retention, RTO, or RPO is defined here; they belong to `docs/09_deployment/` and `docs/10_operations/` once the store and the product owner's recovery expectation exist. `[SRC: business_model.md#§3.2 CAP-034]` `[TBD-INFRA-003]`

## 9. Rate limiting and abuse

### 9.1 Status

Login rate limiting is `CAND-023`, which is proposed and not effective. No confirmed threshold, mechanism, lockout, or challenge exists. `BR-001` does not include throttling. This document selects no algorithm and no number, and it makes no claim that brute force or credential stuffing is mitigated. `[SRC: business_model.md#Appendix A CAND-023]` `[SRC: business_model.md#§8 BR-001]`

### 9.2 Risks to keep visible

Brute force against local accounts; credential stuffing if people reuse credentials outside the workspace; account enumeration through response content, timing, or state; resource exhaustion through repeated chat or run submissions; duplicate runs when a submission result is lost; log or error amplification; and a future lockout policy becoming its own denial-of-service vector. The likelihood and impact of each are unmeasured. `[DERIVED: no confirmed control exists]`

### 9.3 Measurement points

The architecture must be able to expose internally, without content: authentication attempts by outcome; denial counts; denial response-time distribution; run creation rate; request rate by operation; and error-class distribution. Per-account and per-source aggregation is itself a data question, because an internal account identifier or a source address may be personal data; this document does not decide whether either may be collected or retained. `[TBD-BIZ-003]`

No threshold, alert, lockout, or blocking action is specified. Any such decision must come from a product-owner policy plus the `CAND-023` security layer. `[TBD-BIZ-004]`

## 10. Observability

### 10.1 Operational logs are not audit events

| Record | Purpose | Effective in the MVP? | Store, viewer, export |
|---|---|---|---|
| Operational log | Diagnose an operation and measure `NFR-001`, `NFR-002`, `NFR-003`, `NFR-010` | Emission is required by this architecture; no sink is selected | Destination undefined; no viewer or export |
| Audit event | Accountability and evidence, if the product owner requires it | No; `ENT-017` and `CAP-009` are proposed/excluded | None; no audit store, viewer, or export |
| Business record | Product data such as a message or run | Yes, in persistence | Product surfaces only; not observability |

**Table tag:** `CAP-009` and `ENT-017` are excluded or proposed; `TBD-BIZ-009` is open.

Operational logs must not be described as audit records, and an audit obligation must not be inferred from them. `SEC-10` `[SRC: business_model.md#§3.2 CAP-009]` `[TBD-BIZ-009]`

### 10.2 Structured log fields

| Field | Requirement | Rule |
|---|---|---|
| Correlation or request identifier | Required on every entry | Generated at the runtime boundary and propagated; not derived from content |
| Run reference | Required for run-related entries | Internal record reference, never message content |
| Internal actor identifier | Required where an authenticated action occurs | Internal account identifier only; no display name; whether it is personal data is `TBD-BIZ-003` |
| Outcome | Required | Success, failure, or denial class; no free-text content |
| Error class | Required on failure | Internal class; no raw provider payload and no stack trace to the client |
| Operation or matrix-cell reference | Recommended | Ties an entry to the authorization decision without recording content |
| Duration | Recommended | Supports `NFR-001`, `NFR-002`, and `NFR-003` measurement |

Forbidden in logs: message or prompt text, assistant content, credential or secret value, display name, raw provider response, and a full endpoint reference containing credentials. `SEC-13` `[SRC: interaction_design.md#§5.7]`

`NFR-010` proposes that every run carries a run reference and initiating account in structured logs, and every failed run an error code. That is a proposed target, not adopted; the fields above are the architecture's minimum exposure for it to be measurable. `[SRC: business_model.md#§9 NFR-010]`

### 10.3 Health signal

A health signal must exist for `NFR-005` measurement. Its semantics must distinguish process liveness from dependency readiness, or state explicitly which one it reports; a signal that reports healthy while persistence or the model port is unusable makes an availability measurement misleading. `SEC-11` `[SRC: business_model.md#§9 NFR-005]`

The signal must not disclose a version, configuration value, credential, or content; it must not be an authorization bypass; and who may read it is an open question. No endpoint, path, or probe interval is defined here. `[TBD-INFRA-004]`

### 10.4 Metrics for the performance and log NFRs

`NFR-001`: expose the submit timestamp, the first-token timestamp where incremental delivery exists (otherwise the completion timestamp), the model-port outcome, and the correlation identifier per request. `NFR-002`: expose the registry read start and end, the item count, and the projection used; count and list should come from the same read so a mismatch cannot be mistaken for drift. `NFR-003`: expose the persisted run-step transition timestamp and the client-visible update timestamp against the same run reference. `NFR-010`: expose the presence and completeness of the fields above. No dashboards, alerts, or thresholds are defined. `[SRC: business_model.md#§9]`

### 10.5 Prohibitions

No audit store, audit viewer, or audit export in the MVP. No secret value in a log. Log only internal identifiers, and treat every content field as prohibited until `TBD-BIZ-003` defines what may be logged. No content in a metric label. No authorization decision based on a log. No retention period for logs: `TBD-BIZ-003` and `TBD-BIZ-009` are open. `[SRC: business_model.md#Appendix A CAND-004]`

## 11. Cost visibility

`TBD-BIZ-010` is open. `CAP-016` (per-run token and cost tracking, budget meter, alert) and `CAP-017` (usage dashboard) are excluded. This document defines no token count, cost field, budget, quota, alert, or pricing. `[SRC: open_items.md#TBD-BIZ-010]` `[SRC: business_model.md#§3.2 CAP-016]`

Cost drivers that exist even without a cost display: model calls per message; prompt context size as a conversation grows; output length; user-initiated retries; future run-step calls; future MCP calls; log and metric volume; persistence growth; and egress volume. `[DERIVED: §5 and §6]`

The impact of not measuring them: no per-account or per-run attribution; no way to distinguish normal use from abuse or a runaway loop; no input to capacity planning; no way to answer `TBD-BIZ-010`; and no cost-related objective or guardrail can be measured. This is a visibility gap, not a reason to add an implementation. `[SRC: business_model.md#§2 OBJ-001]`

## 12. Operations boundaries

### 12.1 What belongs where

| Concern | Owner | This document |
|---|---|---|
| Threat model, secrets handling, access-control specification, privacy controls | `docs/08_security/` | Supplies boundary input only; makes no control selection |
| Environments, release procedure, configuration promotion, rollback | `docs/09_deployment/` | States prerequisites and signals; no commands, no release design |
| Runbooks, incident response, operational SLOs | `docs/10_operations/` | States failure modes and measurement points; no runbook, no SLO |
| Verified install, run, build, and test commands | `docs/06_development/` | None; `TBD-INFRA-007` is open |
| Schemas, retention, migration | `docs/04_data/` | None; `TBD-BIZ-003` and `TBD-INFRA-003` are open |
| API authentication expectations and error model | `docs/05_api/` | No endpoint, schema, or token design |
| Test cases and acceptance evidence | `docs/07_testing/` | Measurement points only; no test command |

`OPS-01` assigns environment, release, configuration promotion, and rollback to `docs/09_deployment/`; `OPS-02` assigns runbooks, incident response, and operational SLOs to `docs/10_operations/`. **Table tag:** folder ownership is sourced by each folder README. `[SRC: 09_deployment/README.md#Boundaries]` `[SRC: 10_operations/README.md#Boundaries]`

### 12.2 No readiness claim

Deploying the runtime is not the same as an operable product: the registries have no confirmed authority to be populated, the model port is gated, and the environment baseline is missing. This document makes no operational-readiness claim. `OPS-04` `[TBD-BIZ-004]` `[TBD-INFRA-004]`

### 12.3 Operator interface

`OPS-03` defines the operator interface: the health signal, structured logs, failure modes, and measurement points defined here; the procedures that use them belong to `docs/10_operations/`. Operator access to the host, process, or store is outside the effective matrix and is not constrained by `BR-001` to `BR-008`. The product creates no operator account and no privileged path. How infrastructure-level access is governed is a governance gap (`CGAP-07`), not a permission granted by this architecture. `SEC-09` `[SRC: business_model.md#§6.4]`

## 13. Measurement plan

`NFR-001` to `NFR-012` are proposed or `TBD` targets, not rules. This plan defines what the architecture must expose for a later measurement; it adopts no threshold and does not claim a measurement was performed. The Stage 1 environment baseline is missing, so no backend measurement environment exists (`OPS-05`). `[SRC: business_model.md#§9]` `[TBD-INFRA-004]`

| MEAS | NFR | Measurement point | What the architecture must expose | Threshold status | Environment status |
|---|---|---|---|---|---|
| `MEAS-01` | `NFR-001` | Message submit to first assistant token; requires an incremental delivery mechanism that is not selected, otherwise only the completion timestamp is measurable | Submit timestamp, first-token timestamp, model-port outcome, correlation identifier | Proposed; not adopted (`TBD-BIZ-008`) | Unavailable |
| `MEAS-02` | `NFR-002` | Registry list read | Read start and end, item count, projection identifier | Proposed; not adopted (`TBD-BIZ-008`) | Unavailable |
| `MEAS-03` | `NFR-003` | Run-step change to visible update | Persisted transition timestamp, client-visible timestamp, run reference | Proposed; not adopted (`TBD-BIZ-008`) | Unavailable |
| `MEAS-04` | `NFR-004` | Capacity at the request boundary | Active sessions, active runs, outcomes, error classes, latency distribution | `TBD` target (`TBD-BIZ-004`, `TBD-BIZ-008`) | Unavailable |
| `MEAS-05` | `NFR-005` | Health signal over time | Health state with timestamp and semantic (liveness or readiness) | `TBD` target (`TBD-BIZ-008`) | Unavailable |
| `MEAS-06` | `NFR-006` | Secret handling in responses and logs | Resolution event without a value; canary scan result on response and log | Proposed; not adopted (`TBD-BIZ-003`, `TBD-BIZ-008`) | Unavailable |
| `MEAS-07` | `NFR-007` | Per-matrix-cell server-side enforcement | Cell reference, decision, response class, request reached without the client | Proposed; not adopted (`TBD-BIZ-004`) | Unavailable |
| `MEAS-08` | `NFR-008` | Content egress | Destination, payload marker, gate state, canary detection | Proposed; blocked (`TBD-BIZ-003`, `TBD-BIZ-014`, `TBD-INFRA-009`, `TBD-INFRA-011`) | Unavailable |
| `MEAS-09` | `NFR-009` | Retention and deletion | No architecture surface: no retention mechanism exists | `TBD` target (`TBD-BIZ-003`) | Unavailable; measurement blocked |
| `MEAS-10` | `NFR-010` | Structured log completeness | Run reference, internal actor identifier, outcome, error class | Proposed; not adopted (`TBD-BIZ-009`) | Unavailable |
| `MEAS-11` | `NFR-011` | Accessibility of core flows | Not a backend surface; browser DOM and keyboard path are `docs/03_design/` and `docs/07_testing/` scope | Proposed; not adopted (`TBD-BIZ-008`) | Out of this document's scope |
| `MEAS-12` | `NFR-012` | Completed run after restart | Durable terminal-run read model; restart is initiated by `docs/09_deployment/` | Proposed; not adopted (`TBD-INFRA-003`, `TBD-INFRA-005`) | Unavailable |

**Table tag:** each row cites its `NFR`; every threshold is proposed or `TBD` and is not adopted by this document.

## 14. Risks and open items

### 14.1 Architecture gaps

Each gap below is a boundary this document cannot complete without a product-owner or engineering decision. No new `TBD` identifier is assigned; each is architecture-local and belongs in `open_items.md` only when the Tech Lead registers it. `[SRC: open_items.md#Registry rules]`

| GAP | Gap | Why it cannot be closed here | Nearest existing item |
|---|---|---|---|
| `CGAP-01` | Session termination, sign-out, idle expiry, revocation | No rule or `TBD` defines session lifecycle; no TTL is invented | `[TBD-BIZ-004]`; interaction §8.2 |
| `CGAP-02` | Account enumeration through timing or state | No mechanism is designed; no constant-time claim can be made | `[TBD-INFRA-004]`; `CAND-023` |
| `CGAP-03` | Credential recovery and disabled-account behavior | Account administration and offboarding are unconfirmed | `[TBD-BIZ-004]` `[TBD-BIZ-013]` |
| `CGAP-04` | Orphaned `Running` run after a restart | `STATE-001` has no recovery transition; inventing one would create a state rule | `[TBD-BIZ-007]` |
| `CGAP-05` | Registry intake has no confirmed authority | `ROLE-002` to `ROLE-004` are denied; a seed or admin path would fabricate a grant | `[TBD-BIZ-004]` |
| `CGAP-06` | Provenance of recorded MCP health | Registration, connection test, and discovery are excluded | `[TBD-BIZ-004]` `[TBD-BIZ-007]` |
| `CGAP-07` | Operator and infrastructure access outside the matrix | There is no operator role, no audit, and no access policy | `[TBD-BIZ-003]` `[TBD-BIZ-009]` |
| `CGAP-08` | No confirmed login rate limiting | `CAND-023` is not effective; no threshold or mechanism exists | `[TBD-INFRA-004]` |
| `CGAP-09` | Duplicate-run reconciliation and idempotency | `BR-005`/`BR-006` require one initiator but define no idempotency key; `FLOW-003` routes creation failure into `F2` | `[TBD-BIZ-007]` |
| `CGAP-10` | Log versus audit conflation, access, and retention | Audit obligation and data policy are open; logs have no retention rule | `[TBD-BIZ-009]` `[TBD-BIZ-003]` |
| `CGAP-11` | Secret-reference resolution, rotation, and revocation | `ENT-010` is proposed and `CAND-021` is not effective | `[TBD-BIZ-003]` `[TBD-INFRA-009]` |
| `CGAP-12` | Artifact access (`Artifact.read` denied) | The matrix denies it; no artifact boundary is confirmed | `[TBD-BIZ-003]` |
| `CGAP-13` | Ownership of egress-gate verification | No operations role and no audit obligation is confirmed | `[TBD-BIZ-009]` `[TBD-INFRA-009]` |

### 14.2 Existing open items that constrain this document

| Item | Constraint here | Status |
|---|---|---|
| `TBD-BIZ-003` | Blocks classification, retention, deletion, log policy, and any egress decision | Open |
| `TBD-BIZ-004` | Blocks registry authority, role grants, account administration, and capacity assumptions | Open |
| `TBD-BIZ-007` | Blocks MCP invocation, step execution, and any retry or recovery semantics | Open |
| `TBD-BIZ-008` | Blocks every NFR threshold and the measurement environment | Open |
| `TBD-BIZ-009` | Blocks audit scope, log retention, and any audit store or viewer | Open |
| `TBD-BIZ-010` | Blocks cost visibility and budget | Open |
| `TBD-BIZ-013` | Blocks disabled-account and offboarding behavior | Open |
| `TBD-BIZ-014` | Blocks any compliance conclusion and any authorization of processing | Open |
| `TBD-INFRA-003` | Blocks persistence, durability verification, and backup | Open |
| `TBD-INFRA-004` | Blocks the measurement environment and every security mechanism decision | Open |
| `TBD-INFRA-006` | Blocks CI-based security checks and remote review evidence | Open |
| `TBD-INFRA-009` | Blocks the model port, provider, and any internal/external classification | Open |
| `TBD-INFRA-010` | Keeps SSO and the future IdP boundary deferred | Open |
| `TBD-INFRA-011` | Keeps search and its egress excluded | Open |
| `CONFLICT-001` | Keeps `ROLE-004` (Auditor) blocked and denies audit read | Open |

**Table tag:** every row references an entry in `open_items.md`; no entry is redefined and no status is changed. `TBD-BIZ-012` is resolved at the scope boundary (`CHG-021`); this document still claims no PRD acceptance. `CONFLICT-002` affects document routing only and does not change a rule here. `[SRC: open_items.md#CONFLICT register]`

### 14.3 Tensions in the inputs

- `CAP-001` needs a model response; `NFR-008` and the four `TBD`s block content egress. This document enforces the gate, so `CAP-001` cannot be exercised end-to-end against a provider under the current open items; the product owner must decide how to proceed. `[DERIVED: §6.3]`
- `CAP-003` displays "recorded health", but registration, testing, and invocation are excluded, and no registry authority exists. The provenance of that health is undefined. `CGAP-06`
- `NFR-012` proposes restart durability while `CAP-034` excludes backup; restart durability is not disaster recovery, and a store loss is unaddressed. `[DERIVED: §8.3]`
- `FLOW-003 N3` routes a run-creation failure to `F2`, which describes finalizing a run; the interaction design distinguishes "no run created" from "run created then rejected". The architecture treats "no run exists" as nothing to finalize and leaves the routing ambiguity open. `CGAP-09`
- `BR-001` creates sessions but no rule terminates them; the interaction design already records this as a gap. `CGAP-01`
- `NFR-007` refers to matrix columns, but the matrix has no `McpTool.read` column and several rows are denied in every cell, so "per-cell enforcement" needs an interpretation before it can be measured. `[SRC: interaction_design.md#§8.2]`
- `BR-005`/`BR-006` require one initiating account but define no idempotency key; the interaction design's unconfirmed-run-start behavior is an interface mitigation, not a server guarantee. `CGAP-09`

## 15. Self-check

**Table tag:** every verdict is derived from the cited sections; this is a self-check. The architecture review is recorded in `04_architecture_review.md`; the RULE-005 Verifier record remains pending.

| Check | Verdict | Evidence |
|---|---|---|
| No data classification, PII conclusion, retention period, deletion rule, residency conclusion, encryption algorithm, key-management design, or compliance conclusion | Pass | §1.5, §5.2, §5.4, §8.3; every data row names the unknown and the forbidden conclusion |
| No stack, store, gateway, hosting, CI, backup tool, or vendor selected | Pass | §2, §6, §8.3, §12; only boundaries and ports are named |
| No deployment command, endpoint, schema, DDL, or migration | Pass | §1.4, §12.1; no command block or path in the document |
| No SLO, availability target, capacity target, rate-limit number, timeout number, RTO, or RPO | Pass | §7.1, §7.2, §8.1, §9.1; the suggested baseline is quoted only as a non-commitment |
| Effective and proposed material separated | Pass | §1.2; `ROLE-002` to `ROLE-004` are denied; `FLOW-004` to `FLOW-006` and `STATE-003` to `STATE-006` are never used as guarantees |
| Every claim traced | Pass | Every substantive assertion is tagged at paragraph level or by its table caption; local IDs are declared in the header |
| No new `TBD`, `CONFLICT`, `CAP`, `BR`, `ENT`, `STATE`, or `NFR` identifier | Pass | Only `SEC-`, `RUN-`, `OPS-`, `MEAS-`, and `CGAP-` identifiers are introduced; all are declared architecture-local |
| No `CONFLICT` resolved and no PRD acceptance claimed | Pass | `CONFLICT-001` and `CONFLICT-002` are referenced only; `TBD-BIZ-012` is resolved at the scope boundary (`CHG-021`), and this document still claims no PRD acceptance |
| Client-side checks are not treated as authority | Pass | `SEC-08`, §4.3; `NFR-007` is used as a proposed reference, not an adopted target |
| No operational-readiness claim | Pass | §12.2; the registries are empty-valid, the gate is closed, and the baseline is missing |
| No unqualified generic security slogan | Pass | Every boundary is stated as a specific crossing and control objective; no undefined industry label is invoked |
| Residual limits are explicit | Pass | `CGAP-01` to `CGAP-13`; §14.3; the confirmed MVP is not operable under `TBD-BIZ-004`, and no positive registry path can be tested |

**Residual limits.** This document is not a threat model, a control specification, a test record, or a compliance statement. It cannot verify a control because no environment baseline exists (`TBD-INFRA-004`), no store is selected (`TBD-INFRA-003`), no audit obligation is confirmed (`TBD-BIZ-009`), and no registry authority exists (`TBD-BIZ-004`). Its value is the boundary it refuses to overstate. `[SRC: 08_security/README.md#Boundaries]` `[SRC: 10_operations/README.md#Boundaries]`
