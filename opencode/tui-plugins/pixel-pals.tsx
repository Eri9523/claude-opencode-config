// @ts-nocheck
/** @jsxImportSource @opentui/solid */
import type { TuiPlugin } from "@opencode-ai/plugin/tui"
import { useTerminalDimensions } from "@opentui/solid"
import { createMemo, createSignal, onCleanup, onMount } from "solid-js"

const id = "pixel-pals"

const pixelArt = [
  "........X.X.......",
  "......XXXXXX......",
  ".....XXYYYYXXX....",
  "....XYYYYYYYYYX...",
  "...XYYYYYYYYYYYX..",
  "..XYYXXYYYYXXYYX..",
  ".XXYXWWXYYXWWXYYX.",
  ".XYXXWXXYYXWXXXYX.",
  "XYYXYYYXXXXYYYXYYX",
  "XYYXYXXSSSSXXYXYYX",
  "XYYYXSSSXSSSSXYYYX",
  ".XYXSSSSSSSSSXYYYX",
  ".XYXSSSSSSSSXYYYX.",
  "..XYXSSSSSSSXYYX..",
  "...XYXXXXXXXYYX...",
  "...XYYYYYYYYYYYX..",
  "..XYYYYYYYYYYYYX..",
  "...XYYYYYYYYYYX...",
  "...XXXXXXXXXXX....",
  "..XSSSX...XSSSX...",
  "..XXXX.....XXXX...",
]

const pixelArtFrameTwo = pixelArt.map((line, index) => {
  if (index === 7) return ".XXYXW.XYYXW.XYYX."
  if (index === 8) return ".XYXXWWXYYXWWXXYX."
  return line
})
const pixelArtFrames = [pixelArt, pixelArtFrameTwo]
const compactArt = ["[ READY ]"]

const Logo = () => {
  const dim = useTerminalDimensions()
  const [frame, setFrame] = createSignal(0)

  onMount(() => {
    const timer = setInterval(() => setFrame((current) => (current + 1) % 2), 900)
    onCleanup(() => clearInterval(timer))
  })

  const lines = createMemo(() => {
    const term = dim()
    const art = pixelArtFrames[frame()]
    return term.height >= art.length + 6 && term.width >= 42 ? art : compactArt
  })

  return (
    <box flexDirection="column" alignItems="center">
      {lines().map((line) =>
        line === compactArt[0] ? (
          <text fg="yellow">{line}</text>
        ) : (
          <box flexDirection="row">
            {line.split("").map((cell) => (
              <text fg={cell === "X" ? "gray" : cell === "Y" ? "yellow" : "white"}>
                {cell === "." ? "  " : "██"}
              </text>
            ))}
          </box>
        ),
      )}
    </box>
  )
}

const tui: TuiPlugin = async (api) => {
  api.slots.register({
    id,
    order: 100,
    slots: {
      home_logo() {
        return <Logo />
      },
    },
  })
}

const plugin = { id, tui }
export default plugin
