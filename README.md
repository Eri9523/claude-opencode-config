# claude-opencode-config

Personal configuration for Claude Code and OpenCode.

## Layout

- `claude/` contains Claude Code instructions and shared skills.
- `opencode/` contains OpenCode configuration, agents, commands, plugins, and OpenCode-specific skills.

Secrets are provided through environment variables and are intentionally not stored in this repository.

## Credentials

OpenCode reads these variables from the environment:

```sh
export OPENCODE_ELEVENLABS_API_KEY="..."
export OPENCODE_AIRTABLE_API_KEY="..."
export LOGFIRE_API_KEY="..."
```

Claude Code's example MCP configuration uses:

```sh
export CLAUDE_ELEVENLABS_API_KEY="..."
```

If the same ElevenLabs account is used by both tools, the two ElevenLabs variables can contain the same value. Put exports in `~/.zshrc` or another local secret manager, never in this repository.

Claude Code MCP template: `claude/mcp.json.example`.

Supabase, Linear, Context7, and other hosted Claude integrations normally use OAuth or plugin authentication and keep their sessions in Claude's local state.
