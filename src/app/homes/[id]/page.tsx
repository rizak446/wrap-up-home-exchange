"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Star,
  ShieldCheck,
  Coins,
  Bed,
  Bath,
  Users,
  Calendar as CalendarIcon,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Share2,
  Heart,
  Clock,
  Sparkles,
  Wifi,
  AirVent,
  Briefcase,
  Waves,
  Utensils,
  Shirt,
  Car,
  Zap,
  Compass,
  Palmtree,
  Flower2,
  Dog,
  AlertCircle,
} from "lucide-react";
import { Property, ReviewItem } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import PropertyMap from "@/components/maps/PropertyMap";
import { calculateNights, calculateTotalCredits } from "@/lib/utils";

export default function HomeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { currentUser, creditAccount, refreshCredits } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("2026-11-10");
  const [checkOut, setCheckOut] = useState("2026-11-13");
  const [guestCount, setGuestCount] = useState(2);
  const [hostNotes, setHostNotes] = useState("");
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProperty(data.property);
          setReviews(data.reviews || []);
        }
      } catch (e) {
        console.error("Failed to load property details", e);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 w-64 bg-slate-200 rounded-xl" />
        <div className="h-[450px] w-full bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-64 bg-slate-200 rounded-3xl" />
          <div className="h-64 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-navy-950">Home Not Found</h2>
        <p className="text-slate-500 mt-2">The property listing you are looking for is unavailable or unpublished.</p>
        <Link href="/homes" className="mt-6 inline-block">
          <Button variant="teal">Browse All Homes</Button>
        </Link>
      </div>
    );
  }

  const { nights, totalCredits, platformFeeCredits } = calculateTotalCredits(
    property.credits_per_night,
    checkIn,
    checkOut
  );

  const availableBalance = creditAccount?.available_balance ?? 350;
  const hasEnoughCredits = availableBalance >= totalCredits;

  const handleRequestBooking = async () => {
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }

    setIsSubmittingBooking(true);
    setBookingError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: currentUser.id,
          propertyId: property.id,
          checkIn,
          checkOut,
          guestCount,
          hostNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setBookingError(data.error || "Unable to submit booking request");
      } else {
        setBookingSuccess(true);
        await refreshCredits();
      }
    } catch (err: any) {
      setBookingError(err.message || "Network error submitting booking");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const amenityIcons: Record<string, any> = {
    Wifi,
    AirVent,
    Briefcase,
    Waves,
    Utensils,
    Shirt,
    Car,
    Zap,
    Compass,
    Palmtree,
    Flower2,
    Dog,
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top Breadcrumb & Back */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <Link
            href="/homes"
            className="flex items-center gap-1.5 text-slate-500 hover:text-navy-950 font-semibold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to explore</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Listed in</span>
            <span className="font-bold text-navy-950">{property.city}, {property.country}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="teal">{property.property_type.replace("_", " ")}</Badge>
              {property.verification_status === "verified" && (
                <Badge variant="success">
                  <ShieldCheck className="h-3 w-3 mr-0.5" />
                  Verified Property
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-950 font-serif">
              {property.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <MapPin className="h-4 w-4 text-teal-600" />
                {property.neighbourhood}, {property.city}, {property.state}
              </span>
              <span className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {property.rating} ({property.review_count} community reviews)
              </span>
              <span className="text-slate-400">•</span>
              <span>Min. stay: {property.min_stay_nights} nights</span>
            </div>
          </div>
        </div>

        {/* IMAGE GALLERY */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden shadow-card border border-slate-200 bg-white p-2">
          {/* Main Cover */}
          <div className="md:col-span-2 relative aspect-[16/10] md:aspect-auto md:h-[420px] rounded-2xl overflow-hidden bg-slate-100">
            <img
              src={property.images[0]?.image_url}
              alt={property.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Side Thumbnails */}
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-[420px]">
            {property.images.slice(1, 5).map((img, idx) => (
              <div key={img.id || idx} className="relative rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={img.image_url}
                  alt={img.caption || property.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* MAIN BODY: 2-COLUMN LAYOUT */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT 7 COLUMNS: DESCRIPTION, AMENITIES, HOST, RULES, MAP */}
          <div className="lg:col-span-8 space-y-10">
            {/* Property Summary Specs */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-subtle flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-teal-600" />
                  <span><strong>{property.bedrooms}</strong> Bedrooms ({property.beds} Beds)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-teal-600" />
                  <span><strong>{property.bathrooms}</strong> Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-teal-600" />
                  <span>Max <strong>{property.max_guests}</strong> Guests</span>
                </div>
              </div>

              {property.square_feet && (
                <div className="text-xs text-slate-500 font-semibold">
                  {property.square_feet} sq.ft residence
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-navy-950 font-serif">About This Residence</h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Verified Host Profile */}
            {property.host && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-50 to-teal-50/30 border border-slate-200 shadow-subtle">
                <div className="flex items-start gap-4">
                  <img
                    src={property.host.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
                    alt={property.host.full_name}
                    className="h-16 w-16 rounded-2xl object-cover ring-2 ring-teal-500 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-navy-950">{property.host.full_name}</h3>
                      <Badge variant="teal">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified Host
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      Based in {property.host.city}, {property.host.country} • Member since {new Date(property.host.created_at).getFullYear()}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {property.host.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Amenities Grid */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-navy-950 font-serif">Curated Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((am) => {
                  const Icon = amenityIcons[am.icon] || Sparkles;
                  return (
                    <div
                      key={am.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 text-xs font-semibold text-slate-700 shadow-subtle"
                    >
                      <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{am.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* House Rules & Policies */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4">
              <h2 className="text-xl font-bold text-navy-950 font-serif">Exchange Rules & Arrival Times</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <Clock className="h-4 w-4 text-teal-600" />
                  <span>Check-in: After <strong>{property.check_in_start}</strong></span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <Clock className="h-4 w-4 text-teal-600" />
                  <span>Check-out: Before <strong>{property.check_out_end}</strong></span>
                </div>
              </div>
              <div className="pt-2 text-xs text-slate-600 leading-relaxed space-y-1">
                <p><strong>House Customs:</strong> {property.house_rules || "Respect residential quiet hours and treat furniture with care."}</p>
                <p><strong>Pet Policy:</strong> {property.pet_policy.replace("_", " ")}</p>
                <p><strong>Smoking Policy:</strong> {property.smoking_policy.replace("_", " ")}</p>
              </div>
            </div>

            {/* Approximate Location & Privacy Map */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-navy-950 font-serif">Neighbourhood & Location</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {property.neighbourhood}, {property.city}, {property.state}
                  </p>
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                  <Lock className="h-3.5 w-3.5" />
                  Address Shielded
                </span>
              </div>

              {/* Privacy Warning Banner */}
              <div className="p-4 rounded-2xl bg-teal-900/10 border border-teal-200/80 text-xs text-teal-900 leading-relaxed flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-teal-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Host Address Privacy Protection:</strong> To protect the homeowner’s safety and family residence, the exact physical street address, building number, and entry passcode are concealed. They will be automatically revealed on your trips dashboard once the host accepts and confirms your reservation request.
                </div>
              </div>

              <div className="h-80 w-full rounded-3xl overflow-hidden border border-slate-200">
                <PropertyMap
                  properties={[property]}
                  center={[property.latitude, property.longitude]}
                  zoom={13}
                  height="100%"
                  isApproximateRadius={true}
                />
              </div>
            </div>

            {/* Community Reviews */}
            <div className="space-y-6 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
                <h2 className="text-2xl font-bold text-navy-950 font-serif">
                  {property.rating} • {reviews.length} Community Reviews
                </h2>
              </div>

              {reviews.length === 0 ? (
                <p className="text-sm text-slate-500">
                  This new listing has not received reviews yet. Be among the first verified members to stay!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.reviewer?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover ring-1 ring-teal-500"
                          />
                          <div>
                            <div className="font-bold text-xs text-navy-950">{rev.reviewer?.full_name}</div>
                            <div className="text-[11px] text-slate-400">{rev.reviewer?.city}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          <Star className="h-3 w-3 fill-amber-400" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{rev.content}"
                      </p>
                      {rev.host_response && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                          <strong>Host response:</strong> {rev.host_response}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 4 COLUMNS: STICKY BOOKING CARD */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 rounded-3xl bg-white border border-slate-200 p-6 shadow-luxury space-y-6">
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-3xl font-extrabold text-teal-700 font-serif">
                    {property.credits_per_night} pts
                  </span>
                  <span className="text-xs text-slate-500 ml-1">/ night</span>
                </div>
                <div className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>{property.rating}</span>
                </div>
              </div>

              {/* Date & Guest Selectors */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
                <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200">
                  <div className="p-3 bg-slate-50/50">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-transparent font-semibold text-navy-950 focus:outline-none"
                    />
                  </div>
                  <div className="p-3 bg-slate-50/50">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-transparent font-semibold text-navy-950 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50/50">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    Guests
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full bg-transparent font-semibold text-navy-950 focus:outline-none cursor-pointer"
                  >
                    {Array.from({ length: property.max_guests }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Calculation Breakdown */}
              <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span>
                    {property.credits_per_night} pts × {nights} nights
                  </span>
                  <span>{property.credits_per_night * nights} pts</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1">
                    Platform Escrow & Safety Fee (5%)
                  </span>
                  <span>{platformFeeCredits} pts</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 font-bold text-sm text-navy-950">
                  <span>Total Escrow Required</span>
                  <span className="text-teal-700">{totalCredits} pts</span>
                </div>
              </div>

              {/* User Balance Check */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-600">Your Available Credits:</span>
                  <span className={`font-bold ${hasEnoughCredits ? "text-teal-700" : "text-rose-600"}`}>
                    {availableBalance} pts
                  </span>
                </div>
                {!hasEnoughCredits && (
                  <p className="mt-1 text-[11px] text-rose-600">
                    You need {totalCredits - availableBalance} more credits. Host travelers to earn credits or upgrade membership.
                  </p>
                )}
              </div>

              {/* Action Button */}
              <Button
                variant="teal"
                size="lg"
                className="w-full py-4 text-sm font-bold shadow-lg shadow-teal-700/20"
                disabled={!hasEnoughCredits}
                onClick={() => setIsBookingModalOpen(true)}
              >
                Request to Stay
              </Button>

              <div className="text-center text-[11px] text-slate-400">
                Credits are held safely in escrow and only settled upon completed stay.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REQUEST TO STAY CONFIRMATION MODAL */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setBookingSuccess(false);
          setBookingError(null);
        }}
        title="Confirm Stay Reservation Request"
        description={`Request to stay at "${property.title}" in ${property.city}`}
      >
        {bookingSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-navy-950">Stay Request Submitted! 🎉</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              We have reserved <strong>{totalCredits} credits</strong> in secure escrow. The host (<strong>{property.host?.full_name}</strong>) has been notified and has 48 hours to confirm.
            </p>
            <div className="pt-4 flex items-center justify-center gap-3">
              <Link href="/dashboard/trips">
                <Button variant="primary" size="md">
                  View My Trips
                </Button>
              </Link>
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsBookingModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {bookingError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Dates:</span>
                <span className="font-bold text-navy-950">{checkIn} to {checkOut} ({nights} nights)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Guests:</span>
                <span className="font-bold text-navy-950">{guestCount} Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Credits Deducted into Escrow:</span>
                <span className="font-bold text-teal-700">{totalCredits} credits</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1">
                Message to Host ({property.host?.full_name})
              </label>
              <textarea
                value={hostNotes}
                onChange={(e) => setHostNotes(e.target.value)}
                placeholder="Introduce yourself, share the purpose of your trip, and confirm arrival details..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
              <strong>Escrow Guarantee:</strong> If the host declines or does not respond within 48 hours, all {totalCredits} credits are automatically released back to your available balance immediately.
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsBookingModalOpen(false)}
                disabled={isSubmittingBooking}
              >
                Cancel
              </Button>
              <Button
                variant="teal"
                size="md"
                isLoading={isSubmittingBooking}
                onClick={handleRequestBooking}
              >
                Confirm Request & Hold Credits
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
