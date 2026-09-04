# claude-opencode-config

Personal configuration for Claude Code and OpenCode.

## Layout

- `claude/` contains Claude Code instructions and shared skills.
- `opencode/` contains OpenCode configuration, agents, commands, plugins, and OpenCode-specific skills.

The global `/design` command asks the qualifying questions first (context, audience, register, primary action, surface), records them with `design_intake`, then generates three repository-grounded HTML/CSS proposals, validates visual evidence, contrast, affordance, and Nielsen heuristics, and presents them in a scrollable comparison canvas.

Each proposal stays editable in that canvas: click an element to select it, drag or arrow-key it to move it, double click to retype it, and change color, type or spacing from the properties panel. Edits are stored as an override layer over the proposal's HTML/CSS — the design keeps its real layout and responsive behavior, every change can be reverted on its own, and the agent reads them back with `design_get` when implementing.

Secrets are provided through environment variables and are intentionally not stored in this repository.

## Plugins

[ponytail](https://github.com/DietrichGebert/ponytail) trims generated code to the minimal sufficient implementation.

- OpenCode: listed in `opencode/opencode.jsonc`'s `plugin` array (`@dietrichgebert/ponytail`).
- Claude Code: install at user scope, since plugin installs are CLI-managed state, not files in this repo:
  ```sh
  claude plugin marketplace add DietrichGebert/ponytail
  claude plugin install ponytail@ponytail
  ```

## Credentials

OpenCode reads these variables from the environment:

```sh
export OPENCODE_ELEVENLABS_API_KEY="..."
export OPENCODE_AIRTABLE_API_KEY="..."
export LOGFIRE_API_KEY="..."
export OPENCODE_GSC_CREDENTIALS_PATH="..."
```

Claude Code's example MCP configuration uses:

```sh
export CLAUDE_ELEVENLABS_API_KEY="..."
export CLAUDE_GSC_CREDENTIALS_PATH="..."
```

If the same ElevenLabs account is used by both tools, the two ElevenLabs variables can contain the same value. Put exports in `~/.zshrc` or another local secret manager, never in this repository.

`*_GSC_CREDENTIALS_PATH` points to a Google service account JSON key (Search Console API), granted "Full" access on each property in Search Console. Keep the key file itself outside any repository (e.g. `~/.config/gcp-credentials/`).

`CLOUDFLARE_API_TOKEN` is read as-is (no per-tool prefix) by both tools — used with plain `curl` against the Cloudflare REST API, see the `cloudflare-api` skill for scope and usage.

Claude Code MCP template: `claude/mcp.json.example`.

Supabase, Linear, Context7, and other hosted Claude integrations normally use OAuth or plugin authentication and keep their sessions in Claude's local state.
