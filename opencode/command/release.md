---
description: Commit validated changes, merge a PR into develop, then promote develop to main through a second PR
---

Run a complete release flow for the current repository. Load `commit-series` and `pull-request-quality` before acting.

## Required flow

1. Inspect repository instructions, current branch, worktree status, staged and unstaged diffs, recent commits, remotes, GitHub authentication, and the canonical repository. Preserve unrelated user changes. If the requested release boundary is ambiguous, ask one question and stop.
2. Never commit directly on `main` or `develop`. If the current branch is protected, create a descriptive release branch before committing. Otherwise use the current feature branch.
3. Group only the requested changes into small, coherent Conventional Commits. Keep tests and relevant docs with the behavior they cover. Run the best available project validation before each commit. Stop on failures; do not silently fix source during a release-only request.
4. Inspect the staged diff for unrelated files, secrets, and whitespace errors. Commit with an English Conventional Commit subject under 72 characters. Do not add AI attribution or `Co-Authored-By` trailers.
5. Push the release branch. Create or reuse a pull request from that branch to `develop`. Use `pull-request-quality` for an English title and body with Summary, Changes, Validation, and Risks / Review Notes. Link an issue only when the user supplied one; never invent an issue.
6. Wait for required checks and review the final PR diff. If checks fail, report the failure and stop. Merge the PR through GitHub with a normal merge commit (`--merge`), never squash or rebase unless the user explicitly asks.
7. Fetch the updated `develop`. Create or reuse a second pull request from `develop` to `main`, with a concise promotion-focused title and body. Do not create an intermediate commit on `develop`.
8. Wait for required checks on the promotion PR, then merge it through GitHub with a normal merge commit. Do not deploy unless the user explicitly asks.
9. In the final chat response, return commit hashes, both full PR URLs as clickable Markdown links (`[PR to develop](https://...)` and `[Promotion PR to main](https://...)`), both merge commit hashes, validation results, and any remaining local changes. State clearly if any step was skipped or stopped.

User release context: $ARGUMENTS
