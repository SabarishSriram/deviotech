"use client"

import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

/**
 * false on the server and during hydration, true afterwards. Use it to gate
 * anything that only the browser knows (like reduced motion), so the first
 * client render matches the server's HTML.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}
