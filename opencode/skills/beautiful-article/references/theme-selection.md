# Theme Selection

The theme is responsible for **aesthetic character, typographic language, image style, Raw style,
code / formula style**. It is not a CSS skin, nor is it an information-density rule.

> CSS is for the browser to read; the theme profile is for the AI to read.

- **The component library owns the runtime theme**: CSS tokens, `ThemeProvider` registration,
  actual rendering. The registered runtime theme ids are in `src/theme/ThemeProvider.tsx`
  (currently: `tufte`, `press`).
- **The Skill owns the theme authoring profile**: `theme-profiles/index.json` + `<id>.md`, guiding
  the AI on how to choose and use a theme.

## Selection process

1. Read `theme-profiles/index.json`, get each theme's `bestFor` / `mood`.
2. Based on `source.md`'s content type / tone, pick 1-2 recommendations from the `bestFor`
   matches:
   - Technical / evidence-based / data-driven → `tufte`.
   - Narrative / commentary / publishing / product notes → `press`.
3. Read the chosen theme's `theme-profiles/<id>.md` (the authority to consult before writing /
   choosing images / Raw / code).
4. Write the choice + rationale into the **Theme** section of `plan/plan.md` (see
   `plan-template.md`).

## Density and Theme are decoupled

The theme profile can describe "recommended behavior at different information densities," but it
**must not be written as a restriction**. Examples:

- `tufte + 100% longform`: restrained long-form writing, data evidence, Raw highlights key
  concepts.
- `tufte + 40% visual-essay`: still holds up, Raw leans toward diagrams / evidence, low
  decoration.
- `press + 100% longform`: can do in-depth publishing-style articles.
- `press + 40% briefing`: stronger editorial rhythm and more text/image white space.

## Theme selection self-check

- Does the theme match the article type?
- At the current information density, how should the prose / Raw / image ratio be adjusted?
- Can Raw happen naturally under this theme? Does the imagery strategy match the theme?
- Is there a conflict between the theme and the source material? (Conflicts should be explained in
  the Theme section of `plan/plan.md`.)
- Does the runtime theme id actually exist in the component library? Does the Skill profile exist?

## Constraints for adding a new theme

Adding a new theme must satisfy **both** of the following:

1. The component library has the runtime theme CSS and a `ThemeProvider` registration
   (`src/theme/themes/<id>/`).
2. The Skill has a corresponding `theme-profiles/<id>.md`.
3. `theme-profiles/index.json` is bound to the correct runtime theme id.

- If only the Skill profile exists, with no component-library runtime theme → it can only be a
  candidate, not used for actual generation.
- If only the component-library runtime theme exists, with no Skill profile → the Agent must not
  proactively recommend it.
