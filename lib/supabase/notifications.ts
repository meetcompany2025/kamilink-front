import { createClient } from "./client"
import { createServerClient } from "./server"
import type { Notification, NotificationType } from "@/types/notifications"

// Funções do lado do cliente
export const getNotifications = async (limit = 10, offset = 0) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Erro ao buscar notificações:", error)
    throw error
  }

  return data as Notification[]
}

export const getUnreadCount = async () => {
  const supabase = createClient()

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)

  if (error) {
    console.error("Erro ao contar notificações não lidas:", error)
    throw error
  }

  return count || 0
}

export const markAsRead = async (notificationId: string) => {
  const supabase = createClient()

  const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

  if (error) {
    console.error("Erro ao marcar notificação como lida:", error)
    throw error
  }

  return true
}

export const markAllAsRead = async () => {
  const supabase = createClient()

  const { error } = await supabase.from("notifications").update({ is_read: true }).eq("is_read", false)

  if (error) {
    console.error("Erro ao marcar todas notificações como lidas:", error)
    throw error
  }

  return true
}

// Funções do lado do servidor
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: NotificationType,
  relatedId?: string,
) => {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      title,
      message,
      type,
      related_id: relatedId,
      is_read: false,
    })
    .select()
    .single()

  if (error) {
    console.error("Erro ao criar notificação:", error)
    throw error
  }

  return data as Notification
}

// Função para criar notificações de mudança de status de frete
export const createFreightStatusNotification = async (userId: string, freightId: string, status: string) => {
  let title = ""
  let message = ""

  switch (status) {
    case "assigned":
      title = "Frete Atribuído"
      message = `Seu frete #${freightId} foi atribuído a um transportador.`
      break
    case "in_transit":
      title = "Frete em Trânsito"
      message = `Seu frete #${freightId} está em trânsito.`
      break
    case "delivered":
      title = "Frete Entregue"
      message = `Seu frete #${freightId} foi entregue com sucesso.`
      break
    case "cancelled":
      title = "Frete Cancelado"
      message = `Seu frete #${freightId} foi cancelado.`
      break
    default:
      title = "Atualização de Frete"
      message = `Seu frete #${freightId} foi atualizado.`
  }

  return createNotification(userId, title, message, "freight_status", freightId)
}

// Função para criar notificações de nova oferta
export const createNewOfferNotification = async (userId: string, freightId: string, transporterName: string) => {
  const title = "Nova Proposta Recebida"
  const message = `Você recebeu uma nova proposta para o frete #${freightId} de ${transporterName}.`

  return createNotification(userId, title, message, "new_offer", freightId)
}
