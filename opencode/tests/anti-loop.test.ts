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
      console.error(`FAIL: ${label} should throw`)
      process.exit(1)
    } catch (error) {
      if (!(error as Error).message.includes("[anti-loop]")) throw error
      console.log(`PASS: ${label}`)
    }
  }

  await call("bash", { command: "ls" })
  await expectThrow("identical call is blocked", () =>
    call("bash", { command: "ls" }),
  )
  await expectThrow("repeated identical call stays blocked", () =>
    call("bash", { command: "ls" }),
  )
  await call("bash", { command: "pwd" })
  await call("read", { command: "pwd" })
  await expectThrow("repeated read is blocked", () =>
    call("read", { command: "pwd" }),
  )

  console.log("All anti-loop tests passed")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
