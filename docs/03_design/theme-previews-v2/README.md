# Colour theme studies II

Status: Draft
Purpose: a second, wider colour-direction study for the existing prototype, with more stylistic distance between options.
Scope: six token-only studies. Layout, typography, component shape, copy, states, and interactions are unchanged. No file under `docs/03_design/prototype/` has been modified for this study.

The previous, more conservative set remains in [`../theme-previews/`](../theme-previews/). This set deliberately moves further apart: high-contrast Swiss, dark terminal, academic navy/gold, acid brutalist, rose/teal editorial, and technical blueprint.

## Options

| # | Style | Character | Canvas / sidebar / accent |
|---|---|---|---|
| **01** | Swiss Signal | Minimal/Swiss: paper white, black sidebar, one signal orange. Highest clarity, least decoration. | `#fafafa` / `#0a0a0a` / `#c2410c` |
| **02** | Terminal Green | Dark developer console: near-black green surfaces, low-light reading, emerald action. The only dark option. | `#0b0f0d` / `#070b09` / `#34d399` |
| **03** | Academic Navy & Gold | Editorial/academic: warm paper, navy sidebar, antique gold. The existing serif headings do more work here. | `#f4f2ec` / `#14243a` / `#8a5206` |
| **04** | Acid Signal | Brutalist/high contrast: off-white, black outlines, acid lime with black text. The boldest option. | `#f4f4ef` / `#0a0a0a` / `#b8e600` |
| **05** | Rosewood & Teal | Soft editorial: blush paper, burgundy sidebar, teal action. Warm/cool tension without a red action colour. | `#f6efec` / `#2b1a1f` / `#0f766e` |
| **06** | Blueprint Cyan | Technical/blueprint: pale blue canvas, deep blue sidebar, cyan action. Precise and clinical. | `#eef4f8` / `#0c2233` / `#0e7490` |

Preview boards, each showing Chat and Run outcome at 1440px:

- [01 — Swiss Signal](01-swiss-signal.png)
- [02 — Terminal Green](02-terminal-green.png)
- [03 — Academic Navy & Gold](03-academic-navy-gold.png)
- [04 — Acid Signal](04-acid-signal.png)
- [05 — Rosewood & Teal](05-rosewood-teal.png)
- [06 — Blueprint Cyan](06-blueprint-cyan.png)

## What is held constant

- The same layout, type scale, spacing, 36px desktop controls, component shape, and all nine page states.
- Status colours remain semantic: green succeeded, red failed, amber attention, blue running, neutral pending/skipped. The neutral tint is theme-specific; the meaning is not.
- No dark-mode switch is added to the prototype. Option 02 is a dark palette preview only; selecting it would change the current light-only presentation boundary and needs a separate confirmation.
- Option 04 changes the border token to near-black. It does not change border width, radius, or layout; the existing shape is retained.

## Contrast

Measured against the same semantic roles used by the prototype:

- Normal text pairs: **4.52:1 minimum** (Academic muted on canvas), with most at 7–20:1.
- White or near-black text on the action colour: **5.18:1 minimum** (Swiss white on orange).
- Control boundaries: **3.40:1 minimum** (Blueprint control border on canvas).
- Status pairs: **6.27:1 minimum** for the five light options; **8.30:1 minimum** for Terminal Green.
- The acid lime uses near-black text, not white: **13.54:1**.

## Selection

Reply with **01–06** (a mix is possible, for example “05 canvas + 01 accent”). After confirmation I will update only the semantic colour tokens in `docs/03_design/prototype/styles.css` and refresh the prototype previews. If **02** is selected, confirm that the light-only boundary may be revised.

Full token definitions are in [`palettes.json`](palettes.json).
