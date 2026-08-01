import type { Plugin } from "@opencode-ai/plugin"
import { createHash } from "node:crypto"

const IGNORED_ARG_KEYS = new Set(["description"])

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`
  const obj = value as Record<string, unknown>
  const keys = Object.keys(obj).filter((key) => !IGNORED_ARG_KEYS.has(key)).sort()
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(obj[key])}`).join(",")}}`
}

const AntiLoopPlugin: Plugin = async () => {
  let lastHash: string | null = null

  return {
    "tool.execute.before": async (input, output) => {
      const hash = createHash("md5")
        .update(input.tool + stableStringify(output.args))
        .digest("hex")

      if (hash === lastHash) {
        throw new Error(
          `[anti-loop] Identical call to "${input.tool}" detected. ` +
            `The previous call returned the same result. ` +
            `Do NOT retry this command. Change strategy: use a different tool, ` +
            `different arguments, or ask the user.`,
        )
      }

      lastHash = hash
    },
  }
}

export default AntiLoopPlugin
