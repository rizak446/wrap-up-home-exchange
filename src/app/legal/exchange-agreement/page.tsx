import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ExchangeAgreementPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-navy-950 font-semibold mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="rounded-3xl bg-white p-8 sm:p-12 border border-slate-200 shadow-subtle space-y-8 text-slate-700 text-sm leading-relaxed">
          <div className="border-b border-slate-100 pb-6">
            <Badge variant="teal" className="mb-2">
              Model Agreement
            </Badge>
            <h1 className="text-3xl font-extrabold text-navy-950 font-serif">
              Model Home Exchange Agreement
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Mutual covenants between host member and traveling guest member
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">1. Temporary Permissive Occupancy</h2>
            <p>
              The Host grants to the Guest a revocable, temporary license to enter and occupy the designated premises for residential holiday purposes only during the confirmed dates. This agreement does not create a landlord-tenant relationship, tenancy in common, or permanent leasehold estate under any state rent control legislation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">2. Care of the Property & Damage</h2>
            <p>
              The Guest covenants to maintain the premises in good, clean order and leave the residence in substantially the same state as received. In the unlikely event of accidental breakage, the Guest agrees to notify the Host immediately and reimburse reasonable repair costs or participate in Platform Mediation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">3. Housing Society Bylaws</h2>
            <p>
              Both parties agree to abide strictly by the residential society or condominium rules regarding quiet hours, parking designations, and pool access.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
