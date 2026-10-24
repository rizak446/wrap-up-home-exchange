import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function GuestResponsibilitiesPage() {
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
              Guest Code of Conduct
            </Badge>
            <h1 className="text-3xl font-extrabold text-navy-950 font-serif">
              Guest Responsibilities
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Treating someone’s private home with honor, care, and gratitude
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">1. Golden Rule of Home Exchange</h2>
            <p>
              Remember that you are not occupying an anonymous hotel room. You are enjoying access to another verified member's personal sanctuary. Leave the residence tidy, washed, and respected.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">2. Adherence to House Customs</h2>
            <p>
              Observe all house rules specified by the host: shoe policies, smoking restrictions, pet allowances, and neighbourhood quiet hours.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-navy-950">3. Timely Communication</h2>
            <p>
              Notify your host promptly of your arrival and departure times via platform messaging. If an accident occurs, communicate transparently right away.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
