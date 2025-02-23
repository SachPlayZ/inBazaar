import axios from "axios";
import { authService } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const analyticsService = {
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
};
