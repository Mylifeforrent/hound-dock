# CHG-021 — Gate 1 acceptance of the PRD scope boundary

Status: Reviewed
Complexity: Complex
Refs: `TBD-BIZ-012` (resolved by this change); `TBD-BIZ-005`, `TBD-BIZ-006`, `TBD-BIZ-007`, `TBD-BIZ-008`, `TBD-BIZ-010`, `TBD-BIZ-013`, `TBD-BIZ-014`, `TBD-BIZ-015`, `TBD-INFRA-004`, `TBD-INFRA-005`, `TBD-INFRA-007`, `TBD-INFRA-012`, `TBD-INFRA-013`, `TBD-INFRA-014`, `CONFLICT-002` (Open, unaffected)
Owner: Tech Lead
Reviewer: [docs/12_reviews/CHG-021-review.md](../12_reviews/CHG-021-review.md)

## Plan

- **Why this change:** `TBD-BIZ-012` recorded that Gate 1 had not accepted or amended the product baseline. The product owner selected option (b) on 2026-10-19: accept the MVP scope boundary only and keep roles, metrics, NFRs, and the execution model as candidates. This record applies that decision to the current PRD v0.2 baseline and removes the stale "Gate 1 not accepted" current-state claims from the documents that assert them.
- **Approach:** Resolve `TBD-BIZ-012` in the registry with option (b), the date, and this record; update the registry summary; propagate the current-state status to the PRD, business model, `AGENTS.md`, architecture, data model, API contract, and high-fidelity page map; correct the derived "Must close before Gate 1" summary in the business model; record an independent review. Historical `CHG` and `docs/12_reviews` records are not rewritten.
- **Affected paths:** `AGENTS.md`; `docs/00_setup/open_items.md`; `docs/01_product/prd.md`; `docs/01_product/business_model.md`; `docs/02_architecture/architecture.md`; `docs/02_architecture/00_research_and_input_traceability.md`; `docs/02_architecture/02_api_workflow_and_review.md`; `docs/02_architecture/03_security_reliability_and_operations.md`; `docs/02_architecture/04_architecture_review.md`; `docs/03_design/highfi_page_map.md`; `docs/04_data/data_model_spec.md`; `docs/05_api/api_interface_spec.md`; this record; `docs/12_reviews/CHG-021-review.md`.
- **Risks and mitigations:**
  1. **The business-model "Must close before Gate 1" line conflicts with option (b).** Mitigation: the registry is the higher-precedence source for `TBD` status; option (b) explicitly permits acceptance with roles, metrics, NFRs, and execution as candidates. The derived line is corrected to "Open after Gate 1" and no other `TBD` is resolved. If the product owner intended the strict reading, this record must be rejected and Gate 1 reopened.
  2. **A status change could be read as implementation authority.** Mitigation: every updated statement keeps `Draft`, keeps the Stage 1/7 gates open, and states that implementation is not authorized.
  3. **Cross-ownership writes.** Mitigation: the handoff is recorded in the Task Brief. `docs/01_product/**`, `docs/02_architecture/**`, `docs/03_design/**`, `docs/04_data/**`, and `docs/05_api/**` are Docs Agent-owned and dormant; the Tech Lead authors the status propagation under this record, following the CHG-020 precedent. Acceptance is pending.
  4. **The `TBD-BIZ-012` title still names PRD v0.1.** Mitigation: the title is left as historical; the resolution source names PRD v0.2 and option (b), which closes the target-revision ambiguity recorded as M-02.
  5. **Propagation could miss a current-state claim.** Mitigation: the verification scans every current-state document for the stale phrasings; historical `CHG` and review records are intentionally excluded.
- **Verification plan:** registry parse, status, and counts; resolution text; stale-claim scan; relative-link walk; API/`ENT`/error-code surface check; code, manifest, lockfile, DDL, and migration scan; Frozen scan; root layout; `git diff --check`; write-set inspection; independent review record.

## Task Brief

- **Scope:** record the product-owner Gate 1 decision under `TBD-BIZ-012` option (b), propagate the current-state status, and correct the derived "Must close before Gate 1" summary. Do not resolve any other `TBD`, choose a role, metric, NFR threshold, or execution model, add an API/`ENT`/field/error code/role/page/state, write code/DDL/migrations, or authorize implementation.
- **Inputs:** the product-owner selection of option (b) on 2026-10-19 (Asia/Shanghai); `docs/00_setup/open_items.md`; `docs/01_product/prd.md`; `docs/01_product/business_model.md`; `AGENTS.md`; `docs/02_architecture/**`; `docs/03_design/highfi_page_map.md`; `docs/04_data/data_model_spec.md`; `docs/05_api/api_interface_spec.md`.
- **Outputs:** the affected paths listed under Plan, this record, and the independent review record.
- **Acceptance criteria:**
  1. `TBD-BIZ-012` is `Resolved` with option (b), the date, and `CHG-021`; the summary reports `TBD-BIZ` 8 Open / 7 Resolved; `TBD-INFRA` and `CONFLICT` counts are unchanged.
  2. Every current-state "Gate 1 not accepted" or "`TBD-BIZ-012` is Open" claim in the affected documents is updated; historical `CHG` and review records are not rewritten.
  3. No other `TBD` or `CONFLICT` is resolved or created; no new identifier is introduced.
  4. No implementation authorization is claimed; the Stage 1/7 baseline (`TBD-INFRA-004/005/007`) and a separate implementation `CHG` remain required.
  5. No code, manifest, lockfile, DDL, SQL, migration, schema, or command is added; the API, `ENT`, error-code, role, page, and state surfaces are unchanged.
  6. Relative links resolve; no Frozen asset is touched; the root layout is unchanged; `git diff --check` is clean.
  7. The independent review is recorded at [docs/12_reviews/CHG-021-review.md](../12_reviews/CHG-021-review.md) and linked here.
- **Ownership and handoff:** `AGENTS.md`, `docs/00_setup/**`, and `docs/13_changes/**` are Tech Lead-owned. `docs/01_product/**`, `docs/02_architecture/**`, `docs/03_design/**`, `docs/04_data/**`, and `docs/05_api/**` are Docs Agent-owned and dormant; the Tech Lead authors the status propagation under this record, following the CHG-020 handoff pattern. Acceptance is pending, not granted. `docs/12_reviews/**` is Verifier-owned; the review record is authored from the independent reviewer's findings and contains no source edits.

## Verification

Executed on 2026-10-19 (Asia/Shanghai) in the repository root. Documentation-only: no install, build, server, browser, database, migration, or deployment was run.

| # | Check | Command | Exit | Observed result |
|---|---|---|---|---|
| 1 | Registry parse and counts | `V1` | 0 | 31 entries, 31 unique; `TBD-BIZ` 8 Open / 7 Resolved; `TBD-INFRA` 9 Open / 5 Resolved; `CONFLICT` 1 Open / 1 Resolved; summary row `TBD-BIZ` is `8 / 7` |
| 2 | `TBD-BIZ-012` resolution | `V2` | 0 | Status `Resolved`; source names option (b), 2026-10-19, PRD v0.2 via `CHG-014`, and `CHG-021` |
| 3 | Stale current-state claims | `V3` | 1 (no matches) | 0 matches for "Gate 1 is not accepted", "not Gate 1-accepted", "Gate 1 not accepted", or "`TBD-BIZ-012` is Open" |
| 4 | Relative links | `V4` | 0 | 0 missing links across 14 changed Markdown files |
| 5 | API/`ENT` surface unchanged | `V5` | 0 | 15 unique `API-` IDs; 18 unique `ENT-` IDs; no identifier added |
| 6 | No code, manifest, lockfile, DDL, or migration | `V6` | 0 | Only `backend/README.md` and `frontend/README.md`; no prohibited file found |
| 7 | Frozen assets | `V7` | 1 (no matches) | No match; no Frozen asset exists or was touched |
| 8 | Root layout | `V8` | 0 | `.git`, `.gitignore`, `AGENTS.md`, `README.md`, `backend`, `docs`, `frontend`; unchanged |
| 9 | Whitespace | `V9` | 0 | `git diff --check` clean |
| 10 | Write set | `V10` | 0 | 12 modified files plus this record and the independent review record |
| 11 | Independent review | `V11` | 0 | `docs/12_reviews/CHG-021-review.md` exists and is linked from the header |

### Commands executed

```bash
# V1 — registry parse and counts
python3 - <<'PY'
import re, pathlib
p = pathlib.Path('docs/00_setup/open_items.md').read_text()
entries = re.findall(r'^## ((?:TBD-BIZ|TBD-INFRA|CONFLICT)-\d{3}) —', p, re.M)
print('entries', len(entries), 'unique', len(set(entries)))
for prefix in ('TBD-BIZ', 'TBD-INFRA', 'CONFLICT'):
    ids = [e for e in entries if e.startswith(prefix)]
    statuses = []
    for i in ids:
        m = re.search(r'^## ' + re.escape(i) + r' —.*?(?=^## |\Z)', p, re.S | re.M)
        s = re.search(r'\*\*Status:\*\* (\w+)', m.group(0)) if m else None
        statuses.append(s.group(1) if s else 'MISSING')
    print(prefix, 'total', len(ids), 'Open', statuses.count('Open'), 'Resolved', statuses.count('Resolved'))
print('summary', re.findall(r'\| `TBD-BIZ` \| \d+ \| \d+ \|', p))
PY
# exit 0

# V2 — resolution lookup
python3 - <<'PY'
import re, pathlib
p = pathlib.Path('docs/00_setup/open_items.md').read_text()
m = re.search(r'^## TBD-BIZ-012 —.*?(?=^## |\Z)', p, re.S | re.M).group(0)
print(re.search(r'\*\*Status:\*\* (\w+)', m).group(1))
print([l for l in m.splitlines() if l.startswith('- **Resolution source:**')][0])
PY
# exit 0

# V3 — stale current-state claims
grep -rn 'Gate 1 is not accepted\|not Gate 1-accepted\|Gate 1.*Not accepted\|Gate 1 not accepted\|TBD-BIZ-012` is Open\|TBD-BIZ-012 is Open' --include='*.md' AGENTS.md docs/01_product docs/02_architecture docs/03_design docs/04_data docs/05_api | grep -v 'CHG-' | grep -v 'docs/12_reviews'
# exit 1 (no matches)

# V4 — relative-link walk
python3 - <<'PY'
import re, pathlib, subprocess
out = subprocess.run(['git', 'status', '--porcelain'], capture_output=True, text=True).stdout
changed = [l[3:].strip() for l in out.splitlines() if l[3:].strip().endswith('.md')]
missing = []
for f in changed:
    text = pathlib.Path(f).read_text()
    for m in re.finditer(r'\[[^\]]*\]\(([^)]+)\)', text):
        target = m.group(1).strip()
        if target.startswith(('http://', 'https://', 'mailto:', '#')):
            continue
        target = target.split('#')[0]
        if target and not (pathlib.Path(f).parent / target).resolve().exists():
            missing.append((f, target))
print('changed md files:', len(changed))
print('missing links:', len(missing))
for f, t in missing:
    print('MISSING', f, '->', t)
PY
# exit 0

# V5 — API/ENT surface counts
printf 'API unique: '; grep -o 'API-[0-9][0-9][0-9]' docs/05_api/api_interface_spec.md | sort -u | wc -l
printf 'ENT unique: '; grep -o 'ENT-[0-9][0-9][0-9]' docs/04_data/data_model_spec.md | sort -u | wc -l
# exit 0

# V6 — prohibited files
git ls-files backend frontend
find . -path ./.git -prune -o \( -name 'pyproject.toml' -o -name 'package.json' -o -name '*.lock' -o -name 'uv.lock' -o -name '*.sql' -o -name 'alembic.ini' \) -print
# exit 0

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
test -f docs/12_reviews/CHG-021-review.md
# exit 0
```

Author verification: **PASS**. Independent Verifier review: see [docs/12_reviews/CHG-021-review.md](../12_reviews/CHG-021-review.md) for the reviewer's verdict and findings. Tech Lead sign-off: **2026-10-20**, recorded in the decision log.

## Dependency audit

None. No dependency is added, upgraded, imported, installed, or locked. This is a documentation-only registry and status change.

## Decision and conflict log

- 2026-10-19: The product owner selected `TBD-BIZ-012` option (b): accept the MVP scope boundary only and keep roles, metrics, NFRs, and the execution model as candidates, applied to the current PRD v0.2 baseline. Recorded in `docs/00_setup/open_items.md`.
- 2026-10-19: Gate 1 is accepted at the scope boundary. The PRD remains `Draft`; the independent review is recorded at [docs/12_reviews/CHG-021-review.md](../12_reviews/CHG-021-review.md); implementation is not authorized. The Stage 1 environment baseline (`TBD-INFRA-004`), tooling (`TBD-INFRA-005`), verified commands (`TBD-INFRA-007`), and a separate implementation `CHG` remain required.
- 2026-10-19: The business-model self-check block line "Must close before Gate 1" is corrected to "Open after Gate 1" because `TBD-BIZ-012` option (b) explicitly permits acceptance with roles, metrics, NFRs, and execution as candidates. This is a lower-precedence derived summary corrected to the registry decision; it is not a `CONFLICT` resolution and resolves no other `TBD`.
- 2026-10-19: No API, `ENT`, field, error code, role, page, state, permission, or business rule is added or changed. No code, manifest, lockfile, DDL, SQL, migration, or command is added.
- 2026-10-19: `CONFLICT-002` remains `Open` and is untouched. No `CONFLICT` is registered by this change.
- 2026-10-19: The independent review's P1 (the change record pre-stated the reviewer's verdict) was fixed by replacing the verdict with a pointer to the review record and reconciling the decision log. P2-1 was addressed by scoping the PRD's outstanding review to PRD v0.2 (`CHG-014`). P2-2 is a pre-existing `CF-09` table anomaly at `docs/05_api/api_interface_spec.md:1301`, identical at `HEAD` and unchanged by this record.
- 2026-10-20: The product owner/Tech Lead confirmed the change set and signed off `CHG-021` for commit. The Gate 1 scope boundary decision (option (b)) is unchanged. This entry and the `Status: Reviewed` transition are administrative; they do not alter the substantive content reviewed at SHA-256 `fb1c448b7c24b117a17050b890cda22913ac7262c0f0d0fd67f6bc5ed2dd31e8`.
