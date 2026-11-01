/**
 * Supabase connection settings. Accepts both the legacy key names that the
 * Vercel integration creates and Supabase's newer publishable/secret names.
 */
export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL
}

export function getSupabasePublicKey() {
  // || not ??: an empty "KEY=" line in .env arrives as "", which should count as unset
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

/** Server-only secret key (bypasses RLS). Never expose it to the browser. */
export function getSupabaseSecretKey() {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
}

/** True when the server can write with the secret key (applications, admin portal). */
export function isSupabaseAdminConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseSecretKey())
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabasePublicKey())
}

export function requireSupabaseEnv() {
  const url = getSupabaseUrl()
  const publicKey = getSupabasePublicKey()
  if (!url || !publicKey) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.")
  }
  return { url, publicKey }
}
