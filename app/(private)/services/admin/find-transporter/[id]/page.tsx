"use client"

import { useParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Link from "next/link"
import { Eye } from "lucide-react"

// Mock Clientes
const mockClients = [
  {
    id: 1,
    name: "João Transportes",
    document: "007876549LA045",
    city: "Luanda",
    status: "Ativo",
    contact: "+244 912 111 222",
    email: "joao@transportes.com",
    profileImage: null,
    personalDocs: [
      { name: "Bilhete de Identidade", url: "#" },
      { name: "Documentos do Veículo", url: "#" }
    ]
  },
  {
    id: 2,
    name: "Maria Cargas",
    document: "004476549BA045",
    city: "Benguela",
    status: "Inativo",
    contact: "+244 923 333 444",
    email: "maria@cargas.com",
    profileImage: null,
    personalDocs: [{ name: "Bilhete de Identidade", url: "#" }]
  },
]

// Mock Fretes
const mockFreights = [
  { id: 1, origem: "Luanda", destino: "Benguela", tipo: "Cargas Gerais", status: "Ativo", date: "2025-08-10" },
  { id: 2, origem: "Benguela", destino: "Lubango", tipo: "Alimentos", status: "Pendente", date: "2025-08-12" },
  { id: 3, origem: "Luanda", destino: "Cabinda", tipo: "Combustível", status: "Concluído", date: "2025-07-30" },
  { id: 4, origem: "Huambo", destino: "Luanda", tipo: "Peças Automotivas", status: "Cancelado", date: "2025-07-25" },
]

function getInitials(name: string) {
  return name.split(" ").map(word => word[0]).join("").toUpperCase()
}

export default function TrasnporterDetalhesPage() {
  const params = useParams()
  const id = Number(params.id)
  const client = mockClients.find(c => c.id === id)

  if (!client) {
    return <p className="p-6 text-sm text-muted-foreground">Cliente não encontrado.</p>
  }

  const activeFreights = mockFreights.filter(f => f.status === "Ativo" || f.status === "Pendente")
  const concludedFreights = mockFreights.filter(f => f.status === "Concluído")
  const cancelledFreights = mockFreights.filter(f => f.status === "Cancelado")

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6 px-4">
      {/* Perfil do Cliente */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            {client.profileImage ? (
              <img
                src={client.profileImage}
                alt={client.name}
                className="w-20 h-20 rounded-full object-cover border"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold border">
                {getInitials(client.name)}
              </div>
            )}
            <div>
              <CardTitle className="text-2xl">{client.name}</CardTitle>
              <CardDescription>Informações detalhadas do cliente</CardDescription>
            </div>
          </div>

          <Badge
            variant={client.status === "Ativo" ? "default" : "secondary"}
            className="text-sm px-4 py-1"
          >
            {client.status}
          </Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><strong>Documento:</strong> {client.document}</div>
          <div><strong>Cidade:</strong> {client.city}</div>
          <div><strong>Contato:</strong> {client.contact}</div>
          <div><strong>Email:</strong> {client.email}</div>
        </CardContent>
      </Card>

      {/* Documentos Pessoais */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Documentos Pessoais</CardTitle>
          <CardDescription>Arquivos enviados pelo cliente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {client.personalDocs.length > 0 ? (
            <ul className="space-y-3">
              {client.personalDocs.map((doc, idx) => (
                <li key={idx} className="flex items-center justify-between border p-3 rounded-lg">
                  <span>{doc.name}</span>
                  <Button size="sm" variant="outline">Visualizar</Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum documento enviado.</p>
          )}
        </CardContent>
      </Card>

      {/* Abas de Fretes */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Fretes do Cliente</CardTitle>
          <CardDescription>Visualize os fretes organizados por status</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ativos">
            <TabsList className="mb-6">
              <TabsTrigger value="ativos">Ativos / Pendentes</TabsTrigger>
              <TabsTrigger value="concluidos">Concluídos</TabsTrigger>
              <TabsTrigger value="cancelados">Cancelados</TabsTrigger>
            </TabsList>

            {[
              { value: "ativos", data: activeFreights, empty: "Nenhum frete ativo ou pendente." },
              { value: "concluidos", data: concludedFreights, empty: "Nenhum frete concluído." },
              { value: "cancelados", data: cancelledFreights, empty: "Nenhum frete cancelado." }
            ].map(tab => (
              <TabsContent key={tab.value} value={tab.value} className="mt-2">
                {tab.data.length > 0 ? (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Origem</th>
                        <th className="text-left py-3 px-2">Destino</th>
                        <th className="text-left py-3 px-2">Tipo</th>
                        {tab.value !== "ativos" && <th className="text-left py-3 px-2">Data</th>}
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-left py-3 px-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tab.data.map(f => (
                        <tr key={f.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-2">{f.origem}</td>
                          <td className="py-3 px-2">{f.destino}</td>
                          <td className="py-3 px-2">{f.tipo}</td>
                          {tab.value !== "ativos" && <td className="py-3 px-2">{f.date}</td>}
                          <td className="py-3 px-2">
                            <Badge variant={f.status === "Ativo" ? "default" : "secondary"}>
                              {f.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-muted-foreground">{tab.empty}</p>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Voltar */}
      <div className="pt-4">
        <Link href="/clientes">
          <Button variant="outline">← Voltar à lista</Button>
        </Link>
      </div>
    </div>
  )
}
