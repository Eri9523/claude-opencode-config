# Article Type · explainer

Explains a mechanism / system / concept / algorithm / protocol. After reading, the reader **truly understands** how the thing works, why it's designed that way, and when to use it or not.

- **Recommended retention**: 80% (keep the main mechanism and key details; cut repetition / tangents / historical background; keep all "key intuitions" and "common pitfalls").
- **Typical structure**: `Hero` → `Lead` (why this matters / the cost of not understanding it) → `Section`: problem → mechanism → diagram → example → common pitfalls → when to use / not use → `Conclusion`.
- **Component choice**: prose carries the mechanism (**prose remains the lead**; don't break it into a stack of cards); `Aside tone="principle"` to call out "key intuition / the one-sentence essence / common pitfalls"; `CodeBlock` for concrete examples; `Table` to compare approaches / variants; `Detail` / `Tabs` to collapse secondary details and deep derivations; `Quote` to cite the original paper / spec text.
- **Raw boundary**: **liberal use of explanatory visuals is encouraged** — mechanism flows, state changes, data flow, and conceptual relationships can use the Raw freeform layer (HTML layout / light interactivity / motion / SVG as needed) to make abstract concepts visible and comparable; each block **serves one concrete point in the mechanism**. Raw is a supporting layer, not the lead — if you find Raw carrying the primary information and the prose degrading into captions, you should consider `interactive-explainer` instead.
- **Imagery tendency**: explanatory visuals first (Raw — interactivity / layout / motion / SVG all fair game); use `user-assets` when a real interface / system screenshot is needed; use mood imagery sparingly.
- **Theme tendency**: `tufte` (technical/data-driven), `shannon` (systems/engineering), `knuth` (academic), `freddie` / `bayer` (lively, beginner-facing), `fuller` (systems design / protocol-oriented).
- **Self-check**:
  - After reading, does the reader **truly understand** the mechanism (not just "know it exists")?
  - Do the diagrams serve understanding, or are they decoration? Would removing them hurt comprehension?
  - Are the common pitfalls covered (the 2-3 easiest traps to fall into)?
  - Is "when to use / not use" clear? This is the key difference between explainer and longform.
  - If a long technical piece can be cut by 20% and still explain itself clearly, prefer explainer; use `longform` when the original text needs to be archived in full.

> **When not to use explainer**:
>
> - The reader needs to **learn by operating it** (Raw is the primary carrier) → `interactive-explainer`.
> - The reader needs to **follow along and build something** → `tutorial`.
> - The source material is a paper- or report-level complete argument → `longform` / `full-report`.
