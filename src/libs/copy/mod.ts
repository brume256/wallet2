import { Task, useTask } from "@/libs/task/mod.ts";
import { useState } from "react";
import { flushSync } from "react-dom";
import { Errors } from "../errors/mod.ts";
import { Nullable } from "../nullable/mod.ts";

export type Copy =
  & Task<[], void>
  & { copying: boolean }

export function useCopy(value: Nullable<string>) {
  const [copied, setCopied] = useState(false)

  const execute = useTask(() => Promise.try(async () => {
    if (value == null)
      return

    await navigator.clipboard.writeText(value)

    setTimeout(() => setCopied(false), 300)

    flushSync(() => setCopied(true))
  }).catch(Errors.display), [value])

  const copy = execute as Copy

  copy.copying = copied

  return copy
}