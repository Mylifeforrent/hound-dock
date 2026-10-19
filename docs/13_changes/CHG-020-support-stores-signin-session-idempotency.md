# CHG-020 — Support stores for sign-in, session, and idempotency

Status: Draft
Complexity: Complex
Refs: TBD-INFRA-012, TBD-INFRA-013, TBD-INFRA-014 (registered by this change, Open); TBD-BIZ-008 (window), TBD-BIZ-012 (Gate 1), TBD-INFRA-004, TBD-INFRA-005, TBD-INFRA-007 (Open, gates); CONFLICT-002 (Open, no effect)
Owner: Tech Lead

## Plan

- **Why this change:** `CHG-019` recorded three gaps that block `API-001` and the four idempotent commands: no credential-verifier store, no session store, and no idempotency-key store. The logical model had no representation for any of them, so a backend implementer would have had to invent a table, a field, or a process-local store without a record. This change models them, registers the remaining decisions, and leaves physical design closed.
- **Approach:** add three `TBD-INFRA` entries with options and a recommendation; model two **support stores** (`account_credential`, `idempotency_key`) outside the 13-table business inventory and the 18-entity map; model the session as runtime state with a store port and no table; add classification, keys, constraints, retention, and validation. Do not resolve a `TBD`, write DDL or a migration, add an endpoint or field to the contract, or add code.
- **Affected paths:**
  - `docs/00_setup/open_items.md` (modified): `TBD-INFRA-012`, `-013`, and `-014` appended; summary counts corrected to `TBD-INFRA` 9 Open / 5 Resolved.
  - `docs/04_data/data_model_spec.md` (modified): version 0.2 → 0.3; persistence class `S`; §2.2 renamed to 13 business tables; §2.4 rows updated; new §2.5 support stores; ER note 6; §4.15 and §4.16; §5.6; §6.1/§6.2/§6.4/§6.5; §7.2/§7.3; §8.3; §10.2/§10.3/§10.5; §12.2/§12.3/§12.4; §13 self-check and residual limits.
  - `docs/04_data/README.md` (modified): version and document-map line.
  - `AGENTS.md` (modified): §6 store count and the verifier location rule.
  - `docs/05_api/api_interface_spec.md` (modified): input table version/sections, a §4.1 session note, and a §9.1 key-store note. No endpoint, schema, status code, or error code changes.
  - `docs/13_changes/CHG-020-support-stores-signin-session-idempotency.md` (new).
- **The three gaps and the proposed answer:**

| Gap | Why it blocks | Proposed answer | Registered | Resolved? |
|---|---|---|---|---|
| Credential verifier | `account` has no verifier field; AGENTS §6 forbids a verifier in a business table; SSO is excluded; no hidden seed is allowed | Security-owned support store `account_credential`, one row per account, opaque verifier plus algorithm and parameters; Argon2id recommended | `TBD-INFRA-012` | No — algorithm and parameters open |
| Session | `API-001` sets an opaque `HttpOnly` cookie; the data model records session as runtime state with no table; restart and multi-worker behavior are undefined | Runtime `SessionStore` port; in-memory adapter recommended for the single-process MVP; restart ends sessions (`40102`); no table | `TBD-INFRA-013` | No — durability, lifetime, and cookie flags open |
| Idempotency key | `api_interface_spec.md` §9 requires stored `(actor, key)` and a fingerprint; the data model records "no idempotency key" | Support store `idempotency_key` with a hash fingerprint and a minimal replay payload (status plus reference/position); 24-hour window proposed | `TBD-INFRA-014` | No — persistence choice and window open (`TBD-BIZ-008`) |

- **Why support stores rather than business tables:** each is required by a contract but is not a business entity. `account_credential` is security-owned and must not sit in `account`; `idempotency_key` is transport support with no `ENT`. Treating them as support stores keeps the 18-entity map, the 13 business tables, and every page, endpoint, permission, and error code unchanged. The data model's self-check records this explicitly.
- **Risks:**
  1. A reader could treat the support stores as new business entities. Mitigation: §2.5 and self-check row 3 state that the 18 entities are unchanged; the ER diagram and the entity map do not include them.
  2. The credential design could be read as a settled algorithm. Mitigation: `TBD-INFRA-012` stays Open; the `algorithm` domain is explicitly the security decision, and no value is selected.
  3. The in-memory session could be read as a decision. Mitigation: it is labelled a recommendation under `TBD-INFRA-013`; the durable/external alternatives are recorded.
  4. Storing a replay response could duplicate `Sensitive` content. Mitigation: the design stores only status plus reference/position, never a body or message text.
  5. The data model version bump could be read as a physical-design authorization. Mitigation: §10.1, §2.5, and this record all state that DDL, indexes, and migrations remain a separate change.
  6. Cross-ownership writes. Mitigation: the handoff is recorded in the Task Brief; Docs Agent acceptance is pending.
- **Verification plan:** registry parse and counts, new-ID presence, data-model section and field checks, link walk, TBD/CONFLICT reference lookup, API-ID and API-surface checks, command scan, manifest/lockfile scan, frozen scan, root layout, `git diff --check`, and write-set inspection. Documentation-only: no install, build, server, browser, database, or migration is run.

## Task Brief

- **Scope:** register and model the three missing server-side stores. Do not resolve the new `TBD`s, choose a credential algorithm, choose a session durability model, write DDL or a migration, or add an endpoint/field/permission/error code.
- **Inputs:** `CHG-019` (the carried gaps); `docs/04_data/data_model_spec.md`; `docs/05_api/api_interface_spec.md` §4.1/§9; `AGENTS.md` §6; `docs/00_setup/open_items.md`; `docs/01_product/business_model.md` Appendix B; `docs/08_security/README.md` (boundary only).
- **Outputs:** the six paths listed under Affected paths.
- **Acceptance criteria:**
  1. `TBD-INFRA-012/013/014` exist in the registry with `Status: Open`, options, criteria, and a recommendation; the summary reports `TBD-INFRA` 9 Open / 5 Resolved.
  2. The data model has exactly two proposed support stores outside the 13 business tables and the 18-entity map; no new `ENT` is created.
  3. Every support-store field is typed with the existing logical types, classified `Internal`/`Sensitive`, and marked `[P]`.
  4. No credential value, request body, or response body is stored; the replay payload is status plus reference/position only.
  5. Session remains runtime state with no table; the in-memory adapter is a recommendation, not a decision.
  6. No DDL, SQL, migration, schema, code, manifest, lockfile, or command is added.
  7. The API contract keeps 15 operations, the same error model, and the same request/response schemas; only status notes change.
  8. Links resolve; every `TBD`/`CONFLICT` reference exists in the registry; no Frozen asset is touched; root layout unchanged.
- **Ownership and handoff:** `docs/00_setup/**`, `AGENTS.md`, and `docs/13_changes/**` are Tech Lead-owned. `docs/04_data/**` and `docs/05_api/**` are Docs Agent-owned and dormant; the Tech Lead authors the design and status edits under this record, following the CHG-015/016/018/019 handoff pattern. Acceptance is pending, not granted. `docs/12_reviews/**` is untouched; no Verifier review exists.

## Verification

Executed on 2026-10-19 (Asia/Shanghai) in the repository root. Documentation-only: no install, build, server, browser, database, migration, or deployment was run.

| # | Check | Method | Result |
|---|---|---|---|
| 1 | Registry parse | Inline Python entry/status walk | 31 entries, 31 unique; `TBD-INFRA` 9 Open / 5 Resolved; `TBD-INFRA-012/013/014` are `Open` |
| 2 | New IDs present | Inline lookup of each new ID and its `Resolution source` | All three present; each source is `—` (not resolved) |
| 3 | Support-store inventory | Inline check of §2.5 and §2.2 | Exactly 2 support stores; the 13-row business inventory is unchanged; no `ENT` references the support stores |
| 4 | Field typing | Inline check that every §4.15/§4.16 field uses `identifier`, `text`, `integer`, `timestamp`, or `document` | 7 + 9 fields; all within the declared type set; all `[P]` |
| 5 | Entity count | Inline count of `ENT-` rows in §2.3 | 18 rows; no support store appears |
| 6 | Sensitive content | Inline scan for `request body`, `response body`, `content_text` in the support-store sections | No body or message text is stored; the replay payload is `response_status` plus `response_reference`/`response_position` |
| 7 | Session table | Inline scan for a `session` table definition | None; §2.4/§6.5 keep session as runtime state and cite `TBD-INFRA-013` |
| 8 | Relative links | Python link walk over the changed files | 0 missing after this record is created |
| 9 | TBD/CONFLICT references | Lookup of every ID against the registry | 0 unknown references |
| 10 | API surface | Extract `API-\d{3}` and the endpoint paths | `API-001`–`API-015`, 15 IDs; no path added or removed |
| 11 | Command scan | Regex for install/run/build/test/migrate strings | 0 matches; no install, run, build, test, or migration command appears |
| 12 | Manifests and code | `git ls-files` and `find frontend backend` | No manifest, lockfile, code, or non-README file |
| 13 | Frozen assets | `grep -rl '^Status: Frozen' docs` | No Frozen asset exists or was touched |
| 14 | Root layout | `ls -A` against the RULE-002 allowlist | Unchanged |
| 15 | Whitespace | `git diff --check` | Exit 0 |
| 16 | Write set | `git status --short` | Five modified files for this change plus this new record; the working tree also contains the earlier uncommitted CHG-019 change set, so `git status` shows nine modified files and two new records |

Author verification: **PASS**. No independent Verifier review exists; the Verifier role is dormant. The record remains `Draft`.

## Dependency audit

None. No dependency is added, upgraded, imported, installed, or locked. The credential recommendation names Argon2id as an algorithm, not a library; any future implementation must add and audit a library in its own change.

## Decision and conflict log

- 2026-10-19: Three gaps carried by `CHG-019` are now registered as `TBD-INFRA-012` (credential verifier), `TBD-INFRA-013` (session), and `TBD-INFRA-014` (idempotency key). None is resolved; each carries a recommendation and open options.
- 2026-10-19: Two support stores are modeled: `account_credential` (security-owned) and `idempotency_key` (transport support). They are outside the 13 business tables and the 18-entity map. The data model moves to v0.3; the 18-entity map, the business tables, and the page/endpoint surface are unchanged.
- 2026-10-19: Session stays runtime state with no table. The in-memory adapter is a **recommendation** that ends sessions on restart (`40102`) and requires a single worker; a durable or external store is the alternative under `TBD-INFRA-013`.
- 2026-10-19: The credential verifier is opaque and never leaves the support store; no plaintext, sign-in name, or verifier is added to `account`. Argon2id is recommended, not selected. `TBD-INFRA-012` owns the algorithm, parameters, and rotation.
- 2026-10-19: Idempotency replay stores status plus reference/position only. No request body, response body, message text, task name, or error text is stored; the fingerprint is a hash. The 24-hour window remains proposed under `TBD-BIZ-008`; `TBD-INFRA-014` owns persistence and payload.
- 2026-10-19: No API change. The 15 operations, methods, paths, request/response schemas, error codes, and matrix cells are unchanged; only §4.1 and §9.1 gain status notes pointing at the data model and the new `TBD`s.
- 2026-10-19: No physical design. DDL, indexes, constraints, migration files, and the purge job remain a separate authorized change (`data_model_spec.md` §10.1; AGENTS.md §6). The support stores are `[P]`.
- 2026-10-19: `CONFLICT-002` is untouched and has no effect. `docs/13_changes/README.md` is not refreshed, following the CHG-018/019 precedent.
- 2026-10-19: `docs/06_development/` and `docs/08_security/` are not modified. The security folder remains a boundary only; the credential and session decisions belong to its later change.
