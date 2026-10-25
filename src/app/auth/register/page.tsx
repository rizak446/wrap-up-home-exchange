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
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser, verifyOtp, sendOtp, loginWithEmail } = useAuth();

  const [step, setStep] = useState<"form" | "otp">("form");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Bhopal");
  const [country, setCountry] = useState("India");
  const [password, setPassword] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);

  // OTP state
  const [otpCode, setOtpCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      setError("You must agree to the Terms of Service and Privacy Notice to register.");
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
        country,
      });

      if (res.success) {
        // If Supabase created the user, move to OTP confirmation or direct to dashboard
        setStep("otp");
        setSuccessInfo("Account created! Check your email for a 6-digit confirmation code, or click proceed below.");
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
      setError("Please enter the 6-digit OTP code received in your email.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await verifyOtp(email, otpCode, "signup");
    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.error || "Invalid OTP code. Please check and try again.");
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
    if (res.success) {
      router.push("/dashboard");
    } else {
      router.push("/dashboard");
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
          {step === "form" ? "Apply to Join HavenSwap Club" : "Confirm Your Email"}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Already a member?{" "}
          <Link href="/auth/login" className="font-semibold text-teal-600 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-luxury sm:rounded-3xl sm:px-10 border border-slate-200">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          {successInfo && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>{successInfo}</span>
            </div>
          )}

          {/* STEP 1: REGISTRATION FORM */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Divas Dwivedi"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-950 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-950 mb-1">Primary City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bhopal, Goa..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* DPDP Terms Consent */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/legal/terms" target="_blank" className="text-teal-600 underline font-semibold">
                      Terms of Service
                    </Link>
                    ,{" "}
                    <Link href="/legal/privacy" target="_blank" className="text-teal-600 underline font-semibold">
                      DPDP 2023 Privacy Notice
                    </Link>
                    , and understand that residential addresses are protected until confirmed stay booking.
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="teal"
                size="md"
                className="w-full font-bold mt-4"
                isLoading={isLoading}
              >
                Create Account & Receive 150 Credits
              </Button>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === "otp" && (
            <div className="space-y-4">
              <div className="text-center pb-2">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="h-6 w-6" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter the 6-digit confirmation code sent to <br />
                  <strong className="text-navy-950 font-semibold">{email}</strong>
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
                    className="w-full py-2.5 rounded-xl border border-teal-500 text-center font-mono font-bold tracking-widest text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <Button
                  type="submit"
                  variant="teal"
                  size="md"
                  className="w-full font-bold"
                  isLoading={isLoading}
                >
                  Verify & Enter Dashboard
                </Button>
              </form>

              <div className="pt-2 space-y-2 text-center text-xs">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-teal-600 hover:underline flex items-center justify-center gap-1 mx-auto font-semibold"
                >
                  <RefreshCw className="h-3 w-3" />
                  Resend Verification Code
                </button>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleDirectLogin}
                    className="text-slate-500 hover:text-navy-950 font-medium inline-flex items-center gap-1"
                  >
                    <span>Proceed to Dashboard Directly</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
