---
name: opencode-tooling
description: Use when editing OpenCode configuration, agents, skills, plugins, permissions, or MCP servers.
---

# OpenCode Tooling

Use this skill for OpenCode configuration work.

## Rules

- Read the active `opencode.jsonc`, relevant `AGENTS.md`, and the built-in `customize-opencode` guidance before editing.
- Preserve the `$schema` and validate the resolved configuration after changes.
- Remember that configuration, agents, skills, plugins, and permissions load only after restarting OpenCode.
- Keep project configuration separate from global configuration unless the behavior is intentionally global.
- Use `{env:VARIABLE}` for secrets; never write credentials directly into config files.

## Worker Delegation

- Use `task` to spawn a worker when configuration work has independent investigations, a broad repository search, or a separate review/validation pass that can proceed in parallel.
- Prefer `explore` for broad read-only discovery and `reviewer` for an independent read-only critique. Keep implementation in Build.
- Keep each worker focused on one objective and state its scope, file boundaries, and expected output. Do not run concurrent workers against the same files.
- Skip delegation for a small, sequential edit. The primary agent integrates worker results, resolves conflicts, validates the final configuration, and remains responsible for the change.

## Locations

- Global config: `~/.config/opencode/opencode.jsonc`
- Global instructions: `~/.config/opencode/AGENTS.md`
- Global agents: `~/.config/opencode/agent/`
- Global commands: `~/.config/opencode/command/`
- Global skills: `~/.config/opencode/skills/`
- Global plugins: `~/.config/opencode/plugin/` and `~/.config/opencode/plugins/`
