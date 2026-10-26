"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Star,
  Building,
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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
        res.error || "Invalid email or password. Please verify your credentials and try again."
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
      setOtpSuccessMessage("A 6-digit verification code has been dispatched to your email!");
    } else {
      setError(
        res.error ||
          "Unable to send OTP at this time. Please use Password Login for immediate access."
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center">
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl shadow-luxury border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* LEFT COLUMN: BRAND & SOCIAL PROOF (DESKTOP) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-navy-950 via-slate-900 to-navy-950 text-white p-10 flex-col justify-between relative overflow-hidden">
            {/* Ambient background decoration */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Logo */}
            <div className="relative z-10">
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                <div className="h-10 w-10 rounded-2xl bg-teal-500 flex items-center justify-center text-navy-950 group-hover:scale-105 transition-transform shadow-md shadow-teal-500/20">
                  <Compass className="h-5 w-5" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-white font-serif">
                  Haven<span className="text-teal-400">Swap</span>
                </span>
              </Link>
              <p className="mt-3 text-xs text-slate-300 leading-relaxed max-w-sm">
                Curated home exchange and non-reciprocal stay credits across India’s most scenic cities.
              </p>
            </div>

            {/* Middle Feature Highlights */}
            <div className="relative z-10 space-y-4 my-8">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1.5">
                <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Real Member Experience</span>
                </div>
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  "Exchanged our 3BHK apartment in Bhopal for a private beachfront villa in Goa. Saved ₹85,000 on lodging and stayed like locals!"
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-200">Divas D. • Bhopal</span>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-lg font-extrabold text-teal-400">10,000+</div>
                  <div className="text-[11px] text-slate-300 font-medium">Nights Exchanged</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-lg font-extrabold text-teal-400">₹0</div>
                  <div className="text-[11px] text-slate-300 font-medium">Brokerage Commission</div>
                </div>
              </div>
            </div>

            {/* Bottom Compliance & Trust */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="h-4 w-4 text-teal-400 flex-shrink-0" />
              <span>Compliant with India DPDP Act 2023 & ID verification standards</span>
            </div>
          </div>

          {/* RIGHT COLUMN: LOGIN FORM */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-navy-950 flex items-center justify-center text-teal-400">
                  <Compass className="h-5 w-5" />
                </div>
                <span className="text-xl font-extrabold text-navy-950 font-serif">
                  Haven<span className="text-teal-600">Swap</span>
                </span>
              </Link>
              <Link href="/auth/register" className="text-xs font-bold text-teal-700 hover:underline">
                Create account &rarr;
              </Link>
            </div>

            <div>
              {/* Desktop Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-serif tracking-tight">
                    Welcome Back
                  </h1>
                  <p className="mt-1 text-xs text-slate-500">
                    Sign in to manage your homes, reservations, and credit wallet.
                  </p>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-xs text-slate-500">Need an account?</span>
                  <Link
                    href="/auth/register"
                    className="block text-xs font-bold text-teal-600 hover:text-teal-800 transition-colors"
                  >
                    Sign Up & Get 150 pts
                  </Link>
                </div>
              </div>

              {/* Login Mode Tabs */}
              <div className="mt-6 flex rounded-2xl bg-slate-100 p-1 text-xs font-bold border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("password");
                    setError(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-center transition-all cursor-pointer ${
                    activeTab === "password"
                      ? "bg-white text-navy-950 shadow-sm font-extrabold"
                      : "text-slate-500 hover:text-navy-950"
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
                  className={`flex-1 py-2.5 rounded-xl text-center transition-all cursor-pointer ${
                    activeTab === "otp"
                      ? "bg-white text-navy-950 shadow-sm font-extrabold"
                      : "text-slate-500 hover:text-navy-950"
                  }`}
                >
                  Email Verification Code (OTP)
                </button>
              </div>

              {/* Alerts */}
              {error && (
                <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-shake">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {otpSuccessMessage && (
                <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium">{otpSuccessMessage}</span>
                </div>
              )}

              {/* FORM: TAB 1 - PASSWORD LOGIN */}
              {activeTab === "password" && (
                <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-950 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-navy-950">
                        Password
                      </label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-xs font-semibold text-teal-600 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-300 text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                      />
                      <span className="font-medium">Remember this device</span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    variant="teal"
                    size="lg"
                    className="w-full font-bold text-sm py-3 rounded-2xl shadow-md mt-2"
                    isLoading={isLoading}
                  >
                    Sign In to HavenSwap
                  </Button>
                </form>
              )}

              {/* FORM: TAB 2 - EMAIL OTP LOGIN */}
              {activeTab === "otp" && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-950 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white"
                      />
                    </div>
                  </div>

                  {!otpSent ? (
                    <Button
                      type="button"
                      variant="teal"
                      size="lg"
                      onClick={() => handleRequestOtp()}
                      className="w-full font-bold text-sm py-3 rounded-2xl shadow-md mt-2"
                      isLoading={isLoading}
                    >
                      Send 6-Digit Code
                    </Button>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-navy-950 mb-1.5">
                          Enter 6-Digit Verification Code
                        </label>
                        <div className="relative">
                          <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="123456"
                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-teal-500 text-center font-mono font-bold tracking-widest text-base text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="teal"
                        size="lg"
                        className="w-full font-bold text-sm py-3 rounded-2xl shadow-md"
                        isLoading={isLoading}
                      >
                        Verify & Sign In
                      </Button>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                        <button
                          type="button"
                          onClick={() => handleRequestOtp()}
                          className="hover:underline flex items-center gap-1 text-teal-600 font-bold"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Resend Code
                        </button>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="hover:underline text-slate-400 font-medium"
                        >
                          Change email address
                        </button>
                      </div>
                    </form>
                  )}

                  <p className="text-[11px] text-slate-400 text-center leading-relaxed pt-2">
                    Tip: If email delivery is delayed, switch to{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("password")}
                      className="text-teal-700 font-bold underline cursor-pointer"
                    >
                      Password Login
                    </button>{" "}
                    for instant access.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Footer Link */}
            <div className="pt-8 border-t border-slate-100 text-center text-xs text-slate-500">
              <span>Protected by 256-bit SSL encryption. </span>
              <Link href="/legal/privacy" className="text-teal-600 hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
