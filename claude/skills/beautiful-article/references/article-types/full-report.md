# Article Type · full-report

Research reports, formal analyses, technical assessments, annual reviews, survey reports. The source material has the "executive summary + key findings + data + risks + recommendations" skeleton, or can be reorganized into it.

- **Recommended retention**: 80% (a report-form presentation of digested source material; cut redundant derivations, further reading, and appendix-level detail, while keeping the **executive summary / key findings / data / risks / recommendations** four-piece set intact). If the user's source material is the report itself and needs 100% archiving, override to 100% and record it as a "non-default combination" in the Brief section of `plan/plan.md`.
- **Typical structure**: `Hero` (title + reporting period / scope / author / organization) → `Summary` (**executive summary / key conclusions first — mandatory**) → `Section`: background and methodology → key findings → data and evidence → risks and limitations → recommendations and next steps → `Conclusion` (restatement of core conclusions + decision recommendation). **`TOC` must be enabled.**
- **Component choice**: `Summary` holds "key conclusions + key data" (so a skimming reader gets the essence in 30 seconds); `Table` carries data / comparisons; `RiskList` / `Decision` / `Tradeoff` carries risks and trade-offs; `CodeBlock` / `Formula` carries technical evidence; `ActionList` carries the recommendations list; prose carries the argument.
- **Raw boundary**: data charts, trends, comparison matrices, risk heat maps, dependency diagrams, etc. use the Raw freeform layer (HTML/CSS charts and matrices, light interactivity, SVG/canvas as needed); **keep an evidentiary feel with low decoration** — avoid motion that steals the show, avoid mood gradients.
- **Imagery tendency**: `none` or real data charts / report screenshots (`tufte`-style); **avoid mood imagery / images that interrupt reading**. Any product screenshot must serve a specific conclusion.
- **Theme tendency**: `tufte` (data-driven), `knuth` (academic), `vignelli` (neutral/spec-like, standardized reports), `fuller` (systems design / RFC style).
- **Self-check**:
  - Can the conclusion be grasped within 30 seconds of the article's opening?
  - Are data / risks / recommendations complete and traceable (which findings does each recommendation point back to)?
  - Does it read like a **formal report** rather than a marketing page or a rambling long-form essay?
  - Are `Table` / `RiskList` / `Decision` used because the content genuinely calls for them, or are they forced in to "look professional"?

> **When not to use full-report**:
>
> - The source material is a coherent argumentative / narrative long-form piece → `longform`.
> - The user wants a decision summary "for the boss" rather than a full report → `briefing`.
> - Reviewing a specific PR / proposal / incident → `review`.
