# Theme Profile · shannon (Dark-Mode Engineering Evidence)

> This is an authoring profile **for the AI to read while writing**, not CSS. CSS
> tokens live in the component library's runtime theme (`data-theme="shannon"`).
> This file explains "how to choose and use this theme." For the full version,
> see the component library's canonical md:
> `src/theme/themes/shannon/shannon.md` (read it before writing code / formulas
> / media / Raw).

- **runtime theme id**: `shannon` (`<ThemeProvider theme="shannon">`)
- **Mood**: `tufte`'s "night-shift engineering edition." Warm graphite dark
  background, warm white ink, a single amber signal color. Fully inherits the
  data-ink discipline (lines instead of boxes, inline annotation, no junk
  tables, color carries meaning), just moved to a dark-mode engineering scene.
  **Never pure black, never #0D1117 cyber-dark, no neon, no glow.**

## Article Types It Suits / Doesn't Suit

- **Suits**: `postmortem` / incident review, `system-design` / architecture
  decisions, `benchmark` / performance analysis, technical / AI / algorithm
  `explainer`, `review`, `tutorial`. Especially well suited to content dense
  with `CodeBlock`, `DiffReview`, `Incident`, `RiskList`, `Decision`.
- **Doesn't suit**: formal documents meant for printing (dark backgrounds
  waste ink, and print will force a white background); warm narrative /
  publication essays (`press` / `knuth`); slide decks meant to be viewed from
  ten meters away.

## Typographic Mood

- Body text and headings use a technical humanist sans (IBM Plex Sans →
  Söhne → system-ui), weight 400, gaining weight through size.
- **Monospace is deliberately elevated**: section numbers, timestamps,
  metrics, key-value pairs all use mono (IBM Plex Mono / Berkeley Mono),
  creating an engineering-log feel.
- Body ~16px, line height 1.6; emphasis relies on weight / color / spacing,
  never italics (banned at the protocol level), never heavy bold.

## Raw Style

Like a small dashboard the author hand-drew on a dark background for the
current paragraph.

- What's constrained is the **mood** (dark background, linear, restrained
  signal, engineering evidence), not the **medium**.
- Typical: dark-background inline SVG, thin-line charts / scatter plots /
  flame graphs / sequence diagrams, draggable threshold lines, mono
  annotations, miniature sparklines, terminal-style status bars.
- Composition: little fill, mostly lines; every line carries meaning. Colors
  only from `--ra-*`, emphasis uses the amber accent or warning red.
- Motion: none by default; any required interaction uses only instant
  response or very light transitions (≤120ms), no looping decoration.

## Media (Image / Video / Audio) Style

- Suits: real monitoring charts / flame graphs / traces, terminal
  screenshots, architecture / sequence / topology thin-line diagrams,
  dark-mode data visualization, low-saturation product UI details.
- Composition: ample whitespace on a dark background, clear subjects; must
  include a clear caption / source / alt; screenshots should crop out
  irrelevant chrome.
- Color: close to the dark paper tone, emphasis carried only by amber or
  warning red.

## Code / Formula Style

- `CodeBlock` is a first-class dark-mode citizen but still engineering
  evidence: a light dark-paper surface + dark hairline rule, no glowing
  borders / colored title bars / glassmorphism. Line numbers visible but
  recessed.
- Prism tokens derive from the theme: structure / tags / functions use amber
  accent, keywords / risk use risk red-orange, strings / success paths use
  low-saturation green.
- `Formula` reads like a dashboard annotation; block formulas carried only by
  hairline rules and whitespace.

## Prohibited

- Cards, panels, filled color blocks, shadows, rounded corners, glowing
  borders; grid lines brighter than `#45423A`.
- Pure black / `#0D1117` cyber-dark, neon highlights, rainbow syntax,
  oversaturated tech blue/purple.
- Using the amber signal color as decoration; a second red used for anything
  other than "warning"; emoji / icons as decoration.
- Media / Raw turning into a cyberpunk mood-visual rather than engineering
  evidence (skeuomorphic dashboard screens, particle backgrounds,
  glassmorphism).

## Suggested Behavior at Different Information Densities (guidance, not a limit)

- `100% longform / postmortem`: restrained longform + engineering evidence,
  Raw lights up key signals / sequences.
- `60-80% system-design / explainer`: keep the core architecture diagrams +
  code evidence, body text still the main body.
- `40% briefing`: Raw leans toward dark-background diagrams / metrics, text
  shorter, still in an article form.
