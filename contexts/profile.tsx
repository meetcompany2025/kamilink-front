// src/context/ProfileContext.tsx
"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react"
import { UserService } from "@/services/userService"
import { User } from "@/types/user"

interface ProfileContextType {
  user: User | null
  loading: boolean
  error: string | null
  refreshProfile: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  clearError: () => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

interface ProfileProviderProps {
  children: ReactNode
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleError = useCallback((error: any, context: string) => {
    console.error(`[PROFILE] ${context}:`, error)
    const message = error?.message || "Ocorreu um erro inesperado"
    setError(message)
  }, [])

  const refreshProfile = useCallback(async () => {
    try {
      setLoading(true)
      clearError()

      const token = localStorage.getItem("token")
      const userId = token ? JSON.parse(atob(token.split(".")[1])).sub : null

      if (!userId) {
        setUser(null)
        return
      }

      const data = await UserService.findById(userId)
      setUser(data)
    } catch (err) {
      handleError(err, "Error refreshing profile")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [handleError, clearError])

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      if (!user) {
        throw new Error("No user logged in")
      }

      try {
        clearError()
        // You should implement this in userService
        // const updatedUser = await updateUser(user.id, updates)
        // setUser(updatedUser)
      } catch (err) {
        handleError(err, "Error updating profile")
        throw err
      }
    },
    [user, handleError, clearError],
  )

  useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  const value = useMemo<ProfileContextType>(
    () => ({
      user,
      loading,
      error,
      refreshProfile,
      updateProfile,
      clearError,
    }),
    [user, loading, error, refreshProfile, updateProfile, clearError],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}

export type { ProfileContextType }
