"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Check,
  X,
  Coins,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Booking } from "@/types";

export default function HostingPage() {
  const { currentUser, refreshCredits } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/bookings?hostId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (e) {
      console.error("Error fetching hosting requests", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentUser]);

  const handleDecision = async (bookingId: string, decision: "accept" | "decline") => {
    if (!currentUser) return;
    setActionLoadingId(bookingId);
    setMessage(null);

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "respond",
          hostId: currentUser.id,
          decision,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(
          decision === "accept"
            ? "Stay request accepted! The guest can now view arrival instructions."
            : "Stay request declined. Reserved credits have been safely refunded to the guest."
        );
        await fetchBookings();
        await refreshCredits();
      } else {
        setMessage(data.error || "Failed to process decision");
      }
    } catch (err: any) {
      setMessage(err.message || "Network error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSettle = async (bookingId: string) => {
    setActionLoadingId(bookingId);
    setMessage(null);

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "settle" }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(`Stay completed! ${data.hostEarned} credits transferred to your wallet.`);
        await fetchBookings();
        await refreshCredits();
      } else {
        setMessage(data.error || "Failed to settle stay");
      }
    } catch (err: any) {
      setMessage(err.message || "Network error");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950 font-serif">Hosting Requests & Reservations</h1>
        <p className="text-xs text-slate-500">
          Review incoming stay requests from verified travelers, accept reservations, and collect hosting rewards.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center gap-2">
          <Sparkles className="h-4 w-4 flex-shrink-0 text-teal-600" />
          <span>{message}</span>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-32 rounded-3xl bg-slate-200 animate-pulse" />
          <div className="h-32 rounded-3xl bg-slate-200 animate-pulse" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-subtle space-y-3">
          <CalendarCheck className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-navy-950">No hosting requests yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When verified members book your property, requests will appear here for your review and approval.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Guest & Stay Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src={b.guest?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-teal-500"
                  />
                  <div>
                    <h3 className="font-bold text-navy-950 text-sm">
                      {b.guest?.full_name} ({b.guest?.city})
                    </h3>
                    <div className="text-xs text-slate-500">
                      Property: <strong>{b.property?.title}</strong>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-x-3 pt-1">
                  <span><strong>Dates:</strong> {b.check_in} to {b.check_out} ({b.nights} nights)</span>
                  <span>•</span>
                  <span><strong>Guests:</strong> {b.guest_count}</span>
                  <span>•</span>
                  <span><strong>Nightly Rate:</strong> {b.credits_per_night} pts</span>
                </div>

                {b.host_notes && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 italic">
                    "{b.host_notes}"
                  </div>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Total Credits:</span>
                  <span className="text-lg font-black text-teal-700">{b.total_credits} pts</span>
                  <Badge
                    variant={
                      b.status === "confirmed"
                        ? "success"
                        : b.status === "requested"
                        ? "warning"
                        : b.status === "completed"
                        ? "teal"
                        : "default"
                    }
                  >
                    {b.status}
                  </Badge>
                </div>

                {/* Conditional Action Buttons */}
                {b.status === "requested" && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="teal"
                      size="sm"
                      isLoading={actionLoadingId === b.id}
                      onClick={() => handleDecision(b.id, "accept")}
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Accept Stay
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-rose-600 hover:bg-rose-50 border-rose-200"
                      isLoading={actionLoadingId === b.id}
                      onClick={() => handleDecision(b.id, "decline")}
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Decline
                    </Button>
                  </div>
                )}

                {b.status === "confirmed" && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="teal"
                      size="sm"
                      isLoading={actionLoadingId === b.id}
                      onClick={() => handleSettle(b.id)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Complete Stay & Settle Credits
                    </Button>
                  </div>
                )}

                {b.status === "completed" && (
                  <span className="text-[11px] text-emerald-700 font-bold">
                    ✓ Credits settled into your wallet
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
