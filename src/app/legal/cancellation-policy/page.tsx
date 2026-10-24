import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CancellationPolicyPage() {
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
              Exchange Terms
            </Badge>
            <h1 className="text-3xl font-extrabold text-navy-950 font-serif">
              Cancellation & Credit Refund Policy
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Version 1.0 • Standard Fair Exchange Policy
            </p>
          </div>

          <p>
            Home exchange relies upon predictability and reciprocal goodwill. To protect hosts who reserve their homes and decline other travel requests, cancellations adhere to fair, tiered escrow releases.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-900 text-base block">100% Refund</span>
              <p className="text-xs text-emerald-800">
                Cancel 7 or more days prior to scheduled check-in. All reserved stay credits and platform fees are returned to your wallet.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <span className="font-bold text-amber-900 text-base block">75% Refund</span>
              <p className="text-xs text-amber-800">
                Cancel between 3 and 7 days prior to check-in. 75% of reserved credits are returned to the guest, with 25% awarded to the host.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <span className="font-bold text-rose-900 text-base block">50% Refund</span>
              <p className="text-xs text-rose-800">
                Cancel within 72 hours of check-in. 50% of credits are awarded to the host as compensation for blocked dates.
              </p>
            </div>
          </div>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-navy-950">Host-Initiated Cancellations</h2>
            <p>
              If a host cancels a confirmed reservation, the guest receives an immediate 100% credit refund, priority rebooking assistance from the platform, and the host's calendar for those dates is blocked from other exchanges.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">Documented Force Majeure</h2>
            <p>
              In events of verified civil unrest, declared natural disasters, or documented severe flight cancellations, Platform Mediation can issue a 100% emergency credit reversal upon review of supporting records.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
