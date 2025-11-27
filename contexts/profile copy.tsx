// // src/context/ProfileContext.tsx
// "use client"

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
//   useMemo,
//   type ReactNode,
// } from "react"
// import { UserService } from "@/services/userService"
// import { User } from "@/types/user"

// interface ProfileContextType {
//   user: User | null
//   loading: boolean
//   error: string | null
//   refreshProfile: () => Promise<void>
//   updateProfile: (updates: Partial<User>) => Promise<void>
//   clearError: () => void
// }

// const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

// interface ProfileProviderProps {
//   children: ReactNode
// }

// export function ProfileProvider({ children }: ProfileProviderProps) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const clearError = useCallback(() => {
//     setError(null)
//   }, [])

//   const handleError = useCallback((error: any, context: string) => {
//     console.error(`[PROFILE] ${context}:`, error)
//     const message = error?.message || "Ocorreu um erro inesperado"
//     setError(message)
//   }, [])

//   // ✅ FUNÇÃO SEGURA PARA DECODIFICAR TOKEN
//   const decodeToken = useCallback((token: string): { sub?: string; userId?: string } | null => {
//     try {
//       // Verifica se o token existe e é string
//       if (!token || typeof token !== 'string') {
//         return null
//       }

//       // Verifica formato JWT (deve ter 3 partes separadas por ponto)
//       const parts = token.split('.')
//       if (parts.length !== 3) {
//         throw new Error('Token não tem formato JWT válido')
//       }

//       // ✅ DECODIFICAÇÃO SEGURA - Base64 URL decode
//       const payload = parts[1]
      
//       // Converte Base64 URL para Base64 padrão
//       const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
      
//       // Adiciona padding se necessário
//       const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
      
//       // Decodifica
//       const decodedString = decodeURIComponent(
//         atob(padded)
//           .split('')
//           .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//           .join('')
//       )

//       const decoded = JSON.parse(decodedString)
      
//       // Retorna o payload decodificado
//       return decoded
//     } catch (err) {
//       console.error('❌ Erro ao decodificar token:', err)
//       return null
//     }
//   }, [])

//   // ✅ FUNÇÃO SEGURA PARA OBTER USER ID DO TOKEN
//   const getUserIdFromToken = useCallback((): string | null => {
//     try {
//       const token = localStorage.getItem("token")
      
//       if (!token) {
//         return null
//       }

//       const decoded = decodeToken(token)
      
//       // Tenta diferentes campos que podem conter o user ID
//       const userId = decoded?.sub || decoded?.userId || decoded?.userId
      
//       return userId || null
//     } catch (err) {
//       console.error('❌ Erro ao obter user ID do token:', err)
//       return null
//     }
//   }, [decodeToken])

//   const refreshProfile = useCallback(async () => {
//     try {
//       setLoading(true)
//       clearError()

//       // ✅ USA FUNÇÃO SEGURA PARA OBTER USER ID
//       const userId = getUserIdFromToken()

//       if (!userId) {
//         console.log('[PROFILE] Nenhum usuário autenticado')
//         setUser(null)
//         return
//       }

//       console.log('[PROFILE] Buscando dados do usuário:', userId)
//       const data = await UserService.findById(userId)
//       setUser(data)
//       console.log('[PROFILE] Dados carregados com sucesso')
      
//     } catch (err) {
//       handleError(err, "Error refreshing profile")
//       setUser(null)
      
//       // 🔥 LIMPA TOKEN INVÁLIDO
//       if (err instanceof Error && (
//         err.message.includes('Token') || 
//         err.message.includes('JWT') ||
//         err.message.includes('decodificar')
//       )) {
//         console.log('[PROFILE] Limpando token inválido')
//         localStorage.removeItem("token")
//       }
//     } finally {
//       setLoading(false)
//     }
//   }, [handleError, clearError, getUserIdFromToken])

//   const updateProfile = useCallback(
//     async (updates: Partial<User>) => {
//       if (!user) {
//         throw new Error("No user logged in")
//       }

//       try {
//         clearError()
//         // You should implement this in userService
//         // const updatedUser = await updateUser(user.id, updates)
//         // setUser(updatedUser)
//       } catch (err) {
//         handleError(err, "Error updating profile")
//         throw err
//       }
//     },
//     [user, handleError, clearError],
//   )

//   // ✅ EFFECT MELHORADO - com tratamento de erro
//   useEffect(() => {
//     let mounted = true

//     const loadProfile = async () => {
//       try {
//         await refreshProfile()
//       } catch (err) {
//         if (mounted) {
//           handleError(err, "Error in useEffect profile load")
//         }
//       }
//     }

//     loadProfile()

//     return () => {
//       mounted = false
//     }
//   }, [refreshProfile, handleError])

//   const value = useMemo<ProfileContextType>(
//     () => ({
//       user,
//       loading,
//       error,
//       refreshProfile,
//       updateProfile,
//       clearError,
//     }),
//     [user, loading, error, refreshProfile, updateProfile, clearError],
//   )

//   return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
// }

// export function useProfile() {
//   const context = useContext(ProfileContext)
//   if (context === undefined) {
//     throw new Error("useProfile must be used within a ProfileProvider")
//   }
//   return context
// }

// export type { ProfileContextType }