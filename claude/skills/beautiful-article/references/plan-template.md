# plan.md Template (Single Planning File)

Phase 2 produces **only one** `plan/plan.md`, with four sections: **Brief / Outline / Theme /
Assets**. **Do not write HTML directly.** Once written, the main Agent runs 5 inline self-checks
(see "Plan self-check" in `review-checklist.md`), edits `plan/plan.md` itself based on the
conclusions, **does not spin up a SubAgent, does not write any review file**, and then proceeds to
Checkpoint 1.

> Why merge them: of the original four files (editorial-brief / outline / theme-decision /
> asset-plan), the only things actually read across later phases were "information-retention
> ratio / target language / section anchors / theme id." Once merged into one file, the main Agent
> has less to maintain, and the Section subagent only needs to open plan.md and find its own
> section under the "Outline" section.

---

## Full `plan/plan.md` Template

```markdown
# Plan

## Brief

- Target audience: <who will read this, with what question in mind>
- Target language: <follow the source language (default) / a specified language>. If specified and
  different from the source: source language <X> → target <Y>, the factual base uses the
  translated version `source/source.<lang>.md` (idiomatic, free of translationese)
- Article type: <longform / full-report / tutorial / explainer / dialogue / review / essay / interactive-explainer / briefing / visual-essay>
- Information-retention ratio: <X%> (defaults to the standard for the type: longform=100% ·
  tutorial=90% · full-report=80% · explainer=80% · dialogue=80% · review=70% · essay=70% ·
  briefing=50% · visual-essay=40% · **interactive-explainer=~25% (special case, see below)**; if
  the user deviates from the standard, write the actual value and add a line "non-standard
  combination · note," reminding the main Agent to manually adjust the prose/visual ratio when
  writing each section)
- **interactive-explainer special case**: this ratio means something different from the other
  types — it is not "75% of the original was cut," but rather "about 25% of the finished piece is
  sentences/paragraphs taken directly from the source"; the remaining 75% is guidance text, the
  interactive demonstration, "try it yourself" prompts, and comprehension checks that the AI
  creates fresh around the core concepts. This is fundamentally **content restructuring**, not
  content compression.
- Information that must be kept: <sections / tables / code / data / quotes, listed item by item;
  pointing to specific locations in source.md>
- Information that can be cut: <duplication / tangents / outdated content; each with a reason>
- Tone: <restrained analysis / narrative publishing / decision briefing / instructional>
- Key points: <the 1-3 judgments this piece should leave the reader remembering>
- Reading goal: <what the reader can do / know after finishing>
- Layout width: <narrow / regular / wide / full> (default regular, see layout.md)
- TOC: <on / off> (default on)
- Imagery strategy: <none / user-assets / placeholders / ai-generated>
- Cover: <on (default) / off>. If on, write one sentence about the composition idea + the chosen
  cover template (A left-text-right-image / B large-type-over-image / C top-text-bottom-image /
  D geometric collage / E minimal frame) + what the main visual will be (e.g., "SVG cache hit-rate
  curve" / "Bauhaus three-color blocks"). See `references/cover.md` for details. One sentence is
  enough at the Brief stage; the final visual is locked in when `article/Cover.tsx` is replaced at
  Phase 4 First Spread.

## Outline

- Hero: <headline character / subtitle / meta: date · source · author>
- Lead: <intro copy, frames the topic, 1-2 sentences>
- Summary: <whether one is needed; conclusion-first / TL;DR>

### Sections

1. <number NN> <title>
   - Information kept: <which paragraphs from source.md, and to what degree they are retained>
   - Components needed: <Section body + whether Aside/Quote/Table/CodeBlock/Formula/Image is needed>
   - Needs Raw: <yes/no; if yes, which argument it serves, what expressive purpose>
2. ...

- Closing approach: <Conclusion / action items / open-ended close>

## Theme

- Chosen theme: <tufte / press / ...>
- Rationale: <why this one, in light of the source material type / tone / imagery strategy>
- Conflicts with the source material: <if any, how to handle them; if none, write "none">
- Recommended behavior at the current information density: <how to adjust the prose / Raw / image
  ratio; may reference theme-profiles/<id>.md>

## Assets

> This section works together with "Brief / Imagery strategy." Under `none` mode, one sentence is
> enough.

- Strategy: <none / user-assets / placeholders / ai-generated>
- One-sentence explanation: <why this strategy; Raw always exists and is not discussed in this
  section>

### Per-image plan (only needed for user-assets / placeholders / ai-generated modes)

For each image, list:

- Position: <Hero background / after Section 02 / ...>
- Paragraph or argument it serves: <...>
- Purpose: <establishes mood / explains a mechanism / provides evidence / ...>
- Theme: <chosen theme>
- Style / composition: <...>
- Prohibited: <3D icon / neon gradient / SaaS stock photo / smiling office people / ...>
- Source: <user-assets file path / placeholders description / ai-generated prompt>
- Backup prompt (ai-generated mode): <...>
```

---

## Key points for using the template

- **Outline is the section anchor**: the Section subagent (under development mode B) reads this
  section to find the section it is responsible for. Each section starts with
  `<number NN> <title>`, and the number must match the final `article/sections/NN-*.tsx`.
- **"Must keep" / "can cut" are not decoration** — the **Section Reviewer checks** whether the
  information-retention ratio was actually honored.
- **The Theme section doesn't need to be long**: usually 3-5 sentences are enough. Handling
  conflicts is where this section's real value lies.
- **The Assets section is very short under `none` mode**: one sentence explaining "no external
  images are used; expression relies on prose + Raw + tables" is enough — no per-image plan needed.

## Relationship to other references

- Choosing the article type: see `article-types.md` → `article-types/<type>.md`.
- Information-retention ratio: see `information-density.md`.
- Theme selection: see `theme-selection.md`, with the conclusion landing in this template's
  **Theme** section.
- Layout width / TOC: see `layout.md`, with the conclusion landing in this template's **Brief**
  section.
- The four imagery sources / ai-generated prompt principles: see `asset-policy.md`, with the
  conclusion landing in **Assets**.
- Cover (book-cover-style title image: screen 3:4 / PDF gets the first page to itself): see
  `cover.md`, with the conclusion landing in the "Cover" line of the **Brief** section; the final
  visual is finalized when `article/Cover.tsx` is written at Phase 4 First Spread.
- Self-check checklist: see "Plan self-check (5 items)" in `review-checklist.md`.
