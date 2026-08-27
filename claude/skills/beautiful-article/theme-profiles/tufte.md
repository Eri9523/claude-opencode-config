# Theme Profile · tufte (Data-Ink)

> This is an authoring profile **for the AI to read while writing**, not CSS. CSS
> tokens live in the component library's runtime theme (`data-theme="tufte"`).
> This file explains "how to choose and use this theme." For the full version,
> see the component library's canonical md: `src/theme/themes/tufte/tufte.md`
> (read it before writing code / formulas / media / Raw).

- **runtime theme id**: `tufte` (`<ThemeProvider theme="tufte">`)
- **Mood**: Edward Tufte's data-ink ratio. Every drop of ink on the page
  carries information. Strips away cards, color fills, shadows, rounded
  corners, decorative color. What remains: text, hairline reference rules,
  generous margins, meaning carried by typography.

## Article Types It Suits / Doesn't Suit

- **Suits**: `longform`, `full-report`, `explainer`, `review` (technical /
  data oriented), `tutorial`. Longform reading where argument and evidence
  are the protagonists.
- **Doesn't suit**: slide decks meant to be viewed from ten meters away
  (body text is deliberately small); mobile-first scenarios that need heavy
  marginalia.

## Typographic Mood

- Body text and headings use old-style serif (et-book → Palatino / Georgia /
  a Chinese serif face), weight 400.
- Labels / annotations / table headers use a humanist sans at a small size.
- Body text is deliberately small (~16px), line height 1.6; heading hierarchy
  is restrained (h1 ≈ 2.5rem, h2 ≈ 1.7rem).
- Emphasis relies on weight / color / spacing, not italics (banned at the
  protocol level), not heavy bold.

## Raw Style

Like a small figure the author hand-drew for the current paragraph, not a
marketing component.

- What's constrained is the **mood** (restrained, linear, data-dense, low
  decoration), not the **medium** — any HTML / CSS / React is fine, use SVG /
  canvas only when needed.
- Typical: thin-line charts / scatter plots / slopegraphs, small axes,
  draggable threshold lines, partial highlights, text-side annotations,
  miniature sparklines, lightweight adjustable parameter controls, compact
  comparative typesetting.
- Composition: little fill, mostly lines; information density can be high,
  but every line / every element must carry meaning.
- Motion: none by default; any required interaction uses only instant
  response or very light transitions, no bounce / float / looping
  decoration.
- Color / typeface / spacing must come from `--ra-*`, never a custom
  palette.

## Media (Image / Video / Audio) Style

- Suits: real data charts, paper / report screenshots, table screen
  captures, product UI details, low-saturation photography, black-and-white
  or warm-paper line art, maps / timelines / thin-line diagrams.
- Composition: ample whitespace, clear subjects, clean edges; must include a
  clear caption / source / alt.
- Screenshots should crop out browser chrome first.

## Code / Formula Style

- `CodeBlock` reads like a precise specimen set into the body text: a light
  paper surface + hairline rule, never a dark editor shell / glowing border
  / colored title bar. Line numbers visible but recessed.
- Prism token colors derive from the theme: structure / tags use a
  blue-gray accent, keywords / warnings use warm red risk, strings use
  low-saturation green.
- `Formula` reads like a math annotation in the body text; block formulas
  are carried only by hairline rules and whitespace.

## Prohibited

- Cards, panels, filled color blocks, shadows, rounded corners; grid lines
  darker than `#D8D2C2`.
- Emoji / icons as decoration; color used for anything other than "carrying
  meaning."
- Stock-looking hero images, 3D illustration, gradient backgrounds,
  decorative light flares, highly saturated tech blue/purple, cartoon
  characters.
- Writing decorative components in Raw that run counter to Data-Ink
  (dashboard screens, particle backgrounds, glassmorphism).

## Suggested Behavior at Different Information Densities (guidance, not a limit)

- `100% longform / full-report`: mostly restrained longform, Raw lights up
  key concepts, data evidence comes first.
- `60-80% explainer / review`: keep the core evidence + diagrams, body text
  still the main body.
- `40% visual-essay`: still valid, but Raw should lean toward diagrams /
  evidence, low decoration, text shorter.
