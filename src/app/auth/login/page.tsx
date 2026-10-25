"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, sendOtp, verifyOtp } = useAuth();

  const [activeTab, setActiveTab] = useState<"password" | "otp">("password");

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");

  // OTP Flow states
  const [otpSent, setOtpSent] = useState(false);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Password Login Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await loginWithEmail(email, password);
    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(
        res.error ||
          "Invalid email or password. Please check your credentials and try again."
      );
      setIsLoading(false);
    }
  };

  // 2. Request OTP Code
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setOtpSuccessMessage(null);

    const res = await sendOtp(email);
    setIsLoading(false);

    if (res.success) {
      setOtpSent(true);
      setOtpSuccessMessage("6-digit verification code dispatched to your email!");
    } else {
      setError(
        res.error ||
          "Unable to send OTP. If rate limit exceeded, please use Password Login."
      );
    }
  };

  // 3. Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      setError("Please enter the 6-digit OTP code received in your email.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await verifyOtp(email, otpCode, "email");
    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.error || "Invalid or expired OTP code. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-xl bg-navy-950 flex items-center justify-center text-teal-400">
            <Compass className="h-5 w-5" />
          </div>
          <span className="text-2xl font-extrabold text-navy-950 font-serif">
            Haven<span className="text-teal-600">Swap</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-navy-950 font-serif">
          Sign In to Your Member Account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Or{" "}
          <Link href="/auth/register" className="font-semibold text-teal-600 hover:underline">
            create a new verified account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-luxury sm:rounded-3xl sm:px-10 border border-slate-200">
          {/* Login Mode Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab("password");
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg text-center transition-all ${
                activeTab === "password"
                  ? "bg-white text-navy-950 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("otp");
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg text-center transition-all ${
                activeTab === "otp"
                  ? "bg-white text-navy-950 shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign in with OTP Code
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {otpSuccessMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>{otpSuccessMessage}</span>
            </div>
          )}

          {/* TAB 1: PASSWORD LOGIN */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-navy-950">
                    Password
                  </label>
                  <Link href="/auth/forgot-password" className="text-[11px] text-teal-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="teal"
                size="md"
                className="w-full font-bold"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>
          )}

          {/* TAB 2: EMAIL OTP LOGIN */}
          {activeTab === "otp" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {!otpSent ? (
                <Button
                  type="button"
                  variant="teal"
                  size="md"
                  onClick={() => handleRequestOtp()}
                  className="w-full font-bold"
                  isLoading={isLoading}
                >
                  Send 6-Digit OTP Code
                </Button>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-navy-950 mb-1">
                      Enter 6-Digit Verification Code (OTP)
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="e.g. 123456"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-teal-500 text-center font-mono font-bold tracking-widest text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="teal"
                    size="md"
                    className="w-full font-bold"
                    isLoading={isLoading}
                  >
                    Verify & Sign In
                  </Button>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <button
                      type="button"
                      onClick={() => handleRequestOtp()}
                      className="hover:underline flex items-center gap-1 text-teal-600 font-semibold"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Resend Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="hover:underline text-slate-400"
                    >
                      Change email
                    </button>
                  </div>
                </form>
              )}

              <p className="text-[11px] text-slate-400 text-center leading-relaxed pt-2">
                Note: Supabase email rate limits may apply on free tier. If OTP does not arrive within 60 seconds, use the{" "}
                <strong className="text-teal-700 cursor-pointer" onClick={() => setActiveTab("password")}>
                  Password Login
                </strong>{" "}
                tab for immediate access.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
