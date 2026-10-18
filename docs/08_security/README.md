# docs/08_security

Status: Draft
Originating stage: Stage 9 — Security
Authoritative assets: None yet. This folder will own the threat model, secrets handling, access control, privacy/PII rules, and dependency security policy.
Allowed status: Draft / Reviewed / Frozen. `Frozen` requires explicit user approval recorded in the Frozen assets section below.
Update entry point: Docs Agent through a change record in `docs/13_changes/`; open decisions only via `docs/00_setup/open_items.md`.

## Purpose

Owns security and privacy: threat model, secrets handling, access control, data classification controls, and dependency security policy.

## Boundaries

- MUST NOT contain real secrets, credentials, production data, or user PII.
- MUST NOT begin PII-related controls until TBD-BIZ-003 is resolved.
- MUST NOT relax any AI red line in RULE-009 through RULE-012.

## Frozen assets

None.
