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
| `TBD-BIZ` | 5 | 2 |
| `TBD-INFRA` | 10 | 1 |
| `CONFLICT` | 0 | 0 |

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

None at this time. A future conflict MUST be appended as `CONFLICT-nnn`, citing both locations, with status `Open` or `Resolved`.
