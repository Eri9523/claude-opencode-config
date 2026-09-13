---
name: affiliate-site
description: "Trigger: affiliate-site, Amazon affiliate website, new/adopt/continue/status/approve/scale. Run one gated site-factory phase at a time."
license: Apache-2.0
metadata:
  author: "Eri9523"
  version: "1.0"
---

## Activation Contract

Load for `/affiliate-site` and `/affiliate-site-help`, or when managing a new or existing affiliate content site through `.site-factory/state.json`. Build remains the only writer. Run at most one phase per invocation.

## Hard Rules

- Preserve deployed URLs, canonicals, indexation, content, analytics, and redirects until an approved artifact explicitly changes them.
- Separate sourced facts from hypotheses. Never invent keyword volume, rankings, product data, reviews, prices, availability, firsthand experience, urgency, or affiliate performance.
- Do not scale before `golden-pages` is approved. Do not publish or deploy unless separately authorized.
- Create `.site-factory/` only after `new` or `adopt`. Write JSON atomically; keep unknown fields. Never skip a required approval.
- Before `new`, require domain, market/locale, audience, product category, affiliate program, and initial objective. Before `adopt`, require one deployed URL and the owning repository. Ask one grouped clarification and create no state when required inputs are missing.

## Decision Gates

| Action | Requirement | Result |
| --- | --- | --- |
| `new <brief>` | no state exists | initialize `mode=new`, next `evidence` |
| `adopt <url>` | no state exists; inspect deployed site read-only | initialize `mode=adopt`, next `baseline` |
| `continue` | state exists; not waiting approval | execute exactly `next_action` |
| `approve <gate>` | matching pending gate and artifact exists | record approval, advance |
| `scale <count>` | `next_action=scale-ready`; no pending gate; positive bounded count | create one batch, then require audit |
| `status` / help | any state | read-only summary and exact next command |

New flow: `evidence -> architecture -> approval -> content-model -> golden-copy -> approval -> design -> approval -> golden-pages -> approval -> scale`.

Adopt flow: `baseline -> migration-plan -> approval -> pilot -> pilot audit/approval -> templates -> scale`.

## Execution Steps

1. Read current state and relevant repository artifacts. If absent, accept only `new` or `adopt`.
2. Load only phase skills: evidence/architecture=`seo`; copy=`web-copywriting` + `seo`; design=`ui-ux-pro-max` then `impeccable`; implementation=`coding-guardrails`; rendered QA=`local-browser-testing`; optional psychology=`laws-of-ux`.
3. Produce the phase artifact under `.site-factory/`, validate required fields and evidence links, then update state with `phase`, `completed`, `pending_approval`, `next_action`, `artifacts`, `batches`, and `updated_at`.
4. Stop at approval gates. Present artifact, unresolved facts, validation result, and exact next command. Never approve on the user's behalf.
5. For scaling, generate one bounded batch from approved templates, audit facts, duplication, links, metadata, indexation, accessibility, responsive behavior, and performance, then stop before another batch.

## Output Contract

Return mode, current phase, artifact paths, validation, blockers, pending approval, and one exact recommended command. Help output stays concise: current state, next recommendation, and command reference.

## References

- `references/state-schema.md` — state fields, artifacts, and transition table.
