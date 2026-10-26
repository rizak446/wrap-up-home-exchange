"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Coins,
  Home,
  Calendar,
  Compass,
  ShieldCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Booking, Property, CreditTransaction } from "@/types";

export default function DashboardOverviewPage() {
  const { currentUser, creditAccount } = useAuth();
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [hostingBookings, setHostingBookings] = useState<Booking[]>([]);
  const [tripBookings, setTripBookings] = useState<Booking[]>([]);
  const [recentTx, setRecentTx] = useState<CreditTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!currentUser) return;
      try {
        const [propsRes, hostRes, tripRes, credRes] = await Promise.all([
          fetch(`/api/properties`),
          fetch(`/api/bookings?hostId=${currentUser.id}`),
          fetch(`/api/bookings?guestId=${currentUser.id}`),
          fetch(`/api/credits?userId=${currentUser.id}`),
        ]);

        if (propsRes.ok) {
          const data = await propsRes.json();
          // Filter to properties belonging to current user
          setMyProperties((data.properties || []).filter((p: Property) => p.host_id === currentUser.id));
        }

        if (hostRes.ok) {
          const data = await hostRes.json();
          setHostingBookings(data.bookings || []);
        }

        if (tripRes.ok) {
          const data = await tripRes.json();
          setTripBookings(data.bookings || []);
        }

        if (credRes.ok) {
          const data = await credRes.json();
          setRecentTx(data.transactions?.slice(0, 5) || []);
        }
      } catch (e) {
        console.error("Dashboard data load error", e);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [currentUser]);

  const pendingHostingRequests = hostingBookings.filter((b) => b.status === "requested");
  const upcomingTrips = tripBookings.filter((b) => ["requested", "confirmed"].includes(b.status));

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-slate-900 to-teal-950 text-white shadow-luxury flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-teal-400">Member Space</span>
            {currentUser?.identity_verified && (
              <Badge variant="teal" className="bg-teal-900/60 text-teal-300 border-teal-500/30">
                <ShieldCheck className="h-3 w-3 mr-1" /> Verified Member
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Welcome back, {currentUser?.full_name?.split(" ")[0]}!
          </h1>
          <p className="mt-1 text-xs text-slate-300 max-w-lg">
            Based in <strong>{currentUser?.city}</strong>. Ready to host verified travelers or explore curated stays across Goa, Jaipur, and Bengaluru.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/add-home">
            <Button variant="teal" size="md">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              List New Home
            </Button>
          </Link>
          <Link href="/homes">
            <Button variant="outline" size="md" className="border-slate-700 text-white hover:bg-white/10">
              Explore Homes
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Credits */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Available Credits</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-navy-950 font-serif">
              {creditAccount?.available_balance ?? 0}
            </span>
            <span className="text-xs text-slate-400 ml-1">pts</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Escrow hold: {creditAccount?.reserved_balance ?? 0} pts</span>
            <Link href="/dashboard/wallet" className="text-teal-600 font-bold hover:underline">
              Ledger &rarr;
            </Link>
          </div>
        </div>

        {/* Active Listings */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Your Properties</span>
            <div className="p-2 rounded-xl bg-slate-100 text-navy-950">
              <Home className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-navy-950 font-serif">
              {myProperties.length}
            </span>
            <span className="text-xs text-slate-400 ml-1">homes</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Published & verified</span>
            <Link href="/dashboard/my-homes" className="text-teal-600 font-bold hover:underline">
              Manage &rarr;
            </Link>
          </div>
        </div>

        {/* Pending Hosting Requests */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Pending Requests</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-navy-950 font-serif">
              {pendingHostingRequests.length}
            </span>
            <span className="text-xs text-slate-400 ml-1">requests</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Awaiting your approval</span>
            <Link href="/dashboard/hosting" className="text-teal-600 font-bold hover:underline">
              Review &rarr;
            </Link>
          </div>
        </div>

        {/* Upcoming Trips */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Your Trips</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <Compass className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-navy-950 font-serif">
              {upcomingTrips.length}
            </span>
            <span className="text-xs text-slate-400 ml-1">trips</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Confirmed or requested</span>
            <Link href="/dashboard/trips" className="text-teal-600 font-bold hover:underline">
              View &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Main 2-Column Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1: Hosting Requests & Action Items */}
        <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-navy-950 text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal-600" />
              <span>Hosting Activity</span>
            </h3>
            <Link href="/dashboard/hosting" className="text-xs text-teal-600 font-bold hover:underline">
              All Hosting &rarr;
            </Link>
          </div>

          {hostingBookings.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              <p>No hosting requests currently pending.</p>
              <Link href="/dashboard/add-home" className="mt-3 inline-block font-semibold text-teal-600">
                + List your property to start receiving requests
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {hostingBookings.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-navy-950">{b.guest?.full_name || "Guest Member"}</div>
                    <div className="text-[11px] text-slate-500">
                      {b.check_in} to {b.check_out} ({b.nights} nights)
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-teal-700">{b.total_credits} pts</span>
                    <Badge variant={b.status === "requested" ? "warning" : b.status === "confirmed" ? "success" : "default"}>
                      {b.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Recent Credit Wallet Ledger Transactions */}
        <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-navy-950 text-base flex items-center gap-2">
              <Coins className="h-4 w-4 text-teal-600" />
              <span>Recent Credit Ledger Activity</span>
            </h3>
            <Link href="/dashboard/wallet" className="text-xs text-teal-600 font-bold hover:underline">
              Full Ledger &rarr;
            </Link>
          </div>

          {recentTx.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              <p>No recent transactions recorded.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTx.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs"
                >
                  <div className="overflow-hidden pr-2">
                    <div className="font-semibold text-navy-950 truncate">{tx.description}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{tx.reference_code}</div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span
                      className={`font-black ${
                        tx.amount > 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount} pts
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      Balance: {tx.balance_after}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
