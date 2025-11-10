import router from "next/router"
import { useEffect } from "react"
import { useAuth } from "./auth-provider"

const { user, isLoading } = useAuth()
useEffect(() => {
  if (!isLoading && !user) router.replace("/login")
}, [isLoading, user])
