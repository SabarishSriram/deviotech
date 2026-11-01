import type { CSSProperties } from "react"
import type { IconType } from "react-icons"
import { FaJava } from "react-icons/fa"
import {
  SiFigma,
  SiExpo,
  SiNodedotjs,
  SiPandas,
  SiPython,
  SiPytorch,
  SiReact,
  SiTypescript,
} from "react-icons/si"

import type { TrackSlug } from "@/data/tracks"

/** Each track's signature tool. Brand marks render in currentColor to fit the monochrome theme. */
export const trackIcons: Record<TrackSlug, IconType> = {
  "full-stack": SiTypescript,
  backend: SiNodedotjs,
  frontend: SiReact,
  "app-development": SiExpo,
  python: SiPython,
  java: FaJava,
  "ai-ml": SiPytorch,
  "data-science": SiPandas,
  "ui-ux": SiFigma,
}

/**
 * Brand colour per track, tuned separately for light and dark backgrounds.
 * Applied through the `track-color` utility, which exposes it as `--tc`.
 */
const trackColors: Record<TrackSlug, { light: string; dark: string }> = {
  "full-stack": { light: "#3178c6", dark: "#5b9be6" },
  backend: { light: "#3f8a2f", dark: "#6cc24a" },
  frontend: { light: "#087ea4", dark: "#61dafb" },
  "app-development": { light: "#4630eb", dark: "#8b7dff" },
  python: { light: "#3776ab", dark: "#ffd43b" },
  java: { light: "#c75d00", dark: "#f89820" },
  "ai-ml": { light: "#d6391b", dark: "#ee4c2c" },
  "data-science": { light: "#150458", dark: "#e70488" },
  "ui-ux": { light: "#8b3ff0", dark: "#a259ff" },
}

/** Inline style that feeds a track's colours to the `track-color` utility. */
export function trackColorStyle(slug: TrackSlug) {
  const { light, dark } = trackColors[slug]
  return { "--tc-light": light, "--tc-dark": dark } as CSSProperties
}
