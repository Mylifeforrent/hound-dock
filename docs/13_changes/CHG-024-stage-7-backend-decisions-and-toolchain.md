# CHG-024 — Session, verifier, and idempotency decisions; Stage 7 backend toolchain baseline

Status: Draft
Complexity: Complex
Refs: `TBD-INFRA-012`, `TBD-INFRA-013`, `TBD-INFRA-014` (resolved by this change); `TBD-INFRA-005`, `TBD-INFRA-007` (Open; backend progress recorded); `TBD-BIZ-008` (Open; idempotency retention window and NFR thresholds remain there)
Owner: Tech Lead (recorded on explicit user direction, 2026-10-20)
Reviewer: pending — this change executes user-directed decisions under `RULE-021`; the independent review gate is advisory for it

## Plan

- **Why this change:** `TBD-INFRA-012`, `TBD-INFRA-013`, and `TBD-INFRA-014` block the backend MVP's first endpoints (`API-001` sign-in; the four idempotency-key operations). The product owner made the three decisions in this session and directed that the registry be updated and the Stage 7 toolchain baseline be executed.
- **Approach:** record the three resolutions in `docs/00_setup/open_items.md` with the decided option and concrete parameters; execute and record the first verified backend commands (`uv sync`, `uv run pytest`) in `docs/06_development/`; update the boundary READMEs' current state; ignore Python virtualenv and tool-cache artifacts; register this record. No business endpoint, entity, permission, or acceptance criterion is added; no DDL, SQL, or migration is authored; the physical design remains a separate change.
- **Affected paths:** `docs/00_setup/open_items.md`; `docs/06_development/README.md`; `backend/README.md`; `.gitignore`; `backend/tests/test_toolchain.py` (new smoke test); `backend/pyproject.toml`, `backend/uv.lock`, `backend/.python-version`, `backend/app/**` (pre-existing user-supplied files, unchanged by this record); this record; the `docs/13_changes/README.md` asset list.
- **Risks and mitigations:**
  1. **A concurrent session is actively writing `backend/app/`** (`db.py`, `domain/models.py` appeared during this change). Mitigation: this record does not edit any `backend/app/` file; code/decision alignment items are recorded as non-blocking advisories in the decision log.
  2. **The resolved verifier (PBKDF2) diverges from the non-binding Argon2id recommendation and from `backend/app/domain/models.py`, which constrains `algorithm IN ('argon2id')` and locks `argon2-cffi`.** Mitigation: advisory only under `RULE-021`; the user (or the implementing session) aligns the code. Recorded in the decision log.
  3. **Recorded session/timeout values could look invented.** Mitigation: the values match the user-supplied `backend/app/config.py` defaults and were confirmed by the product owner when adopting option (a).
  4. **Timing-based parameter choice is host-specific.** Mitigation: parameters are recorded per row; rehash-on-sign-in allows raising them without a password reset.

## Task Brief

- **Scope:** resolve `TBD-INFRA-012/013/014`; record backend progress on `TBD-INFRA-005/007`; execute the Stage 7 install and test verification; leave the physical schema, migrations, endpoint implementation, and `backend/app/` code untouched.
- **Inputs:** product-owner decisions of 2026-10-20 (this session): verifier (c) PBKDF2-HMAC-SHA256; session (a) in-process opaque token; idempotency (a) durable support store. The user-supplied backend scaffold (`backend/pyproject.toml`, `backend/uv.lock`, `backend/app/{config,errors,logging}.py`, `backend/app/domain/**`) and the Stage 1 baseline (`CHG-022`).
- **Outputs:** the affected paths above.
- **Acceptance criteria:**
  1. `TBD-INFRA-012`, `TBD-INFRA-013`, `TBD-INFRA-014` are `Resolved` with dates, decisions, sources, and `CHG-024`; the registry summary reports `TBD-INFRA` 5 Open / 9 Resolved.
  2. `docs/06_development/` records only commands executed with exit code 0, with observed results and resolved dependency versions.
  3. `backend/README.md` no longer claims "empty of code" and states that no contract endpoint is implemented.
  4. `.gitignore` covers `.venv/`, `__pycache__/`, `.pytest_cache/`, `.ruff_cache/`, `.uv-cache/`.
  5. No `backend/app/` file is modified by this record; no DDL/SQL/migration is authored; no Frozen asset exists or is touched; root layout is unchanged.
- **Ownership:** `docs/00_setup/**`, `docs/13_changes/**`, and `.gitignore` are Tech Lead-owned; `docs/06_development/**` and `backend/**` are dormant-owner areas written under the user's explicit direction, which `RULE-021` exempts from the handoff and acceptance gates.

## Verification

Executed on 2026-10-20 (Asia/Shanghai) from the repository root, on the Stage 1 baseline. The backend tree was being modified concurrently by another session; results are as of the recorded run.

| # | Check | Command | Exit | Observed result |
|---|---|---|---|---|
| 1 | Install / dependency sync | `uv --directory backend sync` | 0 | Resolved 38 packages; checked 34 packages from the committed lockfile |
| 2 | Backend test | `uv --directory backend run pytest` | 0 | 4 passed in 0.36 s (`backend/tests/test_toolchain.py`) |
| 3 | Lint (advisory, not verified) | `uv --directory backend run ruff check .` | 1 | 2 findings in user-supplied files (`app/config.py` UP042 `str`+`Enum`; `app/errors.py` I001 import sort) — advisory under `RULE-021`; not recorded as a verified command |
| 4 | Verifier timing evidence | `uv --directory backend run python` (PBKDF2-HMAC-SHA256, 16-byte salt, 32-byte key) | 0 | 210,000 iters ≈ 281 ms; 600,000 iters ≈ 2,352 ms; verify via `hmac.compare_digest` correct |
| 5 | Registry parse and counts | registry-entry scan | 0 | 31 entries, 31 unique; `TBD-BIZ` 8/7; `TBD-INFRA` 5/9; `CONFLICT` 1/1; 012/013/014 `Resolved` |
| 6 | Relative links in changed Markdown | link walk over `git status` `.md` files | 0 | 0 missing (the CHG-024 reference resolves once this file exists) |
| 7 | Whitespace | `git diff --check` | 0 | clean |
| 8 | Frozen assets | `grep -rl '^Status: Frozen' docs` | 1 | no Frozen asset exists or was touched |
| 9 | Root layout | `ls -A` | 0 | `.git`, `.gitignore`, `AGENTS.md`, `README.md`, `backend`, `docs`, `frontend`; unchanged |

## Dependency audit

The manifest and lockfile are **user-supplied** (`RULE-021`); this audit is advisory and records the locked set at resolution: fastapi 0.135.1, uvicorn 0.42.0, pydantic 2.12.5, pydantic-settings 2.13.0, sqlalchemy 2.0.51, psycopg 3.2.12 (plus psycopg-binary 3.2.12), alembic 1.17.2, argon2-cffi 25.1.0, pytest 9.0.2, httpx 0.28.1, ruff 0.15.4, python-dotenv, and their transitive closure (38 packages).

Non-blocking observations:

1. **`argon2-cffi` is unused under the resolved decision.** `TBD-INFRA-012` selected PBKDF2-HMAC-SHA256 (standard library). No `backend/app/` module imports `argon2` today; removing it from `pyproject.toml` and relocking would drop `argon2-cffi`, `argon2-cffi-bindings`, `cffi`, and `pycparser`. Suggested, not applied.
2. **`psycopg[binary]`** ships a bundled libpq; fine for a self-hosted single host, revisit only if a system-libpq build is ever required.

## Decision and conflict log

- 2026-10-20: `TBD-INFRA-012` resolved to candidate (c): PBKDF2-HMAC-SHA256 in the security-owned support store `account_credential`, per-row algorithm and iteration parameters, rehash-on-sign-in retained. The product owner declined the non-binding Argon2id recommendation after a side-by-side explanation; no third-party library is required. Initial parameters recorded from executed timing: 210,000 iterations, 16-byte salt, 32-byte key, constant-time compare.
- 2026-10-20: `TBD-INFRA-013` resolved to candidate (a): in-process opaque token, single process, restart invalidates all sessions (`40102`). Cookie `hound_dock_session`, `HttpOnly`, `SameSite=Lax`, `Secure` effective in production, idle 30 minutes, absolute 8 hours — matching the `backend/app/config.py` defaults the owner supplied.
- 2026-10-20: `TBD-INFRA-014` resolved to candidate (a): durable support store `idempotency_key`, (actor, key) unique, SHA-256 request fingerprint, minimal replay payload. Retention window stays proposed (24 h) under `TBD-BIZ-008`.
- 2026-10-20: `TBD-INFRA-005` backend portion settled (uv + committed `uv.lock`; `uv sync`/`uv run pytest` verified). The frontend Node toolchain question (observed pnpm 11.2.2 vs the user-level npm default) remains open inside `TBD-INFRA-005` and is untouched here.
- 2026-10-20: `TBD-INFRA-007` records backend install/test as verified; dev-run, build, lint, typecheck, frontend, and deploy commands remain unverified and must not be cited as the standard suite.
- 2026-10-20: **Advisory divergence (non-blocking, `RULE-021`):** the concurrent implementation in `backend/app/domain/models.py` constrains `account_credential.algorithm` to `'argon2id'` with that default, and `argon2-cffi` is locked — both predate the PBKDF2 resolution. The implementing session should align the check constraint, default, and dependency with `TBD-INFRA-012`, or the owner should reopen the entry.
- 2026-10-20: No API, `ENT`, field, error code, role, page, state, permission, or business rule is added or changed. No DDL, SQL, or migration is authored; the physical design remains a separate change. `CONFLICT-002` remains Open and is untouched.
