# hound-dock

Status: Draft

**Goal:** Build a self-hosted internal agent workspace where the team can chat with an AI, register and invoke skills and MCP servers, and define and run reusable tasks.

**Current stage:** Stage 2 — Product Definition (PRD v0.1, Draft). Implementation has not started.

**MVP scope:** Chat with search, skill registry, MCP registry, and manual task runs; self-hosted with local accounts.

## Directory navigation

| Path | Purpose | Documentation |
|---|---|---|
| `frontend/` | Future frontend application. Currently contains boundary documentation only — no code, scaffold, or manifest. | [frontend/README.md](frontend/README.md) |
| `backend/` | Future backend application. Currently contains boundary documentation only — no code, scaffold, or manifest. | [backend/README.md](backend/README.md) |
| `docs/00_setup/` | Governance, numbered rules, open-item registry, environment baseline. | [README](docs/00_setup/README.md) |
| `docs/01_product/` | Goal, scope, users, non-goals, PRD. | [README](docs/01_product/README.md) · [PRD](docs/01_product/prd.md) |
| `docs/02_architecture/` | Architecture and decision records. | [README](docs/02_architecture/README.md) |
| `docs/03_design/` | UX/UI and interaction design. | [README](docs/03_design/README.md) · [Prototype](docs/03_design/prototype/index.html) |
| `docs/04_data/` | Data models, schemas, retention, migrations. | [README](docs/04_data/README.md) |
| `docs/05_api/` | API contracts and versioning. | [README](docs/05_api/README.md) |
| `docs/06_development/` | Verified development environment and commands. | [README](docs/06_development/README.md) |
| `docs/07_testing/` | Test strategy, cases, and evidence format. | [README](docs/07_testing/README.md) |
| `docs/08_security/` | Threat model, secrets, privacy, dependency security. | [README](docs/08_security/README.md) |
| `docs/09_deployment/` | Environments, release, rollback. | [README](docs/09_deployment/README.md) |
| `docs/10_operations/` | Runbooks, observability, incidents. | [README](docs/10_operations/README.md) |
| `docs/11_quality/` | Quality gates, metrics, stage-exit checklists. | [README](docs/11_quality/README.md) |
| `docs/12_reviews/` | Independent review and verification records. | [README](docs/12_reviews/README.md) |
| `docs/13_changes/` | Change records, Plans, Task Briefs, changelog. | [README](docs/13_changes/README.md) |

## Environment setup

- **Stack selected at major-version level; no project toolchain is pinned.** Frontend React 19 + TypeScript 5 + Vite 7 and backend Python 3.12 + FastAPI + uv are recorded in [open_items.md](docs/00_setup/open_items.md) (`TBD-INFRA-001`/`TBD-INFRA-002` Resolved; see [CHG-019](docs/13_changes/CHG-019-frontend-backend-stack.md)). PostgreSQL remains the selected store (`TBD-INFRA-003`). Exact project pins, the frontend Node/pnpm pair, dependency tooling, and all commands remain open: `TBD-INFRA-005/007`.
- **The Stage 1 environment baseline is recorded** at [docs/00_setup/environment_baseline.md](docs/00_setup/environment_baseline.md) (`TBD-INFRA-004` Resolved; [CHG-022](docs/13_changes/CHG-022-stage-1-environment-baseline.md)). It records the observed host and tool versions only; no project pin, install step, or command is authorized until Stage 7 verifies it.
- **Install, start, build, and test commands: TBD.** They MUST NOT be stated until verified in the baseline and recorded in [docs/06_development/](docs/06_development/README.md) (RULE-017).
- No dependency manifest, lockfile, or `.env.example` exists. Those MUST NOT be created as placeholders (RULE-017).

## Rules and decisions

- **Engineering rules authority:** [AGENTS.md](AGENTS.md) — tool-agnostic, applies to humans and AI agents.
- **Numbered enforceable rules:** [docs/00_setup/project_rules.md](docs/00_setup/project_rules.md) (`RULE-001` onward, with verification and exception approval).
- **Open decisions and conflicts:** [docs/00_setup/open_items.md](docs/00_setup/open_items.md) — the single registry for `TBD-BIZ-*`, `TBD-INFRA-*`, and `CONFLICT-*`.
- **Change process:** [docs/13_changes/README.md](docs/13_changes/README.md).

## Secrets warning

> Never commit `.env` or any real credential. `.env.example` may contain key names and comments only — never values. Never send secrets, production data, or user PII to AI tools. See RULE-008 and RULE-009.
