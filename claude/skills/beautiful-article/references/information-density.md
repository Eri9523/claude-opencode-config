# Information Density

Information density (the proportion of information retained) determines **the ratio of
prose to visual blocks, how aggressively content is cut, and section depth**.

**Relationship to article type**: in theory the two are independent; in practice they're
tightly coupled — every article type carries a standard retention ratio (see the table
below). Plan Checkpoint 1 bundles the "retention ratio" into the semantic options for
"article type" when collecting input, avoiding pseudo-combinations like
`longform + 20%` (see the note at the top of `article-types.md` for details). It's only
recorded as a non-standard combination in the Brief section of `plan/plan.md` **when the
user explicitly asks for fine-tuning** (e.g., "longform but only 60%").

Default: **100% information retention** (follows the default type, `longform`).

## Information density tiers

| Retention | Recommended article type | Good fit | Expressive characteristics |
|---|---|---|---|
| 100% | longform | A full archive, original-depth reading | Mostly long-form prose, enhanced with Raw, full sections and detail |
| 80-90% | tutorial / full-report / explainer / dialogue | Instructional steps / a digested report / concept explanation / a compiled conversation | Trim redundancy but keep the main argument, steps, and dialogue |
| 60-70% | review / essay | Engineering review / opinion commentary | Keep the core evidence, argument, and key findings |
| ~50% | briefing | For decision-makers | Keep conclusions + key evidence + actions; visual proportion goes up |
| 40% | visual-essay | Sharing, distribution, image-and-text display | Visual blocks take up the largest share, text is shorter, rhythm is emphasized |
| **~25% (verbatim excerpts from the source)** | interactive-explainer | Playing with a concept until it clicks (Raw interaction is the primary vehicle) | **Special case: the percentage means something different** — it's not "cut 75%," but rather "sentences / passages that come directly from the source make up about 25% of the finished piece"; the other 75% is entirely new guiding text + interactive demonstrations + hands-on exercises + comprehension checks that the AI writes around the core ideas |
| 20% | one-page teaser / cover-style expression | Driving readers onward, a cover | Keep only the core argument and the most powerful material (any registered type combined with 20% counts as a "non-standard combination" and must be noted in plan.md) |

## Information density vs. component / visual proportion

| Retention | Prose proportion | Raw / image proportion | Component strategy |
|---|---|---|---|
| 100% | High | Low-medium | Long-form prose first, Raw highlights key concepts |
| 80% | Medium-high | Medium | Each section can have one visual enhancement |
| 60% | Medium | Medium-high | Key structure is emphasized, visuals aid comprehension |
| 40% | Medium-low | High | Stronger image-and-text rhythm, but it's still an article |
| 20% | Low | High | Close to a visual essay, no detail retained |

## Relationship among the three dimensions

```text
Article type    = a structural decision
Information density = a content-retention decision   ← practically bound to type (each type has a standard ratio), decoupled only when the user fine-tunes
Theme            = an aesthetic-mood decision   ← fully decoupled from the previous two
```

- Theme is **fully decoupled** from type / density: any theme can hold up under any type +
  density combination (only the expressive strategy differs).
- Type and density are **bound in practice**: see the merging question in SKILL.md Phase 3;
  they're only explicitly decoupled for a "non-standard" combination.

## Plan Checkpoint must-ask

1. Article type (including its standard information-retention ratio) — see SKILL.md
   Phase 3, one of the 4 required questions.
2. Is editorial cutting, reorganizing, or rewording the tone allowed? — allowed by default,
   stated explicitly in the opening explanation.
3. Which information must be 100% retained? — written into the "information that must be
   retained" list in the Brief section.
4. Which content can be compressed or removed? — written into the "information that can be
   cut" list in the Brief section.
