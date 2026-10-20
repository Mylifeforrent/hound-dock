# CHG-027 — Backend implementation code removed; toolchain baseline retained

Status: Draft
Complexity: Simple
Refs: `CHG-024` (toolchain baseline retained); `CHG-025` (executor port comment removed with the code); `TBD-INFRA-012/013/014` (Resolved decisions unaffected — they govern future implementation); `TBD-INFRA-007` (Open; test command annotated)
Owner: Tech Lead (recorded on explicit user direction, 2026-10-20)
Reviewer: pending — user-directed removal under `RULE-021`; the independent review gate is advisory for it

## Plan

- **Why this change:** the owner directed that the implemented code under `backend/` be deleted. Scope confirmed with the owner: remove `backend/app/` and `backend/tests/`; keep `pyproject.toml`, `uv.lock`, `.python-version`, and the boundary `README.md`.
- **Approach:** delete the two directories (all content was untracked, user-supplied or concurrently authored — nothing tracked is deleted); annotate `backend/README.md` and `docs/06_development/README.md` so the recorded test command's current state is honest; register this record; commit the accumulated CHG-024/025/026/027 work set.
- **Affected paths:** `backend/app/` (deleted); `backend/tests/` (deleted); `backend/README.md`; `docs/06_development/README.md`; this record; the `docs/13_changes/README.md` asset list.
- **Risks and mitigations:**
  1. **The deletion discards concurrently authored work** (13 modules written by another session on 2026-10-20, including the Argon2id credential adapter that diverged from `TBD-INFRA-012`). Mitigation: done at explicit owner direction; the file list is preserved in the decision log; the resolved decisions remain the authority for any reimplementation.
  2. **The recorded test command now collects nothing.** Mitigation: `docs/06_development/` states that `pytest` exits non-zero (code 5) until a test exists, and that the command must be re-verified then.
  3. **`pyproject.toml` still pins `argon2-cffi`** though `TBD-INFRA-012` resolved to PBKDF2. Mitigation: the manifest is user-supplied and untouched here; the advisory from `CHG-024` stands.

## Task Brief

- **Scope:** remove `backend/app/` and `backend/tests/`; keep the toolchain files; no registry status changes; no behavior anywhere else.
- **Inputs:** owner direction of 2026-10-20 (this session) with confirmed scope.
- **Outputs:** the affected paths above.
- **Acceptance criteria:**
  1. `backend/` contains only `README.md`, `pyproject.toml`, `uv.lock`, `.python-version`, and ignored cache/venv artifacts.
  2. No tracked file is deleted; `git ls-files backend` still returns only `backend/README.md`.
  3. `backend/README.md` and `docs/06_development/README.md` describe the post-removal state truthfully.
  4. Registry statuses are unchanged from `CHG-026`.

## Verification

Executed on 2026-10-20 (Asia/Shanghai) from the repository root.

| # | Check | Command | Exit | Observed result |
|---|---|---|---|---|
| 1 | Removal complete | `find backend -not -path '*/.venv/*' -not -path '*/.uv-cache/*' -not -path '*/.pytest_cache/*' -not -path '*/.ruff_cache/*' -not -path '*/__pycache__/*' \( -name '*.py' -o -name app -o -name tests \)` | 0 (no matches) | 0 matches; `backend/` holds only `README.md`, `pyproject.toml`, `uv.lock`, `.python-version`, and ignored cache/venv artifacts |
| 2 | Tracked files | `git ls-files backend` | 0 | only `backend/README.md` |
| 3 | Install command still valid | `uv --directory backend sync` | 0 | Resolved 38 packages; checked 34 packages |
| 4 | Test command state | `uv --directory backend run pytest` | 5 | no tests collected (`no tests ran`) — expected; annotated in `docs/06_development/` |
| 5 | Relative links in changed Markdown | link walk over `git status` `.md` files | 0 | 0 missing |
| 6 | Whitespace | `git diff --check` | 0 | clean |

## Dependency audit

None. No dependency is added, upgraded, or removed; the manifest and lockfile are unchanged.

## Decision and conflict log

- 2026-10-20: The owner directed removal of the implemented backend code and confirmed the scope: code only; the toolchain baseline stays. Executed under `RULE-021` (pre-approved, gates advisory).
- 2026-10-20: Deleted files (13 modules + 1 test, all untracked): `app/config.py`, `app/db.py`, `app/errors.py`, `app/logging.py`, `app/domain/{enums,models,policy}.py`, `app/ports/{__init__,credential,executor,model,session}.py`, `app/adapters/argon2_adapter.py`, `tests/test_toolchain.py`.
- 2026-10-20: The registry resolutions of `CHG-024/025/026` are decisions about future implementation and are unaffected by the removal; `docs/06_development/` notes the test command must be re-verified when tests return.
- 2026-10-20: `CONFLICT-002` remains Open and is untouched.
