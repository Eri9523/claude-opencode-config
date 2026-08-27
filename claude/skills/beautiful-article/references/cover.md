# Article Cover — Design Guide

## What this is

Every Beautiful Article has a **book-cover-like** title image sitting above the TOC and
prose, occupying the top of the page on its own. It's the opening move of the HTML
article's "publication feel" — like a book cover, a magazine cover, or an album sleeve:
one glance conveys "**what this piece is about + what mood it carries**," and it decides
whether the reader keeps scrolling.

The cover is **not** the Hero:

| Role | Hero | Cover |
|---|---|---|
| Position | Inside `<Article>`, next to the TOC | **Outside** `<Article>`, **above** the TOC |
| Form | Title + subtitle + meta (a text band) | 3:4 image-and-text composition |
| Responsibility | Frame the topic + what the reader gets | Visual hook + tone-setting |
| Information | Text-dominant | **Image-led, text-supporting** |

The two are **complementary**: the cover draws the reader in, the Hero anchors them.
**Don't make them do the same job.**

---

## Sizing — 3:4 fits on one screen / occupies the first PDF page

- **On screen**: `aspect-ratio: 3 / 4`, with the width bounded by **two upper limits**
  simultaneously (whichever is smaller), guaranteeing the full 3:4 cover **fits on one
  screen with no scrolling**:
    1. `48rem` (768px) — a hard ceiling; any larger and it reads like a billboard, not a
       book cover;
    2. `calc((100vh - 8rem) * 3 / 4)` — a width derived back from the viewport height,
       leaving 8rem (128px) for the top bar / container margins / vertical breathing room.

  That is, `max-width: min(100%, 48rem, calc((100vh - 8rem) * 3 / 4))`. On short screens
  the cover automatically shrinks (while staying 3:4); on tall screens above 1024px it
  stays at 768×1024.
- **PDF**: `@media print` keeps the on-screen 3:4 composition by default and forces a page
  break right after the cover, so the cover occupies the first PDF page on its own. Don't
  rely on a generic `height: 100vh` to force-stretch the cover into a full page — Chromium
  print's clipping behavior on complex cover-internal layouts isn't reliable enough.

Why 3:4 rather than the A4 ratio (1:√2 ≈ 0.707):

| Ratio | Value | Feel |
|---|---|---|
| 16:9 | 1.78 | Too wide, reads like a banner |
| A4 (1:√2) | 0.707 | On the narrow side, reads like a report's interior page |
| **3:4** | **0.75** | **Reads like a book cover — the midpoint between A4 and Letter** |
| 2:3 | 0.667 | Reads like a novel cover — on the narrow side |

3:4 leaves roughly 4% white margin top/bottom on A4 PDF, and roughly 3% on Letter PDF. By
default we keep this slight ratio mismatch in exchange for stable PDF output.

**Implication for designers**: the default PDF path won't change the cover's aspect ratio,
but the internal layout should still be adaptive: use percentages / `aspect-ratio` /
`inset: 0` / `grid` / `flex` to hold elements in place — **never hard-code any element's
position to absolute pixels**, or it can still end up misaligned across different
viewports and print scaling.

---

## Hard constraints (5 rules — non-negotiable)

1. **3:4 on screen + occupies the first PDF page (don't touch the shell)**. Don't change
   `Cover.tsx`'s `aspectRatio: "3 / 4"` or its max-width / margin / border — section C of
   `pdf-print-overrides.css` is only responsible for forcing a page break after the cover.
   **Internal elements must uniformly use percentages / relative units**, never hard-coded
   absolute-px heights.
2. **Image and text together.** **A text-only cover is forbidden.** It must have both:
   - a **visual centerpiece** (any technique works, see below);
   - a **text layer**: at least a title, optionally a subtitle line and a small
     label (type / date / kicker).
3. **Faithful to the theme — only `--ra-*` tokens.** Color / font size / font weight /
   border / border-radius / spacing must all be pulled from `var(--ra-color-fg)`
   `var(--ra-color-accent)` `var(--ra-text-3xl)`, etc. **Forbidden**: hard-coded hex
   colors, hard-coded font names, hard-coded pixel font sizes — any of these breaks the
   cover the moment the theme is switched.
4. **Faithful to the content.** The cover's visual centerpiece must echo the **actual
   thesis of the prose** (not generic decoration). After looking at the cover, the reader
   should be able to guess which domain the article covers or what kind of judgment it
   makes. For example:
   - an article arguing "prompt caching is everything" → the cover could be a **cache-hit
     rate curve / a highlighted band of repeated tokens**;
   - an article about "the Codex agent loop" → the cover could be a **loop diagram with
     arrows (USER → MODEL → TOOL)**;
   - an article about "color clashes" → the cover could be a **geometric collage of two
     complementary color blocks**.
5. **Offline-first.** **The one thing that's absolutely forbidden**: remote images
   (`<img src="https://...">`, dynamically loaded Google Fonts, cross-origin CSS
   background-url, etc.) — these won't open offline. **base64 raster** images are allowed
   only when the Plan Checkpoint's "image mode" is `user-assets` / `ai-generated`, and must
   be inlined.

---

## Visual technique — the model's own choice, as long as it looks good

Which technique to use for the cover's visual centerpiece **is up to you (the model)** —
SVG / CSS / Canvas / WebGL / typography / emoji / a complex React component / mask /
clip-path / filter / multi-layer compositing / any combination. **There's no "preferred"
option** — only "which one is right for this article and this theme."

Available techniques (non-exhaustive — anything you can think of is fair game):

- **Inline SVG**: grids / curves / node-edge diagrams / flow arrows / vector
  illustration / pattern fills / masks; the advantage is crisp at any size, and
  `currentColor` automatically follows the theme.
- **CSS geometry / gradients / clip-path / backdrop-filter**: split-screen color blocks,
  a glass effect, light effects, abstract typesetting; good for a poster-like or
  graphic-design-like cover.
- **`<canvas>` + JS**: particles / fluid / noise / procedural textures / ASCII art;
  good for a data / tech / generative-art mood. Note: Canvas only renders its **initial
  frame** in PDF, so for anything animated, make sure "the first frame alone is already
  a good-looking final state."
- **Complex React components**: a fully custom layout, e.g. using grid + conditional
  rendering to build a "table-of-contents-style cover," or using React to rearrange title
  characters into typographic art.
- **Typography itself as the image**: oversized font sizes, letter-/line-spacing
  experiments, overlapping characters, an emoji collage, Unicode geometric characters
  (`◐ ▲ ◆ ╳`), quotation marks or chapter numbers blown up to fill the page.
- **Multi-layer compositing**: a background layer (gradient) + a middle layer (SVG) + a
  foreground layer (text) + a decorative layer (icons / labels).
- **Mixing techniques**: stack any of the above on top of each other. The cover is a
  one-off creation — there's no need to stick to a single technique stack.

**The only thing not allowed**: remote images (see Hard Constraint 5). Everything else is
**fully open**.

**Judging criterion**: squint at it for 3 seconds (Does the image work? Does the mood
land? Will it survive a theme switch? Will it misalign under print?). Pass these 4 checks
and any implementation technique is fine.

---

## Composition templates (pick one starting point based on the theme's mood)

| Template | Visual layout | Good fit for theme mood |
|---|---|---|
| **A · Text-over-image, stacked** | Title area in the top 1/3, visual centerpiece filling the bottom 2/3 (the classic book-cover "title + main image") | Instructional / reports / most scenarios |
| **B · Oversized type over image** | The visual fills the whole 3:4 frame, with an oversized title overlaid in the middle or lower section | bodoni / press — print / narrative |
| **C · Split top-bottom** | A color block up top (with the title) + the visual centerpiece below; one dividing line in between | tufte / shannon — data / rigor |
| **D · Full-bleed collage** | The visual is a collage of color blocks / shapes / layers filling the entire page, with text embedded in one of the blocks | sottsass / bayer — contemporary / visual-forward |
| **E · Minimal frame** | Generous whitespace, a thin frame line, a centered title, one very small visual anchor (a circle / an icon / a curve) | Minimalist themes / serious reports / reflective pieces |

**Don't mix templates** — one template per article. A template is only a "starting point";
how you actually implement it (SVG / CSS / Canvas / React / something else) is up to you.

---

## Theme tendencies (quick reference)

Read `theme-profiles/<id>.md` for the authoritative style guide; below are "cover
starting-point" hints (**the visual technique is only a suggestion, not a rule** — you can
use any technique to land the right mood):

| Theme | Cover feel | Recommended template | Example visual approach |
|---|---|---|---|
| tufte | Academic / restrained / data-driven | C or E | An ultra-fine line grid + one small sparkline / data point; low-saturation color |
| press | Newsprint / narrative / weighty | B or E | Oversized title + a horizontal divider + a stamp-like kicker; can add an engraving-like texture |
| shannon | Information theory / engineering / blue tones | A or C | Node-edge diagram / a Shannon-style channel diagram / probability distribution |
| bodoni | Classical / elegant / typographic | B | High-contrast serif oversized title + very thin hairline ornament + whitespace |
| bayer | Bauhaus / geometric / typographic | D | Primary-color block collage + circle / square / triangle combinations |
| sottsass | Postmodern / playful / bright | D | Clashing color blocks + decorative patterns + bold type |
| fuller | Geodesic / technical / structural | A or D | Triangular grid / isometric projection / engineering-drawing style |

For themes not listed here → read its `theme-profiles/*.md` to decide the template.

---

## Anti-patterns (**forbidden**)

- **A text-only cover** (only a centered title, no visual centerpiece).
- **Using remote images** (`<img src="https://...">`, `background-image: url(https://…)`)
  — won't open offline.
- **Hard-coded color / font / pixel values** (`color: #ff0066` / `font: 24px Helvetica`) —
  breaks the moment the theme is switched.
- **Positions hard-coded to absolute pixels within the 3:4 frame** (`top: 384px`) — will
  misalign under a different viewport or print scaling.
- **Copying the Hero's content onto the cover** (title, subtitle, date, author all crammed
  onto the cover) — duplicates the Hero.
- **Overloading it with elements** (cramming title + subtitle + three small labels + meta +
  Lead + a TOC preview + a large illustration + a QR code all onto the cover) — this blows
  up the information density; it reads like a dashboard, not a cover.
- **Internal elements overflowing the container** (letting absolutely positioned children
  run outside the 3:4 boundary) — this gets clipped in PDF.
- **The cover carrying prose content** (stuffing the first paragraph of substance onto the
  cover) — the cover is a hook, not content.
- **A Canvas animation whose content only appears after time passes** (PDF only captures
  the first frame, resulting in a blank screen) — make sure the first frame alone already
  looks good.

---

## Self-check (**must pass all 5**)

After finishing the cover, check it against the following 5 items; if any fails, fix it
before delivering:

1. **Image and text together**: if you strip away the text layer, is there still a visual
   centerpiece left? If you strip away the visual layer, is there still text left? Both
   must be present.
2. **Faithful to the theme**: switch to a different theme from `theme-profiles/index.json`
   (a one-line change in `main.tsx`) — does the cover **automatically follow** with new
   colors / fonts, without breaking? If there's any hard-coded value, it fails.
3. **Faithful to the content**: stare at the cover for 5 seconds — can you guess what the
   article is about? If all you see is "a pretty shape" with little connection to the
   prose, it fails.
4. **Ratio-adaptive**: stretch the container from 3:4 (screen) to ~3:4.2 (A4) / ~3:3.9
   (Letter) — do internal elements avoid overflowing / misaligning / leaving large empty
   gaps? (Using `position:absolute; inset:0` + `grid` / `flex` to hold elements, rather
   than hard-coded pixel positions, passes this automatically.)
5. **Doesn't duplicate the Hero**: the cover's text ≠ the Hero's text (one is a hook, the
   other is an anchor).

---

## PDF behavior

Section C of `scripts/pdf-print-overrides.css` will make the cover:

- **keep the cover's 3:4 shell unchanged** — avoiding Chromium print clipping the internal
  layout when force-stretched;
- **`break-after: always`** — so the TOC starts on the second page.

Result: PDF page one = the 3:4 cover occupying the whole page; page two onward = TOC + prose.

> **Wanting a full-page cover**: you can add dedicated print handling for `.ra-cover` in a
> single article, but you must export the PDF and visually inspect it. Don't make full-page
> stretching the general default.

---

## When to turn the cover off (`--no-cover`)

99% of scenarios should keep it on. A few cases where it's turned off:

- **briefing** (a decision summary for busy readers): the user wants "the substance right
  when it opens," and the cover would only be friction.
- **dialogue** (conversation / interview): the content is a conversational stream, and the
  cover adds little value; can be turned off.
- **The user explicitly asks for it off**: respect that.

How to turn it off:
- At scaffolding time: `bash scripts/scaffold.sh <dir> --theme=<id> --no-cover`.
- After scaffolding: delete the `<Cover />` import and render in `article/main.tsx`; you
  can also delete `Cover.tsx` while you're at it.

---

## Where this fits in the writing workflow (position within the Skill)

| Phase | What's relevant to the cover |
|---|---|
| Phase 2 Plan | In the Brief section of `plan/plan.md`, add a line "Cover: on/off + one sentence of composition idea + theme template (A/B/C/D/E)" |
| Phase 3 Checkpoint 1 | Item 5 independently confirms "Cover · on / off"; the AI's recommendation is usually "on" |
| Phase 4 First Spread | **Replace `<CoverPlaceholder />` in `article/Cover.tsx`** with a design dedicated to this piece; the first-spread acceptance review must inspect the cover |
| Phase 4 First Spread Review | The Reviewer runs the 5-item self-check from this document |
| Phase 6 Final Review | The Visual Reviewer re-checks the cover's consistency with the theme |
| Phase 8 Delivery | The cover automatically occupies the first PDF page on export (no extra steps needed) |
