"use server"

import { createClient } from "@/lib/supabase/server"
import { isStepKey } from "@/lib/progress"

const OSES = ["mac", "windows", "linux"]

/** Ticks or unticks one Getting started step for the signed-in student. */
export async function setStepDone(stepKey: string, done: boolean, os: string): Promise<{ ok: boolean }> {
  if (!isStepKey(stepKey) || !OSES.includes(os)) return { ok: false }
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getClaims()
  const userId = auth?.claims?.sub
  if (!userId) return { ok: false }

  // RLS: students can only write rows with their own user_id.
  const { error } = done
    ? await supabase.from("doc_progress").upsert({ user_id: userId, step_key: stepKey, os, done_at: new Date().toISOString() })
    : await supabase.from("doc_progress").delete().eq("user_id", userId).eq("step_key", stepKey)
  return { ok: !error }
}
