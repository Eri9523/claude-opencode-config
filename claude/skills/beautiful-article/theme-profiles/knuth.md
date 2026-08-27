# Theme Profile · knuth (Academic Preprint)

> This is an authoring profile **for the AI to read while writing**, not CSS. CSS
> tokens live in the component library's runtime theme (`data-theme="knuth"`).
> This file explains "how to choose and use this theme." For the full version,
> see the component library's canonical md: `src/theme/themes/knuth/knuth.md`
> (read it before writing code / formulas / media / Raw).

- **runtime theme id**: `knuth` (`<ThemeProvider theme="knuth">`)
- **Mood**: academic / scientific typesetting. Dresses a report in the clothing
  of a journal / arXiv preprint: Computer Modern serif, numbered sections,
  numbered figures / tables / formulas, justified body text, dense citations,
  formulas first. Fully inherits the data-ink discipline. Distinct from
  `tufte`'s essayistic marginalia: `knuth` is meant to feel like "reading a
  formal paper."

## Article Types It Suits / Doesn't Suit

- **Suits**: `paper` / `preprint`, `research` / scholarly investigation,
  `literature-review`, technical white papers, formal analysis, an `explainer`
  / `full-report` dense with formulas, theorems, or citations.
- **Doesn't suit**: warm narrative content (`press`); neutral product
  documentation (`vignelli`); dark-mode engineering scenes (`shannon`); slide
  decks.

## Typographic Mood

- Body text and headings use Computer Modern / Latin Modern serif (→ falls
  back to Source Serif 4 / Georgia / a Chinese serif face).
- Labels / figure captions / table headers use a small CMU Sans size; math
  uses KaTeX (`Formula`).
- Body ~16.5px, line height 1.58; headings use bold serif (weight 700) to
  give the paper title its weight. Emphasis never uses italics (banned at the
  protocol level).
- **Leans toward justified text**, creating the tidy block texture of a
  printed paper.

## Raw Style

Like a Figure the author hand-set within the paper.

- What's constrained is the **mood** (formal, restrained, formulas /
  numbering first, verifiable), not the **medium**.
- Typical: inline SVG charts, axes / function curves / derivation diagrams,
  interactive parameter demos, theorem / proof structure diagrams, plates
  captioned "Figure N."
- Composition: restrained whitespace, clear axes and labels, academic blue as
  a structural cue; every line carries meaning. Colors only from `--ra-*`.
- Motion: none by default; any required interaction uses only instant
  response or light transitions, no looping decoration.

## Media (Image / Video / Audio) Style

- Suits: data / experimental-result charts, diagrams / flowcharts /
  architecture diagrams, paper screenshots, tables, low-saturation
  photography, manuscripts / derivations.
- Every figure carries a "Figure N."-style caption / source / alt;
  composition has ample whitespace, clear subjects.
- Color: low saturation, close to paper and ink; emphasis carried only by
  academic blue or warning red.

## Code / Formula Style

- `CodeBlock` reads like a code listing in a monograph: light paper surface +
  hairline rule, never a dark editor window. Line numbers recessed and
  unhurried.
- Prism tokens derive from the theme: tags / functions use academic blue
  accent, keywords / risk use risk red, strings use green, comments use
  muted.
- `Formula` is this theme's centerpiece: block formulas have unhurried
  vertical whitespace, numbered flush right ((1)(2)(3)), inline formulas sit
  seamlessly in the body text.

## Prohibited

- Cards, panels, filled color blocks, shadows, rounded corners; grid lines
  darker than `#C7C6BB`.
- Using academic blue as decoration; a second red used for anything other
  than "warning"; emoji / icons as decoration.
- Stock hero images, 3D illustration, gradient backgrounds, decorative light
  flares, neon, high-contrast dark-terminal code.
- Raw / media turning into marketing material or a SaaS landing page instead
  of a paper's figure plates.

## Suggested Behavior at Different Information Densities (guidance, not a limit)

- `100% paper / full-report`: formal longform + numbered sections + numbered
  formulas / figures, dense citations.
- `60-80% research / review`: keep the core derivations + key figures, body
  text as the main body.
- `40% explainer`: Raw leans toward formula / function diagrams, text
  shorter, still keeping the paper's mood.
