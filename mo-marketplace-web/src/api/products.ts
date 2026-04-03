import { apiClient } from './client';
import type { Product, CreateProductInput, CreateVariantInput, Variant } from '../types';

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const res = await apiClient.get<Product[]>('/products');
    return res.data;
  },

  getOne: async (id: string): Promise<Product> => {
    const res = await apiClient.get<Product>(`/products/${id}`);
    return res.data;
  },

  create: async (data: CreateProductInput): Promise<Product> => {
    const res = await apiClient.post<Product>('/products', data);
    return res.data;
  },

  update: async (id: string, data: Partial<CreateProductInput>): Promise<Product> => {
    const res = await apiClient.patch<Product>(`/products/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  addVariant: async (productId: string, data: CreateVariantInput): Promise<Variant> => {
    const res = await apiClient.post<Variant>(`/products/${productId}/variants`, data);
    return res.data;
  },

  deleteVariant: async (productId: string, variantId: string): Promise<void> => {
    await apiClient.delete(`/products/${productId}/variants/${variantId}`);
  },
};
