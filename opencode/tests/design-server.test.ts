import { spawn } from "node:child_process"
import { mkdtemp, mkdir, stat, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { approveDesignPage, createDesignProposals, getDesignDocument, startDesignServer, validateDesignDocument, type DesignProposalInput } from "../plugins/design-server.ts"

type Variant = {
  name: string
  direction: string
  signature: string
  risk: string
  layoutConcept: string
  decisions: string[]
  display: string
  body: string
  fonts: string[]
  dark: string
  light: string
  accent: string
  mid: string
}

const variants: Variant[] = [
  {
    name: "Ficha vertical",
    direction: "Editorial column with an oversized product title",
    signature: "A full-bleed product title that breaks across the gutter and overlaps the price block underneath it",
    risk: "Letting the title collide with the price is risky, but it forces the eye through name then cost in one movement",
    layoutConcept: "One narrow reading column: title, price, gallery, then specification rows stacked with generous vertical rhythm.",
    decisions: [
      "Title set at 76px so the product name reads before anything else",
      "Price promoted directly beneath the title instead of beside the cart button",
      "Specification rows use hairline dividers rather than boxed cards",
    ],
    display: "Fraunces",
    body: "Inter",
    fonts: ["Fraunces:opsz,wght@9..144,400;9..144,700", "Inter:wght@400;600"],
    dark: "#101820",
    light: "#ffffff",
    accent: "#c2410c",
    mid: "#4b5563",
  },
  {
    name: "Panel comparativo",
    direction: "Split canvas that pins specifications against imagery",
    signature: "A sticky specification rail on the right that stays fixed while the imagery scrolls past it",
    risk: "A pinned rail costs horizontal room, justified because buyers here compare numbers while looking at photos",
    layoutConcept: "Two column grid: scrolling imagery on the left, a persistent data rail on the right holding measurements and stock.",
    decisions: [
      "Data rail pinned with position sticky so numbers never leave the viewport",
      "Imagery bleeds to the left viewport edge to signal scrollable depth",
      "Stock state rendered as a coloured dot plus wording, never colour alone",
    ],
    display: "Space Grotesk",
    body: "IBM Plex Sans",
    fonts: ["Space+Grotesk:wght@500;700", "IBM+Plex+Sans:wght@400;600"],
    dark: "#1b1b3a",
    light: "#f8f8f8",
    accent: "#00857a",
    mid: "#52525b",
  },
  {
    name: "Vitrina cálida",
    direction: "Boutique showcase framing the object like a gallery piece",
    signature: "A single framed hero photograph centred on the page with the caption engraved below in small caps",
    risk: "Devoting the first screen entirely to one photograph delays the price, earned by how tactile the object is",
    layoutConcept: "Centred gallery frame with wide margins, caption beneath, and purchasing details revealed further down the page.",
    decisions: [
      "Hero photograph framed with an inset border to imitate a mounted print",
      "Caption typeset in small caps to carry museum label conventions",
      "Purchase controls deliberately deferred below the fold to privilege the object",
    ],
    display: "Playfair Display",
    body: "Karla",
    fonts: ["Playfair+Display:wght@500;700", "Karla:wght@400;600"],
    dark: "#2b1a14",
    light: "#fffdf9",
    accent: "#8b1e3f",
    mid: "#57534e",
  },
]

const nielsen = [
  "visibility-of-system-status",
  "match-with-real-world",
  "user-control-and-freedom",
  "consistency-and-standards",
  "error-prevention",
  "recognition-rather-than-recall",
  "flexibility-and-efficiency",
  "aesthetic-and-minimalist-design",
  "help-users-recognize-recover-errors",
  "help-and-documentation",
] as const

function buildCss(variant: Variant): string {
  return `
:root { --ink: ${variant.dark}; --paper: ${variant.light}; --accent: ${variant.accent}; --muted: ${variant.mid}; }
body { background: var(--paper); color: var(--ink); font-family: '${variant.body}', system-ui, sans-serif; line-height: 1.55; }
h1, h2, .display { font-family: '${variant.display}', Georgia, serif; letter-spacing: -0.02em; margin: 0 0 16px; }
h1 { font-size: clamp(38px, 7vw, 76px); }
.wrap { max-width: 1080px; margin: 0 auto; padding: 48px 24px 96px; }
.eyebrow { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
.price { font-family: '${variant.display}', Georgia, serif; font-size: 32px; color: var(--ink); }
.lede { color: ${variant.mid}; max-width: 46ch; font-size: 17px; }
.gallery { display: grid; gap: 18px; grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 40px 0; }
.gallery figure { margin: 0; border: 1px solid ${variant.mid}; border-radius: 6px; overflow: hidden; }
.specs { border-top: 1px solid ${variant.mid}; }
.specs div { display: flex; justify-content: space-between; gap: 24px; padding: 14px 0; border-bottom: 1px solid ${variant.mid}; }
.specs dt { color: ${variant.mid}; }
.cta { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 52px; padding: 0 28px; border: 1px solid ${variant.accent}; border-radius: 4px; background: ${variant.accent}; color: ${variant.light}; font-weight: 600; cursor: pointer; transition: transform 160ms ease, background 160ms ease; }
.cta:hover { background: ${variant.dark}; border-color: ${variant.dark}; transform: translateY(-1px); }
.cta:focus-visible { outline: 3px solid ${variant.dark}; outline-offset: 3px; }
.cta:active { transform: translateY(1px); }
.ghost { display: inline-flex; align-items: center; min-height: 48px; padding: 0 20px; border: 1px solid ${variant.mid}; border-radius: 4px; background: transparent; color: ${variant.dark}; cursor: pointer; transition: border-color 160ms ease; }
.ghost:hover { border-color: ${variant.accent}; color: ${variant.accent}; }
.ghost:focus-visible { outline: 3px solid ${variant.accent}; outline-offset: 2px; }
.icon { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 1.6; }
.stock { display: inline-flex; align-items: center; gap: 8px; color: ${variant.mid}; font-size: 14px; }
.stock span { width: 9px; height: 9px; border-radius: 999px; background: ${variant.accent}; }
@media (max-width: 720px) {
  .wrap { padding: 28px 18px 72px; }
  .gallery { grid-template-columns: minmax(0, 1fr); }
  h1 { font-size: 34px; }
}
@media (prefers-reduced-motion: reduce) {
  .cta, .ghost { transition: none; }
  .cta:hover, .cta:active { transform: none; }
}
`.trim()
}

function buildHtml(variant: Variant): string {
  return `
<main class="wrap">
  <p class="eyebrow">Catálogo / Pieza destacada</p>
  <h1>${variant.name} de la colección de invierno</h1>
  <p class="lede">Una pieza fabricada en talleres pequeños, descrita con las medidas y materiales reales que figuran en el catálogo del repositorio.</p>
  <p class="price">248,00 €</p>
  <p class="stock"><span aria-hidden="true"></span>Disponible para envío en 48 horas</p>
  <section class="gallery" aria-label="Galería de la pieza">
    <figure><img src="https://example.invalid/a.jpg" alt="Vista frontal de la pieza" width="480" height="320"></figure>
    <figure><img src="https://example.invalid/b.jpg" alt="Detalle del acabado" width="480" height="320"></figure>
  </section>
  <section aria-label="Especificaciones">
    <h2>Especificaciones</h2>
    <dl class="specs">
      <div><dt>Material</dt><dd>Lana virgen peinada</dd></div>
      <div><dt>Medidas</dt><dd>180 × 60 centímetros</dd></div>
      <div><dt>Origen</dt><dd>Taller de Sabadell</dd></div>
    </dl>
  </section>
  <p>
    <button class="cta" type="button">Añadir a la cesta</button>
    <a class="ghost" href="#envios">Consultar plazos de envío</a>
  </p>
</main>
`.trim()
}

function buildProposal(variant: Variant, sourceFiles: string[]): DesignProposalInput {
  return {
    name: variant.name,
    direction: variant.direction,
    summary: `${variant.direction} para la ficha de producto.`,
    background: variant.light,
    html: buildHtml(variant),
    css: buildCss(variant),
    fonts: variant.fonts,
    plan: {
      palette: [
        { name: "ink", hex: variant.dark },
        { name: "paper", hex: variant.light },
        { name: "accent", hex: variant.accent },
        { name: "muted", hex: variant.mid },
      ],
      typography: [
        { role: "display", family: variant.display, usage: "Titulares, precio y encabezados de sección" },
        { role: "body", family: variant.body, usage: "Texto corrido, especificaciones y controles" },
      ],
      layoutConcept: variant.layoutConcept,
      signature: variant.signature,
      risk: variant.risk,
    },
    evidence: {
      sourceFiles,
      preservedContent: ["El precio 248,00 € del catálogo", "Las medidas 180 × 60 centímetros"],
      assetPaths: [],
      designDecisions: variant.decisions,
      incumbentImprovement:
        "La ficha actual entierra el precio y las medidas bajo pestañas; esta dirección las expone en el primer scroll y mantiene la jerarquía de compra.",
      iconStrategy: "Se conserva el trazo de 1.6px del repositorio y sólo se usan iconos junto a texto visible.",
      assetTreatments: [],
      contrastChecks: [
        { foreground: variant.dark, background: variant.light, usage: "text" },
        { foreground: variant.mid, background: variant.light, usage: "text" },
        { foreground: variant.accent, background: variant.light, usage: "control" },
        { foreground: variant.light, background: variant.dark, usage: "icon" },
      ],
      affordanceChecks: [
        { control: "Añadir a la cesta", signifier: "Botón relleno con borde y esquinas marcadas", feedback: "Cambia a tinta al pasar y se hunde al pulsar", targetSize: 52 },
        { control: "Consultar plazos", signifier: "Enlace con borde visible y color de texto propio", feedback: "El borde adopta el acento en hover y focus", targetSize: 48 },
        { control: "Miniaturas de galería", signifier: "Marco con borde y radio perceptible", feedback: "Se aclara el borde y aparece contorno al enfocar", targetSize: 48 },
      ],
      nielsenReview: nielsen.map((heuristic) => ({
        heuristic,
        finding: `Revisión de ${heuristic} sobre la ficha renderizada del repositorio actual.`,
        implementation: `Se resuelve con estados visibles y textos explícitos para ${heuristic}.`,
      })),
    },
  }
}

async function run() {
  const worktree = await mkdtemp(join(tmpdir(), "design-test-"))
  await mkdir(join(worktree, "src"), { recursive: true })
  await writeFile(join(worktree, "src", "product.html"), "<main>ficha</main>", "utf8")
  await writeFile(join(worktree, "src", "product.css"), ".price{}", "utf8")
  const sourceFiles = ["src/product.html", "src/product.css"]
  const brief = "Rediseñar la ficha de producto del catálogo"
  const round = () => variants.map((variant) => buildProposal(variant, sourceFiles))

  let failures = 0
  const pass = (label: string) => console.log(`PASS: ${label}`)
  const fail = (label: string, detail: string) => {
    console.error(`FAIL: ${label} -> ${detail}`)
    failures += 1
  }

  const expectOk = async (label: string, proposals: DesignProposalInput[], refinement = false) => {
    try {
      const document = await createDesignProposals(worktree, brief, proposals, false, refinement)
      pass(label)
      return document
    } catch (error) {
      fail(label, (error as Error).message)
      return null
    }
  }

  const expectReject = async (label: string, mutate: (proposals: DesignProposalInput[]) => void, needle: string) => {
    const proposals = round()
    mutate(proposals)
    try {
      await createDesignProposals(worktree, brief, proposals, false, true)
      fail(label, "was accepted but should have been rejected")
    } catch (error) {
      const message = (error as Error).message
      if (message.toLowerCase().includes(needle.toLowerCase())) pass(label)
      else fail(label, `rejected for the wrong reason: ${message}`)
    }
  }

  const first = await expectOk("a complete round of three planned proposals is accepted", round())
  if (first) {
    if (first.pages.every((page) => page.plan && page.fonts?.length)) pass("plan and fonts are persisted on every page")
    else fail("plan and fonts are persisted on every page", "a page lost its plan or fonts")
    if (first.pages.every((page) => page.background !== "#f4f1ea")) pass("no page inherits the default cream background")
    else fail("no page inherits the default cream background", "a page fell back to #f4f1ea")
  }

  await expectReject("a proposal without its own background is rejected", (proposals) => { delete proposals[0].background }, "own six-digit hex background")
  await expectReject("a planned color that never reaches the CSS is rejected", (proposals) => { proposals[1].plan.palette[2].hex = "#ff00aa" }, "never used in CSS")
  await expectReject("a self-reported contrast pair absent from the CSS is rejected", (proposals) => { proposals[0].evidence.contrastChecks[0].foreground = "#123456" }, "not a color the CSS actually uses")
  await expectReject("CSS that animates without prefers-reduced-motion is rejected", (proposals) => { proposals[2].css = proposals[2].css.replace(/@media \(prefers-reduced-motion: reduce\)[\s\S]*$/, "") }, "prefers-reduced-motion")
  await expectReject("a typeface that is never declared for loading is rejected", (proposals) => { proposals[0].fonts = ["Inter:wght@400;600"] }, "cannot load it")
  await expectReject("two proposals sharing one signature element are rejected", (proposals) => { proposals[1].plan.signature = proposals[0].plan.signature }, "same signature element")
  await expectReject("two proposals sharing a palette are rejected", (proposals) => {
    const borrowedPalette: Variant = { ...variants[1], dark: variants[0].dark, light: variants[0].light, accent: variants[0].accent, mid: variants[0].mid }
    proposals[1] = buildProposal(borrowedPalette, sourceFiles)
  }, "reuse the same palette")

  const history = await expectOk("a second distinct round is accepted and recorded", round(), true)
  if (history) {
    if ((history.history?.length ?? 0) >= 1) pass("the previous round is written to history")
    else fail("the previous round is written to history", "history is empty")
  }

  try {
    await createDesignProposals(worktree, brief, round(), false, false)
    fail("regenerating the previous round without refinement is rejected", "was accepted")
  } catch (error) {
    if ((error as Error).message.includes("repeats the previous round")) pass("regenerating the previous round without refinement is rejected")
    else fail("regenerating the previous round without refinement is rejected", (error as Error).message)
  }

  // Incremental submission: one proposal per call keeps each payload small.
  const [one, two, three] = round()
  try {
    let incremental = await createDesignProposals(worktree, brief, [one], false, true)
    if (incremental.pages.length === 1) pass("a single proposal can open a round on its own")
    else fail("a single proposal can open a round on its own", `got ${incremental.pages.length} pages`)
    incremental = await createDesignProposals(worktree, brief, [two], true, true)
    incremental = await createDesignProposals(worktree, brief, [three], true, true)
    if (incremental.pages.length === 3) pass("appending one proposal at a time completes the round")
    else fail("appending one proposal at a time completes the round", `got ${incremental.pages.length} pages`)
  } catch (error) {
    fail("appending one proposal at a time completes the round", (error as Error).message)
  }

  try {
    await createDesignProposals(worktree, brief, [buildProposal({ ...variants[0], name: "Cuarta" }, sourceFiles)], true, true)
    fail("a fourth appended proposal is rejected", "was accepted")
  } catch (error) {
    if ((error as Error).message.includes("at most 3 proposals")) pass("a fourth appended proposal is rejected")
    else fail("a fourth appended proposal is rejected", (error as Error).message)
  }

  try {
    const clash: Variant = { ...variants[1], name: "Choque", signature: variants[0].signature }
    await createDesignProposals(worktree, brief, [buildProposal(clash, sourceFiles)], false, true)
    await createDesignProposals(worktree, brief, [buildProposal({ ...variants[0], name: "Choque dos" }, sourceFiles)], true, true)
    fail("an appended proposal is compared against the stored ones", "was accepted")
  } catch (error) {
    if ((error as Error).message.includes("same signature element")) pass("an appended proposal is compared against the stored ones")
    else fail("an appended proposal is compared against the stored ones", (error as Error).message)
  }

  await expectOk("a full round can still be submitted in one call", round(), true)

  // Approval must survive the agent appending the rest of an incomplete round.
  try {
    const [a, b, c] = round()
    await createDesignProposals(worktree, brief, [a], false, true)
    await createDesignProposals(worktree, brief, [b], true, true)
    const approvedFirst = await approveDesignPage(worktree, a.name)
    if (approvedFirst.document.approvedPageId === approvedFirst.page.id) pass("a proposal can be approved by name without touching the canvas")
    else fail("a proposal can be approved by name without touching the canvas", "approvedPageId was not set")
    const completed = await createDesignProposals(worktree, brief, [c], true, true)
    if (completed.approvedPageId === approvedFirst.page.id) pass("approval survives appending the rest of the round")
    else fail("approval survives appending the rest of the round", `approvedPageId became ${JSON.stringify(completed.approvedPageId)}`)
    const byNumber = await approveDesignPage(worktree, "2")
    if (byNumber.page.id === completed.pages[1].id) pass("a proposal can be approved by its position in the round")
    else fail("a proposal can be approved by its position in the round", `matched ${byNumber.page.name}`)
    const fresh = await createDesignProposals(worktree, brief, round(), false, true)
    if (fresh.approvedPageId === null) pass("starting a new round clears the stale approval")
    else fail("starting a new round clears the stale approval", `approvedPageId stayed ${JSON.stringify(fresh.approvedPageId)}`)
  } catch (error) {
    fail("approval survives appending the rest of the round", (error as Error).message)
  }

  try {
    await approveDesignPage(worktree, "no existe semejante propuesta")
    fail("approving an unknown proposal is rejected", "was accepted")
  } catch (error) {
    if ((error as Error).message.includes("No single proposal matches")) pass("approving an unknown proposal is rejected")
    else fail("approving an unknown proposal is rejected", (error as Error).message)
  }

  try {
    await createDesignProposals(worktree, brief, [round()[0]], false, true)
    await validateDesignDocument(worktree, await getDesignDocument(worktree))
    fail("an incomplete round explains what is missing", "was accepted")
  } catch (error) {
    const message = (error as Error).message
    if (message.includes("1 of 3 proposals") && message.includes("append: true")) pass("an incomplete round explains what is missing")
    else fail("an incomplete round explains what is missing", message)
  }

  await expectOk("a final complete round is accepted", round(), true)
  const document = await getDesignDocument(worktree)
  const server = await startDesignServer(worktree, brief)
  const page = document.pages[0]
  const preview = await fetch(`${server.url}/api/preview?page=${encodeURIComponent(page.id)}`)
  const previewHtml = await preview.text()
  if (preview.ok && previewHtml.includes("fonts.googleapis.com/css2?family=")) pass("the preview route serves the proposal with its declared webfonts")
  else fail("the preview route serves the proposal with its declared webfonts", `status ${preview.status}, no font link found`)
  if (previewHtml.includes(`body{background:${page.background}}`)) pass("the preview route applies the proposal background")
  else fail("the preview route applies the proposal background", "background was not applied")
  const missing = await fetch(`${server.url}/api/preview?page=nope`)
  if (missing.status === 404) pass("the preview route rejects an unknown proposal id")
  else fail("the preview route rejects an unknown proposal id", `status ${missing.status}`)

  const shot = join(worktree, "shot.png")
  const screenshot = (channel: string[]) =>
    new Promise<boolean>((resolveShot) => {
      const child = spawn(
        "npx",
        ["--no-install", "playwright", "screenshot", "--browser", "chromium", ...channel, "--viewport-size", "980,900", "--full-page", "--wait-for-timeout", "1200", `${server.url}/api/preview?page=${encodeURIComponent(page.id)}`, shot],
        { stdio: "ignore" },
      )
      child.on("error", () => resolveShot(false))
      child.on("exit", (code) => resolveShot(code === 0))
    })
  const rendered = (await screenshot(["--channel", "chrome"])) || (await screenshot([]))
  if (rendered) {
    const size = await stat(shot).then((info) => info.size).catch(() => 0)
    if (size > 5000) pass(`playwright renders the preview to a real png (${Math.round(size / 1024)}kb)`)
    else fail("playwright renders the preview to a real png", `png was ${size} bytes`)
  } else {
    fail("playwright renders the preview to a real png", "the playwright screenshot command did not succeed")
  }
  server.close()

  if (failures) {
    console.error(`\n${failures} check(s) failed`)
    process.exit(1)
  }
  console.log("\nall checks passed")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
