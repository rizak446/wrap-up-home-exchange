"use client";

import React, { useState, useEffect } from "react";
import {
  Building,
  Users,
  Coins,
  ShieldCheck,
  Check,
  X,
  History,
  AlertCircle,
  Sparkles,
  Search,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Property, UserProfile, AuditLog, CreditTransaction } from "@/types";

export default function AdminDashboardPage() {
  const { currentUser, loginAs } = useAuth();
  const [activeTab, setActiveTab] = useState<"properties" | "users" | "credits" | "audit">("properties");

  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [allTransactions, setAllTransactions] = useState<CreditTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Credit Adjustment Form State
  const [adjustUserId, setAdjustUserId] = useState("user-traveler-arjun");
  const [adjustAmount, setAdjustAmount] = useState<number>(50);
  const [adjustReason, setAdjustReason] = useState("Promotional goodwill adjustment for community testing");
  const [isAdjusting, setIsAdjusting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [propsRes, credsRes] = await Promise.all([
        fetch("/api/properties"),
        fetch("/api/credits"),
      ]);

      if (propsRes.ok) {
        const data = await propsRes.json();
        setProperties(data.properties || []);
      }

      if (credsRes.ok) {
        const data = await credsRes.json();
        setAllTransactions(data.transactions || []);
      }

      // Initial demo users and audit logs
      const { INITIAL_USERS, INITIAL_AUDIT_LOGS } = await import("@/lib/data/mock-db");
      setUsers(INITIAL_USERS);
      setAuditLogs(INITIAL_AUDIT_LOGS);
    } catch (e) {
      console.error("Error loading admin data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePropertyDecision = async (propId: string, status: "published" | "rejected", reason: string) => {
    if (!currentUser) return;
    setActionMessage(null);

    try {
      const res = await fetch(`/api/properties/${propId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          adminId: currentUser.id,
          notes: reason,
        }),
      });

      if (res.ok) {
        setActionMessage(`Property status updated to: ${status}`);
        await loadData();
      }
    } catch (e: any) {
      setActionMessage(e.message || "Failed to update property status");
    }
  };

  const handleCreditAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsAdjusting(true);
    setActionMessage(null);

    try {
      const res = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: adjustUserId,
          amount: adjustAmount,
          reason: adjustReason,
          adminId: currentUser.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage(`Adjustment successful! New balance: ${data.newBalance} pts`);
        await loadData();
      } else {
        setActionMessage(data.error || "Failed to adjust balance");
      }
    } catch (err: any) {
      setActionMessage(err.message || "Network error");
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <div className="space-y-6">
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-teal-600 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Users</span>
          <span className="text-2xl font-bold text-navy-950 block mt-1">{users.length}</span>
          <span className="text-[11px] text-teal-700 font-semibold">100% ID-Vetted</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Listings</span>
          <span className="text-2xl font-bold text-navy-950 block mt-1">{properties.length}</span>
          <span className="text-[11px] text-slate-500">Bhopal, Goa, Jaipur, Bengaluru</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Ledger Volume</span>
          <span className="text-2xl font-bold text-navy-950 block mt-1">{allTransactions.length} txs</span>
          <span className="text-[11px] text-emerald-700 font-semibold">Double-entry verified</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Audit Logs</span>
          <span className="text-2xl font-bold text-navy-950 block mt-1">{auditLogs.length} events</span>
          <span className="text-[11px] text-rose-700 font-semibold">Security logged</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("properties")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "properties" ? "bg-navy-950 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          Property Moderation Queue
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "users" ? "bg-navy-950 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          User Registry & Roles
        </button>
        <button
          onClick={() => setActiveTab("credits")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "credits" ? "bg-navy-950 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          Credit Adjustments & Ledger
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "audit" ? "bg-navy-950 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          Security Audit Trail
        </button>
      </div>

      {/* TAB 1: PROPERTIES QUEUE */}
      {activeTab === "properties" && (
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-navy-950 text-sm">Listing Approvals & Verification</h3>
            <span className="text-xs text-slate-400">Reviewing proof of authority and photos</span>
          </div>

          <div className="divide-y divide-slate-100">
            {properties.map((p) => (
              <div key={p.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={p.images[0]?.image_url}
                    alt=""
                    className="h-16 w-24 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-navy-950 text-sm">{p.title}</h4>
                    <div className="text-xs text-slate-500">
                      {p.city}, {p.neighbourhood} • Host ID: {p.host_id}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {p.bedrooms} Bed • {p.bathrooms} Bath • {p.credits_per_night} pts/night
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={p.status === "published" ? "success" : "warning"}>
                    {p.status}
                  </Badge>

                  {p.status !== "published" ? (
                    <Button
                      variant="teal"
                      size="sm"
                      onClick={() => handlePropertyDecision(p.id, "published", "Documentation and photo authenticity verified.")}
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Approve & Publish
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-rose-600 border-rose-200 hover:bg-rose-50"
                      onClick={() => handlePropertyDecision(p.id, "rejected", "Administrative suspension for safety inspection.")}
                    >
                      Suspend Listing
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: USERS REGISTRY */}
      {activeTab === "users" && (
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-navy-950 text-sm">Registered Club Members</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-6">Member</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">City</th>
                  <th className="py-3 px-6">ID Status</th>
                  <th className="py-3 px-6">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-6 font-bold text-navy-950 flex items-center gap-2">
                      <img src={u.avatar_url || "https://placehold.co/100"} alt="" className="h-7 w-7 rounded-full object-cover" />
                      <span>{u.full_name}</span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500">{u.email}</td>
                    <td className="py-3.5 px-6 font-semibold">{u.city}</td>
                    <td className="py-3.5 px-6">
                      <Badge variant={u.identity_verified ? "success" : "warning"}>
                        {u.identity_verified ? "Verified" : "Unverified"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="font-mono uppercase text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AUDITED CREDIT ADJUSTMENT */}
      {activeTab === "credits" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 rounded-3xl bg-white p-6 border border-slate-200 shadow-subtle space-y-4">
            <h3 className="font-bold text-navy-950 text-base">Authorized Credit Adjustment</h3>
            <p className="text-xs text-slate-500">
              Administrative adjustments require a mandatory justification and are logged permanently to the security audit trail.
            </p>

            <form onSubmit={handleCreditAdjustment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Target Member</label>
                <select
                  value={adjustUserId}
                  onChange={(e) => setAdjustUserId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name} ({u.city}) — {u.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Credit Amount Adjustment (+ / -)
                </label>
                <input
                  type="number"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Mandatory Audit Justification
                </label>
                <textarea
                  required
                  rows={3}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Compensation for resolved air conditioning defect in booking #..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <Button type="submit" variant="teal" size="md" className="w-full font-bold" isLoading={isAdjusting}>
                Post Audited Adjustment
              </Button>
            </form>
          </div>

          <div className="md:col-span-7 rounded-3xl bg-white border border-slate-200 shadow-subtle overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-xs text-navy-950">
              Recent System Credit Transactions
            </div>
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 text-xs">
              {allTransactions.slice(0, 10).map((tx) => (
                <div key={tx.id} className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-navy-950">{tx.description}</span>
                    <div className="text-[10px] text-slate-400 font-mono">{tx.reference_code}</div>
                  </div>
                  <span className={`font-extrabold ${tx.amount > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL */}
      {activeTab === "audit" && (
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-navy-950 text-sm">Security & Administrative Audit Log</h3>
            <span className="text-xs text-slate-400">Immutable ledger events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-6">Actor</th>
                  <th className="py-3 px-6">Action</th>
                  <th className="py-3 px-6">Target Entity</th>
                  <th className="py-3 px-6">Details</th>
                  <th className="py-3 px-6 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-6 font-bold text-navy-950">
                      {log.actor_name || "System"}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">{log.target_entity} ({log.target_id})</td>
                    <td className="py-3.5 px-6 text-slate-500 max-w-xs truncate">
                      {JSON.stringify(log.metadata || {})}
                    </td>
                    <td className="py-3.5 px-6 text-right text-slate-400">
                      {new Date(log.created_at).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
