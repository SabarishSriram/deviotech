import "server-only"

import { createClient } from "@supabase/supabase-js"

import { getSupabaseSecretKey, requireSupabaseEnv } from "@/lib/supabase/env"

/**
 * Privileged Supabase client using the secret key. Bypasses Row Level
 * Security — only use it on the server, after checking the caller is allowed.
 */
export function createAdminClient() {
  const { url } = requireSupabaseEnv()
  const secretKey = getSupabaseSecretKey()
  if (!secretKey) {
    throw new Error("Supabase secret key missing. Set SUPABASE_SECRET_KEY.")
  }
  return createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } })
}
