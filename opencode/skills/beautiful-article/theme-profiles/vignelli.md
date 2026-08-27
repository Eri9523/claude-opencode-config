# Theme Profile · vignelli (Swiss International Style Documentation)

> This is an authoring profile **for the AI to read while writing**, not CSS. CSS
> tokens live in the component library's runtime theme (`data-theme="vignelli"`).
> This file explains "how to choose and use this theme." For the full version,
> see the component library's canonical md:
> `src/theme/themes/vignelli/vignelli.md` (read it before writing code /
> formulas / media / Raw).

- **runtime theme id**: `vignelli` (`<ThemeProvider theme="vignelli">`)
- **Mood**: Swiss International Style typesetting. ReActicle's **only sans
  body text + cold neutral** theme. Cold neutral paper, a single grotesque
  type family building hierarchy across different sizes, hairline grid rules,
  a touch of Swiss red, monospace carrying metadata. Fully inherits the
  structural discipline (lines instead of boxes, no junk tables, color
  carries meaning).

## Article Types It Suits / Doesn't Suit

- **Suits**: `docs` / product documentation, `spec` / technical
  specifications, `changelog` / release notes, `reference` / SDK・API
  reference, AI tool / platform documentation, `explainer`, `tutorial`.
  Content that needs strong structure and skimmability.
- **Doesn't suit**: warm narrative content (`press`); formal academic papers
  (`knuth`); dark-mode engineering scenes (`shannon`); slide decks.

## Typographic Mood

- Body text and headings use a single grotesque type family (Söhne → Aktiv
  Grotesk → Helvetica Neue → Arial), building hierarchy **through size and
  whitespace rather than stacking weights**.
- Labels / table headers use the same family at a small size; metadata /
  code use monospace as metadata "chips" (rendered with lines and weight,
  never as colored pills or cards).
- Body ~17px, line height 1.6; large headings carry negative letter-spacing
  to stay tight. Emphasis never uses italics (banned at the protocol level).

## Raw Style

Like an illustration for system documentation, designed strictly to a grid.

- What's constrained is the **mood** (cold neutral, strong grid,
  systematized, skimmable), not the **medium**.
- Typical: grid diagrams, flow / state diagrams, spec comparison tables,
  keyboard / shortcut diagrams, toggleable parameter explanations, SVGs with
  mono annotations.
- Composition: strong grid alignment, clear hierarchy, Swiss red as the
  identifying cue; restrained color fill in service of understanding. Colors
  only from `--ra-*`.
- Motion: brief, crisp one-shot transitions are allowed (~120ms); avoid
  infinite looping decoration.

## Media (Image / Video / Audio) Style

- Suits: interface screenshots (chrome cropped clean), infographics /
  flowcharts / grid diagrams, icon-system explanations, wireframe / spec
  diagrams, low-saturation neutral photography.
- Composition: strong grid alignment, restrained whitespace, clear subjects;
  concise captions stating source; alt text required.
- Color: close to the cold neutral system, emphasis carried only by Swiss
  red.

## Code / Formula Style

- `CodeBlock` reads like a rigorously typeset technical spec: a cold light
  paper surface + hairline rule, never a dark editor window. Line numbers
  restrained.
- Prism tokens derive from the theme: tags / functions use Swiss red accent
  (restrained), keywords / risk use a deep risk red, strings use green,
  everything else sits in ink color / muted.
- `Formula` reads like a formula in a spec: restrained, aligned, carried by
  hairline rules and whitespace.

## Prohibited

- Cards, panels, filled color blocks, shadows, rounded corners, **colored
  left-border emphasis cards** (a named instance of slop).
- Using Swiss red as decoration; a second red used for anything other than
  "warning"; stacking weights in place of size hierarchy.
- Purple/pink gradient SaaS heroes, neon, default Tailwind flavor, emoji /
  icons as decoration, 3D rendered icons.
- Raw / media turning into a marketing landing page or a dashboard screen.

## Suggested Behavior at Different Information Densities (guidance, not a limit)

- `100% docs / reference`: systematized longform + spec tables + grid
  diagrams, body text as the main body.
- `60-80% spec / changelog`: keep the key specs + flow diagrams, mono
  metadata aiding skimmability.
- `40% briefing`: Raw leans toward grid diagrams, text shorter, still in a
  documentation form.
