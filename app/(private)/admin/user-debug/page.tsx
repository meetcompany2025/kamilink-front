"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"

export default function UserDebugPage() {
  const [userId, setUserId] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userData, setUserData] = useState<any>(null)
  const [authData, setAuthData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const { user: currentUser } = useAuth()

  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser.id)
    }
  }, [currentUser])

  const fetchUserById = async () => {
    if (!userId) return

    setIsLoading(true)
    setError(null)

    try {
      // Fetch from users table
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error) throw error

      setUserData(data)

      // Fetch auth metadata if possible
      try {
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId)

        if (!authError && authUser) {
          setAuthData(authUser)
        }
      } catch (e) {
        console.log("Could not fetch auth data (requires admin rights)")
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch user data")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserByEmail = async () => {
    if (!userEmail) return

    setIsLoading(true)
    setError(null)

    try {
      // Fetch from users table
      const { data, error } = await supabase.from("users").select("*").eq("email", userEmail).single()

      if (error) throw error

      setUserData(data)
      setUserId(data.id)

      // Try to fetch auth data
      try {
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(data.id)

        if (!authError && authUser) {
          setAuthData(authUser)
        }
      } catch (e) {
        console.log("Could not fetch auth data (requires admin rights)")
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch user data")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">User Data Debugger</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Lookup User</CardTitle>
          <CardDescription>Search for a user by ID or email</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="id" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="id">By User ID</TabsTrigger>
              <TabsTrigger value="email">By Email</TabsTrigger>
            </TabsList>

            <TabsContent value="id">
              <div className="flex gap-4 mb-4">
                <Input placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
                <Button onClick={fetchUserById} disabled={isLoading || !userId}>
                  {isLoading ? "Loading..." : "Lookup"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="email">
              <div className="flex gap-4 mb-4">
                <Input placeholder="Email address" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                <Button onClick={fetchUserByEmail} disabled={isLoading || !userEmail}>
                  {isLoading ? "Loading..." : "Lookup"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {error && <div className="p-4 mb-4 bg-red-50 text-red-600 rounded-md">{error}</div>}
        </CardContent>
      </Card>

      {userData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Profile Data</CardTitle>
              <CardDescription>Data from the users table</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-gray-50 rounded-md overflow-auto max-h-96 text-sm">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {authData && (
            <Card>
              <CardHeader>
                <CardTitle>Auth Data</CardTitle>
                <CardDescription>Data from Supabase Auth</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-gray-50 rounded-md overflow-auto max-h-96 text-sm">
                  {JSON.stringify(authData, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
