---
name: beautiful-article
description: "Edits and designs material provided by the user (web page URL / PDF / DOCX / Markdown / plain text / screenshots / pasted material) into a beautiful **single-file HTML web article** that can be opened offline and shared. Built on the reacticle component protocol: instead of hand-writing raw HTML/CSS, it uses semantic components plus a theme-constrained Raw freeform layer; it proceeds through a small harness flow of source → planning → double confirmation → generation → final review → repair, defaulting to a long-form article with 100% information retention. Trigger scenarios: turning a URL/PDF/DOCX/article into a web article / long-form piece / briefing / explainer / visual article / tutorial / review retrospective / proposal analysis, 'render this as a beautiful web article / turn this into a web article / generate a shareable long-form HTML article / reacticle article'. Only generates articles — not back-office systems, forms, dashboards, product prototypes, or general-purpose web apps."
---

# Beautiful Article

## Background Principles

The more complex the AI-generated content, the more the output medium matters. HTML's value lies in simultaneously improving information density, visual clarity, shareability, and interactivity: tables, SVG, CSS, code snippets, adjustable controls, copy and export buttons let the reader not just "finish reading" but compare, locate, adjust, review, and keep using the content. The purpose of Beautiful Article is to turn source material that would otherwise be dull, linear, and hard to digest into a single-file web article with a more beautiful visual experience, a clearer reading rhythm, and one that is easier to review and share.


## Boundaries (first decide whether to use this Skill)

- The final primary deliverable is a **single HTML article**, not a web application.
- The article can have a `Raw` freeform layer (arbitrary HTML / CSS / JS / React: interaction, layout, motion, small widgets,
  SVG/canvas diagrams as needed), but it **must serve reading, explanation, argumentation, pacing, or aesthetics**.
- It **does not** generate: back-office systems, forms, drag-and-drop workbenches, full dashboards, product prototypes, or general-purpose web apps.
- Information density is confirmed by the user; **the default is 100% information retention**, producing a long-form web article.

If what the user wants is an application rather than an article, stop and clarify — do not proceed into this Skill.

---

## Workflow Overview

```
Phase 0  Intake            Decide whether to use this Skill + preliminary article type
   ▼
Phase 1  Source → Markdown URL/PDF/DOCX/MD/text → source.md + extraction-notes.md
         └ Main Agent inline 5-item checklist self-check (escalate to a SubAgent only for complex/low-confidence sources)
   ▼
Phase 2  Editorial Planning One plan.md (four sections: Brief / Outline / Theme / Assets)
         └ Main Agent inline self-check (no SubAgent, no review file)
   ▼
Phase 3  Plan Checkpoint   ★Checkpoint 1, must stop. Confirm 5 items one by one: article type (including its default retention ratio) / theme / layout / illustration mode / cover
   ▼
Phase 4  First Spread      Hero + first section + one representative visual block (scaffold is created here)
         └ First Spread Reviewer SubAgent (writes review/first-spread-review.md)
         └ ★Checkpoint 2, must stop. Confirm 2 items one by one: acceptance conclusion / development mode A/B
   ▼
Phase 5  Full Article Build Generate the complete web article (single Agent by default; can be isolated by Section if very long)
         └ Section Reviewer SubAgent (returns pass/fail by message, no need to write a review file)
   ▼
Phase 6  Final Review      Editorial / Visual / Technical three-perspective final review (writes review/final-review.md)
   ▼
Phase 7  Repair            Minimal-slice repair; write repair-log.md only if repairs were made
   ▼
Phase 8  Delivery          ★Checkpoint 3, must stop. Confirm the delivery decision item by item → deliver article.html + a brief editorial note
```

Workspace structure (created by the scaffold; these files are the Skill's long-term memory — **do not rely solely on chat context to remember decisions**):

```text
<workspace>/
  source/   original.*  source.md  source.<lang>.md(when translation is needed)  extraction-notes.md
  plan/     plan.md                                    # Single planning file: four sections — Brief / Outline / Theme / Assets
  article/  Cover.tsx(default)  Article.tsx  sections/  raw-blocks/  assets/  article.html(deliverable)
  review/   first-spread-review.md  final-review.md   # Only these two are regular deliverables
            source-review.md(complex sources only)  repair-log.md(only when repairs were made)
  index.html  package.json  vite.config.ts  tsconfig*.json   (build tooling)
```

---

## Hard Quality-Check Protocol (applies throughout the Skill)

**The quality-check method differs by checkpoint — not every quality check requires a SubAgent, and not every quality check requires writing a file.**
Mistakenly opening a SubAgent / mistakenly writing a file is the primary performance issue; follow the table below strictly:

| Checkpoint | Quality-check method | Output | Why |
|---|---|---|---|
| **Phase 1 Source (default)** | Main Agent inline 5-item checklist | No file | The Main Agent has to read through source.md anyway |
| Phase 1 Source (complex/low-confidence sources only) | Source Reviewer SubAgent (diffs against `original.*`) | `review/source-review.md` | Silent loss can only be caught by diffing |
| **Phase 2 Plan / before Checkpoint 1** | **Main Agent inline self-check (SubAgent forbidden)** | **No file** | The plan is a text-based decision document of 200-400 lines; the context is already warm, so a cold-started SubAgent would actually be slower |
| **Phase 4 First Spread / before Checkpoint 2** | First Spread Reviewer SubAgent | `review/first-spread-review.md` | The first spread sets the tone; an extra independent set of eyes makes it more reliable |
| **Phase 5 each Section** | Section Reviewer SubAgent | **Returns pass/fail + fix points by message (no file)** | An article can have 5-15 sections; N review files would never be read again |
| **Phase 6 Final review / before Checkpoint 3** | Editorial + Visual + Technical Reviewer SubAgent | `review/final-review.md` | Part of the deliverable; worth keeping on record |

**Iron rules:**

1. **At the Plan Checkpoint (Phase 2 → Checkpoint 1), opening a SubAgent to do the quality check is strictly forbidden.** After the
   Main Agent finishes writing plan.md, it checks it **in place** against the 5-item checklist (see the Plan self-check section of
   `references/review-checklist.md`), revises `plan/plan.md` according to the findings, **does not write any review file**, and then
   proceeds to Checkpoint 1.
2. First Spread / Final review must use a SubAgent (at these two checkpoints the SubAgent's value exceeds its cost); only if a
   SubAgent environment cannot be detected should the Main Agent fall back to doing it itself, noting at the top of the file
   "No SubAgent environment; Main Agent fallback."
3. The Section Reviewer uses a SubAgent, but **the return value is a message** (pass / fail + fix points); once the Main Agent
   receives a fail item it fixes it directly — **do not have the SubAgent write a `review/section-NN-review.md` file**.
4. Whenever a quality-check conclusion comes back — **first fix the output according to the fail items, then report "done +
   self-check conclusion + what was changed."** Reporting the raw conclusion without fixing it counts as a violation.
5. **Decision-collection iron rule · Silently choosing for the user is forbidden**: at every Checkpoint (1 / 2 / 3), every decision
   item requiring user confirmation **must be listed independently and must wait for the user's reply**. The Agent **may recommend**
   ("I recommend X, because …"), but **may not** say "I've already decided X for you, let me know if that's wrong" — that amounts
   to taking away the user's chance to choose.
   - **Preferred**: if the environment has an `AskQuestion` tool, present each decision item as an independent question (one call can
     carry multiple questions), so the user can confirm each one via a choice card.
   - **Otherwise**: stop and **enumerate all the questions** in the message (each question in its own paragraph, with the
     recommended option + rationale + alternatives spelled out), state clearly "I'll wait for your reply on each item before
     continuing," and **do not proceed with any further work**.
   - **Never**: bundle multiple decisions into a single "go with all my recommendations / is everything OK?" yes/no question; and
     never default straight into the next step after a one-line recommendation.

The checklist and SubAgent prompt templates for each checkpoint are in `references/review-checklist.md`.

---

## File-Reading Guide by Phase (progressive loading — don't read everything at once)

| Phase | Must read | Consult as needed |
|---|---|---|
| Phase 0 Intake | `references/harness.md` | —— |
| Phase 1 Source→MD | `references/source-to-markdown.md` | `scripts/source-to-markdown-markitdown.py` · `scripts/source-to-markdown.py` |
| Phase 2 Planning | `references/article-types.md` · `references/information-density.md` · `references/plan-template.md` · `references/theme-selection.md` · `references/layout.md` · `references/asset-policy.md` · `references/cover.md` (cover composition ideas) | `references/article-types/<type>.md` · `theme-profiles/*.md` |
| Phase 4 First Spread / Phase 5 Build (revisit each section) | `references/section-build.md` · `references/component-policy.md` · `references/raw-policy.md` · the chosen theme's `theme-profiles/<id>.md` · **Cover: `references/cover.md`** | `references/scaffold.md` (once, when setting up the project) · `references/html-output.md` |
| Phase 6/7 Review & Repair | `references/review-checklist.md` · `references/repair-policy.md` | —— |
| Phase 8 Delivery | `references/html-output.md` | `references/pdf-output.md` (only when the user chooses PDF export) |

> **In a long session an agent easily forgets the principles** — Phase 5 involves implementing N sections repeatedly, **before
> starting each one, revisit** `component-policy.md` + `raw-policy.md` + the current theme's `theme-profiles/<id>.md`.

---

## Phase 0 —— Intake

Decide whether to use this Skill, and give a preliminary article type and output mode (single HTML by default).

| What the user gives | What to do |
|---|---|
| One or more pieces of material (URL/PDF/DOCX/MD/text/screenshot) | Proceed to Phase 1 |
| Only says "make me an article about X" with no material | **Ask back**: request material or an outline first. The Skill does not invent content for the user out of thin air |
| It's clearly an application / tool / dashboard being requested | Stop and clarify — do not use this Skill |

**Capture the target language**: right at the start, record the user's **intended final article language** (e.g. if the user
mentions "in Chinese / make an English version," etc.).

- **The user specified a language** → record it under "target language" in the Brief section of `plan/plan.md`. If it differs
  from the source material's language, Phase 1 must first produce an **idiomatic translated version** of the source, and
  subsequent work is based on that translated version (see Phase 1).
- **The user did not specify** → by default, **the final article language follows the source material's language**, and no
  translation is performed.

Self-check: does the user want an **article** or a **web application**? Is complete information required? Should more material be
requested first?
**Did the user specify a final language? Does it match the source language?**

---

## Phase 1 —— Source → Markdown

Normalize any input into `source/source.md`, and record uncertain items in `source/extraction-notes.md`.
Rules and per-input-type handling are in `references/source-to-markdown.md`; PDF/DOCX/HTML extraction can use the MarkItDown main
path or a lightweight fallback script.

Once written to disk, the **Main Agent runs an inline self-check** (the 5-item checklist in `references/source-to-markdown.md`),
fixes issues according to the findings, and then proceeds to Phase 2; **only when `extraction-notes.md` flags a low-confidence /
complex source** is this escalated to an independent Source Reviewer SubAgent that performs a diff-style check against
`original.*` (writing `review/source-review.md`).

**Language handling (immediately after extraction)**: determine the language of `source.md`.

- The user **did not specify** a target language, or the target language **matches the source** → no translation; subsequent
  work is based directly on `source.md`, and the final article language = the source language.
- The user **specified** a target language that **differs from the source** → first produce an **idiomatic translated version**
  `source/source.<lang>.md` (e.g. `source.zh.md` / `source.en.md`) as the **factual foundation** for Phase 2 onward; the original
  `source.md` is kept for reference. Translation requirements: **use idiomatic target-language prose, free of translationese**
  (restructure sentences to match the target language's natural phrasing, not word-for-word literal translation, with no stiff
  foreign word order / stacked passive voice / foreign-style punctuation); terminology / numbers / code / formulas / citations
  must stay accurate, and the structure and information-retention ratio must remain unchanged. Note the translation in
  `extraction-notes.md`.

---

## Phase 2 —— Editorial Planning

Form the editorial plan — **do not write HTML directly**. **Produce only a single `plan/plan.md`** (four sections: Brief /
Outline / Theme / Assets); template in `references/plan-template.md`:

- **Brief**: target reader / article type / information-retention ratio / must-keep / can-cut / tone / key points / reading
  goal / target language / layout width / TOC / illustration strategy.
- **Outline**: Hero / Lead / Summary / section list / which information each section retains / whether each section needs
  Raw · Table · CodeBlock · Formula · Image / how it ends.
- **Theme**: the chosen theme + rationale + note on any conflicts (see `references/theme-selection.md`).
- **Assets**: illustration strategy and an image-by-image plan (see `references/asset-policy.md`; in `none` mode this section
  only needs one sentence).

Article-type routing is in `references/article-types.md`; information density and its relationship to component ratio is in
`references/information-density.md`.

**Self-check method · strong constraint**: after `plan/plan.md` is written, the **Main Agent checks it inline** against the
5-item Plan self-check list (see the Plan self-check section of `references/review-checklist.md`), revises `plan/plan.md`
according to the findings, and **proceeds directly to Checkpoint 1 — opening a SubAgent is forbidden, and writing
`review/plan-review.md` is forbidden**.

---

## Phase 3 —— Plan Checkpoint (★ hard checkpoint · Checkpoint 1, must stop)

**Iron rule: silently choosing for the user is forbidden. Every decision item must be listed independently, and each must
independently wait for the user's reply.**

You may recommend ("I recommend X, because …"), but you **may not** say "I've already decided X for you, let me know if that's
wrong" — the latter smuggles in a default and takes away the chance to choose.

**Collection method (pick one based on the environment):**

- **Prefer the `AskQuestion` tool**: pass each item in as an independent question (one call can carry multiple questions), and
  the user confirms each one via a choice card.
- **No `AskQuestion` tool**: stop and, in the message, **enumerate each question, one per paragraph, spelling out the
  recommended option + rationale + alternatives**, state clearly "I'll wait for your reply on each item before continuing," and
  **do not proceed with any further work**.

Either way: every **independent decision** corresponds to **one independent question** — **do not bundle them into an "is
everything OK?" yes/no**.

**5 items that must be confirmed independently** (none may be skipped):

| # | Decision item | Options (semantic labels · including default retention ratio) | Notes |
|---|---|---|---|
| 1 | **Article type** (information-retention ratio bundled in) | Complete long-form / archival `longform · ~100%` ／ research report / formal analysis `full-report · ~80%` ／ teaching steps / getting-started guide `tutorial · ~90%` ／ concept / systems explainer `explainer · ~80%` ／ conversation / interview / podcast `dialogue · ~80%` ／ PR / proposal / incident review `review · ~70%` ／ opinion / commentary / narrative `essay · ~70%` ／ interactive learning / play with a concept `interactive-explainer · ~25% source excerpts + 75% AI restructuring` ／ decision summary / for busy readers `briefing · ~50%` ／ image-led / promotional showcase `visual-essay · ~40%` | The AI recommends one and gives a one-line rationale. **The ratio is already bundled into the type option** and is not a separate question (otherwise a bogus combination like `longform + 20%` could arise). If the user wants to deviate from the default, they override it with one sentence of free text ("I want longform + 60%") — see "How to deviate from the default" below |
| 2 | **Theme** | tufte / press / other registered themes (read `theme-profiles/index.json`) | The AI recommends one and gives a one-line rationale |
| 3 | **Layout width** | narrow / regular / wide / full | The AI recommends one; default is `regular` |
| 4 | **Illustration mode** (required · "pass by default" not allowed) | none / user-assets / placeholders / ai-generated | One line: "this only decides whether to use the external `Image`; `Raw` is unaffected" |
| 5 | **Cover** (a 3:4 book-cover-style title image, sitting above the TOC + body) | On (default) / Off | The AI recommends "On" and gives a one-line composition idea (which primary visual + which cover template A/B/C/D/E to use). `briefing` / `dialogue` can recommend "Off." See `references/cover.md` for details |

**TOC is on by default**: since it's a single toggle and nearly every article should have it on, it can be mentioned in one
line in the Plan Checkpoint's opening statement — "TOC is on by default, tell me if you want it off" — **it does not need to be
a separate question**.

**Items that already use a default value and do not need to be asked separately** (still must be stated explicitly in the
opening message as "let me know if you want to change this," giving the user a chance to reconsider — they cannot be hidden
entirely):

- Final article language: follows the source language (unless the user already specified it earlier / translation is already
  done).
- Whether editorial cutting, restructuring, and tone rewriting is allowed: allowed by default (executed per the
  information-retention ratio above).
- Whether to preview the first-spread sample first: done by default (this is Phase 4).
- TOC: on by default.

If the user says "you decide" for the theme → take your top recommendation, but **still list it alongside the other candidates
in the options**, marked "default · AI recommended," leaving room to reconsider — the theme question cannot simply be skipped.

**How to deviate from the "default" information-retention ratio**: every article type comes with its own recommended retention
ratio (see the table above). In the vast majority of cases the default is fine. If the user wants finer control (e.g.
"longform but only 60%" → a long-form piece that has been heavily edited), have the user **write one line of free text after
the opening statement**: "I want <type> + <X%>" to override it. Once the AI receives the override, it must record "type /
default retention / user override to X%" together in the Brief section of `plan/plan.md`, and remind the user that this is a
"non-default combination" — such combinations require the Main Agent to manually adjust the body-text/visual ratio when
writing each section.

**Plan Checkpoint opening-message template (send a short statement before collecting decisions):**

```
plan/plan.md has been written (self-check passed). I'll confirm 5 things with you one by one: article type / theme / layout width /
illustration mode / cover.

My recommendations are listed here for reference (I won't choose for you):
- Type: <X> (includes default information retention <Y%>. Rationale: …)
- Theme: <theme> (Rationale: …)
- Layout width: <width> (Rationale: …)
- Illustration mode: <strategy> (Rationale: …)
- Cover: On / Off (Rationale: …; if On, composition idea: …)

Defaults you can override: language follows the source language; editorial cutting/restructuring is allowed; TOC is on; a first-spread sample will be made first next.
If the information-retention ratio should deviate from the type default, just tell me the specific percentage after answering below (e.g. "longform but only 60%").

Please confirm each item below.
```

After sending the statement above, **immediately** pass 5 questions via AskQuestion (or, in an environment without the tool,
enumerate the 5 questions and stop to wait for a reply). **Only once all 5 items have received replies can Phase 4 begin**; if
the user gave a "non-default retention ratio" in free text, confirm the AI has recorded it in `plan/plan.md` before proceeding
to Phase 4.

---

## Phase 4 —— First Spread (the article equivalent of "first-chapter sign-off")

First produce "cover (if on) + first spread + first section + one representative visual block." **The scaffold creates the
workspace here**:

```bash
# Cover on by default
bash <path-to-beautiful-article>/scripts/scaffold.sh ./my-article --theme=<id>
# Checkpoint 1: the user chose "cover · off"
bash <path-to-beautiful-article>/scripts/scaffold.sh ./my-article --theme=<id> --no-cover
bash <path-to-beautiful-article>/scripts/scaffold.sh --list-themes
```

It creates a Vite + React + TS workspace (installing the latest published version of `reacticle` from npm) + the `source/ plan/
review/` memory directories + the assembler `article/Article.tsx` + one sample section component
(+ `article/Cover.tsx` by default, unless `--no-cover`). Details in `references/scaffold.md`.

The first spread (Hero / Lead) is written into the assembler `article/Article.tsx`; **the first Section must be written as an
independent component** `article/sections/01-*.tsx` (this is the code anchor for later parallelization, see
`references/section-build.md`).
**The cover** (if on) replaces `<CoverPlaceholder />` in `article/Cover.tsx` with an image-and-text composition customized to
the theme + the article's central idea; **do not touch the shell** (the 3:4 container + print pagination). Cover design
guidance is in `references/cover.md`.
Preview with `npm run dev`. It determines whether the title's character / font size / content density / Raw style /
illustration approach / theme are appropriate.

**Once the first Section is finished, create a First Spread Reviewer SubAgent per the hard quality-check protocol**, which
writes `review/first-spread-review.md` (**including the cover's 5-item self-check**, see `references/cover.md`); fix the
issues and then proceed to Checkpoint 2.

---

## Checkpoint 2 · First Spread (★ hard checkpoint, must stop)

Have the user sign off on the first spread + first Section, **and choose the subsequent development mode**. The same
decision-collection iron rule from Checkpoint 1 applies: **two items confirmed independently, bundling forbidden; prefer
AskQuestion, otherwise enumerate the questions and stop to wait for a reply**.

First send a short message:

```
The first spread + first Section are done; preview at localhost with npm run dev.
Quality-check findings are in review/first-spread-review.md (fail items have been fixed; it lists what was changed).
Please confirm the following two things independently: 1) acceptance conclusion 2) subsequent development mode.
```

Then pass **two independent questions** via AskQuestion (or enumerate the two questions and stop to wait for a reply):

1. **Acceptance conclusion** — options: `Approved · proceed to full generation` / `Partial changes · I'll follow up separately
   with what to change` / `Theme or layout doesn't work · back to Checkpoint 1`.
2. **Subsequent development mode** — options: `A · single Agent, sequential (default · most stable · most consistent style)` /
   `B · multiple Agents in parallel (fastest · slight style variation)`.

**Do not bundle these two into "Approved + A, OK?"** — the user might "approve but want B," or vice versa.
Proceed to Phase 5 only after both questions have received replies.

---

## Phase 5 —— Full Article Build

Generate the complete article using the development mode chosen at Checkpoint 2. Details in `references/section-build.md` +
`references/component-policy.md` + `references/raw-policy.md`.

**Iron rule · every Section must be its own component file** (`article/sections/NN-*.tsx`); **writing multiple Sections
directly into one component is strictly forbidden**. `article/Article.tsx` is only the **assembler**: it imports and orders
the Sections, and is **owned by the Main Agent**. Large Raw blocks are likewise isolated into `article/raw-blocks/NN-*.tsx`.
File-level isolation is the precondition for multi-Agent parallelism.

Development mode (chosen at Checkpoint 2):

- **A · single Agent, sequential (default)**: the Main Agent writes each `sections/NN-*.tsx` in sequence — most stable, most
  consistent style.
- **B · multiple Agents in parallel**: subagents each **own one** `sections/NN-*.tsx` file and develop in parallel; **the Main
  Agent is responsible for merging and stability** — maintaining the import list and order in `Article.tsx`, running
  `npm run typecheck` / `build`, backstopping theme and style consistency, and resolving conflicts. The subagent prompt
  template is in `references/section-build.md`.

Other principles: body text is the main substance; all Raw uses `--ra-*` theme tokens, wild/ad-hoc styling is forbidden; at
100% information retention, long-form structure is primary with Raw / illustration as enhancement; lower information density
can raise the proportion of visual blocks, but it must still take **article form**.

After each Section is finished, it **must** go through the **Section Reviewer SubAgent** per the hard quality-check protocol:
whether it completes the outline's task / whether it matches the information-retention ratio / whether it flows with what
comes before and after / whether it is over-componentized / whether it has enough body text / whether the Raw and
illustrations have a clear purpose / whether this section's numbering is self-consistent.

**The SubAgent returns pass/fail + fix points by message** (a one-line OK for pass; a list of fix points for fail), **do not
write a `review/section-NN-review.md` file**. Once the Main Agent receives the fail items, it **directly fixes the
corresponding section file**, and only then reports the section as delivered.

---

## Phase 6 —— Final Review (three-perspective final review)

Sign off from three perspectives — reader / theme / technical — producing `review/final-review.md` + a list of fixes.
The complete hard checklist is in `references/review-checklist.md`. Three Reviewers are recommended (at least one independent
SubAgent when there are no Teams):

1. **Editorial Reviewer**: article quality, information trade-offs, structure.
2. **Visual Reviewer**: theme, Raw, illustrations, mobile.
3. **Technical Reviewer**: build, console, code / formulas, accessibility.

Core red lines: it is still an article (not an application) · the information-retention ratio matches the Plan · information
marked must-keep has not been lost · the theme's character is consistent · Raw has no wild/ad-hoc styling · there is no
obvious "AI smell" · it is readable on both desktop and mobile · the HTML builds, opens, and can be shared.

---

## Phase 7 —— Repair (minimal slice)

Repair at the smallest possible unit; rules are in `references/repair-policy.md`. **Forbidden**: rewriting the entire article
over one piece of feedback / changing an already-confirmed article structure to fix a visual issue / cutting content the user
designated as must-keep in order to compress information. **Write `review/repair-log.md` only when repairs were made** (skip
it if there were no repairs / it passed on the first try).

---

## Checkpoint 3 · Final (★ delivery confirmation)

After the final-review fixes are done, **stop** and have the user independently confirm the delivery decision (do not skip
straight past it with "I'm about to export the HTML, let me know if there's a problem"). Prefer AskQuestion; without the
tool, enumerate the question in the message and stop to wait for a reply.

- **Delivery decision** — options: `Approved · export HTML deliverable` / `Approved · also export HTML + PDF` /
  `Still some partial fixes needed · I'll list exactly what to fix` / `Hold on · I want to take another look`.

There is only this one decision, but it **still requires proactively stopping to ask** — do not silently default to exporting
HTML.

---

## Phase 8 —— Delivery

Build and deliver (commands in `references/html-output.md`):

- `article/article.html` (a self-contained single page, CSS + JS inlined, can be opened offline) — **the primary deliverable**.
- **Optional** `article/article.pdf`: generated only when the user chose "Approved · also export HTML + PDF" at Checkpoint 3.
  Command:
  ```bash
  bash <path-to-beautiful-article>/scripts/html-to-pdf.sh
  ```
  The script detects a chromium-family browser installed on the system, injects `@media print` overrides (the TOC collapses
  from a left-right grid into a stacked top-bottom layout, and the TOC has the first page to itself), and prints headlessly.
  Zero npm dependencies. Detailed mechanics / troubleshooting in `references/pdf-output.md`.
- A brief editorial note: article type / information-retention ratio / theme / illustration strategy / main editorial
  trade-offs.

---

## Default Policies

- Output single HTML; article type `longform`; 100% information retention.
- Language: if the user **did not specify** one, **follow the source material's language**; if **specified and different
  from the source**, first produce an idiomatic translated version `source/source.<lang>.md` and write based on that
  (removing translationese, see Phase 1).
- Theme: `tufte` for technical / evidence-first material, `press` for narrative / commentary-first material (recommend based
  on the source material).
- Layout: width defaults to `regular`, **TOC is on by default** (decoupled from the theme, see `references/layout.md`; both
  are confirmed at a Checkpoint).
- Illustrations: **illustration mode is a required item at Checkpoint 1** (`none` / `user-assets` / `placeholders` /
  `ai-generated`); it only decides whether the external `Image` is used, and **AI images are never generated proactively**.
- Raw: **orthogonal to illustrations, always present by default**; using it generously is encouraged, but it must serve a
  specific passage and use theme tokens. Choosing `none` does not affect Raw.
- Self-checks: **Plan uses an inline self-check (no SubAgent, no file)**; **First Spread and Final use a SubAgent + write a
  file**; **Section uses a SubAgent + returns by message (no file)**. See the "Hard Quality-Check Protocol" section for
  details.
- Decision collection: at Checkpoint 1 / 2 / 3, **confirm each item independently · silently choosing for the user is
  forbidden**. Recommending is fine, skipping is not. Prefer the `AskQuestion` tool (one independent question per item);
  without the tool, stop and enumerate the questions, waiting for the user's reply.
- Repair: minimal slice; write `review/repair-log.md` only when repairs were made.
- **Colophon · cannot be removed**: the scaffold ships with a colophon Raw block at the end of `article/Article.tsx`
  (`Made with [beautiful-article](github repo) · <theme> theme`, small low-contrast text, adapting to theme tokens).
  **Every article must keep it** — deleting it, or moving it next to the Hero or floating it into a corner, is forbidden.
  When switching themes, update both the theme name in the colophon and the `<ThemeProvider theme="...">` in `main.tsx`
  together.
- **Cover · on by default · must combine image and text**: by default the scaffold creates, in `article/Cover.tsx`, a
  book-cover-style title-image shell + placeholder with a **3:4 screen ratio + a page to itself in the PDF** (`--no-cover`
  turns it off). The cover sits above the TOC + Hero + body, standing on its own. During Phase 4 First Spread, the Main
  Agent replaces `<CoverPlaceholder />` with an image + type composition customized to the **theme + the article's central
  idea**. **Hard constraints**: the shell's proportions / print pagination must not be altered, it must have both a visual
  element and text, only `--ra-*` tokens are used, no remote images, and no repeating the Hero's content. **Visual technique
  is fully open**: SVG / CSS / Canvas / complex React components / any combination is up to the Agent, as long as the result
  looks good. Details in `references/cover.md` (including a 5-item self-check + 5 composition templates + a starting point
  for each theme's cover). PDF export automatically gives the cover a page to itself, with the TOC starting from the second
  page.
- **PDF export · optional**: the primary deliverable is always `article/article.html`. **Only when** the user chooses
  "Approved · also export HTML + PDF" at Checkpoint 3 does it run `bash <skill>/scripts/html-to-pdf.sh` to generate
  `article/article.pdf`; if not chosen, leave it alone. Do not export it by default on the user's behalf. Details in
  `references/pdf-output.md`.

---

## Success Criteria

- It is **first and foremost an article**.
- The final article language matches the user's intent (unspecified = follows the source language; specified = the entire
  text uses the target language consistently, idiomatic, free of translationese, with no leftover fragments of the source
  language).
- The information density confirmed by the user is respected; no key content from the source material is lost
  unintentionally.
- The theme's character is consistent; illustrations and Raw both serve reading.
- The page is more worth reading than the Markdown; the HTML can be opened and shared directly.
- At 40% information, it reads like an edited article, not a shrunken summary; at 100% information, it reads like a polished
  long-form piece, not a direct transcription of the original.

---

## Related Resources (labeled by "when to read")

| File | When to read | Contents |
|---|---|---|
| `references/harness.md` | Phase 0 | The Skill's harness perspective, the six questions, state-file conventions |
| `references/source-to-markdown.md` | Phase 1 | Rules for → source.md by input type, extraction self-check, script usage |
| `references/article-types.md` | Phase 2 | Overview of article-type routing (with per-type links) |
| `references/article-types/<type>.md` | Phase 2, after choosing a type | Single type's structure / components / Raw boundaries / illustration tendencies / self-check |
| `references/information-density.md` | Phase 2 | Information density levels and their relationship to component/visual ratio |
| `references/plan-template.md` | Phase 2 | The single `plan/plan.md` template (four sections: Brief / Outline / Theme / Assets) and how to write it |
| `references/theme-selection.md` | Phase 2 | Theme selection, decoupling density from theme, constraints for adding new themes |
| `references/layout.md` | Phase 2 / Checkpoint | Layout: width modes (decoupled from theme) + TOC, confirmation and usage |
| `references/asset-policy.md` | Phase 2 | The four illustration sources, AI illustration prompt principles, image self-check |
| `references/cover.md` | Phase 2 / when writing the cover in Phase 4 | Book-cover-style cover design guide (3:4 on screen / a page to itself in PDF): hard constraints, fully open visual technique, composition templates, per-theme cover starting points, 5-item self-check |
| `references/section-build.md` | Phase 4/5 | The one-section-one-file iron rule, single/multi-Agent modes, parallel subagent prompts, Main Agent merging |
| `references/component-policy.md` | Phase 4/5, each section | The reacticle component protocol, prose-first, information density vs. component ratio |
| `references/raw-policy.md` | Phase 4/5, each section | Raw allowed/forbidden uses, token-driven, Raw self-check |
| `references/html-output.md` | Build / delivery time | dev / build / single-file HTML commands and output |
| `references/pdf-output.md` | Phase 8 Delivery, when the user chooses PDF export | `html-to-pdf.sh` usage, TOC layout mechanics, how Raw renders in PDF, troubleshooting |
| `references/review-checklist.md` | Phase 6 | Reviewer checklists and prompt templates for each phase |
| `references/repair-policy.md` | Phase 7 | Minimal-slice repair reference table |
| `references/scaffold.md` | Phase 4, when setting up the project | What the scaffold does, usage, workspace structure, switching themes |
| `theme-profiles/index.json` + `*.md` | Phase 2 choosing a theme / Phase 5 writing | Theme authoring profiles (for the AI to read, not CSS) |
| `scripts/scaffold.sh` | Phase 4, run once | One-command creation of the article workspace |
| `scripts/html-to-pdf.sh` | Phase 8 Delivery, only when the user chooses PDF | HTML → PDF (headless browser + injected print CSS, zero npm dependencies) |
| `scripts/pdf-print-overrides.css` | When changing PDF styling | The `@media print` overrides `html-to-pdf.sh` injects into `<head>`: A) TOC collapses into a stacked top-bottom layout; B) pagination behavior (undoing `.ra-section` atomicity, orphan-free headings, widow control, etc.); C) cover has a page to itself |
| `scripts/source-to-markdown-markitdown.py` | Phase 1 | The MarkItDown main path, suited to complex PDF / DOCX / HTML |
| `scripts/source-to-markdown.py` | Phase 1 | Lightweight fallback, suited to Markdown / TXT / simple HTML, or when MarkItDown is unavailable |
