import { applicationSchema } from "@/lib/validations/apply"

/**
 * PLACEHOLDER — submitApplication() endpoint.
 * Validates and logs the application, then returns 200.
 * Replace the console.log with a database insert / CRM call / email trigger.
 */
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = applicationSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const applicationId = crypto.randomUUID()
  console.log("[api/apply] new application", { applicationId, ...parsed.data })

  return Response.json({ ok: true, applicationId }, { status: 200 })
}
