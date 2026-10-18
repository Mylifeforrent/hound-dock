# Architecture review — hound-dock backend

Status: Draft
Version: 0.1
As-of: 2026-10-18
Owner: Lead architecture agent for the Docs Agent (review record for the D role; Lead integration disposition applied)
Review target: `docs/02_architecture/architecture.md` and the companion documents `00`, `01`, `02`, `03`, the ADR set, and `CHG-010`
Review type: architecture review. This is **not** the RULE-005 independent Verifier record; that record remains pending and is outside this task's write scope.
Review-local IDs: `REV-01`–`REV-17`. They are not `TBD`, `CONFLICT`, `CAP`, `BR`, `ENT`, `STATE`, `NFR`, or `FLOW` identifiers.

## 1. Scope, method, and what was not reviewed

### 1.1 Scope

The review covers the confirmed-MVP architecture set:

- the integrated architecture and its claims about scope, modules, domain, state, interface, security, reliability, operations, research, ADRs, and risks;
- the research and input-traceability record, including the official MCP material;
- the three topical documents (domain/service, API/workflow, security/reliability/operations);
- the five ADRs and the folder README;
- the change record `CHG-010`.

The review checks whether the set is traceable to the effective business model, whether proposed material is kept reserved, whether the stack/API/schema/code prohibitions hold, and whether the open items are recorded rather than answered.

### 1.2 Method

A bounded review pass:

1. read `architecture.md` and `00_research_and_input_traceability.md` in full;
2. read the metadata, scope, state, gap, and self-check sections of `01`, `02`, and `03`, with targeted checks against the specific claims listed below;
3. checked the effective/proposed/state/permission sections of `business_model.md` and the TBD/CONFLICT entries in `open_items.md`;
4. checked file names, `Status:` lines, relative links, ID resolution, gap-family separation, and the change record;
5. applied a findings table and a verdict.

A finding is recorded only when it has a location and evidence. A finding that was corrected during the Lead integration pass is marked `Fixed in integration`; the original finding is not erased.

### 1.3 Not reviewed

- Implementation, endpoints, schemas, migrations, deployment topology, and runtime behavior. They do not exist.
- Numeric NFR thresholds, capacity, availability, retention, encryption, PII, residency, and compliance. They are open decisions.
- The MCP runtime, MCP authorization, and tool invocation. They are deliberately absent.
- HITL, approval, interrupt, checkpoint, and resume. They are deliberately absent.
- The RULE-005 Verifier record and the change-index update. They are outside this task's write scope and are carried as open obligations.

## 2. Verdict

**Pass with conditions.**

The architecture set is internally coherent, traceable to the effective business model, and disciplined about what it does not decide. It does not select a stack, define an API contract or schema, write code, answer a TBD, or resolve a CONFLICT.

The conditions are product decisions, not design defects:

1. **The confirmed MVP is not operable** while `TBD-BIZ-004` is open. No confirmed role may populate the skill, MCP, or task registry. The architecture correctly refuses to invent an administrator or a hidden intake path.
2. **CAP-001 cannot be exercised end-to-end** against an external model while `TBD-BIZ-003`, `TBD-BIZ-014`, `TBD-INFRA-009`, and `TBD-INFRA-011` are open. The architecture records the egress-gate tension and does not resolve it.
3. **CAP-004 cannot be demonstrated end-to-end** while `TBD-BIZ-007` is open. The run lifecycle and outcome records are designed; the executor is a port.

| Severity | Count | Fixed in integration | Open / accepted |
|---|---|---|---|
| Blocker | 0 | 0 | 0 |
| Major | 4 | 2 | 2 accepted product conditions |
| Minor | 9 | 8 | 1 carried |
| Note | 4 | — | 4 accepted residual limits |

## 3. Findings

| REV | Severity | Location | Finding | Evidence | Required fix | Status |
|---|---|---|---|---|---|---|
| REV-01 | Major | `architecture.md` §8.2, ERR-03 row | ERR-03 was described as covering an own-only mismatch, which would make ERR-03 and ERR-04 distinguishable and turn the permission response into an existence oracle. | `business_model.md` §6.2 own-only cells; `interaction_design.md` §2.3 item 4 and §5.5; `02` §6.2 rule 1 | Exclude own-only mismatch from ERR-03; route it to ERR-04 | Fixed in integration |
| REV-02 | Major | `03` §1.2 table | The proposed/reserved row said "all `ENT-*`", which misclassifies the existence-confirmed entities (`ENT-001/003/004/006/008/011/014`) as proposed. | `business_model.md` §5.1 entity statuses; `01` §5.1 | Name the proposed entities only; acknowledge the existence-confirmed entities | Fixed in integration |
| REV-03 | Major | `01` §4.1 MOD-03; `02` §3.2; `03` §4.6 | No confirmed role may write a registry entry (`TBD-BIZ-004`). The confirmed MVP is therefore not operable end to end. | `business_model.md` §6.2 (ROLE-001 has no create/publish/register/allowlist); `TBD-BIZ-004`; `CHL-002` | Keep the blocker visible; no admin, seed, service-account, or debug path | Accepted product condition; no design fix |
| REV-04 | Major | `03` §6.2–§6.3; `architecture.md` §2.4 | CAP-001 requires a model response, while `NFR-008` blocks content egress until four TBDs close. The gate and the capability cannot both be satisfied now. | `business_model.md` §3.1 CAP-001 and §9 NFR-008; `TBD-BIZ-003/014`; `TBD-INFRA-009/011` | Record the tension; label the gate a posture, not an NFR resolution; do not select a provider | Accepted product condition; wording fixed |
| REV-05 | Minor | `01` §13.2; `02` §13.2; `03` §14.1 | Three documents used the same `GAP`-family labels (01–13) with different meanings. A cross-document comparison would be wrong. | The three gap tables | Use `AGAP-`/`BGAP-`/`CGAP-` families and add a crosswalk | Fixed in integration |
| REV-06 | Minor | `architecture.md` §7.1 | The integrated entity table omitted `ENT-013` Task Step from the structurally required set while `01` included it. | `01` §5.1; `FLOW-003 N4` | Add `ENT-013` to the structurally required row | Fixed in integration |
| REV-07 | Minor | `02` §9.1 MAP-08, MAP-09 | MAP-08 said "no second run is created" while the same document says a blind retry may create a second run; MAP-09 asserted a run has at least one step while §7.2 allows a rejected run with no step results. | `02` §7.3, §10; `01` §5.5 | Make MAP-08 conditional; reconcile MAP-09 with the no-step-results case | Fixed in integration |
| REV-08 | Minor | `03` §6.2 | The egress gate was stated as a closed rule rather than an architecture posture, which overstates a proposed NFR. | `NFR-008` proposed; `TBD-BIZ-003/014` open | State "closed by default posture"; do not claim to resolve the NFR or a TBD | Fixed in integration |
| REV-09 | Minor | `01` §5.1, §11 | `ENT-001` was classed as "structurally required" although its identity is confirmed; `ENT-006/008/011` were classed as structurally required although their existence is confirmed; the account row implied a product-side provisioning write. | `business_model.md` §5.1 statuses; `BR-001`; `TBD-BIZ-004` | Use "effective core (record only)"; state that accounts are provisioned outside the MVP | Fixed in integration |
| REV-10 | Minor | `02` §5, task query | The task query returned declared inputs but not the ordered composition that `01` MOD-03 and PG-008 expose. | `01` §4.1 MOD-03; `interaction_design.md` §3.2 PG-008 | Include the composition in the task query outcome | Fixed in integration |
| REV-11 | Minor | `CHG-010` `## Verification` | The verification section was still "Pending" at review time. | `CHG-010` | Complete it with commands, exit codes, and observed results before Tech Lead review | Fixed in integration (post-review) |
| REV-12 | Minor | `docs/13_changes/README.md` | The change index does not list `CHG-010`. | `docs/13_changes/README.md` authoritative-assets list | Tech Lead appends `CHG-010` when the index is updated | Carried; outside this task's write scope |
| REV-13 | Note | `01`/`02`/`03` gap sections | Local gap families remain numerous (`AGAP`, `BGAP`, `CGAP`) alongside the consolidated `G-01`–`G-15`. | `architecture.md` §15 crosswalk | Keep the crosswalk; register gaps in `open_items.md` only through the Tech Lead | Accepted; no design change |
| REV-14 | Note | All architecture documents | No stack, store, gateway, search provider, hosting, or CI is selected; no endpoint, schema, DDL, migration, or code is present. | `architecture.md` §12 candidate table; folder README boundary; grep checks | Keep the candidate table non-committal | Accepted |
| REV-15 | Note | `architecture.md` §9, §11; `adr_004` | No MCP runtime, host/client, discovery, authorization flow, or tool invocation is introduced; no HITL framework is introduced. | `CAP-003`/`BR-004` read side; `FLOW-005` proposed; `CAP-014` excluded; official MCP material | Keep the reserved status and the re-entry triggers | Accepted |
| REV-16 | Note | `03` §13 | NFR-001–012 are measurement points, not committed thresholds; capacity, availability, retention, and backup remain open. | `TBD-BIZ-008`; `NFR-004/005/009`; `CAP-034` excluded | Do not turn a measurement point into an acceptance threshold | Accepted |
| REV-17 | Minor | `architecture.md` §6 MOD-01 | MOD-01 said "create/bind/end a session" while session termination is an explicit gap and no termination command exists. | `01` §4.1 MOD-01; `03` §3.4; `CGAP-01` | Remove "end a session"; keep termination as a gap | Fixed in integration |

## 4. Category assessments

### 4.1 Authority and traceability

**Pass.** The effective inputs are `CAP-001`–`005`, `FLOW-001`–`003`, `STATE-001/002`, `BR-001`–`008`, and the ROLE-001 matrix cells. The PRD and the prototype are used only as candidate or interaction input; the interaction design supplies page states and exception feedback, not a business rule. Every `TBD` and `CONFLICT` referenced resolves to `open_items.md`; no entry is redefined or answered. PRD acceptance is not claimed (`TBD-BIZ-012`).

### 4.2 Effective versus proposed

**Pass after REV-02 and REV-06.** `FLOW-004`–`006`, `STATE-003`–`006`, skill publication, MCP registration/allowlisting, task publication, and `ROLE-002`–`004` are marked `proposed — reserved; not implemented`. `ENT-015` is correctly treated as structurally required because `STATE-002` is effective, despite `ENT-015` being labelled proposed. `ENT-012` and `ENT-013` are handled as minimal records. The existence-confirmed entities are distinguished from the proposed ones.

### 4.3 Scope discipline

**Pass.** No stack, store, dependency tool, gateway, search provider, hosting, or CI is selected. `architecture.md` §12 lists candidates, criteria, and impact only; no conclusion is drawn. No endpoint, path, method, status code, request/response schema, OpenAPI document, event payload schema, DDL, migration, deployment command, or code is present. The `04` record itself adds no design.

### 4.4 Permission model

**Pass after REV-01.** All 18 matrix columns are accounted for. The default is deny; enforcement is server-side; `own-only` is a query predicate; `read-only` is a projection; proposed roles are denied; no admin, seeding, service-account, or debug path exists. Own-only mismatch is ERR-04, not ERR-03, so the denial cannot become an existence oracle. `Account.read=denied` keeps owner display out of the projections.

### 4.5 Domain model and state

**Pass.** Only `STATE-001` Run and `STATE-002` Run Step are implemented. Terminal states are immutable; a failed step is visible; remaining steps are `Skipped`; there is no automatic retry, schedule, webhook, event trigger, or in-place resume; a new run is the compensation. Run creation binds one initiator and one recorded task version. The executor is a port because `TBD-BIZ-007` is open. The zero-step and orphaned-`Running` ambiguities are recorded, not resolved.

### 4.6 Interface and workflow

**Pass after REV-07 and REV-10.** Commands and queries are separated by effect. Chat retains the user message on model failure and appends exactly one assistant message on success; no partial answer is stored as complete. Run creation is distinct from run success. The nine states are mapped for PG-001–PG-009; PG-010–PG-012 have no effective backend surface. Duplicate run, unconfirmed start, session end, and paging are recorded as gaps, not silently resolved.

### 4.7 Security, data, reliability, and operations

**Pass with the accepted conditions in REV-03 and REV-04.** No data classification, retention period, deletion rule, encryption algorithm, key-management design, PII conclusion, residency conclusion, or compliance conclusion is made. The egress gate is a closed-by-default posture, not a resolution of `NFR-008` or of `TBD-BIZ-003`. No SLO, capacity, availability, rate-limit, timeout, RTO, or RPO value is set. Operational logs are not audit events. Backup is excluded. The measurement plan covers NFR-001–012 without adopting a threshold. No operational-readiness claim is made.

### 4.8 MCP and HITL

**Pass.** The MCP position is consistent: the internal registry record and recorded health are read-only; there is no MCP host/client, transport, discovery, connection test, allowlisting, or invocation. The official MCP Registry is rejected because it is public, excludes private servers, and is not self-hosted. The MCP Tasks extension is not confused with the product's business tasks. The 2026-07-28 stateless core, authorization, and human-in-the-loop guidance are used as vocabulary and future triggers only. No HITL framework is introduced; the re-entry conditions are explicit.

### 4.9 Internal consistency

**Pass after REV-05, REV-06, REV-09, REV-10, and REV-17.** Module names, error classes, state names, command/query/event identities, and gap families are consistent across the set. `architecture.md` aligns with the topicals on `MOD-01`–`08`, `ERR-01`–`07`, `STATE-001/002`, the no-step-results case, the task composition, and the gap crosswalk. File names are RULE-001-compliant; every document is `Status: Draft`; no `Frozen` status appears; relative links resolve once `04` exists.

### 4.10 Over-engineering, under-specification, and unverifiable assumptions

**Acceptable.** The set is deliberately detailed for a single-team self-hosted MVP, but the detail is boundary work, not speculative implementation. The modular-monolith recommendation is labelled reversible and subject to `TBD-INFRA-002`; it is not an ADR or a stack decision. Local identifier families are numerous but declared and crosswalked. The architecture assumptions (async execution, one model endpoint, single workspace, out-of-band registry preparation, logs not audit, disconnect does not cancel) are labelled and separable. The architecture is under-specified where the inputs are open; that is the correct behavior, not an omission.

## 5. Top fixes before Tech Lead review

1. Complete `CHG-010` `## Verification` with the executed checks, exit codes, and observed results.
2. Append `CHG-010` to `docs/13_changes/README.md` (Tech Lead; outside this task's write scope).
3. Keep `TBD-BIZ-004` visible as a product blocker: the confirmed MVP cannot be populated by the product until registry authority is assigned.
4. Keep `TBD-BIZ-003`, `TBD-BIZ-014`, `TBD-INFRA-009`, and `TBD-INFRA-011` as the gate for CAP-001; do not let the architecture be read as a provider decision.
5. Keep `TBD-BIZ-007` as the gate for step execution and CAP-004's end-to-end demonstration.
6. Obtain the RULE-005 Verifier review before any merge; this `04` record is not that record.
7. Do not implement, scaffold, install dependencies, or deploy from this architecture until the relevant TBDs and the PRD gate close.
8. If the user accepts the architecture, record the acceptance separately; this review does not accept the PRD or resolve any open item.

## 6. Residual limits and open items

- The business model is `Draft`; `TBD-BIZ-012` is open. This review is not a Gate 1 acceptance.
- `TBD-BIZ-003` and `TBD-BIZ-014` leave the data boundary, retention, PII, residency, and compliance unresolved.
- `TBD-BIZ-004` leaves the registries without a confirmed writer; the confirmed MVP is not operable.
- `TBD-BIZ-007` leaves step execution, retry, branching, and code execution unresolved.
- `TBD-BIZ-008` leaves every NFR threshold and the measurement environment unresolved.
- `TBD-INFRA-001/002/003` leave the stack, store, and tooling unresolved.
- `TBD-INFRA-004` leaves the environment baseline and verified commands missing.
- `TBD-INFRA-009/011` leave the model gateway, search provider, and data residency unresolved.
- `CONFLICT-001` leaves ROLE-004 blocked; `CONFLICT-002` affects document routing only.
- The MCP runtime, MCP authorization, tool invocation, HITL, approval, interrupt, checkpoint, and resume are not implemented.
- The `G-01`–`G-15` gaps and the local `AGAP`/`BGAP`/`CGAP` families are candidates for the Tech Lead; no new registry ID is created here.

## 7. Review self-check

| Check | Verdict | Evidence |
|---|---|---|
| All ten review categories covered | Pass | §4.1–§4.10 |
| Every finding has a location and evidence | Pass | §3; each row names a file and section |
| No design duplication | Pass | §3–§5 state findings, required fixes, and conditions only |
| No TBD answered or CONFLICT resolved | Pass | §1.3, §6; the review references only |
| No stack, endpoint, schema, DDL, or code introduced | Pass | §4.3; the review adds none |
| Effective/proposed separation checked | Pass | §4.2; REV-02, REV-06 |
| Permission and non-disclosure checked | Pass | §4.4; REV-01 |
| State and workflow checked | Pass | §4.5–§4.6; REV-07 |
| Security/data/operations checked | Pass | §4.7; REV-04, REV-08, REV-16 |
| MCP/HITL checked | Pass | §4.8; REV-15 |
| Internal consistency checked | Pass | §4.9; REV-05, REV-09, REV-10, REV-17 |
| Residual limits stated | Pass | §6 |
| This record is not the RULE-005 Verifier record | Pass | Metadata and §5 item 6 |

**Review disposition.** The architecture is ready for Tech Lead review as a `Draft`, subject to the product conditions in §2 and the carried change-index item. It is not ready for implementation, not a Gate 1 acceptance, and not a substitute for the RULE-005 Verifier record.
