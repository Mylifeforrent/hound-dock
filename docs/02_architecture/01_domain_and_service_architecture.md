# Domain and Service Architecture — hound-dock Backend

Status: Draft
Version: 0.1
As-of: 2026-10-18
Owner: Lead architecture agent for the Docs Agent
Decision owner: Product Owner (user) for every TBD-BIZ, CONFLICT, role grant, retention period, and numeric target
Business authority: `docs/01_product/business_model.md` v0.2 (Draft)
Interaction input: `docs/03_design/interaction_design.md` v0.1 (Draft)
Change record: `docs/13_changes/CHG-010-backend-architecture.md`
Companion documents: `00_research_and_input_traceability.md`, `02_api_workflow_and_review.md`, `03_security_reliability_and_operations.md`, `04_architecture_review.md`, `architecture.md`

Architecture-local identifier families: `MOD-nn` (module), `PORT-nn` (outbound boundary), `CMD-nn` (command), `QRY-nn` (query), `EVT-nn` (event), `AGAP-nn` (architecture gap). These identifiers are local to `docs/02_architecture/**`; they are not registry entries and MUST NOT be used as `TBD`, `CONFLICT`, `CAP`, `BR`, `ENT`, `STATE`, `NFR`, or `FLOW` IDs. `[DERIVED: CHG-010 write scope]`

## 1. Purpose, scope, authority, and non-goals

### 1.1 What this document owns

1. The module boundaries of the backend and the dependency rules between them. `[DERIVED: CHG-010 Task Brief output 2]`
2. The domain model in business terms: which entity is effective, which is structurally required by an effective rule, and which is reserved. `[SRC: business_model.md#§5 ENT-001..ENT-018]`
3. `STATE-001` Run and `STATE-002` Run Step as architecture-level state machines, and the reserved status of `STATE-003`–`STATE-006`. `[SRC: business_model.md#§7.1 STATE-001]`
4. The principle-level command, query, and event catalog: actor, preconditions, state effect, idempotency note, status. `[SRC: business_model.md#§4 FLOW-001..FLOW-003]`
5. Transaction boundaries, one-writer discipline, failure recovery, compensation, and the data-ownership and audit-reservation position at principle level. `[DERIVED: BR-002, BR-005, BR-008]` `[TBD-BIZ-009]`

### 1.2 What this document does not own

| Excluded object | Owner path or registry | Boundary |
|---|---|---|
| Interface contract, endpoint shape, request and response structure, error taxonomy, status codes | `docs/05_api/` (future), `02_api_workflow_and_review.md` | This document names intents and effects only. `[DERIVED: CHG-010 Plan risk 2]` |
| Data schema, table, column, index, migration, retention job | `docs/04_data/` (future); `TBD-INFRA-003`, `TBD-BIZ-003` | No schema is defined here. `[TBD-INFRA-003]` |
| Frontend stack, backend stack, data store, dependency tooling, model gateway, search provider, hosting, CI | `TBD-INFRA-001`, `002`, `003`, `005`, `006`, `009`, `011` | Every technology mention below is a port or a candidate set, never a selection. `[TBD-INFRA-002]` |
| Product scope, role grants, business rules, numeric thresholds, retention, PII classification | `docs/01_product/business_model.md`, `docs/00_setup/open_items.md` | This document cannot create, amend, or answer any of them. `[DERIVED: RULE-014]` |
| Security control selection, deployment topology, operating runbooks | `docs/08_security/`, `docs/09_deployment/`, `docs/10_operations/` | Cross-cutting constraints are delegated. `[DERIVED: CHG-010 Task Brief]` |
| Implementation, code, manifests, migrations, test design | `backend/**`, `docs/07_testing/` | Not authorized at this stage. `[SRC: AGENTS.md#2]` |

### 1.3 Authority and reading discipline

- `business_model.md` v0.2 effective items are the only rules. Where this document and an effective rule disagree, the rule wins and this document is defective. `[SRC: CHG-010 Decision log]`
- `interaction_design.md` contributes observable behavior and honest gaps. It cannot grant a permission or extend scope. `[SRC: interaction_design.md#§1.1]`
- No `TBD` is answered and no `CONFLICT` is resolved here. A dependent statement names its TBD instead of deciding it. `[TBD-BIZ-012]` `[CONFLICT-001]`
- PRD acceptance is not claimed. The document remains `Draft`. `[TBD-BIZ-012]`

## 2. Status legend and decision discipline

Every substantive statement in this document carries one of the classes below. A statement without a tag is a defect.

| Class | Meaning | Effect in this document | Tag form |
|---|---|---|---|
| **Effective** | Follows from a confirmed capability, business rule, flow, state model, or the effective permission matrix | May be designed and tested | `[SRC: ...]` |
| **Structurally required** | An entity or record that an effective rule cannot be satisfied without, although the business model labels the entity proposed | Minimal record only; no lifecycle beyond what the rule needs | `[DERIVED: ...]` |
| **Proposed — reserved** | Named in the business model as proposed, or excluded from the confirmed MVP | Named as reserved; no behavior, transition, or write path designed | `[TBD-BIZ-nn]` |
| **Architecture assumption** | A technology-neutral design choice that no rule states, declared so a reviewer can reject it without changing a business rule | Reversible; recorded inline where used | `[DERIVED: ...]` plus the words “architecture assumption” |
| **Gap** | A behavior the inputs leave undefined | Carries an `AGAP-nn` and interim behavior only | `[AGAP-nn]` |
| **Recorded tension** | Two input statements that cannot both be read literally | Both readings restated in §5.5; not resolved | `[SRC: ...]` both sides |
| **Reserved** | `FLOW-004`–`006`, `STATE-003`–`006`, skill publication, MCP registration, allowlisting, and task publication | Named; never presented as working behavior | `proposed — reserved; not implemented` |

Decision discipline, binding on this document and its reviewers:

1. An absent grant is `denied`; a `denied` action is not designed, not seeded, and not enabled by a hidden path. `[SRC: business_model.md#§6.2]`
2. An open TBD becomes a named dependency, never a default value. `[DERIVED: RULE-014]`
3. A behavior not stated in the inputs becomes an `AGAP-nn` with interim behavior, not a silent assumption. `[DERIVED: CHG-010 Plan risk 4]`
4. No numeric threshold, role grant, retention period, encryption choice, PII conclusion, dedup window, queue depth, or retry count is invented here. `[DERIVED: CHG-010 Plan risk 4]`

## 3. System context

### 3.1 Actors

| Actor | Status | Interaction with the backend | Tag |
|---|---|---|---|
| **ROLE-001** Member | Effective base role | Signs in; starts and continues own conversations; reads the three registries read-only; initiates a manual run of a recorded task; reads own run and run steps | `[SRC: business_model.md#§6.1 ROLE-001]` |
| **ROLE-002** Admin | Proposed; every matrix cell `denied` | No effective action. Any attempt resolves to denial; no administer path exists in this architecture | `[SRC: business_model.md#§6.2]` `[TBD-BIZ-004]` |
| **ROLE-003** Author | Proposed; every matrix cell `denied` | No effective action; no draft store is designed | `[SRC: business_model.md#§6.2]` `[TBD-BIZ-004]` |
| **ROLE-004** Auditor | Proposed; blocked | No effective action; no audit read path exists | `[CONFLICT-001]` `[TBD-BIZ-009]` |
| **SYS-001** | Effective system actor | Verifies a local credential; creates a session and binds the account | `[SRC: business_model.md#§6.4]` |
| **SYS-002** | Effective system actor | Sends a prompt to the configured model; appends an assistant message only after success | `[SRC: business_model.md#§6.4]` |
| **SYS-003** | Partly effective | Validates a registry entry and resolves recorded state; storing a registry entry is `denied` | `[SRC: business_model.md#§6.4]` `[TBD-BIZ-004]` |
| **SYS-004** | Effective system actor | Creates a manual run; executes a step; finalizes a run as `Succeeded` or `Failed` | `[SRC: business_model.md#§6.4]` |
| **SYS-005** | Denied | MCP connection test, tool invocation, and secret-value read are all `denied` | `[SRC: business_model.md#§6.4]` |
| **SYS-006** | Denied | Append an audit event is `denied` because no audit obligation is confirmed | `[TBD-BIZ-009]` |
| **EXT-001** Registered MCP server | External dependency | Receives no tool arguments in the confirmed MVP; may not read conversations or registry content; receives no credential value | `[SRC: business_model.md#§6.4]` `[TBD-BIZ-007]` |
| **EXT-002** Model provider | External dependency | Receives prompt context only within an unconfirmed data boundary; receives no credential value | `[SRC: business_model.md#§6.4]` `[TBD-BIZ-003]` `[TBD-INFRA-009]` |
| **EXT-003** Search provider | Reserved | Receives no query; search is excluded | `[SRC: business_model.md#§3.2 CAP-008]` `[TBD-INFRA-011]` |

### 3.2 Workspace boundary and the single-workspace assumption

The product is one internal, team-controlled workspace instance. Multi-tenancy, a marketplace, billing, and a vendor control plane are excluded. `[SRC: business_model.md#§3.3]` `[SRC: business_model.md#§12.3]` `[SRC: BR-007]`

- **Single-workspace assumption.** No tenant, workspace, or organization identifier is modeled in the domain, and no module scopes reads by tenant. This is an architecture assumption consistent with BR-007; if multi-tenancy (`CAP-023`) were later confirmed, every module boundary and every uniqueness key in §5 would need revalidation. `[SRC: business_model.md#§3.2 CAP-023]`
- **Deployment condition, not topology.** BR-007 constrains where the product runs and forbids a required vendor control plane. Hosting, network layout, and process topology are `docs/09_deployment/`, not this document. `[SRC: BR-007]`
- **No administration, operations, audit, or run-index surface.** The backend exposes no effective path to create a registry record, administer an account, read audit, or list all runs. `[SRC: business_model.md#§6.2]` `[SRC: interaction_design.md#§1.4]`

### 3.3 Context diagram (text)

```text
ROLE-001 (person)                       ROLE-002/003/004 (proposed, denied)
      |  local credential, message, run request           |  no effective request
      v                                                   v
+--------------------------- hound-dock workspace boundary ---------------------------+
|  MOD-01 Identity/Session   MOD-02 Conversation/Chat   MOD-03 Registry Read          |
|  MOD-04 Run Orchestration  MOD-05 Policy/Access       MOD-06 Observability          |
|  MOD-07 External Ports     MOD-08 Change/Audit (reserved)                            |
|  single workspace; no tenant concept; no admin console; no audit viewer; no run index |
+---------+--------------------------+---------------------------+---------------------+
          | PORT-02                  | PORT-03 (reserved)        | PORT-04 (reserved)
          v                          v                           v
     EXT-002 model             EXT-001 MCP server           EXT-003 search
```

Tag: the modules and ports are architecture-local; the surrounding actors and external dependencies resolve to `business_model.md` §6.4 and §6.2. `[DERIVED: §4 and §3.1]`

### 3.4 External dependencies in the effective scope

| Dependency | Why it is needed | Confirmed constraint | Unresolved |
|---|---|---|---|
| Model provider (EXT-002) | CAP-001 and BR-002 require a model response | One configured model endpoint is assumed; zero external content before the boundary closes | Provider, gateway, residency `[TBD-INFRA-009]`; data boundary `[TBD-BIZ-003]`; egress target `[NFR-008]` |
| MCP server (EXT-001) | CAP-003 requires a recorded server and recorded health | A recorded server may be listed; tool invocation is denied | Execution model `[TBD-BIZ-007]`; registration authority `[TBD-BIZ-004]` |
| Search provider (EXT-003) | None in the confirmed MVP | Excluded | `[TBD-INFRA-011]` `[TBD-BIZ-011]` |

The model dependency is effective even though no provider is selected; the architecture treats it as a port with an explicit egress decision point (§4, `PORT-02`). `[DERIVED: BR-002 and NFR-008]`

## 4. Module boundaries

### 4.1 Module register

| MOD | Responsibility | Owned concepts | Allowed dependencies | Explicit non-responsibilities | Status |
|---|---|---|---|---|---|
| **MOD-01** Identity and Session | Verify a workspace-local credential; create a session bound to one account; expose the authenticated actor to every other module | Account identity (`ENT-001`); Session (architecture concept sourced from FLOW-001 N2, not an `ENT`); credential-verification result | MOD-05; `PORT-01` | Account administration, invitation, recovery, disabled-account handling, role assignment, SSO, sign-out | Effective for sign-in only `[SRC: BR-001]` `[TBD-BIZ-004]` `[TBD-BIZ-013]` |
| **MOD-02** Conversation and Chat | Create a conversation for the signed-in owner; append the user message; request one assistant reply; append exactly one assistant message on success | `ENT-003` Conversation; `ENT-004` Message | MOD-01; MOD-05; `PORT-01`; `PORT-02` | Citations, search, skill selection, tool calls, message edit or delete, titles, pinning, export | Effective `[SRC: BR-002]` `[SRC: CAP-001]` |
| **MOD-03** Registry Read | Resolve and list recorded registry entries read-only; check that a referenced entry is recorded; expose recorded health | Read projections of `ENT-006`, `ENT-007` (label only), `ENT-008`, `ENT-009` (count only), `ENT-011`, `ENT-012` (label), `ENT-013` (composition) | MOD-05; `PORT-01` | Create, edit, publish, deprecate, register, test, allowlist, retire, discover, invoke, read a secret value, accept a submission | Read-only effective; write paths reserved `[SRC: BR-003]` `[SRC: BR-004]` `[SRC: BR-005]` |
| **MOD-04** Run Orchestration | Create one manual run from one command; record run-step records; advance `STATE-001`/`STATE-002`; finalize terminal outcome; expose the failed step | `ENT-014` Run; `ENT-015` Run Step | MOD-03; MOD-05; `PORT-01`; `PORT-03`; `PORT-07` | Scheduling, cron, webhook, event or queue triggers; automatic retry; branching; approvals; artifacts; cost; cancellation | Effective for creation and outcome; step semantics reserved `[SRC: BR-005]` `[SRC: BR-006]` `[SRC: BR-008]` `[TBD-BIZ-007]` |
| **MOD-05** Policy and Access | Evaluate the effective permission matrix for an actor, an action, and a target ownership relation; return `allowed`, `denied`, `own-only`, or `read-only`; apply default deny | The effective policy decision; no business record | None from the application modules; reads the effective matrix as a static rule set | Authenticating; storing or creating roles; managing accounts; granting anything not in the effective matrix | Effective; single confirmed role `[SRC: business_model.md#§6.2]` `[DERIVED: default deny]` |
| **MOD-06** Observability and Operations | Observe emitted domain events and operational signals; produce operational log records for run reference, actor, and error code | Operational log records (not business records) | MOD-05 for the actor check; the event emitters | Audit events, audit viewer, audit export, retention, business-record writes | Effective in principle; thresholds and audit scope open `[NFR-010]` `[TBD-BIZ-009]` |
| **MOD-07** External Integration Ports | Hold the outbound boundary definitions and the egress gate; route every external call through a declared port | Port contracts; no business state | `PORT-02`, `PORT-03`, `PORT-04`, `PORT-05` | Selecting a provider; hiding a provider behind a business rule; MCP runtime, registration, or allowlisting | Effective boundary; providers unresolved `[TBD-INFRA-009]` `[TBD-BIZ-003]` |
| **MOD-08** Change and Audit Reservation | Reserved holder for `ENT-017` and any future change-record obligation | `ENT-017` only, and only as a reserved concept | None effective | Any audit store, viewer, export, retention rule, or write path | `proposed — reserved; not implemented` `[TBD-BIZ-009]` |

### 4.2 Ports

| PORT | Boundary | Direction | Effective need | Unresolved selection | Status |
|---|---|---|---|---|---|
| `PORT-01` | Record store | Outbound from MOD-01, -02, -03, -04 | Persist accounts, sessions, conversations, messages, runs, run steps, and registry records | Store technology `[TBD-INFRA-003]`; durability target `[NFR-012]` | Effective boundary, unresolved store |
| `PORT-02` | Model access | Outbound from MOD-02 via MOD-07 | Required by BR-002 | Provider, gateway, residency `[TBD-INFRA-009]`; egress permission `[TBD-BIZ-003]` | Effective boundary, unresolved provider |
| `PORT-03` | Step target execution | Outbound from MOD-04 via MOD-07 | Required by the `STATE-002` transition that invokes a step target | Execution model `[TBD-BIZ-007]`; MCP invocation is `denied` for SYS-005 | Declared; behavior reserved |
| `PORT-04` | Search access | Outbound from no effective module | None | `[TBD-INFRA-011]` `[TBD-BIZ-011]` | Reserved |
| `PORT-05` | Credential and secret resolution | Outbound from MOD-07 | None effective; `ENT-010` is proposed | `[TBD-BIZ-003]`; `CAND-021` is a candidate only | Reserved |
| `PORT-06` | Operational log sink | Outbound from MOD-06 | Required to operate the product | Log sink `[TBD-INFRA-004]`; audit separation `[TBD-BIZ-009]` | Effective boundary |
| `PORT-07` | Time source | Inbound to MOD-04 | Required for step duration and terminal ordering recorded by `STATE-002` | Clock source is a deployment detail | Architecture assumption `[DERIVED: STATE-002 action “record duration”]` |

### 4.3 Dependency rules

- **D1.** MOD-05 is called by MOD-01, MOD-02, MOD-03, MOD-04, and MOD-06 before any effect on a business record. No module evaluates a permission by itself. `[DERIVED: NFR-007 requires server-side enforcement of every matrix cell]`
- **D2.** MOD-05 depends on no application module and holds no business record. An architecture assumption: the matrix is evaluated from the confirmed static rule set; there is no policy store in the effective scope. `[DERIVED: business_model.md#§6.2]`
- **D3.** MOD-03 is read-only. No module may request a registry write, and MOD-03 must fail such a request rather than degrade into a write. `[SRC: BR-003]` `[SRC: BR-004]` `[SRC: BR-005]`
- **D4.** MOD-02 must not read registry records or call `PORT-03`. Chat has no skill selection, tool call, or citation in the effective scope. `[SRC: CAP-001]` `[SRC: CAP-036]`
- **D5.** MOD-04 creates a run only from `CMD-04`. No timer, schedule, webhook, event, queue consumer, or internal caller may create a run. `[SRC: BR-006]`
- **D6.** MOD-04 never writes a conversation or message; MOD-02 never writes a run or run step. Aggregate ownership follows §5.2. `[DERIVED: STATE-001 actor is SYS-004 only]`
- **D7.** MOD-04 is the only writer of run and run-step state. One writer per run, including the terminal transition. `[DERIVED: STATE-001/002 name SYS-004 for every transition]`
- **D8.** MOD-01 does not depend on MOD-02, MOD-03, or MOD-04. An unauthenticated request reaches no application module. `[SRC: FLOW-001]`
- **D9.** MOD-06 must not write a business record and must not be on the critical path of a business effect. An operational log failure does not fail a chat, run, or sign-in. `[DERIVED: audit is reserved and logs are not audit]`
- **D10.** MOD-08 is depended on by no effective module. No code path may emit an audit record. `[TBD-BIZ-009]`
- **D11.** Every outbound external call passes through MOD-07 and a declared port. No module opens a direct connection to EXT-001, EXT-002, or EXT-003. `[TBD-BIZ-003]` `[TBD-INFRA-009]`

## 5. Domain model

### 5.1 Entity adjudication

`Class` uses §2. The business key is the one stated by the business model, restated here, not redefined. `[SRC: business_model.md#§5.1]`

| ENT | Concept | Class | Business key and cardinality | Owning module | State model | Tag |
|---|---|---|---|---|---|---|
| **ENT-001** Account | A person's workspace identity, provisioned as a local account | Effective core (identity only) | Sign-in name unique in the workspace; 1 account owns 0..N conversations and initiates 0..N runs | MOD-01 | STATE-006 reserved | `[SRC: BR-001]` `[TBD-BIZ-013]` |
| **ENT-002** Role Assignment | A role held by an account | Reserved — proposed | (account, role name) unique; N assignments per account | None effective; MOD-05 would consume it | None | `[TBD-BIZ-004]` `[CONFLICT-001]` |
| **ENT-003** Conversation | A persisted exchange between one person and the assistant | Effective core | Conversation reference unique within the owner's account; 1..N messages per conversation | MOD-02 | None — create and continue only | `[SRC: BR-002]` |
| **ENT-004** Message | One turn authored by the person or the assistant | Effective core | (conversation, position) unique | MOD-02 | None | `[SRC: BR-002]` |
| **ENT-005** Citation | A source shown in support of an answer | Reserved — proposed | (assistant message, ordinal) unique | None | None | `[TBD-BIZ-011]` `[TBD-INFRA-011]` |
| **ENT-006** Skill | A recorded instruction bundle | Effective core (record only) | Skill name unique in the workspace; 1..N versions per skill | MOD-03 read only; write authority unassigned | STATE-003 reserved | `[SRC: BR-003]` `[TBD-BIZ-004]` |
| **ENT-007** Skill Version | An immutable snapshot of a skill | Reserved — proposed; a version label may be read as proposed metadata | (skill name, version label) unique | MOD-03 read label only | STATE-003 reserved | `[TBD-BIZ-004]` `[TBD-BIZ-007]` |
| **ENT-008** MCP Server | A recorded MCP endpoint with recorded health | Effective core (record only) | Server name unique in the workspace | MOD-03 read only | STATE-004 transitions reserved | `[SRC: BR-004]` `[SRC: CAP-003]` |
| **ENT-009** MCP Tool | A tool discovered on a recorded server | Reserved — proposed | (server name, tool name) unique | None; the read path exposes a count only | None | `[TBD-BIZ-004]` `[AGAP-07]` |
| **ENT-010** Secret Reference | A governed pointer to a credential | Reserved — proposed | Reference name plus purpose, unique | None; `PORT-05` reserved | None | `[TBD-BIZ-003]` |
| **ENT-011** Task Definition | A recorded ordered composition of registered targets | Effective core (record only) | Task name unique in the workspace; 1..N versions per definition | MOD-03 read only; write authority unassigned | STATE-005 reserved | `[SRC: BR-005]` |
| **ENT-012** Task Version | An immutable snapshot of a task definition | Structurally required by BR-005 run attribution | (task name, version label) unique; used by 0..N runs | MOD-03 read; MOD-04 records the reference | STATE-005 reserved | `[DERIVED: BR-005 requires one recorded task version per run]` |
| **ENT-013** Task Step | One ordered instruction in a task version | Structurally required as a minimal ordered record | (task version, ordinal) unique and contiguous | MOD-03 read composition | None — frozen with its version | `[SRC: FLOW-003 N4]` `[TBD-BIZ-007]` |
| **ENT-014** Run | One manual execution of a task version by a signed-in person | Effective core | Run reference unique in the workspace; 1..N run steps per run | MOD-04 | STATE-001 effective | `[SRC: BR-005]` `[SRC: BR-006]` |
| **ENT-015** Run Step | The execution record of one task step | Structurally required by effective STATE-002 | (run reference, ordinal) unique | MOD-04 | STATE-002 effective | `[SRC: STATE-002]` `[DERIVED: §5.5 anomaly]` |
| **ENT-016** Artifact | A file or output produced by a run | Reserved — proposed | (run reference, artifact name) unique | None | None | `[SRC: business_model.md#§6.2 Artifact.read denied]` `[TBD-BIZ-003]` |
| **ENT-017** Audit Event | An append-only record of a consequential action | Reserved — proposed | Event reference, append-only | MOD-08 reserved | None | `[TBD-BIZ-009]` |
| **ENT-018** Model Configuration | The model endpoint used by chat | Reserved as a record; the external dependency behind it is effective | Configuration name unique; one active configuration | None; `PORT-02` carries the need | None | `[TBD-INFRA-009]` |

### 5.2 Aggregates and transaction anchors

| Aggregate | Root | Members | Consistency boundary | Tag |
|---|---|---|---|---|
| Conversation | `ENT-003` | `ENT-004` messages, ordered by position | One message append and the assistant reply's single append; the conversation is the serialization point for message position | `[DERIVED: ENT-004 business key]` |
| Run | `ENT-014` | `ENT-015` run steps, ordered by ordinal | Run creation; each step transition; the terminal transition with remaining skips | `[DERIVED: STATE-001/002]` |
| Account identity | `ENT-001` | Session (architecture concept) | One credential verification and its session creation | `[SRC: FLOW-001 N2]` |
| Registry record | `ENT-006`, `ENT-008`, `ENT-011` | Version and step records | Reserved; no effective writer | `[TBD-BIZ-004]` |

Ordering is by business ordinal, not by timestamp. Run-step ordinals are contiguous and authoritative; message positions are unique within the conversation. `[SRC: ENT-013 business key]` `[SRC: ENT-004 business key]`

### 5.3 Sourced invariants

Only statements that trace to the inputs appear here. No new invariant is introduced.

1. Every conversation has exactly one owning account; every run has exactly one initiating account. `[DERIVED: BR-002, BR-005, BR-006]`
2. A run uses exactly one task version and has at least one run step. `[DERIVED: BR-005]`
3. A published skill version or task version is immutable; a correction creates a new version. `[TBD-BIZ-004]` — reserved, not effective.
4. A secret reference never contains a credential value. `[TBD-BIZ-003]` — reserved, not effective.
5. An audit event is append-only. `[TBD-BIZ-009]` — reserved, not effective.
6. No entity is hard-deleted while a run or an audit event refers to it; retention and deletion are open. `[TBD-BIZ-003]` — reserved, not effective.
7. A disabled account cannot authenticate or initiate new work; existing objects keep owner attribution until an offboarding policy is confirmed. `[TBD-BIZ-004]` `[TBD-BIZ-013]` — reserved, not effective.
8. No effective command mutates an appended message. Message immutability is stated as proposed; the architecture adds no mutating path. `[SRC: business_model.md#§5.1 ENT-004]` `[DERIVED: no effective command updates a message]`
9. A terminal run is immutable: `Succeeded` and `Failed` have no outgoing transition. `[DERIVED: STATE-001 terminal states]`
10. A failed step is visible to the initiating account, and remaining steps are `Skipped`. `[SRC: BR-008]`
11. There is no automatic retry of a failed step, a failed model call, or a failed run. `[DERIVED: FLOW-003 failure note; BR-008 exceptions; CAP-006 excluded]`

### 5.4 Ownership and attribution consequences

- `ENT-006`, `ENT-011`, and `ENT-014` carry owner or initiator attribution. `ROLE-001` `Account.read` is `denied`, so the read path may not expose an owner name or another account's identity; own-only scoping is applied to runs. `[SRC: business_model.md#§6.2]` `[AGAP-06]`
- Registry records have no effective write authority. The architecture leaves the records possibly empty and does not seed, fake, or import entries. `[SRC: TBD-BIZ-004]` `[SRC: interaction_design.md#§1.4]`

### 5.5 Recorded tensions in the inputs (not resolved here)

- **ENT-015 anomaly.** `ENT-015` is marked `Proposed` in §5.1, while `STATE-002` for the run step is effective. The architecture therefore treats the run-step record as structurally required (§5.1) and does not implement the proposed parts of its lifecycle beyond the effective transitions. `[SRC: business_model.md#§5.1 ENT-015]` `[SRC: business_model.md#§7.2 STATE-002]`
- **Run with no step results.** Invariant 2 requires at least one run step, while `STATE-001` permits `Initiated → Failed` with “record no step results”, and the interaction design distinguishes that case. This document reads “no step results” as “no step was started and no result exists”; whether zero run-step records are permitted is left open. The terminal outcome must still be visible. `[SRC: STATE-001]` `[SRC: interaction_design.md#§6.10]` `[DERIVED: BR-008 visibility]`
- **Message immutability.** Stated as proposed, yet no effective command updates a message. The architecture relies on the absence of a command, not on a confirmed immutability rule. `[SRC: business_model.md#§5.1 ENT-004]`
- **Recorded health.** CAP-003 requires a server's recorded health to be visible, while `STATE-004` is proposed. A recorded health value is structurally required; the health transitions are not. `[SRC: CAP-003]` `[SRC: business_model.md#§7.4 STATE-004]`
- **Role binding.** ROLE-001 is the only confirmed role, but no rule states that every local account holds it, and no role-assignment flow is effective. MOD-05 evaluates the matrix for ROLE-001 and has no effective path to bind another role; the open authority question remains `TBD-BIZ-004`. `[SRC: business_model.md#§6.1]` `[TBD-BIZ-004]`
- **Proposed versions, required references.** `ENT-012` and `ENT-013` are marked proposed, yet BR-005 requires a run to record one task version and FLOW-003 executes ordered steps. They are treated as minimal required records, in the same class as `ENT-015`. `[DERIVED: BR-005 and FLOW-003 N4]`

## 6. State machines

### 6.1 STATE-001 — Run (ENT-014), effective

| State | Entry condition | Terminal | Tag |
|---|---|---|---|
| `Initiated` | SYS-004 accepts a valid manual run request and binds the initiating account | No | `[SRC: STATE-001]` |
| `Running` | At least one run step is `Running` | No | `[SRC: STATE-001]` |
| `Succeeded` | Every run step is `Succeeded` | Yes | `[DERIVED: BR-008]` |
| `Failed` | A step failed or timed out, or the runner rejected the run | Yes | `[DERIVED: BR-008]` |

| From | To | Trigger | Guard | Actor | Failure destination | Tag |
|---|---|---|---|---|---|---|
| `Initiated` | `Running` | First step starts | `run.step_count >= 1 AND target.registered == true` | SYS-004 | `Failed` | `[DERIVED: BR-005]` |
| `Initiated` | `Failed` | Runner rejects before any step | `task_version.valid == false OR target.available == false` | SYS-004 | `Failed` (terminal) | `[DERIVED: BR-005, BR-008]` |
| `Running` | `Succeeded` | Last step succeeds | `run_step.failed_count == 0 AND run_step.pending_count == 0` | SYS-004 | `Failed` if the outcome cannot be persisted | `[DERIVED: BR-008]` |
| `Running` | `Failed` | A step fails or times out | `run_step.failed_count >= 1 OR step.timeout == true` | SYS-004 | `Failed` (terminal) | `[DERIVED: BR-008]` |

Architecture rules for `STATE-001`:

1. Only MOD-04 advances this machine; no other module writes a run state. `[DERIVED: §4.3 D7]`
2. Terminal states are immutable. No command, compensation, or operator action mutates a `Succeeded` or `Failed` run. `[DERIVED: STATE-001 terminal states have no outgoing transition]`
3. The machine has no `Cancelled`, `Queued`, `Paused`, or `Retried` state. Adding one would extend the business model. `[SRC: STATE-001]` `[CAP-006 excluded]`
4. No schedule, webhook, or event creates a run; the only entry is `CMD-04`. `[SRC: BR-006]`
5. There is no automatic retry. A new attempt is a new run through `CMD-04`. `[DERIVED: FLOW-003]`

### 6.2 STATE-002 — Run Step (ENT-015), effective

| State | Entry condition | Terminal | Tag |
|---|---|---|---|
| `Pending` | The run is created, or a prior step succeeds | No | `[DERIVED: BR-005]` |
| `Running` | SYS-004 starts the step | No | `[DERIVED: BR-008]` |
| `Succeeded` | The target returns a successful result | Yes | `[DERIVED: BR-008]` |
| `Failed` | The target returns an error or times out | Yes | `[DERIVED: BR-008]` |
| `Skipped` | A predecessor failed | Yes | `[DERIVED: BR-008]` |

| From | To | Trigger | Guard | Actor | Failure destination | Tag |
|---|---|---|---|---|---|---|
| `Pending` | `Running` | Runner starts the step | `run.state == "Running" AND target.registered == true` | SYS-004 | `Failed` | `[DERIVED: BR-005]` |
| `Pending` | `Skipped` | A predecessor failed | `predecessor.state == "Failed"` | SYS-004 | `Failed` for the run | `[DERIVED: BR-008]` |
| `Running` | `Succeeded` | Target returns success | `result.present == true` | SYS-004 | `Failed` if the result cannot be stored | `[DERIVED: BR-008]` |
| `Running` | `Failed` | Error or timeout | `error.present == true OR step.timeout == true` | SYS-004 | `Failed` (terminal for the step) | `[DERIVED: BR-008]` |

Architecture rules for `STATE-002`:

1. Step terminals are immutable; a skipped step is terminal and is never later executed. `[DERIVED: STATE-002]`
2. A failed step is visible to the initiator, together with its error, and remaining steps are `Skipped`. `[SRC: BR-008]`
3. Step duration and result summary are recorded when the target returns; the duration source is `PORT-07`. `[DERIVED: STATE-002 action]`
4. The step target is invoked through `PORT-03`. The execution semantics of a skill or MCP tool are unresolved, so a step may fail for a reason the architecture does not define. `[TBD-BIZ-007]`
5. `run_step.pending_count == 0 AND failed_count == 0` is the only path to a succeeded run. `[SRC: BR-008]`

### 6.3 Reserved state machines

- **STATE-003 — Skill Version.** `proposed — reserved; not implemented`. Version publication, deprecation, supersession, and discard are named by the business model but rest on an unconfirmed publication authority. This architecture defines no version write record, no transition, and no guard, and no module may advance it. `[TBD-BIZ-004]`
- **STATE-004 — MCP Server health.** `proposed — reserved; not implemented`. The effective scope shows a recorded health value on the registry read surface; connection testing, authentication recovery, error transition, and retirement are not designed, and SYS-005 is `denied` every such action. `[TBD-BIZ-004]` `[SRC: business_model.md#§6.4]`
- **STATE-005 — Task Version.** `proposed — reserved; not implemented`. Draft, published, retired, superseded, and discarded are named but not designed; a run refers to a task version as a recorded reference only. `[TBD-BIZ-004]`
- **STATE-006 — Account.** `proposed — reserved; not implemented`. Invitation, disable, re-enable, and delete are not designed; account administration is excluded and MOD-01 exposes sign-in only. `[TBD-BIZ-004]` `[TBD-BIZ-013]`

## 7. Command, query, and event catalog

No transport, endpoint, path, verb, payload shape, or field name is defined here. The interface contract belongs to `docs/05_api/`. `[DERIVED: CHG-010 Plan]`

### 7.1 Commands

| CMD | Intent | Actor / system | Preconditions | State effect | Idempotency and consistency | Status |
|---|---|---|---|---|---|---|
| **CMD-01** | Sign in with a local credential | ROLE-001 person; SYS-001 executes | A local account exists; a credential is presented; no external identity path | One session is created and bound to the account; no business record changes | Not idempotent by intent: each verified credential may create a session. No session-expiry or single-session rule exists (`AGAP-01`). Concurrent attempts are not excluded by any rule | Effective `[SRC: BR-001]` `[SRC: FLOW-001 N2]` |
| **CMD-02** | Create a conversation | ROLE-001, own-only; MOD-02 executes | Active session; `Conversation.chat` is `own-only` for the actor | Exactly one new conversation owned by the actor with zero messages | Not idempotent and no caller-supplied natural key: a repeated submission creates a second conversation. Two concurrent creates by one owner are permitted; the owner sees both | Effective `[SRC: BR-002]` `[SRC: business_model.md#§6.2]` |
| **CMD-03** | Append a user message and request one assistant reply | ROLE-001, own-only; SYS-002 and MOD-02 execute | Active session; the conversation belongs to the actor; `message.text.length > 0`; `Message.read` scope is `own-only` | The user message is appended at the next position. Exactly one assistant message is appended only if a model response is returned; on failure the user message remains and no assistant message exists | Not idempotent: the same text sent twice is two turns, distinguished by position. The conversation is the serialization point for position. One pending message per conversation is an interaction rule, not a business rule; the backend must still define behavior for a concurrent second arrival, which is an architecture assumption resolved as a position conflict rather than a silent merge | Effective `[SRC: BR-002]` `[SRC: interaction_design.md#§5.4]` |
| **CMD-04** | Start one manual run of a recorded task | ROLE-001, `Run.initiate` allowed; SYS-004 executes | Active session; the task definition is `recorded`; the task version is identified; inputs are valid; initiator account is non-null; the trigger is manual | One run is created in `Initiated` with the initiator and the task version, with run-step records for the version's ordered steps. Creation is not completion: the command's effect ends at run creation, and later transitions are the orchestrator's | No idempotency key and no dedup window: a repeated submission may create a second run (`AGAP-02`). A lost response leaves the run start unconfirmed (`AGAP-03`). A rejected run exists in `Failed`; a failed creation creates no run | Effective `[SRC: BR-005]` `[SRC: BR-006]` `[SRC: FLOW-003 N3]` |

### 7.2 Commands that do not exist

| Absent intent | Why it is absent | Re-entry condition |
|---|---|---|
| Sign out or terminate a session | No business rule or TBD states how a session ends | `AGAP-01` |
| Edit, delete, pin, rename, or export a conversation | `CAP-018` excluded; no grant exists | `[TBD-BIZ-011]` |
| Retry a failed run or step in place | BR-008 defines no retry policy; only a new run is permitted | `[TBD-BIZ-007]` |
| Create, publish, deprecate, or discard a skill or task | No confirmed authority; `Skill.publish` and `TaskDefinition.publish` are `denied` for every role | `[TBD-BIZ-004]` |
| Register, test, allowlist, retire, or invoke an MCP server or tool | No confirmed authority; `McpServer.register`, `McpTool.allowlist`, `McpTool.invoke` are `denied` | `[TBD-BIZ-004]` `[TBD-BIZ-007]` |
| Read audit, export audit, or view all runs | `Audit.read` and `Run.read` for other actors are `denied` | `[TBD-BIZ-009]` `[CONFLICT-001]` |
| Manage accounts, roles, or credentials | Account administration is excluded from the confirmed MVP | `[TBD-BIZ-004]` `[TBD-BIZ-013]` |

### 7.3 Queries

Queries never mutate state. Each query is scoped by MOD-05 before the read. `[DERIVED: business_model.md#§6.2]`

| QRY | Intent | Actor / system | Scope | Empty and not-found behavior | Status |
|---|---|---|---|---|---|
| **QRY-01** | List the actor's own conversations | ROLE-001 | `Conversation.read` = `own-only`; other owners' conversations are excluded from the result | No conversations is a valid empty result, not an error | Effective `[SRC: BR-002]` |
| **QRY-02** | Read one own conversation and its messages | ROLE-001 | `own-only`; a non-owned reference is indistinguishable from an unknown reference | Unknown and non-owned both resolve to the same unavailable outcome, with no title, owner, or count | Effective `[SRC: BR-002]` `[SRC: interaction_design.md#§5.5]` |
| **QRY-03** | Read one own run and its run steps | ROLE-001 | `Run.read` and `RunStep.read` = `own-only`; another initiator's run is unavailable | Unknown and non-owned resolve identically; a run rejected before any step shows no step results | Effective `[SRC: BR-008]` |
| **QRY-04** | List recorded skills | ROLE-001 | `Skill.read` = `read-only`; only recorded skills appear | Zero recorded skills is a valid empty result; the response must not be presented as a failure | Effective `[SRC: BR-003]` |
| **QRY-05** | Read one recorded skill | ROLE-001 | `read-only`; an unrecorded reference is rejected and not resolvable | No record, no partial record; a version label, if present, is proposed metadata | Effective `[SRC: BR-003]` |
| **QRY-06** | List recorded MCP servers with recorded health | ROLE-001 | `McpServer.read` = `read-only`; no secret value, no tool name | Zero recorded servers is a valid empty result | Effective `[SRC: BR-004]` `[SRC: CAP-003]` |
| **QRY-07** | Read one recorded MCP server | ROLE-001 | `read-only`; individual tools and allowlist flags are withheld | Unknown server resolves to not recorded | Effective `[SRC: BR-004]` `[AGAP-07]` |
| **QRY-08** | List recorded task definitions | ROLE-001 | `TaskDefinition.read` = `read-only`; version label and step count are proposed metadata | Zero recorded tasks is a valid empty result | Effective `[SRC: BR-005]` |
| **QRY-09** | Read one recorded task definition and its declared inputs and composition | ROLE-001 | `read-only`; provides the input contract for `CMD-04` | An unrecorded task is rejected, and no run form data is returned | Effective `[SRC: BR-005]` `[SRC: FLOW-003 N1]` |

No query lists all runs, all conversations, or audit. No query returns an account record, an owner display name, an artifact, a secret, a model configuration, or a search result. `[SRC: business_model.md#§6.2]`

### 7.4 Events

Events are internal observations. No consumer is designed in the effective scope, no delivery guarantee or replay is promised, and no event is an audit record. A failed emission must not fail or roll back the business effect. `[DERIVED: §4.3 D9]` `[TBD-BIZ-009]`

| EVT | Emitted when | Emitter | Observable concepts | Consumer in effect | Status |
|---|---|---|---|---|---|
| **EVT-01** | A conversation is created | MOD-02 | Owner scope, conversation reference | None | Effective observation |
| **EVT-02** | A user message is appended | MOD-02 | Conversation reference, position, author kind | None | Effective observation |
| **EVT-03** | An assistant reply is appended successfully | MOD-02 | Conversation reference, position, outcome | None | Effective observation |
| **EVT-04** | A model call fails and no assistant message is appended | MOD-02 | Conversation reference, failure kind | None | Effective observation; no entity is recorded |
| **EVT-05** | A run is created | MOD-04 | Run reference, initiator, task version | None | Effective observation |
| **EVT-06** | A run step starts | MOD-04 | Run reference, ordinal, target kind | None | Effective observation |
| **EVT-07** | A run step succeeds | MOD-04 | Run reference, ordinal, duration | None | Effective observation |
| **EVT-08** | A run step fails or times out | MOD-04 | Run reference, ordinal, failure kind | None | Effective observation |
| **EVT-09** | A run step is skipped | MOD-04 | Run reference, ordinal, failed predecessor | None | Effective observation |
| **EVT-10** | A run is finalized as `Succeeded` | MOD-04 | Run reference, terminal state | None | Effective observation |
| **EVT-11** | A run is finalized as `Failed` | MOD-04 | Run reference, terminal state, failed step | None | Effective observation |

## 8. Consistency, concurrency, and idempotency

### 8.1 Transaction boundaries

| Operation | Atomic unit | Must not happen | Tag |
|---|---|---|---|
| Sign in | Credential verification result and session creation | A session attributable to an unverified or externally asserted identity; an account-existence signal | `[SRC: BR-001]` |
| Create conversation | Conversation creation with its owner | A conversation with no owner or with two owners | `[SRC: BR-002]` `[DERIVED: invariant 1]` |
| Send message, part 1 | The user message append at the next position | A model call before the user message exists; the user message being discarded because the model failed | `[DERIVED: FLOW-002 F2 keeps the message]` |
| Send message, part 2 | The single assistant message append | Two assistant messages for one successful response; an assistant message on failure; a partial answer presented as complete | `[SRC: BR-002]` |
| Run creation | The run, its initiator, the task version reference, and its run-step records | A run with no initiator, no task version, or no steps; a partially created run | `[DERIVED: BR-005, invariant 2]` |
| Step transition | One step state change and its result or error summary | A state change without its recorded result; two writers on one step | `[DERIVED: STATE-002]` |
| Terminal transition | The failed step, the remaining `Skipped` steps, and the run's terminal state | A visible `Failed` step under a run still reported as `Running` or `Succeeded`; a terminal run still accepting a step | `[DERIVED: BR-008]` |

The store's transaction mechanism is unresolved. These are required atomicity boundaries, not a schema or a locking design. `[TBD-INFRA-003]`

### 8.2 Concurrency

- **One writer per run.** MOD-04 alone advances a run. Two concurrent requests to start the same run twice are two creations, not two writers on one run. `[DERIVED: §4.3 D7]`
- **One writer per conversation position.** Message position assignment is serialized on the conversation. `[DERIVED: ENT-004 business key]`
- **Optimistic concurrency option.** A technology-neutral option is a per-aggregate version marker: a transition reads the current version, writes conditionally on the same version plus one, and treats a mismatch as a conflict with no partial effect. This is an architecture option, not a decision; the store and the conflict representation remain open. `[TBD-INFRA-003]`
- **No optimistic lock is required to invent a timeout.** Any lock, lease, or conflict retry policy would be a new decision; none is specified. `[DERIVED: CHG-010 Plan risk 4]`
- **Session concurrency.** Multiple simultaneous sessions for one account are not forbidden by any effective rule; no limit is invented. `[DERIVED: BR-001]`

### 8.3 Idempotency and its limits

| Concern | Position | Tag |
|---|---|---|
| Sign-in repeat | A new verification may create a new session; no dedup key exists | `[DERIVED: BR-001]` |
| Conversation create repeat | Creates a second conversation; the business key is only unique within the owner | `[DERIVED: ENT-003 key]` |
| Message repeat | Creates a second turn at a new position; no client-supplied request key is defined | `[DERIVED: ENT-004 key]` |
| Run submission repeat | **Unresolved.** No rule states whether a repeated submission may create a second run, and no dedup window, idempotency key, or request fingerprint may be invented | `[AGAP-02]` `[SRC: interaction_design.md#§8.2]` |
| Run submission with lost response | **Unresolved.** A run may exist while the initiator sees no reference | `[AGAP-03]` |

The architecture deliberately does not add an idempotency key to `CMD-04`. That would be an interface-contract decision with a business consequence, and the business model leaves duplicate-run reconciliation open. `[DERIVED: CHG-010 Plan risk 4]`

### 8.4 What must not be invented

A dedup window, an idempotency-key format, a queue, a worker pool, a retry count, a backoff, a lock timeout, a transaction isolation level, a session timeout, a run-step timeout value, and a maximum conversation or run size are all outside the inputs. Each remains open; none is defaulted here. `[DERIVED: §2 decision discipline]` `[TBD-BIZ-008]`

## 9. Failure recovery and compensation

Compensation is a new run or a new message. A terminal run, a terminal step, and an appended message are never mutated to hide a failure. `[DERIVED: BR-008; FLOW-003 failure note]`

| Failure | Persisted effect | Visible outcome | Compensation | Tag |
|---|---|---|---|---|
| Model call fails or times out | The user message remains; no assistant message is appended | An error is shown; no partial or invented answer is presented as complete | The person sends a new message; that is a new attempt, not a retry of a stored one | `[SRC: BR-002]` `[SRC: FLOW-002 F2]` |
| Assistant-message append fails | No assistant message; the user message remains | The same error as a model failure; no success is claimed | A new message attempt | `[SRC: BR-002]` `[SRC: FLOW-002 N4/F2]` |
| Run creation fails | No run and no run-step records | An error stating that no run was created; the inputs are retained by the client | Retry the submission as a new `CMD-04` | `[SRC: FLOW-003 F2]` |
| Run rejected before the first step | The run exists in `Failed`; no step starts and no step result is recorded | The initiator sees `Failed` with no step results and a generic rejection notice | A corrected new run | `[SRC: STATE-001]` `[SRC: interaction_design.md#§4.3]` |
| Step fails or times out | The failed step is `Failed`; remaining steps are `Skipped`; the run is `Failed` | The failed step and its error are visible to the initiator | A corrected new run; the failed run is retained unchanged | `[SRC: BR-008]` |
| Terminal state cannot be persisted | No terminal state is recorded; the last durable state remains | The outcome must not be reported as `Succeeded`; the client keeps the last reported state and shows an error | None defined. Recovery would require reconciliation, which is a gap | `[DERIVED: STATE-001 failure destination]` `[AGAP-04]` |
| Process restart with a run in `Running` | The run remains `Running` unless a later write changes it | Possibly stale status to the initiator | **No automatic recovery.** Whether an orphaned run becomes `Failed`, stays `Running`, or is reconciled is unresolved | `[AGAP-04]` `[NFR-012]` |
| Record store unavailable on read | No effect | An error, never an empty registry and never a zero count | Retry the read | `[SRC: interaction_design.md#§5.2]` |
| Record store unavailable on write | No effect for the attempted unit | The operation fails with no partial change; no run, no assistant message, no session | Retry the operation | `[DERIVED: §8.1]` |
| Session store unavailable at sign-in | No session | A generic error; no session is created | A new sign-in attempt | `[SRC: FLOW-001 F2]` |
| Event emission fails | The business effect stands | No user-visible effect; the operational signal is lost | None specified | `[DERIVED: §7.4]` |

A failed run is never edited, retried, resumed, or overwritten. A terminal state is never reversed. `[DERIVED: STATE-001 terminal states]`

## 10. Change and audit reservation

- Domain events (`EVT-01`–`EVT-11`) may be emitted as internal observations. They are not audit events, carry no evidentiary guarantee, and have no effective consumer. `[DERIVED: §7.4]`
- No audit store, audit viewer, audit export, audit filter, or audit retention is designed, because the obligation, the event list, the reader, and the retention are all open. `[TBD-BIZ-009]`
- Operational log records are not audit events. The business model bans “system log” as a synonym for an audit event. `[SRC: business_model.md#§12.3]`
- MOD-08 is reserved and has no write path. `SYS-006` remains `denied`. `[SRC: business_model.md#§6.4]`
- Operating logs may carry a run reference, an initiating account, and an error code, as `NFR-010` proposes; the target and measurement environment are open. No retention period is stated. `[NFR-010]` `[TBD-BIZ-008]`
- Change records (the `CHG-nnn` mechanism) are a documentation obligation outside the product runtime. This document does not treat them as an auditable product event. `[DERIVED: CHG-010 scope]`

## 11. Data ownership and flow

| Concept | Write owner (effective) | Read owner | Nature | Reserved part | Tag |
|---|---|---|---|---|---|
| Account identity | No effective product writer; accounts are provisioned outside the MVP | MOD-01 reads/verifies at sign-in; MOD-05 for the actor binding | Identity record; no self-service read | Account administration and lifecycle | `[SRC: BR-001]` `[TBD-BIZ-004]` |
| Session | MOD-01 | MOD-01 and every module through the actor binding | Ephemeral authentication context; not a business entity | Expiry and termination | `[SRC: FLOW-001 N2]` `[AGAP-01]` |
| Conversation | MOD-02 | MOD-02 via `QRY-01`/`QRY-02` | Owned, single-owner, created and continued only | Rename, pin, delete | `[SRC: BR-002]` |
| Message | MOD-02 via `CMD-03` | MOD-02 | Appended by the effective commands; no mutating command | Immutability as an explicit rule | `[SRC: BR-002]` |
| Skill, MCP server, task definition | **None effective.** No module may write these | MOD-03 | Read projection of recorded entries; possibly empty | All authoring and health transitions | `[SRC: TBD-BIZ-004]` `[SRC: BR-003]` |
| Task version and task step | None effective | MOD-03; MOD-04 records the version reference on a run | Minimal required records for run attribution and ordered steps | Version publication | `[DERIVED: BR-005]` |
| Run and run step | MOD-04 | MOD-04 via `QRY-03`; MOD-06 for operational signals | Append-by-transition; terminal records immutable | History, export, audit | `[SRC: BR-008]` `[TBD-BIZ-009]` |
| Artifact | None | None; `Artifact.read` is `denied` | Reserved | Creation, storage, download | `[TBD-BIZ-003]` |
| Audit event | None; MOD-08 reserved | None | Reserved | All of it | `[TBD-BIZ-009]` |
| Model configuration, secret reference | None | None | Reserved; only `PORT-02` and `PORT-05` carry the need | All of it | `[TBD-INFRA-009]` `[TBD-BIZ-003]` |

Flow summary: a person signs in through MOD-01; MOD-02 appends the user message and the assistant message within the actor's own conversation; MOD-03 resolves recorded task references for MOD-04; MOD-04 creates and drives one run; MOD-06 observes events and emits operational signals; MOD-05 gates every one of these steps; MOD-08 observes nothing. `[DERIVED: §4 and §7]`

## 12. Traceability matrix

### 12.1 Business rules

| BR | Module and command or query | Section | Status |
|---|---|---|---|
| BR-001 | MOD-01; `CMD-01` | §4.1, §7.1, §8.1 | Effective `[SRC: BR-001]` |
| BR-002 | MOD-02; `CMD-02`, `CMD-03`; `QRY-01`, `QRY-02` | §5, §7.1, §7.3, §9 | Effective `[SRC: BR-002]` |
| BR-003 | MOD-03; `QRY-04`, `QRY-05` | §4.1, §7.3, §11 | Effective for the read side; authoring reserved `[SRC: BR-003]` |
| BR-004 | MOD-03; `QRY-06`, `QRY-07`; `PORT-03` reserved | §4.1, §7.3 | Effective for recorded server and health; invocation reserved `[SRC: BR-004]` |
| BR-005 | MOD-04; `CMD-04`; MOD-03 resolution | §5.1, §6.1, §7.1 | Effective for creation and attribution `[SRC: BR-005]` |
| BR-006 | MOD-04; `CMD-04`; §4.3 D5 | §7.1, §7.2 | Effective `[SRC: BR-006]` |
| BR-007 | Workspace boundary; MOD-07 as a function dependency only | §3.2, §3.4 | Effective condition on deployment; topology not designed `[SRC: BR-007]` |
| BR-008 | MOD-04; `STATE-001`, `STATE-002`; `EVT-08`–`EVT-11` | §6.1, §6.2, §9 | Effective `[SRC: BR-008]` |

### 12.2 Flows and states

| Item | Modules | Section | Status |
|---|---|---|---|
| FLOW-001 | MOD-01; MOD-05; `CMD-01` | §3, §7.1 | Effective `[SRC: FLOW-001]` |
| FLOW-002 | MOD-02; MOD-05; `CMD-02`, `CMD-03`; `PORT-02` | §7.1, §8, §9 | Effective `[SRC: FLOW-002]` |
| FLOW-003 | MOD-04; MOD-03; MOD-05; `CMD-04`; `PORT-03` | §6, §7.1, §9 | Effective for initiation and outcome; step semantics reserved `[SRC: FLOW-003]` `[TBD-BIZ-007]` |
| FLOW-004 | MOD-03 read only | §6.3 | `proposed — reserved; not implemented` `[TBD-BIZ-004]` |
| FLOW-005 | MOD-03 read only | §6.3 | `proposed — reserved; not implemented` `[TBD-BIZ-004]` |
| FLOW-006 | MOD-03 read only | §6.3 | `proposed — reserved; not implemented` `[TBD-BIZ-004]` |
| STATE-001 | MOD-04 | §6.1 | Effective `[SRC: STATE-001]` |
| STATE-002 | MOD-04 | §6.2 | Effective `[SRC: STATE-002]` |
| STATE-003 to STATE-006 | None | §6.3 | `proposed — reserved; not implemented` `[TBD-BIZ-004]` |

### 12.3 Entities

| ENT | Module | Section | Class |
|---|---|---|---|
| ENT-001 | MOD-01 | §5.1, §5.2 | Effective core (identity) |
| ENT-002 | None effective | §5.1 | Reserved `[TBD-BIZ-004]` `[CONFLICT-001]` |
| ENT-003 | MOD-02 | §5.1, §5.2 | Effective core |
| ENT-004 | MOD-02 | §5.1, §5.2 | Effective core |
| ENT-005 | None | §5.1 | Reserved `[TBD-BIZ-011]` |
| ENT-006 | MOD-03 read | §5.1, §11 | Effective core (record only) `[SRC: BR-003]` |
| ENT-007 | MOD-03 read label | §5.1 | Reserved |
| ENT-008 | MOD-03 read | §5.1, §11 | Effective core (record only) `[SRC: BR-004]` |
| ENT-009 | None (count only) | §5.1 | Reserved `[AGAP-07]` |
| ENT-010 | None; `PORT-05` | §5.1, §4.2 | Reserved `[TBD-BIZ-003]` |
| ENT-011 | MOD-03 read | §5.1, §11 | Effective core (record only) `[SRC: BR-005]` |
| ENT-012 | MOD-03 read; MOD-04 reference | §5.1, §5.5 | Structurally required `[DERIVED: BR-005]` |
| ENT-013 | MOD-03 read | §5.1 | Structurally required (minimal) |
| ENT-014 | MOD-04 | §5.1, §6.1 | Effective core |
| ENT-015 | MOD-04 | §5.1, §6.2 | Structurally required `[SRC: STATE-002]` |
| ENT-016 | None | §5.1 | Reserved `[TBD-BIZ-003]` |
| ENT-017 | MOD-08 reserved | §5.1, §10 | Reserved `[TBD-BIZ-009]` |
| ENT-018 | None; `PORT-02` | §5.1, §3.4 | Reserved as a record; dependency effective `[TBD-INFRA-009]` |

### 12.4 Capabilities and roles

| Item | Where satisfied | Status |
|---|---|---|
| CAP-001 | MOD-02; `CMD-02`, `CMD-03`; `PORT-02` | Effective `[SRC: CAP-001]` |
| CAP-002 | MOD-03; `QRY-04`, `QRY-05` | Effective read-only `[SRC: CAP-002]` |
| CAP-003 | MOD-03; `QRY-06`, `QRY-07` | Effective read-only, recorded health `[SRC: CAP-003]` |
| CAP-004 | MOD-04; `CMD-04`; `STATE-001`, `STATE-002` | Effective for initiation and terminal outcome `[SRC: CAP-004]` |
| CAP-005 | MOD-01 local-account path; workspace boundary §3.2 | Effective `[SRC: CAP-005]` `[TBD-INFRA-010]` |
| ROLE-001 | MOD-05 evaluates the effective matrix; own-only scoping in MOD-02 and MOD-04 | Effective `[SRC: ROLE-001]` |
| ROLE-002, ROLE-003, ROLE-004 | Denied by MOD-05 in every cell | Proposed; no effective action `[TBD-BIZ-004]` `[CONFLICT-001]` |

## 13. Open items and gaps

### 13.1 Registry references that constrain this document

These entries are referenced, not redefined. `[DERIVED: RULE-014]`

| Registry entry | Constrains |
|---|---|
| `[TBD-BIZ-003]` | Data boundary, egress gate, secret reference, retention, artifact, PII |
| `[TBD-BIZ-004]` | Registry write authority, role grants, MCP registration and allowlisting, account administration, role binding |
| `[TBD-BIZ-005]` | First integrations and tasks; no sample data is invented |
| `[TBD-BIZ-007]` | Step target execution, retry, branching, MCP invocation — `PORT-03` cannot be specified |
| `[TBD-BIZ-008]` | No numeric performance, session, or timeout value |
| `[TBD-BIZ-009]` | Audit reservation, operational-log scope, `ENT-017`, MOD-08 |
| `[TBD-BIZ-011]` | Search, citations, chat history actions, run history |
| `[TBD-BIZ-012]` | This document may not claim PRD acceptance |
| `[TBD-BIZ-013]` | Offboarding, disabled-account behavior, ownership continuity |
| `[TBD-BIZ-015]` | Whether the state-model coverage interpretation is accepted |
| `[TBD-INFRA-002]` | No backend stack is selected here |
| `[TBD-INFRA-003]` | No store, schema, transaction mechanism, or durability guarantee |
| `[TBD-INFRA-009]` | Model provider, gateway, residency |
| `[TBD-INFRA-011]` | Search provider |
| `[CONFLICT-001]` | ROLE-004 and audit read are blocked |
| `[CONFLICT-002]` | Stage naming; not resolved here |

### 13.2 Architecture gaps (`AGAP-nn`, local to this document)

| AGAP | Gap | Interim architecture position | Related registry entry |
|---|---|---|---|
| `AGAP-01` | Session termination and sign-out: no rule states how a session ends, whether an idle session expires, or what happens to unsent input | `CMD-01` is the only session command; no termination command exists; no expiry value is invented | None registered; design gap |
| `AGAP-02` | Duplicate run submission: no rule states whether a repeated submission may create a second run | `CMD-04` has no dedup window and no idempotency key; a repeated submission is a new run request | `[TBD-BIZ-004]` is adjacent but not the same question |
| `AGAP-03` | Unconfirmed run start: the response may be lost after a run is created | No reconciliation is designed; the initiator is told not to resubmit blindly | None registered; design gap |
| `AGAP-04` | Orphaned `Running` run after a restart or a failed terminal write | No automatic recovery; the last durable state stands; no terminal result is guessed | `[NFR-012]` `[TBD-INFRA-003]` |
| `AGAP-05` | Registry authority: no effective writer for skills, MCP servers, or task definitions | MOD-03 is read-only; the registries may remain empty; no seeded or hidden write path | `[TBD-BIZ-004]` |
| `AGAP-06` | Owner display versus `Account.read` `denied` | No owner name is returned by any effective read | `[TBD-BIZ-003]` `[TBD-BIZ-004]` |
| `AGAP-07` | MCP tool read and allowlist display: the matrix has no `McpTool.read` | Only a tool-reference count and the target kind are exposed; individual tool names are withheld | `[TBD-BIZ-004]` |
| `AGAP-08` | Registry list paging at the proposed 500-item scale | No paging, filter, or incremental-load rule is defined; the read returns a complete recorded set | `[NFR-002]` `[TBD-BIZ-008]` |

## 14. Self-check

| # | Check | Verdict | Evidence |
|---|---|---|---|
| 1 | No stack, store, dependency tool, gateway, search provider, hosting, or CI selected | Pass | §1.2, §3.4, §4.2 name only ports and candidate sets; every selection is attributed to an open TBD-INFRA entry |
| 2 | No API schema, endpoint, path, verb, payload, SQL, DDL, migration, table, column, index, or code | Pass | §7.1–§7.4 state intent, effect, and status only; §8.1 states atomicity boundaries without a schema; §4.2 states ports without transport |
| 3 | No TBD answered, no CONFLICT resolved, no PRD acceptance claimed | Pass | §1.3, §2, §13.1; every dependent statement names its TBD or CONFLICT instead of deciding it |
| 4 | Effective and proposed separated; no reserved behavior presented as working | Pass | §2 legend; §6.3 and §12.2 mark `STATE-003`–`006` and `FLOW-004`–`006` reserved; §7.2 lists absent commands; §10 reserves audit |
| 5 | Every claim traced to an effective ID or labelled as assumption or gap | Pass | Tags on every normative sentence and table row; assumptions are labelled inline; gaps carry `AGAP-01`–`AGAP-08` |
| 6 | Every `ENT-001`–`ENT-018` adjudicated | Pass | §5.1 classifies all 18; §12.3 maps all 18 to a module or to an explicit “None” |
| 7 | `STATE-001`/`STATE-002` match; no new registry ID invented | Pass | §6.1 and §6.2 restate states, guards, terminal states, and failure destinations without adding a transition; only `MOD`, `PORT`, `CMD`, `QRY`, `EVT`, and `AGAP` families appear, and §13.1 references existing entries only |

Verdict: Pass 7 / Fail 0. The document remains `Draft` because the business model is `Draft`, `TBD-BIZ-004` leaves the registries without an effective writer, and the confirmed MVP cannot be exercised end to end. This self-check is not independent review; the review record is `04_architecture_review.md`, and the RULE-005 Verifier record remains outside this task's write scope. `[DERIVED: CHG-010 Decision log]` `[TBD-BIZ-012]`
