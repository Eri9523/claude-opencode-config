# Article Type · tutorial

Teaching, step-by-step instructions, getting-started guides, installation/configuration, migration handbooks. Content the reader can **follow along with** to get something working.

- **Recommended retention**: 80-100% (**steps must not be lost**, or the reader can't follow along; the only things that can be cut are long-winded background, optional deep-dive extensions, and "why" paragraphs that don't affect getting it working).
- **Typical structure**: `Hero` → `Lead` (what you'll be able to do after finishing / prerequisites / estimated time) → optional `Summary` (a bird's-eye view of the overall path) → `Section`: one section per stage, each containing goal → steps (step-by-step) → example → acceptance checkpoint → common pitfalls → optional `Section`: exercises / extensions → `Conclusion` (summary + what to learn next).
- **Component choice**: `CodeBlock` for each step's code (**faithful, copy-and-run-ready**); `ActionList` / `Checkpoint` to list steps and acceptance checkpoints; `Aside tone="warning"` to flag pitfalls / caveats; `Detail` to collapse optional in-depth explanations / alternatives; `Table` to list parameters / options / configuration settings; `Tabs` for side-by-side multi-platform / multi-language examples.
- **Raw boundary**: flowcharts, state changes (before/after), UI step diagrams, command before/after comparisons use the Raw freeform layer (HTML step layouts / light interactivity / SVG as needed); make steps visible and comparable. **Not every step needs a Raw** — if code + a screenshot explain it clearly, skip it.
- **Imagery tendency**: `user-assets` preferred (**real screenshots** for each key step); pure command-line tutorials can use `none`.
- **Theme tendency**: `vignelli` (neutral/spec-like, documentation feel), `freddie` (lively onboarding), `fuller` (system configuration / RFC style), `tufte` (dense technical tutorials).
- **Self-check**:
  - Following along, does it **actually work**? No skipped steps / no "ellipsis …" pretending to be code?
  - Are the steps complete and in order? Does every step have an acceptance checkpoint (how do you know this step succeeded)?
  - Is the code **directly copyable and runnable**? No missing imports / no missing environment setup notes?
  - Are common pitfalls flagged (version mismatches / insufficient permissions / platform differences)?
  - Do code blocks scroll horizontally on mobile without overflowing?

> **When not to use tutorial**:
>
> - The source material explains a mechanism rather than an operation → `explainer`.
> - You want the reader to **learn by playing** rather than **build something** → `interactive-explainer`.
> - The source material is API documentation / a complete specification → use `longform` + a strong TOC; tutorial isn't suited to being a reference manual.
