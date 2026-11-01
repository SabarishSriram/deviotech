"use client"

import { updateApplicationStatus } from "@/app/admin/actions"
import { statusTone } from "@/components/admin/status-tone"
import { APPLICATION_STATUSES, statusLabels, type ApplicationStatus } from "@/lib/supabase/types"
import { cn } from "@/lib/utils"

/** Status pill-dropdown that saves as soon as it changes. */
export function StatusSelect({ id, status, className }: { id: string; status: ApplicationStatus; className?: string }) {
  return (
    <form action={updateApplicationStatus}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        aria-label="Status"
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className={cn(
          "h-7 cursor-pointer rounded-full border px-2.5 text-xs font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          statusTone[status],
          className
        )}
      >
        {APPLICATION_STATUSES.map((s) => (
          <option key={s} value={s} className="bg-background text-foreground">
            {statusLabels[s]}
          </option>
        ))}
      </select>
    </form>
  )
}
