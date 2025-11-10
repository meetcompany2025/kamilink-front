// "use client"

// import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
// import { useRouter, useSearchParams } from "next/navigation" 
// import Cookies from "js-cookie"
// import { AuthService } from "@/services/authService"
// import { UserService } from "@/services/userService"

// const AuthContext = createContext<any>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<any | null>(null)
//   const [userProfile, setUserProfile] = useState<any | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const searchParams = useSearchParams()

//   const router = useRouter()

//   const clearError = useCallback(() => setError(null), [])

//   const handleError = useCallback((error: any, context: string) => {
//     console.error(`[AUTH] ${context}:`, error)
//     const message =
//       error?.response?.data?.message || error?.message || "Erro inesperado"
//     setError(message)
//   }, [])

//   const getToken = () => { 
//       if (typeof window === "undefined") return null
//       return (
//         localStorage.getItem("token") ||
//         sessionStorage.getItem("token") ||
//         Cookies.get("token") ||
//         null
//       )
//   }

  
//   const fetchUserProfile = useCallback(async () => {
//     try {
//       const token = getToken()
//       if (!token) return

//       const user = await AuthService.me(token)
//       setUser(user)

//       const userProfile = await UserService.findById(user.id)
//       setUserProfile(userProfile)

      
//        if (userProfile) {
//           const dashboardPath =
//             userProfile?.profile === "TRANSPORTER"
//               ? "/dashboard/transporter"
//               : userProfile?.profile === "CLIENT"
//               ? "/dashboard/client"
//               : "/dashboard/admin"

//           router.replace(dashboardPath)
//         }
//     } catch (error) {
//       handleError(error, "fetch profile")
//       router.replace("/login")
//     }
//   }, [handleError])

//   useEffect(() => {
//     const init = async () => {
//       setIsLoading(true)
//       await fetchUserProfile()
//       setIsLoading(false)
//     }
//     init()
//   }, [fetchUserProfile])

//   // --- shared login flow ---
//   const handleLogin = useCallback(
//     async (credentials: { email?: string; phone?: string; password: string, rememberMe?: boolean}) => {
//       try {
//         setIsLoading(true)
//         clearError()

//         const res = await AuthService.login(credentials)
//         if (res.token) {
//         if (credentials.rememberMe) {
//           // Persist across sessions
//           localStorage.setItem("token", res.token)
//           Cookies.set("token", res.token, { expires: 7 })
//         } else {
//           // Session only → cleared when browser closes
//           sessionStorage.setItem("token", res.token)
//           Cookies.set("token", res.token) // session cookie
//         }
//       }

//         const user = await AuthService.me(res.token)
//         setUser(user)

//         const userProfile = await UserService.findById(user.id)
//         setUserProfile(userProfile)

//         // --- redirect after login ---
//        const redirectTo = searchParams.get("redirectTo")
//        if (redirectTo) {
//           router.replace(redirectTo)
//         } else {
//           const dashboardPath =
//             userProfile?.profile === "TRANSPORTER"
//               ? "/dashboard/transporter"
//               : userProfile?.profile === "CLIENT"
//               ? "/dashboard/client"
//               : "/dashboard/admin"

//           router.replace(dashboardPath)
//         }
//       } catch (error) {
//         handleError(error, "login")
//         throw error
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [clearError, handleError, router],
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

//   const signOut = useCallback(async () => {
//     try {
//       setIsLoading(true)
//       await AuthService.logout()

//       localStorage.removeItem("token")
//       sessionStorage.removeItem("token")
//       Cookies.remove("token")
//       Cookies.remove("refresh_token")
//       setUser(null)
//       setUserProfile(null)

//       router.replace("/")
//       // window.location.href = "/login"
//     } catch (error) {
//       handleError(error, "sign out")
//     } finally {
//       setIsLoading(false)
//     }
//   }, [handleError, router])

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

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

