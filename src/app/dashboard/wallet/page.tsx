"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  ShieldCheck,
  Lock,
  Sparkles,
  Info,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditTransaction, CreditAccount } from "@/types";
import { formatCredits } from "@/lib/utils";

export default function CreditWalletPage() {
  const { currentUser, creditAccount, refreshCredits } = useAuth();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadWallet() {
      if (!currentUser) return;
      try {
        const res = await fetch(`/api/credits?userId=${currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setTransactions(data.transactions || []);
        }
      } catch (e) {
        console.error("Error loading wallet", e);
      } finally {
        setIsLoading(false);
      }
    }
    refreshCredits();
    loadWallet();
  }, [currentUser]);

  return (
    <div className="space-y-8 pb-16">
      {/* Wallet Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-navy-950 via-slate-900 to-teal-950 text-white shadow-luxury">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Double-Entry Platform Escrow
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif mt-1">
              Credit Wallet & Authoritative Ledger
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-teal-950/80 text-teal-300 border border-teal-500/30 px-3 py-1.5 rounded-full font-bold">
              Account ID: {creditAccount?.id || "ACC-MEMBER"}
            </span>
          </div>
        </div>

        {/* 4 Balance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="block text-[11px] text-teal-300 font-bold uppercase tracking-wider">
              Available to Spend
            </span>
            <span className="text-3xl font-extrabold font-serif text-white mt-1 block">
              {creditAccount?.available_balance ?? 0} pts
            </span>
            <span className="text-[10px] text-slate-400">Immediate booking power</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="block text-[11px] text-amber-300 font-bold uppercase tracking-wider">
              Held in Escrow
            </span>
            <span className="text-3xl font-extrabold font-serif text-white mt-1 block">
              {creditAccount?.reserved_balance ?? 0} pts
            </span>
            <span className="text-[10px] text-slate-400">Pending host confirmation</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="block text-[11px] text-emerald-300 font-bold uppercase tracking-wider">
              Lifetime Earned
            </span>
            <span className="text-3xl font-extrabold font-serif text-white mt-1 block">
              {creditAccount?.lifetime_earned ?? 0} pts
            </span>
            <span className="text-[10px] text-slate-400">From hosting & rewards</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="block text-[11px] text-slate-300 font-bold uppercase tracking-wider">
              Lifetime Spent
            </span>
            <span className="text-3xl font-extrabold font-serif text-white mt-1 block">
              {creditAccount?.lifetime_spent ?? 0} pts
            </span>
            <span className="text-[10px] text-slate-400">On fulfilled member stays</span>
          </div>
        </div>
      </div>

      {/* Rules Information Box */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3 leading-relaxed">
        <Info className="h-5 w-5 text-teal-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Double-Entry Ledger Integrity:</strong> Every credit movement is permanently logged in the authoritative ledger below. Credits are not ordinary editable user fields; balances are computed and guarded by atomic database constraints to prevent double-spending or unauthorized inflation.
        </div>
      </div>

      {/* Authoritative Ledger Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy-950 font-serif">
              Immutable Transaction Ledger
            </h2>
            <p className="text-xs text-slate-500">
              Showing authoritative audit trail of all rewards, escrow holds, and settlements.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-3">
            <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Reference & Code</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Description</th>
                  <th className="py-3.5 px-6 text-right">Credit Amount</th>
                  <th className="py-3.5 px-6 text-right">Balance After</th>
                  <th className="py-3.5 px-6 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => {
                  const isPositive = tx.amount > 0;
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-700">
                        {tx.reference_code}
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          variant={
                            tx.transaction_type === "hosting_reward"
                              ? "success"
                              : tx.transaction_type === "welcome_bonus"
                              ? "teal"
                              : tx.transaction_type === "booking_reservation"
                              ? "warning"
                              : "default"
                          }
                        >
                          {tx.transaction_type.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-slate-600 max-w-xs truncate">
                        {tx.description}
                      </td>
                      <td className="py-4 px-6 text-right font-extrabold">
                        <span
                          className={`inline-flex items-center gap-0.5 ${
                            isPositive ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownLeft className="h-3.5 w-3.5" />}
                          {isPositive ? `+${tx.amount}` : tx.amount} pts
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-navy-950">
                        {tx.balance_after} pts
                      </td>
                      <td className="py-4 px-6 text-right text-slate-400">
                        {new Date(tx.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
