import type { Plugin } from "@opencode-ai/plugin"
import { createHash } from "node:crypto"

/**
 * Anti-loop plugin.
 *
 * Detects when the model issues the exact same tool call twice in a row
 * (same tool name + same arguments) and aborts the second call with an
 * explicit instruction to change strategy.
 *
 * Cost: one md5 per tool call (~microseconds).
 *
 * Notes on the hash:
 *  - The `description` field is excluded because it is a UX hint that the
 *    model can vary freely without changing what the tool actually does.
 *    Two bash calls with the same `command` but different descriptions
 *    must hash to the same value or the loop is never detected.
 *  - Object key order is normalized via sorted JSON.stringify so that
 *    `{a:1,b:2}` and `{b:2,a:1}` produce the same hash.
 */
const IGNORED_ARG_KEYS = new Set(["description"])

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`
  const obj = value as Record<string, unknown>
  const keys = Object.keys(obj).filter((k) => !IGNORED_ARG_KEYS.has(k)).sort()
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(",")}}`
}

const AntiLoopPlugin: Plugin = async () => {
  let lastHash: string | null = null

  return {
    "tool.execute.before": async (input, output) => {
      const hash = createHash("md5")
        .update(input.tool + stableStringify(output.args))
        .digest("hex")

      if (hash === lastHash) {
        // Keep lastHash set so further identical retries also fail.
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
