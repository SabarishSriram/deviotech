import { isAdmin } from "@/lib/admin-session"
import { createAdminClient } from "@/lib/supabase/admin"
import type { ApplicationRow } from "@/lib/supabase/types"

const columns: (keyof ApplicationRow)[] = [
  "created_at",
  "full_name",
  "email",
  "phone",
  "college",
  "year",
  "track",
  "skill_level",
  "github",
  "linkedin",
  "status",
  "motivation",
  "id",
]

/** Quotes a CSV cell and neutralises spreadsheet formula injection. */
function cell(value: unknown) {
  let text = value == null ? "" : String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

/** Downloads every application as CSV (admin only). */
export async function GET() {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 })

  const { data, error } = await createAdminClient()
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) return new Response(error.message, { status: 500 })

  const rows = (data ?? []) as ApplicationRow[]
  const csv = [columns.join(","), ...rows.map((row) => columns.map((c) => cell(row[c])).join(","))].join("\n")
  const date = new Date().toISOString().slice(0, 10)

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="applications-${date}.csv"`,
      "Cache-Control": "private, no-store",
    },
  })
}
