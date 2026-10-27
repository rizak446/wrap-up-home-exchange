import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
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
              Privacy & Data Governance
            </Badge>
            <h1 className="text-3xl font-extrabold text-navy-950 font-serif">
              Privacy Policy (India DPDP Act 2023 Aligned)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Version 1.0 • Effective Date: October 2026
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 leading-relaxed">
            <strong>Compliance Principle:</strong> Wrap-Up operates on a privacy-by-default architecture. We collect solely necessary data required to ensure physical safety, fraud mitigation, and booking execution.
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">1. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Account Identifiers:</strong> Name, verified email address, phone number, and residential city.</li>
              <li><strong>Verification Credentials:</strong> Government-issued identity document images submitted solely for identity confirmation. These are stored in private encrypted storage and never indexed or linked publicly.</li>
              <li><strong>Property Details:</strong> Descriptive information, amenities, photos, and approximate coordinates. Exact physical addresses are concealed from public display.</li>
              <li><strong>Transactional Logs:</strong> Immutable credit ledger transactions and booking history.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">2. Indian DPDP Act 2023 Rights</h2>
            <p>
              In accordance with the Digital Personal Data Protection Act, 2023 (DPDP), members possess:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>The right to access summary information regarding processed data.</li>
              <li>The right to correct, complete, or update personal information.</li>
              <li>The right to withdraw consent and request data erasure.</li>
              <li>The right to nominate an individual in the event of death or incapacity.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">3. Third-Party Processors</h2>
            <p>
              We partner exclusively with reputable infrastructure and payment providers (e.g., Supabase for encrypted database hosting, Razorpay for payment processing). We do not sell or monetize personal data for third-party advertising.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">4. Data Protection Officer (DPO) Contact</h2>
            <p>
              For grievances, data export requests, or erasure petitions, contact our Data Protection Officer at: <code>dpo@havenswap.com</code>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
