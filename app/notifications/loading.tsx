import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NotificationsLoading() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Suas notificações</CardTitle>
        </CardHeader>
        <Tabs defaultValue="all">
          <div className="px-6">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="unread">Não lidas</TabsTrigger>
              <TabsTrigger value="freight_status">Status</TabsTrigger>
              <TabsTrigger value="new_offer">Propostas</TabsTrigger>
              <TabsTrigger value="system">Sistema</TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="p-0">
            <TabsContent value="all" className="m-0">
              <div className="divide-y">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="p-4 border-b">
                      <div className="flex gap-3">
                        <Skeleton className="h-5 w-5 mt-0.5" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}
