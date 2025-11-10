// "use client"

// import { JSX, useEffect, useState } from "react"
// import { Bell } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover"
// import Link from "next/link"
// import { NotificationItem } from "./notification-item" // your existing component
// import { Notification, NotificationType } from "@/types/notifications"
// import { NotificationService } from "@/services/notificationService"
// import { useAuth } from "./auth-provider"
// import { io } from 'socket.io-client';

// const SOCKET_URL = 'https://ethical-vilhelmina-kamilink-831636e0.koyeb.app/'; 


// // Temporary mock data — replace with your real API data
// const mockNotifications: Notification[] = [
//   {
//     id: "1",
//     userId: "u1",
//     title: "Frete confirmado",
//     message: "Seu frete foi confirmado pelo transportador.",
//     type: "FREIGHT_STATUS",
//     isRead: false,
//     createdAt: new Date().toISOString(),
//     relatedId: "123",
//   },
//   {
//     id: "2",
//     userId: "u1",
//     title: "Nova oferta recebida",
//     message: "Transportador João enviou uma nova oferta.",
//     type: "NEW_REQUEST",
//     isRead: true,
//     createdAt: new Date().toISOString(),
//     relatedId: "456",
//   },
//   {
//     id: "3",
//     userId: "u1",
//     title: "Mensagem recebida",
//     message: "Você tem uma nova mensagem de Maria.",
//     type: "MESSAGE",
//     isRead: false,
//     createdAt: new Date().toISOString(),
//     relatedId: "544",
//   },
// ]

// export function NotificationIndicator() {
//   //const [notifications, setNotifications] = useState(mockNotifications)
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const { user, userProfile } = useAuth()

//   useEffect(() => {

//     const fetchNotifications = async () => {
//       try {

//         console.log("Pegou as notificações");
//         const res = await NotificationService.getByUser()
//         setNotifications(res);
//         console.log(res)
//       } catch (err) {
//         console.error("Erro ao buscar notificações:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchNotifications();

//     const userId = user.id; // replace with real user ID
//     const socket = io(SOCKET_URL, {
//       query: { userId },
//     });

//     socket.on('connect', () => {
//       console.log('Connected to socket server');
//     });

//     socket.on('new-notification', (notification) => {
//       console.log("Foi chamado");
//       setNotifications((prev) => [notification, ...prev]);
//     });

//     return () => {
//       socket.disconnect();
//     };
    
//   }, [user]);


//   useEffect(() => {
//     setUnreadCount(notifications.filter((n) => !n.isRead).length);
//   }, [notifications]);
  
//   //const unreadCount = notifications.filter((n) => !n.isRead).length

//   const markAsRead = async (id: string) => {
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
//     )

//     const marked = await NotificationService.markAsRead(id)
//   }

//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button variant="ghost" size="sm" className="relative">
//           <Bell className="h-4 w-4" />
//           {unreadCount > 0 && (
//             <Badge
//               variant="destructive"
//               className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
//             >
//               {unreadCount > 9 ? "9+" : unreadCount}
//             </Badge>
//           )}
//           <span className="sr-only">Notificações</span>
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-80 p-0 mt-3">
//         <div className="max-h-72 overflow-y-auto">
//           {notifications.length === 0 ? (
//             <p className="p-4 text-sm text-muted-foreground text-center">
//               Nenhuma notificação
//             </p>
//           ) : (
//             notifications.slice(0, 5).map((notification) => (
//               <NotificationItem
//                 key={notification.id}
//                 notification={notification}
//                 onMarkAsRead={markAsRead}
//               />
//             ))
//           )}
//         </div>
//         <div className="border-t p-2 text-center">
//           <Link
//             href="/notifications"
//             className="text-sm text-blue-600 hover:underline"
//           >
//             Ver todas
//           </Link>
//         </div>
//       </PopoverContent>
//     </Popover>
//   )
// }

