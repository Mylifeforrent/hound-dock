# Open Items Registry

Status: Draft
Originating stage: Stage 0 — Repository Initialization
Owner: Tech Lead
Scope: Single registry for unconfirmed engineering decisions (`TBD-INFRA-*`), unconfirmed business boundaries (`TBD-BIZ-*`), and conflicts (`CONFLICT-*`).

## Registry rules

- Entries are appended in ID order, grouped by prefix (`TBD-BIZ`, `TBD-INFRA`, `CONFLICT`) and numerically within each group. An ID MUST NOT be deleted or reused.
- A resolved entry MUST remain in place with status `Resolved` and a `Resolution source` naming the decision and its location.
- Other files MAY reference an ID but MUST NOT define or redefine one (RULE-014).
- No candidate below is a recommendation. No technology choice is settled. Selection requires confirmed requirements plus a recorded three-point justification: requirement fit, familiarity, and operating cost.
- No assumption is recorded as a settled decision. A temporary assumption MUST be logged here as a TBD.

## Summary

| Prefix | Open | Resolved |
|---|---|---|
| `TBD-BIZ` | 13 | 2 |
| `TBD-INFRA` | 10 | 1 |
| `CONFLICT` | 2 | 0 |

---

## TBD-BIZ-001 — Product goal and one-sentence description

- **Category:** Business boundary
- **Status:** Resolved
- **Owner:** User
- **Must confirm by:** Stage 2 — Product Definition
- **Impact:** The root `README.md` goal, product scope, and downstream acceptance criteria were undefined. Resolved by the Stage 2 PRD.
- **Candidate options:** None proposed. This required direct user input.
- **Decision criteria:** Not applicable; business input.
- **Resolution source:** User request of 2026-10-18 defining the internal agent workspace and its four capabilities; recorded in `docs/01_product/prd.md` v0.1.

## TBD-BIZ-002 — Target users, MVP scope, and non-goals

- **Category:** Business boundary
- **Status:** Resolved
- **Owner:** User
- **Must confirm by:** Stage 2 — Product Definition
- **Impact:** Feature boundaries, API surface, data model, and UI scope cannot be defined without an MVP boundary.
- **Candidate options:** None proposed. Required direct user input.
- **Decision criteria:** Not applicable; business input.
- **Resolution source:** User selected MVP "Chat + registries + manual tasks" and deployment "Self-hosted + local accounts for MVP" on 2026-10-18; recorded in `docs/01_product/prd.md` v0.1. Team size, roles, and publication policy split to TBD-BIZ-004.

## TBD-BIZ-003 — Data sensitivity and PII boundaries

- **Category:** Business boundary
- **Status:** Open
- **Owner:** User
- **Must confirm by:** Stage 2 — Product Definition, before any data handling or dataset sharing
- **Impact:** Determines whether datasets may be shared with AI tools, what retention/access controls apply, and which security work is mandatory. Blocking for RULE-009 and any `docs/04_data/` or `docs/08_security/` content.
- **Candidate options:** (a) MVP holds no user data; (b) MVP holds personal data that is not sensitive; (c) MVP holds regulated or otherwise sensitive data.
- **Decision criteria:** Regulatory and legal exposure; product need; operating cost of the required controls.
- **Resolution source:** —

## TBD-BIZ-004 — Team size, roles, and skill/MCP publication policy

- **Category:** Business boundary
- **Status:** Open
- **Owner:** User
- **Must confirm by:** Stage 2 close-out (PRD review)
- **Impact:** Determines the RBAC model, whether non-admins can author or publish skills, and how much review/approval workflow is required. PRD §6 and §13 depend on it.
- **Candidate options:** (a) admin-only publishing; (b) anyone may draft, admin approves publication; (c) anyone may publish with audit only.
- **Decision criteria:** risk tolerance; adoption speed; operating cost of review.
- **Resolution source:** —

## TBD-BIZ-005 — First MCP integrations and first three MVP tasks

- **Category:** Business boundary
- **Status:** Open
- **Owner:** User
- **Must confirm by:** Stage 2 close-out (PRD review) / Stage 3
- **Impact:** Defines the integration scope, the acceptance demo, and which internal data enters the product. Without it, the MVP has no concrete workflow to validate.
- **Candidate options:** (a) documentation/wiki search; (b) issue tracker; (c) Git provider; (d) read-only database; (e) chat/notification. Candidate first tasks: summarize a document, create a ticket, produce a weekly report.
- **Decision criteria:** user value; data risk; integration effort.
- **Resolution source:** —

## TBD-BIZ-006 — MVP success metrics and go-live threshold

- **Category:** Business boundary
- **Status:** Open
- **Owner:** User
- **Must confirm by:** Stage 2 close-out (PRD review)
- **Impact:** Acceptance and rollout cannot be judged without measurable targets. PRD §14 proposes metrics but they are not confirmed.
- **Candidate options:** (a) weekly active members; (b) tasks run per week; (c) task success rate; (d) time saved; (e) zero secret-exposure incidents.
- **Decision criteria:** measurable with low instrumentation cost; reflects real adoption.
- **Resolution source:** —

## TBD-BIZ-007 — Skill and task execution model in v1

- **Category:** Business boundary
- **Status:** Open
- **Owner:** User
- **Must confirm by:** Stage 2 close-out (PRD review)
- **Impact:** Determines whether v1 skills are prompt-only or include API/code execution, and whether task steps are linear or branching. Affects security controls, sandbox requirements, and MVP effort. PRD §5 and §7 currently propose prompt-only skills and linear steps.
- **Candidate options:** (a) prompt-only skills and task steps limited to skill invocation; (b) prompt skills plus MCP tool steps, linear execution (current proposal); (c) code-execution skills and branching/loops.
- **Decision criteria:** user value; security risk; build and operating effort.
- **Resolution source:** —

## TBD-BIZ-008 — NFR thresholds and measurement environment

- **Category:** Business boundary
- **Status:** Open
- **Owner:** User
- **Must confirm by:** Gate 1 — before Stage 3 Architecture; measurement environment at Stage 7 — Development Setup
- **Impact:** All NFRs in `docs/01_product/business_model.md` are proposals without a confirmed threshold. Performance, capacity, availability, and accessibility cannot be accepted, tested, or compared without a target and a measurement environment.
- **Candidate options:** (a) adopt the PRD §12 proposals: p95 first streamed token ≤ 3 s; registry list ≤ 500 ms for 500 items; run status visible within 2 s; (b) set different numeric thresholds; (c) mark performance and availability N/A for the MVP and accept best-effort operation.
- **Decision criteria:** user-perceived usefulness; measurement cost on a single internal machine; operating cost.
- **Resolution source:** —

## TBD-BIZ-009 — Audit obligation and evidence scope

- **Category:** Business boundary
- **Status:** Open
- **Owner:** User
- **Must confirm by:** Gate 1 — before Stage 3 Architecture
- **Impact:** Determines whether audit is an MVP capability, which events must be recorded, who may read or export them, and how long they are retained. Affects CAP-009, CAND-004, NFR-010, ROLE-004, and the retention decision in TBD-BIZ-003. The PRD proposes audit but the confirmed four capabilities do not include it.
- **Candidate options:** (a) registry changes, tool calls, and task runs only; (b) add authentication, account, and secret-rotation events; (c) no audit in the MVP; (d) read-only audit export without an in-product viewer.
- **Decision criteria:** accountability need; data minimization; storage and operating cost.
- **Resolution source:** —

## TBD-BIZ-010 — Cost visibility and budget ceiling

- **Category:** Business boundary
- **Status:** Open
- **Owner:** User
- **Must confirm by:** Gate 1 — before Stage 3 Architecture
- **Impact:** The prototype shows token cost data and a monthly budget meter, and PRD FR-042 proposes per-run cost tracking. No pricing, budget, quota, or charging policy is confirmed. Affects CAP-016, CAP-017, CAND-013, CAND-014, and any cost-related objective.
- **Candidate options:** (a) no cost display in the MVP; (b) per-run token and estimated cost only; (c) per-run cost plus a monthly budget and alert; (d) hard quota enforcement.
- **Decision criteria:** internal charging policy; provider pricing; operating cost; product-owner-only commercial decision.
- **Resolution source:** —

## TBD-BIZ-011 — MVP boundary for supporting capabilities

- **Category:** Business boundary
- **Status:** Open
- **Owner:** User
- **Must confirm by:** Gate 1 — before Stage 3 Architecture
- **Impact:** PRD §8 includes search, run/audit history, model-provider configuration, and local account management; the prototype adds file context, chat history actions, usage, and exports. The confirmed MVP selection names only chat, registries, and manual tasks. The boundary determines which capabilities enter CAP-006 onward and which objectives are measured. Affects CAP-008 through CAP-011, CAP-017 through CAP-021, ROLE, and all NFR scope.
- **Candidate options:** (a) strictly the four confirmed capabilities plus local accounts and self-hosted deployment; (b) add search with citations; (c) add run/audit history and model-provider configuration; (d) add file context and chat history actions; (e) a stated combination of (b)–(d).
- **Decision criteria:** usefulness of the first real workflow; integration effort; data risk; operating cost.
- **Resolution source:** —

## TBD-BIZ-012 — Gate 1 acceptance baseline of PRD v0.1

- **Category:** Business boundary
- **Status:** Open
- **Owner:** User
- **Must confirm by:** Gate 1 — before Stage 3 Architecture
- **Impact:** PRD v0.1 is `Draft` and its §19 acceptance criteria are not recorded as met. The Stage 5 contract permits Draft P4 material to become only `CAND` or `TBD-BIZ`, so the confirmed core of the business model is narrower than the PRD. Until the product owner accepts or amends the PRD, roles, permissions, metrics, audit, execution model, NFR thresholds, and data boundaries remain unconfirmed.
- **Candidate options:** (a) accept PRD §2–§5, §8, §9, and §12 as the Gate 1 baseline; (b) accept the scope boundary only and keep roles, metrics, NFRs, and execution model as candidates; (c) revise the PRD and issue v0.2 before acceptance.
- **Decision criteria:** which statements the product owner is prepared to own as commitments.
- **Resolution source:** —

## TBD-BIZ-013 — Registry ownership and offboarding

- **Category:** Business boundary
- **Status:** Open
- **Owner:** User
- **Must confirm by:** Gate 1 — before Stage 3 Architecture
- **Impact:** Skills and task definitions have an owner. The PRD and prototype do not state what happens to owned registry objects when an account is disabled, leaves the team, or changes role. Affects ENT-006, ENT-011, STATE-003, STATE-005, STATE-006, ROLE-002, and CAND-020.
- **Candidate options:** (a) transfer ownership to an Admin on disable; (b) keep owner attribution, block edits, and deprecate the object; (c) delete or retire the object; (d) no policy in the MVP.
- **Decision criteria:** continuity of team work; attribution; data retention.
- **Resolution source:** —

## TBD-BIZ-014 — Legal, platform, and contractual constraints (P3)

- **Category:** Business boundary / missing input
- **Status:** Open
- **Owner:** User
- **Must confirm by:** Gate 1 — before connecting internal data or external providers
- **Impact:** No P3 hard constraint was supplied with the Stage 5 request. Without one, the business model cannot issue a compliance conclusion and cannot set data-handling, retention, residency, or external-provider rules beyond registering them as open. Affects NFR-006, NFR-008, NFR-009, CAND-021, CAND-022, and CAND-023.
- **Candidate options:** (a) no legal, platform, or contractual constraint applies; (b) an internal policy applies (supply document and clause); (c) an external regulation or contract applies (supply document and clause).
- **Decision criteria:** applicable law and contract; organizational policy; consequence of error.
- **Resolution source:** —

## TBD-BIZ-015 — State-model coverage interpretation

- **Category:** Business boundary
- **Status:** Open
- **Owner:** User
- **Must confirm by:** Gate 1 — before Stage 3 Architecture
- **Impact:** The v0.2 acceptance contract requires one `stateDiagram-v2` per entity. Six models cover eight state-bearing entities; ten entities are immutable, append-only, or derived and are mapped to `None` in `docs/01_product/business_model.md` §7.0. Whether the contract's "per entity" wording accepts that exemption is unconfirmed. Affects STATE-001 to STATE-006, §7.0, and self-check row 5.
- **Candidate options:** (a) accept the state-bearing-entity interpretation and keep six models; (b) require a diagram for every entity, including single-state diagrams for immutable entities; (c) add per-entity models only where a lifecycle exists and list the rest as no-lifecycle.
- **Decision criteria:** contract fidelity; risk of inventing states; review effort.
- **Resolution source:** —

## TBD-INFRA-001 — Frontend stack

- **Category:** Engineering decision
- **Status:** Open
- **Owner:** User; Tech Lead prepares the comparison after PRD review
- **Must confirm by:** Stage 3 — Architecture
- **Impact:** `frontend/` MUST remain empty of code, manifests, and commands until this is resolved.
- **Candidate options:** (a) React + TypeScript + Vite; (b) Next.js; (c) Vue 3 + Vite; (d) SvelteKit.
- **Decision criteria:** requirement fit; familiarity; operating cost (build, hosting, maintenance).
- **Resolution source:** —

## TBD-INFRA-002 — Backend stack

- **Category:** Engineering decision
- **Status:** Open
- **Owner:** User; Tech Lead prepares the comparison after PRD review
- **Must confirm by:** Stage 3 — Architecture
- **Impact:** `backend/` MUST remain empty of code, manifests, and commands until this is resolved.
- **Candidate options:** (a) Python 3.12 + FastAPI + uv; (b) Node.js 22 + TypeScript (Fastify or NestJS); (c) Java 21 + Spring Boot; (d) Go 1.23.
- **Decision criteria:** requirement fit; familiarity; operating cost (runtime, deployment, maintenance).
- **Resolution source:** —

## TBD-INFRA-003 — Data store and persistence

- **Category:** Engineering decision
- **Status:** Open
- **Owner:** User; Tech Lead prepares options after TBD-BIZ-003 is confirmed
- **Must confirm by:** Stage 5 — Data Design
- **Impact:** Data models, migrations, backup, and local development cannot be designed. No data handling may begin.
- **Candidate options:** (a) PostgreSQL; (b) SQLite; (c) no persistence in the MVP.
- **Decision criteria:** requirement fit; operational cost; migration and exit path.
- **Resolution source:** —

## TBD-INFRA-004 — Missing Stage 1 environment baseline

- **Category:** Engineering decision / missing input
- **Status:** Open
- **Owner:** User; Tech Lead executes the baseline once tools are confirmed
- **Must confirm by:** Stage 7 — Development Setup at the latest, and before any dependency installation
- **Impact:** No tool version, safety constraint, package-manager availability, or command is verified. `docs/00_setup/environment_baseline.md` does not exist; any environment claim would be fabricated.
- **Candidate options:** (a) run Stage 1 immediately after Stage 0; (b) run Stage 1 before Stage 3 architecture; both require the same executed verification.
- **Decision criteria:** requirement fit; risk of building on an unverified toolchain; operating cost of delay.
- **Resolution source:** —

## TBD-INFRA-005 — Dependency and virtual-environment tooling

- **Category:** Engineering decision
- **Status:** Open
- **Owner:** User; Tech Lead records the result in `docs/06_development/`
- **Must confirm by:** Stage 7 — Development Setup
- **Impact:** Lockfiles, audit commands, and reproducible installs cannot be defined. Depends on TBD-INFRA-002.
- **Candidate options:** (a) uv if Python is confirmed; (b) pnpm or npm if Node is confirmed; (c) Maven or Gradle if Java is confirmed; (d) Go modules if Go is confirmed.
- **Decision criteria:** fit with the chosen stack; reproducibility; operating cost.
- **Resolution source:** —

## TBD-INFRA-006 — Git hosting, remote, and CI

- **Category:** Engineering decision
- **Status:** Open
- **Owner:** User
- **Must confirm by:** Stage 7 — Development Setup
- **Impact:** The repository is local-only. Branch protection, remote backup, and automated verification do not exist; review relies on manual evidence.
- **Candidate options:** (a) GitHub with GitHub Actions; (b) GitLab with GitLab CI; (c) local-only with manual checks.
- **Decision criteria:** requirement fit (private/public, collaboration); familiarity; operating cost (hosting, maintenance).
- **Resolution source:** —

## TBD-INFRA-007 — Verified run, build, and test commands

- **Category:** Engineering decision
- **Status:** Open
- **Owner:** Tech Lead after TBD-INFRA-001, TBD-INFRA-002, TBD-INFRA-004, and TBD-INFRA-005 are resolved
- **Must confirm by:** Stage 7 — Development Setup
- **Impact:** README, AGENTS, and change records cannot name a standard verification suite. Commands MUST NOT be invented in the meantime.
- **Candidate options:** None until the stack and baseline are confirmed.
- **Decision criteria:** commands MUST be executed successfully in the verified baseline; no unverified command may be recorded.
- **Resolution source:** —

## TBD-INFRA-008 — Lifecycle stage taxonomy and docs mapping

- **Category:** Engineering decision
- **Status:** Resolved
- **Owner:** User
- **Must confirm by:** Stage 0 close-out
- **Impact:** The current-stage label and the "originating stage" field in every docs README were ambiguous.
- **Candidate options:** (a) 15-stage model with `docs/00_setup` covering Stages 0–1 and `docs/01_product` = Stage 2 through `docs/13_changes` = Stage 14; (b) folder index equals stage number; (c) a user-supplied model.
- **Decision criteria:** consistency with the P2 reference to Stage 1; one docs home per stage; no unlabeled directory.
- **Resolution source:** User selected option (a) during Stage 0 plan confirmation on 2026-10-18 (this session). Applied in `docs/00_setup/README.md` and every docs README.

## TBD-INFRA-009 — LLM provider, model gateway, and data residency

- **Category:** Engineering decision
- **Status:** Open
- **Owner:** User
- **Must confirm by:** Stage 3 — Architecture
- **Impact:** Determines model access, tool-calling reliability, data boundary, and cost. PRD §12 and §17 depend on it; no external model call may be configured before it is resolved.
- **Candidate options:** (a) internal OpenAI-compatible gateway; (b) Azure OpenAI; (c) a hosted API such as DeepSeek; (d) local vLLM or Ollama.
- **Decision criteria:** data boundary; tool-calling capability; operating cost.
- **Resolution source:** —

## TBD-INFRA-010 — SSO/IdP for post-MVP

- **Category:** Engineering decision
- **Status:** Open
- **Owner:** User
- **Must confirm by:** Stage 9 — Security, and before any wider rollout
- **Impact:** The MVP uses local accounts by user decision. Production rollout needs SSO; the identity provider affects user provisioning and session design.
- **Candidate options:** (a) Feishu; (b) DingTalk; (c) Azure AD/Entra ID; (d) Keycloak/Authentik; (e) Google Workspace.
- **Decision criteria:** existing identity provider; integration effort; security requirements.
- **Resolution source:** —

## TBD-INFRA-011 — Search provider and data boundary

- **Category:** Engineering decision
- **Status:** Open
- **Owner:** User
- **Must confirm by:** Stage 3 — Architecture
- **Impact:** The chat search capability (FR-004, FR-010, FR-011) cannot be implemented without a provider and a data boundary. Determines whether queries leave the internal network.
- **Candidate options:** (a) internal document/knowledge search only; (b) a web search API such as Tavily, Bing, or Google; (c) both, with per-request choice.
- **Decision criteria:** data boundary; result quality; operating cost.
- **Resolution source:** —

---

## CONFLICT register

The register contained no entries before 2026-10-18. The following conflicts were appended under CHG-006 and remain `Open`; neither side was chosen.

## CONFLICT-001 — Whether an Auditor role exists separately from Admin in v1

- **Point of conflict:** PRD §6 describes the Auditor as a role but says its access is an Admin capability in v1; PRD §13 gives Auditor its own positive column.
- **Side A:** `docs/01_product/prd.md` §6, Auditor row: "| **Auditor** | Reviews usage and audit records | Read-only access to runs and audit; in v1 this is an Admin capability |"
- **Side B:** `docs/01_product/prd.md` §13, permission matrix: "| View all runs and audit | ✓ | — | — | ✓ |"
- **Blocked:** ROLE-004 (Auditor), CAND-002 (proposed permission matrix), CAND-004 (audit scope) in `docs/01_product/business_model.md`
- **Arbiter:** User (product owner), with the Tech Lead recording the resolution
- **Status:** Open
- **Closing condition:** Product owner records either (a) the Auditor is a separate role with read-only runs and audit, or (b) the Auditor is an Admin capability and PRD §13 is corrected. The Tech Lead records the chosen side in this entry. Appended by CHG-007; no side was chosen.
- **Gate:** Gate 1 — before Stage 3 Architecture

## CONFLICT-002 — What "Stage 5" denotes and where its deliverable lives

- **Point of conflict:** The repository stage map assigns Stage 5 to Data Design under `docs/04_data/`; the Stage 5 task contract supplied by the product owner on 2026-10-18 asks for a business model at `docs/01_product/business_model.md`.
- **Side A:** `docs/00_setup/README.md`, Stage map: "| 5 | Data Design | `docs/04_data/` |"
- **Side B:** Product owner Stage 5 task contract, §②: "Acceptance requirements for this stage (Stage 5)" and §④: "Output contract: `docs/01_product/business_model.md`"
- **Blocked:** The document's originating-stage metadata and downstream routing between `docs/01_product/` and `docs/04_data/`; no business rule is blocked.
- **Arbiter:** User (product owner) with the Tech Lead; resolution requires updating either the stage map or the task contract, not both silently.
- **Status:** Open
- **Closing condition:** Product owner and Tech Lead amend either the stage map in `docs/00_setup/README.md` or the Stage 5 task contract, and record which document is authoritative in this entry. Appended by CHG-007; no side was chosen.
- **Gate:** Before Stage 5 close-out
