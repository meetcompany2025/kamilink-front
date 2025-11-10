import api from './api';
import { CreateVehicleDto, Vehicle } from '../types/vehicle';

export const VehicleService = {
  createAuth: async (data: CreateVehicleDto): Promise<Vehicle> => {
    const res = await api.post('/vehicles', data);
    return res.data;
  },

  create: async (data: CreateVehicleDto): Promise<Vehicle> => {
    const res = await api.post('/vehicles/register', data);
    return res.data;
  },

  getMyVehicles: async(): Promise<Vehicle> => {
    const res = await api.get(`/vehicles/my`) // ou `/vehicles/user/${userId}` se for o caso
    return res.data;
  },

  getById: async(id: string): Promise<Vehicle> => {
    const res = await api.get(`/vehicles/${id}`) // ou `/vehicles/user/${userId}` se for o caso
    return res.data;
  },

  getAllVehicels: async(): Promise<Vehicle> => {
    const res = await api.get(`/vehicles`) 
    return res.data;
  },
};
