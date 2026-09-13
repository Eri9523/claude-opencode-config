---
name: systemic-issue-triage
description: "Trigger: triaging multiple bug reports, a backlog, or recurring failures. Group verified shared causes without forcing unrelated fixes together."
license: Apache-2.0
metadata:
  author: Alan-TheGentleman
  version: "2.0"
---

# Systemic Issue Triage

## Activation Contract

Use for a backlog or recurring failures across reports. A single isolated bug follows the ordinary debugging workflow; it needs no cluster or tracker.

## Hard Rules

- Treat the reported symptom as evidence and the proposed cause as a hypothesis. Reproduce the behavior or state why reproduction is unavailable.
- Group reports only when evidence supports a shared cause. Fix that cause once; keep independent causes and rollback boundaries separate.
- Prefer the smallest correct change. Adding a state, flag, validation, or abstraction is acceptable when the verified problem requires it; deletion count is not a quality metric.
- Preserve security, data integrity, and useful tests. Never teach tests to accept the defect or claim that passing unrelated checks proves the reported scenario.
- Do not create, close, relabel, or merge issues/PRs without explicit authorization. Use `issue-creation` for requested issue publication or updates.

## Execution Steps

1. Review the requested reports and relevant existing work. Identify duplicates, distinct bugs, feature requests, and missing evidence without expanding scope to the entire backlog unasked.
2. Trace affected callers and reproduce representative failures, including differing paths within a proposed group.
3. Recommend one bounded fix per verified cause, with a relevant failing check when implementation is requested. Allow standalone fixes and justified additions.
4. Verify the original scenarios after any authorized fix. Report remaining failure modes; do not close a report while part remains unresolved.

## Output Contract

Return affected reports, supported causes, recommended fixes, evidence, and unresolved questions. Use a table only when it improves comparison.
