import api from './api';
import { CreateFreightOfferDto, FreightOffer } from '../types/freightOffer';

export const FreightOfferService = {
  create: async (data: CreateFreightOfferDto): Promise<FreightOffer> => {
    const res = await api.post('/freight_offers', data);
    return res.data;
  },
  findAll: async (): Promise<FreightOffer[]> => {
    const res = await api.get('/freights_offers');
    return res.data;
  },
  findAvailable: async (): Promise<FreightOffer[]> => {
    const res = await api.get('/freights/available');
    return res.data;
  },
  getMyFreights: async (): Promise<FreightOffer[]> => {
    const res = await api.get('/freights/my');
    return res.data;
  },
  accept: async (id: string): Promise<FreightOffer> => {
    const res = await api.patch(`/freights/${id}/accept`);
    return res.data;
  },
  start: async (id: string): Promise<FreightOffer> => {
    const res = await api.patch(`/freights/${id}/start`);
    return res.data;
  },
  finish: async (id: string): Promise<FreightOffer> => {
    const res = await api.patch(`/freights/${id}/finish`);
    return res.data;
  },
  cancel: async (id: string): Promise<FreightOffer> => {
    const res = await api.patch(`/freights/${id}/cancel`);
    return res.data;
  },
};
