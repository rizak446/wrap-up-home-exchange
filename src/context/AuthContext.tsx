"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, CreditAccount } from "@/types";
import { INITIAL_USERS } from "@/lib/data/mock-db";

interface AuthContextType {
  currentUser: UserProfile | null;
  creditAccount: CreditAccount | null;
  isLoading: boolean;
  loginAs: (userId: string) => Promise<void>;
  loginWithEmail: (email: string) => Promise<boolean>;
  registerUser: (data: {
    fullName: string;
    email: string;
    phone?: string;
    city: string;
    country: string;
  }) => Promise<UserProfile>;
  logout: () => void;
  refreshCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default to Arjun Verma (The Bhopal resident ready to book Goa!)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [creditAccount, setCreditAccount] = useState<CreditAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCredits = async (userId: string) => {
    try {
      const res = await fetch(`/api/credits?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setCreditAccount(data.account);
      }
    } catch (e) {
      console.error("Failed to load credits", e);
    }
  };

  useEffect(() => {
    // Initial load: check localStorage or default to Arjun
    const savedUserId = typeof window !== "undefined" ? localStorage.getItem("haven_user_id") : null;
    const initialUser =
      INITIAL_USERS.find((u) => u.id === savedUserId) ||
      INITIAL_USERS.find((u) => u.id === "user-traveler-arjun") ||
      INITIAL_USERS[4];

    setCurrentUser(initialUser);
    if (initialUser) {
      fetchCredits(initialUser.id);
    }
    setIsLoading(false);
  }, []);

  const loginAs = async (userId: string) => {
    setIsLoading(true);
    const user = INITIAL_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      if (typeof window !== "undefined") {
        localStorage.setItem("haven_user_id", user.id);
      }
      await fetchCredits(user.id);
    }
    setIsLoading(false);
  };

  const loginWithEmail = async (email: string): Promise<boolean> => {
    const user = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      await loginAs(user.id);
      return true;
    }
    return false;
  };

  const registerUser = async (data: {
    fullName: string;
    email: string;
    phone?: string;
    city: string;
    country: string;
  }): Promise<UserProfile> => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email: data.email,
      full_name: data.fullName,
      phone: data.phone,
      country: data.country || "India",
      city: data.city,
      identity_verified: false,
      property_verified: false,
      role: "member",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    INITIAL_USERS.push(newUser);
    await loginAs(newUser.id);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    setCreditAccount(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("haven_user_id");
    }
  };

  const refreshCredits = async () => {
    if (currentUser) {
      await fetchCredits(currentUser.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        creditAccount,
        isLoading,
        loginAs,
        loginWithEmail,
        registerUser,
        logout,
        refreshCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
