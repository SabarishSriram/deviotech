import "server-only"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import { requireSupabaseEnv } from "@/lib/supabase/env"

/**
 * Supabase client bound to the current visitor's session cookies.
 * Respects Row Level Security, so a student only ever sees their own rows.
 */
export async function createClient() {
  const cookieStore = await cookies()
  const { url, publicKey } = requireSupabaseEnv()

  return createServerClient(url, publicKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Server Components can't write cookies; proxy.ts refreshes the session instead.
        }
      },
    },
  })
}
