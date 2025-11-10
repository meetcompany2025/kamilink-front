"use client"

import { Suspense, type ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { AuthProvider } from "@/components/auth-provider"
import { ProfileProvider } from "@/contexts/profile"
import { ErrorBoundary } from "@/components/error-boundary"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Toaster } from "@/components/ui/toaster"
// import { GoogleMapsProvider } from "@/components/google-maps-provider"
import { Loader2 } from "lucide-react"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <LanguageProvider>
          <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2">Carregando autenticação...</span>
            </div>
          }
        >
          <AuthProvider>
            <ProfileProvider>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1" role="main">
                  {children}
                </main>
                <SiteFooter />
              </div>
              <Toaster />
            </ProfileProvider>
          </AuthProvider>
          </Suspense>
        </LanguageProvider>
        
      </ThemeProvider>
    </ErrorBoundary>
  )
}
