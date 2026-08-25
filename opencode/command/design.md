---
description: Generate and compare visual design proposals in the local canvas
agent: build
---
Create a repository-grounded visual exploration for this brief: $ARGUMENTS

Approach this as the design lead at a small studio known for giving every client a visual identity that could not be mistaken for anyone else's. Three directions, each with its own point of view, all of them credible for this specific repository.

## 0. Qualify the brief before designing anything

Never design from an unqualified brief. The same surface is a different design when it is an internal tool than when it is a marketing page, and guessing that away wastes a whole round. In one short message, ask the user what the brief has not already answered:

- **Context**: internal tool, product UI, marketing surface, or a deliverable for a client?
- **Audience**: who actually opens this, how often, and how much do they already know?
- **Register**: formal and sober, neutral, or expressive and persuasive?
- **Primary action**: the one thing this surface has to get done.
- **Surface and viewport**: which page or screen, and mobile, desktop, or responsive.
- **Constraints and out of scope**: brand, stack, or content that must not change, and anything you must not touch.

Offer your best reading of the repository as the default for each question so that one line back from the user is enough. Ask once, ask only what is genuinely open, and never re-ask what the brief already states.

Then call `design_intake` with those answers. `userAnswers` carries what the user actually replied, close to verbatim: the intake is not yours to invent on their behalf. `design_create_proposals` refuses to open a round until an intake is recorded, and refuses again when the recorded intake answers a different brief, so record it before writing any HTML.

## 1. Ground yourself in the repository

First inspect the target repository and identify the actual surface requested. For a landing page, read the landing template, its CSS, shared tokens/components, README, and relevant image assets before designing anything. If a local app is already running, inspect the rendered page in the browser too. Preserve the repository's real brand, language, content, imagery, business behavior, and existing visual language unless the brief explicitly asks for a redesign.

Load and apply the `ui-ux-pro-max` skill to establish a product-specific visual system, and the `impeccable` skill to critique hierarchy, usability, responsive behavior, and interaction quality.

`ui-ux-pro-max` matches styles and palettes against the words in the brief; it has never seen this repository. When its recommendation conflicts with the brand the code actually carries — the real logo colors, the signage, the photography, the existing tokens — **the repository wins**. Take its structural and conversion guidance, discard its palette, and say in one line what you discarded and why. A recommended palette that contradicts the real brand is a wrong answer, not a bold one.

Do not call `design_open`. `design_create_proposals` creates a private draft canvas without opening the user's browser.

## 2. Plan each direction before writing any code

Every direction has to answer the recorded intake: its context, audience, register, and primary action. A formal internal tool and a persuasive marketing page do not share a type scale, a density, or a tone of voice, and three directions for the wrong context are three wasted directions.

For each of the three directions, write the `plan` first:

- `palette`: 4–6 named hex values. Every one must actually appear in the CSS you then write.
- `typography`: at least a `display` and a `body` role. Name real families and say where each is used. Pair them deliberately — not the families you would reach for on any other project.
- `layoutConcept`: the composition in prose. Ideate with ASCII wireframes in your head before committing.
- `signature`: the single element this design will be remembered by, and which embodies the brief. One per direction, and different in each.
- `risk`: the one deliberate aesthetic risk this direction takes, and why it is justified here. Not taking a risk is itself a risk.

Then review the three plans against the brief. **Calibration — current AI-generated design clusters around three looks:** (1) a warm cream background near `#f4f1ea` with a high-contrast serif display and a terracotta accent; (2) a near-black background with a single acid-green or vermilion accent; (3) a broadsheet layout with hairline rules, zero border-radius, and dense newspaper columns. All three are legitimate for some briefs, but they are defaults rather than choices. Where the brief pins down a direction, follow the brief exactly. Where it leaves an axis free, do not spend that freedom on one of these defaults. If any part of a plan reads like what you would produce for any similar page, revise it and say what you changed.

Spend your boldness in one place per direction: let the signature element carry it and keep everything around it quiet and disciplined.

The plugin enforces that the three directions differ in signature, palette, and typeface pairing — because those are where a direction earns its personality, not the copy around them.

## 3. Build the proposals

**Submit one proposal per call.** Call `design_create_proposals` with a single proposal and `append: false` to open the round, then once more per remaining direction with `append: true`. A round holds 3. Do not put all three in one call: a finished proposal is several thousand tokens of JSON, so three at once is a payload large enough to time out, and any single failed check throws away all three. One at a time fails fast and cheap, and each proposal is still checked for differentiation against the ones already stored.

Every proposal must include:

- Complete semantic `html` and production-quality responsive `css` — not a placeholder, wireframe, or collection of absolute boxes. Use the real Spanish copy and assets from the repository.
- Its own `background` as a six-digit hex. Nothing is inherited; declare the surface you designed.
- `fonts`: the Google Fonts family specs the canvas must load, e.g. `["Fraunces:opsz,wght@9..144,400;9..144,700", "Inter:wght@400;600"]`. A family you never declare will silently fall back to a system font and the design you see is not the design you wrote. System stacks need no declaration.
- The `plan` from step 2, unchanged. Derive every color and type decision in the code from it.

Local images use `/api/asset?path=` followed by the URL-encoded repository-relative path, e.g. `/api/asset?path=static%2Fimg%2Flogo.png`. Include the major sections visible in the requested surface and use a mobile-first viewport by default: `390px` wide for a mobile landing unless the user explicitly asks for desktop.

Use normal HTML document flow, CSS Grid/Flexbox, semantic sections, responsive spacing, and the repository's actual design tokens. Do not pass `nodes` unless the user specifically needs layer-level editing. Match complexity to the vision: maximalist directions need elaborate execution, minimal directions need precision in spacing, type, and detail. Watch your selector specificity — type-based and element-based selectors that cancel each other out cause most spacing bugs.

Quality floor, enforced by the plugin: responsive behavior, `:hover`, visible `:focus-visible`, pointer affordance, interaction transitions, and `prefers-reduced-motion` honored wherever you animate.

## 4. Evidence

For every proposal include `evidence`:
- `sourceFiles`: repository-relative templates, styles, tokens, or components inspected.
- `preservedContent`: real copy, behavior, and product facts preserved from the repository.
- `assetPaths`: repository-relative image paths actually used by the proposal.
- `designDecisions`: at least three specific hierarchy, typography, layout, imagery, or interaction decisions unique to this direction.
- `incumbentImprovement`: at least 80 characters on why this direction improves the existing rendered surface.
- `iconStrategy`: which existing icon language is preserved, and where descriptive inline SVG icons replace compact text-only utility actions.
- `assetTreatments`: for every asset path, the exact six-digit hex background used behind it and why the asset stays visible. Logos with dark/red artwork must not sit directly on dark surfaces; use the repository-approved light plate, an alternate asset, or another measured treatment.
- `contrastChecks`: at least four measured foreground/background hex pairs covering normal text, icons, and controls. Normal text meets `4.5:1`; large text, icons, and control boundaries meet `3:1`. **These must be colors the CSS actually uses** — the plugin cross-checks them, so a passing pair you never applied is a failure, not a shortcut.
- `affordanceChecks`: at least three important controls. For each, the visible signifier, hover/focus/press feedback, and minimum target size in pixels; targets at least `44px`.
- `nielsenReview`: each Nielsen heuristic exactly once with an observable finding and the concrete implementation response: `visibility-of-system-status`, `match-with-real-world`, `user-control-and-freedom`, `consistency-and-standards`, `error-prevention`, `recognition-rather-than-recall`, `flexibility-and-efficiency`, `aesthetic-and-minimalist-design`, `help-users-recognize-recover-errors`, `help-and-documentation`.

If validation fails, fix the proposal and call `design_create_proposals` again. Do not bypass or downgrade the design to satisfy a check.

## 5. Icons, affordance, and assets

Use descriptive inline SVG icons for compact, familiar utility actions such as phone, social, location, menu, close, and previous/next. Match the repository's existing icon stroke, weight, and sizing. Keep a visible text label when the action is not universally recognizable; icon-only controls require `aria-label`. Do not use emoji or invent a second icon family.

Interactive elements must look interactive without relying on hover alone: familiar shapes, visible boundaries or established link treatment, pointer cursor, at least 44px targets, and distinct `:hover`, `:focus-visible`, and pressed feedback.

Inspect the actual pixels and transparent areas of every logo/icon asset before choosing its surrounding surface. Never assume an image works on both light and dark backgrounds. Preserve clear space and do not recolor brand artwork unless the repository already provides that variant.

## 6. Look at your own work before showing it

Call `design_screenshot` and then **read every returned PNG**. A rendered pixel is worth a thousand tokens of self-assessment — webfonts, overflow, clipping, and weak hierarchy only become obvious once rendered. Screenshot at the requested viewport and compare each proposal against the incumbent rendered surface.

Reject and regenerate any proposal with broken assets, clipping, overflow, illegible text, fonts that failed to load, generic styling, weak hierarchy, or lower perceived quality than the incumbent. Verify the primary journey against Nielsen's 10 heuristics, not just visual appearance. Perform at most one full regeneration pass, then one confirmation pass.

Also apply Chanel's test before presenting: look at each design and remove one accessory.

## 7. Present, then implement

Do not modify application code yet. Only after visual QA passes, call `design_present` to open the browser for the user. The canvas opens in `Overview` showing all 3 proposals together; `Pages` remains available for direct navigation.

**The moment the user tells you which direction they prefer — by name, by number, or by describing it — call `design_approve` with it.** Never ask them to click Approve in the canvas; saying it is enough. The canvas button stays available for when they'd rather use it, but it is not a step you may require of them.

On a later round, the plugin records what you already explored and rejects a direction that repeats the previous round's. Pass `refinement: true` only when the user explicitly asked to refine an existing direction rather than see new ones.

When the user asks to implement the design, call `design_get`. Only implement when `approvedPageId` is set; translate the approved page into the project's actual UI stack and preserve the approved design intent. If nothing is approved and the user has already expressed a preference in conversation, approve it with `design_approve` rather than asking them again.
