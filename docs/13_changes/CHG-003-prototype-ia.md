# CHG-003 — Prototype IA revision: chat-first home, Manage entry

Status: Reviewed
Complexity: Complex
Refs: TBD-BIZ-004, TBD-BIZ-005, TBD-BIZ-007; CONFLICT: none
Owner: Tech Lead (Docs Agent handoff)

## Plan

- **Feedback:** the prototype should make chat + chat history the daily home, and hide Skills, MCP, Tasks, Runs, and Admin behind one Manage button because they are occasional configuration surfaces.
- **Approach:** remove the six-item primary nav; add a grouped chat history list, a New chat action, and a single “Manage workspace” button that opens a drawer linking to the five registry/admin views. Keep every existing view and interaction intact.
- **Affected paths:** `docs/03_design/prototype/**`, `docs/13_changes/**`, `docs/12_reviews/**`, `docs/03_design/README.md` only if needed.
- **Risks:** history state and the active conversation can drift from the chat composer; the Manage drawer can duplicate navigation; mobile history can consume the viewport. Mitigations: one active-chat state, one navigation function, scrollable history, responsive drawer.
- **Verification plan:** static checks, headless interaction test (history switch, new chat, Manage rows, registry navigation), 390px emulation, independent review.
- **No production code:** still a throwaway design artifact; `frontend/` and `backend/` remain untouched.

## Task Brief

- **Scope:** prototype information architecture only — chat history, simplified sidebar, Manage drawer. No change to the PRD or to the registry form contents.
- **Inputs:** user feedback of 2026-10-18; existing prototype; PRD v0.1.
- **Outputs:** updated prototype files; refreshed preview screenshots; this record; independent review record.
- **Acceptance criteria:** chat history is visible and selectable; New chat starts an empty conversation; the five management surfaces are reachable only through Manage (plus deep links); the home view has no registry nav; all prior interactions still work; mobile 390px has no horizontal overflow; no backend/dependencies/production data.
- **Ownership:** Tech Lead authors the prototype while the Docs Agent is dormant (CHG-002 handoff pattern); Verifier owns `docs/12_reviews/**`.

## Verification

Executed 2026-10-18 (Asia/Shanghai) on branch `docs/prototype-ia`.

| # | Check | Command / method | Result |
|---|---|---|---|
| 1 | Chat history | Headless Chrome DOM check | 6 history items in Today / Yesterday / Previous 7 days groups |
| 2 | History selection | Click “Onboarding checklist” | Chat title and thread switch to the onboarding conversation; 2 messages; active history item updates |
| 3 | New chat | Click New chat, then send a message | Empty conversation with suggestions; first message retitles the chat and updates the history item |
| 4 | Simplified home | DOM check | 0 primary nav items; the only sidebar `data-view` link is Chat; Manage is a single button |
| 5 | Manage drawer | Click Manage | 5 rows: Skills, MCP servers, Tasks, Runs, Admin, each with live counts |
| 6 | Manage navigation | Open Skills via Manage | Drawer closes, Skills view opens, back button appears, crumb reads “Manage · Skills”, back returns to chat |
| 7 | Registry regression | Open a skill, MCP server, task, run, and admin via Manage | All open; task test run reaches `Succeeded`; 0 runtime exceptions |
| 8 | Mobile layout | Emulated 390×844 | `scrollWidth = 390`; off-canvas sidebar opens with 6 history items; crumb hidden on manage views; topbar Manage shortcut available |
| 9 | Static checks | `node --check`, HTML parse, CSS braces | JS OK; 6 view sections; CSS braces balanced |
| 10 | No external resources | Scan for script/link/img HTTP sources, manifests, lockfiles | None; mock endpoint strings only |
| 11 | Scope isolation | `git status` / PRD diff | PRD, `frontend/`, and `backend/` untouched; prototype only under `docs/03_design/prototype/` |
| 12 | Previews refreshed | Screenshot capture | `preview-chat.png`, `preview-manage.png`, `preview-skills.png` regenerated for the new IA |
| 13 | Review nits closed | Re-test after fixes | Cross-chat reply race fixed (onboarding stays at 2 messages; release reaches 4); dead nav/pinned CSS removed (394 → 382 braces); history is a `<nav>` landmark; topbar Manage shortcut added; off-canvas selector fixed |

Reviewer: Verifier — **PASS** with four P2 nits; all four were closed before merge. Independent review record at `docs/12_reviews/CHG-003-review.md`.

## Dependency audit

None — no dependency, manifest, lockfile, or CDN asset is introduced.

## Decision and conflict log

- 2026-10-18: User feedback: keep the home page simple; chat history is missing; hide MCP, Skills, Tasks, Runs, and Admin behind a button because they are used occasionally.
- 2026-10-18: The five registry/admin views remain unchanged; only their entry point changes.
- 2026-10-18: This prototype intentionally diverges from PRD §11's old “left rail: Chats, Tasks, Skills, MCP, Runs, Admin” description. PRD v0.2 will reflect the chat-first IA after the user confirms this prototype.
- 2026-10-18: PRD v0.1 remains Draft; it will become v0.2 after this IA is reviewed.
- No `CONFLICT-nnn` was found.
