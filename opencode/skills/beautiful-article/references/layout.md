# Layout: Width Mode and TOC

Layout is a decision **decoupled from theme** (theme governs aesthetic mood only; width /
table of contents govern reading layout), the same way information density is decoupled
from theme. It's confirmed with the user at the Plan Checkpoint (Phase 3) and persisted to
the Brief section of `plan/plan.md`.

## Width mode (`Article`'s `width`, requires reacticle ≥ 0.2.0)

Width is controlled by `<Article width="...">`, **no longer decided by the theme**. Four
common modes:

| Mode | Reading column width | Good fit |
|---|---|---|
| `narrow` | ~34rem | Focused short pieces, `essay`, `briefing`, articles with strong aphoristic rhythm |
| `regular` (default) | ~46rem | Standard long-form reading such as `longform` / `explainer` |
| `wide` | ~58rem | Table / code / data-dense content (`full-report`, `review`, `tutorial`) |
| `full` | ~78rem | Image-and-text-led, wide-format media (`visual-essay`) |

Any theme can pair with any width (decoupled). Example: `tufte + wide` suits heavy data
tables; `press + narrow` suits an unhurried essay.

## TOC (`Article`'s `toc`)

`<Article toc>` renders a left-hand table of contents (auto-derived from `Section` /
`Subsection`, up to three levels, with scroll-linked highlighting).

- **This Skill enables the TOC by default** (long-form pieces are easier to read with
  navigation), but **the user must confirm it at the Plan Checkpoint**.
- Very short articles (`briefing` / a short `visual-essay`) can turn it off, to avoid the
  TOC standing out more than the prose.
- With the TOC on, the layout becomes a two-column "TOC + prose" view; on narrow viewports
  (<1000px) it automatically collapses back to a single column.

## Usage

```tsx
// Default: regular width + TOC on
<Article toc width="regular"> ... </Article>

// Data-dense report: wider + TOC
<Article toc width="wide"> ... </Article>

// Short essay: narrow column, no TOC
<Article width="narrow"> ... </Article>
```

## Self-check

- Does the width match the content? (Lots of tables / code → at least `wide`; pure
  narrative → `regular` / `narrow`)
- Was the width chosen based on content, rather than dictated by the theme?
- Was the TOC on/off choice confirmed by the user? Did a short article accidentally get a
  TOC that upstages the prose?
- Does the two-column layout collapse properly to a single column on mobile?
