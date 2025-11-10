import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { supabaseConfig } from "./config"

let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== "undefined"

  // Validate required configuration
  if (!supabaseConfig.url || !supabaseConfig.anonKey) {
    console.error("Supabase URL and anon key are required. Check your environment variables.")

    // In browser, we can return a dummy client that will show appropriate errors
    // This prevents the app from crashing completely
    if (isBrowser) {
      throw new Error("Supabase configuration is missing. Please check your environment variables.")
    }

    // In SSR, return null to allow the app to continue rendering
    return null
  }

  try {
    // Create client if it doesn't exist
    if (!supabaseClient) {
      supabaseClient = createSupabaseClient(supabaseConfig.url, supabaseConfig.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        global: {
          fetch: (...args) => {
            // Configurar timeout para evitar que requisições fiquem pendentes por muito tempo
            return fetch(...args, {
              signal: AbortSignal.timeout(10000), // 10 segundos de timeout
            })
          },
        },
      })
    }

    return supabaseClient
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
    return null
  }
}

// Função para verificar a conectividade com o Supabase
export async function checkSupabaseConnection() {
  const client = createClient()
  if (!client) return false

  try {
    // Tenta fazer uma requisição simples para verificar a conexão
    const { error } = await client.from("users").select("count", { count: "exact", head: true })
    return !error
  } catch (error) {
    console.error("Erro ao verificar conexão com Supabase:", error)
    return false
  }
}
