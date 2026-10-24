import { Layers, LayoutTemplate, Server, type LucideIcon } from "lucide-react"

import type { TrackId } from "@/data/site"

export const trackIcons: Record<TrackId, LucideIcon> = {
  "full-stack": Layers,
  backend: Server,
  frontend: LayoutTemplate,
}
