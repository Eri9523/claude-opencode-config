# Theme Profile · press (Bound Volume / Editorial)

> This is an authoring profile **for the AI to read while writing**, not CSS. CSS
> tokens live in the component library's runtime theme (`data-theme="press"`).
> For the full version, see the component library's canonical md:
> `src/theme/themes/press/press.md` (read it before writing code / formulas /
> media / Raw).

- **runtime theme id**: `press` (`<ThemeProvider theme="press">`)
- **Mood**: publication-grade longform (modeled on Stripe Press). Shares its
  lineage and Data-Ink structural discipline with tufte (lines instead of
  boxes, inline annotation, no junk tables, never cards or shadows), but its
  personality is more outgoing: it typesets a report like a carefully designed
  book. Where tufte invites you to "read up close," press asks you to "read a
  book at arm's length."

## Article Types It Suits / Doesn't Suit

- **Suits**: `essay`, `briefing`, `visual-essay`, `longform` (narrative /
  publication-style), `explainer` (leaning humanistic). Longform reading meant
  to be unhurried — essays, white papers, product notes.
- **Doesn't suit**: extremely dense data reports that need heavy marginalia
  (that's tufte's home turf); slide decks.

## Typographic Mood

- Body text and headings use a contemporary transitional serif (Newsreader →
  Source Serif 4 / Spectral / Georgia / a Chinese serif face), a mood more
  modern and more "book-like" than tufte.
- Body text runs larger (~17px), line height 1.7; heading sizes are spread
  wider (h1 ≈ 3rem), gaining weight through scale rather than boldness.
- One rich primary color (oxide blood red) threads through the whole piece:
  section numbers, emphasis rules, the hero, TOC highlights. Italics are
  prohibited.

## Raw Style

Can carry more of a layout sensibility than tufte, but should still read like
a single illustration designed specifically for the article.

- Preferred: publication-style column diagrams, warm infographics, small
  interactive rulers, pacing diagrams between sections, SVGs with fine
  captions, lightly expandable / toggleable explainer controls.
- Composition: more generous whitespace, stronger heading hierarchy, oxide
  blood red as the identifying cue; color fill can be a touch more than tufte
  but still restrained.
- Motion: brief, soft, one-shot transitions are allowed; avoid infinite
  looping decorative animation.
- Custom CSS / SVG / React must still use `--ra-*` tokens, without
  introducing new brand colors or cold gradients.

## Media (Image / Video / Audio) Style

- Suits: warm authentic photography, book / paper / desk detail shots,
  product UI screenshots, low-saturation editorial illustration, polished
  infographics, manuscripts / notes / layout sketches.
- Composition: clear subjects, ample whitespace, warm color temperature; may
  preserve more product context than tufte, but noise should be cropped out.
- Captions read like publication captions, concisely stating source and
  context, never a marketing tagline.

## Code / Formula Style

- `CodeBlock` reads like a code page in a technical book: warm, clear,
  polished, but never turning into an IDE screenshot. A light code surface on
  cream paper with line borders, line numbers more unhurried than tufte's.
- Prism token colors derive from the press tokens: tags / functions use
  oxide blood red accent, strings use low-saturation green, keywords / risk
  use a hotter risk tone.
- `Formula` reads like a typeset formula on a book page; block formulas may
  take more unhurried whitespace, captions read like publication plate
  captions.

## Prohibited

- Cards, panels, filled color blocks, shadows, rounded corners.
- Overusing the primary color as decoration (it only carries structure and
  brand identity); a second red used for anything other than "warning."
- Emoji / icons as decoration.
- Images or Raw turning into a marketing landing page / SaaS homepage /
  dashboard screen instead of a publication's plates.
- Cold blue-purple SaaS stock imagery, 3D rendered icons, cheap gradient
  backgrounds, uninformative hero mood shots.

## Suggested Behavior at Different Information Densities (guidance, not a limit)

- `100% longform`: an in-depth published article, weight itself creates
  hierarchy, Raw serves as polished illustration.
- `40-60% briefing / visual-essay`: stronger editorial pacing and more
  text/image whitespace, visual blocks take up more proportion, but it's
  still an article.
