// import api from './api';
// import { CreateVehicleDto, Vehicle } from '../types/vehicle';

// export const VehicleService = {
//   createAuth: async (data: CreateVehicleDto): Promise<Vehicle> => {
//     const res = await api.post('/vehicles', data);
//     return res.data;
//   },

//   create: async (data: CreateVehicleDto): Promise<Vehicle> => {
//     const res = await api.post('/vehicles/register', data);
//     return res.data;
//   },

//   getMyVehicles: async(): Promise<Vehicle> => {
//     const res = await api.get(`/vehicles/my`) // ou `/vehicles/user/${userId}` se for o caso
//     return res.data;
//   },

//   getById: async(id: string): Promise<Vehicle> => {
//     const res = await api.get(`/vehicles/${id}`) // ou `/vehicles/user/${userId}` se for o caso
//     return res.data;
//   },

//   getAllVehicels: async(): Promise<Vehicle> => {
//     const res = await api.get(`/vehicles`) 
//     return res.data;
//   },
//   uploadVehicleDocuments: async(data: any): Promise<Vehicle> => {
//     const res = await api.post(`/uploads`, data) 
//     return res.data;
//   },

//   // adiciona ao final do VehicleService
// uploadVehicleImage: async (vehicleId: string, file: File, type = "VEHICLE_IMAGE"): Promise<any> => {
//   const formData = new FormData()
//   formData.append("file", file) // API espera campo "file"
//   formData.append("type", type)
//   formData.append("vehicleId", vehicleId)

//   // note: o api wrapper aceita config { noJson: true } para FormData
//   const res = await api.post("/uploads", formData, { noJson: true })
//   return res.data
// },

// };

