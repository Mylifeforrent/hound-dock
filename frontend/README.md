# Frontend

Status: Draft
Owner after activation: Frontend Agent (see [AGENTS.md](../AGENTS.md))
Current state: **empty of code** — frontend stack recorded as React 19 + TypeScript 5 + Vite 7 (client-only SPA, no SSR); no scaffold, dependency manifest, lockfile, or runnable command.

## Purpose

Reserved for the future frontend application. This README is a boundary document, not scaffolding.

## Boundaries

- MUST contain only frontend application assets once activation, the recorded Stage 1 baseline, and the Stage 7 commands are in place; `TBD-INFRA-001` is Resolved ([open_items.md](../docs/00_setup/open_items.md)).
- MUST NOT contain backend logic, secrets, production data, user PII, governance documents, or dependency manifests before activation and a separate change record.
- MUST NOT state install, start, build, or test commands until they are verified and recorded in [docs/06_development/](../docs/06_development/README.md) (TBD-INFRA-007).
- Writes MUST stay inside `frontend/` (RULE-019).

## Open decisions affecting this area

- Frontend stack: `TBD-INFRA-001` — Resolved (React 19 + TypeScript 5 + Vite 7; exact versions `TBD-INFRA-004`; see [CHG-019](../docs/13_changes/CHG-019-frontend-backend-stack.md)).
- Component library, design tool, and handoff format: not selected; the stack resolution does not select one.
- Package manager and dependency tooling: `TBD-INFRA-005` (Node/pnpm build toolchain).
- Verified commands: `TBD-INFRA-007`.

## Rules

- [AGENTS.md](../AGENTS.md)
- [docs/00_setup/project_rules.md](../docs/00_setup/project_rules.md)
