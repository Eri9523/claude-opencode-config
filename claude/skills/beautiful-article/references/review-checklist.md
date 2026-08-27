# Review Checklist and Reviewers

> The core purpose of this file: **make each node do the right thing in the right way** —
> don't spin up the wrong SubAgent, don't write the wrong file. Spinning up a SubAgent at the
> wrong time / writing the wrong review file is the primary performance issue. See the "Hard
> Quality-Gate Protocol" section of SKILL.md for the complete rules.

## Quality-gate method per stage (hard rule)

| Stage | Quality-gate method | Artifact |
|---|---|---|
| **Phase 1 Source (default)** | Main Agent inline 5-item checklist (see `source-to-markdown.md`) | No file |
| Phase 1 Source (complex/low-confidence source only) | Source Reviewer SubAgent (diffs against `original.*`) | `review/source-review.md` |
| **Phase 2 Plan / before Checkpoint 1** | **Main Agent inline self-check (spinning up a SubAgent is forbidden)** | **No file** |
| **Phase 4 First Spread / before Checkpoint 2** | First Spread Reviewer SubAgent | `review/first-spread-review.md` |
| **Phase 5 each Section** | Section Reviewer SubAgent | **Returns pass/fail + fixes as a message, writes no file** |
| **Phase 6 final review / before Checkpoint 3** | Editorial + Visual + Technical Reviewer SubAgent | `review/final-review.md` |

Once you have the conclusions, **fix the failing items first, then report to the user**. Reporting
the conclusions to the user without fixing them first is a violation.

---

## Plan self-check (Phase 2 → Checkpoint 1 · Main Agent inline · 5 items)

After writing `plan/plan.md`, check these 5 items **on the spot**, and edit `plan/plan.md` itself
based on the conclusions (do not write a new file):

1. **Brief / Outline are self-consistent**: the information-retention ratio adds up against each
   section's "information kept"; the Outline doesn't sneak in content the Brief never promised,
   and doesn't omit anything the Brief requires to be kept.
2. **Information choices are justified**: every "can cut" item has a stated reason
   (duplication / tangent / outdated); every "must keep" item points to a specific paragraph /
   table / code block in source.md.
3. **No over-componentization**: each section's "components needed" doesn't frame all its content
   as Aside / Quote / Table; prose is still the main body (prose-first, see `component-policy.md`).
4. **Raw / images have a purpose**: for every position in the Outline marked "needs Raw" or "needs
   Image," the argument / expressive purpose it serves can be stated in one sentence — it's not
   decoration.
5. **Section numbering is sound**: Outline sections are consecutive and monotonic (01 / 02 / 03 …),
   and subsection number prefixes align with their parent section (under Section 08, only 8.1 /
   8.2 are allowed — never 5.1).

> This step **must never spin up a SubAgent**: the content volume is small and the context is
> already warm — a cold-started SubAgent would be slower.

---

## First Spread Self-Check Checklist (Phase 4 → before Checkpoint 2 · SubAgent)

The SubAgent reads `article/Article.tsx`, `article/sections/01-*.tsx`, `article/Cover.tsx` (if
present), `plan/plan.md`, and the chosen theme's `theme-profiles/<id>.md`, checks against the
checklist, and writes `review/first-spread-review.md`:

- **Cover** (if enabled — see the 5-item self-check in `cover.md`): are text and imagery well
  paired, is the theme faithfully followed (only `--ra-*` tokens used), is the content faithful
  (does the cover's visual match the article's core thesis), does the aspect ratio adapt correctly
  (both the screen 3:4 and the PDF-gets-its-own-first-page work without misalignment), and does it
  avoid duplicating the Hero's content?
- Does the first screen read as an article, not a landing page? Does the reader immediately know
  what problem the article addresses?
- Does the first section have reading rhythm? Does Raw serve comprehension? Do images serve the
  expression? Is it readable on mobile?
- Is the theme's character right? Is the layout width appropriate?
- Does the code build (`npm run dev` with no errors), and is the browser console free of errors?

Prompt template:

```text
Act as the First Spread Reviewer. Read article/Cover.tsx (if present), article/Article.tsx,
article/sections/01-*.tsx, plan/plan.md, theme-profiles/<id>.md, references/cover.md
(if there's a cover), and check item by item against the First Spread self-check checklist.
Write the conclusions into review/first-spread-review.md (pass / fail + evidence + required
fixes + rewrite suggestions). Do not fix the files for me, and do not offer generic praise.
```

After the main Agent receives the conclusions, **fix the failing items first**, then proceed to
Checkpoint 2.

---

## Section Self-Check Checklist (Phase 5, each Section · SubAgent · returned as a message)

The SubAgent reads the corresponding `sections/<NN>-*.tsx`, the relevant paragraph of
`plan/plan.md`, and the corresponding content in `source/source.md`, checks against the checklist,
and **returns the conclusion as a message**:

- Does it complete this section's outline task?
- Does it comply with the Brief's information-retention ratio? Is nothing that must be kept lost?
- Does it connect with the sections before and after it? No duplication or contradiction?
- No over-componentization? Is the prose substantial enough?
- Do Raw and imagery have a clear purpose?
- **This section's numbering is self-consistent**: the `Section index` equals the `<NN>` assigned
  by the main Agent; every `Subsection` number prefix equals `<NN>` (e.g., if `<NN>=08`, the
  subsections are 8.1 / 8.2 — **not** 5.1).

Prompt template:

```text
Act as the Section Reviewer. Read article/sections/<NN>-*.tsx, this section's paragraph in
plan/plan.md, the corresponding content in source/source.md, and theme-profiles/<id>.md.
Check item by item against the Section self-check checklist, and **return the result directly
as a message**:
- First line: pass / fail
- If fail: list the fixes needed (with line numbers / code snippets as evidence)
Do not write any review file. Do not fix the files for me. Do not offer generic praise.
```

After the main Agent receives the failing items, **fix the corresponding section file directly**,
then report the section as delivered.

---

## Phase 6 Final Review, Three Perspectives (SubAgent · writes `review/final-review.md`)

**Editorial Reviewer** (article quality, information choices, structure)

- It is still an article, not a web application.
- The information-retention ratio matches the Brief; nothing required is lost.
- The language matches the Brief: the whole piece is consistently in the target language,
  idiomatic, free of translationese, with no leftover fragments of the source language (captions /
  quotes / terminology count too).
- No hollow headings, card-stacking, or over-summarizing.

**Visual Reviewer** (theme, Raw, imagery, mobile)

- The theme's character is consistent; Raw has no wild styling (everything uses `--ra-*` tokens).
- Images match the theme and context, don't upstage the prose, and don't duplicate Raw.
- No obvious AI feel: decorative visuals, purple-pink gradients, rounded colorful cards, fake
  illustrations, emoji decoration.
- Readable on both desktop and mobile, with no text overflow / clipping / abnormal blank space.

**Technical Reviewer** (build, console, code / formulas, accessibility, numbering)

- `npm run html` builds successfully, and `article/article.html` opens and is shareable.
- No browser console errors; code / formula highlighting matches the theme.
- Images have alt text, links work, heading hierarchy is sound.
- **Section numbering is self-consistent across the whole piece** (`index` is a hand-written
  string; the component doesn't auto-number or validate it):
  - `Section` numbers are consecutive and monotonic: `01 / 02 / 03 …`, no skips, no duplicates, no
    out-of-order numbers.
  - Every `Subsection` number's prefix equals its parent `Section` number: under Section 08 it's
    `8.1 / 8.2` — `5.1` must **never** appear.
  - The numbering, the TOC on the left, and the `plan/plan.md` Outline section order all agree.
  - Copy down the rendered numbers (or the ones in the TOC) section by section and subsection by
    subsection and compare them — **don't just check code order** — under the parallel mode
    (development mode B), the subagent can't see its own position in the whole piece, which is
    exactly where numbering mistakes happen most easily.

Prompt template:

```text
Act as the <Editorial / Visual / Technical> Reviewer. Read plan/plan.md, source/source.md,
article/Article.tsx and all article/sections/*.tsx, theme-profiles/<id>.md.
Check item by item against this perspective's final-review checklist, and append the
conclusions to the "<perspective>" section of review/final-review.md
(pass / fail + evidence + required fixes + rewrite suggestions).
Do not fix the files for me, do not offer generic praise.
```

All three perspectives' SubAgents can be started in parallel; once the main Agent has collected all
of them, it repairs the failing items at the minimal slice (see `repair-policy.md`).
