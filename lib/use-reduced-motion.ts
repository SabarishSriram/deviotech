"use client"

import { useReducedMotion } from "framer-motion"

import { useHydrated } from "@/lib/use-hydrated"

/**
 * framer-motion's useReducedMotion, but false until hydration is done.
 * The server can't know the visitor's setting, so the first client render
 * must assume “no” too — otherwise React reports a hydration mismatch and
 * re-renders the whole page for reduced-motion users.
 */
export function useSafeReducedMotion() {
  const reduce = useReducedMotion()
  const hydrated = useHydrated()
  return hydrated ? Boolean(reduce) : false
}
