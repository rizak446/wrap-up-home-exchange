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
      a: "Traditional swaps require you to find someone in another city who wants to visit your exact city at the exact same dates. With HavenSwap's credit system, you host a traveler in your Bhopal home and earn credits. You can then use those accumulated credits at any time to stay at an ocean villa in Goa or a heritage haveli in Jaipur, without the other homeowner having to visit your home.",
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
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-navy-950 text-white">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1800&auto=format&fit=crop&q=80"
            alt="Luxury home exchange"
            className="w-full h-full object-cover opacity-30 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs font-bold tracking-wide uppercase mb-6 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-teal-400" />
            <span>The Premier Non-Reciprocal Home Exchange</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-serif max-w-4xl mx-auto leading-[1.15]">
            Exchange Access to Verified Homes. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-200 to-rose-300">
              Travel Freely with Platform Credits.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Live in <strong>Bhopal</strong> and vacationing in <strong>Goa</strong>? Host verified members in your city to earn credits, then unlock private villas, lofts, and havelis across India without prohibitive hotel rates.
          </p>

          {/* SEARCH CARD */}
          <div className="mt-10 max-w-4xl mx-auto bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-2xl border border-white/20 text-slate-900 text-left">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 items-center">
              {/* City Destination */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-500 transition-colors">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Destination
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-teal-600 flex-shrink-0" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Goa, Bhopal, Jaipur..."
                    className="w-full bg-transparent text-sm font-semibold text-navy-950 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-500 transition-colors">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Check-in Date
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-teal-600 flex-shrink-0" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-navy-950 focus:outline-none"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-500 transition-colors">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Travelers
                </label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-teal-600 flex-shrink-0" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-semibold text-navy-950 focus:outline-none cursor-pointer"
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
                variant="teal"
                size="lg"
                className="w-full h-full py-4 text-sm font-bold shadow-lg shadow-teal-700/30"
              >
                <Search className="h-4 w-4 mr-2" />
                Find Homes
              </Button>
            </form>
          </div>

          {/* Quick stats strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-teal-400" />
              100% ID-Verified Members
            </span>
            <span className="inline-block h-1 w-1 rounded-full bg-slate-500"></span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-teal-400" />
              Private Address Shielding
            </span>
            <span className="inline-block h-1 w-1 rounded-full bg-slate-500"></span>
            <span className="flex items-center gap-1.5">
              <Coins className="h-4 w-4 text-teal-400" />
              Escrow-Protected Credits
            </span>
          </div>
        </div>
      </section>

      {/* HOW THE CREDIT SYSTEM WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="teal" className="mb-3">
              Non-Reciprocal Exchange
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 font-serif">
              How the HavenSwap Credit System Works
            </h2>
            <p className="mt-4 text-slate-600 text-base leading-relaxed">
              You do not need to coordinate a simultaneous exchange with the same homeowner. Our double-entry credit ledger enables frictionless travel anywhere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 relative group hover:border-teal-500 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg mb-6 shadow-md shadow-teal-600/20">
                1
              </div>
              <h3 className="text-xl font-bold text-navy-950 mb-2">Host in Your City</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                List your primary or secondary home in Bhopal, Bengaluru, or Delhi. When a verified member stays at your property, you earn credits according to your nightly rate.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs font-semibold text-teal-700 flex items-center gap-1">
                <span>Earn 75 - 120 pts / night</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 relative group hover:border-teal-500 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-navy-950 text-white flex items-center justify-center font-bold text-lg mb-6 shadow-md shadow-navy-950/20">
                2
              </div>
              <h3 className="text-xl font-bold text-navy-950 mb-2">Credits Held in Escrow</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                When you request a stay in Goa, your credits are held securely in escrow. Neither party risks arbitrary cancellations; credits are only settled once the stay is fulfilled.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs font-semibold text-navy-950 flex items-center gap-1">
                <span>Atomic ledger protection</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 relative group hover:border-teal-500 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold text-lg mb-6 shadow-md shadow-rose-600/20">
                3
              </div>
              <h3 className="text-xl font-bold text-navy-950 mb-2">Stay in Curated Homes</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Spend credits to enjoy beach villas, mountain cottages, and city penthouses. The host receives credits to use for their own travels. Zero commercial hotel markups.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs font-semibold text-rose-700 flex items-center gap-1">
                <span>Unlimited non-reciprocal stays</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR HOMES PREVIEW */}
      <section className="py-20 bg-slate-50/60 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <Badge variant="teal" className="mb-2">
                Curated Listings
              </Badge>
              <h2 className="text-3xl font-extrabold text-navy-950 font-serif">
                Featured Verified Homes
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Hand-inspected properties with verified owners ready for non-reciprocal stay requests.
              </p>
            </div>
            <Link href="/homes">
              <Button variant="outline" size="sm">
                View All Listings <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INITIAL_PROPERTIES.map((home) => (
              <Link
                key={home.id}
                href={`/homes/${home.id}`}
                className="group rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-subtle hover:shadow-luxury transition-all duration-300 flex flex-col"
              >
                {/* Photo */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={home.images[0]?.image_url}
                    alt={home.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-navy-950/80 backdrop-blur-md text-white text-[11px] font-bold">
                      {home.property_type.replace("_", " ")}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-teal-600 text-white text-xs font-bold shadow-md">
                      {home.credits_per_night} pts / night
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <MapPin className="h-3.5 w-3.5 text-teal-600" />
                        {home.neighbourhood}, {home.city}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {home.rating} ({home.review_count})
                      </span>
                    </div>

                    <h3 className="font-bold text-navy-950 text-base line-clamp-1 group-hover:text-teal-700 transition-colors">
                      {home.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                      {home.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{home.bedrooms} bed • {home.max_guests} guests</span>
                    <span className="text-teal-600 font-semibold group-hover:underline">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="teal" className="mb-2">
              Popular Cities
            </Badge>
            <h2 className="text-3xl font-extrabold text-navy-950 font-serif">
              Where HavenSwap Members Are Traveling
            </h2>
            <p className="mt-3 text-slate-600 text-sm">
              Discover verified homes available for exchange across India's most sought-after leisure and work destinations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((d) => (
              <Link
                key={d.name}
                href={`/homes?city=${d.name}`}
                className="group relative h-80 rounded-3xl overflow-hidden shadow-card border border-slate-200"
              >
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="text-xs text-teal-300 font-bold uppercase tracking-wider">
                    {d.state}
                  </div>
                  <h3 className="text-2xl font-extrabold font-serif mt-0.5">{d.name}</h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-1">{d.description}</p>
                  <div className="mt-3 flex items-center justify-between text-xs font-semibold pt-2 border-t border-white/20">
                    <span>{d.homesCount} verified homes</span>
                    <span className="text-teal-300">~{d.avgCredits} pts/nt</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST & PRIVACY PILLARS */}
      <section className="py-20 bg-navy-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="teal" className="mb-3 bg-teal-900/60 text-teal-300 border-teal-500/30">
                Trust & Security
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif leading-tight">
                Designed Around Mutual Respect, Verified Identity, and Data Privacy.
              </h2>
              <p className="mt-4 text-slate-300 text-base leading-relaxed">
                Hosting a traveler or entering someone’s private home demands uncompromising security standards. HavenSwap operates as a verified home exchange community, not an anonymous listing board.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-teal-950 border border-teal-500/40 text-teal-400 mt-1">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Government ID Verification</h4>
                    <p className="text-slate-400 text-sm mt-0.5">
                      Passport, Driving License, or DigiLocker verification is mandatory before booking. Encrypted in private storage buckets.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-teal-950 border border-teal-500/40 text-teal-400 mt-1">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Private Address Protection</h4>
                    <p className="text-slate-400 text-sm mt-0.5">
                      Never exposed to the general public or search engines. Revealed solely to the approved guest upon confirmed reservation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-teal-950 border border-teal-500/40 text-teal-400 mt-1">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Housing Society & Ownership Checks</h4>
                    <p className="text-slate-400 text-sm mt-0.5">
                      Proof of authority or housing society rules compliance to ensure respectful community harmony.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link href="/safety">
                  <Button variant="teal" size="md">
                    Explore Safety Protocols <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80"
                  alt="Verified home interior"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl text-slate-900 border border-slate-200 hidden sm:block max-w-xs">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-5 w-5 text-teal-600" />
                  <span className="font-bold text-sm">Verified Host Shield</span>
                </div>
                <p className="text-xs text-slate-600">
                  Every home has undergone photo authenticity review and owner identity confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="teal" className="mb-2">
              Common Questions
            </Badge>
            <h2 className="text-3xl font-extrabold text-navy-950 font-serif">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Everything you need to know about our home exchange marketplace.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-slate-200 overflow-hidden transition-all shadow-subtle"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-bold text-navy-950 hover:text-teal-700 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                        isOpen ? "transform rotate-180 text-teal-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
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
      <section className="py-20 bg-gradient-to-br from-teal-700 via-teal-800 to-navy-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif">
            Ready to Travel India Through Curated Home Exchanges?
          </h2>
          <p className="mt-4 text-teal-100 text-base max-w-xl mx-auto">
            Join verified homeowners in Bhopal, Goa, Jaipur, and Bengaluru. Create your account and get 150 welcome credits upon verification.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button variant="primary" size="lg" className="bg-white text-navy-950 hover:bg-slate-100">
                Get Started Today
              </Button>
            </Link>
            <Link href="/homes">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Browse Verified Homes
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
