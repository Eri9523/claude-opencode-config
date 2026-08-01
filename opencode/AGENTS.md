# OpenCode Instructions

Use this file as a short routing layer. Load a dedicated skill when a task needs detailed guidance.

## Core

- Sergio is Python-first, systems-minded, and prefers direct answers.
- Do not assume. If requirements are ambiguous, state the ambiguity and ask.
- Prefer the smallest correct change. Avoid speculative features and cleanup.
- Touch only files required by the task. Never revert or overwrite user changes.
- Internal code, comments, commit text, and technical docs use English. User-facing UI text uses Spanish.

## Execution

- Build context before editing. Use codegraph for architecture questions, then Glob/Grep/Read.
- For feature and bug work, use TDD: failing check first, fix, then verify.
- Before commit, run the best available project validation and fix failures before committing.
- Never commit or push unless Sergio explicitly asks.

## Tools

- Prefer dedicated tools over raw shell: Read/Edit, Glob/Grep, then Bash.
- Use Context7 for library/API docs; resolve the library ID first.
- Use Next.js devtools before browser logs for Next.js diagnostics.
- Use browser automation, not curl, for rendered frontend verification.

## Git

- Use Conventional Commits. Run `/commit` for the commit workflow.
- Use an optional scope, imperative mood, and a subject under 72 characters.
- Stage only files related to the commit.
- Never push, reset, restore, checkout, stash, rebase, merge, or amend unless explicitly asked.

## Skills

- `coding-guardrails`: TDD, validation, simplicity, and surgical changes.
- `linear-task`: Load for Linear-related work. It contains the full workflow; ask permission before any `linear_*` MCP call.
- `pull-request-quality`: Load before creating or updating a pull request; write descriptive English titles and bodies with summarized validation.

## UI

For frontend work, apply Nielsen's usability heuristics and consult `knowledge/design-patterns.md`.
