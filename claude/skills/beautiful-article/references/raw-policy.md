# Raw Policy

Raw is Beautiful Article's key form of expressiveness, but it must be constrained by the
**theme** and by **being an article**. Before writing Raw, read the Raw style section of the
chosen theme's `theme-profiles/<id>.md`.

## Raw is a complete web platform, not "drawing SVG"

**Inside Raw you can write any HTML / CSS / JS / React component — the entire web platform is at
your disposal.** SVG is only **one** of many means, never the default or the only option. Don't
think of Raw as "inline drawing" — that severely limits what the web can imagine. Choose freely
based on "which medium best explains this passage," for example:

- **Interaction**: sliders / toggles / collapsibles / steppers / calculators / small adjustable
  models / hypothetical simulations.
- **Layout and typography**: side-by-side comparisons, timelines, card grids, columns, large
  pull-quote type, distinctive heading rhythm (using HTML + CSS).
- **Motion**: CSS transitions / `@keyframes` / scroll reveals / animated state changes.
- **Data visualization**: HTML/CSS bars and heat, `<canvas>`, `<svg>` line/slope graphs only when
  needed.
- **Embedding and composition**: one-off widgets combining tables + controls + text, copyable
  snippets, comparison panels.

Ask only one question: **which implementation best serves this passage's comprehension /
argument / pacing?** Use that one, rather than reflexively drawing SVG.

## Core principle

- **Hand-write it for THIS article, not as a widget library.** Every Raw block should be invented
  on the spot for the paragraph beside it: writing about token cost? Write a small slider right
  now; writing about two competing approaches? Assemble a side-by-side comparison panel; writing
  about a volume trend? Only then consider an inline line chart. **Never** turn Raw into a fixed
  set of small components reused across the article (the same pipeline / the same color scheme
  showing up everywhere) — that degrades the free layer back into just another set of constrained
  components.
- **Free but consistent: use tokens.** Inside Raw, write whatever you want — any HTML / React
  component, `<style>` and `@keyframes`, inline styles, `<canvas>`, `<svg>` as needed, one-off
  interactions — but color / font / spacing must come from theme variables
  (`var(--ra-color-accent)`, `var(--ra-font-body)`, `var(--ra-space-4)`, …), so every block is
  unique yet still follows the theme when it changes.

## Allowed

- Any HTML / CSS / JS / React that serves the paragraph: lightweight interactive explanations,
  adjustable small widgets, custom layout and typography, side-by-side comparisons, conceptual
  motion, visual pauses in the reading rhythm, and SVG / canvas diagrams as needed — all as
  one-off implementations customized for the current paragraph.

## Forbidden

- Complex forms, drag-and-drop workbenches, full dashboards, product prototypes, animation
  unrelated to the article, color schemes independent of the theme, reusing fixed small
  components while pretending it's free expression.

## Raw by example (write fresh each time, don't reuse a fixed widget)

> The following are just a few common techniques (SVG / CSS animation / React interaction),
> **not an exhaustive list and not a priority order**. Layout, typography, comparison panels,
> `<canvas>`, and embedded small widgets are equally valid — choose based on "what best explains
> this passage."

```tsx
// 1) Only draw an inline SVG for this specific data point when a curve is actually needed (not the default choice)
<Raw title="Build size trend">
  <svg viewBox="0 0 300 80" width="100%">
    <polyline points={pts} fill="none" stroke="var(--ra-color-accent)" strokeWidth="2" />
  </svg>
</Raw>

// 2) An HTML string with one-off CSS / @keyframes (inlined into the output)
<Raw html={`
  <style>@keyframes ra-rise{from{height:0}to{height:var(--h)}}</style>
  <div style="display:flex;gap:8px;align-items:flex-end;height:80px">
    <i style="--h:60%;flex:1;background:var(--ra-color-accent);animation:ra-rise .6s ease"></i>
    <i style="--h:90%;flex:1;background:var(--ra-color-accent);animation:ra-rise .8s ease"></i>
  </div>
`} />

// 3) A small interactive component defined solely for this article
function TokenScale() {
  const [n, setN] = useState(50);
  return (
    <div>
      <input type="range" value={n} onChange={(e) => setN(+e.target.value)} />
      <span style={{ color: "var(--ra-color-accent)" }}>{n}%</span>
    </div>
  );
}
<Raw title="Drag to feel the gap"><TokenScale /></Raw>
```

Vary these across the article — different media, different layouts, different interactions — so
no two Raw blocks look alike. Variation is good; breaking the theme's character is not: a `tufte`
Raw should not turn into a glossy marketing dashboard, and a `press` Raw should not turn into a
cold neon terminal (unless the theme's md explicitly allows it).

## Raw self-check

- If this Raw block were removed, would the article's comprehension suffer?
- Which paragraph / argument does it serve?
- Does it use `--ra-*` tokens? Does it comply with the theme md?
- Does it make the article feel more like an app? (If so, cut it or fold it back into an
  explanatory visual / layout that serves reading.)
