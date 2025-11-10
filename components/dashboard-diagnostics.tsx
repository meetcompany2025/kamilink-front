"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"

interface DiagnosticResult {
  test: string
  status: "success" | "error" | "warning"
  message: string
  details?: any
}

export default function DashboardDiagnostics() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const { user, userProfile, isLoading } = useAuth()
  const supabase = createClient()

  const runDiagnostics = async () => {
    setIsRunning(true)
    const diagnosticResults: DiagnosticResult[] = []

    // Test 1: Authentication Status
    try {
      diagnosticResults.push({
        test: "Authentication Status",
        status: user ? "success" : "error",
        message: user ? `User authenticated: ${user.email}` : "No authenticated user",
        details: { user, userProfile, isLoading },
      })
    } catch (error) {
      diagnosticResults.push({
        test: "Authentication Status",
        status: "error",
        message: `Authentication error: ${error.message}`,
        details: error,
      })
    }

    // Test 2: Supabase Connection
    try {
      const { data, error } = await supabase.from("users").select("count").limit(1)
      diagnosticResults.push({
        test: "Supabase Connection",
        status: error ? "error" : "success",
        message: error ? `Connection failed: ${error.message}` : "Connection successful",
        details: { data, error },
      })
    } catch (error) {
      diagnosticResults.push({
        test: "Supabase Connection",
        status: "error",
        message: `Connection error: ${error.message}`,
        details: error,
      })
    }

    // Test 3: User Profile Data
    if (user) {
      try {
        const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

        diagnosticResults.push({
          test: "User Profile Data",
          status: error ? "error" : "success",
          message: error ? `Profile fetch failed: ${error.message}` : "Profile data retrieved",
          details: { data, error },
        })
      } catch (error) {
        diagnosticResults.push({
          test: "User Profile Data",
          status: "error",
          message: `Profile error: ${error.message}`,
          details: error,
        })
      }

      // Test 4: Freight Requests Data
      try {
        const { data, error } = await supabase.from("freight_requests").select("*").eq("client_id", user.id).limit(5)

        diagnosticResults.push({
          test: "Freight Requests Data",
          status: error ? "error" : "success",
          message: error
            ? `Freight data fetch failed: ${error.message}`
            : `Found ${data?.length || 0} freight requests`,
          details: { data, error },
        })
      } catch (error) {
        diagnosticResults.push({
          test: "Freight Requests Data",
          status: "error",
          message: `Freight data error: ${error.message}`,
          details: error,
        })
      }

      // Test 5: Database Schema Check
      try {
        const { data, error } = await supabase.rpc("check_table_exists", { table_name: "freight_requests" })
        diagnosticResults.push({
          test: "Database Schema",
          status: error ? "error" : "success",
          message: error ? `Schema check failed: ${error.message}` : "Database schema verified",
          details: { data, error },
        })
      } catch (error) {
        // This is expected if the RPC function doesn't exist
        diagnosticResults.push({
          test: "Database Schema",
          status: "warning",
          message: "Unable to verify schema (RPC function not available)",
          details: error,
        })
      }
    }

    // Test 6: Environment Variables
    const envVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

    const missingEnvVars = envVars.filter((envVar) => !process.env[envVar])
    diagnosticResults.push({
      test: "Environment Variables",
      status: missingEnvVars.length > 0 ? "error" : "success",
      message:
        missingEnvVars.length > 0
          ? `Missing environment variables: ${missingEnvVars.join(", ")}`
          : "All required environment variables are set",
      details: { missingEnvVars, availableEnvVars: envVars.filter((v) => process.env[v]) },
    })

    setResults(diagnosticResults)
    setIsRunning(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [user])

  const getStatusIcon = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Success</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Diagnostics</h1>
          <p className="text-muted-foreground">Diagnose data loading issues in the dashboard</p>
        </div>
        <Button onClick={runDiagnostics} disabled={isRunning}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRunning ? "animate-spin" : ""}`} />
          {isRunning ? "Running..." : "Run Diagnostics"}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Results</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    {result.test}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{result.message}</p>
                    {getStatusBadge(result.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {results.some((r) => r.status === "error") && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Critical Issues Detected</AlertTitle>
              <AlertDescription>
                Some critical issues were found that may prevent the dashboard from working properly. Please review the
                detailed results and fix these issues.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {results.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  {result.test}
                  {getStatusBadge(result.status)}
                </CardTitle>
                <CardDescription>{result.message}</CardDescription>
              </CardHeader>
              {result.details && (
                <CardContent>
                  <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-48">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </CardContent>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="raw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Raw Diagnostic Data</CardTitle>
              <CardDescription>Complete diagnostic results for debugging</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-96">
                {JSON.stringify({ results, user, userProfile, isLoading }, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
