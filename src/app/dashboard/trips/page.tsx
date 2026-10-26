"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Lock,
  Unlock,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
  Sparkles,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Booking } from "@/types";

export default function MyTripsPage() {
  const { currentUser, refreshCredits } = useAuth();
  const [trips, setTrips] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Review Modal State
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Cancel Modal State
  const [cancelBooking, setCancelBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  const fetchTrips = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/bookings?guestId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setTrips(data.bookings || []);
      }
    } catch (e) {
      console.error("Error fetching trips", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [currentUser]);

  const handleReviewSubmit = async () => {
    if (!currentUser || !reviewBooking) return;
    setIsSubmittingReview(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: reviewBooking.id,
          propertyId: reviewBooking.property_id,
          reviewerId: currentUser.id,
          rating,
          content: reviewContent,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReviewSuccess(true);
        setTimeout(() => {
          setReviewBooking(null);
          setReviewSuccess(false);
          setReviewContent("");
        }, 1500);
      }
    } catch (e) {
      console.error("Error submitting review", e);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleCancelSubmit = async () => {
    if (!currentUser || !cancelBooking) return;
    setIsCancelling(true);

    try {
      const res = await fetch(`/api/bookings/${cancelBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cancel",
          userId: currentUser.id,
          reason: cancelReason || "Guest requested cancellation",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCancelMessage(`Booking cancelled. ${data.refundedCredits} credits refunded to your wallet.`);
        await fetchTrips();
        await refreshCredits();
        setCancelBooking(null);
      }
    } catch (e) {
      console.error("Error cancelling stay", e);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950 font-serif">My Stays & Travel Reservations</h1>
        <p className="text-xs text-slate-500">
          Track your stay requests, view unlocked addresses for confirmed reservations, and share post-stay reviews.
        </p>
      </div>

      {cancelMessage && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-teal-600 flex-shrink-0" />
          <span>{cancelMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-44 rounded-3xl bg-slate-200 animate-pulse" />
          <div className="h-44 rounded-3xl bg-slate-200 animate-pulse" />
        </div>
      ) : trips.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-subtle space-y-3">
          <Compass className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-navy-950">You have no travel bookings yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Ready to explore? Browse verified homes across Goa, Bhopal, Jaipur, or Bengaluru!
          </p>
          <Link href="/homes">
            <Button variant="teal" size="sm">
              Explore Homes Now
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {trips.map((trip) => {
            const isConfirmed = ["confirmed", "completed"].includes(trip.status);
            const coverImage =
              trip.property?.images?.[0]?.image_url ||
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80";

            return (
              <div
                key={trip.id}
                className="rounded-3xl bg-white border border-slate-200/80 shadow-subtle overflow-hidden flex flex-col md:flex-row hover:border-slate-300 transition-all"
              >
                {/* Photo Thumbnail */}
                <div className="md:w-64 aspect-[4/3] md:aspect-auto bg-slate-100 relative flex-shrink-0">
                  <img
                    src={coverImage}
                    alt={trip.property?.title || "Property"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant={
                        trip.status === "confirmed"
                          ? "success"
                          : trip.status === "completed"
                          ? "teal"
                          : trip.status === "requested"
                          ? "warning"
                          : "default"
                      }
                    >
                      {trip.status === "requested" ? "Awaiting Host" : trip.status}
                    </Badge>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link href={`/homes/${trip.property_id}`}>
                        <h3 className="font-bold text-navy-950 text-base hover:text-teal-700 transition-colors">
                          {trip.property?.title || "Home Exchange Stay"}
                        </h3>
                      </Link>
                      <div className="text-sm font-extrabold text-teal-700">
                        {trip.total_credits} credits held in escrow
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap gap-4">
                      <span><strong>Check-in:</strong> {trip.check_in}</span>
                      <span><strong>Check-out:</strong> {trip.check_out} ({trip.nights} nights)</span>
                      <span><strong>Guests:</strong> {trip.guest_count}</span>
                    </div>

                    {/* Host Profile Info */}
                    <div className="flex items-center gap-2 pt-1 pb-1">
                      <span className="text-xs text-slate-500 font-medium">Host:</span>
                      <img
                        src={trip.host?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                        alt=""
                        className="h-5 w-5 rounded-full object-cover ring-1 ring-teal-500"
                      />
                      <span className="text-xs font-bold text-navy-950">{trip.host?.full_name || "Nancy (Exchange Host)"}</span>
                      <span className="text-[11px] text-slate-400">({trip.property?.city || "India"})</span>
                    </div>

                    {/* ADDRESS PRIVACY SHIELD / UNLOCK BANNER */}
                    <div className="pt-2">
                      {isConfirmed ? (
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                            <Unlock className="h-4 w-4 text-emerald-600" />
                            <span>Stay Confirmed — Exact Physical Address Unlocked:</span>
                          </div>
                          <p className="font-semibold">{trip.property?.exact_address || `${trip.property?.city}, ${trip.property?.state}`}</p>
                          <div className="flex items-center gap-3 text-[11px] text-emerald-700 pt-1">
                            <span>Host Contact: {trip.host?.phone || "+91 98260 11223"} ({trip.host?.full_name || "Host"})</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                          <Lock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          <span>
                            <strong>Address Protected:</strong> Exact physical street address and host phone will unlock automatically once your host ({trip.host?.full_name || "the host"}) confirms this stay request.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      {trip.status === "completed" && (
                        <Button
                          variant="teal"
                          size="sm"
                          onClick={() => setReviewBooking(trip)}
                        >
                          <Star className="h-3.5 w-3.5 mr-1" />
                          Leave Review
                        </Button>
                      )}

                      {["requested", "confirmed"].includes(trip.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-rose-600 hover:bg-rose-50 border-rose-200"
                          onClick={() => setCancelBooking(trip)}
                        >
                          Cancel Stay
                        </Button>
                      )}
                    </div>

                    <Link href="/dashboard/messages">
                      <Button variant="ghost" size="sm" className="text-teal-700">
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                        Message Host
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REVIEW SUBMISSION MODAL */}
      <Modal
        isOpen={!!reviewBooking}
        onClose={() => setReviewBooking(null)}
        title="Review Your Completed Stay"
        description={reviewBooking?.property?.title}
      >
        {reviewSuccess ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-navy-950">Review Published!</h3>
            <p className="text-xs text-slate-500">Thank you for contributing to the HavenSwap verified community.</p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-navy-950 mb-1">Your Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="font-bold text-slate-700 ml-2">{rating}.0 / 5.0</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-navy-950 mb-1">Written Review</label>
              <textarea
                rows={4}
                required
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Share your experience: cleanliness, host communication, neighborhood vibe..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button variant="outline" size="md" onClick={() => setReviewBooking(null)}>
                Cancel
              </Button>
              <Button
                variant="teal"
                size="md"
                isLoading={isSubmittingReview}
                onClick={handleReviewSubmit}
              >
                Submit Review
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* CANCELLATION MODAL */}
      <Modal
        isOpen={!!cancelBooking}
        onClose={() => setCancelBooking(null)}
        title="Confirm Stay Cancellation"
        description={cancelBooking?.property?.title}
      >
        <div className="space-y-4 text-xs text-slate-600">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 leading-relaxed">
            <strong>Cancellation Policy:</strong> Depending on days remaining before check-in, credits will be refunded to your wallet in accordance with the platform's Fair Exchange policy.
          </div>

          <div>
            <label className="block font-bold text-navy-950 mb-1">Reason for Cancellation</label>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please explain why you need to cancel this reservation..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="outline" size="md" onClick={() => setCancelBooking(null)}>
              Keep Reservation
            </Button>
            <Button
              variant="danger"
              size="md"
              isLoading={isCancelling}
              onClick={handleCancelSubmit}
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
