import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  shopName: string;
  username: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await axios.post(`${API_URL}/seller/login`, credentials);
    if (response.data.accessToken) {
      Cookies.set("seller_token", response.data.accessToken);
      if (response.data.user) {
        localStorage.setItem("seller_info", JSON.stringify(response.data.user));
      }
    }
    return response.data;
  },

  async signup(data: SignupData) {
    const response = await axios.post(`${API_URL}/seller/signup`, data);
    if (response.data.token) {
      Cookies.set("seller_token", response.data.token);
      if (response.data.seller) {
        localStorage.setItem(
          "seller_info",
          JSON.stringify(response.data.seller)
        );
      }
    }
    return response.data;
  },

  logout() {
    Cookies.remove("seller_token");
    localStorage.removeItem("seller_info");
  },

  getCurrentSeller() {
    if (typeof window === "undefined") return null;
    const seller = localStorage.getItem("seller_info");
    return seller ? JSON.parse(seller) : null;
  },

  getToken() {
    if (typeof window === "undefined") return null;
    return Cookies.get("seller_token");
  },

  async fetchSellerDetails() {
    if (typeof window === "undefined") return null;
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await axios.get(`${API_URL}/seller/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("seller_info", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Failed to fetch seller details:", error);
      return null;
    }
  },
};
