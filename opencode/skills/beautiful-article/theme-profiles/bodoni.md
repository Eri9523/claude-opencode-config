# Theme Profile · bodoni (Broadsheet / Didone High Contrast)

> This is an authoring profile **for the AI to read while writing**, not CSS. CSS
> tokens live in the component library's runtime theme (`data-theme="bodoni"`).
> This file explains "how to choose and use this theme." For the full version,
> see the component library's canonical md: `src/theme/themes/bodoni/bodoni.md`
> (read it before writing code / formulas / media / Raw).

- **runtime theme id**: `bodoni` (`<ThemeProvider theme="bodoni">`)
- **Mood**: print-house grandeur (Didone broadsheet / fashion masthead). Pure
  white paper, true black ink, hairline column rules, Playfair Display masthead
  type with extreme stroke-weight contrast set above unhurried old-style serif
  body text. Its identity comes from print convention — bold/thin double
  masthead rules, drop caps, small-caps kickers, column rules dividing
  sections — color is reserved almost entirely for risk.

## Article Types It Suits / Doesn't Suit

- **Suits**: manifestos, in-depth features, weighty essays and long-form
  reviews, culture / current-affairs / fashion reporting; openings and
  cover-style longform that need authority, drama, and ceremony.
- **Doesn't suit**: warm and approachable (`press` / `freddie`), soft and
  healing (`andy`), cold spec-like content (`vignelli`), dark-mode engineering
  (`shannon` / `fuller`), academic papers (`knuth`), lively color (`bayer` /
  `sottsass`), slide decks.

## Typographic Mood

- Headings / mastheads use Playfair Display (high-contrast Didone), body text
  uses Source Serif 4 / Newsreader (readable old-style serif).
- Body ~17px, line height 1.62; display weight 900 at a huge size, creating the
  broadsheet gap against the hairline body text.
- Kickers / table headers / TOC titles / closing labels uniformly use **small
  caps + letter-spacing**; emphasis never uses italics (banned at the protocol
  level).
- **Hierarchy comes from size / weight / hairline rules, not color**; the whole
  piece stays near black-and-white, with red appearing only at genuine risk
  points.

## Raw Style

Like a hand-set plate or pull-quote from a broadsheet layout.

- What's constrained is the **mood** (black and white, hairline rules, Didone
  display type, print restraint), not the **medium**.
- Typical: black-and-white data / line charts, layout-style pull quotes,
  timelines, comparison columns, masthead-style title blocks, drop-cap
  openings.
- Composition: hairline rules + black and white + large display type; minimal
  color fill, red as the sole accent; no rounded corners, no shadows.
- Motion: restrained, near-static; avoid looping decoration and bounce.

## Media (Image / Video / Audio) Style

- Suits: black-and-white / low-saturation photography, high-quality portrait /
  still-life work, documentary photography, monochrome infographics,
  engraving-like texture.
- Composition: decisive whitespace, may run full-bleed / cropped; captions in
  small caps or small serif type; alt text required.
- Color: predominantly black, white, and gray, with a sparing touch of
  editorial red as an accent.

## Code / Formula Style

- `CodeBlock` reads like a restrained code listing set into a book page: warm
  light surface + hairline rule, no rounded corners, no dark window.
- Prism tokens: ink color / warm editorial red / low-saturation green; never a
  rainbow.
- `Formula` is centered and restrained, with serif figures.

## Prohibited

- Introducing any color besides editorial red as decoration; rounded corners /
  shadows / card treatment / gradients / neon.
- Using Didone type for long body paragraphs (body text uses old-style serif
  instead). Italics for emphasis (banned at the protocol level).

## Suggested Behavior at Different Information Densities (guidance, not a limit)

- `100% longform / feature`: drop-cap opening + rule-divided sections +
  centered metal-type pull quotes, body text as the main body.
- `60-80% commentary`: keep the key pull quotes and small-caps kickers,
  black-and-white plates as accents.
- `40% briefing`: Raw leans toward black-and-white data charts / timelines,
  text shorter, still in a broadsheet form.
