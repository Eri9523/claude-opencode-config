# HTML Output and Build

The workspace is a Vite + React + TS project that consumes `reacticle` from npm (the
latest published version). The article source is `article/Article.tsx` (mounted by
`article/main.tsx`, which is where the theme is fixed).

## Commands (from the workspace root)

| Command | Effect |
|---|---|
| `npm run dev` | Starts the preview (for iterating while writing in Phase 4 / 5). |
| `npm run build` | `tsc --noEmit` type-check **plus** building a self-contained single-page HTML file to `dist/index.html` (CSS + JS inlined). TS errors fail the build, keeping errors out of the deliverable. |
| `npm run html` | Reuses `npm run build` (including the type check), then copies the single-page HTML to `article/article.html` (**the deliverable**). |
| `npm run typecheck` | Type-checking only. |

The single file is produced by `vite-plugin-singlefile`: CSS + JS are fully inlined, so it
**opens offline and can be shared**.

## Switching themes

The theme is a one-word change in `<ThemeProvider theme="...">` inside `article/main.tsx`
(it must be a runtime theme id already registered in the component library: `tufte` /
`press`).

## PDF (optional — triggered by Checkpoint 3)

See `references/pdf-output.md` for details. One-line usage:

```bash
npm run html                                                   # produces article/article.html first
bash <path-to-beautiful-article>/scripts/html-to-pdf.sh        # → article/article.pdf
```

The script auto-detects a chromium-family browser on the system, injects a `@media print`
override into the HTML head (collapsing the TOC from a side-by-side grid into a
top-and-bottom stack, with the TOC occupying its own first page), and then prints headless
to PDF. No npm dependency, no Node required.

> Raw interactions can only render in their initial state in PDF. PDF has limited value
> for `interactive-explainer`-type articles; the user can decide at Checkpoint 3 whether to
> export one.

If a "copy as prompt / action items" button is wanted, you can attach `ExportBar` to the
article (unrelated to PDF).

## Delivery self-check

- `npm run html` succeeds, and `article/article.html` opens offline in a browser.
- No console errors; readable on both desktop and mobile, with no text overflow /
  clipping / unexpected blank areas.
