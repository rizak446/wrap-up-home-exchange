import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HostResponsibilitiesPage() {
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
              Community Standards
            </Badge>
            <h1 className="text-3xl font-extrabold text-navy-950 font-serif">
              Host Responsibilities & Guidelines
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Legal, safety, and hospitality covenants for homeowners listing on HavenSwap
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">1. Verification of Authority to Host</h2>
            <p>
              Hosts must ensure they have legal authority to offer their home. If you are a tenant or leaseholder, you must verify that your underlying agreement and resident welfare association (RWA) bylaws permit temporary guests or non-commercial home exchanges.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">2. Truthful Description & Safety Standards</h2>
            <p>
              Listings must accurately represent bedroom counts, working amenities, air conditioning, and Wi-Fi speeds. Homes must possess functional smoke detection, first-aid supplies, and visible emergency contact numbers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">3. Cleanliness & Preparedness</h2>
            <p>
              Provide freshly laundered bed linens, sanitized bathrooms, clear refrigerator space, and simple check-in instructions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
