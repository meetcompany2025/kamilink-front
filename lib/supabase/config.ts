// Log environment variables availability for debugging (only in development)
if (process.env.NODE_ENV === "development") {
  console.log("NEXT_PUBLIC_SUPABASE_URL available:", !!process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY available:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
}
