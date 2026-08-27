# Theme Profile · fuller (Blueprint / Engineering Drafting)

> This is an authoring profile **for the AI to read while writing**, not CSS. CSS
> tokens live in the component library's runtime theme (`data-theme="fuller"`).
> This file explains "how to choose and use this theme." For the full version,
> see the component library's canonical md: `src/theme/themes/fuller/fuller.md`
> (read it before writing code / formulas / media / Raw).

- **runtime theme id**: `fuller` (`<ThemeProvider theme="fuller">`)
- **Mood**: engineering drafting / blueprint. Deep blueprint-blue ground +
  cyan-white ink + a single drafting cyan, plus a faint grid. Its identity comes
  from the drafting board: a title-block hero set on graph paper, monospace
  dimension callouts, dashed-line annotation dividers, cyan hairline rules. The
  cool counterpart to `shannon` (warm amber terminal) — both are dark-mode, but
  this one's mood is the drafting table, not the command line.

## Article Types It Suits / Doesn't Suit

- **Suits**: technical specifications, system / architecture design, protocol /
  interface documentation, RFCs, hardware / mechanical documentation; dark-mode
  longform that needs precision, coolness, and an engineering feel, paired with
  diagrams / annotations / topology charts.
- **Doesn't suit**: documents meant for printing (dark backgrounds waste ink),
  warm narrative content (`press` / `freddie`), soft and healing (`andy`),
  lively color (`bayer` / `sottsass`), academic papers (`knuth`),
  black-and-white broadsheets (`bodoni`), slide decks.

## Typographic Mood

- Body text / headings use IBM Plex Sans, labels / dimensions / section
  numbers / metadata use IBM Plex Mono (monospace carries annotation).
- Body ~17px, line height 1.62; display weight 600 (engineering restraint);
  emphasis never uses italics (banned at the protocol level).
- **Cyan is the sole structural color, risk uses warm orange** so it stays
  distinguishable against a screen full of cyan; dark background, all "soft"
  surfaces are dark panels.

## Raw Style

Like a hand-drawn annotated diagram on a drafting sheet.

- What's constrained is the **mood** (cyan hairlines, monospace annotation,
  graph grid, dark panels, no glow), not the **medium**.
- Typical: wireframe / topology / sequence diagrams, dimension-lined
  annotations, graph-paper coordinates, monospace data tables, structural
  cross-sections.
- Composition: cyan hairlines + monospace annotation + optional overlaid grid;
  no rounded corners, no glow.
- Motion: restrained position changes / stroke-draw animation; no neon
  looping.

## Media (Image / Video / Audio) Style

- Suits: wireframe / structural / topology diagrams, dimensioned drawings,
  blueprint-style renders, CAD / schematic screenshots, dark-mode data
  visualization.
- Composition: line-driven, cyan strokes, may overlay a grid; captions in
  monospace, calm; alt text required.
- Color: predominantly blue-cyan, risk accented in warm orange; low
  saturation.

## Code / Formula Style

- `CodeBlock` is a first-class dark-mode citizen but still an engineering
  document: dark panel + dark cyan hairline + recessed monospace line numbers,
  no rounded corners, no glow.
- Prism tokens derive from cyan accent / risk orange / mint green; restrained,
  never a rainbow.
- `Formula` reads like a formula in a spec: monospace annotation, aligned,
  restrained.

## Prohibited

- Treating the dark background as "cyberpunk neon" — this theme is a calm
  blueprint, no glow, no glitch aesthetic.
- Rounded corners / shadows / light-background cards / warm lifestyle
  illustration; using cyan for risk (risk is fixed to warm orange). Italics
  for emphasis (banned at the protocol level).

## Suggested Behavior at Different Information Densities (guidance, not a limit)

- `100% spec / system design`: title-block hero + dashed-line sections + spec
  tables + topology diagrams, text and diagrams given equal weight.
- `60-80% documentation`: keep the key annotated diagrams, monospace metadata
  as accents.
- `40% briefing`: Raw leans toward wireframe / sequence diagrams, text
  shorter, still in a blueprint form.
