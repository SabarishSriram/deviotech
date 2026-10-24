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
          background: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 28px 28px",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#6366F1" />
            <path
              d="M10 11l5 5-5 5M17 21h6"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontSize: 36, fontWeight: 600 }}>{site.name}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 700, letterSpacing: -4 }}>
            {hero.headline.lead}&nbsp;<span style={{ color: "#818CF8" }}>{hero.headline.accent}</span>
          </div>
          <div style={{ fontSize: 30, color: "#a1a1aa" }}>{hero.trust.join("  ·  ")}</div>
        </div>
      </div>
    ),
    size
  )
}
