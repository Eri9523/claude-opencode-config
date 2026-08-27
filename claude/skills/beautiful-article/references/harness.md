# The Harness Perspective

The focus of this Skill isn't "prompting" — it's a small harness. It has to answer six
questions:

| Harness part | Problem this Skill solves | Design mechanism |
|---|---|---|
| Context management | What does the model actually see | All raw sources are unified into `source.md`; references are read in phases |
| Tool system | What inputs / outputs it can handle | URL / PDF / DOCX / Markdown / screenshots / image assets / local builds / browser inspection |
| Execution orchestration | What to do next | Split into Phases, checkpoints, a first spread sample, full generation, acceptance review and repair |
| State and memory | How decisions persist across steps | `source.md`, `plan/plan.md` (Brief/Outline/Theme/Assets merged into four sections), `review/first-spread-review.md`, `review/final-review.md` |
| Evaluation and observability | How to know whether the article is good | The Plan self-check is done inline by the main Agent; First Spread / Final reviews use a SubAgent that writes a file; Section review uses a SubAgent that returns a message |
| Constraints and recovery | How to fix things once they go off track | Minimal-slice repairs; a mindless full rewrite of the whole piece is forbidden |

## State files are long-term memory

The Agent **should not rely on chat context to remember key decisions**. Cross-phase
decisions are persisted to disk in the following files — trimmed down from roughly 5 more
files than before:

```text
source/source.md             # The unified source material (original language), the factual foundation
source/source.<lang>.md      # Only when translation is needed: an idiomatic translated version, the factual foundation for subsequent writing
source/extraction-notes.md   # Extraction risks / losses / open items / language and translation notes
plan/plan.md                 # The single planning file: Brief / Outline / Theme / Assets merged into four sections
review/first-spread-review.md  # First Spread SubAgent conclusions (basis for first-spread acceptance)
review/final-review.md         # Final-review conclusions from three perspectives (part of the deliverable)
review/source-review.md        # Only for complex or low-confidence sources
review/repair-log.md           # Only when repairs were made
```


In a long session, if you're unsure about a decision that was already confirmed, **read
these files back** — don't reinvent it from memory.

## One-sentence positioning

> Beautiful Article edits and designs source material into a beautiful web article; it is
> first and foremost an **article**, not a web app. Interaction, Raw, and images all serve
> the reading experience.
