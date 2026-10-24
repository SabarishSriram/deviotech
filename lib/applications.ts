import type { ApplicationInput } from "@/lib/validations/apply"

export type SubmitApplicationResponse = {
  ok: true
  applicationId: string
}

/** Sends the application to the /api/apply route handler. */
export async function submitApplication(data: ApplicationInput): Promise<SubmitApplicationResponse> {
  const res = await fetch("/api/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error(`Application submit failed with status ${res.status}`)
  }

  return res.json()
}
