# Image and Asset Policy

Images must serve the article, not decorate it. Phase 2 writes the image policy and the
shot-by-shot plan into the **Assets** section of `plan/plan.md` (see `plan-template.md`);
**no separate `asset-plan.md` file is produced anymore**.

## Orthogonal to Raw: the image policy governs Image only, never Raw (iron rule)

**Image policy = whether to use an external `Image`, and which source to use. It is
completely orthogonal to `Raw`, not an either/or choice:**

- **`Raw` always exists** as the default expressive layer for every article (any HTML /
  CSS / JS / React: interaction, custom layout and typesetting, motion, widgets, and SVG /
  canvas diagrams as needed). It is unaffected by the image policy and never needs the
  user to "turn it on."
- **`Image` is a separate, optional overlay layer**, and the image policy decides whether
  to use it and which source to use.
- Choosing `none` **does not mean** "use Raw in place of Image" — it only means "no
  external images are used." `Raw` is used as usual regardless.

> Don't frame this as "Image vs. Raw." The correct mental model is: "Raw is always
> present; whether to use Image, and which source, is explicitly chosen by the user at
> the Plan Checkpoint."

## Four source modes (Image only)

| Mode | Description | Good fit |
|---|---|---|
| `user-assets` | User supplies screenshots / photos / charts / an asset directory | Product articles, code reviews, real reports |
| `placeholders` | Use placeholder images or image-slot notes for now | User will supply assets later |
| `ai-generated` | AI generates image prompts based on the article and theme | Visual essays, concept explainers, cover images |
| `none` | No external images (the `Raw` freeform layer / tables are unaffected and used as usual) | tufte-style, technical analysis, evidence-driven articles |

**Do not generate AI images proactively**: `ai-generated` requires the user's explicit
choice. But even choosing `none` does not affect `Raw`.

## Asset Checkpoint must-ask (inside the Plan Checkpoint — the user must choose; never default through)

The image mode is a **required choice** — it must not be waved through with a default
value. State in one sentence that "Raw is used as usual," then have the user explicitly
pick one of the four **Image** sources:

```text
Image mode (this only decides whether to use an external Image; the Raw freeform layer —
interaction / layout / motion / diagrams — is unaffected and used as usual).
Please pick one of the following four:
- none: no external images, expressed through prose + Raw + tables (recommended for
  technical / evidence-driven articles).
- user-assets: you supply an asset directory or screenshots, and I lay them out accordingly.
- placeholders: I place placeholder images for now and annotate in the Assets section of
  plan.md what each one should be replaced with.
- ai-generated: I generate image prompts first, and generate the images only after you confirm.
My recommendation: <policy>, reason: <one sentence>. Do you confirm, or want a different one?
```

## Principles for ai-generated prompts

When `ai-generated` is chosen, **do not casually generate images directly** — first list
each image in the Assets section of `plan/plan.md`: position · the paragraph/argument it
serves · purpose · thematic style · composition · exclusions · prompt · alternate prompt.

Example:

```text
Image 01
Position: Hero background
Purpose: establish a "technical publication" mood, without explaining the specific mechanism
Theme: press
Style: warm editorial still life, paper texture, low saturation
Exclude: 3D icon, neon gradient, SaaS stock photo, smiling office people
Prompt: Warm editorial photograph of a desk with annotated technical notes,
printed code snippets, a graphite pencil, soft morning light, low saturation,
refined book-publishing mood, no screens, no logos.
```

## Image self-check (per image)

- Does it serve a specific location in the article? Does it match the media style of the
  selected theme `theme-profiles/<id>.md`?
- Is it not purely decorative? Does it avoid upstaging the prose? Does it avoid duplicating
  what Raw already expresses?
- Does it have a caption / source / alt text?

The image self-check is folded into the Plan self-check (one of the 5 items: "Raw / images
have a purpose") — done inline by the main Agent, **no separate Asset Reviewer SubAgent is
spun up anymore**. See the Plan self-check section of `review-checklist.md` for details.
