---
name: seo
description: Use for SEO audits, indexing problems, Search Console analysis, metadata, structured data, internal linking, Core Web Vitals, keyword intent, or organic-search recommendations.
---

# SEO

Produce evidence-based SEO findings for the current project. Prefer a small number
of actionable findings over a generic checklist.

## Evidence Order

1. Inspect the repository to understand routes, templates, metadata, robots rules,
   sitemap generation, redirects, canonicals, structured data, and deployment.
2. Inspect rendered pages with browser automation when runtime behavior matters.
3. Use Google Search Console for actual indexing and search-performance questions.
   List properties first and use the exact property URL returned by the tool.
4. For market-level search-interest questions with no site attached (is interest
   in a term rising, where, what's related), use the `google-trends` skill.
5. Consult current official documentation when a platform-specific claim needs
   confirmation.

Clearly separate observed facts, data-backed conclusions, and hypotheses. Never
invent traffic, keyword volume, rankings, crawl behavior, or business goals.

## Audit Scope

Check only areas relevant to the request:

- Crawlability and indexability: status codes, robots directives, robots.txt,
  sitemap coverage, canonicals, redirects, pagination, and duplicate URLs.
- Page signals: titles, descriptions, headings, semantic HTML, image alternatives,
  internal links, and language or hreflang configuration.
- Structured data: eligibility, required properties, page-content consistency, and
  JSON-LD validity.
- Performance: Core Web Vitals and rendering issues supported by field or runtime
  evidence; do not treat a guessed optimization as a measured problem.
- Content: search intent, topical overlap, cannibalization, information gaps, and
  whether the page satisfies the query without keyword stuffing.
- Search Console: clicks, impressions, CTR, position, query/page relationships,
  indexing status, sitemap state, and meaningful period comparisons.

## Safety

Operate read-only unless the user explicitly asks for implementation. Never add or
remove Search Console properties, submit or delete sitemaps, request indexing, alter
robots/canonical behavior, publish content, or create redirects without explicit
approval. Do not expose credentials or include sensitive values in reports.

## Recommendations

- Fix root causes at the shared template, route, or configuration layer when the
  evidence shows multiple URLs have the same problem.
- Preserve the project's framework, conventions, language, and brand voice.
- Prefer native framework and web-platform capabilities over new dependencies.
- Distinguish technical defects from optional content opportunities.
- State when more data is required instead of presenting a guess as a finding.

## Output

Lead with findings ordered by severity and likely organic impact. For each finding,
include:

- Severity: critical, high, medium, or low.
- Confidence: high, medium, or low.
- Evidence: exact URL, Search Console data, or `file:line` reference.
- Impact: the concrete crawling, indexing, relevance, usability, or performance risk.
- Recommendation: the smallest corrective action.
- Validation: how to verify the result after implementation.

End with a short prioritized action list. If no material issue is found, say so and
name any evidence that was unavailable.
