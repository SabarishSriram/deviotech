"use client"

import { useEffect, useState } from "react"

/** Counts up every `ms` while `on`; resets to 0 when switched off. */
export function useTick(on: boolean, ms: number) {
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!on) return
    const id = setInterval(() => setT((n) => n + 1), ms)
    return () => {
      clearInterval(id)
      setT(0)
    }
  }, [on, ms])
  return on ? t : 0
}
