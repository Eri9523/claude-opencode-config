# Article Type Routing

Article type is a **structural decision**; theme is an **aesthetic decision** (see `theme-selection.md`) — the two are fully decoupled.

**The relationship between article type and information-retention ratio** (important): in theory, "content retention is an independent decision," but **in practice the two are tightly bound**. Each type comes with a default retention ratio (see the "Recommended retention" column in the table below). Combinations like `longform + 20%` / `tutorial + 20%` / `briefing + 100%` are **false options**: either the type warps into something else (briefing+100% ≈ full-report), or the content ends up hollow (a longform with 8 chapters of 2 paragraphs each). So Plan Checkpoint 1 folds the "retention ratio" into the semantic options for "article type" (see SKILL.md Phase 3), and records a non-default combination in plan.md **only when the user explicitly wants a refined cut** (e.g., "longform but only 60%" = a heavily edited longform).

After Phase 2 selects a type, read the corresponding `article-types/<type>.md` for structure / components / Raw boundaries / imagery tendencies / self-check. For a **non-default combination**, record "default X% → user override Y%" in the Brief section of `plan/plan.md`, and have the main agent manually adjust the prose/visual ratio when writing each section (it cannot simply copy the default recommendation from article-types/<type>.md).

| Type | Recommended retention | Purpose | Typical structure | Details |
|---|---|---|---|---|
| `longform` | 100% | Full-length long-form writing, archiving, deep reading | Hero / Lead / Summary / multiple Sections / Raw enhancement / Conclusion | `article-types/longform.md` |
| `full-report` | 80% | Research reports, formal analysis | Executive summary / background / evidence / data / risks / conclusion | `article-types/full-report.md` |
| `tutorial` | 80-100% | Teaching, step-by-step, onboarding | Goals / steps / examples / exercises / summary | `article-types/tutorial.md` |
| `explainer` | 80% | Explaining a technology, system, or concept | Problem / mechanism / diagram / examples / common pitfalls | `article-types/explainer.md` |
| `dialogue` | 80% | Dialogue / Q&A / interview / podcast / AMA | Hero / guest / multiple topic Sections / key-points summary | `article-types/dialogue.md` |
| `review` | 60-80% | PR / proposal / incident / design review | Background / findings / impact / recommendations / actions | `article-types/review.md` |
| `essay` | 60-80% | Opinion, commentary, narrative | Opening / argument / evidence / turn / closing | `article-types/essay.md` |
| `briefing` | 40-60% | Quick judgment for busy readers | Conclusion first / key evidence / trade-offs / next steps | `article-types/briefing.md` |
| `interactive-explainer` | ~25% (share of text excerpted from the source, **not "75% deleted"**) | **A "learn by using it" learning page carried primarily by Raw interactivity** (modeled on 3blue1brown / distill.pub / ciechanow.ski). Its essence is **content reconstruction**: only the core knowledge points are excerpted from the source, and the AI writes everything else around them from scratch | Per knowledge point: definition / interactive demo / try it yourself / verify understanding | `article-types/interactive-explainer.md` |
| `visual-essay` | 20-60% | Showcasing, dissemination, visual-and-text-led | Sparse text / large visuals / strong pacing / short chapters | `article-types/visual-essay.md` |

## Selection guidance

- Source material is information-dense and needs to be fully archived → `longform`.
- Source material is a digested report / formal analysis (the four-piece executive summary + data + risks + recommendations) → `full-report`.
- Need to clearly explain a mechanism / concept (prose-led) → `explainer`.
- **Need the reader to "play their way to understanding" a concept** (Raw interactivity leads, prose supports, each knowledge point paired with an interactive demo) → `interactive-explainer`.
- Dialogue / Q&A / interview / podcast transcript / AMA → `dialogue`.
- Reviewing an **engineering** PR / proposal / incident / design → `review`.
- Quick judgment for decision-makers → `briefing`.
- Opinion pieces / commentary / product, book, or paper reviews → `essay`.
- Teaching someone to get something done (steps + a working result) → `tutorial`.
- Dissemination / showcasing, visual-and-text-led → `visual-essay`.

Type only sets a **structural tendency** — it does not lock in information density or theme; the user can override this at the Plan Checkpoint.
