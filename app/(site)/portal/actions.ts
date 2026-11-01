"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

export type PortalLoginState = { error: string } | undefined

export async function studentLogin(_: PortalLoginState, formData: FormData): Promise<PortalLoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")
  if (!email || !password) return { error: "Enter your email and password." }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: "Wrong email or password." }

  // Drop the browser's cached copy of pages rendered while logged out (e.g. /portal
  // redirecting to login); otherwise the redirect below can replay it once.
  revalidatePath("/", "layout")
  redirect("/portal")
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
  return { ok: true }
}
