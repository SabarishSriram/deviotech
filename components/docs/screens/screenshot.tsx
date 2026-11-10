"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Frames a recreated screen like a real screenshot: drawn at a fixed design
 * width on a soft "desktop" backdrop, then scaled down as a whole on narrow
 * screens so it never reflows or gets cramped.
 */
export function Screenshot({
  children,
  caption,
  width = 760,
}: {
  children: React.ReactNode
  caption?: string
  width?: number
}) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [height, setHeight] = useState<number>()

  useEffect(() => {
    const measure = () => {
      if (!outer.current || !inner.current) return
      const next = Math.min(1, outer.current.clientWidth / width)
      setScale(next)
      setHeight(inner.current.offsetHeight * next)
    }
    const observer = new ResizeObserver(measure)
    if (outer.current) observer.observe(outer.current)
    if (inner.current) observer.observe(inner.current)
    return () => observer.disconnect()
  }, [width])

  return (
    <figure className="my-4">
      <div
        ref={outer}
        className="overflow-hidden rounded-xl border bg-[linear-gradient(135deg,#dfe3ea,#c9d1dc)] dark:bg-[linear-gradient(135deg,#2a2d33,#1c1e22)]"
        style={{ height }}
      >
        <div ref={inner} className="p-4" style={{ width, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          {children}
        </div>
      </div>
      {caption && <figcaption className="mt-2 text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  )
}
