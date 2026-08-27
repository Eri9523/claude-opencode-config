# Scaffold

The scaffold creates the article workspace in Phase 4; **engineering code does not get stuffed
into SKILL.md**. The engineering template is a Skill asset (`assets/scaffold-template/`), copied
and wired up by `scripts/scaffold.sh`.

## Usage

```bash
bash <path-to-beautiful-article>/scripts/scaffold.sh ./my-article --theme=tufte
bash <path-to-beautiful-article>/scripts/scaffold.sh ./brief --theme=press --no-cover
bash <path-to-beautiful-article>/scripts/scaffold.sh --list-themes
```

`--theme` must be an id from `theme-profiles/index.json` (currently `tufte` / `press` / …). The
workspace can be created in **any directory** — it doesn't need to be inside the reacticle repo.

`--no-cover` disables the book-cover-style article cover (on by default — screen 3:4 / PDF gets
its own first page). Pass this when the user chose "Cover · off" at Checkpoint 1. See
`references/cover.md` for details.

## What the scaffold does

- Creates the workspace directory + copies the Vite / React / TS template.
- **Installs the latest published version of `reacticle` from npm**: `package.json` has
  `reacticle: "latest"`; after installing dependencies, the scaffold force-refreshes to the
  current latest with `npm install reacticle@latest`, and prints the actual version.
- Writes the chosen runtime theme id into `article/main.tsx` and does `import "reacticle/styles.css"`.
- Creates a default `article/Article.tsx` + `article/sections/`, `article/raw-blocks/`,
  `article/assets/`. `Article.tsx` comes with a **colophon Raw block** at the end
  (`Made with [beautiful-article](github repo) · <theme> theme`), styled as low-contrast small
  text using `--ra-*` tokens, **must not be removed** (see the "Default Policy" section of
  SKILL.md).
- Creates **`article/Cover.tsx`** by default (a book-cover-style cover shell + placeholder: screen
  3:4 / PDF gets its own first page) and renders `<Cover />` above `<ArticleDoc />` in `main.tsx`.
  With `--no-cover`, this step is skipped: Cover.tsx is not copied, and the two blocks wrapped in
  `__COVER_IMPORT_*__` / `__COVER_RENDER_*__` markers are stripped from `main.tsx`. See
  `references/cover.md` for cover design.
- Creates the working-memory directories `source/`, `plan/`, `review/`.
- `katex` / `prismjs` are pulled in automatically as dependencies of `reacticle`; there's no need
  to declare them separately in the workspace.

## Upgrading the component library

The workspace can be upgraded to the latest component library at any time:

```bash
npm install reacticle@latest
```

## Workspace structure

```text
my-article/
  package.json  vite.config.ts  tsconfig.json  tsconfig.node.json  index.html
  source/   plan/   review/
  article/
    main.tsx        # entry point: <ThemeProvider theme="..."> + <Cover/> + <ArticleDoc/>
    Cover.tsx       # book-cover-style article cover: screen 3:4 / PDF gets its own first page (default; not generated with --no-cover)
    Article.tsx     # assembler (owned by the main Agent): imports + orders each Section, does not write Section body text
    sections/       # one file per section (hard rule): NN-*.tsx, each exports one Section component
      01-opening.tsx
    raw-blocks/     # isolation for large Raw blocks: NN-*.tsx
    assets/         # image/media assets
  .theme            # records the starting theme
```

> **One Section = one file** (`sections/NN-*.tsx`) — it is strictly forbidden to write multiple
> Sections into `Article.tsx`. `Article.tsx` only does assembly. This is the prerequisite for
> multi-Agent parallelism (the development mode chosen at Checkpoint 2); see
> `references/section-build.md` for details.

## Switching themes

Change two places (the scaffold injects the theme name into these two spots by default):

1. `<ThemeProvider theme="...">` in `article/main.tsx` (controls the runtime theme).
2. The colophon `· <theme> theme` at the end of `article/Article.tsx` (controls the theme name
   shown in the imprint).

Keep both in sync. See `html-output.md` for details.

## Build / preview

See `references/html-output.md` (`npm run dev` / `build` / `html`).
