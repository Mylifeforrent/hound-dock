# Backend

Status: Draft
Owner after activation: Backend Agent (see [AGENTS.md](../AGENTS.md))
Current state: **empty of code** — no stack, scaffold, dependency manifest, lockfile, or runnable command.

## Purpose

Reserved for the future backend application. This README is a boundary document, not scaffolding.

## Boundaries

- MUST contain only backend application assets once the stack is confirmed under [TBD-INFRA-002](../docs/00_setup/open_items.md).
- MUST NOT contain frontend assets, secrets, production data, user PII, governance documents, or dependency manifests before the stack decision is recorded.
- MUST NOT state install, start, build, or test commands until they are verified and recorded in [docs/06_development/](../docs/06_development/README.md) (TBD-INFRA-007).
- Data handling MUST NOT begin until data sensitivity is confirmed under TBD-BIZ-003.
- Writes MUST stay inside `backend/` (RULE-019).

## Open decisions affecting this area

- Backend stack: TBD-INFRA-002.
- Data store: TBD-INFRA-003.
- Package manager and dependency tooling: TBD-INFRA-005.
- Verified commands: TBD-INFRA-007.

## Rules

- [AGENTS.md](../AGENTS.md)
- [docs/00_setup/project_rules.md](../docs/00_setup/project_rules.md)
