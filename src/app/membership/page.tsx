"use client";

import React, { useState, useEffect } from "react";
import { Check, ShieldCheck, Zap, Sparkles, HelpCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

interface PlanItem {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  popular: boolean;
  cta: string;
}

const DEFAULT_PLANS: PlanItem[] = [
  {
    id: "free",
    name: "Free Explorer",
    description: "For curious homeowners beginning their home exchange journey.",
    priceMonthly: 0,
    priceAnnual: 0,
    features: [
      "Browse all verified homes across India",
      "1 active home listing",
      "2 booking requests per month",
      "Standard member support",
      "Basic messaging with hosts",
    ],
    popular: false,
    cta: "Current Plan",
  },
  {
    id: "standard",
    name: "Standard Member",
    description: "Ideal for frequent travelers, remote professionals, and families.",
    priceMonthly: 799,
    priceAnnual: 7990,
    features: [
      "Verified Member Identity Badge",
      "Up to 2 active home listings",
      "8 booking requests per month",
      "5% bonus credits earned on every host stay",
      "Priority customer support & dispute mediation",
      "Advanced availability calendar filters",
    ],
    popular: true,
    cta: "Join Standard",
  },
  {
    id: "premium",
    name: "Premium Concierge",
    description: "The ultimate membership privilege for avid globetrotters and multi-homeowners.",
    priceMonthly: 1499,
    priceAnnual: 14990,
    features: [
      "Elite Verification Status & Featured Listing Badge",
      "Up to 5 active home listings",
      "Unlimited monthly booking requests",
      "10% bonus credits earned on hosting",
      "Dedicated travel concierge & emergency stay backup",
      "Early access to newly verified homes",
      "Waived platform booking fees",
    ],
    popular: false,
    cta: "Upgrade to Concierge",
  },
];

export default function MembershipPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [plans, setPlans] = useState<PlanItem[]>(DEFAULT_PLANS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await fetch("/api/subscriptions");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.plans) && data.plans.length > 0) {
            const mapped: PlanItem[] = data.plans.map((p: any) => {
              const defaultMatch = DEFAULT_PLANS.find((dp) => dp.id === p.slug);
              return {
                id: p.slug || p.id,
                name: p.name,
                description:
                  defaultMatch?.description ||
                  (p.slug === "free"
                    ? "For curious homeowners beginning their journey."
                    : p.slug === "standard"
                    ? "Ideal for frequent travelers, remote professionals, and families."
                    : "The ultimate club privilege for avid globetrotters."),
                priceMonthly: Number(p.price_monthly_inr) || 0,
                priceAnnual: Number(p.price_annual_inr) || 0,
                features:
                  Array.isArray(p.features) && p.features.length > 0
                    ? p.features
                    : defaultMatch?.features || [],
                popular: p.slug === "standard",
                cta:
                  p.slug === "free"
                    ? "Current Plan"
                    : p.slug === "standard"
                    ? "Join Standard"
                    : "Upgrade to Concierge",
              };
            });
            // Ensure stable order (free, standard, premium)
            mapped.sort((a, b) => a.priceMonthly - b.priceMonthly);
            setPlans(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to load live subscription plans from Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPlans();
  }, []);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Header */}
      <section className="bg-navy-950 text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <Badge variant="teal" className="mb-3 bg-teal-900/60 text-teal-300 border-teal-500/30">
            Transparent Pricing
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight">
            Membership Plans
          </h1>
          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Choose a membership plan to unlock verified member badges, expanded listings, and travel freedom across India.
          </p>

          {/* Billing Switcher */}
          <div className="mt-8 inline-flex items-center rounded-2xl bg-white/10 p-1 border border-white/20">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === "monthly" ? "bg-white text-navy-950 shadow-sm" : "text-white/80 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === "annual" ? "bg-teal-500 text-white shadow-sm" : "text-white/80 hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-navy-950/80 px-1.5 py-0.5 rounded-full text-teal-300">Save ~17%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => {
            const price = billingCycle === "annual" ? p.priceAnnual : p.priceMonthly;
            return (
              <div
                key={p.id}
                className={`rounded-3xl p-8 bg-white border flex flex-col justify-between transition-all duration-300 ${
                  p.popular
                    ? "border-teal-500 shadow-luxury ring-2 ring-teal-500/20 relative"
                    : "border-slate-200 shadow-subtle hover:border-slate-300"
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
                    <span className="px-3.5 py-1 rounded-full bg-teal-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                      Most Popular Plan
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-navy-950 font-serif">{p.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{p.description}</p>

                  <div className="mt-6 mb-8 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-navy-950 font-serif">
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-slate-500">
                        {p.priceMonthly > 0 ? (billingCycle === "annual" ? "/ year + GST" : "/ month + GST") : ""}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-600">
                    {p.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <Button
                    variant={p.popular ? "teal" : "primary"}
                    size="lg"
                    className="w-full text-xs font-bold"
                    onClick={() => handleSelectPlan(p.id)}
                  >
                    {p.cta}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mandatory Transparency & Regulatory Disclosures */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 space-y-3 leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-navy-950">
            <AlertCircle className="h-4 w-4 text-teal-700" />
            <span>Important Membership Terms & Fair Disclosure:</span>
          </div>
          <p>
            1. <strong>No Acceptance Guarantee:</strong> A paid membership grants access to the platform's community tools, verification badge, and listing features. A subscription does not automatically guarantee that any individual homeowner will accept a specific stay request. Every host retains full autonomy to accept or decline.
          </p>
          <p>
            2. <strong>Renewal & Cancellation:</strong> Annual subscriptions renew automatically at the end of each billing cycle unless cancelled prior to renewal in your Account Settings. You may cancel renewal at any time with no penalty.
          </p>
          <p>
            3. <strong>Taxes:</strong> All listed prices are in Indian Rupees (INR) and exclude applicable Goods and Services Tax (GST 18%), which will be itemized at checkout.
          </p>
        </div>
      </section>

      {/* RAZORPAY / PAYMENT GATEWAY INTEGRATION MODAL */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Secure Checkout Integration"
        description="Razorpay / Payment Gateway Sandbox"
      >
        <div className="space-y-4 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 leading-relaxed">
            <h4 className="font-bold text-sm mb-1">Payment Provider Architecture</h4>
            <p>
              Wrap-Up integrates with authorized payment providers (such as Razorpay for INR cards, UPI, and NetBanking). Webhooks verify payments server-side before activating subscriptions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between font-medium">
              <span>Selected Plan:</span>
              <strong className="text-navy-950 capitalize">{selectedPlan} Member</strong>
            </div>
            <div className="flex justify-between font-medium">
              <span>Billing Cycle:</span>
              <strong className="text-navy-950 capitalize">{billingCycle}</strong>
            </div>
            <div className="flex justify-between font-medium">
              <span>Security Method:</span>
              <span className="text-emerald-700 font-bold">256-Bit TLS & Server Webhook</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            To activate live credit card or UPI processing in production, provide <code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code> in <code>.env.local</code>.
          </p>

          <div className="pt-3 flex justify-end gap-3">
            <Button variant="outline" size="md" onClick={() => setIsPaymentModalOpen(false)}>
              Close
            </Button>
            <Button
              variant="teal"
              size="md"
              onClick={() => {
                alert("Simulated payment verified! In production, Razorpay checkout triggers idempotent webhook.");
                setIsPaymentModalOpen(false);
              }}
            >
              Simulate Verified Checkout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
