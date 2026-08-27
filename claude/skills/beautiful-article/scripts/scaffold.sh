#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# scaffold.sh —— One-command creation of a Beautiful Article workspace.
#
# Usage:
#   bash scripts/scaffold.sh <target-dir> [--theme=<id>] [--no-cover]
#   bash scripts/scaffold.sh --list-themes
#
# Examples:
#   bash <path-to-beautiful-article>/scripts/scaffold.sh ./my-article --theme=tufte
#   bash <path-to-beautiful-article>/scripts/scaffold.sh ./brief --theme=press --no-cover
#   bash <path-to-beautiful-article>/scripts/scaffold.sh --list-themes
#
# --no-cover: disables the article cover (on by default · screen 3:4 / PDF gets its own first page). See references/cover.md for details.
#
# The workspace installs **the latest published version of reacticle** from npm
# (reacticle: "latest" in package.json, so every fresh scaffold picks up whatever
# is newest at the time). No local reacticle repo needed.
#
# Once it finishes, read SKILL.md's "Phase 4 First Spread" + references/component-policy.md /
# raw-policy.md / the chosen theme's theme-profiles/<id>.md.
# ─────────────────────────────────────────────────────────────
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMPLATE="$SKILL_DIR/assets/scaffold-template"
PROFILES="$SKILL_DIR/theme-profiles/index.json"
DEFAULT_THEME="tufte"

list_themes() {
  echo "Available themes (from ${PROFILES}):"
  echo
  # No jq available, use grep + sed to pull out the fields
  grep -E '"id"|"label"|"mood"' "$PROFILES" | sed -E \
    -e 's/.*"id":[[:space:]]*"([^"]+)".*/  • \1/' \
    -e 's/.*"label":[[:space:]]*"([^"]+)".*/      \1/' \
    -e 's/.*"mood":[[:space:]]*"([^"]+)".*/      \1/'
  echo
  echo "Use --theme=<id> to pick one. Default: ${DEFAULT_THEME}."
}

# Validate that the theme id exists in theme-profiles/index.json
theme_exists() {
  grep -Eq "\"id\"[[:space:]]*:[[:space:]]*\"$1\"" "$PROFILES"
}

# ── Parse arguments ──
TARGET=""
THEME="$DEFAULT_THEME"
COVER=1
for arg in "$@"; do
  case "$arg" in
    --list-themes) list_themes; exit 0 ;;
    --theme=*) THEME="${arg#--theme=}" ;;
    --no-cover) COVER=0 ;;
    --cover) COVER=1 ;;
    --*) echo "✗ Unknown argument: $arg" >&2; exit 1 ;;
    *) [[ -z "$TARGET" ]] && TARGET="$arg" ;;
  esac
done

TARGET="${TARGET:-my-article}"

# ── Validate theme ──
if ! theme_exists "$THEME"; then
  echo "✗ Unknown theme '$THEME'. Available themes:" >&2
  echo >&2
  list_themes >&2
  exit 1
fi

# ── Target directory check ──
if [[ -d "$TARGET" && -n "$(ls -A "$TARGET" 2>/dev/null || true)" ]]; then
  echo "✗ Target directory '$TARGET' already exists and is not empty, aborting." >&2
  exit 1
fi
if ! command -v npm >/dev/null; then
  echo "✗ npm is required but was not found in PATH." >&2
  exit 1
fi

echo "▸ Creating a Beautiful Article workspace in $TARGET"
echo "▸ Theme: $THEME"
echo "▸ Cover: $([[ "$COVER" == "1" ]] && echo "on (screen 3:4 / PDF gets its own first page, see references/cover.md)" || echo "off")"
echo "▸ reacticle: installing the latest published version from npm"

mkdir -p "$TARGET"
# Copy the project template
cp "$TEMPLATE/package.json"        "$TARGET/package.json"
cp "$TEMPLATE/vite.config.ts"      "$TARGET/vite.config.ts"
cp "$TEMPLATE/tsconfig.json"       "$TARGET/tsconfig.json"
cp "$TEMPLATE/tsconfig.node.json"  "$TARGET/tsconfig.node.json"
cp "$TEMPLATE/index.html"          "$TARGET/index.html"

# Working-memory directories + article source directories
mkdir -p "$TARGET/source" "$TARGET/plan" "$TARGET/review" \
         "$TARGET/article/sections" "$TARGET/article/raw-blocks" "$TARGET/article/assets"
cp "$TEMPLATE/article/main.tsx"             "$TARGET/article/main.tsx"
cp "$TEMPLATE/article/Article.tsx"          "$TARGET/article/Article.tsx"
# One file per section: assembler + the first section component (the code anchor for parallel multi-agent work)
cp "$TEMPLATE/article/sections/01-opening.tsx" "$TARGET/article/sections/01-opening.tsx"

# Cover: on by default. With --no-cover, skip Cover.tsx and strip the __COVER_*__ section out of main.tsx.
if [[ "$COVER" == "1" ]]; then
  cp "$TEMPLATE/article/Cover.tsx" "$TARGET/article/Cover.tsx"
fi

# Keep empty directories around (git-friendly)
touch "$TARGET/article/raw-blocks/.gitkeep" "$TARGET/article/assets/.gitkeep"

# ── Inject the theme id (use perl to avoid escaping issues) ──
# main.tsx: <ThemeProvider theme="__THEME__">
# Article.tsx: colophon "· __THEME__ theme"
export RA_THEME="$THEME"
perl -pi -e 's/__THEME__/$ENV{RA_THEME}/g' "$TARGET/article/main.tsx"
perl -pi -e 's/__THEME__/$ENV{RA_THEME}/g' "$TARGET/article/Article.tsx"

# ── Cover toggle: handle the section wrapped by __COVER_*__ markers in main.tsx ──
# COVER=1 → remove the two __COVER_*_BEGIN__ / __COVER_*_END__ marker lines (keep the import and <Cover/> in between)
# COVER=0 → strip the markers together with everything in between (the cover does not take part in the build)
if [[ "$COVER" == "1" ]]; then
  # Delete the marker lines themselves, keep the Cover import and render
  perl -i -ne 'print unless /__COVER_(IMPORT|RENDER)_(BEGIN|END)__/' "$TARGET/article/main.tsx"
else
  # Delete the whole block between BEGIN..END (including both marker lines)
  perl -i -0pe 's{[^\n]*__COVER_IMPORT_BEGIN__.*?__COVER_IMPORT_END__[^\n]*\n}{}gs' "$TARGET/article/main.tsx"
  perl -i -0pe 's{[^\n]*__COVER_RENDER_BEGIN__.*?__COVER_RENDER_END__[^\n]*\n}{}gs' "$TARGET/article/main.tsx"
fi

# Record the starting theme
echo "$THEME" > "$TARGET/.theme"

cd "$TARGET"
echo "▸ Installing dependencies (including the latest reacticle, this may take a moment)..."
npm install >/dev/null 2>&1
# Make sure we get the current latest (force-refresh to latest even if the template ships a lockfile in the future)
npm install reacticle@latest >/dev/null 2>&1

INSTALLED_REACTICLE="$(node -e "console.log(JSON.parse(require('fs').readFileSync('node_modules/reacticle/package.json','utf8')).version)" 2>/dev/null || echo '?')"
echo "▸ reacticle version: $INSTALLED_REACTICLE"

echo "▸ Running a typecheck to confirm the wiring is OK ..."
if npx tsc --noEmit; then
  echo "✓ typecheck passed"
else
  echo "⚠ typecheck has issues (see above); dev / build may still work — please verify manually." >&2
fi

cat <<EOF

✓ Done. Workspace: $TARGET (theme $THEME, see .theme; reacticle $INSTALLED_REACTICLE)

Next steps:
  1. cd $TARGET
  2. npm run dev      # preview (Phase 4: write the first screen + first Section)
  3. Write the first screen (Hero/Lead) into article/Article.tsx (the assembler);
     write the first Section into article/sections/01-opening.tsx
     —— Hard rule: one Section per file, never write it into Article.tsx (this is the precondition for parallel multi-agent work).
  4. $([[ "$COVER" == "1" ]] && echo "Cover: replace <CoverPlaceholder /> in article/Cover.tsx with a design customized for the article + theme (read references/cover.md)." || echo "Cover: disabled. To enable it, rerun scaffold without --no-cover, or manually copy the Cover.tsx template.")
  5. Commit decisions to disk in source/ plan/ review/ (the Skill's long-term memory)

Build deliverable (Phase 8):
  • npm run build     # typecheck + single-page HTML → dist/index.html (CSS+JS inlined)
  • npm run html      # reuses the build, then copies it out as the deliverable article/article.html

Switch theme: change one word in article/main.tsx's <ThemeProvider theme="..."> (tufte / press).
Upgrade the component library: npm install reacticle@latest

Required reading before writing (paths are inside the Skill repo):
  • $SKILL_DIR/references/component-policy.md
  • $SKILL_DIR/references/raw-policy.md
  • $SKILL_DIR/theme-profiles/$THEME.md
EOF
