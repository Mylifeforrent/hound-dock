# Backend

Status: Draft
Owner after activation: Backend Agent (see [AGENTS.md](../AGENTS.md))
Current state: **empty of code** — backend stack recorded as Python 3.12 + FastAPI + uv; no scaffold, dependency manifest, lockfile, or runnable command.

## Purpose

Reserved for the future backend application. This README is a boundary document, not scaffolding.

## Boundaries

- MUST contain only backend application assets once activation, the Stage 1/7 baseline, and a dependency audit are recorded; `TBD-INFRA-002` is Resolved ([open_items.md](../docs/00_setup/open_items.md)).
- MUST NOT contain frontend assets, secrets, production data, user PII, governance documents, or dependency manifests before activation and a separate change record.
- MUST NOT state install, start, build, or test commands until they are verified and recorded in [docs/06_development/](../docs/06_development/README.md) (TBD-INFRA-007).
- Data handling MUST NOT begin until data sensitivity is confirmed under TBD-BIZ-003.
- Writes MUST stay inside `backend/` (RULE-019).

## Open decisions affecting this area

- Backend stack: `TBD-INFRA-002` — Resolved (Python 3.12 + FastAPI + uv; exact versions `TBD-INFRA-004`; see [CHG-019](../docs/13_changes/CHG-019-frontend-backend-stack.md)).
- Data store: `TBD-INFRA-003` — Resolved (PostgreSQL; physical schema, indexes, and migrations are not authored).
- Package manager and dependency tooling: `TBD-INFRA-005` (uv recorded; lockfile and audit policy open).
- Verified commands: `TBD-INFRA-007`.

## Rules

- [AGENTS.md](../AGENTS.md)
- [docs/00_setup/project_rules.md](../docs/00_setup/project_rules.md)
