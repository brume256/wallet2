import { Awaitable } from "@/libs/awaitable/mod.ts";
import { DependencyList, useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";

/**
 * A callback with a running state
 */
export type Task<P extends readonly unknown[], R> =
  & ((...params: P) => Promise<R>)
  & { running: boolean }

/**
 * Like useCallback but for asynchronous unique tasks
 * @param callback 
 * @param deps 
 * @returns 
 */
export function useTask<P extends readonly unknown[], R>(callback: (...params: P) => Awaitable<R>, deps: DependencyList): Task<P, R> {
  const [running, setRunning] = useState(false)

  const promise = useRef<Promise<R>>(null)

  const execute = useCallback((async (...params: P) => {
    using stack = new DisposableStack()

    if (promise.current != null)
      return await promise.current

    stack.defer(() => promise.current = null)

    stack.defer(() => setRunning(false))

    flushSync(() => setRunning(true))

    promise.current = Promise.resolve(callback(...params))

    return await promise.current
  }), deps)

  const task = execute as Task<P, R>

  task.running = running

  return task
}