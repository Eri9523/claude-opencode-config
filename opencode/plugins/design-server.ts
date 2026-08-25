import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, extname, join, resolve, sep } from "node:path"

export type DesignNodeKind = "text" | "button" | "card" | "input" | "badge" | "image"

export type DesignNode = {
  id: string
  kind: DesignNodeKind
  name: string
  text: string
  x: number
  y: number
  width: number
  height: number
  fill: string
  color: string
  borderColor: string
  borderWidth: number
  radius: number
  fontSize: number
  fontWeight: number
  fontStyle?: "normal" | "italic"
  textDecoration?: "none" | "underline"
  assetPath?: string
  opacity: number
}

export type DesignNote = {
  id: string
  nodeId: string | null
  text: string
}

export type DesignIntakeContext = "internal-tool" | "product-ui" | "marketing" | "client-deliverable" | "other"
export type DesignIntakeRegister = "formal" | "neutral" | "expressive"
export type DesignIntakeViewport = "mobile" | "desktop" | "responsive"

// The qualifying questions /design must ask before designing anything: the same
// surface looks different when it is an internal tool than when it is a
// marketing page, and guessing that wastes a whole round.
export type DesignIntake = {
  brief: string
  context: DesignIntakeContext
  audience: string
  register: DesignIntakeRegister
  primaryAction: string
  surface: string
  viewport: DesignIntakeViewport
  constraints: string[]
  outOfScope: string[]
  userAnswers: string[]
  answeredAt: string
}

export type DesignPlan = {
  palette: Array<{
    name: string
    hex: string
  }>
  typography: Array<{
    role: "display" | "body" | "utility"
    family: string
    usage: string
  }>
  layoutConcept: string
  signature: string
  risk: string
}

export type DesignEvidence = {
  sourceFiles: string[]
  preservedContent: string[]
  assetPaths: string[]
  designDecisions: string[]
  incumbentImprovement: string
  iconStrategy: string
  assetTreatments: Array<{
    path: string
    background: string
    rationale: string
  }>
  contrastChecks: Array<{
    foreground: string
    background: string
    usage: "text" | "large-text" | "icon" | "control"
  }>
  affordanceChecks: Array<{
    control: string
    signifier: string
    feedback: string
    targetSize: number
  }>
  nielsenReview: Array<{
    heuristic: NielsenHeuristic
    finding: string
    implementation: string
  }>
}

export type NielsenHeuristic =
  | "visibility-of-system-status"
  | "match-with-real-world"
  | "user-control-and-freedom"
  | "consistency-and-standards"
  | "error-prevention"
  | "recognition-rather-than-recall"
  | "flexibility-and-efficiency"
  | "aesthetic-and-minimalist-design"
  | "help-users-recognize-recover-errors"
  | "help-and-documentation"

const nielsenHeuristics: NielsenHeuristic[] = [
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
]

export type DesignPage = {
  id: string
  name: string
  direction: string
  summary: string
  viewport: {
    width: number
    height: number
  }
  background: string
  html?: string
  css?: string
  fonts?: string[]
  plan?: DesignPlan
  evidence?: DesignEvidence
  nodes: DesignNode[]
  notes: DesignNote[]
}

export type DesignRound = {
  round: number
  createdAt: string
  brief: string
  directions: Array<{
    name: string
    direction: string
    signature: string
    palette: string[]
  }>
}

export type DesignDocument = {
  version: 2
  name: string
  brief: string
  pages: DesignPage[]
  activePageId: string
  approvedPageId: string | null
  intake?: DesignIntake
  history?: DesignRound[]
  updatedAt: string
}

export type DesignServer = {
  url: string
  documentPath: string
  close: () => void
}

const runningServers = new Map<string, DesignServer>()

function id(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

function defaultPage(brief = ""): DesignPage {
  return {
    id: "proposal-1",
    name: brief.trim() ? "Design proposal" : "Untitled design",
    direction: "Editorial workspace",
    summary: brief.trim() || "A first visual direction to refine in the canvas.",
    viewport: { width: 980, height: 640 },
    background: "#ffffff",
    nodes: [
      {
        id: "eyebrow",
        kind: "badge",
        name: "Etiqueta",
        text: "OPENCODE / ESTUDIO DE DISEÑO",
        x: 72,
        y: 74,
        width: 220,
        height: 30,
        fill: "#ececec",
        color: "#1a1a1a",
        borderColor: "#1a1a1a",
        borderWidth: 1,
        radius: 999,
        fontSize: 11,
        fontWeight: 700,
        opacity: 1,
      },
      {
        id: "heading",
        kind: "text",
        name: "Título principal",
        text: "Haz visible el primer borrador.",
        x: 68,
        y: 142,
        width: 560,
        height: 124,
        fill: "transparent",
        color: "#1a1a1a",
        borderColor: "transparent",
        borderWidth: 0,
        radius: 0,
        fontSize: 58,
        fontWeight: 700,
        opacity: 1,
      },
      {
        id: "body",
        kind: "text",
        name: "Texto de apoyo",
        text: "Explora una dirección, deja notas precisas y convierte la superficie aprobada en código de producción cuando esté lista.",
        x: 74,
        y: 300,
        width: 400,
        height: 72,
        fill: "transparent",
        color: "#666666",
        borderColor: "transparent",
        borderWidth: 0,
        radius: 0,
        fontSize: 17,
        fontWeight: 400,
        opacity: 1,
      },
      {
        id: "cta",
        kind: "button",
        name: "Acción principal",
        text: "Abrir espacio de trabajo",
        x: 74,
        y: 422,
        width: 190,
        height: 56,
        fill: "#1a1a1a",
        color: "#ffffff",
        borderColor: "#1a1a1a",
        borderWidth: 1,
        radius: 8,
        fontSize: 14,
        fontWeight: 700,
        opacity: 1,
      },
      {
        id: "card",
        kind: "card",
        name: "Tarjeta de función",
        text: "Canvas listo para inspeccionar\nHaz clic en cualquier capa para ajustarla.",
        x: 632,
        y: 132,
        width: 270,
        height: 320,
        fill: "#1a1a1a",
        color: "#ffffff",
        borderColor: "#1a1a1a",
        borderWidth: 1,
        radius: 18,
        fontSize: 21,
        fontWeight: 600,
        opacity: 1,
      },
      {
        id: "input",
        kind: "input",
        name: "Campo de entrada",
        text: "Añade una nota de diseño...",
        x: 632,
        y: 480,
        width: 270,
        height: 52,
        fill: "#ffffff",
        color: "#767676",
        borderColor: "#c6c6c6",
        borderWidth: 1,
        radius: 8,
        fontSize: 13,
        fontWeight: 400,
        opacity: 1,
      },
    ],
    notes: [
      {
        id: "note-1",
        nodeId: "heading",
        text: "Prueba una idea fuerte antes de añadir más interfaz.",
      },
    ],
  }
}

export function defaultDocument(brief = ""): DesignDocument {
  const page = defaultPage(brief)
  return {
    version: 2,
    name: "Design workspace",
    brief: brief.trim(),
    pages: [page],
    activePageId: page.id,
    approvedPageId: null,
    updatedAt: new Date().toISOString(),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isDesignDocument(value: unknown): value is DesignDocument {
  if (!isRecord(value)) return false
  return value.version === 2 && typeof value.name === "string" && Array.isArray(value.pages) && typeof value.activePageId === "string"
}

function normalizeDocument(value: unknown): DesignDocument {
  if (isDesignDocument(value)) return value
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.nodes) || !Array.isArray(value.notes) || !isRecord(value.viewport)) {
    throw new Error("Invalid design document")
  }
  const legacyPage = {
    id: "proposal-1",
    name: typeof value.name === "string" ? value.name : "Design proposal",
    direction: "Imported design",
    summary: typeof value.brief === "string" ? value.brief : "Imported from the previous canvas format.",
    viewport: value.viewport,
    background: typeof value.background === "string" ? value.background : "#ffffff",
    nodes: value.nodes,
    notes: value.notes,
  } as DesignPage
  return {
    version: 2,
    name: "Design workspace",
    brief: typeof value.brief === "string" ? value.brief : "",
    pages: [legacyPage],
    activePageId: legacyPage.id,
    approvedPageId: null,
    updatedAt: new Date().toISOString(),
  }
}

export type DesignProposalInput = {
  name: string
  direction: string
  summary: string
  headline?: string
  viewport?: {
    width: number
    height: number
  }
  background?: string
  html: string
  css: string
  fonts?: string[]
  plan: DesignPlan
  evidence: DesignEvidence
  nodes?: DesignNode[]
  notes?: DesignNote[]
}

function assertWorktreePath(worktree: string, relativePath: string): string {
  const root = resolve(worktree)
  const target = resolve(root, relativePath)
  if (target !== root && !target.startsWith(`${root}${sep}`)) throw new Error(`Path is outside the worktree: ${relativePath}`)
  return target
}

function tokenSimilarity(first: string, second: string): number {
  const tokens = (value: string) => new Set(value.toLowerCase().replace(/[^a-z0-9áéíóúñ#]+/gi, " ").split(/\s+/).filter((token) => token.length > 2))
  const firstTokens = tokens(first)
  const secondTokens = tokens(second)
  const intersection = [...firstTokens].filter((token) => secondTokens.has(token)).length
  const union = new Set([...firstTokens, ...secondTokens]).size
  return union ? intersection / union : 1
}

function hexToRgb(value: string): [number, number, number] | null {
  const hex = value.trim().replace(/^#/, "")
  const normalized = hex.length === 3 ? [...hex].map((character) => `${character}${character}`).join("") : hex
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return null
  return [Number.parseInt(normalized.slice(0, 2), 16), Number.parseInt(normalized.slice(2, 4), 16), Number.parseInt(normalized.slice(4, 6), 16)]
}

function contrastRatio(foreground: string, background: string): number | null {
  const first = hexToRgb(foreground)
  const second = hexToRgb(background)
  if (!first || !second) return null
  const luminance = (rgb: [number, number, number]) => {
    const channels = rgb.map((channel) => {
      const value = channel / 255
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
  }
  const firstLuminance = luminance(first)
  const secondLuminance = luminance(second)
  return (Math.max(firstLuminance, secondLuminance) + 0.05) / (Math.min(firstLuminance, secondLuminance) + 0.05)
}

function cssMentionsColor(css: string, hex: string): boolean {
  const normalized = hex.trim().toLowerCase().replace(/^#/, "")
  if (!/^[0-9a-f]{6}$/.test(normalized)) return false
  const haystack = css.toLowerCase()
  if (haystack.includes(`#${normalized}`)) return true
  const [r, g, b] = [normalized.slice(0, 2), normalized.slice(2, 4), normalized.slice(4, 6)]
  const collapsible = r[0] === r[1] && g[0] === g[1] && b[0] === b[1]
  if (collapsible && haystack.includes(`#${r[0]}${g[0]}${b[0]}`)) return true
  const rgb = hexToRgb(normalized)
  if (!rgb) return false
  return new RegExp(`rgba?\\(\\s*${rgb[0]}\\s*[, ]\\s*${rgb[1]}\\s*[, ]\\s*${rgb[2]}\\b`).test(haystack)
}

const systemFontFamilies = [
  "system-ui",
  "ui-sans-serif",
  "ui-serif",
  "ui-monospace",
  "-apple-system",
  "blinkmacsystemfont",
  "segoe ui",
  "helvetica",
  "arial",
  "georgia",
  "times new roman",
  "courier new",
  "menlo",
  "monaco",
  "serif",
  "sans-serif",
  "monospace",
]

const googleFontSpec = /^[A-Za-z0-9]+(?:\+[A-Za-z0-9]+)*(?::[a-z]+(?:,[a-z]+)*@[0-9.,;]+)?$/

function fontSpecFamily(spec: string): string {
  return spec.split(":")[0].replace(/\+/g, " ")
}

function validatePlan(proposal: DesignProposalInput, errors: string[]): void {
  const plan = proposal.plan
  const fonts = proposal.fonts ?? []
  if (plan.palette.length < 4 || plan.palette.length > 6) errors.push("Plan palette must name between 4 and 6 colors")
  if (new Set(plan.palette.map((color) => color.name.trim().toLowerCase())).size !== plan.palette.length) errors.push("Plan palette names must be distinct")
  for (const color of plan.palette) {
    if (color.name.trim().length < 3) errors.push(`Plan palette color needs a descriptive role name: ${color.hex}`)
    if (!hexToRgb(color.hex)) {
      errors.push(`Plan palette color must be a six-digit hex value: ${color.hex}`)
      continue
    }
    if (!cssMentionsColor(proposal.css, color.hex)) errors.push(`Planned palette color is never used in CSS: ${color.name} (${color.hex})`)
  }
  const roles = new Set(plan.typography.map((face) => face.role))
  if (!roles.has("display") || !roles.has("body")) errors.push("Plan typography must define at least a display role and a body role")
  for (const face of plan.typography) {
    if (face.usage.trim().length < 20) errors.push(`Plan typography must explain where the ${face.role} face is used`)
    const family = face.family.trim()
    if (family.length < 3) errors.push(`Plan typography needs a real family name for the ${face.role} role`)
    if (!new RegExp(`font-family[^;}]*${family.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i").test(proposal.css)) {
      errors.push(`Planned ${face.role} face is never applied in CSS: ${family}`)
    }
    const isSystemFace = systemFontFamilies.some((system) => family.toLowerCase().includes(system))
    if (!isSystemFace && !fonts.some((spec) => fontSpecFamily(spec).toLowerCase() === family.toLowerCase())) {
      errors.push(`Planned ${face.role} face "${family}" is not declared in fonts, so the canvas cannot load it`)
    }
  }
  for (const spec of fonts) {
    if (!googleFontSpec.test(spec)) errors.push(`Font spec is not a valid Google Fonts family spec: ${spec}`)
    else if (!new RegExp(`font-family[^;}]*${fontSpecFamily(spec).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i").test(proposal.css)) {
      errors.push(`Declared font is never used in CSS: ${spec}`)
    }
  }
  if (plan.layoutConcept.trim().length < 80) errors.push("Plan must describe the layout concept in at least 80 characters")
  if (plan.signature.trim().length < 60) errors.push("Plan must name the single signature element this design is remembered by")
  if (plan.risk.trim().length < 60) errors.push("Plan must state the one deliberate aesthetic risk and why it is justified")
}

async function validateProposal(worktree: string, proposal: DesignProposalInput): Promise<void> {
  const errors: string[] = []
  if (!hexToRgb(proposal.background ?? "")) errors.push("Every proposal must declare its own six-digit hex background instead of inheriting a default")
  validatePlan(proposal, errors)
  if (!/prefers-reduced-motion/i.test(proposal.css)) errors.push("CSS animates without honoring prefers-reduced-motion")
  if (proposal.html.length < 800) errors.push("HTML is too small to represent a finished surface")
  if (proposal.css.length < 1200) errors.push("CSS is too small to represent a polished responsive design")
  if (!/<(?:main|section|article|nav|header)\b/i.test(proposal.html)) errors.push("HTML lacks semantic structure")
  if (!/<h1\b/i.test(proposal.html)) errors.push("HTML lacks a primary heading")
  if (!/<(?:button|a)\b/i.test(proposal.html)) errors.push("HTML lacks an actionable control")
  if (/<script\b/i.test(proposal.html)) errors.push("Scripts are not allowed in proposals")
  if (!/@media\b/i.test(proposal.css)) errors.push("CSS lacks responsive behavior")
  if (!/:hover\b/i.test(proposal.css)) errors.push("CSS lacks hover affordance")
  if (!/:focus-visible\b/i.test(proposal.css)) errors.push("CSS lacks visible keyboard focus")
  if (!/cursor\s*:\s*pointer/i.test(proposal.css)) errors.push("CSS lacks pointer affordance for interactive controls")
  if (!/(?:transition|animation)\s*:/i.test(proposal.css)) errors.push("CSS lacks interaction feedback transitions")
  const compactTextActions = /<(?:button|a)\b[^>]*>\s*(?:llamar|instagram|ubicaci[oó]n|c[oó]mo llegar|men[uú]|cerrar)\s*<\/(?:button|a)>/gi
  if (compactTextActions.test(proposal.html)) errors.push("Compact utility actions must use descriptive inline SVG icons with accessible labels, not text-only controls")
  const interactiveElements = proposal.html.matchAll(/<(button|a)\b([^>]*)>([\s\S]*?)<\/\1>/gi)
  for (const element of interactiveElements) {
    const attributes = element[2]
    const content = element[3]
    const visibleText = content.replace(/<svg[\s\S]*?<\/svg>/gi, "").replace(/<[^>]+>/g, "").trim()
    if (/<svg\b/i.test(content) && !visibleText && !/(?:aria-label|title)\s*=/i.test(attributes)) errors.push("Every icon-only control requires an accessible name")
  }
  if (proposal.evidence.sourceFiles.length < 2) errors.push("Evidence must cite at least two repository source files")
  if (proposal.evidence.preservedContent.length < 2) errors.push("Evidence must identify preserved repository content")
  if (proposal.evidence.designDecisions.length < 3) errors.push("Evidence must explain at least three concrete design decisions")
  if (proposal.evidence.incumbentImprovement.trim().length < 80) errors.push("Evidence must explain why this improves the incumbent design")
  if (proposal.evidence.iconStrategy.trim().length < 40) errors.push("Evidence must explain the icon strategy")
  for (const assetPath of proposal.evidence.assetPaths) {
    const treatment = proposal.evidence.assetTreatments.find((item) => item.path === assetPath)
    if (!treatment) {
      errors.push(`Missing surface treatment for asset: ${assetPath}`)
      continue
    }
    if (!hexToRgb(treatment.background)) errors.push(`Asset treatment background must be a hex color: ${assetPath}`)
    if (treatment.rationale.trim().length < 40) errors.push(`Asset treatment must explain visibility and contrast: ${assetPath}`)
    if (!proposal.css.toLowerCase().includes(treatment.background.toLowerCase())) errors.push(`Declared asset background is not used in CSS: ${assetPath}`)
  }
  if (proposal.evidence.contrastChecks.length < 4) errors.push("Evidence must include at least four contrast checks covering text, icons, and controls")
  if (!proposal.evidence.contrastChecks.some((check) => check.usage === "icon" || check.usage === "control")) errors.push("Evidence must include icon or control contrast")
  for (const check of proposal.evidence.contrastChecks) {
    const ratio = contrastRatio(check.foreground, check.background)
    if (ratio === null) {
      errors.push(`Contrast colors must be six-digit hex values: ${check.foreground} on ${check.background}`)
      continue
    }
    const minimum = check.usage === "text" ? 4.5 : 3
    if (ratio < minimum) errors.push(`${check.usage} contrast ${ratio.toFixed(2)}:1 fails ${minimum}:1 for ${check.foreground} on ${check.background}`)
    for (const [role, color] of [["foreground", check.foreground], ["background", check.background]] as const) {
      if (!cssMentionsColor(proposal.css, color)) errors.push(`Contrast check ${role} ${color} is not a color the CSS actually uses`)
    }
  }
  if (proposal.evidence.affordanceChecks.length < 3) errors.push("Evidence must review at least three important control affordances")
  for (const check of proposal.evidence.affordanceChecks) {
    if (check.control.trim().length < 3 || check.signifier.trim().length < 20 || check.feedback.trim().length < 20) errors.push("Affordance checks must identify the control, its visible signifier, and interaction feedback")
    if (check.targetSize < 44) errors.push(`${check.control} target size ${check.targetSize}px is below 44px`)
  }
  const reviewedHeuristics = new Set(proposal.evidence.nielsenReview.map((review) => review.heuristic))
  for (const heuristic of nielsenHeuristics) {
    if (!reviewedHeuristics.has(heuristic)) errors.push(`Missing Nielsen heuristic review: ${heuristic}`)
  }
  if (reviewedHeuristics.size !== nielsenHeuristics.length || proposal.evidence.nielsenReview.length !== nielsenHeuristics.length) errors.push("Nielsen review must contain each of the 10 heuristics exactly once")
  for (const review of proposal.evidence.nielsenReview) {
    if (review.finding.trim().length < 30 || review.implementation.trim().length < 30) errors.push(`Nielsen review lacks actionable detail: ${review.heuristic}`)
  }
  for (const relativePath of [...proposal.evidence.sourceFiles, ...proposal.evidence.assetPaths]) {
    try {
      await readFile(assertWorktreePath(worktree, relativePath))
    } catch {
      errors.push(`Evidence path does not exist: ${relativePath}`)
    }
  }
  for (const assetPath of proposal.evidence.assetPaths) {
    const encodedPath = encodeURIComponent(assetPath)
    if (!proposal.html.includes(assetPath) && !proposal.html.includes(encodedPath)) errors.push(`Declared asset is not used in HTML: ${assetPath}`)
  }
  if (errors.length) throw new Error(`${proposal.name}: ${errors.join("; ")}`)
}

function containsNode(outer: DesignNode, inner: DesignNode): boolean {
  return inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.width <= outer.x + outer.width && inner.y + inner.height <= outer.y + outer.height
}

function overlapsNode(first: DesignNode, second: DesignNode): boolean {
  return first.x < second.x + second.width && first.x + first.width > second.x && first.y < second.y + second.height && first.y + first.height > second.y
}

function textHeight(node: DesignNode): number {
  if (!node.text || node.kind === "image") return node.height
  const charactersPerLine = Math.max(8, Math.floor(node.width / (node.fontSize * 0.65)))
  const lineCount = node.text.split("\n").reduce((count, line) => count + Math.max(1, Math.ceil(line.length / charactersPerLine)), 0)
  const padding = node.kind === "card" ? 48 : node.kind === "button" ? 20 : node.kind === "badge" ? 10 : 0
  return Math.ceil(lineCount * node.fontSize * 1.18 + padding)
}

function normalizeProposalNodes(nodes: DesignNode[]): DesignNode[] {
  const containerIds = new Set(nodes.filter((node) => node.kind === "card" && nodes.some((other) => other.id !== node.id && containsNode(node, other))).map((node) => node.id))
  const flattenedNodes = nodes.filter((node) => !containerIds.has(node.id)).map((node) => ({ ...node, height: Math.max(node.height, textHeight(node)) }))
  const orderedNodes = [...flattenedNodes].sort((first, second) => first.y - second.y)
  for (let firstIndex = 0; firstIndex < orderedNodes.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < orderedNodes.length; secondIndex += 1) {
      const first = orderedNodes[firstIndex]
      const second = orderedNodes[secondIndex]
      const horizontalOverlap = first.x < second.x + second.width && first.x + first.width > second.x
      if (horizontalOverlap && second.y < first.y + first.height + 12) second.y = first.y + first.height + 12
    }
  }
  for (let firstIndex = 0; firstIndex < orderedNodes.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < orderedNodes.length; secondIndex += 1) {
      const first = orderedNodes[firstIndex]
      const second = orderedNodes[secondIndex]
      if (!overlapsNode(first, second)) continue
      throw new Error(`Proposal has overlapping nodes: ${first.id} and ${second.id}`)
    }
  }
  return orderedNodes
}

function proposalPage(input: DesignProposalInput, brief: string): DesignPage {
  const page = defaultPage(brief)
  const mobileLanding = /landing|móvil|mobile/i.test(brief) && !/desktop|escritorio/i.test(brief)
  page.id = `proposal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  page.name = input.name
  page.direction = input.direction
  page.summary = input.summary
  page.background = input.background as string
  page.html = input.html
  page.css = input.css
  page.fonts = input.fonts ?? []
  page.plan = input.plan
  page.evidence = input.evidence
  page.nodes = input.nodes?.length ? normalizeProposalNodes(input.nodes) : []
  const viewport = input.viewport ?? (mobileLanding ? { width: 390, height: 1800 } : page.viewport)
  if (page.nodes.length) {
    const minX = Math.min(...page.nodes.map((node) => node.x))
    const minY = Math.min(...page.nodes.map((node) => node.y))
    const maxX = Math.max(...page.nodes.map((node) => node.x + node.width))
    const maxY = Math.max(...page.nodes.map((node) => node.y + node.height))
    if (minX < 0 || minY < 0 || maxX > viewport.width) throw new Error(`Proposal has nodes outside its viewport: ${input.name}`)
    page.viewport = { width: viewport.width, height: Math.max(viewport.height, maxY + 24) }
  } else {
    page.viewport = viewport
  }
  page.notes = input.notes ?? [{ id: `${page.id}-note`, nodeId: page.nodes[0]?.id ?? null, text: input.summary }]
  return page
}

const maxRoundSize = 3

// Differentiation is checked across the whole resulting round, so a proposal
// appended on its own is still compared against the ones already stored.
function assertDistinctDirections(pages: DesignPage[]): void {
  const comparable = pages.filter((page) => page.plan && page.html && page.css && page.evidence)
  for (let firstIndex = 0; firstIndex < comparable.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < comparable.length; secondIndex += 1) {
      const first = comparable[firstIndex]
      const second = comparable[secondIndex]
      if (first.html!.trim() === second.html!.trim() && first.css!.trim() === second.css!.trim()) throw new Error(`${first.name} and ${second.name} are identical`)
      const firstDecisions = `${first.direction} ${first.evidence!.designDecisions.join(" ")}`
      const secondDecisions = `${second.direction} ${second.evidence!.designDecisions.join(" ")}`
      if (tokenSimilarity(firstDecisions, secondDecisions) > 0.82) throw new Error(`${first.name} and ${second.name} use indistinguishable design decisions`)
      if (tokenSimilarity(first.plan!.signature, second.plan!.signature) > 0.7) throw new Error(`${first.name} and ${second.name} are remembered for the same signature element`)
      const sharedPalette = first.plan!.palette.filter((color) => second.plan!.palette.some((other) => other.hex.toLowerCase() === color.hex.toLowerCase())).length
      if (sharedPalette >= 4) throw new Error(`${first.name} and ${second.name} reuse the same palette; give each direction its own color story`)
      const firstFaces = new Set((first.fonts ?? []).map((spec) => fontSpecFamily(spec).toLowerCase()))
      const secondFaces = new Set((second.fonts ?? []).map((spec) => fontSpecFamily(spec).toLowerCase()))
      if (firstFaces.size && firstFaces.size === secondFaces.size && [...firstFaces].every((face) => secondFaces.has(face))) {
        throw new Error(`${first.name} and ${second.name} use an identical typeface pairing; typography is where each direction earns its personality`)
      }
    }
  }
}

export type DesignIntakeInput = {
  brief: string
  context: DesignIntakeContext
  audience: string
  register: DesignIntakeRegister
  primaryAction: string
  surface: string
  viewport: DesignIntakeViewport
  constraints?: string[]
  outOfScope?: string[]
  userAnswers: string[]
}

const intakeContexts: DesignIntakeContext[] = ["internal-tool", "product-ui", "marketing", "client-deliverable", "other"]
const intakeRegisters: DesignIntakeRegister[] = ["formal", "neutral", "expressive"]
const intakeViewports: DesignIntakeViewport[] = ["mobile", "desktop", "responsive"]
const placeholderAnswer = /^(n\/?a|na|none|nada|tbd|todo|unknown|desconocido|sin especificar|[-?.]+)$/i

function cleanList(values: string[] | undefined): string[] {
  return (values ?? []).map((value) => value.trim()).filter(Boolean).slice(0, 20)
}

function assertIntakeInput(input: DesignIntakeInput): void {
  const errors: string[] = []
  const filled = (value: string, minimum: number) => value.trim().length >= minimum && !placeholderAnswer.test(value.trim())
  if (!filled(input.brief ?? "", 8)) errors.push("brief: restate what the user asked for")
  if (!intakeContexts.includes(input.context)) errors.push(`context: one of ${intakeContexts.join(", ")}`)
  if (!intakeRegisters.includes(input.register)) errors.push(`register: one of ${intakeRegisters.join(", ")}`)
  if (!intakeViewports.includes(input.viewport)) errors.push(`viewport: one of ${intakeViewports.join(", ")}`)
  if (!filled(input.audience ?? "", 3)) errors.push("audience: name who actually uses this surface")
  if (!filled(input.primaryAction ?? "", 12)) errors.push("primaryAction: the one thing this surface must get done")
  if (!filled(input.surface ?? "", 3)) errors.push("surface: which page or screen is being designed")
  const answers = cleanList(input.userAnswers)
  if (!answers.length || answers.join(" ").length < 10) errors.push("userAnswers: quote what the user answered; the intake cannot be invented")
  if (errors.length) throw new Error(`The design intake is incomplete. Ask the user and record real answers -> ${errors.join("; ")}`)
}

export async function recordDesignIntake(worktree: string, input: DesignIntakeInput): Promise<DesignDocument> {
  assertIntakeInput(input)
  const documentPath = join(worktree, ".opencode", "designs", "design.json")
  await ensureDocument(documentPath, input.brief)
  const document = await readDocument(documentPath)
  document.brief = input.brief.trim()
  document.intake = {
    brief: input.brief.trim(),
    context: input.context,
    audience: input.audience.trim(),
    register: input.register,
    primaryAction: input.primaryAction.trim(),
    surface: input.surface.trim(),
    viewport: input.viewport,
    constraints: cleanList(input.constraints),
    outOfScope: cleanList(input.outOfScope),
    userAnswers: cleanList(input.userAnswers),
    answeredAt: new Date().toISOString(),
  }
  await writeDocument(documentPath, document)
  return readDocument(documentPath)
}

// Every round starts from answered questions. A surface for an internal tool and
// the same surface as a marketing page are different designs, and the plugin will
// not let the agent guess which one the user meant.
function assertIntakeRecorded(document: DesignDocument, brief: string): void {
  const intake = document.intake
  if (!intake) {
    throw new Error(
      "No design intake recorded yet. Ask the user about context (internal tool, product UI, marketing, client deliverable), audience, register (formal, neutral, expressive), the primary action, the surface and its viewport, then call design_intake with their answers before creating proposals.",
    )
  }
  const incoming = brief.trim()
  if (incoming && intake.brief && tokenSimilarity(incoming, intake.brief) < 0.3) {
    throw new Error(
      `The recorded intake answers a different brief ("${intake.brief}"). Ask the intake questions again for "${incoming}" and call design_intake before designing.`,
    )
  }
}

export async function createDesignProposals(
  worktree: string,
  brief: string,
  proposals: DesignProposalInput[],
  append = false,
  refinement = false,
): Promise<DesignDocument> {
  if (!proposals.length || proposals.length > maxRoundSize) {
    throw new Error(`Submit between 1 and ${maxRoundSize} proposals per call. Sending one at a time keeps each payload small and surfaces validation errors immediately.`)
  }
  if (proposals.some((proposal) => !proposal.html.trim() || !proposal.css.trim())) throw new Error("Every proposal must include complete HTML and CSS")
  const documentPath = join(worktree, ".opencode", "designs", "design.json")
  await ensureDocument(documentPath, brief)
  const document = await readDocument(documentPath)
  assertIntakeRecorded(document, brief)
  for (const proposal of proposals) await validateProposal(worktree, proposal)
  const mobileLanding = /landing|móvil|mobile/i.test(brief) && !/desktop|escritorio/i.test(brief)
  if (mobileLanding && proposals.some((proposal) => (proposal.viewport?.width ?? 390) > 480)) {
    throw new Error("Landing proposals must use a mobile viewport of 480px or less unless desktop was requested")
  }
  const history = document.history ?? []
  const previousRound = history[history.length - 1]
  if (previousRound && !refinement) {
    for (const proposal of proposals) {
      const repeated = previousRound.directions.find(
        (direction) => tokenSimilarity(`${proposal.direction} ${proposal.plan.signature}`, `${direction.direction} ${direction.signature}`) > 0.9,
      )
      if (repeated) {
        throw new Error(
          `${proposal.name} repeats the previous round's direction "${repeated.name}". Explore a genuinely different direction, or pass refinement: true when the user asked to refine this one.`,
        )
      }
    }
  }
  const outgoing = document.pages.filter((page) => page.plan)
  if (!append && outgoing.length) {
    history.push({
      round: history.length + 1,
      createdAt: new Date().toISOString(),
      brief: document.brief,
      directions: outgoing.map((page) => ({
        name: page.name,
        direction: page.direction,
        signature: page.plan?.signature ?? "",
        palette: page.plan?.palette.map((color) => color.hex) ?? [],
      })),
    })
  }
  const pages = proposals.map((proposal) => proposalPage(proposal, brief || document.brief))
  const nextPages = append ? [...document.pages, ...pages] : pages
  if (nextPages.length > maxRoundSize) {
    throw new Error(`A round holds at most ${maxRoundSize} proposals and the canvas already has ${document.pages.length}. Start a new round with append: false.`)
  }
  if (new Set(nextPages.map((page) => page.name.trim().toLowerCase())).size !== nextPages.length) throw new Error("Proposal names must be distinct")
  assertDistinctDirections(nextPages)
  document.pages = nextPages
  document.activePageId = document.pages[0].id
  // Appending the rest of a round must not discard an approval the user already made.
  const approvedSurvives = document.approvedPageId !== null && nextPages.some((page) => page.id === document.approvedPageId)
  document.approvedPageId = approvedSurvives ? document.approvedPageId : null
  document.brief = brief || document.brief
  document.history = history
  await writeDocument(documentPath, document)
  return readDocument(documentPath)
}

// The user should be able to just say which direction they prefer, so approval
// is available from the agent side instead of only through the canvas button.
export async function approveDesignPage(worktree: string, selector: string): Promise<{ document: DesignDocument; page: DesignPage }> {
  const documentPath = join(worktree, ".opencode", "designs", "design.json")
  await ensureDocument(documentPath, "")
  const document = await readDocument(documentPath)
  const wanted = selector.trim().toLowerCase()
  if (!wanted) throw new Error("Name the proposal to approve, by name, number, or id")
  const position = Number.parseInt(wanted, 10)
  const partial = document.pages.filter((page) => page.name.trim().toLowerCase().includes(wanted))
  const page =
    document.pages.find((entry) => entry.id.toLowerCase() === wanted) ??
    document.pages.find((entry) => entry.name.trim().toLowerCase() === wanted) ??
    (String(position) === wanted && position >= 1 && position <= document.pages.length ? document.pages[position - 1] : undefined) ??
    (partial.length === 1 ? partial[0] : undefined)
  if (!page) {
    const available = document.pages.map((entry, index) => `${index + 1}. ${entry.name}`).join(", ")
    throw new Error(`No single proposal matches "${selector}". Available: ${available || "none"}`)
  }
  document.approvedPageId = page.id
  document.activePageId = page.id
  await writeDocument(documentPath, document)
  return { document: await readDocument(documentPath), page }
}

export async function validateDesignDocument(worktree: string, document: DesignDocument): Promise<void> {
  if (document.pages.length !== maxRoundSize) {
    const missing = maxRoundSize - document.pages.length
    const have = document.pages.map((page) => page.name).join(", ") || "none"
    throw new Error(
      missing > 0
        ? `This round has ${document.pages.length} of ${maxRoundSize} proposals (${have}). Add the missing ${missing} with design_create_proposals and append: true before presenting.`
        : `This round has ${document.pages.length} proposals but a round holds ${maxRoundSize}. Start a clean round with append: false.`,
    )
  }
  const proposals: DesignProposalInput[] = document.pages.map((page) => {
    if (!page.html || !page.css || !page.evidence || !page.plan) throw new Error(`${page.name}: complete HTML, CSS, plan, and evidence are required`)
    return {
      name: page.name,
      direction: page.direction,
      summary: page.summary,
      viewport: page.viewport,
      background: page.background,
      html: page.html,
      css: page.css,
      fonts: page.fonts,
      plan: page.plan,
      evidence: page.evidence,
      nodes: page.nodes,
      notes: page.notes,
    }
  })
  for (const proposal of proposals) await validateProposal(worktree, proposal)
}

async function ensureDocument(documentPath: string, brief: string): Promise<void> {
  await mkdir(dirname(documentPath), { recursive: true })
  try {
    await readFile(documentPath, "utf8")
  } catch {
    await writeDocument(documentPath, defaultDocument(brief))
  }
}

async function readDocument(documentPath: string): Promise<DesignDocument> {
  const raw = await readFile(documentPath, "utf8")
  return normalizeDocument(JSON.parse(raw))
}

async function writeDocument(documentPath: string, document: DesignDocument): Promise<void> {
  const nextDocument = { ...document, updatedAt: new Date().toISOString() }
  await writeFile(documentPath, `${JSON.stringify(nextDocument, null, 2)}\n`, "utf8")
}

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body)
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  })
  response.end(payload)
}

function sendText(response: ServerResponse, status: number, body: string, contentType: string): void {
  response.writeHead(status, {
    "content-type": contentType,
    "cache-control": "no-store",
  })
  response.end(body)
}

function sendBuffer(response: ServerResponse, status: number, body: Buffer, contentType: string): void {
  response.writeHead(status, {
    "content-type": contentType,
    "cache-control": "no-store",
  })
  response.end(body)
}

function requestBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    request.on("data", (chunk: Buffer) => chunks.push(chunk))
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    request.on("error", reject)
  })
}

const googleFontLink = (fonts: string[]): string => {
  const specs = fonts.filter((spec) => googleFontSpec.test(spec))
  if (!specs.length) return ""
  const families = specs.map((spec) => `family=${spec}`).join("&")
  return `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?${families}&display=swap" rel="stylesheet">`
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" })[character] as string)
}

export function proposalPreviewDocument(page: DesignPage): string {
  const html = String(page.html ?? "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*(['"])[\s\S]*?\1/gi, "")
  const css = String(page.css ?? "").replace(/<\/style/gi, "<\\/style")
  const background = hexToRgb(page.background) ? page.background : "#ffffff"
  const reset = "*{box-sizing:border-box}html,body{margin:0;min-height:100%;overflow-x:hidden}img{display:block;max-width:100%}button,a{font:inherit}"
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(page.name)}</title>${googleFontLink(page.fonts ?? [])}<style>${reset}body{background:${background}}${css}</style></head><body>${html}</body></html>`
}

async function serveEditor(response: ServerResponse): Promise<void> {
  const html = await readFile(new URL("./design-editor.html", import.meta.url), "utf8")
  sendText(response, 200, html, "text/html; charset=utf-8")
}

export async function startDesignServer(worktree: string, brief = ""): Promise<DesignServer> {
  const existing = runningServers.get(worktree)
  if (existing) return existing

  const documentPath = join(worktree, ".opencode", "designs", "design.json")
  await ensureDocument(documentPath, brief)

  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://127.0.0.1")

      if (request.method === "GET" && url.pathname === "/") {
        await serveEditor(response)
        return
      }

      if (request.method === "GET" && url.pathname === "/api/preview") {
        const document = await readDocument(documentPath)
        const pageId = url.searchParams.get("page")
        const page = pageId ? document.pages.find((entry) => entry.id === pageId) : document.pages[0]
        if (!page) {
          sendJson(response, 404, { error: "Unknown proposal" })
          return
        }
        if (!page.html) {
          sendJson(response, 409, { error: "This proposal has no HTML to preview" })
          return
        }
        sendText(response, 200, proposalPreviewDocument(page), "text/html; charset=utf-8")
        return
      }

      if (request.method === "GET" && url.pathname === "/api/health") {
        sendJson(response, 200, { ok: true })
        return
      }

      if (request.method === "GET" && url.pathname === "/api/asset") {
        const relativePath = url.searchParams.get("path")
        if (!relativePath) {
          sendJson(response, 400, { error: "Missing asset path" })
          return
        }
        const worktreeRoot = resolve(worktree)
        const assetPath = resolve(worktreeRoot, relativePath)
        if (assetPath !== worktreeRoot && !assetPath.startsWith(`${worktreeRoot}${sep}`)) {
          sendJson(response, 403, { error: "Asset path is outside the worktree" })
          return
        }
        const contentTypes: Record<string, string> = {
          ".gif": "image/gif",
          ".jpeg": "image/jpeg",
          ".jpg": "image/jpeg",
          ".png": "image/png",
          ".svg": "image/svg+xml",
          ".webp": "image/webp",
        }
        const contentType = contentTypes[extname(assetPath).toLowerCase()]
        if (!contentType) {
          sendJson(response, 415, { error: "Unsupported asset type" })
          return
        }
        sendBuffer(response, 200, await readFile(assetPath), contentType)
        return
      }

      if (request.method === "GET" && url.pathname === "/api/document") {
        sendJson(response, 200, await readDocument(documentPath))
        return
      }

      if (request.method === "PUT" && url.pathname === "/api/document") {
        const parsed: unknown = JSON.parse(await requestBody(request))
        if (!isDesignDocument(parsed)) {
          sendJson(response, 400, { error: "Invalid design document" })
          return
        }
        await writeDocument(documentPath, parsed)
        sendJson(response, 200, await readDocument(documentPath))
        return
      }

      sendJson(response, 404, { error: "Not found" })
    } catch (error) {
      sendJson(response, 500, { error: error instanceof Error ? error.message : "Unknown error" })
    }
  })

  await new Promise<void>((resolve, reject) => {
    const onError = (error: Error) => {
      server.off("listening", onListening)
      reject(error)
    }
    const onListening = () => {
      server.off("error", onError)
      resolve()
    }
    server.once("error", onError)
    server.once("listening", onListening)
    server.listen(0, "127.0.0.1")
  })

  const address = server.address()
  if (!address || typeof address === "string") {
    server.close()
    throw new Error("Could not determine design canvas port")
  }

  const result: DesignServer = {
    url: `http://127.0.0.1:${address.port}`,
    documentPath,
    close: () => {
      runningServers.delete(worktree)
      server.close()
    },
  }
  runningServers.set(worktree, result)
  return result
}

export async function getDesignDocument(worktree: string): Promise<DesignDocument> {
  const documentPath = join(worktree, ".opencode", "designs", "design.json")
  await ensureDocument(documentPath, "")
  return readDocument(documentPath)
}
