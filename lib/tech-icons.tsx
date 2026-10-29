import { Webhook, type LucideIcon } from "lucide-react"
import type { IconType } from "react-icons"
import {
  SiDocker,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si"

/**
 * Maps a tech-stack label to its brand mark. Brand logos render in the
 * current text color so they sit cleanly in the monochrome theme.
 * Falls back to a generic icon for concepts that have no logo.
 */
const brand: Record<string, IconType> = {
  "Next.js": SiNextdotjs,
  React: SiReact,
  "Node.js": SiNodedotjs,
  PostgreSQL: SiPostgresql,
  Docker: SiDocker,
  Python: SiPython,
  TypeScript: SiTypescript,
  Tailwind: SiTailwindcss,
}

const fallback: Record<string, LucideIcon> = {
  "REST APIs": Webhook,
}

export function TechIcon({ name, className }: { name: string; className?: string }) {
  const Brand = brand[name]
  if (Brand) return <Brand className={className} aria-hidden="true" />
  const Fallback = fallback[name]
  if (Fallback) return <Fallback className={className} aria-hidden="true" />
  return null
}
