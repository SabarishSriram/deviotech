"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

export type PortalLoginState = { error: string } | { redirectTo: string } | undefined

export async function studentLogin(_: PortalLoginState, formData: FormData): Promise<PortalLoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")
  if (!email || !password) return { error: "Enter your email and password." }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: "Wrong email or password." }

  // The session cookie is now on this response. The form does a full page load
  // to /portal (see LoginForm) instead of a client-side redirect, so the portal
  // is always rendered fresh with the new cookie — never from the router's
  // copy cached while logged out, which bounced people back to this page once.
  return { redirectTo: "/portal" }
}

export async function studentLogout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/portal/login")
}

export type PasswordState = { error: string } | { ok: true } | undefined

export async function changePassword(_: PasswordState, formData: FormData): Promise<PasswordState> {
  const password = String(formData.get("password") ?? "")
  const confirm = String(formData.get("confirm") ?? "")
  if (password.length < 8) return { error: "Use at least 8 characters." }
  if (password !== confirm) return { error: "Passwords don't match." }

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect("/portal/login")

  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }

  // Clear the "temporary password" flag (only the server can change app_metadata),
  // then refresh the session so the new token no longer carries it.
  if (data.claims.app_metadata?.must_change_password) {
    await createAdminClient().auth.admin.updateUserById(data.claims.sub, {
      app_metadata: { must_change_password: false },
    })
    await supabase.auth.refreshSession()
  }

  revalidatePath("/portal", "layout")
  return { ok: true }
}
