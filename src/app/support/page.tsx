"use client";

import React, { useState } from "react";
import { Mail, Phone, LifeBuoy, AlertCircle, CheckCircle2, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

export default function SupportPage() {
  const { currentUser } = useAuth();
  const [category, setCategory] = useState("booking_issue");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [bookingId, setBookingId] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <Badge variant="teal" className="mb-3 bg-teal-900/60 text-teal-300 border-teal-500/30">
            Care & Resolutions
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight">
            HavenSwap Help Center & Support Desk
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Need assistance with a stay request, credit ledger inquiry, or member verification? Our dedicated team is here to assist.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left 1 Column: Direct Contact Info */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-subtle space-y-4">
            <h3 className="font-bold text-navy-950 text-base">Direct Channels</h3>
            
            <div className="flex items-start gap-3 text-xs text-slate-600">
              <Mail className="h-4 w-4 text-teal-600 mt-0.5" />
              <div>
                <strong className="block text-navy-950">General Support</strong>
                <span>support@havenswap.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-600">
              <Phone className="h-4 w-4 text-teal-600 mt-0.5" />
              <div>
                <strong className="block text-navy-950">Urgent Host Hotline</strong>
                <span>+91 80 4910 2200 (24/7 during stays)</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-600">
              <LifeBuoy className="h-4 w-4 text-teal-600 mt-0.5" />
              <div>
                <strong className="block text-navy-950">Dispute Mediation Desk</strong>
                <span>disputes@havenswap.com</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-teal-900 text-white p-6 border border-teal-800 shadow-subtle space-y-2 text-xs">
            <h4 className="font-bold text-sm">Escrow Hold Inquiries</h4>
            <p className="text-teal-100 leading-relaxed">
              Credits held in escrow for requested stays are automatically released if a host declines or does not confirm within 48 hours.
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Support Ticket Form */}
        <div className="md:col-span-2 rounded-3xl bg-white p-8 border border-slate-200 shadow-subtle">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-navy-950">Support Case Dispatched</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your ticket has been logged with ID <strong>#TKT-{Math.floor(100000 + Math.random() * 900000)}</strong>. Our Member Care team responds within 4 hours.
              </p>
              <Button variant="outline" size="sm" onClick={() => setIsSubmitted(false)}>
                Submit Another Inquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-navy-950 font-serif">Open a Support Ticket</h2>
              <p className="text-xs text-slate-500">
                Logged in as <strong>{currentUser?.full_name || "Guest Traveler"}</strong> ({currentUser?.email || "anonymous"})
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-950 mb-1">Inquiry Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="booking_issue">Booking or Stay Request Issue</option>
                    <option value="credit_dispute">Credit Wallet or Ledger Question</option>
                    <option value="verification">Identity or Property Verification</option>
                    <option value="damage_claim">Damage or Cleanliness Claim</option>
                    <option value="privacy">DPDP Privacy / Data Erasure Request</option>
                    <option value="other">General Platform Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-950 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="low">Low (General Query)</option>
                    <option value="medium">Medium (Account/Verification)</option>
                    <option value="high">High (Upcoming Stay)</option>
                    <option value="urgent">Urgent (Active Stay Emergency)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Booking Reference ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. book-sample-1"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Summary of issue..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please provide full details, dates, and background context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="teal" size="md">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Case
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
