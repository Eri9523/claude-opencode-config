#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# html-to-pdf.sh —— Convert a Beautiful Article single-page HTML file into a PDF
#
# Usage:
#   bash <skill>/scripts/html-to-pdf.sh [input.html] [output.pdf]
#   bash <skill>/scripts/html-to-pdf.sh                       # defaults to article/article.html → article/article.pdf
#   bash <skill>/scripts/html-to-pdf.sh --help
#
# Prerequisite: one of Chromium / Google Chrome / Brave / Microsoft Edge is
# installed locally (the script auto-detects it). No npm package, no Node needed.
#
# Design notes (see references/pdf-output.md for details):
#   1. reacticle's default TOC is a left-right grid on desktop; PDF needs a stacked TOC-on-top, body-below layout.
#   2. The script injects an @media print CSS override into the HTML head: collapses
#      the TOC into a single column, removes sticky positioning, uses two columns for a long TOC to save paper, forces a page break after the TOC, hides headers/footers other than the colophon, etc.
#   3. Renders with a headless browser's --print-to-pdf (executes page JS, so Raw
#      interactive elements render in their initial state); outputs standard A4 / a full-bleed theme paper-color background + 0.45in content margins, with no browser-supplied header/footer.
#   4. Failure fallback: prints guidance to "manually use the browser's Cmd+P → Save
#      as PDF", and leaves the injected HTML in a temp directory so the user can print it themselves.
# ─────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CSS_FILE="$SCRIPT_DIR/pdf-print-overrides.css"

INPUT="${1:-article/article.html}"
OUTPUT="${2:-article/article.pdf}"

if [[ "$INPUT" == "--help" || "$INPUT" == "-h" ]]; then
  sed -n '2,21p' "$0"
  exit 0
fi

if [[ ! -f "$INPUT" ]]; then
  echo "✗ Input file does not exist: $INPUT" >&2
  echo "  Run npm run html in the workspace first to produce article/article.html." >&2
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT")"

# ── Detect an available chromium-family browser ─────────────────────
find_browser() {
  local candidates=(
    chromium
    chromium-browser
    google-chrome
    google-chrome-stable
    chrome
    brave-browser
    microsoft-edge
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary"
    "/Applications/Chromium.app/Contents/MacOS/Chromium"
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
    "/Applications/Arc.app/Contents/MacOS/Arc"
    "/usr/bin/chromium"
    "/usr/bin/google-chrome"
    "/snap/bin/chromium"
  )
  for c in "${candidates[@]}"; do
    if command -v "$c" >/dev/null 2>&1; then
      echo "$c"; return 0
    fi
    if [[ -x "$c" ]]; then
      echo "$c"; return 0
    fi
  done
  return 1
}

# ── Inject the @media print override into a temporary HTML file ─────────────────
# Design: the CSS is pulled out into scripts/pdf-print-overrides.css (see the comment
# at the top of that file for details); this script is only responsible for "wrapping
# its content in a <style> tag and inserting it before </head>". This way:
#   • macOS BSD awk does not accept -v passing a multi-line string ("newline in
#     string"); reading from the file with awk's getline works on both.
#   • The CSS file can be edited / linted / reused independently, without being
#     swallowed by shell escaping.
TMP_DIR="$(mktemp -d -t beautiful-article-pdf.XXXXXX)"
TMP_HTML="$TMP_DIR/article-print.html"

if [[ ! -f "$CSS_FILE" ]]; then
  echo "✗ Print override CSS not found: $CSS_FILE" >&2
  echo "  This file should live alongside the script (scripts/pdf-print-overrides.css)." >&2
  exit 2
fi

awk -v css_file="$CSS_FILE" '
  /<\/head>/ && !done {
    print "<style id=\"ra-pdf-overrides\">"
    while ((getline line < css_file) > 0) print line
    close(css_file)
    print "</style>"
    done = 1
  }
  { print }
' "$INPUT" > "$TMP_HTML"

if ! grep -q 'ra-pdf-overrides' "$TMP_HTML"; then
  echo "✗ Injection failed: no </head> found in the input HTML." >&2
  echo "  Your article.html may not be a Vite + reacticle single-page build output." >&2
  exit 3
fi

# ── Find a browser ──────────────────────────────────────────────
BROWSER="$(find_browser || true)"
if [[ -z "$BROWSER" ]]; then
  echo "⚠ No chromium-family browser found (chromium / google-chrome / brave / edge)."
  echo
  echo "  Fallback: the HTML with the print CSS injected has been placed at:"
  echo "  $TMP_HTML"
  echo
  echo "  Open it in a browser → Cmd+P / Ctrl+P → change the destination to 'Save as PDF' → Save."
  echo "  The injected print styles put the TOC on top and the body below, matching PDF reading conventions."
  exit 3
fi

echo "▸ Using browser: $BROWSER"
echo "▸ Input: $INPUT"
echo "▸ Output: $OUTPUT"

# ── Render ──────────────────────────────────────────────────
# All Chromium-family browsers support --headless --print-to-pdf.
# --no-pdf-header-footer: removes the browser's built-in URL / date / page number (the colophon already has these).
# --virtual-time-budget: gives page JS a bit of time to initialize Raw components (5s safety margin).
# --hide-scrollbars: avoids scrollbar artifacts showing up in the PDF.
"$BROWSER" \
  --headless=new \
  --disable-gpu \
  --no-sandbox \
  --hide-scrollbars \
  --no-pdf-header-footer \
  --virtual-time-budget=5000 \
  --print-to-pdf-no-header \
  --print-to-pdf="$OUTPUT" \
  "file://$TMP_HTML" 2>/dev/null || {
    # Older Chrome versions don't recognize --headless=new, fall back to the old flag
    "$BROWSER" \
      --headless \
      --disable-gpu \
      --no-sandbox \
      --hide-scrollbars \
      --print-to-pdf-no-header \
      --print-to-pdf="$OUTPUT" \
      "file://$TMP_HTML" 2>/dev/null
  }

# Clean up the temp dir (the injected HTML was kept as fallback evidence, clean up now)
rm -rf "$TMP_DIR"

if [[ -f "$OUTPUT" ]]; then
  SIZE="$(du -h "$OUTPUT" | cut -f1)"
  echo "✓ PDF output: ${OUTPUT} (${SIZE})"
  echo
  echo "  If the TOC / page breaks aren't ideal, see the troubleshooting section in references/pdf-output.md."
else
  echo "✗ Browser returned success but the output file does not exist: $OUTPUT" >&2
  exit 4
fi
