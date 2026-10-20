# Backend

Status: Draft
Owner after activation: Backend Agent (see [AGENTS.md](../AGENTS.md))
Current state: **Stage 7 toolchain baseline recorded (`CHG-024`)** — user-supplied manifest (`pyproject.toml`), lockfile (`uv.lock`), and `.python-version` are present and pre-approved under `RULE-021`; `uv sync` is verified in [docs/06_development/](../docs/06_development/README.md). The initial `app/` modules and tests were removed at the owner's direction on 2026-10-20 (`CHG-027`); there is no application code. No endpoint of `API-001`–`API-015` is implemented.

## Purpose

Reserved for the future backend application. This README is a boundary document, not scaffolding.

## Boundaries

- User-supplied backend files and code are pre-approved under `RULE-021`; the activation/Stage 7/dependency-audit gate is advisory for them.
- MUST contain only backend application assets once activation, the recorded Stage 1 baseline, the Stage 7 commands, and a dependency audit are in place; `TBD-INFRA-002` is Resolved ([open_items.md](../docs/00_setup/open_items.md)).
- MUST NOT contain frontend assets, secrets, production data, user PII, governance documents, or dependency manifests before activation and a separate change record.
- MUST NOT state install, start, build, or test commands until they are verified and recorded in [docs/06_development/](../docs/06_development/README.md) (TBD-INFRA-007).
- Data handling MUST NOT begin until data sensitivity is confirmed under TBD-BIZ-003.
- Writes MUST stay inside `backend/` (RULE-019).

## Open decisions affecting this area

- Backend stack: `TBD-INFRA-002` — Resolved (Python 3.12 + FastAPI + uv; exact versions `TBD-INFRA-004`; see [CHG-019](../docs/13_changes/CHG-019-frontend-backend-stack.md)).
- Data store: `TBD-INFRA-003` — Resolved (PostgreSQL; physical schema, indexes, and migrations are not authored).
- Credential verifier: `TBD-INFRA-012` — Resolved (PBKDF2-HMAC-SHA256 in the security-owned support store; see [CHG-024](../docs/13_changes/CHG-024-stage-7-backend-decisions-and-toolchain.md)).
- Session: `TBD-INFRA-013` — Resolved (in-process opaque token; parameters recorded in `CHG-024`).
- Idempotency store: `TBD-INFRA-014` — Resolved (support store `idempotency_key`; retention window pending `TBD-BIZ-008`).
- Package manager and dependency tooling: `TBD-INFRA-005` — backend portion settled (`uv` + committed `uv.lock`); frontend toolchain still open.
- Verified commands: `TBD-INFRA-007` — backend install/test verified; dev-run/build/lint/typecheck/deploy still open.

## Rules

- [AGENTS.md](../AGENTS.md)
- [docs/00_setup/project_rules.md](../docs/00_setup/project_rules.md)
