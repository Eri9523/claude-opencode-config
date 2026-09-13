---
description: Show concise affiliate-site workflow help and the recommended next command
---

Load `affiliate-site` and operate read-only.

Read `.site-factory/state.json` when present and verify referenced artifacts exist. Return no more than:

1. `State`: uninitialized, current phase, or waiting for approval.
2. `Next`: one sentence explaining the next safe action.
3. `Run`: exactly one recommended command.
4. `Commands`: one compact line covering `new`, `adopt`, `continue`, `status`, `approve`, and `scale`.

Recommendation rules:

- No state and no recognizable deployed app: `/affiliate-site new <brief>`.
- No state and an existing/deployed app: `/affiliate-site adopt <url>`.
- `pending_approval` set: `/affiliate-site approve <pending_approval>`.
- `next_action` is a phase: `/affiliate-site continue`.
- Golden pages or pilot approved and scale-ready: `/affiliate-site scale 5`.
- Missing or inconsistent artifact: `/affiliate-site status` and name the inconsistency.

Do not create or modify files, research, approve, implement, scale, publish, or deploy.
