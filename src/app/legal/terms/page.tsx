import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
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
              Draft Legal Agreement
            </Badge>
            <h1 className="text-3xl font-extrabold text-navy-950 font-serif">
              HavenSwap Platform Terms of Service
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Version 1.0 • Effective Date: October 2026 • Prepared for professional legal counsel review
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
            <strong>Important Legal Notice:</strong> These terms are provided as an explicit draft template reflecting the actual operational rules of HavenSwap. The presence of these pages does not itself constitute formal legal advice or substitute for localized jurisdiction review under Indian or international tenancy statutes.
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">1. Nature of the Service</h2>
            <p>
              HavenSwap is an invite-only and membership-verified peer-to-peer home exchange marketplace. Members offer temporary access to residential premises owned or authorized by them in exchange for platform utility credits. HavenSwap is not a hotel, travel agency, real estate broker, or insurer.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">2. Platform Credits</h2>
            <p>
              Platform credits are internal accounting units utilized strictly to measure and facilitate non-reciprocal stays. Credits have no cash equivalent, cannot be redeemed for legal tender, cannot be transferred person-to-person outside the booking escrow system, and do not constitute electronic money, stored value, or cryptocurrency.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">3. Verification & Truth in Advertising</h2>
            <p>
              Members agree to provide authentic, unadulterated identity documents and proof of hosting authority. We do not represent any member or home as verified until the platform's multi-step verification process has been formally reviewed and confirmed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">4. Address Shielding & Privacy</h2>
            <p>
              Exact physical residential addresses are strictly confidential and shielded from public discovery. Addresses are revealed only to confirmed guests. Unauthorized public disclosure of another member's home address is strictly prohibited and grounds for immediate termination.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">5. Limitation of Liability</h2>
            <p>
              Members acknowledge that staying in private residential homes carries inherent risks. Both hosts and guests must maintain appropriate homeowner's, renter's, and liability insurance.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
