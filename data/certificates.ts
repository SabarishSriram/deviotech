import type { TrackSlug } from "@/data/tracks"

/**
 * Mock certificate registry. Replace with a database / API lookup
 * once certificates are issued from a real backend.
 */

export type Certificate = {
  id: string
  studentName: string
  track: TrackSlug
  project: string
  issueDate: string // ISO date
  status: "verified" | "revoked"
}

export const certificates: Certificate[] = [
  {
    id: "DEVIO-2026-0001",
    studentName: "Aarav Sharma",
    track: "full-stack",
    project: "Campus event booking platform",
    issueDate: "2026-09-30",
    status: "verified",
  },
]
