import React from "react";
import Link from "next/link";
import {
  Compass,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Users,
  Calendar,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Create an Account & Verify Identity",
      desc: "Join HavenSwap by registering your basic details. In compliance with safety standards and India's DPDP Act 2023, upload a government ID to unlock your Verified Member badge and 150 welcome credits.",
    },
    {
      num: "02",
      title: "List Your Home with Verified Authority",
      desc: "Use our 7-step property wizard to describe your residence in Bhopal, Jaipur, or Bengaluru. Provide photos, amenities, house rules, and proof of hosting authority (utility bill or housing society NOC).",
    },
    {
      num: "03",
      title: "Host Verified Members to Earn Credits",
      desc: "Accept booking requests from vetted club members when your home is vacant or you are away. When an eligible stay concludes, your credit wallet is rewarded automatically.",
    },
    {
      num: "04",
      title: "Explore Curated Homes Across India & Beyond",
      desc: "Want to holiday in Goa? Search by date, guest count, and amenities. Public maps show approximate neighbourhoods so host addresses remain confidential.",
    },
    {
      num: "05",
      title: "Request a Stay with Escrow Protection",
      desc: "Credits for your trip are placed into an atomic escrow hold. The host reviews your profile and accepts. The exact street address is unlocked only after mutual confirmation.",
    },
    {
      num: "06",
      title: "Enjoy Your Stay & Settle Non-Reciprocally",
      desc: "Check in with clear instructions. Upon stay completion, credits transfer from escrow to the host. Both parties leave genuine reviews. You are ready for your next destination!",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <section className="bg-navy-950 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge variant="teal" className="mb-3 bg-teal-900/60 text-teal-300 border-teal-500/30">
            Platform Blueprint
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight">
            How HavenSwap Works
          </h1>
          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Non-reciprocal travel powered by double-entry credit ledger technology. No forced direct swaps, no inflated hotel bills.
          </p>
        </div>
      </section>

      {/* The Concrete Scenario: Bhopal to Goa */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-luxury border border-slate-200">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>The Core Example Scenario</span>
          </div>
          <h2 className="text-2xl font-bold text-navy-950 font-serif mb-4">
            From Upper Lake Bhopal to Candolim Beach Goa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-bold text-navy-950 text-sm block">1. Rajesh in Bhopal</span>
              <p>
                Rajesh lives in Bhopal. He lists his lakeview residence on HavenSwap. While travelling on business, a verified member stays for 4 nights, earning Rajesh 300 credits.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-bold text-navy-950 text-sm block">2. Rajesh Desires Goa</span>
              <p>
                Rajesh wants to take a vacation in Goa. He does not need the Goa homeowner to come to Bhopal. He searches Candolim listings and finds Alisha's beach villa (110 pts/night).
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-bold text-navy-950 text-sm block">3. Alisha Travels Next</span>
              <p>
                Alisha accepts Rajesh's stay and earns credits. She later uses her credits to stay in a Jaipur haveli. The credit loop allows all members freedom to roam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Step Sequence */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-serif text-center mb-10">
          The 6-Step Exchange Lifecycle
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-subtle hover:border-teal-500 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-black text-teal-600 font-mono">{st.num}</span>
                <h3 className="font-bold text-navy-950 text-base">{st.title}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-8 text-center">
          <Link href="/auth/register">
            <Button variant="teal" size="lg">
              Start Your Journey <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
