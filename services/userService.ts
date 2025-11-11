// src/services/userService.ts
import api, { ApiResponse } from "./api"
import { CreateUserDto, User } from "../types/user"
// import { CreateUserDto, User, UpdateUserDto } from "../types/user"

export const UserService = {
  /**
   * 🔹 Cria um novo usuário
   * Endpoint: POST /users
   */
  async create(data: CreateUserDto): Promise<User> {
    try {
      const res: ApiResponse<User> = await api.post("/users", data)
      return res.data
    } catch (error: any) {
      console.error("[UserService] Erro ao criar usuário:", error)
      throw error?.data || { message: "Falha ao criar usuário." }
    }
  },

  /**
   * 🔹 Busca todos os usuários
   * Endpoint: GET /users
   */
  async findAll(): Promise<User[]> {
    try {
      const res: ApiResponse<User[]> = await api.get("/users")
      return res.data
    } catch (error: any) {
      console.error("[UserService] Erro ao buscar usuários:", error)
      throw error?.data || { message: "Falha ao buscar usuários." }
    }
  },

  /**
   * 🔹 Busca usuário pelo ID
   * Endpoint: GET /users/:id
   */
  async findById(id: string): Promise<User | null> {
    try {
      const res: ApiResponse<User> = await api.get(`/users/${id}`)
      return res.data
    } catch (error: any) {
      console.error(`[UserService] Erro ao buscar usuário ${id}:`, error)
      return null // compatível com AuthProvider (não lança erro crítico)
    }
  },

  /**
   * 🔹 Atualiza dados de um usuário
   * Endpoint: PATCH /users/:id
   */
  // async update(id: string, data: UpdateUserDto): Promise<User> {
  //   try {
  //     const res: ApiResponse<User> = await api.patch(`/users/${id}`, data)
  //     return res.data
  //   } catch (error: any) {
  //     console.error(`[UserService] Erro ao atualizar usuário ${id}:`, error)
  //     throw error?.data || { message: "Falha ao atualizar usuário." }
  //   }
  // },

  /**
   * 🔹 Remove um usuário
   * Endpoint: DELETE /users/:id
   */
  async remove(id: string): Promise<void> {
    try {
      await api.delete(`/users/${id}`)
    } catch (error: any) {
      console.error(`[UserService] Erro ao remover usuário ${id}:`, error)
      throw error?.data || { message: "Falha ao remover usuário." }
    }
  },
}
