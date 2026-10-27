import Link from "next/link";
import { Compass, ShieldCheck, Heart, MapPin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#362719] bg-[#181008] text-[#D0C1B0] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl overflow-hidden shadow-sm bg-[#FAF7F2] border border-[#E8DFD5] p-0.5 flex items-center justify-center">
                <img
                  src="/wrap-up-logo.jpg"
                  alt="Wrap-Up Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-[#FAF5EA] font-serif">
                  Wrap<span className="text-[#C8792C]">-Up</span>
                </span>
                <span className="text-[10px] text-[#F4D9A0]/80 font-medium">Travel More • Spend Less</span>
              </div>
            </Link>
            <p className="text-[#A8927D] text-sm leading-relaxed max-w-sm">
              The premier, trust-anchored home exchange platform. Swap access to verified homes, host travelers to earn credits, and explore Bhopal, Goa, Jaipur, Bengaluru, and beyond without prohibitive lodging bills.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#CEBCAB] pt-2">
              <ShieldCheck className="h-4 w-4 text-[#C8792C]" />
              <span>Compliant with India DPDP Act 2023 & global privacy principles</span>
            </div>
          </div>

          {/* Explore & Destinations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4D9A0]">
              Featured Cities
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/homes?city=Goa" className="hover:text-[#C8792C] transition-colors">
                  Goa Beach Villas
                </Link>
              </li>
              <li>
                <Link href="/homes?city=Bhopal" className="hover:text-[#C8792C] transition-colors">
                  Bhopal Lake Residences
                </Link>
              </li>
              <li>
                <Link href="/homes?city=Jaipur" className="hover:text-[#C8792C] transition-colors">
                  Jaipur Heritage Havelis
                </Link>
              </li>
              <li>
                <Link href="/homes?city=Bengaluru" className="hover:text-[#C8792C] transition-colors">
                  Bengaluru Tech Penthouses
                </Link>
              </li>
              <li>
                <Link href="/homes" className="text-[#C8792C] font-semibold hover:underline">
                  All Destinations &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust, Safety & Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4D9A0]">
              Trust & Community
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/safety" className="hover:text-[#C8792C] transition-colors">
                  Safety & Verification
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#C8792C] transition-colors">
                  Credit System Rules
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-[#C8792C] transition-colors">
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link href="/legal/host-responsibilities" className="hover:text-[#C8792C] transition-colors">
                  Host Responsibilities
                </Link>
              </li>
              <li>
                <Link href="/legal/guest-responsibilities" className="hover:text-[#C8792C] transition-colors">
                  Guest Code of Conduct
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-[#C8792C] transition-colors">
                  Customer Care & Disputes
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4D9A0]">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/terms" className="hover:text-[#C8792C] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-[#C8792C] transition-colors">
                  Privacy Policy (DPDP 2023)
                </Link>
              </li>
              <li>
                <Link href="/legal/cancellation-policy" className="hover:text-[#C8792C] transition-colors">
                  Cancellation & Refund
                </Link>
              </li>
              <li>
                <Link href="/legal/exchange-agreement" className="hover:text-[#C8792C] transition-colors">
                  Home Exchange Agreement
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:text-[#C8792C] transition-colors">
                  Cookie Preferences
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclosure Notice */}
        <div className="mt-12 pt-8 border-t border-[#362719] space-y-4">
          <div className="p-4 rounded-2xl bg-[#261A10] border border-[#493726] text-xs text-[#CEBCAB] leading-relaxed">
            <strong className="text-[#F4D9A0]">Platform Transparency Notice:</strong> Wrap-Up facilitates non-reciprocal home exchanges through internal platform utility credits and verified membership subscriptions. Accommodations are not unconditionally free; users may require membership plans, platform safety fee credits, or host-approved deposits. Physical residential addresses are protected and never revealed publicly prior to mutual booking confirmation. Draft legal documents provided herein are subject to professional legal review in accordance with applicable local housing society and tenancy statutes.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A8927D]">
            <div>
              &copy; {new Date().getFullYear()} Wrap-Up Technologies Private Limited. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Made with care for curious, trustworthy travelers</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C8792C]"></span>
              <span className="text-[#F4D9A0]">India Launch Edition</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
