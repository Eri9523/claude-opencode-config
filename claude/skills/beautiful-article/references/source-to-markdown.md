# Source → Markdown

Regardless of the input, Phase 1 always converts it into a unified `source/source.md` first, and
writes risks into `source/extraction-notes.md`.

## Artifacts

`source.md` must include: title · source · author / date / link (if available) · body text ·
tables · image placeholders · code blocks · quotes · appendix / footnotes.

`extraction-notes.md` must record: input type · extraction method · information that may have been
lost · layout in PDF/DOCX that couldn't be reliably reconstructed · whether images / tables /
footnotes / code are complete · material or context the user needs to supplement · **source
language, whether translation is needed, target language, translated file name, and translation
notes**.

## Language and translation

After extraction, determine the language of `source.md`, and decide based on the target language
recorded in Phase 0:

- No target language specified, or the target language matches the source → **do not translate**;
  the final article's language = the source language.
- A target language is specified and differs from the source → produce
  `source/source.<lang>.md` (e.g., `source.zh.md` / `source.en.md`) as the **factual base** for
  Phase 2+; the original `source.md` is kept for reference.
  - Translation requirements: **idiomatic, free of translationese** — restructure sentences
    according to the target language's natural usage, don't translate word-for-word, don't leave
    stiff foreign word order / stacked passive voice / foreign-style punctuation; keep terminology
    / numbers / code / formulas / quotes accurate; keep heading hierarchy, structure, and the
    information-retention ratio unchanged.
  - Translation happens only once, at the source-text layer; subsequent editing, tone rewriting,
    and componentization are all based on the translated version.

## Handling principles for different inputs

| Input | Handling method | Self-check focus |
|---|---|---|
| URL | Scrape the page body, clean up navigation / ads / recommendations | Whether the main body was captured, whether links and images were kept |
| PDF | Extract text / sections / tables / image placeholders | Garbled line breaks, headers/footers mixed in, lost tables |
| DOCX | Extract heading hierarchy / paragraphs / tables / image placeholders | Styling doesn't matter, structural and content completeness does |
| Markdown | Keep the original headings / code blocks / tables | Don't over-rewrite the source text |
| Plain text | Identify structure and flag uncertain spots | Don't invent hierarchy on your own |
| Screenshot / image | Convert to an image placeholder + description, record its purpose | Record it in extraction-notes, pending user confirmation |

## Choosing an extraction script

The Skill provides two extraction paths: the MarkItDown primary path + a lightweight fallback. The
Agent should determine the input type, information-retention requirements, and the local
environment in Phase 1 before choosing a script.

### 1. MarkItDown primary path

For PDF / DOCX / PPTX / HTML / complex documents, especially when the user requires 80-100%
information retention, prefer `scripts/source-to-markdown-markitdown.py`:

```bash
python3.10 <path-to-beautiful-article>/scripts/source-to-markdown-markitdown.py <input> -o source/source.md
```

MarkItDown requires Python 3.10+. It's an optional enhancement dependency and isn't force-installed
with the component library or scaffold. If it isn't installed, prompt the user to install it as
needed:

```bash
python3.10 -m pip install "markitdown[pdf,docx]"
```

If the local machine doesn't have a `python3.10` command but does have `uv`, you can spin up a
temporary environment with MarkItDown:

```bash
uv run --python 3.12 --with "markitdown[pdf,docx]" python \
  <path-to-beautiful-article>/scripts/source-to-markdown-markitdown.py <input> -o source/source.md
```

Don't default to installing `markitdown[all]` unless the user explicitly needs extra formats like
PPTX / XLSX / audio / YouTube / Azure. A full install is heavier and more likely to cause
environment issues.

### 2. Lightweight fallback

If MarkItDown is unavailable, the Python version is insufficient, conversion fails, or the input is
just Markdown / TXT / simple HTML, use `scripts/source-to-markdown.py`:

```bash
python3 <path-to-beautiful-article>/scripts/source-to-markdown.py <input> -o source/source.md
```

The script detects available parsing libraries (pdfminer / pdfplumber / python-docx /
BeautifulSoup), and prints install suggestions and degrades gracefully when a library is missing.
The script only does **mechanical extraction**; cleaning up the body text, marking placeholders,
and recording risks are still the agent's job. URLs can also be fetched directly with the agent's
web-scraping ability and then cleaned up.

### 3. Agent decision rules

- PDF / DOCX / PPTX / complex HTML: try MarkItDown first.
- Markdown / TXT: use the fallback directly, keep the original structure, don't over-process.
- URL: the Agent's web-scraping ability can be used first to get the body text; if it's already
  been saved as an HTML file, then choose MarkItDown or the fallback based on complexity.
- 100% information retention: after extraction, a stricter self-check is required — if necessary,
  run both MarkItDown and the fallback and compare whether any tables, code, footnotes, or image
  placeholders are missing.
- Either script's output is only a `source.md` draft; the Agent must still clean up noise, add
  image placeholders, and write `source/extraction-notes.md`.

## Source Phase self-check (main Agent inline · 5-item checklist)

Quality-gating the source material is **not a hard SubAgent quality-gate point**. Since the main
Agent has to read through `source.md` anyway before entering Phase 2, just check these 5 items on
the spot and fix based on the conclusions (no separate review file needed):

1. **Completeness**: was it truncated? Is the volume proportionate to the original (a long PDF /
   long article isn't only half-extracted / only the first screen captured)?
2. **Structure**: was the heading hierarchy preserved? Or was it flattened into one block of prose
   (making it impossible to split into chapters later)?
3. **Key carriers**: are tables / code / formulas / quotes / footnotes preserved without damage
   (tables not squashed into one line, code indentation intact, formulas not scrambled into odd
   characters)?
4. **Noise**: was navigation / ads / cookie banners / recommended reading / headers/footers/page
   numbers accidentally written into the body text? Is the encoding damaged (mojibake, ligatures
   like `ﬁ`, soft-hyphen word breaks, two-column PDF reading order scrambled)?
5. **Uncertain items**: are images flagged with placeholders? Are all uncertain spots written into
   `extraction-notes.md`?

> ⚠️ Items 1/4 above can be caught just by reading the markdown alone, but **"silent losses" of
> tables/paragraphs in 2/3** (quietly deleted or swallowed) cannot be seen just by looking at the
> markdown — you must compare against `original.*`.

## Escalating to an independent Source Reviewer (complex/low-confidence sources only)

**Only** when `extraction-notes.md` has flagged "low confidence / complex PDF/DOCX / uncertain
conversion / a key source requiring 100% retention" should you escalate to an independent
SubAgent, and **force a diff-style check against the original**, writing `review/source-review.md`:

```text
Act as the Source Reviewer. Read both source/original.* (the original) and source/source.md
(the converted output) at the same time. Do a diff-style check item by item: compare against the
original, check whether source.md is missing any tables / paragraphs / footnotes / code / images,
whether noise has been mixed in, and whether there's any structural collapse or encoding damage.
Output only a "list of differences in order of appearance + must-fix items" — do not evaluate
whether the article looks good, and do not fix the files for me.
```
