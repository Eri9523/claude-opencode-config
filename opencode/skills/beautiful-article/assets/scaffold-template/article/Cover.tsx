// Cover.tsx —— the article cover (independent of Article, sits above the TOC + body + colophon)
//
// This file is article-specific (on equal footing with Article.tsx / sections/*.tsx).
// In Phase 4 First Spread, the main Agent replaces the 【Cover content area】 below with a design
// customized to **the theme + the article's main point**. **Do not touch the shell (3:4 ratio,
// positioning, PDF pagination)**.
//
// Hard constraints (see references/cover.md for details):
//   1. **Fixed 3:4 ratio (screen + PDF)**: don't change aspectRatio; when printing, .ra-cover
//      automatically takes over the whole first page — keep the screen-version 3:4 composition to
//      avoid Chromium print clipping the internal layout. Let inner elements adapt with
//      percentages / aspect-ratio / inset; don't write absolute px heights.
//   2. **Image and text together**: must have a visual element + brief text (title + optional
//      subtitle / small label). **A text-only cover is forbidden**. You choose whatever technique
//      for the visuals (see constraint 5).
//   3. **Theme fidelity**: color / font size / font weight / border / rhythm **may only use
//      `--ra-*` tokens**. The cover must refresh along when the theme is switched; don't hard-code
//      colors / font names / pixel sizes.
//   4. **Content fidelity**: the cover's main visual and text should echo the body's main point (a
//      reader should be able to guess what the article is about at a glance).
//   5. **Freedom of technique**: inline SVG / CSS geometry / Canvas / a complex React component /
//      typographic art / layered gradients / mask / clip-path / any combination — pick whatever, as
//      long as the final result looks good. **The only thing forbidden**: remote images
//      (offline-first); base64 raster is only allowed when the Plan Checkpoint's "illustration mode"
//      is user-assets / ai-generated.
//   6. **The cover does not carry body content**: don't cram in the Lead's first paragraph, the
//      TOC, or reading time — the cover only carries "identification + style signal + creating the
//      desire to read"; the body starts with the Article below.

export function Cover() {
  return (
    <section
      className="ra-cover"
      aria-label="Article cover"
      data-ra-cover=""
      style={{
        // ── Shell (please do not touch) ──
        position: "relative",
        width: "100%",
        // On screen it should look like "a book standing upright": capped at 48rem (768px) wide;
        // it also **derives width backward from viewport height**: (100vh - 8rem) * 3/4, to make
        // sure the whole 3:4 cover **fits on one screen, no scrolling needed**. 8rem (128px) leaves
        // generous breathing room for a top bar / margins / site nav etc. (a typical case: site nav
        // 60 + container top padding 32 + border 1 ≈ 93px, still 35px to spare).
        // The 3:4 ratio is guaranteed not to break by aspect-ratio.
        maxWidth: "min(100%, 48rem, calc((100vh - 8rem) * 3 / 4))",
        margin: "0 auto var(--ra-space-7, 3rem) auto",
        aspectRatio: "3 / 4",
        overflow: "hidden",
        // Transparent background: lets the outer .ra-root / .gx-reader's --ra-color-bg "paper
        // color" show through directly. The whole visual is one continuous sheet of paper, the
        // cover no longer "carries its own block of color". The cover's identity comes from the
        // internal illustration + border + content typography instead. If your cover **genuinely
        // needs** an overall color (e.g. a Memphis-theme large color block overlay), you can switch
        // to any theme token such as surface / surface-2 / accent-soft.
        background: "transparent",
        color: "var(--ra-color-fg, inherit)",
        borderRadius: "var(--ra-radius-md, 0)",
        border: "1px solid var(--ra-color-border, currentColor)",
        // Lets ::before-style geometric decoration fill the whole area
        isolation: "isolate",
      }}
    >
      {/*
        ─── Cover content area · write it here ───
        The default placeholder looks like this:
          • one layer of theme-flavored geometric decoration (an SVG grid + an accent circle + a stroked diagonal line)
          • a centered placeholder title, subtitle, and small label
        When building, **replace it with a cover customized to the article + theme**. The
        placeholder exists so that "even if you forget to replace it, it won't render as a mess",
        but **it must not be shipped as-is**.
      */}
      <CoverPlaceholder />
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// Placeholder implementation —— the main Agent replaces <CoverPlaceholder /> with this article's
// real cover. It's also fine to delete this function; keeping it makes the placeholder fallback
// friendlier.
// ────────────────────────────────────────────────────────────────────
function CoverPlaceholder() {
  return (
    <>
      {/* The default placeholder uses SVG purely for convenience, **it does not mean "you should
       *  use SVG"** —— you can delete this <svg> entirely and swap in a CSS gradient layer,
       *  Canvas, a complex React component, typographic-art collage, or anything else that
       *  produces a good-looking visual. You choose the visual technique, as long as the result
       *  looks good. */}
      <svg
        viewBox="0 0 1200 1600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          color: "var(--ra-color-border, currentColor)",
          opacity: 0.55,
          zIndex: 0,
        }}
      >
        <defs>
          <pattern id="ra-cover-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect width="1200" height="1600" fill="url(#ra-cover-grid)" />
        <circle
          cx="900"
          cy="1180"
          r="220"
          fill="var(--ra-color-accent, currentColor)"
          opacity="0.18"
        />
        <line
          x1="80"
          y1="1400"
          x2="560"
          y2="1400"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>

      {/* Text layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          display: "grid",
          alignContent: "center",
          justifyItems: "start",
          padding:
            "var(--ra-space-7, 3rem) var(--ra-space-8, 4rem) var(--ra-space-7, 3rem) var(--ra-space-8, 4rem)",
          gap: "var(--ra-space-3, 0.75rem)",
        }}
      >
        <span
          style={{
            fontSize: "var(--ra-text-xs, 0.75rem)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--ra-color-muted, inherit)",
            opacity: 0.85,
          }}
        >
          COVER · 3 : 4 · placeholder
        </span>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(1.6rem, 4.6vw, var(--ra-text-4xl, 3rem))",
            lineHeight: 1.05,
            fontWeight: "var(--ra-font-weight-bold, 700)",
            color: "var(--ra-color-fg, inherit)",
            maxWidth: "70%",
          }}
        >
          Design the cover here based on the article's main point + theme
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "var(--ra-text-sm, 0.95rem)",
            color: "var(--ra-color-muted, inherit)",
            maxWidth: "70%",
            lineHeight: 1.4,
          }}
        >
          First read <code>references/cover.md</code> and the chosen theme's <code>theme-profiles/&lt;id&gt;.md</code>,
          then replace <code>CoverPlaceholder</code> with an image-and-text composition unique to this article. You choose whatever visual technique (SVG /
          CSS / Canvas / a complex React component / any mix) — as long as the result looks good; the only thing forbidden is remote images.
        </p>
      </div>
    </>
  );
}
