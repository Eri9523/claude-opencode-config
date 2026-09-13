# Affiliate Site State

Store workflow state at `.site-factory/state.json`:

```json
{
  "schema_version": 1,
  "mode": "new",
  "phase": "evidence",
  "completed": ["brief"],
  "pending_approval": null,
  "next_action": "evidence",
  "artifacts": {"brief": ".site-factory/brief.md"},
  "approvals": {},
  "batches": [],
  "updated_at": "2026-01-01T00:00:00Z"
}
```

Required artifacts by phase:

| Mode | Phase | Artifact |
| --- | --- | --- |
| new | brief | `brief.md` |
| new | evidence | `evidence/products.json`, `evidence/serp.md`, `evidence/compliance.md` |
| new | architecture | `url-map.csv` |
| new | content-model | `content-schema.yaml` |
| new | golden-copy | representative copy under `copy/` |
| new | design | `design.md` plus approved canvas direction reference |
| new | golden-pages | implementation and `audits/golden-pages.md` |
| adopt | baseline | routes, metadata, links, components, deployment, screenshots under `baseline/` |
| adopt | migration-plan | `migration-plan.csv` with `KEEP|IMPROVE|MERGE|REDIRECT|NOINDEX|REMOVE|UNKNOWN` |
| adopt | pilot | selected representative pages and `audits/pilot.md` |
| both | batch | `batches/batch-NNN.json` and matching audit |

Approval transitions:

- `architecture` -> `content-model`
- `copy` -> `design`
- `design` -> `golden-pages`
- `golden-pages` -> `scale-ready`
- `migration-plan` -> `pilot`
- `pilot` -> `templates`
- `batch-NNN` -> `scale-ready`

Automatic transitions after a successful phase:

- `evidence` -> `architecture`
- `architecture` -> pending approval `architecture`
- `content-model` -> `golden-copy`
- `golden-copy` -> pending approval `copy`
- `design` -> pending approval `design`
- `golden-pages` -> pending approval `golden-pages`
- `baseline` -> `migration-plan`
- `migration-plan` -> pending approval `migration-plan`
- `pilot` -> pending approval `pilot`
- `templates` -> `scale-ready`

`status` and help never modify state. `continue` executes one phase. `scale` executes one batch and sets `pending_approval` to `batch-NNN`; approving it returns to `scale-ready`.
