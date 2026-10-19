# docs/06_development

Status: Draft
Originating stage: Stage 7 — Development Setup
Authoritative assets: None yet. This folder will own the verified development environment, exact tool versions, build/run/test commands, and local workflow.
Allowed status: Draft / Reviewed / Frozen. `Frozen` requires explicit user approval recorded in the Frozen assets section below.
Update entry point: Docs Agent through a change record in `docs/13_changes/`; open decisions only via `docs/00_setup/open_items.md`.

## Purpose

Owns the verified development workflow: tool versions, dependency commands, build/run/test commands, and local setup steps.

## Boundaries

- MUST NOT state install, start, build, or test commands until they are executed successfully on the recorded Stage 1 baseline and entered here with their exit codes.
- MUST NOT contain dependency manifests, lockfiles, or application code.
- Depends on `TBD-INFRA-005` and `TBD-INFRA-007`; `TBD-INFRA-004` is Resolved by `CHG-022` and the baseline is [environment_baseline.md](../00_setup/environment_baseline.md).

## Frozen assets

None.
