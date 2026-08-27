import { Section, Aside, Raw } from "reacticle";

// One Section per file. In parallel builds a single subagent owns this file and
// must not touch Article.tsx or other section files. See references/section-build.md.
//
// Rules of thumb (references/component-policy.md + raw-policy.md):
//   - Prose is the body. Write paragraphs as <Section> children.
//   - Semantic components (Aside / Quote / Table / RiskList ...) are accents.
//   - Raw is freely used but hand-authored for THIS section, token-driven.
export function SectionOpening() {
  return (
    <Section index="01" title="Section One">
      <p>Body paragraphs go here as children —— this should be the bulk of the article; write as much body text as needed to lay out the background, reasoning, and conclusions clearly.</p>
      <p>Write another paragraph to keep the reading rhythm going. Only use a semantic component when the content genuinely "is" that structure.</p>

      <Aside tone="principle" label="Core Judgment">A one-sentence core judgment that gives this section its focal point.</Aside>

      <Raw title="An inline SVG hand-written for this paragraph (colored using theme tokens)">
        <svg viewBox="0 0 240 60" width="100%">
          <polyline
            points="0,50 40,42 80,46 120,20 160,28 200,8 240,14"
            fill="none"
            stroke="var(--ra-color-accent)"
            strokeWidth="2"
          />
        </svg>
      </Raw>
    </Section>
  );
}
