import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "reacticle";
import "reacticle/styles.css";
// __COVER_IMPORT_BEGIN__  (scaffold.sh strips this section, markers included, when --no-cover is used)
import { Cover } from "./Cover";
// __COVER_IMPORT_END__
import { ArticleDoc } from "./Article";

// Entry for the self-contained single-file HTML build.
// Theme is fixed here — change `theme` (must be a registered reacticle theme id:
// "tufte" | "press" | …) to switch the whole look.
//
// Render order: Cover (the cover, optional) → ArticleDoc (contains TOC + body + colophon).
// Cover is deliberately **not** placed inside <Article> (it would get squeezed next to the body
// column); instead it is a sibling of <ArticleDoc/> under ThemeProvider, so the DOM order
// naturally becomes "cover → TOC → body → colophon".
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme="__THEME__">
      {/* __COVER_RENDER_BEGIN__  (scaffold.sh strips this section, markers included, when --no-cover is used) */}
      <Cover />
      {/* __COVER_RENDER_END__ */}
      <ArticleDoc />
    </ThemeProvider>
  </StrictMode>
);
