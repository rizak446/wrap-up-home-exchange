"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, CreditAccount } from "@/types";
import { INITIAL_USERS } from "@/lib/data/mock-db";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  currentUser: UserProfile | null;
  creditAccount: CreditAccount | null;
  isLoading: boolean;
  isDemoUser: boolean;
  loginAs: (userId: string) => Promise<void>;
  loginWithEmail: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  sendOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (
    email: string,
    token: string,
    type?: "signup" | "email"
  ) => Promise<{ success: boolean; error?: string }>;
  registerUser: (data: {
    fullName: string;
    email: string;
    password?: string;
    phone?: string;
    city: string;
    country: string;
  }) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [creditAccount, setCreditAccount] = useState<CreditAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  const fetchCredits = async (userId: string) => {
    try {
      // 1. Authoritative direct query from Supabase credit_accounts table
      const supabase = createClient();
      const { data: account, error } = await supabase
        .from("credit_accounts")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (account) {
        setCreditAccount({
          id: account.id,
          user_id: account.user_id,
          available_balance: Number(account.available_balance ?? 0),
          pending_balance: Number(account.pending_balance ?? 0),
          reserved_balance: Number(account.reserved_balance ?? 0),
          lifetime_earned: Number(account.lifetime_earned ?? 0),
          lifetime_spent: Number(account.lifetime_spent ?? 0),
          updated_at: account.updated_at,
        });
        return;
      }
    } catch (e) {
      console.warn("Direct Supabase credit query warning:", e);
    }

    // 2. Fallback to API route
    try {
      const res = await fetch(`/api/credits?userId=${userId}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.account) {
          setCreditAccount(data.account);
        }
      }
    } catch (e) {
      console.error("Failed to load credits", e);
    }
  };

  useEffect(() => {
    async function initAuth() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Live Supabase User
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();

          if (profile) {
            setCurrentUser(profile);
            if (typeof window !== "undefined") {
              localStorage.setItem("haven_current_user", JSON.stringify(profile));
            }
            setIsDemoUser(false);
            await fetchCredits(session.user.id);
            setIsLoading(false);
            return;
          }
        }

        // Check localStorage for remembered user session
        const savedUserJson =
          typeof window !== "undefined"
            ? localStorage.getItem("haven_current_user")
            : null;

        if (savedUserJson) {
          try {
            const savedProfile = JSON.parse(savedUserJson);
            if (savedProfile?.id) {
              const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", savedProfile.id)
                .maybeSingle();

              const activeProfile = profile || savedProfile;
              setCurrentUser(activeProfile);
              if (typeof window !== "undefined") {
                localStorage.setItem("haven_current_user", JSON.stringify(activeProfile));
              }
              setIsDemoUser(false);
              await fetchCredits(activeProfile.id);
              setIsLoading(false);
              return;
            }
          } catch {}
        }

        // Clean initial state: no dummy user auto-logged-in
        setCurrentUser(null);
        setIsDemoUser(false);
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  // Auto-sync profile & credits whenever the window regains focus (e.g. after editing in Supabase Table Editor)
  useEffect(() => {
    const handleSyncOnFocus = async () => {
      if (!currentUser?.id) return;
      try {
        const supabase = createClient();
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (profile) {
          setCurrentUser(profile);
          if (typeof window !== "undefined") {
            localStorage.setItem("haven_current_user", JSON.stringify(profile));
          }
        }
        await fetchCredits(currentUser.id);
      } catch (err) {
        console.warn("Auto-sync error on focus:", err);
      }
    };

    window.addEventListener("focus", handleSyncOnFocus);
    return () => window.removeEventListener("focus", handleSyncOnFocus);
  }, [currentUser?.id]);

  const loginAs = async (userId: string) => {
    setIsLoading(true);
    const user = INITIAL_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsDemoUser(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("haven_demo_user_id", user.id);
      }
      await fetchCredits(user.id);
    }
    setIsLoading(false);
  };

  const loginWithEmail = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || "",
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("haven_demo_user_id");
        }
        setIsDemoUser(false);

        // Fetch user profile from Supabase
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profile) {
          setCurrentUser(profile);
        } else {
          const fallbackProfile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name:
              data.user.user_metadata?.full_name || email.split("@")[0],
            country: "India",
            city: data.user.user_metadata?.city || "India",
            avatar_url:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
            identity_verified: false,
            property_verified: false,
            role: "member",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          await supabase.from("profiles").upsert(fallbackProfile);
          setCurrentUser(fallbackProfile);
        }

        await fetchCredits(data.user.id);
        setIsLoading(false);
        return { success: true };
      }
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || "Failed to log in" };
    }

    setIsLoading(false);
    return { success: false, error: "No account found with these credentials" };
  };

  const sendOtp = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) {
        setIsLoading(false);
        if (
          error.message?.includes("rate limit") ||
          (error as any).code === "over_email_send_rate_limit"
        ) {
          return {
            success: false,
            error:
              "Supabase email rate limit exceeded (maximum 3-4 emails/hour on free tier). Please sign in using your password.",
          };
        }
        return { success: false, error: error.message };
      }

      setIsLoading(false);
      return { success: true };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || "Failed to send OTP" };
    }
  };

  const verifyOtp = async (
    email: string,
    token: string,
    type: "signup" | "email" = "email"
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      let { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: token.trim(),
        type: type,
      });

      if (error && type === "email") {
        const retry = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: token.trim(),
          type: "signup",
        });
        if (!retry.error && retry.data?.user) {
          data = retry.data;
          error = null;
        }
      }

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message || "Invalid or expired OTP code" };
      }

      if (data?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle();

        const activeProfile: UserProfile = profile || {
          id: data.user.id,
          email: data.user.email || email,
          full_name: data.user.user_metadata?.full_name || email.split("@")[0],
          country: "India",
          city: data.user.user_metadata?.city || "India",
          avatar_url:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
          identity_verified: false,
          property_verified: false,
          role: "member",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (typeof window !== "undefined") {
          localStorage.setItem("haven_current_user", JSON.stringify(activeProfile));
        }

        setCurrentUser(activeProfile);
        setIsDemoUser(false);
        await fetchCredits(data.user.id);
        setIsLoading(false);
        return { success: true };
      }
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || "OTP verification failed" };
    }

    setIsLoading(false);
    return { success: false, error: "OTP verification could not be completed" };
  };

  const registerUser = async (data: {
    fullName: string;
    email: string;
    password?: string;
    phone?: string;
    city: string;
    country: string;
  }): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password || "HavenSwap2026!",
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
            city: data.city,
            country: data.country || "India",
          },
        },
      });

      if (authError) {
        setIsLoading(false);
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        const newProfile: UserProfile = {
          id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          phone: data.phone,
          country: data.country || "India",
          city: data.city,
          avatar_url:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
          identity_verified: false,
          property_verified: false,
          role: "member",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Explicitly sync profile and initial credit balance in Supabase tables
        await supabase.from("profiles").upsert(newProfile);
        await supabase.from("credit_accounts").upsert({
          user_id: authData.user.id,
          available_balance: 150,
          lifetime_earned: 150,
          pending_balance: 0,
          reserved_balance: 0,
        });

        if (typeof window !== "undefined") {
          localStorage.removeItem("haven_demo_user_id");
        }

        setCurrentUser(newProfile);
        setIsDemoUser(false);
        setCreditAccount({
          id: `acc-${authData.user.id}`,
          user_id: authData.user.id,
          available_balance: 150,
          pending_balance: 0,
          reserved_balance: 0,
          lifetime_earned: 150,
          lifetime_spent: 0,
          updated_at: new Date().toISOString(),
        });

        setIsLoading(false);
        return { success: true, user: newProfile };
      }
    } catch (e: any) {
      console.warn("Supabase registration error, using local fallback:", e);
      const fallbackUser: UserProfile = {
        id: `user-${Date.now()}`,
        email: data.email,
        full_name: data.fullName,
        phone: data.phone,
        country: data.country || "India",
        city: data.city,
        avatar_url:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
        identity_verified: false,
        property_verified: false,
        role: "member",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      INITIAL_USERS.push(fallbackUser);
      setCurrentUser(fallbackUser);
      setIsDemoUser(false);
      setIsLoading(false);
      return { success: true, user: fallbackUser };
    }

    setIsLoading(false);
    return { success: false, error: "Registration could not be completed" };
  };

  const updateProfile = async (
    updates: Partial<UserProfile>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: "Not logged in" };

    try {
      const updatedUser: UserProfile = {
        ...currentUser,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // 1. If real Supabase user (UUID), update Supabase profiles table
      const isUUID = (str: string) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          str
        );

      if (isUUID(currentUser.id)) {
        const supabase = createClient();
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: updatedUser.full_name,
            bio: updatedUser.bio,
            city: updatedUser.city,
            country: updatedUser.country,
            phone: updatedUser.phone,
            avatar_url: updatedUser.avatar_url,
            document_type: updatedUser.document_type || null,
            document_number: updatedUser.document_number || null,
            document_url: updatedUser.document_url || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentUser.id);

        if (error) {
          console.error("Error updating Supabase profile:", error);
        }

        // Also record in user_verifications if document uploaded
        if (updatedUser.document_type && (updatedUser.document_url || updatedUser.document_number)) {
          await supabase.from("user_verifications").upsert({
            user_id: currentUser.id,
            document_type: updatedUser.document_type,
            document_ref: updatedUser.document_number || "Uploaded Document File",
            status: "pending",
            created_at: new Date().toISOString(),
          });
        }
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("haven_current_user", JSON.stringify(updatedUser));
      }

      setCurrentUser(updatedUser);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to update profile" };
    }
  };

  const logout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    setCurrentUser(null);
    setCreditAccount(null);
    setIsDemoUser(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("haven_demo_user_id");
      localStorage.removeItem("haven_current_user");
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
        isDemoUser,
        loginAs,
        loginWithEmail,
        sendOtp,
        verifyOtp,
        registerUser,
        updateProfile,
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
