export interface CreateVehicleDto {
  brand?: string;
  model?: string;
  licensePlate: string;
  type: string; // Ex: Caminhão, Moto, Carro
  loadCapacity: number;
  trailerType: string | undefined;
  baseProvince: string;
  userId?: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
  type: string; // Ex: Caminhão, Moto, Carro
  loadCapacity: number;
  trailerType: string;
  baseProvince: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
