// src/services/authService.ts
import api from "./api"
import Cookies from "js-cookie"
import { LoginDto, RegisterDto, AuthResponse } from "../types/auth"

export const AuthService = {
  /**
   * 🔹 Login com email ou telefone + senha
   * Retorna token e dados básicos do usuário.
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    try {
      console.log("[AuthService] Login iniciado:", data)
      const res = await api.post("/auth/login", data)

      if (res?.data?.token) {
        // 🔸 Grava token em cookie para uso global
        Cookies.set("token", res.data.token)
      }

      return res.data
    } catch (error: any) {
      console.error("[AuthService] Erro no login:", error)
      throw error.response?.data || { message: "Erro ao autenticar usuário." }
    }
  },

  /**
   * 🔹 Registro de novo usuário
   * Endpoint: /users
   */
  async register(data: RegisterDto) {
    try {
      const res = await api.post("/users", data)
      return res.data
    } catch (error: any) {
      console.error("[AuthService] Erro no registro:", error)
      throw error.response?.data || { message: "Erro ao registrar usuário." }
    }
  },

  /**
   * 🔹 Busca dados do usuário autenticado
   * Endpoint: /auth/me
   */
  async me(token?: string) {
    try {
      const activeToken =
        token || Cookies.get("token") || localStorage.getItem("token")

      if (!activeToken) throw new Error("Token não encontrado")

      const res = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      })
      return res.data
    } catch (error: any) {
      console.error("[AuthService] Erro ao buscar perfil:", error)
      throw error.response?.data || { message: "Falha ao obter perfil." }
    }
  },

  /**
   * 🔹 Logout seguro
   * Remove cookies e tokens locais.
   */
  async logout() {
    try {
      await api.post("/auth/logout")
    } catch (error) {
      console.warn("[AuthService] Falha ao fazer logout remoto:", error)
    } finally {
      Cookies.remove("token")
      Cookies.remove("refresh_token")
      localStorage.removeItem("token")
      sessionStorage.removeItem("token")
    }
  },

  /**
   * 🔹 Solicita redefinição de senha
   * Endpoint: /auth/forgot-password
   */
  async forgotPassword(email: string) {
    try {
      const res = await api.post("/auth/forgot-password", { email })
      return res.data
    } catch (error: any) {
      throw error.response?.data || { message: "Erro ao solicitar redefinição." }
    }
  },

  /**
   * 🔹 Redefine senha com token recebido por email
   * Endpoint: /auth/reset-password
   */
  async changePassword(data: { token: string; newPassword: string }) {
    try {
      const res = await api.patch("/auth/reset-password", data)
      return res.data
    } catch (error: any) {
      throw error.response?.data || { message: "Erro ao alterar senha." }
    }
  },

  /**
   * 🔹 (Opcional) Atualiza o token de sessão
   * Endpoint: /auth/refresh
   */
  async refreshToken() {
    try {
      const refreshToken = Cookies.get("refresh_token")
      if (!refreshToken) throw new Error("Refresh token ausente")

      const res = await api.post("/auth/refresh", { refreshToken })

      if (res?.data?.token) {
        Cookies.set("token", res.data.token)
        return res.data.token
      }

      throw new Error("Falha ao atualizar token.")
    } catch (error: any) {
      throw error.response?.data || { message: "Erro ao renovar sessão." }
    }
  },
}
