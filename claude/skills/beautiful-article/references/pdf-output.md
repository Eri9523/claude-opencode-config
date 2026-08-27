# PDF Output (Optional)

Converts the delivered single-page HTML (`article/article.html`) into a PDF. **This is an optional
step in Phase 8 Delivery**, triggered by Checkpoint 3 when the user selects "Approve · export
HTML + PDF"; if not selected, nothing happens.

> HTML remains the primary deliverable: it opens offline, is shareable, and lets you fully
> experience Raw interactions in the browser. PDF is a supplement for scenarios that need
> "archiving / printing / email attachment / offline reading" — **Raw interactions in the PDF can
> only render their initial state**.

---

## Quick usage

```bash
# Workspace root
npm run html                                                    # Make sure article/article.html exists first
bash <path-to-beautiful-article>/scripts/html-to-pdf.sh         # Default: article/article.html → article/article.pdf
bash <path-to-beautiful-article>/scripts/html-to-pdf.sh in.html out.pdf  # Custom paths
```

This bash call can also be added to the workspace's `package.json` scripts, so the user can just
run `npm run pdf` (the path is the absolute path of the Skill on the user's machine, **it is not
hardcoded into the scaffold template**, to avoid baking in a fixed path).

---

## Prerequisites

The machine has one of the chromium-family browsers installed (the script auto-detects, in the
following order):

```text
chromium / chromium-browser / google-chrome / google-chrome-stable / chrome
brave-browser / microsoft-edge
/Applications/Google Chrome.app/...
/Applications/Chromium.app/...
/Applications/Microsoft Edge.app/...
/Applications/Brave Browser.app/...
/Applications/Arc.app/...
/usr/bin/chromium / /snap/bin/chromium
```

**If no browser is found** → the script will not crash; it falls back with guidance: it prints the
path to a temporary HTML file with print CSS already injected, and the user can manually
`Cmd+P` / `Ctrl+P` → "Save as PDF" in any browser.

No dependency on Node / npm packages / puppeteer / playwright / weasyprint — it deliberately uses
only a browser already installed on the system, for zero environment setup.

---

## Design rationale (important — read before changing styles)

### 1. Why inject print CSS (instead of modifying reacticle)

reacticle's TOC is a **left-right grid** on desktop (`.ra-article-layout--with-toc` is
`display: grid`, two columns: TOC | article), and only collapses to a single-column
`display: block` on mobile (≤999px).

PDF reading habits favor **top-to-bottom layout** (TOC first / body after), which aligns with the
mobile experience. The cleanest implementation: **inject a block of `@media print` CSS** during PDF
generation, forcing `display: block`, equivalent to reusing the mobile branch. This means:

- **reacticle is untouched**: any version of reacticle can produce a reasonable PDF with this
  script.
- **The user's Article.tsx is untouched**: the user's source code is completely unaffected.
- **The CSS only applies to print**: viewing the HTML in a browser still shows the left-right grid.

### 2. Which rules are injected

The CSS has been extracted into a standalone file, **`scripts/pdf-print-overrides.css`** (in the
same directory as the script), organized into three groups:

```text
A · TOC layout (TOC on top / body below)
  A1) .ra-article-layout--with-toc { display: block }   → collapses to single column
  A2) .ra-toc { position: static; page-break-after: always } → removes sticky + owns the first page
  A3) .ra-toc__list { column-count: 2 }                 → two columns for a long TOC, saves paper
  A4) .ra-toc__item { break-inside: avoid }             → TOC items are not split across columns
  A5) .ra-article-layout--with-toc > .ra-article        → body flows naturally after the TOC
  A6) .ra-toc a / .ra-article a { text-decoration: none } → removes print link underlines

B · Pagination behavior (fixes large blank pages in long articles)
  B1) .ra-section / .ra-subsection { break-inside: auto !important }
        → reverts reacticle print.css's break-inside: avoid-page.
          For a long Section, that rule pushes the whole section to the next page,
          leaving most of the previous page blank.
  B2) h1-h4 + .ra-section__head + .ra-subsection__head { break-after: avoid }
        → headings are not orphaned (never left stranded at the bottom of a page
          with blank space below)
  B3) .ra-hero / .ra-lead / .ra-conclusion { break-inside: avoid }
        → keeps short opening / closing blocks atomic, not split
  B4) p / li / blockquote { orphans: 3; widows: 3 }
        → paragraphs don't leave 1-2 orphan/widow lines
  B5) figure / .ra-table / .ra-codeblock / .ra-formula / .ra-image / .ra-raw
        { break-inside: avoid }
        → figures, tables, code blocks, and Raw blocks stay whole where possible;
          the browser still auto-falls-back to paginating them when they're too tall

C · Cover (if the article has a 3:4 cover, give it the first PDF page to itself)
  C1) .ra-cover { break-after: always; break-inside: avoid }
        → both on screen and in the PDF, keeps the 3:4 book-cover proportions;
          in print, the TOC starts on page two
        → see references/cover.md for details
```

The full, commented CSS is in `scripts/pdf-print-overrides.css`. To adjust styling (e.g., change
the page-break strategy / change the two-column threshold / add a print watermark), **just edit
this file directly** — no need to touch the bash script.

> **Why the CSS is a standalone file**: macOS's built-in BSD awk throws a `newline in string` error
> on a multi-line string passed via `-v inject="$INLINE_CSS"` (GNU awk is fine with it). By
> extracting the CSS into a file, awk can read it with `getline < file`, which works for both awk
> variants. As a bonus, the CSS becomes a real asset that can be independently edited / linted /
> diffed.

reacticle's own `print.css` still applies (white background / black text, hidden export bar,
`break-inside: avoid`, etc.); this script only supplements the TOC layout piece.

### 3. Rendering pipeline

```
article.html  ──── awk injects print CSS ────  /tmp/article-print.html
                                                  │
                                                  ▼
                  detected browser --headless --print-to-pdf
                                                  │
                                                  ▼
                                          article.pdf
```

Chrome flags:

- `--headless=new` (falls back to `--headless` on older versions): windowless mode.
- `--no-pdf-header-footer` / `--print-to-pdf-no-header`: removes the browser's built-in URL / date /
  page-number header and footer (which would clash with the role of the colophon).
- `--virtual-time-budget=5000`: gives the page 5 seconds for JS initialization, so Raw components,
  KaTeX, Prism, etc. finish rendering before the capture.
- `--hide-scrollbars` / `--disable-gpu` / `--no-sandbox`: for a clean render.

### 4. What happens to Raw interactions in the PDF?

A PDF is a **static document**, so all Raw interactions (sliders, buttons, animations, canvas,
video) can only render their **initial state**. Design guidance:

- **interactive-explainer type**: PDF has limited value here (the point is "operating" the
  content), so the user can choose not to enable PDF export at the Plan stage.
- **Other types**: Raw is usually a supporting diagram (flowchart / SVG / trend chart), and the
  initial state is generally good enough — PDF is fine.
- **Content inside Raw that only appears on hover / click**: when writing Raw, consider whether it
  is "print-friendly" — for example, expose key content by default, or use `print:`-style rules to
  force hover states to expand when printing.

---

## Troubleshooting

### No browser found

The script prints the path to a temporary HTML file (with print CSS already injected); use manual
Cmd+P from there.

### The TOC in the PDF doesn't get its own page / crowds into the body

Some older Chromium versions have inconsistent support for `page-break-after: always`. You can:

- Upgrade Chrome to the current major version.
- Or, when printing manually via Cmd+P, choose "two-sided / scale / custom margins" in the print
  dialog.

### Odd pagination in the PDF / large blank pages / headings stranded at the bottom of a page

This is usually caused by some "atomic block" being forced to avoid breaking, pushing the whole
block to the next page. Check `pdf-print-overrides.css`:

- Whether **B1** is taking effect (check the `break-inside` value of `.ra-section` in DevTools
  Print Preview). The rule in reacticle's `print.css` has no `!important`, so ours should always
  win in theory.
- Check whether your own **Raw blocks** contain inline `style={{ breakInside: 'avoid' }}` or
  similar CSS — remove it.
- If you still want "headings should never be stranded at the bottom of a page", change
  `break-after: avoid` in B2 to `break-before: avoid; break-after: avoid` (more aggressive, but it
  occasionally sacrifices some page utilization).

### Raw doesn't render completely in the PDF / charts are blank

- Increase `--virtual-time-budget` (edit the script, from 5000 to 10000+).
- Check whether the Raw's JS renders synchronously within DOMContentLoaded (asynchronously loaded
  remote images / data might not be ready by the time the capture happens).
- Rework the Raw: use an SSR-friendly initial state plus client-side hydration enhancement, rather
  than something that's "only visible after JS finishes."

### The PDF font looks different from the browser

Does the theme use `@font-face` remote fonts? Headless Chrome doesn't wait for remote fonts to
finish loading by default. You can:

- Use a system font fallback (recommended, most themes already do this).
- Or inline the font as a `data:` URI in the HTML (vite-plugin-singlefile already handles static
  assets, but whether woff fonts are handled depends on how the theme wrote them).

### Wanting to customize page margins / paper size

Chromium's `--print-to-pdf` doesn't support command-line page-size / margin parameters. The
current CSS uses `@page { margin: 0 }` to let the theme's paper color fill the whole page, and then
uses `.ra-root { padding: 0.45in }` to provide content margins. If you need to change the margins,
adjust the `.ra-root` print padding in `scripts/pdf-print-overrides.css` first.

If the user really wants customization, we recommend:

1. Print via the browser GUI (Cmd+P) — margin / paper / scale options are available there.
2. Or fork a `html-to-pdf-puppeteer.sh` script to support customization separately. The current
   script outputs at Chrome's default page size (Letter in the US region / A4 elsewhere).

---

## Relationship to the Skill workflow

| Stage | Trigger | Action |
|---|---|---|
| Phase 8 Delivery | User selects "Approve · export HTML + PDF" at Checkpoint 3 | Run `npm run html` → run `bash <skill>/scripts/html-to-pdf.sh` → deliver `article.html` + `article.pdf` |
| Other Checkpoint 3 options | User selects "Approve · export HTML" | PDF is not run |
| User wants to add a PDF afterward | Any time | Manually run `bash <skill>/scripts/html-to-pdf.sh` from the workspace root |

---

## What this does NOT do

- ❌ Does not force-install any PDF-related npm packages into the scaffold (keeps the scaffold
  lightweight).
- ❌ Does not default-check "export PDF" at Checkpoint 3 (PDF is not the primary deliverable).
- ❌ Does not decide "whether PDF is needed" on the user's behalf — this is an independent choice
  for the user at Checkpoint 3.
- ❌ Does not modify reacticle to support PDF (CSS injection is lighter-weight and decoupled from
  the reacticle version).
