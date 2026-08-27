# Article Type · dialogue

Dialogue / Q&A / interview / podcast transcript / AMA / roundtable. Any content form where "multiple voices speak in turn."

- **Recommended retention**: 80% (cut redundant filler speech / repetition / small talk; keep the substantive content; don't cut opinions or alter tone).
- **Typical structure**: `Hero` (topic + guest(s) + host + date / source) → `Lead` (background / why this conversation) → multiple `Section`s, one topic or question per section, with the prose using **explicit speaker labels + heavy use of `Quote`** to convey conversational rhythm → an optional `Summary` placing a "key-points summary" at the beginning or end of the article → `Conclusion` (key takeaways / further reading).
- **Component choice**:
  - **Every paragraph opens with an explicit speaker label** (e.g. `**A**: …` / `**Host**: …`), so readers don't lose track;
  - `Quote` used heavily — pull out the guest's memorable lines, verbatim quotes, and key definitions as Quotes;
  - `Aside tone="principle"` to flag definitions / data / concept explanations;
  - `Summary` at the top holding "3-5 key takeaways," so skimming readers can still get the essence;
  - Use `Table` / `CodeBlock` sparingly (dialogue rarely has structured technical content; if it does, place code blocks verbatim as the guest said them);
  - `Detail` to collapse optional asides / annotations.
- **Raw boundary**: Raw can be used for a **topic map** (section navigation / timeline), **key concept visualization** (a Raw diagram for whatever mechanism the guest explained), or **quote cards**; no decorative bullet-comment overlays / animated avatars.
- **Imagery tendency**: `user-assets` (guest headshots / event photos / referenced screenshots) or `none` (plain-text dialogue); use `ai-generated` mood imagery sparingly.
- **Theme tendency**: `press` (editorial/publishing feel, suited to long conversations / interviews), `bodoni` (magazine-style profile interview), `freddie` (lively podcast feel).
- **Self-check**:
  - Is speaker attribution clear, so readers never mistake "who said what"?
  - Is the conversational rhythm preserved? Has it not been flattened into a "single-voice summary"?
  - Can the key takeaways be grasped from the Summary within 30 seconds?
  - After trimming, has the guest's original intent not been rewritten or misrepresented?
  - Are speaker labels still clear on mobile?

> **Future extension**: if the reacticle component library adds dedicated dialogue components such as `Dialogue` / `Speaker`, this type should use them preferentially. For now, `Quote` + explicit in-prose labeling is sufficient.
