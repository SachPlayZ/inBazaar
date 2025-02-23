import axios from "axios";
import { authService } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  url: string;
  measuringUnit: string;
  stoploss: number;
  createdAt: string;
  Category?: {
    id: string;
    type: string;
  };
}

export interface CreateProductData {
  name: string;
  url: string;
  description: string;
  price: number;
  measuringUnit: string;
  stoploss: number;
  categoryId?: string;
}

export interface CreateProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  url: string;
  measuringUnit: string;
  stoploss: number;
  createdAt: string;
  Category?: {
    id: string;
    type: string;
  };
  seller: {
    id: string;
    name: string;
    shopName: string;
  };
}

export const productService = {
  async createProduct(data: CreateProductData): Promise<CreateProductResponse> {
    try {
      const token = authService.getToken();
      const response = await axios.post<CreateProductResponse>(
        `${API_URL}/seller/products`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to create product";
        console.error("Create product error:", error.response?.data);
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  async getInventory() {
    const token = authService.getToken();
    const response = await axios.get(`${API_URL}/seller/inventory`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getDashboardStats() {
    const token = authService.getToken();
    const response = await axios.get(`${API_URL}/seller/dashboard-stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getRecentProducts() {
    const token = authService.getToken();
    const response = await axios.get(`${API_URL}/seller/recent-products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getCategoryByName(name: string) {
    const token = authService.getToken();
    const response = await axios.get(`${API_URL}/seller/category/${name}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
