"use server"

import { randomBytes } from "node:crypto"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { checkAdminCredentials, endAdminSession, requireAdmin, startAdminSession } from "@/lib/admin-session"
import { isTrackProject } from "@/data/docs"
import { isEmailConfigured, sendPortalCredentials } from "@/lib/email"
import { createAdminClient } from "@/lib/supabase/admin"
import { isApplicationStatus } from "@/lib/supabase/types"

export type AdminLoginState = { error: string } | undefined

export async function adminLogin(_: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const username = String(formData.get("username") ?? "")
  const password = String(formData.get("password") ?? "")

  if (!checkAdminCredentials(username, password)) {
    // Slow down password guessing
    await new Promise((resolve) => setTimeout(resolve, 800))
    return { error: "Wrong username or password." }
  }

  await startAdminSession()
  // Drop the browser's cached copy of pages rendered while logged out (e.g. /portal
  // redirecting to login); otherwise the redirect below can replay it once.
  revalidatePath("/", "layout")
  redirect("/admin")
}

export async function adminLogout() {
  await endAdminSession()
  revalidatePath("/", "layout")
  redirect("/admin/login")
}

export async function updateApplicationStatus(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get("id") ?? "")
  const status = formData.get("status")
  if (!id || !isApplicationStatus(status)) return

  const { error } = await createAdminClient().from("applications").update({ status }).eq("id", id)
  if (error) console.error("[admin] status update failed", error)
  revalidatePath("/admin", "layout")
}

export async function updateApplicationProject(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get("id") ?? "")
  const project = String(formData.get("project") ?? "")
  if (!id) return

  const supabase = createAdminClient()
  const { data: application } = await supabase.from("applications").select("track").eq("id", id).single()
  // Empty clears the assignment; anything else must be one of the track's projects.
  if (!application || (project && !isTrackProject(application.track, project))) return

  const { error } = await supabase.from("applications").update({ project: project || null }).eq("id", id)
  if (error) console.error("[admin] project update failed", error)
  revalidatePath("/admin", "layout")
}

export type StudentLoginState =
  | { email: string; password: string; emailed: boolean; emailError?: string }
  | { error: string }
  | undefined

/** Readable, random temporary password, e.g. "devio-k3Fp9xQ2wZ". */
function temporaryPassword() {
  return `devio-${randomBytes(8).toString("base64url").slice(0, 10)}`
}

/**
 * Creates (or resets) the student's portal login for an application, emails
 * the credentials when SMTP is configured, and returns them once as a fallback.
 */
export async function createStudentLogin(_: StudentLoginState, formData: FormData): Promise<StudentLoginState> {
  await requireAdmin()
  const id = String(formData.get("id") ?? "")
  const supabase = createAdminClient()

  const { data: application } = await supabase
    .from("applications")
    .select("id, email, full_name, status, user_id")
    .eq("id", id)
    .single()
  if (!application) return { error: "Application not found." }

  const password = temporaryPassword()
  let userId: string | null = application.user_id

  // Someone who applied twice already has a login from their other application.
  if (!userId) {
    const { data: sibling } = await supabase
      .from("applications")
      .select("user_id")
      .ilike("email", application.email)
      .not("user_id", "is", null)
      .limit(1)
      .maybeSingle()
    userId = sibling?.user_id ?? null
  }

  if (userId) {
    const { error } = await supabase.auth.admin.updateUserById(userId, { password })
    if (error) return { error: error.message }
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: application.email,
      password,
      email_confirm: true,
      user_metadata: { full_name: application.full_name },
    })
    if (error) return { error: error.message }
    userId = data.user.id
  }

  await supabase
    .from("applications")
    .update({ user_id: userId, status: application.status === "new" ? "contacted" : application.status })
    .eq("id", id)

  let emailed = false
  let emailError: string | undefined
  if (isEmailConfigured()) {
    try {
      await sendPortalCredentials({ to: application.email, name: application.full_name, password })
      emailed = true
    } catch (error) {
      console.error("[admin] credentials email failed", error)
      emailError = error instanceof Error ? error.message : "Email failed"
    }
  }

  revalidatePath("/admin", "layout")
  return { email: application.email, password, emailed, emailError }
}
