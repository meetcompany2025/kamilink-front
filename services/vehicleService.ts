import api from './api';
import { CreateVehicleDto, Vehicle } from '../types/vehicle';

export const VehicleService = {
  // Cria veículo com autenticação (usuário logado)
  createAuth: async (data: CreateVehicleDto): Promise<Vehicle> => {
    const res = await api.post('/vehicles', data);
    return res.data;
  },

  // Obtém veículos do usuário logado
  getMyVehicles: async (): Promise<Vehicle[]> => {
    const res = await api.get('/vehicles/my');
    return res.data;
  },

  // Obtém veículo por ID
  getById: async (id: string): Promise<Vehicle> => {
    const res = await api.get(`/vehicles/${id}`);
    return res.data;
  },

  // Upload de **foto do veículo**
  uploadVehicleImage: async (vehicleId: string, file: File, type = 'VEHICLE_IMAGE'): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('vehicleId', vehicleId);

    // { noJson: true } indica que o retorno pode não ser JSON
    const res = await api.post('/uploads', formData, { noJson: true });
    return res.data;
  },

  // ------------------------- FUNÇÃO DE UPLOAD -------------------------
/**
 * Envia a foto do veículo e os documentos obrigatórios em um único FormData.
 * @param vehicleId - ID do veículo recém-criado
 * @param vehicleImage - arquivo da foto do veículo
 * @param documents - array de objetos { file: File, documentType: string }
 */
// ✅ SOLUÇÃO: Use { noJson: true } sem headers
async uploadVehicleDocuments(
  vehicleId: string,
  vehicleImage: File | null,
  documents: { file: File; documentType: string }[]
) {
  if (!vehicleImage && (!documents || documents.length === 0)) return null;

  const formData = new FormData();

  // 1) Foto do veículo
  if (vehicleImage) {
    formData.append("vehicleImage", vehicleImage, vehicleImage.name);
  }

  // 2) Documentos (cada um vira um campo "documents")
  documents.forEach((doc) => {
    formData.append("documents", doc.file, doc.file.name);
  });

  // 3) Tipos de documentos como string JSON
  const documentTypes = documents.map((doc) => doc.documentType);
  formData.append("documentTypes", JSON.stringify(documentTypes));

  // 4) ✅ CORREÇÃO: Use { noJson: true } sem headers
  const res = await api.post(
    `/uploads/vehicle-documents/${vehicleId}/upload`,
    formData,
    { noJson: true } // ← Isso faz o api.ts NÃO definir Content-Type
  );

  return res.data;
}

  // Upload de **documentos do veículo** (PDFs)
  // uploadVehicleDocuments: async (vehicleId: string, files: { file: File; documentType: string }[]): Promise<any> => {
  //   const promises = files.map((doc) => {
  //     const formData = new FormData();
  //     formData.append('file', doc.file);
  //     formData.append('type', 'VEHICLE_DOCUMENT');
  //     formData.append('vehicleId', vehicleId);
  //     formData.append('documentType', doc.documentType);

  //     return api.post('/uploads', formData, { noJson: true });
  //   });

  //   return Promise.all(promises);
  // },

  // // Método genérico para enviar **foto + documentos** de uma vez
  // uploadAllFiles: async (
  //   vehicleId: string,
  //   vehicleImage: File | null,
  //   documents: { file: File; documentType: string }[]
  // ): Promise<any> => {
  //   const uploadPromises = [];

  //   if (vehicleImage) {
  //     uploadPromises.push(VehicleService.uploadVehicleImage(vehicleId, vehicleImage));
  //   }

  //   if (documents.length > 0) {
  //     uploadPromises.push(VehicleService.uploadVehicleDocuments(vehicleId, documents));
  //   }

  //   return Promise.all(uploadPromises);
  // },
};
