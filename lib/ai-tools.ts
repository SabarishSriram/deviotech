import type { IconType } from "react-icons"
import { SiClaude, SiCursor, SiGithubcopilot } from "react-icons/si"

/**
 * AI tools shown across the site, in their brand colours. Cursor and
 * Copilot have monochrome marks, so they follow the text colour
 * (black on light, white on dark) as their brand guidelines specify.
 */
export const aiTools: { name: string; icon: IconType; colorClass: string }[] = [
  { name: "Claude", icon: SiClaude, colorClass: "text-[#d97757]" },
  { name: "Cursor", icon: SiCursor, colorClass: "text-foreground" },
  { name: "Copilot", icon: SiGithubcopilot, colorClass: "text-foreground" },
]
