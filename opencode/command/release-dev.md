---
description: Commit validated changes and open a pull request to develop without merging it
---

Run a development release flow for the current repository. Load `commit-series` and `pull-request-quality` before acting.

## Required flow

1. Inspect repository instructions, current branch, worktree status, staged and unstaged diffs, recent commits, remotes, GitHub authentication, and the canonical repository. Preserve unrelated user changes. If the requested release boundary is ambiguous, ask one question and stop.
2. Never commit directly on `main` or `develop`. If the current branch is protected, create a descriptive release branch before committing. Otherwise use the current feature branch.
3. Group only the requested changes into small, coherent Conventional Commits. Keep tests and relevant docs with the behavior they cover. Run the best available project validation before each commit. Stop on failures; do not silently fix source during a release-only request.
4. Inspect the staged diff for unrelated files, secrets, and whitespace errors. Commit with an English Conventional Commit subject under 72 characters. Do not add AI attribution or `Co-Authored-By` trailers.
5. Push the release branch. Create or reuse a pull request from that branch to `develop`. Use `pull-request-quality` for an English title and body with Summary, Changes, Validation, and Risks / Review Notes. Link an issue only when the user supplied one; never invent an issue.
6. Do not merge, close, delete, rebase, or deploy. In the final chat response, return the commit hashes, the full PR URL as a clickable Markdown link (`[PR](https://...)`), validation results, and any remaining local changes.

User release context: $ARGUMENTS
