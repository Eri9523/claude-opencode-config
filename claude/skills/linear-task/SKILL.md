---
name: linear-task
description: Use when creating or executing a Linear task with the MIN team and permission-gated Linear actions.
---

# Linear Task Workflow

Use this skill for non-trivial project changes that warrant a Linear task.

## Rules

- Read the repository `AGENTS.md` and the relevant `specs/` file before planning.
- Ask Sergio for explicit permission before any `linear_*` MCP call.
- Without permission, draft ready-to-paste task text instead of calling Linear.
- Assign tasks to team `MIN` and create them in `Todo` status.
- Use branches named `<type>/min-<id>-<slug>`.
- Include a trigger, action, and observable result in every summary and acceptance criterion.

## Default Flow

1. Read project context.
2. Check whether Sergio already supplied a Linear issue.
3. Draft the exact task title, description, design, and acceptance criteria.
4. Ask permission before searching or modifying Linear.
5. If authorized, use the Linear tools and keep the task assigned to `MIN`.
6. Work on the task branch and validate the implementation.
7. Prepare the review/status update for Sergio rather than changing Linear status without permission.
