"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldAlert,
  Building,
  Users,
  Coins,
  History,
  Lock,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, loginAs } = useAuth();
  const router = useRouter();

  // If not admin, provide convenient switch or notice
  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col">
      {/* Admin Warning Bar */}
      <div className="bg-rose-900 text-rose-100 px-4 py-2 text-xs flex items-center justify-between font-semibold">
        <div className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-rose-300" />
          <span>Restricted Portal: Wrap-Up Trust & Safety Operations [Least Privilege Access]</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Logged in as: <strong>{currentUser?.full_name} ({currentUser?.role})</strong></span>
          {!isAdmin && (
            <button
              onClick={() => loginAs("user-admin-sarah")}
              className="px-2 py-0.5 rounded bg-rose-800 hover:bg-rose-700 text-white text-[11px] font-bold underline"
            >
              Switch to Sarah (Admin)
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-navy-950 font-serif">
                Platform Operations & Moderation Console
              </h1>
              <p className="text-xs text-slate-500">
                Audited property approvals, member verification queues, and credit ledger monitoring.
              </p>
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
