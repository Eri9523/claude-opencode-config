# Theme Profile · freddie (Mailchimp Warm Yellow / Friendly)

> This is an authoring profile **for the AI to read while writing**, not CSS. CSS
> tokens live in the component library's runtime theme (`data-theme="freddie"`).
> This file explains "how to choose and use this theme." For the full version,
> see the component library's canonical md:
> `src/theme/themes/freddie/freddie.md` (read it before writing code / formulas
> / media / Raw).

- **runtime theme id**: `freddie` (`<ThemeProvider theme="freddie">`)
- **Mood**: warm humanist (Mailchimp). Pure white paper, near-black Peppercorn
  ink, Cavendish bright yellow used only as a **highlighter / color block**
  (never as text color). Playful, soft serif headings (Fraunces) set above
  clean grotesque body text (Hanken). Witty, approachable, human, yet still
  professional. Fully inherits the structural discipline.

## Article Types It Suits / Doesn't Suit

- **Suits**: product introductions, `tutorial` / onboarding guides, changelog
  narratives, feature `explainer`s, FAQs, approachable marketing-flavored
  longform. Aimed at everyday users, content that needs warmth and humor.
- **Doesn't suit**: academic papers (`knuth`); cold system spec documents
  (`vignelli`); dark-mode engineering scenes (`shannon`); extremely dense data
  reports (`tufte`); soft-and-healing content (`andy`); slide decks.

## Typographic Mood

- Headings use Fraunces (soft and playful, echoing Cooper / Means), body text
  / labels use Hanken Grotesk (echoing Graphik).
- Body ~17px, line height 1.65; headings rely on `display: 600` + a soft axis
  rather than extreme weight. Emphasis never uses italics (banned at the
  protocol level).
- **Yellow is a highlighter, not ink**: links = black text + yellow highlight
  (fills on hover); section numbers = black text + yellow sticker (slightly
  rotated).

## Raw Style

Like a friendly, slightly hand-crafted illustration of a product explainer.

- What's constrained is the **mood** (black/white/yellow, moderate radii,
  roomy whitespace, a touch of human warmth), not the **medium**.
- Typical: step/flow diagrams, comparison diagrams, annotations with a yellow
  highlight, friendly small data charts, expandable FAQs.
- Composition: roomy whitespace, yellow used only for emphasis, moderate
  radii; colors only from `--ra-*` (yellow from `--mc-yellow`).
- Motion: brief transitions with a touch of bounce are allowed; avoid infinite
  looping decoration.

## Media (Image / Video / Audio) Style

- Suits: polished product screenshots, warm photography, scruffy /
  hand-drawn illustration, flow diagrams, friendly imagery featuring people.
- Composition: roomy whitespace, clear subjects, may have a touch of imperfect
  human warmth; concise captions; alt text required.
- Color: close to black / white / yellow, emphasis carried by yellow color
  blocks, no purple/pink cold gradients.

## Code / Formula Style

- `CodeBlock` reads like a friendly code snippet: warm light surface +
  hairline rule + moderate radius, never a dark editor window.
- Prism tokens: tags / functions use ink color or warm red, keywords use risk
  red, strings use green; **yellow is never a syntax color**.
- `Formula` reads like a friendly annotation in the body text: restrained,
  aligned, may sit on a very faint rounded surface.

## Prohibited

- Using Cavendish yellow as text / link / syntax color (unreadable, breaks the
  identity).
- Purple/pink gradients, neon, default Tailwind flavor, using emoji / icons as
  decoration.
- Stacks of large-radius, heavily-shadowed cards (that's `andy`'s soft
  territory); italics for emphasis.

## Suggested Behavior at Different Information Densities (guidance, not a limit)

- `100% explainer / tutorial`: friendly longform + step diagrams + yellow
  callouts, body text as the main body.
- `60-80% product introduction`: keep the key steps + screenshots, yellow
  accents as highlights.
- `40% briefing`: Raw leans toward friendly diagrams, text shorter, still a
  warm product-flavored form.
