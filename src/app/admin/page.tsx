"use client";

import React, { useState, useEffect } from "react";
import { UserAvatar } from "@/components/ui/avatar";
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
  FileCheck,
  FileText,
  Clock,
  ExternalLink,
  UserCheck,
  CalendarCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Property, UserProfile, AuditLog, CreditTransaction, Booking } from "@/types";

export default function AdminDashboardPage() {
  const { currentUser, loginAs } = useAuth();
  const [activeTab, setActiveTab] = useState<"properties" | "bookings" | "users" | "credits" | "audit">("properties");

  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [allTransactions, setAllTransactions] = useState<CreditTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Credit Adjustment Form State
  const [adjustUserId, setAdjustUserId] = useState("");
  const [adjustAmount, setAdjustAmount] = useState<number>(50);
  const [adjustReason, setAdjustReason] = useState("Promotional goodwill adjustment for community testing");
  const [isAdjusting, setIsAdjusting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [propsRes, credsRes, usersRes, bookingsRes] = await Promise.all([
        fetch("/api/properties?admin=true"),
        fetch("/api/credits"),
        fetch("/api/users"),
        fetch("/api/bookings"),
      ]);

      if (propsRes.ok) {
        const data = await propsRes.json();
        setProperties(data.properties || []);
      }

      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        setBookings(data.bookings || []);
      }

      if (credsRes.ok) {
        const data = await credsRes.json();
        setAllTransactions(data.transactions || []);
      }

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users || []);
        if (data.users && data.users.length > 0 && !adjustUserId) {
          setAdjustUserId(data.users[0].id);
        }
      }

      // Initial audit logs
      const { INITIAL_AUDIT_LOGS } = await import("@/lib/data/mock-db");
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
        setActionMessage(
          status === "published"
            ? "✓ Property approved! Host verified and listing is now live on Wrap-Up."
            : "Listing rejected and host notified."
        );
        await loadData();
      }
    } catch (e: any) {
      setActionMessage(e.message || "Failed to update property status");
    }
  };

  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "host" ? "member" : "host";
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          role: newRole,
          adminId: currentUser?.id || "admin",
        }),
      });
      if (res.ok) {
        setActionMessage(`User role successfully updated to: ${newRole}`);
        await loadData();
      }
    } catch (e: any) {
      setActionMessage(e.message || "Failed to update role");
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

  const handleBookingDecision = async (booking: Booking, decision: "accept" | "decline") => {
    setActionMessage(null);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "respond",
          hostId: booking.host_id,
          decision,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage(
          decision === "accept"
            ? `✓ Booking for "${booking.property?.title || 'Home'}" accepted & confirmed live!`
            : `✕ Booking declined & escrow credits returned to guest.`
        );
        await loadData();
      } else {
        setActionMessage(data.error || "Failed to process booking");
      }
    } catch (e: any) {
      setActionMessage(e.message || "Failed to process booking");
    }
  };

  const handleSettleBooking = async (bookingId: string) => {
    setActionMessage(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "settle" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage(`✓ Stay completed! ${data.hostEarned} credits transferred to host.`);
        await loadData();
      } else {
        setActionMessage(data.error || "Failed to settle stay");
      }
    } catch (e: any) {
      setActionMessage(e.message || "Failed to settle stay");
    }
  };

  const pendingProperties = properties.filter((p) => p.status === "pending_review");
  const publishedProperties = properties.filter((p) => p.status !== "pending_review");

  return (
    <div className="space-y-6">
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-teal-50 border-2 border-teal-300 text-teal-950 text-xs font-bold flex items-center gap-2 shadow-xs">
          <Sparkles className="h-4 w-4 text-teal-600 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Users</span>
          <span className="text-2xl font-bold text-navy-950 block mt-1">{users.length}</span>
          <span className="text-[11px] text-teal-700 font-semibold">Live Supabase Database</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Approvals</span>
          <span className="text-2xl font-bold text-amber-600 block mt-1">{pendingProperties.length}</span>
          <span className="text-[11px] text-amber-700 font-semibold">Awaiting Verification Review</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Listings</span>
          <span className="text-2xl font-bold text-navy-950 block mt-1">{properties.length}</span>
          <span className="text-[11px] text-slate-500">Live & Moderation Queue</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ledger Volume</span>
          <span className="text-2xl font-bold text-navy-950 block mt-1">{allTransactions.length} txs</span>
          <span className="text-[11px] text-emerald-700 font-semibold">Credits Exchange</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("properties")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "properties" ? "bg-navy-950 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Building className="h-3.5 w-3.5" />
          <span>Property Moderation Queue</span>
          {pendingProperties.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center ml-1">
              {pendingProperties.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "bookings" ? "bg-navy-950 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <CalendarCheck className="h-3.5 w-3.5" />
          <span>Bookings Moderation ({bookings.length})</span>
          {bookings.filter((b) => b.status === "requested").length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ml-1">
              {bookings.filter((b) => b.status === "requested").length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "users" ? "bg-navy-950 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>User Registry & Roles ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("credits")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "credits" ? "bg-navy-950 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Coins className="h-3.5 w-3.5" />
          <span>Credit Ledger</span>
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "audit" ? "bg-navy-950 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <History className="h-3.5 w-3.5" />
          <span>Security Audit</span>
        </button>
      </div>

      {/* TAB 1: PROPERTIES MODERATION QUEUE */}
      {activeTab === "properties" && (
        <div className="space-y-6">
          {/* Section A: Pending Review Homes */}
          {pendingProperties.length > 0 && (
            <div className="rounded-3xl bg-amber-50/50 border-2 border-amber-300 shadow-luxury overflow-hidden">
              <div className="p-5 bg-amber-100/70 border-b border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-700 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-navy-950 text-sm">
                      ⚡ Pending Host Applications ({pendingProperties.length} Listings)
                    </h3>
                    <p className="text-xs text-amber-800">
                      Review ownership proof and photos before approving live host status.
                    </p>
                  </div>
                </div>
                <Badge variant="warning" className="text-xs font-bold uppercase py-0.5">
                  Action Required
                </Badge>
              </div>

              <div className="divide-y divide-amber-200/60 p-4 space-y-4">
                {pendingProperties.map((p) => {
                  const proofDoc = p.verifications?.[0]?.proof_ref || "Property Ownership / Utility Bill attached";
                  const docType = p.verifications?.[0]?.verification_type || "utility_bill";

                  return (
                    <div
                      key={p.id}
                      className="p-5 rounded-2xl bg-white border border-amber-200/90 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-4 flex-1 min-w-0">
                        <img
                          src={p.images?.[0]?.image_url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600"}
                          alt=""
                          className="h-28 w-40 rounded-2xl object-cover bg-slate-100 flex-shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="warning" className="text-[10px] font-bold">
                              🟡 Pending Review
                            </Badge>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-teal-800 font-bold">
                              {p.credits_per_night} points/night
                            </span>
                          </div>

                          <h4 className="font-bold text-navy-950 text-base leading-snug">
                            {p.title}
                          </h4>

                          <p className="text-xs text-slate-500">
                            📍 {p.exact_address ? `${p.exact_address}, ` : ""}{p.city}, {p.state}
                          </p>

                          <div className="text-xs text-slate-600 font-medium">
                            {p.bedrooms} Beds • {p.bathrooms} Baths • Max {p.max_guests} Guests • {p.images?.length || 1} Photos
                          </div>

                          {/* Host Identity Card */}
                          <div className="flex items-center gap-2 pt-1">
                            <UserAvatar src={p.host?.avatar_url} name={p.host?.full_name} size="sm" />
                            <div className="text-xs">
                              <span className="font-bold text-navy-950 block">
                                Host: {p.host?.full_name || "Applicant Host"}
                              </span>
                              <span className="text-slate-400 text-[11px]">
                                {p.host?.email || `Host ID: ${p.host_id}`}
                              </span>
                            </div>
                          </div>

                          {/* Attached Document Card */}
                          <div className="mt-2 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs flex items-center gap-2.5">
                            <FileCheck className="h-5 w-5 text-emerald-700 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-emerald-950 truncate block">
                                  {proofDoc}
                                </span>
                                <Badge variant="success" className="text-[9px] py-0 px-1.5 flex-shrink-0">
                                  Proof Attached
                                </Badge>
                              </div>
                              <span className="text-[11px] text-emerald-700 block">
                                Type: {docType.toUpperCase().replace("_", " ")} • Awaiting Trust Officer Verification
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex sm:flex-col items-center gap-2.5 w-full sm:w-auto flex-shrink-0 pt-2 sm:pt-0">
                        <Button
                          variant="teal"
                          size="md"
                          className="w-full sm:w-44 font-bold shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() =>
                            handlePropertyDecision(
                              p.id,
                              "published",
                              "Documentation and photo authenticity verified by Trust Officer."
                            )
                          }
                        >
                          <Check className="h-4 w-4 mr-1.5" />
                          Approve & Publish Live
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-44 text-rose-600 border-rose-300 hover:bg-rose-50 font-bold"
                          onClick={() =>
                            handlePropertyDecision(
                              p.id,
                              "rejected",
                              "Ownership proof document needs clearer photograph or re-upload."
                            )
                          }
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Request Re-upload
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section B: Published & Live Listings */}
          <div className="rounded-3xl bg-white border border-slate-200/80 shadow-subtle overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-navy-950 text-sm">
                  🟢 Live Active Listings ({publishedProperties.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Properties currently visible and bookable by members on the platform.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {publishedProperties.map((p) => (
                <div key={p.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <img
                      src={p.images?.[0]?.image_url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400"}
                      alt=""
                      className="h-16 w-24 rounded-xl object-cover bg-slate-100 flex-shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-navy-950 text-sm truncate">{p.title}</h4>
                        <Badge variant="success" className="text-[10px]">
                          Live
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {p.city}, {p.neighbourhood || p.state} • {p.credits_per_night} pts/night
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Host: {p.host?.full_name || p.host_id}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-rose-600 border-rose-200 hover:bg-rose-50"
                      onClick={() => handlePropertyDecision(p.id, "rejected", "Administrative suspension for safety inspection.")}
                    >
                      Suspend Listing
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: BOOKINGS & STAYS MODERATION */}
      {activeTab === "bookings" && (
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-navy-950 text-sm">Community Bookings & Stays</h3>
              <p className="text-xs text-slate-400">Review stay requests, confirm reservations, or settle escrow points</p>
            </div>
            <Badge variant="teal" className="text-xs py-1">
              {bookings.length} Total Reservations
            </Badge>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No booking reservations recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-5">Guest</th>
                    <th className="py-3 px-5">Host & Home</th>
                    <th className="py-3 px-5">Dates</th>
                    <th className="py-3 px-5">Credits</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <UserAvatar src={b.guest?.avatar_url} name={b.guest?.full_name} size="sm" />
                          <div>
                            <div className="font-bold text-navy-950">{b.guest?.full_name || "Guest Member"}</div>
                            <div className="text-[10px] text-slate-400">{b.guest?.email || "guest@havenswap.com"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-navy-950">{b.property?.title || "Property"}</div>
                        <div className="text-[10px] text-slate-500">Host: {b.host?.full_name || "Nancy"} ({b.property?.city || "India"})</div>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-700">{b.check_in} &rarr; {b.check_out}</div>
                        <div className="text-[10px] text-slate-400">{b.nights} nights • {b.guest_count} guests</div>
                      </td>
                      <td className="py-3.5 px-5 font-black text-teal-700">
                        {b.total_credits} pts
                      </td>
                      <td className="py-3.5 px-5">
                        <Badge
                          variant={
                            ["accepted", "confirmed"].includes(b.status)
                              ? "success"
                              : b.status === "requested"
                              ? "warning"
                              : b.status === "completed"
                              ? "teal"
                              : "default"
                          }
                        >
                          {b.status === "accepted" ? "Accepted" : b.status === "confirmed" ? "Confirmed" : b.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        {b.status === "requested" && (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="teal"
                              size="sm"
                              className="text-xs py-1 px-2.5 h-auto"
                              onClick={() => handleBookingDecision(b, "accept")}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Accept Stay
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs py-1 px-2.5 h-auto text-rose-600 border-rose-200 hover:bg-rose-50"
                              onClick={() => handleBookingDecision(b, "decline")}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Decline
                            </Button>
                          </div>
                        )}
                        {["accepted", "confirmed"].includes(b.status) && (
                          <Button
                            variant="teal"
                            size="sm"
                            className="text-xs py-1 px-2.5 h-auto"
                            onClick={() => handleSettleBooking(b.id)}
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            Settle Credits
                          </Button>
                        )}
                        {b.status === "completed" && (
                          <span className="text-[10px] font-bold text-emerald-700">✓ Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: USERS REGISTRY */}
      {activeTab === "users" && (
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-navy-950 text-sm">Registered Platform Members</h3>
              <p className="text-xs text-slate-400">Live profiles registered in Supabase database</p>
            </div>
            <Badge variant="teal" className="text-xs py-1">
              {users.length} Total Registered
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-6">Member</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">City</th>
                  <th className="py-3 px-6">ID Status</th>
                  <th className="py-3 px-6">Current Role</th>
                  <th className="py-3 px-6 text-right">Role Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-navy-950 flex items-center gap-2.5">
                      <UserAvatar src={u.avatar_url} name={u.full_name} size="sm" />
                      <span>{u.full_name || "Member"}</span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500">{u.email}</td>
                    <td className="py-3.5 px-6 font-semibold">{u.city || "India"}</td>
                    <td className="py-3.5 px-6">
                      <Badge variant={u.identity_verified ? "success" : "warning"}>
                        {u.identity_verified ? "Verified" : "Pending ID"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`font-mono uppercase text-[10px] font-bold px-2 py-0.5 rounded ${
                          u.role === "host"
                            ? "bg-teal-100 text-teal-800"
                            : u.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleUserRole(u.id, u.role)}
                        className="text-[11px] font-bold text-teal-700 hover:text-teal-950 underline cursor-pointer"
                      >
                        {u.role === "host" ? "Switch to Member" : "Promote to Host"}
                      </button>
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
