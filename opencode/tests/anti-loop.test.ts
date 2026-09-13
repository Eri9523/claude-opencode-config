/**
 * Standalone test for anti-loop plugin.
 *
 * Run with:
 *   node --test tests/anti-loop.test.ts
 */
import AntiLoopPlugin from "../plugin/anti-loop.ts"

async function run() {
  // @ts-expect-error - plugin context not needed for this test
  const hooks = await AntiLoopPlugin({})
  const before = hooks["tool.execute.before"]!

  const call = (tool: string, args: Record<string, unknown>) =>
    before({ tool } as any, { args } as any)

  const expectThrow = async (label: string, fn: () => Promise<unknown>) => {
    try {
      await fn()
      console.error(`✗ FAIL: ${label} should throw`)
      process.exit(1)
    } catch (e) {
      if (!(e as Error).message.includes("[anti-loop]")) throw e
      console.log(`✓ ${label}`)
    }
  }

  // Case 1: first call passes
  await call("bash", { command: "ls" })
  console.log("✓ first call passes")

  // Case 2: identical second call → blocked
  await expectThrow("second identical call blocked", () =>
    call("bash", { command: "ls" }),
  )

  // Case 3: third identical call → still blocked (no alternation bug)
  await expectThrow("third identical call still blocked", () =>
    call("bash", { command: "ls" }),
  )

  // Case 4: different command → passes
  await call("bash", { command: "pwd" })
  console.log("✓ different args pass")

  // Case 5: different tool → passes
  await call("read", { command: "pwd" })
  console.log("✓ different tool passes")

  // Case 6: repeat new (tool, args) → blocked
  await expectThrow("repeated read blocked", () =>
    call("read", { command: "pwd" }),
  )

  // Case 7: same command, different description → blocked (description ignored)
  await call("bash", { command: "whoami", description: "check user" })
  await expectThrow("description ignored in hash", () =>
    call("bash", { command: "whoami", description: "different description" }),
  )

  // Case 8: different key order → blocked (stable stringify)
  await call("bash", { command: "date", timeout: 1000 })
  await expectThrow("key order ignored in hash", () =>
    call("bash", { timeout: 1000, command: "date" }),
  )

  console.log("\nAll tests passed")
}

run().catch((e) => {
  console.error("Unexpected error:", e)
  process.exit(1)
})
