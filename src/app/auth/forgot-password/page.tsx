"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
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
          Reset Your Password
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your registered email address to receive password reset instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-luxury sm:rounded-3xl sm:px-10 border border-slate-200">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-navy-950 text-base">Reset Link Dispatched</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                If an account exists for <strong>{email}</strong>, you will receive a secure password reset link shortly.
              </p>
              <div className="pt-4">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <Button type="submit" variant="teal" size="md" className="w-full font-bold">
                Send Reset Link
              </Button>

              <div className="pt-2 text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-navy-950 font-semibold"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
