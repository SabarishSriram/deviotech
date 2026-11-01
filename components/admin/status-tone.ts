import type { ApplicationStatus } from "@/lib/supabase/types"

/** Pill colours per application status, used across the admin. */
export const statusTone: Record<ApplicationStatus, string> = {
  new: "border-brand/40 bg-brand/10 text-brand-text",
  contacted: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  session_booked: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  paid: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  active: "border-teal-500/40 bg-teal-500/10 text-teal-700 dark:text-teal-400",
  completed: "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-400",
  rejected: "border-border bg-muted text-muted-foreground",
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("")
}
