import axios from "axios";
import { authService } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Sale {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  product: {
    name: string;
    price: number;
  };
  buyer: {
    name: string;
  };
}

export const salesService = {
  async getSalesOverview() {
    const token = authService.getToken();
    const response = await axios.get(`${API_URL}/seller/sales/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getRecentSales() {
    const token = authService.getToken();
    const response = await axios.get(`${API_URL}/seller/sales/recent`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
