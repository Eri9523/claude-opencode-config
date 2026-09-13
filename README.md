# claude-opencode-config

Personal configuration for Claude Code and OpenCode.

## Layout

- `claude/` contains Claude Code instructions and shared skills.
- `opencode/` contains OpenCode configuration, agents, commands, plugins, and OpenCode-specific skills.

The repository mirrors the versioned portion of the active global configuration.
Machine-local caches, backups, generated state, credentials, and external skill
roots such as `~/.agents/skills` are intentionally excluded.
Project-bound Claude `autoMode` context is also excluded because it can contain
trusted paths, tunnel hosts, and policy derived from an unrelated workspace.

The global SEO setup keeps its shared workflow in `claude/skills/seo`. Claude Code
loads it directly, while OpenCode auto-discovers Claude skills and uses its own thin
adapter in `opencode/agent/seo.md`.

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

[caveman](https://github.com/JuliusBrussee/caveman) compresses agent prose into terse, technically accurate output; pairs with ponytail (caveman shrinks what the agent says, ponytail shrinks what it builds).

- OpenCode: has no publishable plugin package, so its integration is vendored as files — `opencode/plugins/caveman/` (referenced from `opencode.jsonc`'s `plugin` array as `./plugins/caveman/plugin.js`), `opencode/commands/caveman*.md`, `opencode/agents/cavecrew-*.md`, and `opencode/skills/{caveman*,cavecrew}/`. The always-on ruleset is appended between `<!-- caveman-begin -->`/`<!-- caveman-end -->` markers in `opencode/AGENTS.md`. To refresh from upstream: `node bin/install.js --only opencode` from a clone of the caveman repo, then copy the changed files back here.
- Claude Code: install at user scope, same as ponytail:
  ```sh
  claude plugin marketplace add JuliusBrussee/caveman
  claude plugin install caveman@caveman
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

`*_GSC_CREDENTIALS_PATH` points to a Google service account JSON key, granted "Full" access on each property in Search Console. The same key is reused for the `analytics` server (GA4 Admin + Data API, read-only) — grant its `client_email` Viewer access on each GA4 property or account, and enable the Google Analytics Admin API and Google Analytics Data API on the key's GCP project. `analytics`'s `GOOGLE_PROJECT_ID` is that project's id, not a secret. Keep the key file itself outside any repository (e.g. `~/.config/gcp-credentials/`).

`CLOUDFLARE_API_TOKEN` is read as-is (no per-tool prefix) by both tools — used with plain `curl` against the Cloudflare REST API, see the `cloudflare-api` skill for scope and usage.

## AWS

The personal AWS account uses IAM Identity Center profile `personal`. The local
`aws per` wrapper logs in through SSO and exports `AWS_PROFILE=personal`:

```sh
aws per
aws sts get-caller-identity
```

The profile and SSO configuration stay in `~/.aws/config`; credentials are not
stored in this repository.

Claude Code MCP template: `claude/mcp.json.example`.

Supabase, Linear, Context7, and other hosted Claude integrations normally use OAuth or plugin authentication and keep their sessions in Claude's local state.
