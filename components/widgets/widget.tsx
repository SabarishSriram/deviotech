"use client"

import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

type WidgetProps = {
  children: React.ReactNode
  className?: string
  /** Stagger delay for the entrance animation. */
  delay?: number
  /** Render as a list item when used directly inside <ul>/<ol>. */
  as?: "div" | "li"
  /** Lift + tighten on hover. */
  interactive?: boolean
}

/**
 * A home-screen style widget tile: rounded, textured, with a spring entrance
 * and a subtle hover lift. Honors reduced-motion.
 */
export function Widget({ children, className, delay = 0, as = "div", interactive = true }: WidgetProps) {
  const reduce = useReducedMotion()
  const MotionTag = as === "li" ? motion.li : motion.div

  return (
    <MotionTag
      data-fade=""
      className={cn("widget", className)}
      initial={{ opacity: 0, y: reduce ? 0 : 18, scale: reduce ? 1 : 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 140, damping: 20, delay: reduce ? 0 : delay }}
      whileHover={interactive && !reduce ? { y: -4 } : undefined}
    >
      {children}
    </MotionTag>
  )
}
