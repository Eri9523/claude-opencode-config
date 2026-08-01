---
name: coding-guardrails
description: Use for feature work, bug fixes, refactors, tests, validation, TDD, linting, type checks, or when a task risks overengineering or broad diffs.
---

# Coding Guardrails

These rules reduce common LLM coding mistakes. They bias toward caution over speed; for trivial tasks, use judgment.

## Think Before Coding

- Do not assume or hide confusion. Surface assumptions, uncertainty, and tradeoffs explicitly.
- If multiple interpretations exist, present them instead of picking silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop, name what is confusing, and ask.

## Simplicity First

- Write the minimum code that solves the requested problem.
- Do not add features, abstractions, configurability, or speculative flexibility beyond the request.
- Do not add error handling for impossible scenarios.
- If a change grows much larger than necessary, rewrite it smaller.
- Ask whether a senior engineer would call the solution overcomplicated; if yes, simplify.

## Surgical Changes

- Touch only what the task requires. Clean up only your own mess.
- Do not improve adjacent code, comments, formatting, or unrelated structure.
- Do not refactor working code unless the user asked for it or the requested change requires it.
- Match existing style, even if you would choose differently.
- If you notice unrelated dead code, mention it instead of deleting it.
- Remove only imports, variables, functions, and files made unused by your own changes.
- Every changed line should trace directly to the user's request.

## Goal-Driven Execution

- Convert tasks into verifiable goals before editing.
- For bug fixes, reproduce the bug with a test or concrete check before fixing when feasible.
- For validation work, test invalid inputs first, then make those tests pass.
- For refactors, ensure behavior is covered before and after the change.
- For multi-step tasks, keep a brief plan with verification for each step.

## Validation Chain

Run the best available validation before commit:

1. `mise run precommit`
2. `mise run type`
3. `uv run pre-commit run --all-files`
4. `uv run mypy .` or `uv run pyright`
5. `uv run python -m py_compile <files.py>`

Fix lint/pre-commit failures before committing. If no validation exists, say so and use the closest useful check.
