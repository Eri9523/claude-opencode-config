# Article Type · review

**Engineering review**: PR / proposal design / incident postmortem / architecture / API / security audit. The starting point is reviewing a **specific artifact** and producing an opinion and actions.

- **Recommended retention**: 60-80% (keep key findings + evidence + actions; omit irrelevant detail / contextual setup).
- **Typical structure**: `Hero` (subject under review + review scope + review date / reviewer) → `Summary` (**conclusion / review verdict first**) → `Section`: background and goals → findings (itemized) → impact assessment → recommendations → action items → `Conclusion` (core judgment + approve / needs revision / reject).
- **Component choice**: still **prose-first** — state the conclusion and findings clearly with prose + `Summary` first. Below are **domain-specific components**, used only when the content genuinely has that structure — don't stack all of them on just because it's a review:
  - `RiskList`: when there's a genuine set of risks that need grading.
  - `DiffReview`: when there's genuine code changes to review line by line; code always uses `CodeBlock`.
  - `Decision` / `Tradeoff`: when there's a genuine "X vs Y" trade-off to show.
  - `Incident`: the timeline for an incident postmortem.
  - `ActionList` / `Checkpoint`: when action items / acceptance checkpoints genuinely need structuring.
- **Raw boundary**: impact-scope diagrams, dependency graphs, risk heat matrices, call chains, monitoring curves, etc. use the Raw freeform layer (HTML/CSS matrices + heat coloring, light interactivity, SVG as needed); **restrained, evidence-first, and never upstaging the prose**.
- **Imagery tendency**: `user-assets` — real screenshots / diffs / monitoring charts / dashboard screenshots (`tufte`-style).
- **Theme tendency**: `tufte` (evidence-driven review), `shannon` (dark engineering / incident postmortem), `fuller` (systems design / RFC review), `vignelli` (neutral/spec-like).
- **Self-check**:
  - Is the review verdict stated clearly up front (approve / needs revision / reject)?
  - Is every finding **backed by evidence** (code snippets / screenshots / data / logs), rather than a gut feeling?
  - Are recommendations and action items **actionable** (who does it / when / how is it verified)?
  - Is the starting point reviewing a **specific artifact**? If the starting point is "the reader needs to make a decision," use `briefing` instead.

> **When not to use review**:
>
> - Reviewing a **product / book / paper / film** (opinion-driven, with no binary approve/reject judgment) → `essay`.
> - Producing a "should we do X" decision summary for a boss → `briefing`.
> - A complete after-the-fact investigation report → `full-report`.
