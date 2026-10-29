import { ImageResponse } from "next/og"

import { hero, site } from "@/data/site"

export const alt = `${site.name} — ${hero.headline.lead} ${hero.headline.accent}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(255,42,51,0.28), transparent 55%), radial-gradient(rgba(255,255,255,0.1) 1.1px, transparent 1.1px)",
          backgroundSize: "100% 100%, 20px 20px",
          color: "#fafafa",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#FF2A33" />
            <path
              d="M10 11l5 5-5 5M17 21h6"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase" }}>
            {site.name}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 700, letterSpacing: -2, textTransform: "uppercase" }}>
            {hero.headline.lead}&nbsp;
            <span style={{ color: "#FF6B70" }}>{hero.headline.accent}</span>
            <span style={{ color: "#FF2A33" }}>.</span>
          </div>
          <div style={{ fontSize: 28, color: "#a1a1aa", letterSpacing: 3, textTransform: "uppercase" }}>
            {hero.trust.join("  ·  ")}
          </div>
        </div>
      </div>
    ),
    size
  )
}
