# Open Items Registry

Status: Draft
Originating stage: Stage 0 — Repository Initialization
Owner: Tech Lead
Scope: Single registry for unconfirmed engineering decisions (`TBD-INFRA-*`), unconfirmed business boundaries (`TBD-BIZ-*`), and conflicts (`CONFLICT-*`).

## Registry rules

- Entries are appended in ID order, grouped by prefix (`TBD-BIZ`, `TBD-INFRA`, `CONFLICT`) and numerically within each group. An ID MUST NOT be deleted or reused.
- A resolved entry MUST remain in place with status `Resolved` and a `Resolution source` naming the decision and its location.
- Other files MAY reference an ID but MUST NOT define or redefine one (RULE-014).
- A candidate is not a recommendation until its entry is `Resolved` by the owner. Selection requires confirmed requirements plus a recorded three-point justification: requirement fit, familiarity, and operating cost. A resolved stack entry records the decision only; exact versions, tooling, and commands remain separate gates (`TBD-INFRA-004/005/007`).
- No assumption is recorded as a settled decision. A temporary assumption MUST be logged here as a TBD.

## Summary

| Prefix | Open | Resolved |
|---|---|---|
| `TBD-BIZ` | 6 | 9 |
| `TBD-INFRA` | 5 | 9 |
| `CONFLICT` | 1 | 1 |

**Policy note (2026-10-20):** `RULE-021` makes user-supplied work pre-approved. The Open entries below are advisory for user-supplied files and code; they do not block that work. They remain relevant to agent-authored work.

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
- **Status:** Resolved
- **Owner:** User
- **Must confirm by:** Stage 2 — Product Definition, before any data handling or dataset sharing
- **Impact:** Determines whether datasets may be shared with AI tools, what retention/access controls apply, and which security work is mandatory. Blocking for RULE-009 and any `docs/04_data/` or `docs/08_security/` content.
- **Candidate options:** (a) MVP holds no user data; (b) MVP holds personal data that is not sensitive; (c) MVP holds regulated or otherwise sensitive data.
- **Decision criteria:** Regulatory and legal exposure; product need; operating cost of the required controls.
- **Resolution source:** Product owner selected the enterprise-internal baseline on 2026-10-18: Internal/Sensitive classification, no Highly Sensitive data, 90/180/365-day retention for conversations/runs/audit, TLS and at-rest encryption, and log redaction. Recorded in `CHG-012` and `docs/01_product/business_model.md` Appendix B.

## TBD-BIZ-004 — Team size, roles, and skill/MCP publication policy

- **Category:** Business boundary
- **Status:** Resolved
- **Owner:** User
- **Must confirm by:** Stage 2 close-out (PRD review)
- **Impact:** Determines the RBAC model, whether non-admins can author or publish skills, and how much review/approval workflow is required. PRD §6 and §13 depend on it.
- **Candidate options:** (a) admin-only publishing; (b) anyone may draft, admin approves publication; (c) anyone may publish with audit only.
- **Decision criteria:** risk tolerance; adoption speed; operating cost of review.
- **Resolution source:** Product owner selected admin-only skill and task publication on 2026-10-18. MCP registration/allowlisting and account administration remain out of the MVP; role assignments are provisioned out of band. Recorded in `CHG-012` and `docs/01_product/business_model.md` Appendix B.

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
- **Status:** Resolved
- **Owner:** User
- **Must confirm by:** Stage 2 close-out (PRD review)
- **Impact:** Determines whether v1 skills are prompt-only or include API/code execution, and whether task steps are linear or branching. Affects security controls, sandbox requirements, and MVP effort. PRD §5 and §7 currently propose prompt-only skills and linear steps.
- **Candidate options:** (a) prompt-only skills and task steps limited to skill invocation; (b) prompt skills plus MCP tool steps, linear execution (current proposal); (c) code-execution skills and branching/loops.
- **Decision criteria:** user value; security risk; build and operating effort.
- **Resolution source:** Product owner selected candidate (a) on 2026-10-20 (Asia/Shanghai), declining the PRD's option-(b) proposal: v1 skills are prompt-only; a task run executes linear steps, each step invoking one skill (prompt + one internal-gateway model call) through the model port (`TBD-INFRA-009`); no MCP/tool invocation, no code execution, no branching or loops — consistent with ADR-003/ADR-004 (MCP metadata-only) and ADR-002 (immutable run/step terminal states, no retry). Task steps that would require writing to an external system (e.g. ticket creation) produce generated draft text only in v1; real integration is a post-MVP change that reopens this entry. Recorded in `CHG-025`.

## TBD-BIZ-008 — NFR thresholds and measurement environment

- **Category:** Business boundary
- **Status:** Resolved
- **Owner:** User
- **Must confirm by:** Gate 1 — before Stage 3 Architecture; measurement environment at Stage 7 — Development Setup
- **Impact:** All NFRs in `docs/01_product/business_model.md` are proposals without a confirmed threshold. Performance, capacity, availability, and accessibility cannot be accepted, tested, or compared without a target and a measurement environment.
- **Candidate options:** (a) adopt the PRD §12 proposals: p95 first streamed token ≤ 3 s; registry list ≤ 500 ms for 500 items; run status visible within 2 s; (b) set different numeric thresholds; (c) mark performance and availability N/A for the MVP and accept best-effort operation.
- **Decision criteria:** user-perceived usefulness; measurement cost on a single internal machine; operating cost.
- **Resolution source:** Product owner adopted the proposals with one correction on 2026-10-20 (Asia/Shanghai), recorded in `CHG-026`:
  - **Confirmed performance thresholds (p95, measured on the Stage 1 baseline single host):** `NFR-002` registry list read ≤ 500 ms at 500 items; `NFR-003` run-step state change to visible update ≤ 2,000 ms; `NFR-001` adopted as a non-streaming metric — time from message submit to the completed assistant turn being retrievable via `API-006` ≤ 3,000 ms (replaces the unmeasurable "first streamed token" wording; streaming remains not a requirement).
  - **Measurement environment:** the Stage 1 baseline host recorded in `docs/00_setup/environment_baseline.md`.
  - **Idempotency-key retention window:** 24 hours (closes the window reference in `TBD-INFRA-014`); expired keys and replay payloads are purged by the later retention job.
  - **Rate limits:** the proposed set recorded in `backend/app/config.py` is confirmed (sign-in 20/IP/15 min and 5/name/15 min; conversation create 30/hour; message append 30/min; reply 30/min; run start 10/hour; reads 120/min).
  - **Capacity and availability (`NFR-004`, `NFR-005`) keep their suggested baselines** (50 accounts / 20 concurrent sessions / 10 concurrent runs; 99.0% per 30-day month) as non-binding best-effort targets; no hard MVP threshold is set. **Accessibility (`NFR-011`)** keeps its proposed conformance targets (0 critical violations, keyboard-completable FLOW-001–003, ≥ 4.5:1 text and ≥ 3:1 controls) as design targets verified by audit; no certification is claimed. These treatments are part of this resolution and may be amended by a later `CHG`.

## TBD-BIZ-009 — Audit obligation and evidence scope

- **Category:** Business boundary
- **Status:** Resolved
- **Owner:** User
- **Must confirm by:** Gate 1 — before Stage 3 Architecture
- **Impact:** Determines whether audit is an MVP capability, which events must be recorded, who may read or export them, and how long they are retained. Affects CAP-009, CAND-004, NFR-010, ROLE-004, and the retention decision in TBD-BIZ-003. The PRD proposes audit but the confirmed four capabilities do not include it.
- **Candidate options:** (a) registry changes, tool calls, and task runs only; (b) add authentication, account, and secret-rotation events; (c) no audit in the MVP; (d) read-only audit export without an in-product viewer.
- **Decision criteria:** accountability need; data minimization; storage and operating cost.
- **Resolution source:** Product owner selected audit in the MVP on 2026-10-18 for sign-in, skill/task publication, run, and audit-read events. Audit is append-only, Admin read-only, with no export and 365-day retention. Recorded in `CHG-012` and `docs/01_product/business_model.md` Appendix B.

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
- **Status:** Resolved
- **Owner:** User
- **Must confirm by:** Gate 1 — before Stage 3 Architecture
- **Impact:** PRD §8 includes search, run/audit history, model-provider configuration, and local account management; the prototype adds file context, chat history actions, usage, and exports. The confirmed MVP selection names only chat, registries, and manual tasks. The boundary determines which capabilities enter CAP-006 onward and which objectives are measured. Affects CAP-008 through CAP-011, CAP-017 through CAP-021, ROLE, and all NFR scope.
- **Candidate options:** (a) strictly the four confirmed capabilities plus local accounts and self-hosted deployment; (b) add search with citations; (c) add run/audit history and model-provider configuration; (d) add file context and chat history actions; (e) a stated combination of (b)–(d).
- **Decision criteria:** usefulness of the first real workflow; integration effort; data risk; operating cost.
- **Resolution source:** Product owner selected the strict MVP plus skill/task authoring and audit on 2026-10-18. Search, file context, cost visibility, chat history actions, MCP registration/allowlisting, and account administration remain out. Recorded in `CHG-012` and `docs/01_product/business_model.md` Appendix B.

## TBD-BIZ-012 — Gate 1 acceptance baseline of PRD v0.1

- **Category:** Business boundary
- **Status:** Resolved
- **Owner:** User
- **Must confirm by:** Gate 1 — before Stage 3 Architecture
- **Impact:** PRD v0.1 is `Draft` and its §19 acceptance criteria are not recorded as met. The Stage 5 contract permits Draft P4 material to become only `CAND` or `TBD-BIZ`, so the confirmed core of the business model is narrower than the PRD. Until the product owner accepts or amends the PRD, roles, permissions, metrics, audit, execution model, NFR thresholds, and data boundaries remain unconfirmed.
- **Candidate options:** (a) accept PRD §2–§5, §8, §9, and §12 as the Gate 1 baseline; (b) accept the scope boundary only and keep roles, metrics, NFRs, and execution model as candidates; (c) revise the PRD and issue v0.2 before acceptance.
- **Decision criteria:** which statements the product owner is prepared to own as commitments.
- **Resolution source:** Product owner selected option (b) on 2026-10-19 (Asia/Shanghai): accept the MVP scope boundary only and keep roles, metrics, NFRs, and the execution model as candidates, applied to the current PRD v0.2 baseline issued by CHG-014. Recorded in `CHG-021`. This closes the Gate 1 PRD-acceptance decision only. It does not resolve `TBD-BIZ-005`, `TBD-BIZ-006`, `TBD-BIZ-007`, `TBD-BIZ-008`, `TBD-BIZ-010`, `TBD-BIZ-013`, `TBD-BIZ-014`, `TBD-BIZ-015`, `TBD-INFRA-004`, `TBD-INFRA-005`, `TBD-INFRA-007`, `TBD-INFRA-012`, `TBD-INFRA-013`, `TBD-INFRA-014`, or `CONFLICT-002`, and it authorizes no implementation.

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
- **Status:** Resolved
- **Owner:** User; Tech Lead prepares the comparison after PRD review
- **Must confirm by:** Stage 3 — Architecture
- **Impact:** `frontend/` MUST remain empty of code, manifests, and commands until activation, the recorded Stage 1 baseline, and verified commands (`TBD-INFRA-004/007`). The resolution below is a decision, not implementation authority.
- **Candidate options:** (a) React + TypeScript + Vite; (b) Next.js; (c) Vue 3 + Vite; (d) SvelteKit.
- **Decision criteria:** requirement fit; familiarity; operating cost (build, hosting, maintenance).
- **Resolution source:** User approved the Tech Lead comparison and selected candidate (a) on 2026-10-19 (Asia/Shanghai). Scope: React 19 (major) + TypeScript 5 (major) + Vite 7 (major), built as a client-only SPA with no SSR and no server runtime; the frontend route layer is React Router in declarative mode, and the test direction is Vitest with React Testing Library and MSW. Exact versions, the Node/pnpm build toolchain, dependency tooling, and every command remain `TBD-INFRA-004/005/007`. The scoring and the full component list are in `docs/13_changes/CHG-019-frontend-backend-stack.md`.

## TBD-INFRA-002 — Backend stack

- **Category:** Engineering decision
- **Status:** Resolved
- **Owner:** User; Tech Lead prepares the comparison after PRD review
- **Must confirm by:** Stage 3 — Architecture
- **Impact:** `backend/` MUST remain empty of code, manifests, and commands until activation, the recorded Stage 1 baseline, a dependency audit, and verified commands (`TBD-INFRA-004/005/007`). The resolution below is a decision, not implementation authority.
- **Candidate options:** (a) Python 3.12 + FastAPI + uv; (b) Node.js 22 + TypeScript (Fastify or NestJS); (c) Java 21 + Spring Boot; (d) Go 1.23.
- **Decision criteria:** requirement fit; familiarity; operating cost (runtime, deployment, maintenance).
- **Resolution source:** User approved the Tech Lead comparison and selected candidate (a) on 2026-10-19 (Asia/Shanghai). Scope: Python 3.12, FastAPI (0.x), and uv with `uv.lock`; the recommended supporting runtime is Uvicorn, the ORM/driver pair is SQLAlchemy 2 + psycopg 3, migrations are Alembic behind a separate physical-design change, and the test framework is pytest. Exact versions and every command remain `TBD-INFRA-004/005/007`. The scoring and the full component list are in `docs/13_changes/CHG-019-frontend-backend-stack.md`.

## TBD-INFRA-003 — Data store and persistence

- **Category:** Engineering decision
- **Status:** Resolved
- **Owner:** User; Tech Lead prepares options after TBD-BIZ-003 is confirmed
- **Must confirm by:** Stage 5 — Data Design
- **Impact:** Data models, migrations, backup, and local development cannot be designed. No data handling may begin.
- **Candidate options:** (a) PostgreSQL; (b) SQLite; (c) no persistence in the MVP.
- **Decision criteria:** requirement fit; operational cost; migration and exit path.
- **Resolution source:** Product owner selected PostgreSQL on 2026-10-18 for the enterprise-internal baseline. The physical schema, indexes, and migrations remain a separate change under the resolved store. Recorded in `CHG-012` and `docs/01_product/business_model.md` Appendix B.

## TBD-INFRA-004 — Missing Stage 1 environment baseline

- **Category:** Engineering decision / missing input
- **Status:** Resolved
- **Owner:** User; Tech Lead executes the baseline once tools are confirmed
- **Must confirm by:** Stage 7 — Development Setup at the latest, and before any dependency installation
- **Impact:** No tool version, safety constraint, package-manager availability, or command was verified before this change. `docs/00_setup/environment_baseline.md` did not exist; the Stage 1 baseline now records the observed host and tool versions. `TBD-INFRA-005` and `TBD-INFRA-007` remain Open, and no command is authorized.
- **Candidate options:** (a) run Stage 1 immediately after Stage 0; (b) run Stage 1 before Stage 3 architecture; both require the same executed verification.
- **Decision criteria:** requirement fit; risk of building on an unverified toolchain; operating cost of delay.
- **Resolution source:** Executed Stage 1 baseline recorded at `docs/00_setup/environment_baseline.md` on 2026-10-20 (macOS 26.1 arm64; Python 3.12.9; uv 0.11.32; Node 22.23.2; pnpm 11.2.2; PostgreSQL 14.20; read-only probe exit codes in §6). Recorded in `CHG-022`. This resolves the missing-baseline entry only; `TBD-INFRA-005` (tooling/lockfile/audit policy) and `TBD-INFRA-007` (verified commands) remain Open, and no dependency or command is authorized.

## TBD-INFRA-005 — Dependency and virtual-environment tooling

- **Category:** Engineering decision
- **Status:** Open
- **Owner:** User; Tech Lead records the result in `docs/06_development/`
- **Must confirm by:** Stage 7 — Development Setup
- **Impact:** Lockfiles, audit commands, and reproducible installs cannot be defined. `TBD-INFRA-002` is Resolved (Python 3.12 + FastAPI + uv); this entry remains Open for the frontend Node/pnpm toolchain and the lockfile/audit policy.
- **Update (2026-10-20, CHG-024):** Backend portion settled by executed Stage 7: `uv` with a committed `backend/uv.lock`, `uv sync` and `uv run pytest` verified with exit code 0, and the dependency audit recorded in `CHG-024`. Still open: the frontend Node toolchain (the baseline observes pnpm 11.2.2, while the user-level default prefers npm), and any further lockfile/audit policy refinement.
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
- **Owner:** Tech Lead after TBD-INFRA-004 and TBD-INFRA-005 are resolved
- **Must confirm by:** Stage 7 — Development Setup
- **Impact:** README, AGENTS, and change records cannot name a standard verification suite. Commands MUST NOT be invented in the meantime.
- **Update (2026-10-20, CHG-024):** Backend install and test commands verified with exit code 0 and recorded in `docs/06_development/`: `uv --directory backend sync` and `uv --directory backend run pytest`. Still open: dev-run, build, lint (ruff executed once with exit 1 on user-supplied files, advisory under RULE-021), typecheck, and deploy commands; none may be treated as the standard suite until recorded here.
- **Candidate options:** None until the baseline and the tooling decision are confirmed (`TBD-INFRA-004/005`).
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
- **Status:** Resolved
- **Owner:** User
- **Must confirm by:** Stage 3 — Architecture
- **Impact:** Determines model access, tool-calling reliability, data boundary, and cost. PRD §12 and §17 depend on it; no external model call may be configured before it is resolved.
- **Candidate options:** (a) internal OpenAI-compatible gateway; (b) Azure OpenAI; (c) a hosted API such as DeepSeek; (d) local vLLM or Ollama.
- **Decision criteria:** data boundary; tool-calling capability; operating cost.
- **Resolution source:** Product owner selected an internal OpenAI-compatible gateway on 2026-10-18, with no external egress for the enterprise-internal baseline. Recorded in `CHG-012` and `docs/01_product/business_model.md` Appendix B.

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

## TBD-INFRA-012 — Local credential verification and verifier protection

- **Category:** Engineering decision / security
- **Status:** Resolved
- **Owner:** User; Tech Lead records the result in `docs/08_security/` and `docs/04_data/`
- **Must confirm by:** Stage 9 — Security, before `API-001` is implemented
- **Impact:** `API-001` cannot be implemented end to end. `account` has no verifier field (`data_model_spec.md` §4.2), AGENTS.md §6 forbids storing a verifier in a business table, SSO is excluded in the MVP (`CAP-007`), and no hidden seed path is allowed. A security-owned support store is modeled as proposed in `data_model_spec.md` §2.5; the algorithm and parameters are not selected.
- **Candidate options:** (a) Argon2id in a security-owned support store, with parameters recorded per row; (b) scrypt; (c) PBKDF2-HMAC-SHA256; (d) an external identity provider (excluded in the MVP; post-MVP `TBD-INFRA-010`).
- **Decision criteria:** resistance to offline guessing; Python library maturity and maintenance; cost of parameter tuning on the target host; rehash-on-sign-in migration path.
- **Recommendation (non-binding):** (a) Argon2id with per-row parameters, so a future parameter or algorithm change rehashes at sign-in. This is a recommendation, not a decision.
- **Resolution source:** Product owner selected candidate (c) on 2026-10-20 (Asia/Shanghai), declining the non-binding Argon2id recommendation: PBKDF2-HMAC-SHA256 via the standard library (`hashlib.pbkdf2_hmac`, no third-party dependency), stored only in the security-owned support store `account_credential` with per-row algorithm and iteration parameters. Initial deployment parameters, recorded from executed timing on the Stage 1 host (CHG-024): 210,000 iterations (≈281 ms per hash+verify; 600,000 iterations measured ≈2,352 ms and rejected for sign-in latency), 16-byte random salt, 32-byte derived key, constant-time comparison. Rehash-on-sign-in is retained so parameters can be raised without a password reset. Recorded in `CHG-024`.

## TBD-INFRA-013 — Session lifetime, cookie flags, and termination

- **Category:** Engineering decision / security
- **Status:** Resolved
- **Owner:** User; Tech Lead records the result in `docs/08_security/`
- **Must confirm by:** Stage 9 — Security, before `API-001` is implemented
- **Impact:** `api_interface_spec.md` §4.1 requires a server-set opaque `HttpOnly` cookie; `CF-08` and `AGAP-01` leave the cookie name, flags, lifetime, refresh, revocation, CSRF, and sign-out open. `data_model_spec.md` §2.4 and §6.5 record session as runtime state with no table; an in-process store ends sessions on restart (`40102`) and cannot serve multiple workers.
- **Candidate options:** (a) in-memory opaque token, single process, idle and absolute timeout, `HttpOnly; Secure; SameSite=Lax`, restart invalidates; (b) a durable session support store (multi-worker, explicit revocation); (c) a stateless signed cookie (no server store, no revocation); (d) an external store such as Redis (new infrastructure).
- **Decision criteria:** tolerance for session loss on restart; multi-worker need; revocation; CSRF exposure; operating cost.
- **Recommendation (non-binding):** (a) for the single-process MVP, with the timeout and flags recorded here on resolution; a future multi-worker need reopens the decision. This is a recommendation, not a decision.
- **Resolution source:** Product owner adopted recommendation (a) on 2026-10-20 (Asia/Shanghai): in-process opaque token (256-bit random), single process, restart invalidates every session (`40102`), explicit revocation at sign-out. Recorded cookie parameters, matching the `backend/app/config.py` defaults: cookie name `hound_dock_session`; `HttpOnly`; `SameSite=Lax`; `Secure` effective in production (plain-HTTP development permitted); idle timeout 30 minutes; absolute timeout 8 hours. A multi-worker or durable-revocation need reopens this decision. Recorded in `CHG-024`.

## TBD-INFRA-014 — Idempotency-key persistence and replay payload

- **Category:** Engineering decision
- **Status:** Resolved
- **Owner:** User; Tech Lead records the result in `docs/04_data/` and `docs/05_api/`
- **Must confirm by:** Stage 7 — Development Setup, before `API-002`, `API-005`, `API-006`, and `API-013` are implemented
- **Impact:** `api_interface_spec.md` §9 requires the server to store `(actor, key)` with a request fingerprint and to replay the original result; `data_model_spec.md` §12.3 records "no idempotency key". A process-local store loses replays on restart; a support table adds a persisted structure outside the 13 business tables.
- **Candidate options:** (a) support store `idempotency_key` with a hash fingerprint, a minimal replay payload, and the proposed 24-hour window; (b) in-process memory (no restart durability, single worker only); (c) no store (rejected: it contradicts `api_interface_spec.md` §9).
- **Decision criteria:** replay durability across restart; no duplication of `Sensitive` content; purge cost; fit with the single-process MVP.
- **Recommendation (non-binding):** (a); the retention window remains `TBD-BIZ-008`. This is a recommendation, not a decision.
- **Resolution source:** Product owner adopted recommendation (a) on 2026-10-20 (Asia/Shanghai): durable support store `idempotency_key` keyed on (actor, key) with a SHA-256 request fingerprint and a minimal replay payload, durable across restart and correct for a single worker. The retention window stays proposed at 24 hours pending `TBD-BIZ-008`; the purge job is a later change. Recorded in `CHG-024`.

---

## CONFLICT register

The register contained no entries before 2026-10-18. The following conflicts were appended under CHG-006 and remain `Open`; neither side was chosen.

## CONFLICT-001 — Whether an Auditor role exists separately from Admin in v1

- **Point of conflict:** PRD §6 describes the Auditor as a role but says its access is an Admin capability in v1; PRD §13 gives Auditor its own positive column.
- **Side A:** `docs/01_product/prd.md` §6, Auditor row: "| **Auditor** | Reviews usage and audit records | Read-only access to runs and audit; in v1 this is an Admin capability |"
- **Side B:** `docs/01_product/prd.md` §13, permission matrix: "| View all runs and audit | ✓ | — | — | ✓ |"
- **Blocked:** ROLE-004 (Auditor), CAND-002 (proposed permission matrix), CAND-004 (audit scope) in `docs/01_product/business_model.md`
- **Arbiter:** User (product owner), with the Tech Lead recording the resolution
- **Status:** Resolved — Admin-capability side selected on 2026-10-18.
- **Closing condition:** Product owner records either (a) the Auditor is a separate role with read-only runs and audit, or (b) the Auditor is an Admin capability and PRD §13 is corrected. The Tech Lead records the chosen side in this entry. Appended by CHG-007; no side was chosen.
- **Resolution source:** Product owner selected option (b) on 2026-10-18: the Auditor is an Admin capability in v1; Admin has read-only audit access; ROLE-004 remains proposed and denied. Recorded in `CHG-012` and `docs/01_product/business_model.md` Appendix B.
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
