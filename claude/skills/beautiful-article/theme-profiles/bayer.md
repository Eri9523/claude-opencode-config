# Theme Profile · bayer (Bauhaus / Primary-Color Geometry)

> This is an authoring profile **for the AI to read while writing**, not CSS. CSS
> tokens live in the component library's runtime theme (`data-theme="bayer"`).
> This file explains "how to choose and use this theme." For the full version,
> see the component library's canonical md: `src/theme/themes/bayer/bayer.md`
> (read it before writing code / formulas / media / Raw).

- **runtime theme id**: `bayer` (`<ThemeProvider theme="bayer">`)
- **Mood**: Bauhaus / constructivist. Warm paper, near-black ink, the three
  primary colors (red / blue / yellow) used as **structural colors** rather than
  decoration. Its identity comes from geometry: chapter numbers inside solid blue
  circles, tricolor red/yellow/blue masthead bars, lowercase sans-serif kickers,
  hard-edged squares. Geometric sans (Josefin / Poppins). Loud, but disciplined.

## Article Types It Suits / Doesn't Suit

- **Suits**: teaching / popular-science explainers, product introductions,
  manifestos, brand narratives; "professional but with character, colorful but
  not showy," pairs well with geometric infographics / flowcharts /
  constructivist illustration.
- **Doesn't suit**: academic papers (`knuth`), black-and-white broadsheets
  (`bodoni`), dark-mode engineering (`shannon` / `fuller`), soft and healing
  (`andy`), extreme neutral spec documents (`vignelli`), slide decks.

## Typographic Mood

- Headings / labels use Josefin Sans (geometric), body text uses Poppins
  (geometric humanist).
- Body ~17px, line height 1.65; display weight 700; emphasis never uses italics
  (banned at the protocol level).
- **Blue is structure, red is risk, yellow is fill**: links / section circles
  use blue, warnings use red, yellow is only used as a color block (never as
  text color).
- Kickers / ledes go lowercase (a single-alphabet Bauhaus convention; applies
  only to Latin letters).

## Raw Style

Like a page of constructivist infographics.

- What's constrained is the **mood** (red/blue/yellow, a strong grid, hard
  edges, circular accents), not the **medium**.
- Typical: geometric flowcharts, circle/square/triangle compositions,
  primary-color bar charts / ratio diagrams, grid diagrams, step numbers in blue
  circles.
- Composition: strong grid, hard edges, three primary colors + black and white;
  no rounded rectangular cards.
- Motion: crisp position/visibility changes, no bounce, no looping decoration.

## Media (Image / Video / Audio) Style

- Suits: geometric constructivist illustration, primary-color posters,
  high-contrast black-and-white / primary-color photography, grid /
  circle-square-triangle diagrams.
- Composition: strong grid, decisive whitespace, primary-color blocks; concise
  captions; alt text required.
- Color: red / blue / yellow plus black and white; no purple/pink cold
  gradients.

## Code / Formula Style

- `CodeBlock` reads like a code block in constructivist documentation: warm
  light surface + hairline rule, no rounded corners, no dark window.
- Prism tokens: tags / functions use blue accent, keywords use red risk,
  strings use green; **yellow is never a syntax color**.
- `Formula` is centered and restrained, may sit on a very faint surface.

## Prohibited

- Using Bauhaus yellow as text / link / syntax color (insufficient contrast).
- Stacks of rounded rectangular cards with shadows; purple/pink gradients,
  neon, default Tailwind flavor, emoji as decoration. Italics for emphasis
  (banned at the protocol level).

## Suggested Behavior at Different Information Densities (guidance, not a limit)

- `100% explainer / teaching`: longform + blue-circle numbering + geometric
  infographics + yellow-backed principle blocks, body text as the main body.
- `60-80% content`: keep the key steps + constructivist diagrams, tricolor bars
  as accents.
- `40% briefing`: Raw leans toward geometric diagrams / ratio charts, text
  shorter, still in a constructivist form.
