// app/layout.tsx

import type { Metadata } from "next"
import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

// ✅ Carregamento otimizado da fonte Inter
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // evita layout shift durante o carregamento
})

// ✅ Metadados globais da aplicação
export const metadata: Metadata = {
  title: {
    default: "KamiLink - Plataforma de Logística",
    template: "%s | KamiLink", // útil para páginas internas
  },
  description: "Conectando clientes e transportadores em Angola",
  keywords: ["logística", "transporte", "Angola", "frete"],
  authors: [{ name: "KamiLink Team" }],
  generator: "Next.js 15",
  openGraph: {
    title: "KamiLink - Plataforma de Logística",
    description: "Conectando clientes e transportadores em Angola",
    url: "https://kamilink.com", // coloca o domínio real aqui depois
    siteName: "KamiLink",
    locale: "pt_AO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KamiLink - Plataforma de Logística",
    description: "Conectando clientes e transportadores em Angola",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

// ✅ Layout raiz da aplicação
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background text-foreground`}
        suppressHydrationWarning
      >
        {/* 
          Providers contém contextos globais:
          - ThemeProvider
          - SessionProvider
          - ToastProvider
          - QueryClientProvider
          - Etc.
        */}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
