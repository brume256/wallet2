import { $$ } from "@hazae41/saumon"

export const icon = $$<string>(async () => {
  const { readFileSync } = await import("node:fs")

  const base64 = readFileSync("./src/libs/icon/mod.png", "base64")

  return JSON.stringify(`data:image/png;base64,${base64}`)
})