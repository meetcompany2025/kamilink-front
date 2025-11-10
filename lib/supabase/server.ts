import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { supabaseConfig } from "./config"

export function createServerClient() {
  const cookieStore = cookies()

  return createSupabaseClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value || ""
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.delete(name, options)
      },
    },
  })
}

// Adicionar a exportação nomeada para manter compatibilidade com o código existente
export const createClient = createServerClient
