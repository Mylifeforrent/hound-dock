# CHG-022 — Stage 1 environment baseline

Status: Reviewed
Complexity: Complex
Refs: `TBD-INFRA-004` (resolved by this change); `TBD-INFRA-005`, `TBD-INFRA-006`, `TBD-INFRA-007` (Open, unaffected); `TBD-INFRA-012`, `TBD-INFRA-013`, `TBD-INFRA-014` (Open, unaffected)
Owner: Tech Lead
Reviewer: [docs/12_reviews/CHG-022-review.md](../12_reviews/CHG-022-review.md)

## Plan

- **Why this change:** `TBD-INFRA-004` records that the Stage 1 environment baseline is missing, so no tool version, package-manager availability, safety constraint, or command is verified. This change records the observed single-host environment, resolves the missing-baseline entry, and leaves command verification and dependency tooling open.
- **Approach:** run read-only version, package-manager, and local-server probes; record the host, toolchain, Python package observations, safety constraints, executed checks with exit codes, and the not-verified list in `docs/00_setup/environment_baseline.md`; resolve `TBD-INFRA-004` in the registry with this record; propagate the current-state status across the PRD and business model, the architecture and security review text, the high-fidelity page map, the data model, the root and boundary READMEs, and `docs/06_development/`. No dependency is installed, upgraded, or locked; no project manifest, code, schema, or migration is created.
- **Affected paths:** `docs/00_setup/environment_baseline.md` (new); `docs/00_setup/open_items.md`; `docs/00_setup/README.md`; `AGENTS.md`; `README.md`; `frontend/README.md`; `backend/README.md`; `docs/01_product/prd.md`; `docs/01_product/business_model.md`; `docs/02_architecture/architecture.md`; `docs/02_architecture/03_security_reliability_and_operations.md`; `docs/02_architecture/04_architecture_review.md`; `docs/03_design/highfi_page_map.md`; `docs/04_data/data_model_spec.md`; `docs/06_development/README.md`; this record; `docs/12_reviews/CHG-022-review.md` (new).
- **Risks and mitigations:**
  1. **A read-only baseline could be read as install or command authority.** Mitigation: §1 and §5 state that no install, project pin, command, schema, or deployment is authorized; `TBD-INFRA-005/007` stay Open.
  2. **Global interpreter packages could be mistaken for project dependencies.** Mitigation: §4 labels them as global interpreter observations, not project dependencies, and records the absence of `pyproject.toml`, `uv.lock`, and `.venv`.
  3. **Host or user identifiers could enter the baseline.** Mitigation: the hostname and user-home paths are omitted; the document records only OS, architecture, tool versions, and non-personal paths.
  4. **The observed toolchain has gaps.** Mitigation: record the Node 22.23.2 vs pnpm-on-Node-24.16.0 mismatch, the missing `psycopg` and Alembic packages, and the local-only PostgreSQL server rather than treating them as ready.
  5. **Cross-ownership writes.** Mitigation: the Task Brief records the handoff. `AGENTS.md`, `docs/00_setup/**`, and `docs/13_changes/**` are Tech Lead-owned; `docs/01_product/**`, `docs/02_architecture/**`, `docs/03_design/**`, `docs/04_data/**`, `docs/06_development/**`, `frontend/**`, and `backend/**` are dormant owners. The Tech Lead authors the status propagation under this record; acceptance is pending.
- **Verification plan:** baseline presence and required sections; registry parse and counts; `TBD-INFRA-004` status/source; stale "baseline missing" scan; relative-link walk; no install/manifest/lockfile/DDL/migration/code; PII and hostname scan; Frozen scan; root layout; `git diff --check`; write-set inspection; independent review.

## Task Brief

- **Scope:** record the observed Stage 1 environment, resolve `TBD-INFRA-004`, and propagate the current-state baseline status. Do not install, upgrade, or lock a dependency; do not create a project manifest, virtual environment, code, schema, migration, command, API, `ENT`, field, error code, role, page, or state; do not resolve `TBD-INFRA-005/006/007/012/013/014`.
- **Inputs:** the read-only probes executed on 2026-10-20 (OS, Python 3.12.9, uv 0.11.32, Node 22.23.2, pnpm 11.2.2, PostgreSQL 14.20, package imports); `docs/00_setup/open_items.md`; `AGENTS.md`; `README.md`; `docs/00_setup/README.md`; `docs/01_product/prd.md`; `docs/06_development/README.md`.
- **Outputs:** the affected paths listed under Plan, this record, and the independent review record.
- **Acceptance criteria:**
  1. `docs/00_setup/environment_baseline.md` exists and records the host, toolchain, package-manager availability, safety constraints, executed checks with exit codes, and the not-verified list.
  2. `TBD-INFRA-004` is `Resolved` with the date and `CHG-022`; the registry summary reports `TBD-INFRA` 8 Open / 6 Resolved.
  3. `TBD-INFRA-005`, `TBD-INFRA-006`, `TBD-INFRA-007`, `TBD-INFRA-012`, `TBD-INFRA-013`, and `TBD-INFRA-014` remain Open; no project command, dependency, or install is authorized.
  4. The current-state "baseline missing" claims in the affected documents are updated; historical `CHG`/review records are not rewritten.
  5. No code, manifest, lockfile, virtual environment, DDL, SQL, migration, or command is added; no API/`ENT`/field/error-code/role/page/state is added.
  6. The baseline contains no hostname, user-home path, secret, credential, token, production data, or PII.
  7. Links resolve; no Frozen asset is touched; root layout is unchanged; `git diff --check` is clean.
  8. The independent review is recorded at [docs/12_reviews/CHG-022-review.md](../12_reviews/CHG-022-review.md).
- **Ownership and handoff:** `AGENTS.md`, `docs/00_setup/**`, and `docs/13_changes/**` are Tech Lead-owned. `docs/01_product/**`, `docs/02_architecture/**`, `docs/03_design/**`, `docs/04_data/**`, `docs/06_development/**`, `frontend/**`, and `backend/**` are Docs/Frontend/Backend-owned and dormant; the Tech Lead authors the status propagation under this record, following the CHG-020/CHG-021 handoff pattern. Acceptance is pending, not granted. `docs/12_reviews/**` is Verifier-owned; the review record is authored by the independent reviewer.

## Verification

Executed on 2026-10-20 (Asia/Shanghai) in the repository root. Read-only environment probes only: no install, build, server, browser, database creation, or migration was run.

| # | Check | Command | Exit | Observed result |
|---|---|---|---|---|
| 1 | Baseline presence and sections | `test -f docs/00_setup/environment_baseline.md`; `grep -n '^## '` | 0 | File exists; sections 1–8 present (Purpose, Host, Toolchain, Packages, Constraints, Checks, Not verified, Gate status) |
| 2 | Registry parse and counts | `V1` | 0 | 31 entries, 31 unique; `TBD-BIZ` 8/7; `TBD-INFRA` 8/6; `CONFLICT` 1/1 |
| 3 | `TBD-INFRA-004` resolution | `V2` | 0 | Status `Resolved`; source names the baseline, 2026-10-20, and `CHG-022`; `005/007` remain Open |
| 4 | Stale "baseline missing" claims | `V3` | 1 (no matches) | 0 matches for "Stage 1 baseline is missing", "environment_baseline.md does not exist", "no Stage 1 baseline", or an unresolved `TBD-INFRA-004` claim in current docs |
| 5 | Relative links | `V4` | 0 | 0 missing links across 17 changed Markdown files, including the review record |
| 6 | No install/manifest/lockfile/DDL/code | `V5` | 0 | Only `backend/README.md` and `frontend/README.md`; no `pyproject.toml`, `package.json`, lockfile, `*.sql`, `alembic.ini`, or `.venv` |
| 7 | PII and hostname scan | `V6` | 0 | No account name, home-directory token, home-path prefix, hostname, secret, credential, or token appears in the baseline |
| 8 | Frozen assets | `V7` | 1 (no matches) | No Frozen asset exists or was touched |
| 9 | Root layout | `V8` | 0 | `.git`, `.gitignore`, `AGENTS.md`, `README.md`, `backend`, `docs`, `frontend`; unchanged |
| 10 | Whitespace | `V9` | 0 | `git diff --check` clean |
| 11 | Write set | `V10` | 0 | 14 modified files plus the baseline, this record, and the review record |
| 12 | Independent review | `V11` | 0 | Review record exists; verdict **PASS WITH MINOR ISSUES**; P1s closed, residual P2 citations are non-blocking |

### Commands executed

```bash
# V1 — registry parse and counts
python3 - <<'PY'
import re, pathlib
p = pathlib.Path('docs/00_setup/open_items.md').read_text()
e = re.findall(r'^## ((?:TBD-BIZ|TBD-INFRA|CONFLICT)-\d{3}) —', p, re.M)
print('entries', len(e), 'unique', len(set(e)))
for pref in ('TBD-BIZ', 'TBD-INFRA', 'CONFLICT'):
    ids = [i for i in e if i.startswith(pref)]
    st = []
    for i in ids:
        m = re.search(r'^## ' + re.escape(i) + r' —.*?(?=^## |\Z)', p, re.S | re.M)
        st.append(re.search(r'\*\*Status:\*\* (\w+)', m.group(0)).group(1))
    print(pref, 'Open', st.count('Open'), 'Resolved', st.count('Resolved'))
PY
# exit 0

# V2 — TBD-INFRA-004 status and source
python3 - <<'PY'
import re, pathlib
p = pathlib.Path('docs/00_setup/open_items.md').read_text()
m = re.search(r'^## TBD-INFRA-004 —.*?(?=^## |\Z)', p, re.S | re.M).group(0)
print(re.search(r'\*\*Status:\*\* (\w+)', m).group(1))
print([l for l in m.splitlines() if l.startswith('- **Resolution source:**')][0])
PY
# exit 0

# V3 — stale current-state baseline claims
grep -rnE 'Stage 1 baseline is missing|environment_baseline\.md does not exist|Stage 1 environment baseline.*Missing|no Stage 1 baseline|TBD-INFRA-004.{0,80}(is )?Open|TBD-INFRA-004.{0,80}(missing|absent|does not exist)' --include='*.md' AGENTS.md README.md frontend backend docs | grep -v 'CHG-' | grep -v 'docs/12_reviews' | grep -v 'Resolved' | grep -v 'docs/00_setup/environment_baseline.md'
# exit 1 (no matches)

# V4 — relative-link walk
python3 - <<'PY'
import re, pathlib, subprocess
out = subprocess.run(['git', 'status', '--porcelain'], capture_output=True, text=True).stdout
changed = [l[3:].strip() for l in out.splitlines() if l[3:].strip().endswith('.md')]
missing = []
for f in changed:
    for m in re.finditer(r'\[[^\]]*\]\(([^)]+)\)', pathlib.Path(f).read_text()):
        t = m.group(1).strip()
        if t.startswith(('http://', 'https://', 'mailto:', '#')):
            continue
        t = t.split('#')[0]
        if t and not (pathlib.Path(f).parent / t).resolve().exists():
            missing.append((f, t))
print('changed', len(changed), 'missing', len(missing))
for x in missing:
    print('MISSING', x)
PY
# exit 0

# V5 — prohibited files
git ls-files backend frontend
find . -path ./.git -prune -o \( -name 'pyproject.toml' -o -name 'package.json' -o -name '*.lock' -o -name 'uv.lock' -o -name '*.sql' -o -name 'alembic.ini' \) -print
test -d .venv
# exit 0; no prohibited file; .venv exit 1

# V6 — PII review of the baseline
python3 - <<'PY'
import re, pathlib
t = pathlib.Path('docs/00_setup/environment_baseline.md').read_text()
print('emails', len(re.findall(r'[^@\s]+@[^@\s]+', t)))
print('account-or-home-path-hits', len(re.findall(r'/(?:home|Users)/[^/\s]+', t)))
print('hostname-label', 'hostname:' in t.lower())
PY
# exit 0; emails 0, account-or-home-path-hits 0, hostname-label False

# V7 — Frozen assets
grep -rl '^Status: Frozen' docs
# exit 1 (no matches)

# V8 — root layout
ls -A
# exit 0

# V9 — whitespace
git diff --check
# exit 0

# V10 — write set
git status --short
# exit 0

# V11 — independent review record
test -f docs/12_reviews/CHG-022-review.md
# exit 0 after review
```

Author verification: **PASS**. Independent Verifier review: see [docs/12_reviews/CHG-022-review.md](../12_reviews/CHG-022-review.md).

## Dependency audit

None. No dependency is added, upgraded, imported, installed, or locked. The Python package versions in the baseline are observations of the global interpreter, not project dependencies; `TBD-INFRA-005` remains Open and any future dependency requires a RULE-007 audit.

## Decision and conflict log

- 2026-10-20: The Stage 1 read-only probes were executed on the local host. The baseline records macOS 26.1 arm64, Python 3.12.9, uv 0.11.32, Node 22.23.2, pnpm 11.2.2, PostgreSQL 14.20, and the observed Python packages.
- 2026-10-20: `TBD-INFRA-004` is Resolved because the baseline now exists and records the observed environment. This does not resolve `TBD-INFRA-005/006/007`, authorize a dependency or command, or authorize implementation.
- 2026-10-20: The observed toolchain has two recorded gaps: pnpm runs under Node 24.16.0 while `PATH` Node is 22.23.2, and `psycopg`/Alembic are absent. Neither gap is fixed by this change.
- 2026-10-20: No API, `ENT`, field, error code, role, page, state, permission, or business rule is added or changed. No code, manifest, lockfile, DDL, SQL, migration, command, or dependency is added.
- 2026-10-20: `CONFLICT-002` remains Open and is untouched.
