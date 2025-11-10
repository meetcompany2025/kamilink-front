import api from './api';
import { CreateTrackingDto, Tracking } from '../types/tracking';

export const TrackingService = {
  create: async (data: CreateTrackingDto): Promise<Tracking> => {
    const res = await api.post('/tracking', data);
    return res.data;
  },
  findLatestByVehicle: async (vehicleId: string): Promise<Tracking> => {
    const res = await api.get(`/tracking/${vehicleId}`);
    return res.data;
  },
  findAllAvailable: async (): Promise<Tracking[]> => {
    const res = await api.get('/tracking');
    return res.data;
  },
};
