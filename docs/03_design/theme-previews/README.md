# Colour theme studies

Status: Draft
Purpose: review colour-direction options before any prototype change.
Scope: five token-only colour studies of the existing prototype. Layout, typography, component structure, copy, states, and interactions are unchanged. No file under `docs/03_design/prototype/` has been modified for this study.

## Options

| Option | Direction | Canvas | Sidebar | Accent | Choose it if you want |
|---|---|---|---|---|---|
| **A** | Slate & Sage | `#eef1ee` | `#17231d` | `#3f6f5a` | The current calm-console feel, but cooler and more restrained |
| **B** | Porcelain & Cobalt | `#f2f5f8` | `#101a2a` | `#2456a6` | The crispest, most formal enterprise feel with the strongest action contrast |
| **C** | Sand & Terracotta | `#f2ece1` | `#241a15` | `#a14a2e` | A warmer, paper-like, editorial feel without a brand colour |
| **D** | Graphite & Amber | `#f0f1f2` | `#1c1f22` | `#8a4f0d` | A neutral operations console where actions and statuses stand out |
| **E** | Mist & Plum | `#f1f0f5` | `#211a28` | `#6b3f7d` | A calm but less conventional direction with more character |

Preview boards (each shows Chat and Run outcome at 1440px):

- [A — Slate & Sage](A-slate-sage.png)
- [B — Porcelain & Cobalt](B-porcelain-cobalt.png)
- [C — Sand & Terracotta](C-sand-terracotta.png)
- [D — Graphite & Amber](D-graphite-amber.png)
- [E — Mist & Plum](E-mist-plum.png)

## Held constant

- Every option uses the same layout, type scale, 36px desktop controls, spacing, and component structure.
- Status colours remain semantic across all options: green for succeeded, red for failed, amber for attention, blue for running, neutral for pending/skipped. The theme changes the neutral tint and the surrounding surfaces, not the meaning of a status.
- All text pairs meet 4.5:1; white-on-accent measures at least 5.7:1; control boundaries meet 3:1. The muted text was darkened where needed so it remains readable on the canvas, not only on the surface.
- No dark theme is proposed here. All five remain light themes.

## Selection

Reply with **A**, **B**, **C**, **D**, or **E** (a mix is also possible). After confirmation I will update the semantic colour tokens in `docs/03_design/prototype/styles.css`, keep the layout and interaction untouched, and refresh the prototype previews.

Full token definitions, including sidebar translucency and status pairs, are in [`palettes.json`](palettes.json).
