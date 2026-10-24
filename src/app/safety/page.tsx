import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Building,
  FileText,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
  PhoneCall,
  Scale,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <section className="bg-navy-950 text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <Badge variant="teal" className="mb-3 bg-teal-900/60 text-teal-300 border-teal-500/30">
            Trust & Security First
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight">
            Safety, Verification & Data Privacy
          </h1>
          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Opening your home or stepping into another member's sanctuary requires mutual respect, transparent identity verification, and world-class cybersecurity.
          </p>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 space-y-10">
        {/* Pillar 1: Two-Tier Verification */}
        <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-luxury space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-50 text-teal-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-950">1. Rigorous Member & Property Verification</h2>
              <p className="text-xs text-slate-500">Separating identity verification from property authority verification.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <strong className="text-navy-950 text-sm block">Member Identity Verification</strong>
              <p>
                All requesting guests and listing hosts must complete identity verification. We support verified government documents (Passports, Driving Licenses, Voter IDs, or DigiLocker integration).
              </p>
              <div className="text-[11px] text-teal-700 font-semibold pt-2">
                Documents are stored in encrypted private buckets with short-lived signed URLs. Raw files are never exposed publicly.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <strong className="text-navy-950 text-sm block">Property Authority Verification</strong>
              <p>
                Hosts must demonstrate legitimate entitlement to offer the residence. We review property tax receipts, electricity/utility utility bills, or Housing Society NOCs to ensure compliance with local bylaws.
              </p>
              <div className="text-[11px] text-teal-700 font-semibold pt-2">
                Unverified properties remain in "Pending Review" and cannot receive booking requests.
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2: Indian DPDP Act 2023 Compliance */}
        <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-navy-950 text-teal-400">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-950">2. Privacy by Default & India DPDP Act 2023</h2>
              <p className="text-xs text-slate-500">Designed around purpose limitation and consent.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <p>
              Under India's Digital Personal Data Protection (DPDP) Act 2023, we practice strict purpose limitation. Personal identification is collected solely for fraud mitigation and user trust verification.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li><strong>No Aadhaar Hoarding:</strong> In accordance with UIDAI regulations, we do not store unmasked Aadhaar numbers or raw biometric credentials.</li>
              <li><strong>Right to Erasure:</strong> Members can submit an account and personal data deletion request directly from their dashboard settings.</li>
              <li><strong>Audit Logging:</strong> Every staff review of sensitive verification documentation is logged in our immutable audit records.</li>
            </ul>
          </div>
        </div>

        {/* Pillar 3: Physical Address Concealment */}
        <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-700">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-950">3. Physical Address Shielding</h2>
              <p className="text-xs text-slate-500">Protecting homeowner security from anonymous scrapers and prying eyes.</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Public property listings display only the city, general neighbourhood (e.g., "Shamla Hills, Bhopal" or "Candolim, Goa"), and an approximate map radius. The precise building name, apartment number, and check-in access code are strictly withheld until the host has reviewed the guest's profile, accepted the reservation, and the stay is confirmed.
          </p>
        </div>

        {/* Emergency Procedures & Support */}
        <div className="rounded-3xl bg-navy-950 text-white p-8 border border-slate-800 space-y-4">
          <h2 className="text-xl font-bold font-serif">Emergency Contacts & Support</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            In the event of an urgent property issue, medical situation, or immediate safety concern during a stay, members have 24/7 access to our platform support desk and escalation protocols.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link href="/support">
              <Button variant="teal" size="md">
                Contact Care Desk
              </Button>
            </Link>
            <Link href="/legal/terms">
              <Button variant="outline" size="md" className="border-slate-700 text-white hover:bg-slate-800">
                View Terms of Service
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
