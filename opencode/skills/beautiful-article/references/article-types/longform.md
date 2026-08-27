# Article Type · longform

Full-length long-form writing, archiving, deep reading. This is the **default type**. The source material is a coherent argument / narrative / survey, and the user wants source-level retention.

- **Recommended retention**: 100% (no loss of key content from the source; only obviously repetitive paragraphs and content-free transitional sentences may be cut).
- **Typical structure**: `Hero` → `Lead` (an introduction framing the topic) → optional `Summary` (TL;DR / conclusion first) → multiple `Section`s (`Subsection` where needed) → `Raw` enhancement at key concepts → `Conclusion`. Enable `TOC` for long pieces (>10 sections or an estimated reading time >15 minutes).
- **Component choice**: prose paragraphs are the **absolute lead** and should make up the vast majority of the article; `Aside` calls out key intuitions / historical notes / opposing views; `Quote` cites sayings or verbatim statements; `Table` carries two-dimensional data; technical content uses `CodeBlock` / `Formula`. **Don't break coherent paragraphs into a stack of cards** — a card stack is the most common way longform goes off the rails.
- **Raw boundary**: insert the Raw freeform layer (light interactivity / custom layout / motion / SVG as needed) at key concepts, data trends, and mechanisms to give the long-form piece rhythm and breathing room; each block serves a specific paragraph and uses `--ra-*` tokens. Raw **is an enhancement, not the lead** — if Raw starts carrying the primary information, that's a sign you should consider `explainer` or `interactive-explainer` instead.
- **Imagery tendency**: `none` / `placeholders` preferred; technical / evidentiary pieces can use real data charts (`tufte`-style); narrative pieces can add a small amount of `press`-style mood imagery.
- **Theme tendency**: `tufte` (technical/evidentiary), `knuth` (academic/paper), `press` (narrative/survey), `bodoni` (column/feature).
- **Self-check**:
  - Is prose still the absolute lead? Have paragraphs not been broken into a card stack?
  - Do sections flow naturally into each other? Does finishing one section naturally make the reader want to read the next?
  - Does Raw illuminate key concepts, or does it interrupt the reading rhythm?
  - Does 100% information retention read like a carefully polished long-form piece (rather than a raw copy of the source)?
  - Does the long-form piece have `TOC` + `Summary` to help readers navigate?

> **When not to use longform**:
>
> - The source material is a digested report (the executive summary + risks + recommendations four-piece set) → `full-report`.
> - The source material explains a mechanism / concept and can afford to lose 20% → `explainer`.
> - The source material is a paper / long-form piece but you want to turn it into an interactive learning page → `interactive-explainer`.
> - For busy readers / a decision is needed → `briefing`.
