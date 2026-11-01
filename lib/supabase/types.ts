import type { TrackSlug } from "@/data/tracks"

export const APPLICATION_STATUSES = [
  "new",
  "contacted",
  "session_booked",
  "paid",
  "active",
  "completed",
  "rejected",
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export const statusLabels: Record<ApplicationStatus, string> = {
  new: "New",
  contacted: "Contacted",
  session_booked: "1:1 booked",
  paid: "Paid",
  active: "Building",
  completed: "Certified",
  rejected: "Rejected",
}

export function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return APPLICATION_STATUSES.includes(value as ApplicationStatus)
}

/** A row of the `applications` table — see supabase/schema.sql. */
export type ApplicationRow = {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string
  college: string
  year: string
  github: string
  linkedin: string | null
  track: TrackSlug
  skill_level: string
  motivation: string
  status: ApplicationStatus
  project: string | null
  user_id: string | null
}

/** Statuses that unlock the project docs in the student portal. */
export const PAID_STATUSES: readonly ApplicationStatus[] = ["paid", "active", "completed"]

export function hasPaid(status: ApplicationStatus) {
  return PAID_STATUSES.includes(status)
}
