# Theme Profile · andy (Headspace Calm / Gentle)

> This is an authoring profile **for the AI to read while writing**, not CSS. CSS
> tokens live in the component library's runtime theme (`data-theme="andy"`). This
> file explains "how to choose and use this theme." For the full version, see the
> component library's canonical md: `src/theme/themes/andy/andy.md` (read it before
> writing code / formulas / media / Raw).

- **runtime theme id**: `andy` (`<ThemeProvider theme="andy">`)
- **Mood**: warm humanist (Headspace). Warm cream paper, friendly pumpkin orange,
  warm gray ink (never pure black), all-rounded sans throughout (Quicksand +
  Nunito). **The only theme among the seven that combines large border radii with
  soft warm shadows.** Soft, calm, healing, focused on putting the reader at ease.
  Fully inherits the semantic component contract.

## Article Types It Suits / Doesn't Suit

- **Suits**: health / mental wellness / lifestyle, guided `tutorial`, gentle
  onboarding and reassurance, brand-values narratives, an `explainer` that needs a
  "soft UI" feel and warmth. Aimed at everyday readers, meant to lower stress.
- **Doesn't suit**: academic papers (`knuth`); cold, spec-like content
  (`vignelli`); dark-mode engineering (`shannon`); dense data reports (`tufte`);
  playful yellow-and-black (`freddie`); content that needs a sharp, serious edge;
  slide decks.

## Typographic Mood

- Headings / labels use Quicksand (geometric rounded), body text uses Nunito
  (humanist rounded); echoes the Headspace smile curve.
- Body ~17px, line height 1.7 (generous); headings `display: 700`, the rounded
  weight leaning heavy for maximum friendliness. Emphasis never uses italics
  (banned at the protocol level).
- **Bright orange fills, darker orange is text**: circular section numbers /
  pills use bright pumpkin orange; links / structure use a deeper burnt orange to
  keep legibility.

## Raw Style

Like a soft, rounded, relaxing illustrated page.

- What's constrained is the **mood** (warm orange palette, large radii, soft
  shadows, generous whitespace, calm), not the **medium**.
- Typical: rounded step cards, soft progress / breathing animations, circular
  data charts, gentle Q&A, blob / imperfect-circle decoration.
- Composition: generous whitespace, large radii, soft shadows; colors only from
  `--ra-*` (orange from `--hs-orange`).
- Motion: gentle and smooth, may include soothing loops (e.g. a breathing guide),
  but never noisy.

## Media (Image / Video / Audio) Style

- Suits: rounded mascot / blob illustrations, warm lifestyle photography, soft
  warm-orange gradient backgrounds, friendly rounded icons.
- Composition: ample whitespace, rounded crops, calm subjects; gentle captions;
  alt text required.
- Color: predominantly warm orange, with soft blue / soft green as supporting
  mood colors, low saturation, soft.

## Code / Formula Style

- `CodeBlock` reads like a code card in friendly app documentation: warm peach
  surface + large radius + optionally a very light shadow, never a dark
  terminal.
- Prism tokens: tags / functions use a deeper orange accent (restrained),
  keywords use risk red, strings use green, everything else sits in warm ink /
  muted.
- `Formula` reads like a gentle annotation: restrained, aligned, may sit on a
  rounded surface.

## Prohibited

- Pure black ink, hard right angles, cold colors — these instantly break the
  "soft and healing" identity.
- Bright pumpkin orange as body text / small text (insufficient contrast; use
  the deeper accent instead).
- Overusing soft shadows + large radii into a stack of showy cards; purple/pink
  neon, default Tailwind flavor; italics for emphasis.

## Suggested Behavior at Different Information Densities (guidance, not a limit)

- `100% explainer / tutorial`: soft longform + rounded step cards + pillow
  callouts, body text as the main body.
- `60-80% guided content`: keep the key steps + gentle illustration, circular
  section numbers as accents.
- `40% briefing`: Raw leans toward soft diagrams / breathing animations, text
  shorter, still in a healing form.
