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
  AlertCircle,
  ShieldCheck,
  Star,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await loginWithEmail(email.trim(), password);
    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(
        res.error || "Invalid email or password. Please verify your credentials."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center py-8">
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-[#FFFDF9] rounded-3xl shadow-luxury border border-[#E8DFD5] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* LEFT COLUMN: BRAND HERO (DESKTOP) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#261A10] via-[#362719] to-[#181008] text-white p-10 flex-col justify-between relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#C8792C]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F4D9A0]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Logo */}
            <div className="relative z-10">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="h-11 w-11 rounded-2xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform bg-[#FAF7F2] border border-[#E8DFD5] p-0.5 flex items-center justify-center">
                  <img
                    src="/wrap-up-logo.jpg"
                    alt="Wrap-Up Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-extrabold tracking-tight text-[#FAF5EA] font-serif">
                    Wrap<span className="text-[#C8792C]">-Up</span>
                  </span>
                  <span className="text-[11px] text-[#F4D9A0]/80 font-medium">Travel More • Spend Less</span>
                </div>
              </Link>
              <p className="mt-3 text-xs text-[#CEBCAB] leading-relaxed max-w-sm">
                Curated home exchange and non-reciprocal stay credits across India.
              </p>
            </div>

            {/* Social Proof & Metrics */}
            <div className="relative z-10 space-y-4 my-8">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1.5">
                <div className="flex items-center gap-2 text-[#F4D9A0] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Verified Member Community</span>
                </div>
                <p className="text-xs text-[#FAF5EA] italic leading-relaxed">
                  "Exchanged our 3BHK in Bhopal for a sea-facing stay in Goa with zero hotel bills. The most authentic way to travel."
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-[#CEBCAB]">
                  <span className="font-semibold text-[#FAF5EA]">Divas D. • Bhopal</span>
                  <div className="flex text-[#F4D9A0]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-[#F4D9A0]" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-lg font-extrabold text-[#F4D9A0]">10,000+</div>
                  <div className="text-[11px] text-[#CEBCAB] font-medium">Nights Exchanged</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-lg font-extrabold text-[#F4D9A0]">₹0</div>
                  <div className="text-[11px] text-[#CEBCAB] font-medium">Booking Commissions</div>
                </div>
              </div>
            </div>

            {/* Trust Footer */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-[#CEBCAB]">
              <ShieldCheck className="h-4 w-4 text-[#C8792C] flex-shrink-0" />
              <span>Compliant with India DPDP Act 2023 & ID verification</span>
            </div>
          </div>

          {/* RIGHT COLUMN: CLEAN PROFESSIONAL LOGIN */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between mb-6 pb-4 border-b border-[#E8DFD5]">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl overflow-hidden shadow-sm bg-[#FAF7F2] border border-[#E8DFD5] p-0.5 flex items-center justify-center">
                  <img
                    src="/wrap-up-logo.jpg"
                    alt="Wrap-Up Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-xl font-extrabold text-[#2E1E13] font-serif">
                  Wrap<span className="text-[#C8792C]">-Up</span>
                </span>
              </Link>
              <Link href="/auth/register" className="text-xs font-bold text-[#C8792C] hover:underline">
                Create account &rarr;
              </Link>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E1E13] font-serif tracking-tight">
                    Welcome Back
                  </h1>
                  <p className="mt-1 text-xs text-[#7A6F66]">
                    Sign in to manage your homes, reservations, and credit wallet.
                  </p>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-xs text-[#7A6F66]">Need an account?</span>
                  <Link
                    href="/auth/register"
                    className="block text-xs font-bold text-[#C8792C] hover:text-[#914E18] transition-colors"
                  >
                    Sign Up &rarr;
                  </Link>
                </div>
              </div>

              {/* Alert Message */}
              {error && (
                <div className="mt-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-shake">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {/* CLEAN SIMPLE LOGIN FORM */}
              <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2E1E13] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#A8927D]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E8DFD5] text-sm text-[#2E1E13] placeholder-[#A8927D] focus:outline-none focus:ring-2 focus:ring-[#C8792C]/20 focus:border-[#C8792C] transition-all bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#2E1E13]">
                      Password
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs font-semibold text-[#C8792C] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#A8927D]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-11 py-3 rounded-2xl border border-[#E8DFD5] text-sm text-[#2E1E13] placeholder-[#A8927D] focus:outline-none focus:ring-2 focus:ring-[#C8792C]/20 focus:border-[#C8792C] transition-all bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-[#A8927D] hover:text-[#5B4632] transition-colors p-0.5 cursor-pointer"
                      tabIndex={-1}
                      title={showPassword ? "Hide password" : "Show password"}
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
                  <label className="flex items-center gap-2 text-xs text-[#5B4632] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#CEBCAB] text-[#C8792C] focus:ring-[#C8792C] h-4 w-4"
                    />
                    <span className="font-medium">Remember this device</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full font-bold text-sm py-3.5 rounded-2xl shadow-md mt-2 bg-gradient-to-r from-[#C8792C] to-[#B2631F] text-white hover:brightness-105"
                  isLoading={isLoading}
                >
                  Sign In
                </Button>
              </form>
            </div>

            {/* Bottom Links */}
            <div className="pt-8 border-t border-[#E8DFD5] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#7A6F66]">
              <span>Protected by 256-bit SSL encryption</span>
              <div className="flex items-center gap-3">
                <Link href="/auth/register" className="text-[#C8792C] font-bold hover:underline sm:hidden">
                  Create account
                </Link>
                <Link href="/legal/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
