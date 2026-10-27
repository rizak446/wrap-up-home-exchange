"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  Users,
  ShieldCheck,
  Coins,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronDown,
  Sparkles,
  MapPin,
  Star,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INITIAL_PROPERTIES } from "@/lib/data/mock-db";

export default function HomePage() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set("city", city.trim());
    if (guests) params.set("guests", guests.toString());
    router.push(`/homes?${params.toString()}`);
  };

  const destinations = [
    {
      name: "Goa",
      state: "Goa",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80",
      description: "Candolim, Anjuna & Morjim beach villas with private pools",
      homesCount: 14,
      avgCredits: 105,
    },
    {
      name: "Bhopal",
      state: "Madhya Pradesh",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80",
      description: "Shamla Hills lakeside retreats & heritage colonial verandas",
      homesCount: 8,
      avgCredits: 75,
    },
    {
      name: "Jaipur",
      state: "Rajasthan",
      image: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800&auto=format&fit=crop&q=80",
      description: "C-Scheme havelis, courtyard suites & Rajasthani architecture",
      homesCount: 11,
      avgCredits: 85,
    },
    {
      name: "Bengaluru",
      state: "Karnataka",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80",
      description: "Indiranagar duplex penthouses with high-speed remote studios",
      homesCount: 19,
      avgCredits: 95,
    },
  ];

  const faqs = [
    {
      q: "How does non-reciprocal home exchange work with credits?",
      a: "Traditional swaps require you to find someone in another city who wants to visit your exact city at the exact same dates. With Wrap-Up's credit system, you host a traveler in your Bhopal home and earn credits. You can then use those accumulated credits at any time to stay at an ocean villa in Goa or a heritage haveli in Jaipur, without the other homeowner having to visit your home.",
    },
    {
      q: "Is my physical home address visible to everyone on the internet?",
      a: "Absolutely not. Privacy is built into our core architecture. Public listings only display your neighbourhood (e.g., 'Shamla Hills, Bhopal' or 'Candolim, North Goa') and an approximate 650m radius. Your exact street address, apartment number, and check-in instructions are strictly unlocked only after you accept and confirm a verified member's stay request.",
    },
    {
      q: "How are hosts and travelers verified?",
      a: "All members must complete multi-factor verification before requesting or confirming reservations. This includes government identity verification (Passport/Driving License/DigiLocker) and property authorization checks (utility bill or housing society NOC). We adhere strictly to India's DPDP Act 2023.",
    },
    {
      q: "Are accommodations completely free?",
      a: "Accommodations are exchanged using platform credits rather than expensive nightly cash rates. To maintain our strict vetting infrastructure, member verification, and escrow technology, members join via transparent subscription plans (starting with a Free Explorer tier) and pay a nominal 5% platform safety fee in credits upon booking.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#24170E] via-[#3A2617] to-[#181008] text-white">
        {/* Background Image with Warm Amber & Espresso Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1800&auto=format&fit=crop&q=80"
            alt="Luxury home exchange"
            className="w-full h-full object-cover opacity-25 filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181008] via-[#24170E]/80 to-[#181008]/50" />
          {/* Subtle Ambient Radial Gold Glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#C8792C]/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4D9A0]/15 border border-[#F4D9A0]/40 text-[#F4D9A0] text-xs font-bold tracking-wide uppercase mb-6 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-[#F4D9A0]" />
            <span>Wrap-Up • Travel More • Spend Less</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FFFDF9] font-serif max-w-4xl mx-auto leading-[1.15]">
            Exchange Access to Verified Homes. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4D9A0] via-[#DF9E5E] to-[#C8792C]">
              Travel Freely with Platform Credits.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#D0C1B0] max-w-2xl mx-auto leading-relaxed">
            Live in <strong className="text-[#FAF5EA]">Bhopal</strong> and vacationing in <strong className="text-[#FAF5EA]">Goa</strong>? Host verified members in your city to earn credits, then unlock private villas, lofts, and havelis across India without prohibitive hotel rates.
          </p>

          {/* SEARCH CARD */}
          <div className="mt-10 max-w-4xl mx-auto bg-[#FAF7F2]/95 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-2xl border border-[#F4D9A0]/30 text-[#2E1E13] text-left">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 items-center">
              {/* City Destination */}
              <div className="p-3 rounded-2xl bg-[#FFFDF9] border border-[#E8DFD5] hover:border-[#C8792C] transition-colors">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8927D] mb-1">
                  Destination
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#C8792C] flex-shrink-0" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Goa, Bhopal, Jaipur..."
                    className="w-full bg-transparent text-sm font-semibold text-[#2E1E13] placeholder-[#A8927D] focus:outline-none"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="p-3 rounded-2xl bg-[#FFFDF9] border border-[#E8DFD5] hover:border-[#C8792C] transition-colors">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8927D] mb-1">
                  Check-in Date
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#C8792C] flex-shrink-0" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-[#2E1E13] focus:outline-none"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="p-3 rounded-2xl bg-[#FFFDF9] border border-[#E8DFD5] hover:border-[#C8792C] transition-colors">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8927D] mb-1">
                  Travelers
                </label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#C8792C] flex-shrink-0" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-semibold text-[#2E1E13] focus:outline-none cursor-pointer"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={6}>6+ Guests</option>
                  </select>
                </div>
              </div>

              {/* Search Submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full h-full py-4 text-sm font-bold shadow-lg shadow-[#C8792C]/30 bg-gradient-to-r from-[#C8792C] to-[#B2631F] text-white hover:brightness-105"
              >
                <Search className="h-4 w-4 mr-2" />
                Find Homes
              </Button>
            </form>
          </div>

          {/* Quick stats strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#D0C1B0] font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#F4D9A0]" />
              100% ID-Verified Members
            </span>
            <span className="inline-block h-1 w-1 rounded-full bg-[#7D634C]"></span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-[#F4D9A0]" />
              Private Address Shielding
            </span>
            <span className="inline-block h-1 w-1 rounded-full bg-[#7D634C]"></span>
            <span className="flex items-center gap-1.5">
              <Coins className="h-4 w-4 text-[#F4D9A0]" />
              Escrow-Protected Credits
            </span>
          </div>
        </div>
      </section>

      {/* HOW THE CREDIT SYSTEM WORKS */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="champagne" className="mb-3">
              Non-Reciprocal Exchange
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2E1E13] font-serif">
              How the Wrap-Up Credit System Works
            </h2>
            <p className="mt-4 text-[#5B4632] text-base leading-relaxed">
              You do not need to coordinate a simultaneous exchange with the same homeowner. Our double-entry credit ledger enables frictionless travel anywhere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-[#FFFDF9] border border-[#E8DFD5] relative group hover:border-[#C8792C] hover:shadow-luxury transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-[#C8792C] text-white flex items-center justify-center font-bold text-lg mb-6 shadow-md shadow-[#C8792C]/25">
                1
              </div>
              <h3 className="text-xl font-bold text-[#2E1E13] mb-2">Host in Your City</h3>
              <p className="text-[#5B4632] text-sm leading-relaxed">
                List your primary or secondary home in Bhopal, Bengaluru, or Delhi. When a verified member stays at your property, you earn credits according to your nightly rate.
              </p>
              <div className="mt-6 pt-4 border-t border-[#E8DFD5] text-xs font-semibold text-[#C8792C] flex items-center gap-1">
                <span>Earn 75 - 120 pts / night</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-[#FFFDF9] border border-[#E8DFD5] relative group hover:border-[#5B4632] hover:shadow-luxury transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-[#5B4632] text-[#FDFBF7] flex items-center justify-center font-bold text-lg mb-6 shadow-md shadow-[#5B4632]/25">
                2
              </div>
              <h3 className="text-xl font-bold text-[#2E1E13] mb-2">Credits Held in Escrow</h3>
              <p className="text-[#5B4632] text-sm leading-relaxed">
                When you request a stay in Goa, your credits are held securely in escrow. Neither party risks arbitrary cancellations; credits are only settled once the stay is fulfilled.
              </p>
              <div className="mt-6 pt-4 border-t border-[#E8DFD5] text-xs font-semibold text-[#5B4632] flex items-center gap-1">
                <span>Atomic ledger protection</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-[#FFFDF9] border border-[#E8DFD5] relative group hover:border-[#F4D9A0] hover:shadow-luxury transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-[#914E18] text-white flex items-center justify-center font-bold text-lg mb-6 shadow-md shadow-[#914E18]/25">
                3
              </div>
              <h3 className="text-xl font-bold text-[#2E1E13] mb-2">Stay in Curated Homes</h3>
              <p className="text-[#5B4632] text-sm leading-relaxed">
                Spend credits to enjoy beach villas, mountain cottages, and city penthouses. The host receives credits to use for their own travels. Zero commercial hotel markups.
              </p>
              <div className="mt-6 pt-4 border-t border-[#E8DFD5] text-xs font-semibold text-[#914E18] flex items-center gap-1">
                <span>Unlimited non-reciprocal stays</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR HOMES PREVIEW */}
      <section className="py-20 bg-[#F4EFE9] border-y border-[#E8DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <Badge variant="amber" className="mb-2">
                Curated Listings
              </Badge>
              <h2 className="text-3xl font-extrabold text-[#2E1E13] font-serif">
                Featured Verified Homes
              </h2>
              <p className="text-[#5B4632] text-sm mt-1">
                Hand-inspected properties with verified owners ready for non-reciprocal stay requests.
              </p>
            </div>
            <Link href="/homes">
              <Button variant="outline" size="sm" className="border-[#CEBCAB] text-[#5B4632] hover:bg-[#FAF7F4] hover:text-[#C8792C]">
                View All Listings <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INITIAL_PROPERTIES.map((home) => (
              <Link
                key={home.id}
                href={`/homes/${home.id}`}
                className="group rounded-3xl bg-[#FFFDF9] border border-[#E8DFD5] overflow-hidden shadow-subtle hover:shadow-luxury hover:border-[#F4D9A0] transition-all duration-300 flex flex-col"
              >
                {/* Photo */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E6DCD0]">
                  <img
                    src={home.images[0]?.image_url}
                    alt={home.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-[#181008]/85 backdrop-blur-md text-[#FAF5EA] text-[11px] font-bold">
                      {home.property_type.replace("_", " ")}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#C8792C] text-white text-xs font-bold shadow-md">
                      {home.credits_per_night} pts / night
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#7A6F66] mb-1.5">
                      <span className="flex items-center gap-1 font-semibold text-[#5B4632]">
                        <MapPin className="h-3.5 w-3.5 text-[#C8792C]" />
                        {home.neighbourhood}, {home.city}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-[#C8792C]">
                        <Star className="h-3.5 w-3.5 fill-[#C8792C] text-[#C8792C]" />
                        {home.rating} ({home.review_count})
                      </span>
                    </div>

                    <h3 className="font-bold text-[#2E1E13] text-base line-clamp-1 group-hover:text-[#C8792C] transition-colors">
                      {home.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#7A6F66] line-clamp-2">
                      {home.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E8DFD5] flex items-center justify-between text-xs text-[#7A6F66]">
                    <span>{home.bedrooms} bed • {home.max_guests} guests</span>
                    <span className="text-[#C8792C] font-semibold group-hover:underline">
                      Explore stay &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="champagne" className="mb-2">
              Popular Cities
            </Badge>
            <h2 className="text-3xl font-extrabold text-[#2E1E13] font-serif">
              Where Wrap-Up Members Are Traveling
            </h2>
            <p className="mt-3 text-[#5B4632] text-sm">
              Discover verified homes available for exchange across India's most sought-after leisure and work destinations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((d) => (
              <Link
                key={d.name}
                href={`/homes?city=${d.name}`}
                className="group relative h-80 rounded-3xl overflow-hidden shadow-card border border-[#E8DFD5]"
              >
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181008] via-[#181008]/40 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="text-xs text-[#F4D9A0] font-bold uppercase tracking-wider">
                    {d.state}
                  </div>
                  <h3 className="text-2xl font-extrabold font-serif mt-0.5 text-[#FFFDF9]">{d.name}</h3>
                  <p className="text-xs text-[#CEBCAB] mt-1 line-clamp-1">{d.description}</p>
                  <div className="mt-3 flex items-center justify-between text-xs font-semibold pt-2 border-t border-[#F4D9A0]/20">
                    <span className="text-[#FAF5EA]">{d.homesCount} verified homes</span>
                    <span className="text-[#F4D9A0]">~{d.avgCredits} pts/nt</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST & PRIVACY PILLARS */}
      <section className="py-20 bg-[#181008] text-[#FAF5EA] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="amber" className="mb-3 bg-[#362719] text-[#F4D9A0] border-[#F4D9A0]/30">
                Trust & Security
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif leading-tight text-[#FFFDF9]">
                Designed Around Mutual Respect, Verified Identity, and Data Privacy.
              </h2>
              <p className="mt-4 text-[#CEBCAB] text-base leading-relaxed">
                Hosting a traveler or entering someone’s private home demands uncompromising security standards. Wrap-Up operates as a verified home exchange community, not an anonymous listing board.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#261A10] border border-[#5B4632] text-[#C8792C] mt-1">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#FFFDF9] text-base">Government ID Verification</h4>
                    <p className="text-[#A8927D] text-sm mt-0.5">
                      Passport, Driving License, or DigiLocker verification is mandatory before booking. Encrypted in private storage buckets.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#261A10] border border-[#5B4632] text-[#C8792C] mt-1">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#FFFDF9] text-base">Private Address Protection</h4>
                    <p className="text-[#A8927D] text-sm mt-0.5">
                      Never exposed to the general public or search engines. Revealed solely to the approved guest upon confirmed reservation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#261A10] border border-[#5B4632] text-[#C8792C] mt-1">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#FFFDF9] text-base">Housing Society & Ownership Checks</h4>
                    <p className="text-[#A8927D] text-sm mt-0.5">
                      Proof of authority or housing society rules compliance to ensure respectful community harmony.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link href="/safety">
                  <Button variant="primary" size="md" className="bg-gradient-to-r from-[#C8792C] to-[#B2631F]">
                    Explore Safety Protocols <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-[#5B4632] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80"
                  alt="Verified home interior"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#FAF7F2] p-5 rounded-2xl shadow-xl text-[#2E1E13] border border-[#E8DFD5] hidden sm:block max-w-xs">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-5 w-5 text-[#C8792C]" />
                  <span className="font-bold text-sm">Verified Host Shield</span>
                </div>
                <p className="text-xs text-[#5B4632]">
                  Every home has undergone photo authenticity review and owner identity confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="champagne" className="mb-2">
              Common Questions
            </Badge>
            <h2 className="text-3xl font-extrabold text-[#2E1E13] font-serif">
              Frequently Asked Questions
            </h2>
            <p className="text-[#5B4632] text-sm mt-2">
              Everything you need to know about our home exchange marketplace.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#FFFDF9] border border-[#E8DFD5] overflow-hidden transition-all shadow-subtle hover:border-[#F4D9A0]"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-bold text-[#2E1E13] hover:text-[#C8792C] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-[#A8927D] transition-transform duration-200 ${
                        isOpen ? "transform rotate-180 text-[#C8792C]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-[#5B4632] leading-relaxed border-t border-[#E8DFD5] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 bg-gradient-to-br from-[#5B4632] via-[#362719] to-[#181008] text-white text-center border-t border-[#F4D9A0]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#FFFDF9]">
            Ready to Travel India Through Curated Home Exchanges?
          </h2>
          <p className="mt-4 text-[#F4D9A0]/90 text-base max-w-xl mx-auto">
            Join verified homeowners in Bhopal, Goa, Jaipur, and Bengaluru. Create your account and get 150 welcome credits upon verification.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button variant="primary" size="lg" className="bg-[#C8792C] hover:bg-[#B46520] text-white shadow-lg shadow-[#C8792C]/30">
                Get Started Today
              </Button>
            </Link>
            <Link href="/homes">
              <Button variant="outline" size="lg" className="border-[#F4D9A0] text-[#F4D9A0] hover:bg-[#F4D9A0]/10">
                Browse Verified Homes
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
