---
name: pull-request-quality
description: Use when creating or updating a pull request, writing a PR title or body, or summarizing branch changes for review.
---

# Pull Request Quality

Use this skill to produce reviewable pull requests. The title and body must be
written in English unless the repository explicitly requires another language.

## Before Writing

- Read the repository instructions and PR template, if present.
- Inspect the target base branch, branch commits, and the complete relevant diff.
- Identify the user-facing problem, the intended behavior, and the observable impact.
- Use linked issues only as context; do not replace the explanation with an issue ID.
- Do not invent motivation, metrics, test results, risks, or implementation details.

## Title

- Use a concise Conventional Commit style when the repository uses it.
- Include the affected area and the behavior being changed.
- Prefer specific verbs such as `prevent`, `measure`, `preserve`, `reject`, or `expose`.
- Avoid generic titles such as `updates`, `fix things`, `changes`, or `wip`.
- Keep the title under 72 characters when possible.

## Body

Use this structure unless the repository's PR template requires different
sections:

```md
## Summary

Explain the problem and the resulting behavior in 1-3 concise bullets.

## Changes

Group the meaningful implementation changes by area. Describe behavior and
impact, not every touched file.

## Validation

List only checks that actually ran, using one concise line per command:

- `command`: result, including useful pass/skip counts
- `command`: passed

## Risks / Review Notes

Mention migrations, compatibility concerns, rollout requirements, performance
tradeoffs, or important areas for reviewers. If none are known, say so.
```

## Validation Rules

- Never paste raw terminal output, progress bars, repeated test logs, stack traces, local absolute paths, or environment-specific warnings.
- Summarize test output as command plus result, for example `1,786 passed, 2 skipped`.
- Include warnings only when they affect review or indicate a real follow-up.
- Distinguish local checks from CI checks when both are available.
- If validation was not run, state that clearly and explain why in one sentence.
- Do not claim that a command passed merely because it was intended to run.

## Final Review

- A reviewer should understand why the change exists without opening the diff.
- Each summary bullet should describe a meaningful behavior or outcome.
- Remove implementation trivia, duplicated information, and unexplained abbreviations.
- Ensure the body contains no secrets, local paths, or unverified claims.
