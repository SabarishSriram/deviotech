import { ImageResponse } from "next/og"

/** Home-screen icon for iPhones and iPads, which don't use SVG icons. */
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FF2A33" }}>
        <svg width="120" height="120" viewBox="0 0 32 32">
          <path d="M10 11l5 5-5 5M17 21h6" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size
  )
}
