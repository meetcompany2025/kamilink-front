import api from './api';
import { CreateReviewDto, Review } from '../types/review';

export const ReviewService = {
  create: async (data: CreateReviewDto): Promise<Review> => {
    const res = await api.post('/reviews', data);
    return res.data;
  },
  listByClient: async (): Promise<Review[]> => {
    const res = await api.get('/reviews');
    return res.data;
  },
  listByDriver: async (): Promise<Review[]> => {
    const res = await api.get('/reviews/received');
    return res.data;
  },
  listAllAdmin: async (
    clientId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<Review[]> => {
    const params: any = {};
    if (clientId) params.clientId = clientId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const res = await api.get('/reviews/admin', { params });
    return res.data;
  },
};
