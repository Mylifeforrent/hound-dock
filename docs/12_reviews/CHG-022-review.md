# CHG-022 Review — Stage 1 environment baseline

Status: Reviewed
Reviewer: Independent Verifier subagent

## Reviewed state

- Repository `hound-dock`, branch `docs/stack-support-stores`, `HEAD` `9f3b5cc`; uncommitted tree.
- Reviewed 2026-10-20 07:02 +0800. Write set: 7 modified files plus 2 untracked files ([environment_baseline.md](../00_setup/environment_baseline.md), [CHG-022](../13_changes/CHG-022-stage-1-environment-baseline.md)); this record is the only file I added.
- `CHG-022`: 153 lines, SHA-256 `04decf3f83d1ffcaad9c74593f2a6c504a2667afcad23d3aa5ad7cd2202983d3`. Its verification table was populated at 07:00:27, during this review; all findings cite this hash.
- Baseline: 112 lines, SHA-256 `0f873ba76bb9224a467b75282ad78790fbf00fc66860acd3716ff217f04a6674`.
- Registry: 265-line `open_items.md`, SHA-256 `fc8145b81b279abaeea9b51c55f26721dfa3500dce0e4aa0ee3385d495c03f1a`.
- Reviewed all changed/new paths and swept the current docs for stale baseline claims.

## Verdict

**PASS WITH MINOR ISSUES** — updated on re-check (2026-10-20); the initial `FAIL` recorded below is closed. The baseline content, registry resolution, and write set are correct and were independently reproduced: every recorded version and exit code matches the probes, the two toolchain gaps are recorded, and no install, build, or test is claimed. The three P1s (PII in the change record, stale current-state claims, undeclared cross-area path) and the two P2s are fixed and re-verified. Three residual P2 citation cleanups and one handoff-text nit remain; none blocks acceptance.

The checklist and findings below record the state at the initial review; see the re-check for the current disposition.

## Checklist

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Change record has Plan / Task Brief / Verification / Dependency audit / Decision log; baseline has the required sections | PASS | `CHG-022` §Plan–§Decision and conflict log; baseline §1–§8 (purpose, host, toolchain, packages, constraints, executed checks, not-verified, gate status). |
| 2 | Registry: `TBD-INFRA-004` Resolved with date and `CHG-022`; counts 8/6, 8/7, 1/1; only 004 changed | PASS | [open_items.md:227](../00_setup/open_items.md#L227), [:233](../00_setup/open_items.md#L233); parse returns 31 entries/31 unique, `TBD-INFRA` 8 Open/6 Resolved, `TBD-BIZ` 8/7, `CONFLICT` 1/1; registry diff changes only the 004 status/source and the summary row. |
| 3 | Baseline accuracy: versions, exit codes, gaps, no install/build/test claim | PASS | Re-ran the probes: macOS 26.1 (25B78), Darwin 25.1.0, arm64, Bash 3.2.57, Git 2.50.1, Python 3.12.9, uv 0.11.32, Node 22.23.2, pnpm 11.2.2 under nvm Node 24.16.0, npm 10.9.8, PostgreSQL 14.20 (client and server), `pg_isready` 0; FastAPI 0.135.1, Pydantic 2.12.5, SQLAlchemy 2.0.51, Uvicorn 0.42.0, pytest 9.0.2, HTTPX 0.28.1; `psycopg` and Alembic missing; `test -f pyproject.toml` and `test -d .venv` exit 1. No install/build/test claim in §6–§7. See P2-2 for two wording nits. |
| 4 | No PII in the baseline or the change record | FAIL | The baseline is clean (no host, home path, or account string). The change record is not: P1-1. |
| 5 | No code, manifest, lockfile, DDL/SQL, migration, `.venv`; `frontend/`/`backend/` README-only | PASS | `git status` contains only Markdown; `frontend/` and `backend/` hold only `README.md`; no `package.json`, `pyproject.toml`, `uv.lock`, `*.sql`, `alembic.ini`, or `.venv`; root 7 entries unchanged. |
| 6 | Current-state "baseline missing" / "`TBD-INFRA-004` Open" claims updated | FAIL | Multiple current docs still assert the opposite of the registry; P1-2. |
| 7 | Relative links resolve; `git diff --check` 0; no Frozen asset | PASS | 72 relative links across the 9 changed/new Markdown files; the only unresolved target is this record, which now exists. `git diff --check` exit 0; `grep -rl '^Status: Frozen' docs` exit 1. |
| 8 | No over-claim: `TBD-INFRA-005/006/007/012/013/014` Open; implementation unauthorized | PASS | Baseline §5/§7/§8 and [CHG-022:72](../13_changes/CHG-022-stage-1-environment-baseline.md#L72) deny install, command, and implementation authority; the registry leaves all six Open. |

## Findings

### P0

None.

### P1-1 — The change record embeds person-linked identifiers

[CHG-022:50](../13_changes/CHG-022-stage-1-environment-baseline.md#L50) and its command block at [CHG-022:117](../13_changes/CHG-022-stage-1-environment-baseline.md#L117) reproduce the login account name, a home-directory token, and a home-path prefix as literal scan targets. The baseline itself is clean, but this record would commit the identifiers it claims to exclude, contrary to AGENTS §9 #4 and §6 (person-linked identifiers are `Sensitive`). Row 7 is also self-defeating: the scan that proves the baseline is clean is the reason the record is not.

**Suggested correction (not applied):** describe the scan generically, e.g. "platform user name, computer name, and home-path prefixes", and keep the literal values out of the repository; re-run the scan without echoing them.

### P1-2 — Stale current-state claims remain, and verification row 4 overstates its result

[CHG-022:47](../13_changes/CHG-022-stage-1-environment-baseline.md#L47) reports "0 matches ... in current docs". The `V3` pattern set only catches a few phrasings; these current-state claims remain after the resolution:

- [03_security_reliability_and_operations.md:392](../02_architecture/03_security_reliability_and_operations.md#L392), [:400](../02_architecture/03_security_reliability_and_operations.md#L400), [:454](../02_architecture/03_security_reliability_and_operations.md#L454) (status table says `Open`), [:488](../02_architecture/03_security_reliability_and_operations.md#L488), [:492](../02_architecture/03_security_reliability_and_operations.md#L492)
- [business_model.md:1387](../01_product/business_model.md#L1387) ("Open after Gate 1" list), [:1191](../01_product/business_model.md#L1191)
- [data_model_spec.md:51](../04_data/data_model_spec.md#L51) ("Remaining open" list), [:756](../04_data/data_model_spec.md#L756)
- [architecture.md:435](../02_architecture/architecture.md#L435)
- [frontend/README.md:13](../../frontend/README.md#L13) and [backend/README.md:13](../../backend/README.md#L13) ("Stage 1/7 baseline")
- [open_items.md:197](../00_setup/open_items.md#L197), [:208](../00_setup/open_items.md#L208) and [:230](../00_setup/open_items.md#L230) inside resolved entries ("does not exist")

Either widen `V3`, update the claims, or state explicitly in the change record which documents remain stale and why that is acceptable. A status table that still prints `Open` for a Resolved TBD is not acceptable.

### P1-3 — A modified cross-ownership file is undeclared and has no handoff

The write set has 7 modified files, including `docs/03_design/highfi_page_map.md`, but the affected-path list at [CHG-022:13](../13_changes/CHG-022-stage-1-environment-baseline.md#L13) omits it, and the handoff at [CHG-022:36](../13_changes/CHG-022-stage-1-environment-baseline.md#L36) names only `docs/01_product/**` and `docs/06_development/**`. `docs/03_design/**` is Docs Agent-owned, so this is a cross-boundary write without the RULE-019 handoff. Verification row 11 is numerically right but does not reconcile with the declared affected paths.

**Suggested correction:** add the path to Affected paths and to the handoff (acceptance still pending), or revert that edit and record the status propagation as a follow-up.

### P2-1 — Author verification line contradicts the populated table

[CHG-022:141](../13_changes/CHG-022-stage-1-environment-baseline.md#L141) still says "Author verification: **PENDING**" although §Verification now records commands, exit codes, and observed results. (Row 12 "Pending" is this review and is expected.) Replace the stale attestation with the author's confirmation.

### P2-2 — Minor version/evidence precision in the baseline

- [environment_baseline.md:24](../00_setup/environment_baseline.md#L24) and [:38](../00_setup/environment_baseline.md#L38) record Homebrew `7.0.10`; the probe emits `7.0.10-8-g15ab042`. The core version is right; record the full string or note the truncation.
- [environment_baseline.md:20](../00_setup/environment_baseline.md#L20) cites `sw_vers` and `uname -m` for Darwin 25.1.0; `uname -r` is what returns 25.1.0 (confirmed). Add it to the evidence cell.

## Attestation

I performed a read-only review and wrote only this record. I re-ran the version and package probes (`sw_vers`, `uname -m`, `uname -r`, `python3 --version`, `python3.12 --version`, `python3 -c` import probe, `uv --version`, `node --version`, `pnpm --version`, `npm --version`, `psql --version`, `pg_isready`, `git --version`, `bash --version`, `brew --version`), a read-only `psql -d postgres -tAc 'show server_version'`, `test -f pyproject.toml`, `test -d .venv`, `readlink` on `pnpm`, plus `git status`, `git diff`, `git diff --check`, `git rev-parse`, `shasum -a 256`, `ls`, `grep`, `stat`, and Python scripts for registry counts, stale-claim scanning, link resolution, and PII comparison (values never printed). I did not install, upgrade, build, test, start a server, create a database, or run a migration; I did not execute product code. I edited no source, registry, change record, or README, and made no commit.

## Next step

Accept. The three P1s are closed on re-check and no further review is required unless the registry, baseline, or write set changes. Optional cleanup: the residual `TBD-INFRA-004` citations under "Residual P2" and the stale risk-5 handoff sentence in `CHG-022`.

## Re-check (2026-10-20)

Re-read the current tree at `HEAD` `9f3b5cc`: 14 modified files and 3 new (baseline, `CHG-022`, this record). Current `CHG-022` is 159 lines, SHA-256 `e6914e9c6f334a43649ac43bd512e1701873391e1207eaaac97b879df2147c97`; the baseline is 112 lines, SHA-256 `c7bf94bf30fcdde376d090425e171861de93575aa681766a7efbde0c490c8498`; the registry is 271 lines, SHA-256 `5f6791c2374422158038f7922d6cd17306ac59f8f5a44eb2a38bfb2277eb508a`. The checklist and findings above are the initial snapshot; this section is the current disposition.

- **P1-1 — CLOSED.** The literal account-name, home-token, and home-path strings are gone from [CHG-022:50](../13_changes/CHG-022-stage-1-environment-baseline.md#L50) and the `V6` block at [:117](../13_changes/CHG-022-stage-1-environment-baseline.md#L117). A scan of every changed file for the current login name, computer name, and home-path prefix returns no hit (values not printed); `V6` is now generic (email, home path, hostname label). The baseline still omits the host.
- **P1-2 — CLOSED for the reported claims.** The cited lines are fixed: [03_security_reliability_and_operations.md:97](../02_architecture/03_security_reliability_and_operations.md#L97), [:114](../02_architecture/03_security_reliability_and_operations.md#L114), [:392](../02_architecture/03_security_reliability_and_operations.md#L392), [:400](../02_architecture/03_security_reliability_and_operations.md#L400), [:454](../02_architecture/03_security_reliability_and_operations.md#L454), [:488](../02_architecture/03_security_reliability_and_operations.md#L488), [:492](../02_architecture/03_security_reliability_and_operations.md#L492); [business_model.md:1077](../01_product/business_model.md#L1077), [:1191](../01_product/business_model.md#L1191), [:1387](../01_product/business_model.md#L1387); [data_model_spec.md:49](../04_data/data_model_spec.md#L49), [:51](../04_data/data_model_spec.md#L51), [:756](../04_data/data_model_spec.md#L756); [architecture.md:435](../02_architecture/architecture.md#L435); [04_architecture_review.md:147](../02_architecture/04_architecture_review.md#L147); [frontend/README.md:13](../../frontend/README.md#L13); [backend/README.md:13](../../backend/README.md#L13); [open_items.md:197](../00_setup/open_items.md#L197), [:208](../00_setup/open_items.md#L208), [:230](../00_setup/open_items.md#L230). A broad scan for "baseline missing", "`TBD-INFRA-004` Open", and "Stage 1/7" now returns only the append-only registry title at [open_items.md:224](../00_setup/open_items.md#L224) (a resolved entry whose original title is preserved); no current-state "missing"/"Open" claim remains. Residual citations are listed below.
- **P1-3 — CLOSED.** [CHG-022:13](../13_changes/CHG-022-stage-1-environment-baseline.md#L13) now declares all 14 modified paths, including `docs/03_design/highfi_page_map.md`, and [:36](../13_changes/CHG-022-stage-1-environment-baseline.md#L36) records the handoff for `docs/01_product`, `docs/02_architecture`, `docs/03_design`, `docs/04_data`, `docs/06_development`, `frontend`, and `backend`. The 14 + 3 count matches `git status`.
- **P2-1 — CLOSED.** [CHG-022:147](../13_changes/CHG-022-stage-1-environment-baseline.md#L147) records author verification `PASS` and links this record.
- **P2-2 — CLOSED.** [environment_baseline.md:24](../00_setup/environment_baseline.md#L24) and [:38](../00_setup/environment_baseline.md#L38) record `7.0.10-8-g15ab042`; [:20](../00_setup/environment_baseline.md#L20) now cites `uname -r` (25.1.0 confirmed).
- **Re-run:** registry 31 entries/31 unique, `TBD-BIZ` 8/7, `TBD-INFRA` 8/6, `CONFLICT` 1/1, with only `TBD-INFRA-004` status changed; 17 changed Markdown files, 0 missing links; `git diff --check` exit 0; root still 7 entries; no Frozen asset; no manifest, lockfile, SQL, `.venv`, or code; `TBD-INFRA-005/006/007/012/013/014` remain Open; no implementation authority.

**Residual P2 (non-blocking).** `TBD-INFRA-004` is still cited as an unmet gate in a few current docs: [open_items.md:197](../00_setup/open_items.md#L197)/[:208](../00_setup/open_items.md#L208) (`TBD-INFRA-004/007`), [:261](../00_setup/open_items.md#L261), [:264](../00_setup/open_items.md#L264); [architecture.md:409](../02_architecture/architecture.md#L409), [:433](../02_architecture/architecture.md#L433); [03_security_reliability_and_operations.md:251](../02_architecture/03_security_reliability_and_operations.md#L251) ("unavailable"); [business_model.md:134](../01_product/business_model.md#L134), [:1025](../01_product/business_model.md#L1025); [api_interface_spec.md:100](../05_api/api_interface_spec.md#L100), [:145](../05_api/api_interface_spec.md#L145); [data_model_spec.md:647](../04_data/data_model_spec.md#L647), [:905](../04_data/data_model_spec.md#L905); [01_domain_and_service_architecture.md:145](../02_architecture/01_domain_and_service_architecture.md#L145). Also, [CHG-022:19](../13_changes/CHG-022-stage-1-environment-baseline.md#L19) (risk 5) still lists only `docs/01_product` and `docs/06_development` as cross-owned, while `:36` records the full handoff. These are citation cleanups, not status errors.

**Accepted exception.** [04_architecture_review.md:147](../02_architecture/04_architecture_review.md#L147) is a review record dated 2026-10-18, but its §6 residual list already carried `CHG-021`; updating one residual line is consistent with that living list and does not rewrite a historical `CHG` or `docs/12_reviews` record.

**Verdict updated: PASS WITH MINOR ISSUES.** No open P1; the residual P2s are optional. Only this record was written.
