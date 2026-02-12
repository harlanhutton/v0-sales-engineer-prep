import { createClient } from "@supabase/supabase-js"

// Server-side Supabase client -- creates a fresh client per request (no singleton caching issues)
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase env vars:", {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey,
    })
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}
