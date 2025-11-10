"use client"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DollarSign, CreditCard, TrendingUp, Calendar } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import FadeIn from "@/components/fade-in"


/*export const metadata: Metadata = {
  title: "Financeiro | KamiLink",
  description: "Gerencie suas finanças na plataforma KamiLink",
}*/

export default async function FinancialPage() {
  const { user, userProfile } = useAuth()

  if (!user) {
    redirect("/login?callbackUrl=/services/financial")
  }

  if (user.user_type !== "transporter") {
    redirect("/dashboard")
  }

  return (
    <FadeIn>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Financeiro</h1>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0 KZS</div>
                <p className="text-xs text-muted-foreground">Disponível para saque</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ganhos do Mês</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0 KZS</div>
                <p className="text-xs text-muted-foreground">+0% em relação ao mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximo Pagamento</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0 KZS</div>
                <p className="text-xs text-muted-foreground">Previsto para --/--/----</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="transactions">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transactions">Transações</TabsTrigger>
              <TabsTrigger value="withdrawals">Saques</TabsTrigger>
              <TabsTrigger value="invoices">Faturas</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Transações</CardTitle>
                  <CardDescription>Visualize todas as suas transações na plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Você ainda não possui transações registradas.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="withdrawals" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Saques</CardTitle>
                  <CardDescription>Solicite saques e visualize o histórico</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center py-6 space-y-4">
                    <Button disabled className="w-full max-w-xs">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Solicitar Saque
                    </Button>
                    <p className="text-sm text-muted-foreground">Saldo mínimo para saque: 5.000 KZS</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Faturas</CardTitle>
                  <CardDescription>Visualize e baixe suas faturas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Você ainda não possui faturas disponíveis.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </FadeIn>
  )
}
