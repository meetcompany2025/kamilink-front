import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function signUp(email: string, password: string, userData: any) {
  const cookieStore = cookies()
  const supabase = createClient()

  try {
    // Registrar o usuário no Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          user_type: userData.user_type,
          company_name: userData.company_name,
          tax_id: userData.tax_id,
        },
      },
    })

    if (authError) {
      console.error("Erro ao registrar usuário:", authError)
      throw authError
    }

    // Se o registro for bem-sucedido, criar um registro na tabela users
    if (authData.user) {
      // Verificar se já existe um registro para este usuário
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("id", authData.user.id)

      if (checkError) {
        console.error("Erro ao verificar usuário existente:", checkError)
      }

      // Só inserir se não existir
      if (!existingUser || existingUser.length === 0) {
        const { error: profileError } = await supabase.from("users").insert([
          {
            id: authData.user.id,
            name: userData.name,
            email: email,
            phone: userData.phone || "",
            user_type: userData.user_type,
            company_name: userData.company_name || null,
            tax_id: userData.tax_id || null,
            created_at: new Date().toISOString(),
          },
        ])

        if (profileError) {
          console.error("Erro ao criar perfil:", profileError)
          throw profileError
        }
      } else {
        console.log("Usuário já existe na tabela users, pulando inserção")
      }
    }

    return authData
  } catch (error) {
    console.error("Erro durante o processo de registro:", error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Erro ao fazer login:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Erro durante o processo de login:", error)
    throw error
  }
}

export async function signOut() {
  const supabase = createClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Erro ao fazer logout:", error)
      throw error
    }

    return redirect("/")
  } catch (error) {
    console.error("Erro durante o processo de logout:", error)
    throw error
  }
}

export async function getUserSession() {
  const supabase = createClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Erro ao obter sessão do usuário:", error)
    return null
  }
}

export async function getUserProfile() {
  const supabase = createClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return null
    }

    const { data, error } = await supabase.from("users").select("*").eq("id", session.user.id).single()

    if (error) {
      console.error("Erro ao buscar perfil:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Erro ao obter perfil do usuário:", error)
    return null
  }
}
