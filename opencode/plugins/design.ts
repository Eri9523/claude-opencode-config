import { mkdir } from "node:fs/promises"
import { join } from "node:path"
import { tool, type Plugin } from "@opencode-ai/plugin"
import { approveDesignPage, createDesignProposals, getDesignDocument, recordDesignIntake, startDesignServer, validateDesignDocument } from "./design-server"

async function openBrowser(shell: Parameters<Plugin>[0]["$"], url: string): Promise<void> {
  try {
    if (process.platform === "darwin") {
      await shell`open ${url}`.quiet()
      return
    }
    if (process.platform === "win32") {
      await shell`start ${url}`.quiet()
      return
    }
    await shell`xdg-open ${url}`.quiet()
  } catch {
    // The URL is still returned to the caller when no desktop opener exists.
  }
}

export const DesignCanvasPlugin: Plugin = async ({ $, worktree }) => {
  async function openCanvas(brief = "") {
    const server = await startDesignServer(worktree, brief)
    await openBrowser($, server.url)
    return server
  }

  return {
    tool: {
      design_open: tool({
        description: "Open the local interactive design canvas in the user's browser.",
        args: {
          brief: tool.schema.string().optional(),
        },
        async execute(args) {
          const server = await openCanvas(args.brief ?? "")
          return {
            title: "Design canvas opened",
            output: `Canvas: ${server.url}\nDocument: ${server.documentPath}\nThe user can select layers, edit properties, drag elements, and add notes in the browser.`,
            metadata: { url: server.url, documentPath: server.documentPath },
          }
        },
      }),
      design_intake: tool({
        description:
          "Record the answers to the /design qualifying questions. Ask the user first: this is the gate design_create_proposals checks, and it refuses to open a round until real answers are stored. Call it again whenever the brief changes.",
        args: {
          brief: tool.schema.string(),
          context: tool.schema.enum(["internal-tool", "product-ui", "marketing", "client-deliverable", "other"]),
          audience: tool.schema.string(),
          register: tool.schema.enum(["formal", "neutral", "expressive"]),
          primaryAction: tool.schema.string(),
          surface: tool.schema.string(),
          viewport: tool.schema.enum(["mobile", "desktop", "responsive"]),
          constraints: tool.schema.array(tool.schema.string()).optional(),
          outOfScope: tool.schema.array(tool.schema.string()).optional(),
          userAnswers: tool.schema.array(tool.schema.string()),
        },
        async execute(args) {
          const document = await recordDesignIntake(worktree, args)
          const intake = document.intake!
          const lines = [
            `Context: ${intake.context}`,
            `Audience: ${intake.audience}`,
            `Register: ${intake.register}`,
            `Primary action: ${intake.primaryAction}`,
            `Surface: ${intake.surface} (${intake.viewport})`,
            intake.constraints.length ? `Constraints: ${intake.constraints.join("; ")}` : "",
            intake.outOfScope.length ? `Out of scope: ${intake.outOfScope.join("; ")}` : "",
          ].filter(Boolean)
          return {
            title: "Design intake recorded",
            output: `${lines.join("\n")}\n\nEvery direction must answer this brief. Design for this context and register, not for a generic version of the surface.`,
            metadata: { intake },
          }
        },
      }),
      design_get: tool({
        description: "Read the latest design document saved by the local interactive canvas.",
        args: {},
        async execute() {
          const document = await getDesignDocument(worktree)
          return {
            title: "Current design document",
            output: JSON.stringify(document, null, 2),
            metadata: {
              document,
              approvedPage: document.pages.find((page) => page.id === document.approvedPageId) ?? null,
            },
          }
        },
      }),
      design_create_proposals: tool({
        description:
          "Add design proposals to the local canvas. Submit ONE proposal per call: use append: false for the first of a round and append: true for each of the next two. A round holds 3 proposals, but sending all three in a single call means emitting tens of thousands of tokens of JSON at once, which is slow and forces a full regeneration when any single check fails.",
        args: {
          brief: tool.schema.string().optional(),
          proposals: tool.schema.array(tool.schema.object({
            name: tool.schema.string(),
            direction: tool.schema.string(),
            summary: tool.schema.string(),
            headline: tool.schema.string().optional(),
            viewport: tool.schema.object({
              width: tool.schema.number(),
              height: tool.schema.number(),
            }).optional(),
            background: tool.schema.string().optional(),
            html: tool.schema.string(),
            css: tool.schema.string(),
            fonts: tool.schema.array(tool.schema.string()).optional(),
            plan: tool.schema.object({
              palette: tool.schema.array(tool.schema.object({
                name: tool.schema.string(),
                hex: tool.schema.string(),
              })),
              typography: tool.schema.array(tool.schema.object({
                role: tool.schema.enum(["display", "body", "utility"]),
                family: tool.schema.string(),
                usage: tool.schema.string(),
              })),
              layoutConcept: tool.schema.string(),
              signature: tool.schema.string(),
              risk: tool.schema.string(),
            }),
            evidence: tool.schema.object({
              sourceFiles: tool.schema.array(tool.schema.string()),
              preservedContent: tool.schema.array(tool.schema.string()),
              assetPaths: tool.schema.array(tool.schema.string()),
              designDecisions: tool.schema.array(tool.schema.string()),
              incumbentImprovement: tool.schema.string(),
              iconStrategy: tool.schema.string(),
              assetTreatments: tool.schema.array(tool.schema.object({
                path: tool.schema.string(),
                background: tool.schema.string(),
                rationale: tool.schema.string(),
              })),
              contrastChecks: tool.schema.array(tool.schema.object({
                foreground: tool.schema.string(),
                background: tool.schema.string(),
                usage: tool.schema.enum(["text", "large-text", "icon", "control"]),
              })),
              affordanceChecks: tool.schema.array(tool.schema.object({
                control: tool.schema.string(),
                signifier: tool.schema.string(),
                feedback: tool.schema.string(),
                targetSize: tool.schema.number(),
              })),
              nielsenReview: tool.schema.array(tool.schema.object({
                heuristic: tool.schema.enum([
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
                ]),
                finding: tool.schema.string(),
                implementation: tool.schema.string(),
              })),
            }),
            nodes: tool.schema.array(tool.schema.object({
              id: tool.schema.string(),
              kind: tool.schema.enum(["text", "button", "card", "input", "badge", "image"]),
              name: tool.schema.string(),
              text: tool.schema.string(),
              x: tool.schema.number(),
              y: tool.schema.number(),
              width: tool.schema.number(),
              height: tool.schema.number(),
              fill: tool.schema.string(),
              color: tool.schema.string(),
              borderColor: tool.schema.string(),
              borderWidth: tool.schema.number(),
              radius: tool.schema.number(),
              fontSize: tool.schema.number(),
              fontWeight: tool.schema.number(),
              fontStyle: tool.schema.enum(["normal", "italic"]).optional(),
              textDecoration: tool.schema.enum(["none", "underline"]).optional(),
              assetPath: tool.schema.string().optional(),
              opacity: tool.schema.number(),
            })).optional(),
            notes: tool.schema.array(tool.schema.object({
              id: tool.schema.string(),
              nodeId: tool.schema.string().nullable(),
              text: tool.schema.string(),
            })).optional(),
          })),
          append: tool.schema.boolean().optional(),
          refinement: tool.schema.boolean().optional(),
        },
        async execute(args) {
          const document = await createDesignProposals(worktree, args.brief ?? "", args.proposals, args.append ?? false, args.refinement ?? false)
          const server = await startDesignServer(worktree, args.brief ?? "")
          const previous = document.history?.[document.history.length - 1]
          const previouslyTried = previous ? `\nAlready explored in round ${previous.round}: ${previous.directions.map((direction) => `${direction.name} (${direction.signature.slice(0, 80)})`).join("; ")}` : ""
          const remaining = 3 - document.pages.length
          const next = remaining > 0
            ? `Accepted. ${remaining} more proposal${remaining === 1 ? "" : "s"} needed for a full round: call again with append: true.`
            : "The round is complete. Call design_screenshot next and actually look at every proposal before presenting anything, then design_present once visual QA passes."
          return {
            title: `Proposal accepted (${document.pages.length}/3)`,
            output: `${next}\nCanvas: ${server.url}${previouslyTried}`,
            metadata: { url: server.url, document },
          }
        },
      }),
      design_screenshot: tool({
        description: "Render each design proposal headlessly and return PNG paths so the agent can visually review its own work before presenting it.",
        args: {
          pageId: tool.schema.string().optional(),
          viewportWidth: tool.schema.number().optional(),
          viewportHeight: tool.schema.number().optional(),
        },
        async execute(args) {
          const document = await getDesignDocument(worktree)
          const pages = args.pageId ? document.pages.filter((page) => page.id === args.pageId) : document.pages
          if (!pages.length) throw new Error(args.pageId ? `Unknown proposal: ${args.pageId}` : "The canvas has no proposals to screenshot")
          const renderable = pages.filter((page) => page.html)
          if (!renderable.length) throw new Error("No proposal has HTML to render; screenshots only work on HTML/CSS proposals")
          const server = await startDesignServer(worktree, document.brief)
          const outputDir = join(worktree, ".opencode", "designs", "screenshots")
          await mkdir(outputDir, { recursive: true })
          const results: Array<{ name: string; path: string }> = []
          const failures: string[] = []
          // A stale bundled chromium is common, so fall back to the system Chrome install.
          const channels: Array<string[]> = [["--channel", "chrome"], []]
          let workingChannel: string[] | null = null
          for (const page of renderable) {
            const width = args.viewportWidth ?? page.viewport.width
            const height = args.viewportHeight ?? Math.min(page.viewport.height, 1400)
            const target = join(outputDir, `${page.id}.png`)
            const url = `${server.url}/api/preview?page=${encodeURIComponent(page.id)}`
            const attempts = workingChannel ? [workingChannel] : channels
            let lastError = "screenshot failed"
            let rendered = false
            for (const channel of attempts) {
              try {
                await $`npx --no-install playwright screenshot --browser chromium ${channel} --viewport-size ${`${width},${height}`} --full-page --wait-for-timeout 1500 ${url} ${target}`.quiet()
                workingChannel = channel
                rendered = true
                break
              } catch (error) {
                lastError = error instanceof Error ? error.message : lastError
              }
            }
            if (rendered) results.push({ name: page.name, path: target })
            else failures.push(`${page.name}: ${lastError}`)
          }
          if (!results.length) {
            throw new Error(`Could not render any proposal. Install a browser with "npx playwright install chromium". ${failures.join(" | ")}`)
          }
          const lines = results.map((result) => `${result.name}: ${result.path}`).join("\n")
          const warning = failures.length ? `\n\nFailed to render: ${failures.join(" | ")}` : ""
          return {
            title: `Rendered ${results.length} proposal${results.length === 1 ? "" : "s"}`,
            output: `Read each of these images before judging the designs. A rendered pixel is worth a thousand tokens of self-assessment.\n${lines}${warning}`,
            metadata: { screenshots: results, failures },
          }
        },
      }),
      design_approve: tool({
        description:
          "Mark one proposal as the approved design. Use this as soon as the user says which direction they prefer — they should never be asked to click Approve in the canvas. Accepts the proposal name, its position in the round (1, 2, 3), or its id.",
        args: {
          proposal: tool.schema.string(),
        },
        async execute(args) {
          const { document, page } = await approveDesignPage(worktree, args.proposal)
          return {
            title: `Approved: ${page.name}`,
            output: `${page.name} is now the approved design (${page.id}). Implement from this page: translate it into the project's UI stack and preserve its design intent.`,
            metadata: { document, approvedPage: page },
          }
        },
      }),
      design_present: tool({
        description: "Open a validated design canvas after the agent has visually reviewed all three proposals.",
        args: {},
        async execute() {
          const document = await getDesignDocument(worktree)
          await validateDesignDocument(worktree, document)
          const server = await openCanvas(document.brief)
          return {
            title: "Design proposals presented",
            output: `Canvas: ${server.url}\nAll three proposals are ready in Overview.`,
            metadata: { url: server.url, documentPath: server.documentPath },
          }
        },
      }),
    },
  }
}
