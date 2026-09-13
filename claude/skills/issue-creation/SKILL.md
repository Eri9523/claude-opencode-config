---
name: issue-creation
description: "Trigger: user requests drafting, creating, or updating a GitHub issue. Use verified evidence and the repository's actual conventions."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "2.0"
---

# Issue Creation

## Activation Contract

Use when the user asks for an issue or issue update. A bug report, feature request, or PR request alone does not authorize creating an issue.

## Hard Rules

- Verify the target repository and authenticated account. Follow applicable repository instructions and templates; do not assume approval labels, YAML forms, or maintainer workflows exist.
- Never invent reproduction steps, results, user affirmations, labels, or permissions. Keep secrets and unintended private details out of published content.
- Drafting does not authorize publication. Publish or mutate workflow state only within the user's explicit request and actual repository permissions.
- On an ambiguous write result, stop mutations and resolve its outcome before retrying; never create a duplicate blindly.

## Execution Steps

1. Reuse verified session context; inspect only missing target, authentication, and repository conventions. Ask only for information necessary to proceed.
2. Before creating an issue, search relevant open and closed issues. Reuse a matching issue only within the user's authorized scope; otherwise report the match.
3. Follow the applicable form or template when present, including required answers. Without one, use concise Markdown: problem or goal, expected behavior, observed behavior or proposed outcome, and available reproduction or validation evidence. Do not block merely because a YAML form is absent.
4. Use `gh` for the authorized operation. Apply labels or change approval/closure state only when requested and permitted; no universal `status:approved` requirement.
5. Confirm the returned issue identity and published content with a targeted readback. Report uncertainty honestly if confirmation fails.

## Output Contract

Return the draft or confirmed issue URL and a brief summary. If blocked, name the missing fact and whether any write occurred.
