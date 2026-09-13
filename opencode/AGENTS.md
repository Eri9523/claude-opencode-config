# OpenCode Instructions

## Core

- Sergio is Python-first, systems-minded, and prefers direct answers.
- Build owns implementation end to end. Plan is read-only thinking mode.
- Prefer the smallest correct change. Avoid speculative features, abstractions, and cleanup.
- Preserve unrelated user changes. Touch only files required by the task.
- Ask one focused question only when a real ambiguity blocks progress.
- Code, comments, commit text, PRs, and technical docs use English. Match the user's language in chat. User-facing UI text follows the project's language.

## Execution

- Inspect current code and repository instructions before editing. Use CodeGraph first for architecture, call flow, symbols, dependencies, and impact; use filesystem tools only for details it does not cover.
- Use TDD for non-trivial feature and bug work: failing check, smallest fix, verification.
- Work inline by default. Use one hidden `explore` worker for broad read-only discovery and one hidden `reviewer` only when explicitly requested or when an independent pre-release review materially reduces risk.
- Never delegate small sequential work. Never run parallel writers. Build owns integration and final validation.
- Prefer dedicated tools over shell commands. Use Context7 for current library/API documentation and browser automation for rendered UI checks.
- Before completion, run the best available focused validation. Report commands and real results; never claim an unrun check passed.

## Git

- Never commit, push, merge, amend, rebase, reset, restore, checkout, or stash unless Sergio explicitly authorizes that operation.
- Use `commit-series` for commit work: small coherent Conventional Commits, tests and relevant docs with each behavior, optional scope, imperative subject under 72 characters.
- Stage only intended files or hunks. Do not include unrelated work, secrets, or local paths.
- Use `pull-request-quality` for PR titles and bodies. Issue linkage is optional unless Sergio requests it.
- Use normal merge commits. Never squash or rebase merge unless Sergio explicitly asks.
- Before GitHub writes or pushes, inspect `git remote -v` and `gh auth status`. Sergio uses `sergiorauda` for work and `Eri9523` for personal repositories; owner and authenticated account are independent. Switch explicitly when needed and verify canonical repository access before pushing.

## Skills

- Load only skills matching the current task. Skill instructions are on demand, not reasons to broaden scope.
- `coding-guardrails`: feature, bug, refactor, test, and validation work.
- `local-browser-testing`: local rendered UI verification.
- `ui-ux-pro-max`: establish a new visual system. `impeccable`: refine or audit an existing interface.
- `laws-of-ux`: psychology-grounded UX decisions.
- `seo`: SEO and Search Console work.
- `linear-task`: Linear work; ask permission before any `linear_*` call.
- `opencode-tooling`: OpenCode configuration, agents, commands, skills, plugins, permissions, and MCPs.

## Memory

- Use Engram proactively after decisions, bug fixes, configuration changes, conventions, preferences, or non-obvious discoveries.
- For past-work questions: `mem_context`, then `mem_search`, then `mem_get_observation` when needed.
- Before ending significant work, save a concise session summary. Memory is bookkeeping, never a substitute for the user-facing answer.
