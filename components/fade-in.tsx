"use client"

import { motion, useReducedMotion } from "framer-motion"

type FadeInProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  /** Render as a list item when used directly inside <ul>/<ol>. */
  as?: "div" | "li"
}

/**
 * Light fade-up on first scroll into view.
 * Always renders the same motion element so hydration matches the server
 * markup; reduced-motion users get a plain fade with no movement.
 * Elements carry data-fade so the <noscript> rule in the root layout can reveal them.
 */
export function FadeIn({ children, className, delay = 0, as = "div" }: FadeInProps) {
  const reduceMotion = useReducedMotion()
  const MotionTag = as === "li" ? motion.li : motion.div

  return (
    <MotionTag
      data-fade=""
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reduceMotion ? 0.2 : 0.5, ease: [0.21, 0.47, 0.32, 0.98], delay: reduceMotion ? 0 : delay }}
    >
      {children}
    </MotionTag>
  )
}
