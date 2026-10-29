"use client"

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion"
import { useRef } from "react"

import { cn } from "@/lib/utils"

/**
 * Pointer-reactive 3D tilt. Children lean towards the cursor and settle back
 * with a spring on leave. Disabled under reduced-motion.
 */
export function Tilt({
  children,
  className,
  max = 8,
}: {
  children: React.ReactNode
  className?: string
  max?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const sx = useSpring(px, { stiffness: 200, damping: 18 })
  const sy = useSpring(py, { stiffness: 200, damping: 18 })
  const rotateY = useTransform(sx, [0, 1], [-max, max])
  const rotateX = useTransform(sy, [0, 1], [max, -max])

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        px.set(0.5)
        py.set(0.5)
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 900 }}
      className={cn("[&>*]:[transform:translateZ(40px)]", className)}
    >
      {children}
    </motion.div>
  )
}
