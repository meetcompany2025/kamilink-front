// src/services/notification.ts
import api from './api';
import { Notification, CreateNotificationDto } from '../types/notifications';

export const NotificationService = {
  // Criar notificação
  create: async (data: CreateNotificationDto): Promise<Notification> => {
    const res = await api.post('/notification', data);
    return res.data;
  },

  // Buscar todas as notificações
  getAll: async (): Promise<Notification[]> => {
    const res = await api.get('/notification');
    return res.data;
  },

  // Buscar notificação por ID
  getById: async (id: string): Promise<Notification> => {
    const res = await api.get(`/notification/${id}`);
    return res.data;
  },

  // Buscar notificações de um usuário
  getByUser: async (): Promise<Notification[]> => {
    const res = await api.get(`/notification/user`);
    return res.data;
  },

  // Buscar notificações não lidas de um usuário
  getUnreadByUser: async (): Promise<Notification[]> => {
    const res = await api.get(`/notification/user/unread`);
    return res.data;
  },

  // Marcar notificação como lida
  markAsRead: async (id: string): Promise<Notification> => {
    const res = await api.patch(`/notification/${id}/read`);
    return res.data;
  },

  // Marcar todas notificações de um usuário como lidas
  markAllAsRead: async (userId: string): Promise<void> => {
    await api.patch(`/notification/user/${userId}/read-all`);
  },

  // Deletar notificação
  delete: async (id: string): Promise<void> => {
    await api.delete(`/notification/${id}`);
  },

  // Contar notificações não lidas de um usuário
  countUnreadByUser: async (): Promise<number> => {
    const res = await api.get(`/notifications/user/unread/count`);
    return res.data.count;
  },
};
