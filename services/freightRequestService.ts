import api from './api';
import { CreateFreightRequestDto, FreightRequest } from '../types/freightRequest';

export const FreightRequestService = {
  create: async (data: CreateFreightRequestDto): Promise<FreightRequest> => {
    const res = await api.post('/freights', data);
    return res.data;
  },
  findAll: async (): Promise<FreightRequest[]> => {
    const res = await api.get('/freights');
    return res.data;
  },
  getById: async (id: any): Promise<FreightRequest> => {
    const res = await api.get(`/freights/${id}`);
    return res.data;
  },
  findAvailable: async (): Promise<FreightRequest[]> => {
    const res = await api.get('/freights/available');
    return res.data;
  },
  getClientFreights: async (): Promise<FreightRequest[]> => {
    const res = await api.get('/freights/client/my');
    return res.data;
  },
  getTansporterFreights: async (): Promise<FreightRequest[]> => {
    const res = await api.get('/freights/client/my');
    return res.data;
  },
  getFreightDetail: async (id: string): Promise<FreightRequest> => {
    const res = await api.get(`/freights/${id}`);
    return res.data;
  },
  accept: async (id: string): Promise<FreightRequest> => {
    const res = await api.patch(`/freights/${id}/accept`);
    return res.data;
  },
  start: async (id: string): Promise<FreightRequest> => {
    const res = await api.patch(`/freights/${id}/start`);
    return res.data;
  },
  // start: async (id: string): Promise<FreightRequest> => {
  //   // console.log("Chamou");
  //   const res = await api.patch(`/freights/${id}/accept`);
  //   return res.data;
  // },
  finish: async (id: string): Promise<FreightRequest> => {
    const res = await api.patch(`/freights/${id}/finish`);
    return res.data;
  },
  cancel: async (id: string): Promise<FreightRequest> => {
    const res = await api.patch(`/freights/${id}/cancel`);
    return res.data;
  },
  update: async (id: string, data: any): Promise<FreightRequest> => {
    const res = await api.patch(`/freights/${id}`, data);
    return res.data;
  },
};
