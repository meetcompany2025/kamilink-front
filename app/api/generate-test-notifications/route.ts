import { NextResponse } from "next/server"
import { createNotification } from "@/lib/supabase/notifications"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
    }

    // Criar notificações de teste
    const notifications = [
      await createNotification(
        userId,
        "Bem-vindo ao KamiLink",
        "Obrigado por se juntar à nossa plataforma. Estamos felizes em tê-lo conosco!",
        "system",
      ),
      await createNotification(
        userId,
        "Frete Atualizado",
        "Seu frete FR-001 está agora em trânsito.",
        "freight_status",
        "FR-001",
      ),
      await createNotification(
        userId,
        "Nova Proposta",
        "Você recebeu uma nova proposta para o frete FR-002 de Transportes Angola.",
        "new_offer",
        "FR-002",
      ),
      await createNotification(
        userId,
        "Documentação Pendente",
        "Por favor, envie os documentos necessários para o frete FR-003.",
        "system",
        "FR-003",
      ),
      await createNotification(
        userId,
        "Nova Mensagem",
        "Você recebeu uma nova mensagem de Carlos Transportes.",
        "message",
      ),
    ]

    return NextResponse.json({ success: true, count: notifications.length })
  } catch (error) {
    console.error("Erro ao gerar notificações de teste:", error)
    return NextResponse.json({ error: "Erro ao gerar notificações de teste" }, { status: 500 })
  }
}
