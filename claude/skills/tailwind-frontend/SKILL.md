---
name: tailwind-frontend
description: Use for frontend work in any technology, including Django templates, React, static HTML, Vue, or other web UI, when styling, responsive layout, components, or CSS migration is involved.
---

# Tailwind Frontend

Use Tailwind CSS as the default styling system for every frontend project, regardless of the frontend technology.

## Default Rules

- Inspect the project's existing Tailwind version and build setup before editing.
- Use the current Tailwind syntax for the installed version; prefer Tailwind v4 CSS-first configuration when the project uses v4.
- Put layout, spacing, typography, states, and responsive behavior in utility classes on the component markup.
- Keep JavaScript or template logic focused on structure and behavior, not styling state hidden in CSS selectors.
- Build class names from complete static tokens. Do not construct partial Tailwind class names dynamically.
- Preserve the host design system, existing tokens, accessibility semantics, and visual language.
- Use mobile-first responsive utilities and verify narrow and wide layouts.
- Add visible focus states and respect touch target sizing for interactive controls.

## CSS Boundary

Keep custom CSS only when it has a clear ownership boundary:

- Theme tokens, CSS variables, `@theme`, and `@utility` definitions.
- Global reset or typography rules that cannot be expressed as utilities.
- Complex animations, pseudo-elements, third-party overrides, or genuinely reusable domain components.
- Temporary compatibility rules during an explicit migration.

When migrating an existing CSS file:

1. Inventory selectors and locate every markup usage.
2. Convert one component at a time to complete Tailwind utility classes.
3. Verify the rendered result at desktop and mobile widths.
4. Delete the migrated selector and remove the file when empty.

## Tooling

- Use the project's package manager and task runner for Tailwind compilation.
- Prefer a live watcher for local development and a deterministic production build.
- Use official Tailwind documentation or Context7 for version-specific syntax.
- Do not add a frontend framework solely to use Tailwind.
