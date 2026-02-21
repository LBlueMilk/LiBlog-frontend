"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { MOCK_USERS, USER_PASSWORDS, User } from "../data/mockData";

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isOwner: boolean;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("blogUser");
      if (saved) {
        const username = JSON.parse(saved);
        const user = MOCK_USERS.find((u) => u.username === username) ?? null;
        setCurrentUser(user);
      }
    } catch {
      // ignore
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const validPassword = USER_PASSWORDS[username];
    if (validPassword && validPassword === password) {
      const user = MOCK_USERS.find((u) => u.username === username);
      if (user) {
        setCurrentUser({ ...user });
        localStorage.setItem("blogUser", JSON.stringify(username));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("blogUser");
  };

  const updateUser = (updates: Partial<User>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const value = useMemo<AuthContextType>(
    () => ({
      currentUser,
      login,
      logout,
      isOwner: currentUser?.isOwner ?? false,
      updateUser,
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>.");
  return ctx;
}