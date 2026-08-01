# Claude Code Instructions

Use this file as a short routing layer. Load a dedicated skill or project spec when detailed guidance is needed.

## Core

- Sergio is Python-first, systems-minded, and prefers direct answers.
- Do not assume. If requirements are ambiguous, state the ambiguity and ask.
- Prefer the smallest correct change. Avoid speculative features and cleanup.
- Touch only files required by the task. Never revert or overwrite user changes.

## Project Navigation

- Read the nearest `AGENTS.md` and `CLAUDE.md` before editing.
- If `.codegraph/` exists, use CodeGraph for symbol and dependency exploration.
- Use the smallest relevant project spec and owning app instead of broad repository scans.

## Git

- Never add a `Co-Authored-By: Claude ...` trailer or other Claude/Anthropic attribution.
- Use Conventional Commits with an optional scope, imperative mood, and a subject under 72 characters.
- Never push, reset, restore, checkout, stash, rebase, merge, or amend unless Sergio explicitly asks.

## Skills

- `coding-guardrails`: TDD, validation, simplicity, and surgical changes.
- `linear-task`: Load for Linear-related work. It contains the full workflow; ask permission before any `linear_*` MCP call.

## UI

For frontend work, apply Nielsen's usability heuristics and consult the project's design guidance.
