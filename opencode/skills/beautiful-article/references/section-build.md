# Section Building and Multi-Agent Parallelism

## Hard rule: one Section = one component file

Every Section **must** be its own component file; it is **strictly forbidden** to write multiple
Sections directly into one component.

```text
article/
  Article.tsx          # assembler (owned by the main Agent): imports + orders each Section
  sections/
    01-opening.tsx     # export function SectionOpening() { return <Section .../> }
    02-context.tsx
    03-mechanism.tsx
  raw-blocks/
    01-token-flow.tsx  # large / reused Raw blocks isolated here, imported by the corresponding section
```

- Each `sections/NN-*.tsx` exports one component, internally using
  `<Section index="NN" title="...">…</Section>`.
- `Article.tsx` only does assembly:
  ```tsx
  import { Article, Hero, Lead, Conclusion } from "reacticle";
  import { SectionOpening } from "./sections/01-opening";
  import { SectionContext } from "./sections/02-context";
  export function ArticleDoc() {
    return (
      <Article toc width="regular">
        <Hero ... /><Lead>…</Lead>
        <SectionOpening />
        <SectionContext />
        <Conclusion>…</Conclusion>
      </Article>
    );
  }
  ```
- File-level isolation + reacticle having no bare CSS (styling always goes through theme tokens) →
  multiple Agents editing different section files **won't clobber each other**.

## Section numbering is assigned centrally by the main Agent (to avoid numbering chaos)

`Section` / `Subsection`'s `index` is a **hand-written string** — the component neither
auto-numbers nor validates it, it just displays it verbatim. So if any section file gets its
numbering wrong (typically: in parallel mode, a subagent can't see its own position in the whole
piece, and invents something like "hang a 5.1 under Chapter 8"), that error carries straight through
into the final product. The rules:

- **Global numbering belongs to the main Agent (the assembler).** After the main Agent settles the
  final order in `Article.tsx`, it calibrates each `Section`'s `index` to `01 / 02 / 03 …` based on
  that order, and aligns each `Subsection`'s number prefix to its owning `Section` (under Section
  08, only `8.1 / 8.2 …` are allowed).
- **Subagents do not invent global numbering themselves.** When the main Agent assigns work, it
  tells the subagent directly "you are Chapter `<NN>`"; the subagent uses that `<NN>` to write the
  `Section index` and this section's `Subsection` prefixes; if unsure, it keeps the placeholder
  given by the outline, and the main Agent does a unified pass at the end.
- **Validate after assembly**: check the numbering against the TOC display and the `outline.md`
  order, confirming the numbers are consecutive and monotonic and the subsection prefixes are
  correct (folded into the final review's Technical Reviewer checklist item, "section numbering
  self-consistent across the whole piece").

## Two development modes (chosen by the user at Checkpoint 2)

Regardless of mode, the first Section is always completed and accepted by the **main Agent** first
(the style anchor). The difference starts from the 2nd Section onward:

### A · Single-Agent sequential (default, most stable)

The main Agent writes `02 → 03 → …` in sequence, giving the most consistent style, and can be
accepted at any point.

### B · Multi-Agent parallel (fastest)

Subagents each **own one** `sections/NN-*.tsx` and develop in parallel. **The main Agent is
responsible for merging and stability**:

- Maintains the import and Section order in `Article.tsx` (the single point of assembly, avoiding
  conflicts), and based on the final order, **uniformly calibrates each Section's `index` and each
  Subsection's number prefix** (see "Section numbering is assigned centrally by the main Agent"
  above).
- Runs `npm run typecheck` + `npm run build` after each parallel round, fixing build errors.
- Backstops theme and style consistency (color / font / spacing go through tokens, character
  doesn't drift).
- Resolves duplication / transition issues (whether adjacent sections' arguments connect
  properly).

Style will vary slightly under parallelism (this is expected; theme tokens backstop visual
consistency).

### The parallel subagent's prompt must include

```text
You own the file article/sections/<NN>-<id>.tsx, and you only touch this one file, exporting
one Section component.
You are Chapter <NN> of the whole piece (this number is assigned by the main Agent — you cannot
see your own position in the whole piece, so do not invent your own numbering).
Read: the Outline section's paragraph for this section in plan/plan.md + the Brief section
(information-retention ratio) + the corresponding content in source/source.md + the chosen
theme's theme-profiles/<id>.md + references/component-policy.md + references/raw-policy.md +
the first section file as a "code style" reference (not something to copy).
Hard rules:
- One file = one Section component; do not touch Article.tsx or any other section file.
- Prose is the main body, components as needed (core components preferred by default), Raw
  hand-written on the spot using --ra-* tokens.
- Comply with this section's outline task and information-retention ratio; connect with the
  sections before and after it.
- Numbering: <Section index="<NN>">; every <Subsection> in this section must have a number
  prefix equal to <NN> (e.g., if <NN>=08 then the subsections are 8.1 / 8.2 …) — do not copy
  numbering from another chapter.
- Self-check on completion against the Section checklist in references/review-checklist.md.
Do not modify Article.tsx (the main Agent handles unified assembly and number calibration), do
not change the theme.
```

## Each Section, on completion (must go through the quality gate · SubAgent · returned as a message)

Per the hard quality-gate protocol, create a **Section Reviewer** SubAgent, checking against the
checklist: completes the outline task / complies with the information-retention ratio / connects
with adjacent sections / not over-componentized / prose is substantial / Raw and imagery have a
clear purpose / **this section's numbering is self-consistent** (`Section index` equals `<NN>`,
each `Subsection` number prefix equals `<NN>`).

**The SubAgent returns pass/fail + fixes needed as a message** (pass: one line "OK"; fail: list the
fixes needed), **it must not write a `review/section-NN-review.md` file**. After the main Agent
receives the failing items, it fixes the corresponding section file directly, then reports the
section as delivered. See the Section section of `references/review-checklist.md` for the full
prompt template.
