import { after } from "next/server"

import { getTrack } from "@/data/tracks"
import { isEmailConfigured, sendApplicationReceived } from "@/lib/email"
import { createAdminClient } from "@/lib/supabase/admin"
import { isSupabaseAdminConfigured } from "@/lib/supabase/env"
import { applicationSchema } from "@/lib/validations/apply"

/** Validates an application and stores it in the Supabase `applications` table. */
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

  if (!isSupabaseAdminConfigured()) {
    console.error("[api/apply] SUPABASE_SECRET_KEY / URL missing — application not saved")
    return Response.json({ ok: false, error: "Applications are temporarily unavailable" }, { status: 503 })
  }

  const application = parsed.data
  const { data, error } = await createAdminClient()
    .from("applications")
    .insert({
      full_name: application.fullName,
      email: application.email.toLowerCase(),
      phone: application.phone,
      college: application.college,
      year: application.year,
      github: application.github,
      linkedin: application.linkedin || null,
      track: application.track,
      skill_level: application.skillLevel,
      motivation: application.motivation,
    })
    .select("id")
    .single()

  if (error) {
    console.error("[api/apply] insert failed", error)
    return Response.json({ ok: false, error: "Could not save application" }, { status: 500 })
  }

  if (isEmailConfigured()) {
    // Don't make the applicant wait on SMTP — send once the response is out.
    after(async () => {
      try {
        await sendApplicationReceived({
          to: application.email,
          name: application.fullName,
          trackName: getTrack(application.track)?.name ?? application.track,
        })
      } catch (error) {
        console.error("[api/apply] confirmation email failed", error)
      }
    })
  }

  return Response.json({ ok: true, applicationId: data.id }, { status: 200 })
}
