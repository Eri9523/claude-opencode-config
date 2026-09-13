---
description: Advance one gated phase of a new or existing affiliate website
---

Load `affiliate-site` and execute exactly one action from `$ARGUMENTS`.

Accepted actions:

- `new <brief>`: initialize a new site factory and stop before evidence research.
- `adopt <deployed-url>`: initialize migration state for an existing site and stop before baseline analysis.
- `continue`: execute the state's single `next_action` and stop at its next gate.
- `status`: read state and artifacts without modifying anything.
- `help`: behave exactly as `/affiliate-site-help` without modifying anything.
- `approve <architecture|copy|design|golden-pages|migration-plan|pilot|batch-NNN>`: record only the matching pending approval, then stop.
- `scale <count>`: generate and audit one bounded batch from approved golden pages or an approved adopted-site pilot, then stop for batch approval.

If no action is provided, behave as `/affiliate-site-help`. Never combine phases, infer approval, scale without approved golden pages, publish, deploy, or run a release.
