import axios from "axios";
import { authService } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface CreateProductData {
  name: string;
  url: string;
  description: string;
  price: number;
  measuringUnit: string;
  stoploss: number;
  categoryId?: string;
}

export const productService = {
  async createProduct(data: CreateProductData) {
    const token = authService.getToken();
    const response = await axios.post(`${API_URL}/seller/products`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getInventory() {
    const token = authService.getToken();
    const response = await axios.get(`${API_URL}/seller/inventory`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  },
};
