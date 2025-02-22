"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface User {
  userId: string;
  username: string;
  role: "BUYER" | "SELLER";
}

interface UserContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for existing tokens on mount
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      // Decode JWT to get user info
      try {
        const payload = JSON.parse(atob(storedAccessToken.split(".")[1]));
        setUser({
          userId: payload.userId,
          username: payload.username,
          role: payload.role,
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    }
  }, []);

  const login = (tokens: { accessToken: string; refreshToken: string }) => {
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      tokens;

    // Store tokens in localStorage
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    // Set tokens in state
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);

    // Decode JWT to get user info
    try {
      const payload = JSON.parse(atob(newAccessToken.split(".")[1]));
      setUser({
        userId: payload.userId,
        username: payload.username,
        role: payload.role,
      });
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <UserContext.Provider
      value={{ user, accessToken, refreshToken, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
