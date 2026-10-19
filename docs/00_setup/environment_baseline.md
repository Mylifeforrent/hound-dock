# Environment Baseline — Stage 1

Status: Draft
Originating stage: Stage 1 — Environment Baseline
As-of: 2026-10-20
Owner: Tech Lead
Change record: `docs/13_changes/CHG-022-stage-1-environment-baseline.md`
Refs: `TBD-INFRA-004` (resolved by this record); `TBD-INFRA-005`, `TBD-INFRA-006`, `TBD-INFRA-007` (Open)

## 1. Purpose and scope

This baseline records the observed single-host development environment for `hound-dock` on 2026-10-20. It covers the host, tool versions, package-manager availability, and the safety constraints that apply before any dependency or command is used.

It is a read-only observation record. It does not authorize dependency installation or upgrade, project scaffolding, schema, migration, code, deployment, CI, or any command beyond the probes in §6. It records no production data, secret, credential, token, hostname, or user-home path.

## 2. Host

| Item | Observed | Evidence |
|---|---|---|
| Operating system | macOS 26.1, build 25B78 (Darwin 25.1.0, arm64) | `sw_vers`; `uname -r`; `uname -m` |
| Hostname | omitted — person-linked | privacy rule |
| Login shell | `zsh`; Bash 3.2.57 available | `$SHELL`; `bash --version` |
| Git | 2.50.1 (Apple Git-155) | `git --version` |
| Homebrew | 7.0.10-8-g15ab042 | `brew --version` |
| Hardware architecture | arm64 (Apple silicon) | `uname -m` |

## 3. Toolchain

| Tool | Observed | Location / note | Gate |
|---|---|---|---|
| Python | 3.12.9 | Framework Python 3.12 at `/Library/Frameworks/Python.framework/Versions/3.12/bin/python3`; `python3.12` resolves to the same interpreter | Matches the `TBD-INFRA-002` major version; exact project pinning remains Stage 7 |
| uv | 0.11.32 | `/opt/homebrew/bin/uv` | Available; lockfile/audit policy remains `TBD-INFRA-005` |
| Node.js | 22.23.2 | user-local install; path omitted | Exact frontend version not selected |
| pnpm | 11.2.2 | resolved through nvm Node 24.16.0; path omitted | **Mismatch:** the PATH Node is 22.23.2 while pnpm runs on Node 24.16.0; resolve before frontend commands |
| npm | 10.9.8 | user-local install; path omitted | Available |
| PostgreSQL | 14.20 (Homebrew) | local server; `pg_isready` reports `/tmp:5432 - accepting connections` | Local server available; no project database, role, schema, or migration exists |
| Bash | 3.2.57 | macOS system Bash | Scripts must not require Bash 4+ features |
| Homebrew | 7.0.10-8-g15ab042 | `/opt/homebrew/bin/brew` | Package manager available; installs still require a dependency decision |

## 4. Python package observation (read-only)

The following packages are visible to the Framework Python 3.12.9 interpreter. They are **global interpreter observations, not project dependencies**. No `pyproject.toml`, `uv.lock`, project virtual environment, or dependency audit exists.

| Package | Observed | Note |
|---|---|---|
| FastAPI | 0.135.1 | Observation only; not an approved project version |
| Pydantic | 2.12.5 | Observation only |
| SQLAlchemy | 2.0.51 | Observation only |
| Uvicorn | 0.42.0 | Observation only |
| pytest | 9.0.2 | Observation only; no test suite or test command exists |
| HTTPX | 0.28.1 | Observation only |
| psycopg | **missing** | Required by the selected `SQLAlchemy 2 + psycopg 3` direction; must be added through a RULE-007 audit and a change record |
| Alembic | **missing** | Migrations remain behind a separate physical-design change |

No package was installed, upgraded, or locked by this baseline.

## 5. Safety and operating constraints

- No dependency install, upgrade, or global configuration change without a RULE-007 audit and a change record.
- No secret, credential, token, production data, or PII is stored in the repository; fixtures and examples must be synthetic or redacted.
- No external egress. No model gateway is configured; the internal OpenAI-compatible gateway decision (`TBD-INFRA-009`) remains a decision, not a configured endpoint.
- The local PostgreSQL server is available, but no project database, schema, role, or migration has been created.
- Single host only. No CI, remote, hosting, or deployment target is selected (`TBD-INFRA-006`).
- The frontend toolchain is inconsistent: Node 22.23.2 is on `PATH`, while pnpm 11.2.2 runs under Node 24.16.0. Resolve and pin one Node/pnpm pair at Stage 7.
- `psycopg` and Alembic are absent. Do not claim backend database readiness or migration readiness.
- Bash 3.2.57 means scripts must avoid Bash 4+ syntax (`mapfile`, associative arrays, `${var,,}`, etc.).

## 6. Executed checks

All checks were run on 2026-10-20 (Asia/Shanghai) from the repository root. They are read-only observations; no install, build, test, server, database creation, or migration was run.

| # | Command | Exit | Observed result |
|---|---|---|---|
| 1 | `sw_vers` | 0 | macOS 26.1, build 25B78 |
| 2 | `uname -m` | 0 | `arm64` |
| 3 | `python3 --version` | 0 | `Python 3.12.9` |
| 4 | `python3.12 --version` | 0 | `Python 3.12.9` |
| 5 | `python3 -c 'import sys; print(sys.executable); print(sys.version)'` | 0 | Framework Python 3.12.9 |
| 6 | `uv --version` | 0 | `uv 0.11.32` |
| 7 | `node --version` | 0 | `v22.23.2` |
| 8 | `pnpm --version` | 0 | `11.2.2` |
| 9 | `npm --version` | 0 | `10.9.8` |
| 10 | `psql --version` | 0 | `psql (PostgreSQL) 14.20 (Homebrew)` |
| 11 | `pg_isready` | 0 | `/tmp:5432 - accepting connections` |
| 12 | `git --version` | 0 | `git version 2.50.1 (Apple Git-155)` |
| 13 | `bash --version` | 0 | GNU Bash 3.2.57 |
| 14 | `brew --version` | 0 | Homebrew 7.0.10-8-g15ab042 |
| 15 | `python3 -c` import probe for FastAPI, Pydantic, SQLAlchemy, Uvicorn, pytest, HTTPX, psycopg, Alembic | 0 | Versions in §4; `psycopg` and Alembic are missing |
| 16 | `test -f pyproject.toml` | 1 | No manifest |
| 17 | `test -d .venv` | 1 | No project virtual environment |

`pg_isready` confirms the local PostgreSQL server accepts connections; it does not confirm a project database, role, schema, or migration.

## 7. What is not verified

- No `uv sync`, `uv lock`, dependency install, or dependency audit.
- No project virtual environment, `pyproject.toml`, or `uv.lock`.
- No `pytest`, lint, typecheck, server start, frontend build, or browser run.
- No database creation, schema, migration, query, retention job, or backup/restore.
- No CI, remote, hosting, deployment, or model-gateway call.
- `TBD-INFRA-005` (tooling and lockfile/audit policy), `TBD-INFRA-006` (CI/hosting), and `TBD-INFRA-007` (verified commands) remain Open.
- Implementation is not authorized.

## 8. Gate status

| Item | Status | Note |
|---|---|---|
| `TBD-INFRA-004` | **Resolved** | This baseline records the host, tool versions, package-manager availability, and safety constraints |
| `TBD-INFRA-005` | Open | uv is available; lockfile, audit policy, and the frontend Node/pnpm pin remain unresolved |
| `TBD-INFRA-006` | Open | No CI, remote, or hosting selected |
| `TBD-INFRA-007` | Open | No project install, run, build, test, lint, or typecheck command is verified |
| Implementation authorization | **None** | Gate 2–5, the security decisions, and the implementation change remain required |
