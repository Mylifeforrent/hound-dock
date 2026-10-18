# Frontend

Status: Draft
Owner after activation: Frontend Agent (see [AGENTS.md](../AGENTS.md))
Current state: **empty of code** — no stack, scaffold, dependency manifest, lockfile, or runnable command.

## Purpose

Reserved for the future frontend application. This README is a boundary document, not scaffolding.

## Boundaries

- MUST contain only frontend application assets once the stack is confirmed under [TBD-INFRA-001](../docs/00_setup/open_items.md).
- MUST NOT contain backend logic, secrets, production data, user PII, governance documents, or dependency manifests before the stack decision is recorded.
- MUST NOT state install, start, build, or test commands until they are verified and recorded in [docs/06_development/](../docs/06_development/README.md) (TBD-INFRA-007).
- Writes MUST stay inside `frontend/` (RULE-019).

## Open decisions affecting this area

- Frontend stack: TBD-INFRA-001.
- Package manager and dependency tooling: TBD-INFRA-005.
- Verified commands: TBD-INFRA-007.

## Rules

- [AGENTS.md](../AGENTS.md)
- [docs/00_setup/project_rules.md](../docs/00_setup/project_rules.md)
