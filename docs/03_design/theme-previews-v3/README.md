# Light-rail colour studies

Status: Draft
Purpose: response to the feedback that the left rail reads too dark and should stay closer to the global surface.
Scope: four token-only studies. The rail now uses the same light family as the canvas, separated by a hairline; the selected navigation and conversation use a soft tint with ink text. Layout, typography, component shape, copy, states, and interactions are unchanged. These previews were generated without modifying the prototype; the selected option was applied later under CHG-009.

**Selected: 01 Porcelain Blue** (2026-10-18, CHG-009). The remaining options are retained as reference.

Reference: the attached Doubao and DeepSeek captures — near-white rail, low-contrast surfaces, light selected row, a single blue action accent, hairline separation rather than a dark block.

## Options

| # | Style | Character | Canvas / rail / accent |
|---|---|---|---|
| **01** | Porcelain Blue | Closest to the references: near-white rail, light blue selection, blue action. | `#f8f9fb` / `#f7f8fa` / `#2563eb` |
| **02** | Paper Blue | Keeps the current warm paper family but drops the dark rail; blue action for a clear selected state. | `#f6f4ee` / `#f7f5ef` / `#1d4ed8` |
| **03** | Mist Teal | Cool gray-green rail and canvas; keeps a green-teal action without the dark rail. | `#f2f6f4` / `#f3f7f5` / `#0f766e` |
| **04** | Lilac Gray | Soft lavender-gray rail and canvas; indigo action for a calmer, cooler variant. | `#f5f4f9` / `#f6f5fa` / `#5b5bd6` |

Preview boards, each showing Chat and Run outcome at 1440px:

- [01 — Porcelain Blue](01-porcelain-blue.png)
- [02 — Paper Blue](02-paper-blue.png)
- [03 — Mist Teal](03-mist-teal.png)
- [04 — Lilac Gray](04-lilac-gray.png)

## What changes for a light rail

1. The sidebar background, text, muted text, hover, selected tint, line, and accent become light-surface tokens. The rail is nearly the same value as the canvas and is separated by a hairline.
2. The active navigation and active conversation text changes from white to ink. The existing CSS uses `var(--white)` for the active nav label; a light selected tint needs the ink colour instead. This is two small rules, not a layout change:
   ```css
   .nav-link[aria-current="page"],
   .conv-link[aria-current="page"] { color: var(--text-primary); }
   ```
3. The radial sidebar glow is reduced to a barely visible tint, and the control border is darkened where needed to keep a 3:1 boundary against the light surfaces.
4. The `New chat` control becomes a white outlined button; the selected row is a soft accent tint with a 2px accent left rule.

## Contrast

Measured against the same semantic roles used by the prototype:

- Normal text pairs: **4.72:1 minimum** (Porcelain muted text on canvas), with most at 5–17:1.
- Active text on the selected tint: **14.5:1 or better**.
- White on the action colour: **5.17:1 minimum** (Porcelain blue).
- Control boundaries: **3.28:1 minimum** on the Porcelain rail, 3.31–3.49 across the canvas/surface/raised surfaces.
- Status pairs remain unchanged from the light prototype: **6.27:1 minimum**.

## Selection

**01 Porcelain Blue was selected and applied under CHG-009.** The semantic tokens, the two light-rail active-state rules, and the prototype previews were updated; no layout, type, state, or interaction change was involved.

The remaining options are retained as reference. 02 keeps the paper warmth; 03 keeps the green accent; 04 is the cooler lavender variant.

Full token definitions are in [`palettes.json`](palettes.json).
