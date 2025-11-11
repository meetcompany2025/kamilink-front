// "use client"

// import { 
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState 
// } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import Cookies from "js-cookie"
// import { AuthService } from "@/services/authService"
// import { UserService } from "@/services/userService"

// // 🔹 Tipos do contexto (pode refinar depois)
// interface AuthContextProps {
//   user: any | null
//   userProfile: any | null
//   isLoading: boolean
//   error: string | null
//   signInWithEmail: (email: string, password: string, rememberMe: boolean) => Promise<void>
//   signInWithPhone: (phone: string, password: string, rememberMe: boolean) => Promise<void>
//   signOut: () => Promise<void>
//   refreshProfile: () => Promise<void>
//   clearError: () => void
// }

// const AuthContext = createContext<AuthContextProps | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<any | null>(null)
//   const [userProfile, setUserProfile] = useState<any | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const router = useRouter()
//   const searchParams = useSearchParams()

//   const clearError = useCallback(() => setError(null), [])

//   const handleError = useCallback((error: any, context: string) => {
//     console.error(`[AUTH] ${context}:`, error)
//     const message =
//       error?.response?.data?.message || error?.message || "Erro inesperado"
//     setError(message)
//   }, [])

//   // ✅ Pega token de forma segura
//   const getToken = useCallback(() => {
//     if (typeof window === "undefined") return null
//     return (
//       localStorage.getItem("token") ||
//       sessionStorage.getItem("token") ||
//       Cookies.get("token") ||
//       null
//     )
//   }, [])

//   // ✅ Busca perfil do usuário
//   // const fetchUserProfile = useCallback(async () => {
//   //   const token = getToken()
//   //   if (!token) {
//   //     setUser(null)
//   //     setUserProfile(null)
//   //     return
//   //   }

//   //   try {
//   //     const userData = await AuthService.me(token)
//   //     setUser(userData)

//   //     const profile = await UserService.findById(userData.id)
//   //     setUserProfile(profile)
//   //   } catch (error) {
//   //     handleError(error, "fetch profile")
//   //     setUser(null)
//   //     setUserProfile(null)
//   //   }
//   // }, [getToken, handleError])

// //   const fetchUserProfile = useCallback(async () => {
// //   const token = getToken()
// //   if (!token) {
// //     // usuário não logado → não é erro
// //     setUser(null)
// //     setUserProfile(null)
// //     return
// //   }

// //   try {
// //     const userData = await AuthService.me(token)
// //     setUser(userData)

// //     const profile = await UserService.findById(userData.id)
// //     setUserProfile(profile)
// //   } catch (error) {
// //     // ⚠ Só mostra erro se existir token (ou seja, tinha intenção de estar logado)
// //     if (token) handleError(error, "fetch profile")
// //     setUser(null)
// //     setUserProfile(null)
// //   }
// // }, [getToken, handleError])

// const fetchUserProfile = useCallback(async () => {
//   const token = getToken()
//   if (!token) {
//     setUser(null)
//     setUserProfile(null)
//     setIsLoading(false)
//     return
//   }

//   try {
//     const userData = await AuthService.me(token)
//     setUser(userData)

//     if (userData?.id) {
//       const profile = await UserService.findById(userData.id)
//       setUserProfile(profile)
//     }
//   } catch (error) {
//     handleError(error, "fetch profile")
//     setUser(null)
//     setUserProfile(null)
//   } finally {
//     setIsLoading(false)
//   }
// }, [getToken, handleError])



//   // ✅ Executa ao carregar a aplicação
//   useEffect(() => {
//     const init = async () => {
//       setIsLoading(true)
//       await fetchUserProfile()
//       setIsLoading(false)
//     }
//     init()
//   }, [fetchUserProfile])

//   // ✅ Função unificada de login
//   const handleLogin = useCallback(
//     async (credentials: { email?: string; phone?: string; password: string; rememberMe?: boolean }) => {
//       try {
//         setIsLoading(true)
//         clearError()

//         const res = await AuthService.login(credentials)

//         if (res.token) {
//           if (credentials.rememberMe) {
//             localStorage.setItem("token", res.token)
//             Cookies.set("token", res.token, { expires: 7 })
//           } else {
//             sessionStorage.setItem("token", res.token)
//             Cookies.set("token", res.token)
//           }
//         }

//         const userData = await AuthService.me(res.token)
//         setUser(userData)
//         const profile = await UserService.findById(userData.id)
//         setUserProfile(profile)

//         const redirectTo = searchParams.get("redirectTo")
//         if (redirectTo) {
//           router.replace(redirectTo)
//         } else {
//           const dashboardPath =
//             profile?.profile === "TRANSPORTER"
//               ? "/dashboard/transporter"
//               : profile?.profile === "CLIENT"
//               ? "/dashboard/client"
//               : "/dashboard/admin"

//               setTimeout(() => {
//                 router.replace(dashboardPath)
//               }, 500)
//           //
//           router.replace(dashboardPath)
//         }
//       } catch (error) {
//         handleError(error, "login")
//         throw error
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [clearError, handleError, router, searchParams],
//   )

//   const signInWithEmail = useCallback(
//     async (email: string, password: string, rememberMe: boolean) =>
//       handleLogin({ email, password, rememberMe }),
//     [handleLogin],
//   )

//   const signInWithPhone = useCallback(
//     async (phone: string, password: string, rememberMe: boolean) =>
//       handleLogin({ phone, password, rememberMe }),
//     [handleLogin],
//   )

//   // ✅ Logout seguro
//   const signOut = useCallback(async () => {
//     try {
//       setIsLoading(true)
//       await AuthService.logout().catch(() => {})
//     } finally {
//       localStorage.removeItem("token")
//       sessionStorage.removeItem("token")
//       Cookies.remove("token")
//       Cookies.remove("refresh_token")

//       setUser(null)
//       setUserProfile(null)

//       // router.replace("/login")

//       setTimeout(() => {
//         router.replace("/login")
//       }, 100)

//       setIsLoading(false)
//     }
//   }, [router])

//   const refreshProfile = useCallback(async () => {
//     await fetchUserProfile()
//   }, [fetchUserProfile])

//   const value = useMemo(
//     () => ({
//       user,
//       userProfile,
//       isLoading,
//       error,
//       signInWithEmail,
//       signInWithPhone,
//       signOut,
//       refreshProfile,
//       clearError,
//     }),
//     [
//       user,
//       userProfile,
//       isLoading,
//       error,
//       signInWithEmail,
//       signInWithPhone,
//       signOut,
//       refreshProfile,
//       clearError,
//     ],
//   )

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// // ✅ Hook seguro
// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }
