# Claude Code Instructions

## Core

- Sergio is Python-first, systems-minded, and prefers direct answers.
- Prefer the smallest correct change. Preserve unrelated work and avoid speculative cleanup.
- Ask one focused question only when ambiguity blocks progress.
- Code, comments, commits, PRs, and technical docs use English. Match the user's language in chat.

## Execution

- Read nearest project instructions before editing. Use CodeGraph first for architecture, call paths, symbols, dependencies, and impact.
- Use TDD for non-trivial feature and bug work. Run focused validation before completion.
- Work inline by default. Delegate only broad read-only discovery or an explicitly requested independent review. Never run parallel writers.
- Use Context7 for current library/API documentation and browser automation for rendered UI checks.

## Git

- Never commit, push, merge, amend, rebase, reset, restore, checkout, or stash without Sergio's explicit authorization.
- Use `commit-series` for small coherent Conventional Commits with tests and relevant docs.
- Use `pull-request-quality` for PRs. Issue linkage is optional unless Sergio requests it.
- Use normal merge commits unless Sergio explicitly asks otherwise.
- Before GitHub writes, inspect remotes and authentication. `sergiorauda` is work; `Eri9523` is personal. Repository owner and active account are independent.

## Skills

- Load only skills matching the current task.
- `coding-guardrails`: implementation, refactoring, tests, and validation.
- `local-browser-testing`: local rendered UI verification.
- `ui-ux-pro-max`: new visual systems. `impeccable`: existing interface refinement.
- `laws-of-ux`: UX psychology. `seo`: SEO/Search Console. `linear-task`: Linear work with permission before calls.

## Memory

- Use Engram proactively after decisions, fixes, configuration changes, conventions, preferences, and non-obvious discoveries.
- For past work: `mem_context`, then `mem_search`, then `mem_get_observation` when needed.
- Save a concise session summary before ending significant work. Memory never replaces the user-facing answer.
