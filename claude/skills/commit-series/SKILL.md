---
name: commit-series
description: "Trigger: creating commits, splitting changes, or preparing PRs. Keep commits small, coherent, and named with Conventional Commits."
---

# Commit Series

## Activation Contract

Use for commit preparation and execution, including `/commit`. Preparing a PR does not authorize creating commits or publishing changes.

## Hard Rules

- Commit only when explicitly requested. Push, PR creation, merge, deployment, and history rewriting require their own authorization.
- Prefer relatively small commits: one coherent purpose per commit, with its tests and relevant documentation. Never bundle independent changes for convenience or split by file type alone.
- Keep each commit usable and reviewable. No arbitrary line limit, forced stacked PRs, or code compression to reduce a diff.
- Write English Conventional Commits: `type(scope): imperative subject`, optional scope, subject under 72 characters. Explain non-obvious rationale, breaking changes, or migration steps in the body. No AI attribution or Co-Authored-By trailers.
- Preserve unrelated work and existing staged changes. Never reset, stash, amend, or rewrite history to split commits without explicit authorization.

## Execution Steps

1. Read repository instructions. Inspect `git status`, `git diff`, `git diff --cached`, and `git log --oneline -10`.
2. Group changes by independent purpose and briefly state the proposed series. Execute within the user's authorization; ask only about genuinely ambiguous ownership or scope.
3. Stage only each unit's files or hunks. Use a precise index patch when interactive staging is unavailable; do not alter working-tree content to stage fragments.
4. Run relevant repository checks. Before each commit, inspect `git diff --cached` and `git diff --cached --check`; confirm no unrelated changes or secrets are included. Stop on failures. Fix only within already-authorized implementation work; a commit-only request does not authorize source edits.
5. Create the commit, then check status before processing the next unit. Do not repeat checks without new changes or unresolved concerns.

## Pull Requests

- Use `pull-request-quality` for PR titles, bodies, and validation summaries. Inspect the full series against the verified target branch; never assume `develop` or a deployment workflow.
- Link an issue only when the user requests it. If verified repository policy blocks issue-less PRs, explain the blocker; never invent or create an issue as a workaround.
- Before GitHub operations or pushes, inspect `git remote -v` and `gh auth status`. Accounts: `sergiorauda` for work, `Eri9523` for personal. Owner and login are independent; ask if account choice is unclear. Switch explicitly when needed and verify canonical repository access with `gh repo view <owner>/<repo>` before pushing. Never rewrite the remote to choose credentials.
- Do not automatically merge or deploy after opening a PR. For an explicitly requested merge, use a normal merge commit unless the user requests another method.

## Output Contract

Report created commit hashes and subjects, validation results, and remaining changes. Include a PR URL only after confirmed creation.
