# Theme Profile · sottsass (Memphis / 80s Clashing Color)

> This is an authoring profile **for the AI to read while writing**, not CSS. CSS
> tokens live in the component library's runtime theme (`data-theme="sottsass"`).
> This file explains "how to choose and use this theme." For the full version,
> see the component library's canonical md:
> `src/theme/themes/sottsass/sottsass.md` (read it before writing code /
> formulas / media / Raw).

- **runtime theme id**: `sottsass` (`<ThemeProvider theme="sottsass">`)
- **Mood**: postmodern / Memphis (Milan, 1981). Warm cream paper, black ink,
  deliberately clashing Memphis pastels (hot pink / turquoise / sunshine
  yellow / cobalt blue). Its identity comes from 80s game-show energy: crisp
  hard shadows with no blur, slight rotation, rounded color pills, wavy
  underlines, geometric confetti. Loud and joyful, yet still readable.

## Article Types It Suits / Doesn't Suit

- **Suits**: playful popular-science / explainers, design / culture / trend
  writing, launch and event copy, casual onboarding; content with "personality
  over polish" that isn't afraid of clashing color.
- **Doesn't suit**: academic (`knuth`), black-and-white broadsheets
  (`bodoni`), cold spec documents (`vignelli`), dark-mode engineering
  (`shannon` / `fuller`), serious and restrained content, quiet healing
  content (`andy` is softer), slide decks.

## Typographic Mood

- Headings / labels use Space Grotesk (playful geometric), body text uses
  Hanken Grotesk (clean grotesque).
- Body ~17px, line height 1.65; display weight 700; emphasis never uses
  italics (banned at the protocol level), instead uses color blocks /
  highlights.
- **Clashing color is expression, cobalt blue is structure**: links /
  numbering are fixed to cobalt blue (for legibility); pink / turquoise /
  yellow are only used as bold fills, never for small text.

## Raw Style

Like a Memphis-poster-style illustrated page.

- What's constrained is the **mood** (clashing color blocks, crisp unblurred
  hard shadows, mixed border radii, slight rotation, confetti / squiggles),
  not the **medium**.
- Typical: hard-shadow cards, clashing-color geometric diagrams, confetti /
  squiggle decoration, rotated labels, upbeat ratio / step diagrams.
- Composition: black outlines + offset hard shadows + clashing color + mixed
  border radii; slight rotation allowed.
- Motion: bouncy pop-in / position changes; avoid infinite neon looping.

## Media (Image / Video / Audio) Style

- Suits: geometric confetti illustration, clashing-color posters, squiggle /
  terrazzo textures, hard-shadow collage, upbeat portraits / still life.
- Composition: bold clashing color, may be rotated / asymmetric, black
  outlines + hard shadows; concise, playful captions; alt text required.
- Color: pink / turquoise / yellow / blue clashing, plus black and white; no
  soft glow gradients or neon.

## Code / Formula Style

- `CodeBlock` reads like a code card in a trend magazine: warm light surface
  + black border + moderate radius, may have a hard shadow; never a dark
  terminal.
- Prism tokens: tags / functions use cobalt blue, keywords use rose-red risk,
  strings use turquoise success; clashing color lives in borders /
  highlights, not in a rainbow of syntax colors.
- `Formula` may sit on a rounded surface with a touch of color, restrained
  alignment.

## Prohibited

- Using pink / turquoise / yellow as body text / small text / link color
  (readable structure is fixed to cobalt blue).
- Soft blurred shadows (this theme uses unblurred hard shadows instead),
  cheap gradients, neon.
- Pushing "clashing color + hard shadow" so hard the content becomes
  unreadable (body text must still read comfortably). Italics for emphasis
  (banned at the protocol level).

## Suggested Behavior at Different Information Densities (guidance, not a limit)

- `100% playful explainer`: clashing-color longform + rotated chapter blocks
  + hard-shadow callouts + confetti accents, body text as the main body.
- `60-80% content`: keep the key hard-shadow cards + clashing-color diagrams,
  wavy underlines as accents.
- `40% briefing`: Raw leans toward clashing-color ratio / step diagrams, text
  shorter, still in a Memphis form.
