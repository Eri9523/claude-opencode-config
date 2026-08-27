import { Article, Hero, Lead, Raw } from "reacticle";
import { SectionOpening } from "./sections/01-opening";

// Article.tsx is the ASSEMBLER, owned by the main agent. It imports and orders
// Section components — it must NOT contain Section bodies inline.
//
// Hard rule: each Section is its own component file (article/sections/NN-*.tsx); it is
// absolutely forbidden to write multiple Sections directly in here. This lets multiple Agents write
// one section file each in parallel, while the main Agent is responsible here for merging and
// stability. See references/section-build.md for details.
//
// width (narrow/regular/wide/full) + toc are confirmed at the Plan Checkpoint, decoupled from
// the theme (see references/layout.md).
export function ArticleDoc() {
  return (
    <Article toc width="regular">
      <Hero
        title="Article Title"
        subtitle="Subtitle: one sentence framing what this piece sets out to resolve"
        meta={[{ label: "Date", value: "2026-06-08" }]}
      />
      <Lead>Lead: one or two sentences framing the topic and the takeaway judgment the reader should leave with.</Lead>

      <SectionOpening />
      {/* Add more section components here in order: <SectionContext /> <SectionMechanism /> … */}

      {/*
        ─── Colophon ───
        Every Beautiful Article must keep this block, placed right before </Article>, after all
        Sections / the Conclusion. It is the article's "imprint", telling readers what workflow
        produced this piece.

        Constraints:
          • Do not delete it. Do not move it next to the Hero or float it into a corner.
          • The text format is fixed: Made with beautiful-article (linked to the github repo) · <theme> theme
          • The theme name (the __THEME__ placeholder below) is written in by scaffold; when
            switching themes, update it here and in main.tsx's <ThemeProvider theme="..."> in sync.
          • Styling may only use --ra-* tokens so it adapts with the theme; keep it low-contrast, small text, centered.
      */}
      <Raw title="">
        <footer
          style={{
            marginTop: "var(--ra-space-7, 3rem)",
            paddingTop: "var(--ra-space-4, 1rem)",
            borderTop: "1px solid var(--ra-color-border, currentColor)",
            color: "var(--ra-color-muted, inherit)",
            fontSize: "var(--ra-text-xs, 0.78rem)",
            textAlign: "center",
            letterSpacing: "0.02em",
            opacity: 0.85,
          }}
        >
          Made with{" "}
          <a
            href="https://github.com/ConardLi/garden-skills"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              textDecoration: "underline",
              textUnderlineOffset: "0.2em",
            }}
          >
            beautiful-article
          </a>{" "}
          · __THEME__ theme
        </footer>
      </Raw>
    </Article>
  );
}
