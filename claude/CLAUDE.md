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
- When merging pull requests, use a normal merge commit. Never squash or rebase merge unless Sergio explicitly requests it.
- Never push, reset, restore, checkout, stash, rebase, merge, or amend unless Sergio explicitly asks.

## Skills

- `seo`: Load for SEO audits, indexing issues, Search Console analysis, metadata, structured data, internal linking, Core Web Vitals, and organic-search recommendations.
- `coding-guardrails`: TDD, validation, simplicity, and surgical changes.
- `python-hexagonal-architecture`: Load for Python backend architecture, dependency injection, service boundaries, Protocol ports, adapters, or decorator-registered services and pipeline stages; it documents the `rauditor-backend-template` pattern.
- `local-browser-testing`: Test local web apps through Playwright MCP; use for localhost UI verification, auth handoff, and responsive checks.
- `tailwind-frontend`: Use Tailwind as the default styling system for frontend work in any technology, including Django templates and React.
- `converting-css-to-tailwind`: Load when migrating existing CSS selectors and stylesheets to Tailwind utilities.
- `ui-ux-pro-max`: Use first for new frontend pages or projects to choose a product-specific visual system, palette, typography, UX guidance, and stack rules; persist the verified system when it will span multiple pages.
- `impeccable`: Use after the visual direction exists to shape, critique, audit, polish, harden, adapt, or optimize an implemented frontend; use it for bounded visual/browser review, not backend-only work.
- `linear-task`: Load for Linear-related work. It contains the full workflow; ask permission before any `linear_*` MCP call.
- `pull-request-quality`: Load before creating or updating a pull request; write descriptive English titles and bodies with summarized validation.

## UI

For frontend work, apply Nielsen's usability heuristics and consult the project's design guidance.

For a new frontend surface, use `ui-ux-pro-max` first to establish the visual system, then use `impeccable` to review and refine the implementation. For an existing surface, start with `impeccable`; use focused `ui-ux-pro-max` searches only when a design-system decision is missing.
