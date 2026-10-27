"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Coins,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const POPULAR_CITIES = ["Bhopal", "Goa", "Jaipur", "Bengaluru", "Mumbai", "Delhi"];

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useAuth();

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Bhopal");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedTerms) {
      setError("Please accept the Terms of Service and Privacy Notice to proceed.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await registerUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        city: city.trim(),
        country: "India",
      });

      if (res.success) {
        // Direct redirect to dashboard with 150 welcome credits
        router.push("/dashboard");
      } else {
        setError(res.error || "Failed to create account. Please check your details.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center py-8">
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-[#FFFDF9] rounded-3xl shadow-luxury border border-[#E8DFD5] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
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

            {/* Welcome Perk & Features */}
            <div className="relative z-10 space-y-4 my-8">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#3A281A] to-[#261A10] border border-[#F4D9A0]/30 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[#F4D9A0] text-xs font-bold uppercase tracking-wider mb-1.5">
                  <Coins className="h-4 w-4 text-[#C8792C]" />
                  <span>Welcome Membership Perk</span>
                </div>
                <div className="text-2xl font-black text-[#FAF5EA] font-serif">
                  150 Free Stay Credits
                </div>
                <p className="mt-1 text-xs text-[#CEBCAB] leading-relaxed">
                  Automatically credited to your wallet to redeem for stays in Goa, Jaipur, Bhopal, or Bengaluru.
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 text-[#CEBCAB]">
                  <div className="h-6 w-6 rounded-full bg-[#C8792C]/20 text-[#F4D9A0] font-bold flex items-center justify-center flex-shrink-0 text-[11px] border border-[#C8792C]/30">
                    1
                  </div>
                  <span>Create your verified profile in 1 minute</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#CEBCAB]">
                  <div className="h-6 w-6 rounded-full bg-[#C8792C]/20 text-[#F4D9A0] font-bold flex items-center justify-center flex-shrink-0 text-[11px] border border-[#C8792C]/30">
                    2
                  </div>
                  <span>Host travelers or travel using stay credits</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#CEBCAB]">
                  <div className="h-6 w-6 rounded-full bg-[#C8792C]/20 text-[#F4D9A0] font-bold flex items-center justify-center flex-shrink-0 text-[11px] border border-[#C8792C]/30">
                    3
                  </div>
                  <span>Enjoy private residences without hotel fees</span>
                </div>
              </div>
            </div>

            {/* Trust Footer */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-[#CEBCAB]">
              <ShieldCheck className="h-4 w-4 text-[#C8792C] flex-shrink-0" />
              <span>Compliant with India DPDP Act 2023 & ID verification</span>
            </div>
          </div>

          {/* RIGHT COLUMN: CLEAN PROFESSIONAL SIGN UP */}
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
              <Link href="/auth/login" className="text-xs font-bold text-[#C8792C] hover:underline">
                Sign In &rarr;
              </Link>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E1E13] font-serif tracking-tight">
                    Create Your Account
                  </h1>
                  <p className="mt-1 text-xs text-[#7A6F66]">
                    Get started with 150 welcome credits and explore verified homes.
                  </p>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-xs text-[#7A6F66]">Already a member?</span>
                  <Link
                    href="/auth/login"
                    className="block text-xs font-bold text-[#C8792C] hover:text-[#914E18] transition-colors"
                  >
                    Sign In &rarr;
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

              {/* CLEAN SIMPLE SIGN UP FORM */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-[#2E1E13] mb-1.5">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-[#A8927D]" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Divas Dwivedi"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E8DFD5] text-sm text-[#2E1E13] placeholder-[#A8927D] focus:outline-none focus:ring-2 focus:ring-[#C8792C]/20 focus:border-[#C8792C] transition-all bg-white"
                    />
                  </div>
                </div>

                {/* Email Address */}
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

                {/* Phone & City Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#2E1E13] mb-1.5">
                      Phone Number <span className="text-[#A8927D] font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-[#A8927D]" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E8DFD5] text-sm text-[#2E1E13] placeholder-[#A8927D] focus:outline-none focus:ring-2 focus:ring-[#C8792C]/20 focus:border-[#C8792C] transition-all bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2E1E13] mb-1.5">
                      Primary City
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-[#A8927D]" />
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bhopal"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E8DFD5] text-sm text-[#2E1E13] placeholder-[#A8927D] focus:outline-none focus:ring-2 focus:ring-[#C8792C]/20 focus:border-[#C8792C] transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Popular City Quick-Select */}
                <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-[#7A6F66] pt-0.5">
                  <span className="font-semibold text-[#A8927D]">Popular:</span>
                  {POPULAR_CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCity(c)}
                      className={`px-2 py-0.5 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${
                        city.toLowerCase() === c.toLowerCase()
                          ? "bg-[#FAF5EA] text-[#C8792C] border-[#F4D9A0]"
                          : "bg-[#FFFDF9] text-[#5B4632] border-[#E8DFD5] hover:bg-[#F4EFE9]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Password with Eye Toggle */}
                <div>
                  <label className="block text-xs font-bold text-[#2E1E13] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#A8927D]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password (min. 8 characters)"
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

                {/* Terms Consent */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 text-xs text-[#5B4632] cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-0.5 rounded border-[#CEBCAB] text-[#C8792C] focus:ring-[#C8792C] h-4 w-4"
                    />
                    <span className="leading-relaxed">
                      I agree to the{" "}
                      <Link href="/legal/terms" target="_blank" className="text-[#C8792C] font-bold underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/legal/privacy" target="_blank" className="text-[#C8792C] font-bold underline">
                        Privacy Notice
                      </Link>
                      .
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full font-bold text-sm py-3.5 rounded-2xl shadow-md mt-2 bg-gradient-to-r from-[#C8792C] to-[#B2631F] text-white hover:brightness-105"
                  isLoading={isLoading}
                >
                  Create Account & Get 150 Credits
                </Button>
              </form>
            </div>

            {/* Bottom Links */}
            <div className="pt-8 border-t border-[#E8DFD5] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#7A6F66]">
              <span>Protected by 256-bit SSL encryption</span>
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="text-[#C8792C] font-bold hover:underline sm:hidden">
                  Sign in
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
