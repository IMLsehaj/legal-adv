import React, { createContext, useContext, useState, ReactNode } from "react";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: "client" | "lawyer" | "admin";
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("legaledge-user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("legaledge-token"));

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("legaledge-token", newToken);
    localStorage.setItem("legaledge-user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("legaledge-token");
    localStorage.removeItem("legaledge-user");
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};