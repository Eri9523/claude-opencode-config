# Component Usage Policy (the reacticle protocol)

Articles are written with the `reacticle` component protocol: **no hand-written bare
`div` / `className` / inline `style` / CSS**. Structure goes through semantic components,
prose goes through paragraphs, and custom visuals go through `Raw`. Import from the
package entry point:

```tsx
import { ThemeProvider, Article, Hero, Lead, Section, Aside, Table, Raw } from "reacticle";
```

## Core rules (always apply)

1. **Prose-first, components as needed, Raw freely.**
   - **Prose is the body**: ordinary paragraphs written as children of `Section` should
     make up the great majority of the article.
   - **Semantic components are accents, used only when content genuinely "is" that
     structure**: `Summary` / `Aside` / `Quote` / `Table` / `RiskList` / `Decision`, etc.
     Don't stack them as decoration — piling up cards makes an article feel contrived and
     fragmented. Litmus test: if a sentence / a list / a table / a block of Raw reads
     better, use that instead.
   - **Raw is the opposite: use it generously.** Interaction, animation, custom
     visualization, novel layout — things Markdown can't do — are what turn an article from
     "readable" into "worth reading." Raw doesn't interrupt reading; it gives dense text
     rhythm and breathing room.
2. **Express semantics, not layout.** Say "this is an insight / risk / decision," not
   "a blue card with 24px padding."
3. **Props are the contract.** Fill in every required field; if genuinely absent, leave it
   blank — the component will render an explicit `⚠ <field> not specified` marker so the
   gap stays visible. **Never fabricate a value to paper over a gap.**
4. **Theme, don't style.** Authors only pick a theme via `ThemeProvider` and never write
   component styles.
5. **Always wrap `<Article>` in `<ThemeProvider theme="...">`.**
6. **Layout is decoupled from theme.** `Article`'s `width` (`narrow` / `regular` / `wide` /
   `full`, default `regular`) determines the reading column width, and `toc` (on by default
   in this Skill) determines whether there's a left-hand table of contents — both are
   chosen based on content and confirmed at the Plan Checkpoint, **never decided by the
   theme**. See `references/layout.md` for details.
7. **One Section = one file.** Each Section must be an independent component
   (`article/sections/NN-*.tsx`); **it is strictly forbidden** to write multiple Sections
   into one component. `Article.tsx` only does assembly. This is the precondition for
   parallel multi-Agent development — see `references/section-build.md` for details.

## Components split into two tiers: default core + domain specials

**Default core components (most articles use only these, plus prose and Raw):**

- Structure: `Article`, `Hero`, `Lead`, `Section`, `Subsection`, `Conclusion`, `TOC`
- Insight: `Summary`, `Aside`, `Quote`
- Data: `Table`
- Technical: `CodeBlock` (use it **exclusively** for code), `Formula`
- Media: `Image`
- Freeform layer: `Raw`

**Domain special components (draw on these only when content genuinely "is" that
structure — don't use them all just because the article belongs to some category):**

- Decisions / review: `RiskList`, `Decision`, `ActionList`, `Checkpoint`, `Tradeoff`, `Incident`
- Code review: `DiffReview`
- Interactive shells: `Detail`, `Tabs`
- Rich media: `Video`, `Audio`

> **Do not expose to authors**: `HighlightedCode` is the internal implementation detail
> under `CodeBlock`. Always use `CodeBlock` for code; never use `HighlightedCode` directly.

Before choosing a component, run it through the litmus test in Rule 1: if prose / a list /
a table / Raw reads better, don't use a component just for the sake of using one. Every
additional domain special component used should be able to answer "this content is,
fundamentally, that thing."

The full component API (props, usage) lives in the component library's own reference:
`skill/references/{structure,insight,structured,decision,technical}.md` (the
reacticle-authoring skill) — read them as needed, not all at once.

## Usage principles

- Prose is the body. Components are semantics, not decoration.
- Raw is expressive power for the article, not an entry point for app development
  (boundaries in `raw-policy.md`).
- `Table` handles two-dimensional information; `Image` handles real or generated images;
  `Raw` is the free web layer — any HTML / CSS / JS / React: interaction, custom layout
  and typesetting, motion, embedded widgets, and diagrams as needed (SVG / canvas), where
  SVG is just one means among many, not the default.
- **`Raw` and `Image` are orthogonal, not an either/or**: `Raw` is always present by
  default and used as usual; whether `Image` is used, and which source, is decided by the
  image policy at the Plan Checkpoint (see `references/asset-policy.md`). Choosing `none`
  for images only means no external images are used — `Raw` is unaffected.

## Information density and component proportion

See `information-density.md`: at 100% length, prose comes first with Raw highlighting key
concepts; the lower the density, the higher the proportion of visual blocks — but **the
piece must still hold its shape as an article**.

## Minimal skeleton (note the proportion: lots of prose + one accent component + one Raw block)

```tsx
import { ThemeProvider, Article, Hero, Lead, Section, Aside, Raw } from "reacticle";

export function Article_() {
  return (
    <ThemeProvider theme="tufte">
      <Article>
        <Hero title="Title" subtitle="Subtitle" meta={[{ label: "Date", value: "2026-06-08" }]} />
        <Lead>Lead paragraph, framing the topic.</Lead>
        <Section index="01" title="Section One">
          <p>Prose paragraphs go in children — this should be the bulk of the article, write as much prose as possible.</p>
          <p>Write another paragraph, laying out background, reasoning, and conclusions in words.</p>
          <Aside tone="principle" label="Core takeaway">The core takeaway in one sentence.</Aside>
          <Raw title="Inline SVG written specifically for this passage">
            <svg viewBox="0 0 240 60" width="100%">
              <polyline points="0,50 40,42 80,46 120,20 160,28 200,8 240,14"
                fill="none" stroke="var(--ra-color-accent)" strokeWidth="2" />
            </svg>
          </Raw>
        </Section>
      </Article>
    </ThemeProvider>
  );
}
```
