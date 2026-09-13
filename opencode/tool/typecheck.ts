import { tool } from "@opencode-ai/plugin"
import { $ } from "bun"

/**
 * Python-first type check with smart error grouping.
 *
 * Validation chain (in order):
 * 1. mise run type (preferred when mise task exists)
 * 2. uv run mypy . (fallback)
 * 3. uv run pyright (secondary fallback)
 * 4. uv run python -m py_compile <file> (last resort for single files)
 *
 * For TypeScript projects the chain falls back to:
 * 1. pnpm exec tsc --noEmit
 * 2. npx tsc --noEmit
 */
export default tool({
  description: "Run type check using project validation chain. Python-first: mise run type → uv run mypy → uv run pyright. Falls back to tsc for TypeScript projects.",
  args: {
    file: tool.schema.string().optional().describe("Specific file to check (optional; uses full check if omitted)"),
    python: tool.schema.boolean().optional().describe("Force Python validation chain (default: auto-detect from project)"),
  },
  async execute({ file, python }) {
    try {
      // Auto-detect project type
      const isPython = python ?? await detectPythonProject()

      if (isPython) {
        return await runPythonTypeCheck(file)
      } else {
        return await runTsTypeCheck(file)
      }
    } catch (e) {
      return `Type check failed: ${e}`
    }
  },
})

/**
 * Detects whether the project is Python-first by checking for pyproject.toml.
 */
async function detectPythonProject(): Promise<boolean> {
  try {
    await $`test -f pyproject.toml`.quiet()
    return true
  } catch {
    return false
  }
}

/**
 * Python validation chain: mise run type → mypy → pyright → py_compile.
 */
async function runPythonTypeCheck(file?: string): Promise<string> {
  // 1. Try mise run type
  try {
    await $`mise --version`.quiet()
    const miseTasksRaw = await $`mise tasks ls 2>/dev/null`.text()
    if (miseTasksRaw.includes("type")) {
      const result = await $`mise run type 2>&1`.text()
      return formatResult("mise run type", result)
    }
  } catch {
    // mise not available or no type task
  }

  // 2. Try uv run mypy
  try {
    await $`uv --version`.quiet()
    const target = file ? file : "."
    const result = await $`uv run mypy ${target} --show-error-codes 2>&1`.text()
    return formatResult("uv run mypy", result, parseMypyErrors)
  } catch {
    // mypy not installed
  }

  // 3. Try uv run pyright
  try {
    const target = file ? file : "."
    const result = await $`uv run pyright ${target} 2>&1`.text()
    return formatResult("uv run pyright", result)
  } catch {
    // pyright not available
  }

  // 4. Last resort: py_compile for a single file
  if (file) {
    try {
      const result = await $`uv run python -m py_compile ${file} 2>&1`.text()
      if (!result.trim()) {
        return `✓ ${file}: syntax OK (py_compile)`
      }
      return `✗ ${file}: ${result.trim()}`
    } catch (e: any) {
      return `✗ ${file}: ${e.stderr?.toString() || e}`
    }
  }

  return "⚠ No type checker found. Install mypy or pyright: uv add --dev mypy"
}

/**
 * TypeScript validation chain: pnpm exec tsc → npx tsc.
 */
async function runTsTypeCheck(file?: string): Promise<string> {
  const cmd = file
    ? `pnpm exec tsc --noEmit "${file}" 2>&1`
    : `pnpm exec tsc --noEmit 2>&1`

  let output: string
  try {
    const proc = Bun.spawn(["sh", "-c", cmd], { stdout: "pipe", stderr: "pipe" })
    const stdout = await new Response(proc.stdout).text()
    const stderr = await new Response(proc.stderr).text()
    output = stdout + stderr
  } catch {
    // fallback to npx tsc
    try {
      const fallback = file
        ? `npx tsc --noEmit "${file}" 2>&1`
        : `npx tsc --noEmit 2>&1`
      const proc = Bun.spawn(["sh", "-c", fallback], { stdout: "pipe", stderr: "pipe" })
      const stdout = await new Response(proc.stdout).text()
      const stderr = await new Response(proc.stderr).text()
      output = stdout + stderr
    } catch (e) {
      return `Type check failed: ${e}`
    }
  }

  if (!output.trim()) return "✓ No type errors"

  const errorLines = output.split("\n").filter((l) => l.includes("error TS"))
  if (errorLines.length === 0) return "✓ No type errors"

  // Group by file
  const byFile: Record<string, string[]> = {}
  for (const line of errorLines) {
    const match = line.match(/^([^(]+)\((\d+),(\d+)\): error (TS\d+): (.+)$/)
    if (match) {
      const [, filePath, lineNum, , code, msg] = match
      const key = filePath.trim()
      if (!byFile[key]) byFile[key] = []
      byFile[key].push(`  L${lineNum}: ${code} - ${msg}`)
    }
  }

  const summary = Object.entries(byFile)
    .slice(0, 10)
    .map(([f, errors]) => `${f}\n${errors.slice(0, 5).join("\n")}${errors.length > 5 ? `\n  ... +${errors.length - 5} more` : ""}`)
    .join("\n\n")

  const total = errorLines.length
  const filesCount = Object.keys(byFile).length

  return `✗ ${total} error${total > 1 ? "s" : ""} in ${filesCount} file${filesCount > 1 ? "s" : ""}:\n\n${summary}`
}

function formatResult(tool: string, output: string, parser?: (output: string) => string): string {
  if (!output.trim()) return `✓ No type errors (${tool})`
  const hasErrors = /error|Error/.test(output)
  if (!hasErrors) return `✓ No type errors (${tool})\n${output.slice(0, 500)}`
  return parser ? parser(output) : `✗ Type errors found (${tool}):\n\n${output.slice(0, 3000)}`
}

function parseMypyErrors(output: string): string {
  const lines = output.split("\n")
  const errorLines = lines.filter((l) => /error:/.test(l))
  if (errorLines.length === 0) return `✓ No type errors (mypy)\n${output.slice(0, 300)}`

  const byFile: Record<string, string[]> = {}
  for (const line of errorLines) {
    const match = line.match(/^(.+?):(\d+): error: (.+)$/)
    if (match) {
      const [, filePath, lineNum, msg] = match
      if (!byFile[filePath]) byFile[filePath] = []
      byFile[filePath].push(`  L${lineNum}: ${msg}`)
    }
  }

  const summary = Object.entries(byFile)
    .slice(0, 10)
    .map(([f, errors]) => `${f}\n${errors.slice(0, 5).join("\n")}${errors.length > 5 ? `\n  ... +${errors.length - 5} more` : ""}`)
    .join("\n\n")

  return `✗ ${errorLines.length} mypy error${errorLines.length > 1 ? "s" : ""} in ${Object.keys(byFile).length} file${Object.keys(byFile).length > 1 ? "s" : ""}:\n\n${summary}`
}
