"use client"

import { animate, useInView } from "framer-motion"
import { useSafeReducedMotion } from "@/lib/use-reduced-motion"
import { useEffect, useRef, useState } from "react"


/**
 * Counts up to `value` when scrolled into view. Renders the final value
 * immediately for reduced-motion users. `suffix`/`prefix` are decoration.
 */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  duration = 1.4,
  className,
}: {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}) {
  const reduce = useSafeReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [count, setDisplay] = useState(0)
  // Reduced motion shows the final value — but only after hydration, so the
  // first client render matches the server's HTML.
  const display = reduce ? value : count

  useEffect(() => {
    if (reduce) return
    if (!inView) return
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, reduce, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  )
}
