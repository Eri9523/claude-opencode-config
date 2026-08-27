# Repair Policy (Minimal Slice)

Repair at the smallest possible unit. **Only write** `review/repair-log.md` **if a repair was
made** (skip it if everything passed with no repairs needed).

## Forbidden

- Rewriting the **entire article** because the user reported a single issue.
- Changing an **already-confirmed article structure** just to fix a visual issue.
- Deleting content the user **specified as must-keep** for the sake of compressing information.

## Minimal-slice mapping

| Issue | Minimal repair unit |
|---|---|
| Missing information | The corresponding Section / Table / CodeBlock |
| Information too dense | The corresponding Section's paragraphs and local Raw |
| Wrong theme | The Theme section of `plan/plan.md` + local tokens / Raw |
| Wrong image | The corresponding image and the Assets section of `plan/plan.md` |
| Wrong first screen | Hero / Lead / Summary |
| Raw off track | The single Raw block |
| Mobile issue | The corresponding CSS / component layout |
| Build error | The specific file and line |

## repair-log.md format

```markdown
## <date> <who reported it / which Reviewer>
- Issue: <one sentence>
- Located at layer: <pacing / visual / content / build>
- Minimal repair unit: <Section 03 / raw-blocks/02 / main.tsx theme ...>
- Change: <what was changed>
- Verification: <dev preview / npm run html passes / no console errors>
```

First locate which layer is affected (content / structure / visual / build), then fix the minimal
slice — **do not redo the whole piece**.
