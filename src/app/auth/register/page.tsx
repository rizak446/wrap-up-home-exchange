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
  CheckCircle2,
  KeyRound,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Coins,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const QUICK_CITIES = ["Bhopal", "Goa", "Jaipur", "Bengaluru", "Mumbai", "Delhi"];

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser, verifyOtp, sendOtp, loginWithEmail } = useAuth();

  const [step, setStep] = useState<"form" | "otp">("form");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Bhopal");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  // OTP state
  const [otpCode, setOtpCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

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
        fullName,
        email,
        password,
        phone,
        city,
        country: "India",
      });

      if (res.success) {
        setStep("otp");
        setSuccessInfo("Account registered! A 6-digit confirmation code was sent to your email.");
        setIsLoading(false);
      } else {
        setError(res.error || "Failed to create account. Please check your details.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      setError("Please enter the 6-digit verification code from your email.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await verifyOtp(email, otpCode, "signup");
    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.error || "Invalid verification code. Please check and try again.");
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError(null);
    const res = await sendOtp(email);
    setIsLoading(false);
    if (res.success) {
      setSuccessInfo("A new 6-digit code has been dispatched to your email!");
    } else {
      setError(res.error || "Unable to resend OTP. You can proceed directly using your password.");
    }
  };

  const handleDirectLogin = async () => {
    setIsLoading(true);
    const res = await loginWithEmail(email, password);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8">
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl shadow-luxury border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
          {/* LEFT COLUMN: BRAND HERO (DESKTOP) */}
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
                Join India’s premier home exchange community. Host travelers, earn stay credits, and unlock verified homes with zero hotel markups.
              </p>
            </div>

            {/* Middle Welcome Incentive & Steps */}
            <div className="relative z-10 space-y-4 my-8">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/70 to-slate-900/80 border border-teal-500/30 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <Coins className="h-4 w-4 text-teal-400" />
                  <span>Welcome Membership Perk</span>
                </div>
                <div className="text-2xl font-black text-white font-serif">
                  150 Free Stay Credits
                </div>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Automatically deposited into your wallet upon ID verification. Redeemable for stays in Goa, Jaipur, Bhopal, or Bengaluru immediately.
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <div className="h-6 w-6 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                    1
                  </div>
                  <span>Create your verified profile in under 2 minutes</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <div className="h-6 w-6 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                    2
                  </div>
                  <span>Optional: list your home to earn continuous hosting credits</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <div className="h-6 w-6 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                    3
                  </div>
                  <span>Book private residences without paying expensive hotel bills</span>
                </div>
              </div>
            </div>

            {/* Bottom Compliance & Trust */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="h-4 w-4 text-teal-400 flex-shrink-0" />
              <span>Full compliance with India DPDP Act 2023 & bank-grade data security</span>
            </div>
          </div>

          {/* RIGHT COLUMN: REGISTRATION FORM */}
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
              <Link href="/auth/login" className="text-xs font-bold text-teal-700 hover:underline">
                Sign In &rarr;
              </Link>
            </div>

            <div>
              {/* Desktop Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-serif tracking-tight">
                    {step === "form" ? "Create Your Account" : "Confirm Email"}
                  </h1>
                  <p className="mt-1 text-xs text-slate-500">
                    {step === "form"
                      ? "Get started with 150 complimentary credits upon verification."
                      : "Enter the code sent to your email to activate your account."}
                  </p>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-xs text-slate-500">Already a member?</span>
                  <Link
                    href="/auth/login"
                    className="block text-xs font-bold text-teal-600 hover:text-teal-800 transition-colors"
                  >
                    Sign In here
                  </Link>
                </div>
              </div>

              {/* Alerts */}
              {error && (
                <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-shake">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {successInfo && (
                <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium">{successInfo}</span>
                </div>
              )}

              {/* STEP 1: FORM */}
              {step === "form" && (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-navy-950 mb-1.5">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Divas Dwivedi"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white"
                      />
                    </div>
                  </div>

                  {/* Email */}
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

                  {/* Phone & City Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-navy-950 mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-950 mb-1.5">
                        Primary City
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Bhopal, Goa"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 text-sm text-navy-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick City Suggestions */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-500 pt-0.5">
                    <span className="font-semibold text-slate-400">Popular:</span>
                    {QUICK_CITIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCity(c)}
                        className={`px-2 py-0.5 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${
                          city === c
                            ? "bg-teal-50 text-teal-800 border-teal-300"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  {/* Password with Eye Toggle */}
                  <div>
                    <label className="block text-xs font-bold text-navy-950 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a secure password (min. 8 characters)"
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

                  {/* Terms & Privacy Consent */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                      />
                      <span className="leading-relaxed">
                        I agree to HavenSwap’s{" "}
                        <Link href="/legal/terms" target="_blank" className="text-teal-600 font-bold underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/legal/privacy" target="_blank" className="text-teal-600 font-bold underline">
                          DPDP 2023 Privacy Notice
                        </Link>
                        . I understand addresses are shielded until reservation confirmation.
                      </span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    variant="teal"
                    size="lg"
                    className="w-full font-bold text-sm py-3 rounded-2xl shadow-md mt-2"
                    isLoading={isLoading}
                  >
                    Create Account & Get 150 Credits
                  </Button>
                </form>
              )}

              {/* STEP 2: OTP VERIFICATION */}
              {step === "otp" && (
                <div className="mt-6 space-y-4">
                  <div className="text-center p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
                    <div className="w-12 h-12 rounded-2xl bg-white text-teal-700 flex items-center justify-center mx-auto mb-2 shadow-xs border border-teal-100">
                      <KeyRound className="h-6 w-6" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Please enter the 6-digit confirmation code sent to <br />
                      <strong className="text-navy-950 font-bold text-sm">{email}</strong>
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="123456"
                        className="w-full py-3 rounded-2xl border border-teal-500 text-center font-mono font-bold tracking-widest text-xl text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-xs"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="teal"
                      size="lg"
                      className="w-full font-bold text-sm py-3 rounded-2xl shadow-md"
                      isLoading={isLoading}
                    >
                      Verify & Activate Account
                    </Button>
                  </form>

                  <div className="pt-2 space-y-3 text-center text-xs">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-teal-600 hover:underline flex items-center justify-center gap-1 mx-auto font-bold cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Resend Verification Code
                    </button>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleDirectLogin}
                        className="text-slate-600 hover:text-navy-950 font-bold inline-flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors"
                      >
                        <span>Proceed Directly to Dashboard</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Link */}
            <div className="pt-8 border-t border-slate-100 text-center text-xs text-slate-500">
              <span>By creating an account, you join a verified home exchange network.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
