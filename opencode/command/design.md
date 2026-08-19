---
description: Generate and compare visual design proposals in the local canvas
agent: build
---
Create a repository-grounded visual exploration for this brief: $ARGUMENTS

First inspect the target repository and identify the actual surface requested by the user. For a landing page, read the landing template, its CSS, shared tokens/components, README, and relevant image assets before designing anything. If a local app is already running, inspect the rendered page in the browser too. Preserve the repository's real brand, language, content, imagery, business behavior, and existing visual language unless the brief explicitly asks for a redesign.

Do not call `design_open`. `design_create_proposals` creates a private draft canvas without opening the user's browser.

Before generating proposals, load and apply the `ui-ux-pro-max` skill to establish a product-specific visual system and the `impeccable` skill to critique hierarchy, usability, responsive behavior, and interaction quality.

Use `design_create_proposals` to create exactly 3 distinct proposals. Every proposal must include complete semantic `html` and production-quality responsive `css`, not a generic placeholder, wireframe, or collection of absolute boxes. Use the real Spanish copy and assets from the repository. In proposal HTML, local images use `/api/asset?path=` followed by the URL-encoded repository-relative path, for example `/api/asset?path=static%2Fimg%2Flogo.png`. Include the major sections visible in the requested surface and use a mobile-first viewport by default: `390px` wide for a mobile landing unless the user explicitly asks for desktop. Vary hierarchy and composition deliberately, but keep all three proposals credible improvements over the incumbent repository.

Use normal HTML document flow, CSS Grid/Flexbox, semantic sections, responsive spacing, the repository typography, and its actual design tokens. Do not pass `nodes` unless the user specifically needs layer-level editing. The proposal must look finished at first render, not like an annotated wireframe. Compare each result mentally against the incumbent and discard any direction that is not clearly at least as polished.

For every proposal include `evidence`:
- `sourceFiles`: repository-relative templates, styles, tokens, or components inspected.
- `preservedContent`: real copy, behavior, and product facts preserved from the repository.
- `assetPaths`: repository-relative image paths actually used by the proposal.
- `designDecisions`: at least three specific hierarchy, typography, layout, imagery, or interaction decisions unique to this direction.
- `incumbentImprovement`: a concrete explanation of at least 80 characters describing why this direction improves the existing rendered surface.
- `iconStrategy`: explain which existing icon language is preserved and where descriptive inline SVG icons replace compact text-only utility actions.
- `assetTreatments`: for every asset path, declare the exact six-digit hex background used behind it and explain why the asset remains visible. Logos with dark/red artwork must not be placed directly on dark surfaces; use the repository-approved light plate, alternate asset, or another measured treatment.
- `contrastChecks`: provide at least four measured foreground/background hex pairs covering normal text, icons, and controls. Normal text must meet `4.5:1`; large text, icons, and control boundaries must meet `3:1`.
- `affordanceChecks`: review at least three important controls. For each, describe the visible signifier, hover/focus/press feedback, and its minimum target size in pixels; targets must be at least `44px`.
- `nielsenReview`: include each Nielsen heuristic exactly once with an observable finding and the concrete implementation response: `visibility-of-system-status`, `match-with-real-world`, `user-control-and-freedom`, `consistency-and-standards`, `error-prevention`, `recognition-rather-than-recall`, `flexibility-and-efficiency`, `aesthetic-and-minimalist-design`, `help-users-recognize-recover-errors`, and `help-and-documentation`.

The plugin validates these paths, semantic structure, responsive CSS, minimum implementation depth, local asset usage, and visual differentiation. If validation fails, fix the proposal and call `design_create_proposals` again; do not bypass or downgrade the design.

Use descriptive inline SVG icons for compact, familiar utility actions such as phone, Instagram/social, location, menu, close, previous/next, and similar controls. Match the repository's existing icon stroke, weight, and sizing. Keep a visible text label when the action is not universally recognizable; icon-only controls require `aria-label`. Do not use emoji or invent a second icon family.

Affordance is mandatory: interactive elements must look interactive without relying on hover alone. Use familiar shapes, visible boundaries or established link treatment, pointer cursor, at least 44px targets, and distinct `:hover`, `:focus-visible`, and pressed feedback. Do not use an icon when its meaning is ambiguous without a label.

Inspect the actual pixels and transparent areas of every logo/icon asset before choosing its surrounding surface. Never assume an image works on both light and dark backgrounds. Preserve sufficient clear space and do not recolor brand artwork unless the repository already provides that variant.

After draft creation, use browser automation on the URL returned by `design_create_proposals`. Inspect the Overview and each proposal at the requested viewport. Compare them against the incumbent rendered surface. Reject and regenerate any proposal with broken assets, clipping, overflow, illegible text, generic styling, weak hierarchy, or lower perceived quality than the incumbent. Perform at most one full regeneration pass, then one confirmation pass.

During browser QA, verify the primary journey against Nielsen's 10 heuristics, not just visual appearance: status feedback, real-world language, escape/undo paths, consistency, prevention, recognition, efficiency, minimalism, recoverable errors, and contextual help. Treat non-applicable heuristics explicitly rather than omitting them.

Do not modify application code yet. Only after visual QA passes, call `design_present` to open the browser for the user. The canvas opens in `Overview` and shows all 3 proposals together; click one to review it and mark one Approved. `Pages` remains available for direct navigation when needed.

When the user asks to implement the design, call `design_get`. Only implement when `approvedPageId` is set; translate the approved page into the project's actual UI stack and preserve the approved design intent. If there is no approved page, ask the user to approve one first.
