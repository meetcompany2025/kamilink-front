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
import { Loader2 } from "lucide-react"

interface ProvidersProps {
  children: ReactNode
}

/**
 * 🧩 Providers globais da aplicação
 *
 * Responsável por:
 * - Envolver toda a árvore de componentes com contextos essenciais.
 * - Garantir que temas, idioma e autenticação estejam disponíveis em qualquer lugar.
 * - Exibir fallback visual enquanto contextos assíncronos (como Auth) carregam.
 *
 * ⚠️ Observação: a ordem dos providers importa!
 *   - ThemeProvider precisa estar no topo (para evitar flashes visuais).
 *   - AuthProvider deve vir antes de ProfileProvider.
 *   - Suspense cobre apenas partes assíncronas, não o layout inteiro.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <LanguageProvider>
          {/* Suspense cobre apenas a autenticação e perfil */}
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Carregando autenticação...
                </span>
              </div>
            }
          >
            <AuthProvider>
              <ProfileProvider>
                <div className="relative flex min-h-screen flex-col">
                  {/* Cabeçalho e rodapé permanecem fixos, não são recriados */}
                  <SiteHeader />

                  {/* Conteúdo principal da aplicação */}
                  <main className="flex-1" role="main">
                    {children}
                  </main>

                  <SiteFooter />
                </div>

                {/* Sistema global de notificações */}
                <Toaster />
              </ProfileProvider>
            </AuthProvider>
          </Suspense>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
