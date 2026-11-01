import "server-only"

import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

/*
 * Admin login for /admin. The username and password live only in environment
 * variables (ADMIN_USERNAME / ADMIN_PASSWORD) — never in the code. A successful
 * login sets an httpOnly cookie holding an expiry signed with ADMIN_SESSION_SECRET.
 */

const COOKIE = "devio_admin"
const MAX_AGE_SECONDS = 60 * 60 * 8

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be set to a random string of 32+ characters.")
  }
  return secret
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url")
}

/** Constant-time comparison that also hides the length of the expected value. */
function safeEqual(a: string, b: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest()
  return timingSafeEqual(digest(a), digest(b))
}

export function checkAdminCredentials(username: string, password: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD
  if (!expectedPassword) return false
  const usernameOk = safeEqual(username, process.env.ADMIN_USERNAME || "admin")
  const passwordOk = safeEqual(password, expectedPassword)
  return usernameOk && passwordOk
}

export async function startAdminSession() {
  const expires = String(Date.now() + MAX_AGE_SECONDS * 1000)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: MAX_AGE_SECONDS,
  })
}

export async function endAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete({ name: COOKIE, path: "/admin" })
}

export async function isAdmin() {
  const value = (await cookies()).get(COOKIE)?.value
  if (!value) return false
  const [expires, signature] = value.split(".")
  if (!expires || !signature || !safeEqual(signature, sign(expires))) return false
  return Number(expires) > Date.now()
}

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login")
}
