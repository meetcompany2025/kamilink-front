"use client"

import { useEffect, useState, JSX } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import Link from "next/link"
import { NotificationItem } from "./notification-item"
import { Notification } from "@/types/notifications"
import { NotificationService } from "@/services/notificationService"
import { useAuth } from "./auth-provider"
import { io } from "socket.io-client"

const SOCKET_URL = "https://ethical-vilhelmina-kamilink-831636e0.koyeb.app/"

export function NotificationIndicator(): JSX.Element {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const { user } = useAuth()

  // 🔹 Buscar notificações da API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("🔄 Buscando notificações...")
        const res:any = await NotificationService.getByUser()

        // Garante que o retorno sempre seja um array válido
        const data = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : []

        setNotifications(data)
        console.log("✅ Notificações carregadas:", data)
      } catch (err) {
        console.error("❌ Erro ao buscar notificações:", err)
        setNotifications([]) // fallback seguro
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [user])

  // 🔹 Conectar ao socket em tempo real
  useEffect(() => {
    if (!user?.id) return

    const socket = io(SOCKET_URL, {
      query: { userId: user.id },
      transports: ["websocket"],
    })

    socket.on("connect", () => console.log("🔗 Conectado ao servidor socket"))
    socket.on("disconnect", () => console.log("⚡ Desconectado do socket"))

    socket.on("new-notification", (notification: Notification) => {
      console.log("📬 Nova notificação recebida:", notification)
      setNotifications((prev) => [notification, ...prev])
    })

    return () => {
      socket.disconnect()
    }
  }, [user?.id])

  // 🔹 Atualizar contador de não lidas
  useEffect(() => {
    const count = notifications.filter((n) => !n.isRead).length
    setUnreadCount(count)
  }, [notifications])

  // 🔹 Marcar notificação como lida
  const markAsRead = async (id: string) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
      await NotificationService.markAsRead(id)
    } catch (err) {
      console.error("Erro ao marcar notificação como lida:", err)
    }
  }

  // 🔹 Renderização principal
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notificações</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 mt-3">
        <div className="max-h-72 overflow-y-auto">
          {isLoading ? (
            <p className="p-4 text-sm text-muted-foreground text-center">
              Carregando notificações...
            </p>
          ) : notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">
              Nenhuma notificação
            </p>
          ) : (
            Array.isArray(notifications) &&
            notifications.slice(0, 5).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
              />
            ))
          )}
        </div>

        <div className="border-t p-2 text-center">
          <Link
            href="/notifications"
            className="text-sm text-blue-600 hover:underline"
          >
            Ver todas
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
