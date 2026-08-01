---
description: Create a scoped Conventional Commit without pushing.
---

Review the current status and relevant diff, then create a commit for the requested changes.

Rules:

- Use only `feat`, `fix`, `hotfix`, `chore`, `docs`, `test`, `refactor`, `perf`, `ci`, or `build`.
- Add a scope when it is clear: `fix(auth): handle expired session`.
- Use imperative mood, keep the subject under 72 characters, and omit the final period.
- Run the best available project validation before committing.
- Stage only files related to this commit.
- Never push, reset, restore, checkout, stash, rebase, merge, or amend.
- If validation fails, stop and report the failure instead of committing.

User context: $ARGUMENTS
