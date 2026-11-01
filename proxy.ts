import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import { isSupabaseConfigured, requireSupabaseEnv } from "@/lib/supabase/env"

/**
 * Refreshes the student's Supabase session before /portal renders, so
 * logins don't silently expire. Server Components can't write cookies,
 * which is why this runs here.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  if (!isSupabaseConfigured()) return response

  const { url, publicKey } = requireSupabaseEnv()
  const supabase = createServerClient(url, publicKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, value))
      },
    },
  })

  await supabase.auth.getClaims()
  return response
}

export const config = {
  matcher: ["/portal/:path*"],
}
