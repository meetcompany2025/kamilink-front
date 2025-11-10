"use client"

import { useState, useEffect } from "react"
import { NotificationItem } from "@/components/notification-item"
import type { Notification } from "@/types/notifications"
import { Button } from "@/components/ui/button"
import { NotificationService } from "@/services/notificationService"

// MOCK: substitua pela chamada real de API
/*const mockNotifications: Notification[] = [
  {
    id: "1",
    user_id: "u1",
    title: "Status do Frete Atualizado",
    message: "Seu frete está a caminho do destino.",
    type: "freight_status",
    isRead: false,
    created_at: new Date().toISOString(),
    related_id: "f123",
  },
  {
    id: "2",
    user_id: "u1",
    title: "Nova Oferta Recebida",
    message: "Você recebeu uma nova oferta para o seu frete.",
    type: "new_offer",
    isRead: true,
    created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
    related_id: "o987",
  },
  {
    id: "3",
    user_id: "u1",
    title: "Mensagem Recebida",
    message: "Você recebeu uma nova mensagem de João.",
    type: "message",
    isRead: false,
    created_at: new Date(Date.now() - 7200 * 1000).toISOString(),
    related_id: "544",
  },
]*/

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     const fetchNotifications = async () => {
          try {
    
            console.log("Pegou as notificações");
            const res = await NotificationService.getByUser()
            setNotifications(res);
            console.log(res)
          } catch (err) {
            console.error("Erro ao buscar notificações:", err);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchNotifications();
  }, [])

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Notificações</h1>
      <p className="text-muted-foreground">Gerencie suas notificações e preferências.</p>

      <div className="mt-8 border rounded-md divide-y">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        ) : (
          <p className="text-sm text-center text-muted-foreground p-4">
            Nenhuma notificação no momento.
          </p>
        )}
      </div>

      {notifications.length > 3 && (
        <div className="mt-4 text-center">
          <Button variant="outline">Ver mais</Button>
        </div>
      )}
    </div>
  )
}

