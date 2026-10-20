# docs/06_development

Status: Draft
Originating stage: Stage 7 — Development Setup
Authoritative assets:
- `docs/06_development/README.md` — verified commands and local workflow.
Allowed status: Draft / Reviewed / Frozen. `Frozen` requires explicit user approval recorded in the Frozen assets section below.
Update entry point: Docs Agent through a change record in `docs/13_changes/`; open decisions only via `docs/00_setup/open_items.md`.

## Purpose

Owns the verified development workflow: tool versions, dependency commands, build/run/test commands, and local setup steps.

**User-supplied commands and files are pre-approved** under `RULE-021`; the verification gate in this folder is advisory for them. The agent may suggest, not block.

## Verified commands (2026-10-20, `CHG-024`)

Executed on the recorded Stage 1 baseline (macOS 26.1 arm64, Python 3.12.9, uv 0.11.32 — [environment_baseline.md](../00_setup/environment_baseline.md)). Commands are run from the repository root.

| Class | Command | Exit | Observed result |
|---|---|---|---|
| Install / dependency sync | `uv --directory backend sync` | 0 | Resolved 38 packages from the committed `backend/uv.lock`; checked 34 packages |
| Test (backend) | `uv --directory backend run pytest` | 0 | 4 passed in 0.36 s (`backend/tests/test_toolchain.py`) |

Recorded backend dependency versions at resolution (`backend/uv.lock`): fastapi 0.135.1, uvicorn 0.42.0, pydantic 2.12.5, pydantic-settings 2.13.0, sqlalchemy 2.0.51, psycopg 3.2.12, alembic 1.17.2, pytest 9.0.2, httpx 0.28.1, ruff 0.15.4.

**Update (2026-10-20, `CHG-027`):** the `backend/app/` modules and `backend/tests/` were removed at the owner's direction; the manifest, lockfile, and `.python-version` remain, so the install command stays valid. The test command holds for when tests exist again — with no `backend/tests/`, `uv --directory backend run pytest` collects nothing and exits non-zero (pytest code 5); re-verify it when the first test lands. The toolchain and dependency resolutions are unaffected.

Still unverified, and not to be stated as the standard suite (`TBD-INFRA-007` remains Open): dev-run (`uvicorn`), build, lint (`ruff` was executed once with exit 1 on user-supplied files — advisory under RULE-021, not recorded as verified), typecheck, frontend commands, and deploy.

## Boundaries

- MUST NOT state install, start, build, or test commands until they are executed successfully on the recorded Stage 1 baseline and entered here with their exit codes.
- MUST NOT contain dependency manifests, lockfiles, or application code.
- Depends on `TBD-INFRA-005` and `TBD-INFRA-007`; `TBD-INFRA-004` is Resolved by `CHG-022` and the baseline is [environment_baseline.md](../00_setup/environment_baseline.md).

## Frozen assets

None.
