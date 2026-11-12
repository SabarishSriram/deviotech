"use client"

import { motion } from "framer-motion"
import { useSafeReducedMotion } from "@/lib/use-reduced-motion"

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
  /**
   * Above-the-fold content: visible in the server HTML and animated with CSS,
   * so the page's main content shows before JavaScript loads (fast LCP).
   */
  eager?: boolean
}

/**
 * A home-screen style widget tile: rounded, textured, with a spring entrance
 * and a subtle hover lift. Honors reduced-motion.
 */
export function Widget({ children, className, delay = 0, as = "div", interactive = true, eager = false }: WidgetProps) {
  const reduce = useSafeReducedMotion()
  const MotionTag = as === "li" ? motion.li : motion.div

  return (
    <MotionTag
      data-fade=""
      className={cn("widget", eager && "animate-rise", className)}
      style={eager ? { animationDelay: `${delay}s` } : undefined}
      initial={eager ? false : { opacity: 0, y: reduce ? 0 : 18, scale: reduce ? 1 : 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 140, damping: 20, delay: reduce ? 0 : delay }}
      whileHover={interactive && !reduce ? { y: -4 } : undefined}
    >
      {children}
    </MotionTag>
  )
}
