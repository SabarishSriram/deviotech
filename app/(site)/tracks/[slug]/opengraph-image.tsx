import { ImageResponse } from "next/og"

import { program, site } from "@/data/site"
import { getTrack, tracks } from "@/data/tracks"

/** The preview card shown when a track page is shared (WhatsApp, LinkedIn, X…). */
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = `${site.name} track`

export function generateStaticParams() {
  return tracks.map((track) => ({ slug: track.slug }))
}

export default async function TrackImage({ params }: { params: Promise<{ slug: string }> }) {
  const track = getTrack((await params).slug)
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
          backgroundImage: "radial-gradient(circle at 50% 0%, rgba(255,42,51,0.28), transparent 55%)",
          color: "#fafafa",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#FF2A33" />
            <path d="M10 11l5 5-5 5M17 21h6" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase" }}>{site.name}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 28, color: "#FF6B70", letterSpacing: 3, textTransform: "uppercase" }}>{`${program.durationWeeks}-week course`}</div>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>{track?.name ?? site.name}</div>
          <div style={{ fontSize: 30, color: "#a1a1aa", lineHeight: 1.3 }}>{track?.oneLiner ?? ""}</div>
        </div>
        <div style={{ fontSize: 26, color: "#a1a1aa", letterSpacing: 3, textTransform: "uppercase" }}>Real project · Mentor reviews · Verifiable certificate</div>
      </div>
    ),
    size
  )
}
