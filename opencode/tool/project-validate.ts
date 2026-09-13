import { tool } from "@opencode-ai/plugin"
import { existsSync } from "node:fs"

/**
 * Project validation commands inspector.
 *
 * Reads available tasks/scripts from the project's config files.
 * Supports: pyproject.toml (uv/hatch/poetry), mise.toml, Makefile, package.json.
 *
 * Use this to discover what validation commands exist before running them.
 */
export default tool({
  description: "List available project tasks/scripts from pyproject.toml, mise.toml, Makefile, or package.json. Use before validation to discover the right commands.",
  args: {
    filter: tool.schema.string().optional().describe("Filter tasks by name pattern (e.g. 'test', 'lint', 'type')"),
  },
  async execute({ filter }) {
    const results: string[] = []

    // 1. mise.toml / .mise.toml
    for (const misePath of ["mise.toml", ".mise.toml", "mise.local.toml"]) {
      if (existsSync(misePath)) {
        try {
          const content = await Bun.file(misePath).text()
          const tasks = parseMiseTasks(content, filter)
          if (tasks.length > 0) {
            results.push(`## mise tasks (${misePath})\n${tasks.join("\n")}`)
          }
        } catch { /* skip */ }
      }
    }

    // 2. pyproject.toml - [tool.hatch.envs.*.scripts] and [tool.taskipy.tasks]
    if (existsSync("pyproject.toml")) {
      try {
        const content = await Bun.file("pyproject.toml").text()
        const tasks = parsePyprojectTasks(content, filter)
        if (tasks.length > 0) {
          results.push(`## pyproject.toml tasks\n${tasks.join("\n")}`)
        }
      } catch { /* skip */ }
    }

    // 3. Makefile
    if (existsSync("Makefile")) {
      try {
        const content = await Bun.file("Makefile").text()
        const tasks = parseMakeTargets(content, filter)
        if (tasks.length > 0) {
          results.push(`## Makefile targets\n${tasks.join("\n")}`)
        }
      } catch { /* skip */ }
    }

    // 4. package.json (for mixed projects)
    if (existsSync("package.json")) {
      try {
        const pkg = await Bun.file("package.json").json()
        const scripts = pkg.scripts || {}
        let entries = Object.entries(scripts) as [string, string][]
        if (filter) {
          entries = entries.filter(([name]) => name.toLowerCase().includes(filter.toLowerCase()))
        }
        if (entries.length > 0) {
          const maxLen = Math.min(20, Math.max(...entries.map(([n]) => n.length)))
          const formatted = entries
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([name, cmd]) => {
              const truncCmd = (cmd as string).length > 60 ? (cmd as string).slice(0, 57) + "..." : cmd
              return `  ${name.padEnd(maxLen)}  ${truncCmd}`
            })
          results.push(`## package.json scripts\n${formatted.join("\n")}`)
        }
      } catch { /* skip */ }
    }

    if (results.length === 0) {
      return filter
        ? `No tasks matching "${filter}" found in any config file.`
        : "No task config found. Expected: mise.toml, pyproject.toml (hatch/taskipy), Makefile, or package.json."
    }

    return results.join("\n\n")
  },
})

/**
 * Parse tasks from mise.toml [tasks] section.
 */
function parseMiseTasks(content: string, filter?: string): string[] {
  const tasks: string[] = []
  const taskRegex = /^\[tasks\.([^\]]+)\]|^(\w[\w-]*)\s*=\s*["'](.+?)["']/gm
  let match: RegExpExecArray | null

  // Simple [tasks.name] blocks
  const blockRegex = /\[tasks\.([^\]]+)\][^\[]*(?:run\s*=\s*["']([^"']+)["'])?/g
  while ((match = blockRegex.exec(content)) !== null) {
    const name = match[1].trim()
    const run = match[2]?.trim() || ""
    if (!filter || name.toLowerCase().includes(filter.toLowerCase())) {
      tasks.push(`  ${name.padEnd(20)}  ${run.slice(0, 60)}`)
    }
  }

  return tasks
}

/**
 * Parse tasks from pyproject.toml (hatch, taskipy, scripts sections).
 */
function parsePyprojectTasks(content: string, filter?: string): string[] {
  const tasks: string[] = []

  // taskipy: [tool.taskipy.tasks]
  const taskipyMatch = content.match(/\[tool\.taskipy\.tasks\]([\s\S]*?)(?=\n\[|\z)/)
  if (taskipyMatch) {
    const lines = taskipyMatch[1].split("\n")
    for (const line of lines) {
      const m = line.match(/^(\w[\w-]*)\s*=\s*["']([^"']+)["']/)
      if (m) {
        const [, name, cmd] = m
        if (!filter || name.toLowerCase().includes(filter.toLowerCase())) {
          tasks.push(`  ${name.padEnd(20)}  ${cmd.slice(0, 60)}`)
        }
      }
    }
  }

  // hatch scripts: [tool.hatch.envs.*.scripts]
  const hatchRegex = /\[tool\.hatch\.envs\.([^\]]+?)\.scripts\]([\s\S]*?)(?=\n\[|\z)/g
  let hatchMatch: RegExpExecArray | null
  while ((hatchMatch = hatchRegex.exec(content)) !== null) {
    const env = hatchMatch[1]
    const lines = hatchMatch[2].split("\n")
    for (const line of lines) {
      const m = line.match(/^(\w[\w-]*)\s*=\s*["']([^"']+)["']/)
      if (m) {
        const [, name, cmd] = m
        if (!filter || name.toLowerCase().includes(filter.toLowerCase())) {
          tasks.push(`  ${name.padEnd(20)}  hatch run ${env}:${name}  (${cmd.slice(0, 40)})`)
        }
      }
    }
  }

  // [project.scripts] - entrypoints (less relevant for dev tasks, but informative)
  const scriptsMatch = content.match(/\[project\.scripts\]([\s\S]*?)(?=\n\[|\z)/)
  if (scriptsMatch) {
    const lines = scriptsMatch[1].split("\n")
    for (const line of lines) {
      const m = line.match(/^(\w[\w.-]*)\s*=\s*["']([^"']+)["']/)
      if (m) {
        const [, name, entry] = m
        if (!filter || name.toLowerCase().includes(filter.toLowerCase())) {
          tasks.push(`  ${name.padEnd(20)}  [entrypoint] ${entry.slice(0, 50)}`)
        }
      }
    }
  }

  return tasks
}

/**
 * Parse targets from Makefile (phony targets with description comment).
 */
function parseMakeTargets(content: string, filter?: string): string[] {
  const targets: string[] = []
  const lines = content.split("\n")

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const targetMatch = line.match(/^([a-zA-Z][\w-]*):\s*(?:[^#]*)$/)
    if (targetMatch) {
      const name = targetMatch[1]
      // Skip internal targets and common non-commands
      if (["all", "clean", ".PHONY", "PHONY"].includes(name)) continue
      if (!filter || name.toLowerCase().includes(filter.toLowerCase())) {
        // Look for ## comment on same line or preceding line
        const comment = line.match(/##\s*(.+)$/)?.[1] || lines[i - 1]?.match(/^#\s*(.+)$/)?.[1] || ""
        targets.push(`  ${name.padEnd(20)}  ${comment.slice(0, 60)}`)
      }
    }
  }

  return targets
}
