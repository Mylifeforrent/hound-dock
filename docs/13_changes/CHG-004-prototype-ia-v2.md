# CHG-004 — Prototype IA v2: Tasks shortcut, history actions, Manage expansion

Status: Reviewed
Complexity: Complex
Refs: TBD-BIZ-004, TBD-BIZ-005, TBD-BIZ-007; CONFLICT: none
Owner: Tech Lead (Docs Agent handoff)

## Plan

- **Feedback:** promote Tasks to a daily shortcut; keep chat + history + Manage as the home; move Manage to the topbar only; add search, pin, rename, delete, and grouping to chat history; add Settings, Usage, and Audit to the Manage drawer.
- **Approach:** add a sidebar Tasks shortcut, remove the sidebar Manage button, add a history search field and per-chat actions modal, add Usage and Audit views, rename the Admin surface to Settings, and group the Manage drawer into Registries / Operations / Configuration.
- **Affected paths:** `docs/03_design/prototype/**`, `docs/13_changes/**`, `docs/12_reviews/**`.
- **Risks:** history actions can desync the active chat; new views can bloat the prototype; the Manage drawer can become long. Mitigations: one active-chat state, shared render helpers, scrollable drawer, static mock data.
- **Verification plan:** static checks, headless interaction tests (tasks shortcut, history search/pin/rename/delete, Manage sections, Usage/Audit/Settings), mobile 390px, independent review.
- **No production code:** prototype remains a throwaway design artifact; PRD, `frontend/`, and `backend/` remain untouched.

## Task Brief

- **Scope:** prototype IA only. Chat, skills, MCP, tasks, runs, and settings behavior remain mock; no backend or real data.
- **Inputs:** user feedback of 2026-10-18; current prototype at `bc304e0`; PRD v0.1.
- **Outputs:** updated prototype files, refreshed previews, this record, independent review record.
- **Acceptance criteria:** Tasks is reachable from the home without Manage; Manage is topbar-only; history supports search, pin, rename, delete, and grouping; Manage contains Skills, MCP, Tasks, Runs, Usage, Audit, Settings; existing flows still work; mobile 390px has no horizontal overflow; no backend/dependency/production data.
- **Ownership:** Tech Lead authors the prototype while the Docs Agent is dormant (CHG-002 handoff pattern); Verifier owns `docs/12_reviews/**`.

## Verification

Executed 2026-10-18 (Asia/Shanghai) on branch `docs/prototype-daily-tasks`.

| # | Check | Command / method | Result |
|---|---|---|---|
| 1 | Daily Tasks shortcut | Click sidebar Tasks | Tasks view opens; crumb “Tasks”; shortcut active; published count 2 |
| 2 | History search | Type “token” | History filtered to 1 matching chat; clearing restores all groups |
| 3 | Pin | Pin “Onboarding checklist” via `⋯` | Pinned group grows to 3 chats; unpin is available |
| 4 | Rename | Rename the active chat | History and chat card title update to “Release notes — W42” |
| 5 | Delete | Delete the active onboarding chat | Confirmation appears; after delete 5 chats remain and the active view falls back to the first chat |
| 6 | Manage topbar-only | DOM check + click topbar grid | No sidebar Manage button; topbar opens a 7-row drawer grouped Registries / Operations / Configuration |
| 7 | Usage | Open Usage via Manage | View opens with 4 stat cards and the activity chart; crumb “Manage · Usage” |
| 8 | Audit | Open Audit via Manage, filter Tools | 8 rows total; Tools filter shows 2; All restores 8; append-only count label |
| 9 | Settings | Open Settings via Manage | View title “Settings.”; crumb “Manage · Settings” |
| 10 | Mobile layout | Emulated 390×844 | `scrollWidth = 390`; sidebar opens with Tasks + search; Manage drawer shows 7 rows; no overflow |
| 11 | Static checks | `node --check`, HTML parse, CSS braces | JS OK; 8 view sections; CSS braces balanced |
| 12 | Isolation | Scans + `git status` | No external resources, dependencies, secrets, or PII; PRD, `frontend/`, `backend/` untouched |
| 13 | Previews refreshed | Screenshot capture | `preview-chat.png`, `preview-manage.png`, `preview-usage.png`, `preview-skills.png` updated |
| 14 | Review nits closed | Re-test after fixes | History actions visible on touch; Usage stats derive from live state; New chat clears the search filter; history search matches message text |

Reviewer: Verifier — **PASS** with four P2 nits; all four were closed before merge. Independent review record at `docs/12_reviews/CHG-004-review.md`.

## Dependency audit

None — no dependency, manifest, lockfile, or CDN asset is introduced.

## Decision and conflict log

- 2026-10-18: User decisions: Tasks becomes a daily shortcut; chat + history + Manage is the home; Manage is topbar-only; chat history needs search, pin, rename, delete, and grouping; Manage needs Settings, Usage, and Audit.
- 2026-10-18: The Admin surface is renamed to Settings for the prototype; the internal view id remains `admin` until the PRD/architecture stage.
- 2026-10-18: PRD v0.1 remains Draft; PRD v0.2 will record this IA after the prototype is confirmed.
- No `CONFLICT-nnn` was found.
