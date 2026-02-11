import axios from 'axios';
import { Product, Order, OrderRequest } from '../types';

const API_BASE_URL = 'https://apppwa-1.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};

export const orderService = {
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
  },

  createOrder: async (order: OrderRequest): Promise<Order> => {
    try {
      const response = await api.post('/orders', order);
      return response.data;
    } catch (error: any) {
      // Si es un error de red, verificar si es una respuesta offline del Service Worker
      if (error.response && error.response.data) {
        return error.response.data; // Devolver respuesta del Service Worker
      }
      
      // Si es un error de red sin respuesta, lanzar error con mensaje offline
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        throw new Error('offline');
      }
      
      throw error;
    }
  },
};

export default api;
