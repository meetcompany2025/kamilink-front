export interface CreateTrackingDto {
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  direction?: string;
  isAvailable?: boolean;
}

export interface Tracking {
  id: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  direction?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}
