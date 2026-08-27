# OpenCode Instructions

Use this file as a short routing layer. Load a dedicated skill when a task needs detailed guidance.

## Core

- Sergio is Python-first, systems-minded, and prefers direct answers.
- Do not assume. If requirements are ambiguous, state the ambiguity and ask.
- Prefer the smallest correct change. Avoid speculative features and cleanup.
- Touch only files required by the task. Never revert or overwrite user changes.
- Internal code, comments, commit text, and technical docs use English. User-facing UI text uses Spanish.

## Execution

- Build context before editing. Use codegraph for architecture questions, then Glob/Grep/Read.
- For feature and bug work, use TDD: failing check first, fix, then verify.
- Spawn workers with `task` when a request has independent workstreams, broad repository exploration, or a separate review/validation pass that can run in parallel.
- Use `explore` for read-only discovery, `general` for isolated implementation work, and `reviewer` for read-only review. Give each worker one focused objective, relevant paths, constraints, and an explicit expected result.
- Do not spawn workers for small, sequential edits. Never let concurrent workers modify the same files; the primary agent owns integration, conflict resolution, and final verification.
- Before commit, run the best available project validation and fix failures before committing.
- Never commit or push unless Sergio explicitly asks.

## Tools

- Prefer dedicated tools over raw shell: Read/Edit, Glob/Grep, then Bash.
- Use Context7 for library/API docs; resolve the library ID first.
- Use Next.js devtools before browser logs for Next.js diagnostics.
- Use browser automation, not curl, for rendered frontend verification.

## Git

- Use Conventional Commits. Run `/commit` for the commit workflow.
- Use an optional scope, imperative mood, and a subject under 72 characters.
- Stage only files related to the commit.
- When merging pull requests, use a normal merge commit. Never squash or rebase merge unless Sergio explicitly requests it.
- Never push, reset, restore, checkout, stash, rebase, merge, or amend unless explicitly asked.

### GitHub identities

- Sergio has two GitHub profiles: `sergiorauda` for work and `Eri9523` for personal repositories.
- Do not infer the GitHub account from the repository owner. A repository can be owned by an organization or another account while access is granted through either profile.
- Before any `gh` repository operation or `git push`, inspect `git remote -v` and `gh auth status`, then switch explicitly with `gh auth switch --user <profile>` when needed.
- Verify access with `gh repo view <canonical-owner>/<repo>` before pushing. GitHub may report `Repository not found` for an existing private repository when the active account lacks access.
- Keep the canonical repository remote unchanged; never replace the owner with the authenticated username just to select credentials. Ask when the intended profile is ambiguous.

## Skills

- `coding-guardrails`: TDD, validation, simplicity, and surgical changes.
- `python-hexagonal-architecture`: Load for Python backend architecture, dependency injection, service boundaries, Protocol ports, adapters, or decorator-registered services and pipeline stages; it documents the `rauditor-backend-template` pattern.
- `local-browser-testing`: Test local web apps through Playwright MCP; use for localhost UI verification, auth handoff, and responsive checks.
- `tailwind-frontend`: Use Tailwind as the default styling system for frontend work in any technology, including Django templates and React.
- `converting-css-to-tailwind`: Load when migrating existing CSS selectors and stylesheets to Tailwind utilities.
- `ui-ux-pro-max`: Use first for new frontend pages or projects to choose a product-specific visual system, palette, typography, UX guidance, and stack rules; persist the verified system when it will span multiple pages.
- `impeccable`: Use after the visual direction exists to shape, critique, audit, polish, harden, adapt, or optimize an implemented frontend; use it for bounded visual/browser review, not backend-only work.
- `linear-task`: Load for Linear-related work. It contains the full workflow; ask permission before any `linear_*` MCP call.
- `pull-request-quality`: Load before creating or updating a pull request; write descriptive English titles and bodies with summarized validation.
- `beautiful-article`: Load to turn source material (notes, URLs, PDFs, transcripts, reports) into a polished, themed, single-file HTML article or report.

## UI

For frontend work, apply Nielsen's usability heuristics and consult `knowledge/design-patterns.md`.

For a new frontend surface, use `ui-ux-pro-max` first to establish the visual system, then use `impeccable` to review and refine the implementation. For an existing surface, start with `impeccable`; use focused `ui-ux-pro-max` searches only when a design-system decision is missing.
