"use client";

import React, { useState, useRef } from "react";
import {
  ShieldCheck,
  FileText,
  FileCheck,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Lock,
  Scale,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function VerificationCenterPage() {
  const { currentUser, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState<"passport" | "driving_license" | "voter_id" | "aadhaar">("aadhaar");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [docRef, setDocRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage("File size must be under 25MB.");
      return;
    }

    const fileSizeStr =
      file.size > 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(1) + " MB"
        : Math.round(file.size / 1024) + " KB";

    setUploadedFile({ name: file.name, size: fileSizeStr });
    setDocRef(`${file.name} (${fileSizeStr})`);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docRef && !uploadedFile) {
      setErrorMessage("Please choose a document file to upload.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const docIdentifier = uploadedFile ? `${uploadedFile.name} (${uploadedFile.size})` : docRef;
      await updateProfile({
        document_type: docType,
        document_url: docIdentifier,
      });

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit document.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-bold text-navy-950 font-serif">Identity & Trust Verification Center</h1>
        <p className="text-xs text-slate-500">
          Complete mandatory verification to unlock your Verified Member shield and receive 150 welcome credits.
        </p>
      </div>

      {/* Current Status Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl ${currentUser?.identity_verified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
            {currentUser?.identity_verified ? <CheckCircle2 className="h-7 w-7" /> : <Clock className="h-7 w-7" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-navy-950 text-base">Member Identity Verification</h3>
              <Badge variant={currentUser?.identity_verified ? "success" : "warning"}>
                {currentUser?.identity_verified ? "Verified Member" : "Verification Required"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser?.identity_verified
                ? "Your identity document has been verified. You can request stays and confirm reservations."
                : currentUser?.document_url
                ? `Document on file: ${currentUser.document_url}. Under trust review.`
                : "Submit your government document below for manual review."}
            </p>
          </div>
        </div>

        {currentUser?.identity_verified && (
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            ✓ 150 Welcome Credits Awarded
          </span>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
          <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Verification Submission Form */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
        <h2 className="text-lg font-bold text-navy-950 font-serif">Submit Verification Document</h2>

        {submitted || currentUser?.document_url ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-950 text-sm">Document Successfully Submitted for Review</h4>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Our Trust & Safety moderators will inspect your submission within 12 hours. You will receive an in-app alert once verified.
            </p>
            {currentUser?.document_url && (
              <div className="pt-2">
                <span className="text-[11px] font-bold text-emerald-900 bg-white px-3 py-1.5 rounded-xl border border-emerald-300 inline-block">
                  📄 On file: {currentUser.document_url}
                </span>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1">
                Accepted Government Document Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="aadhaar">Aadhaar Card (Front/Back)</option>
                <option value="passport">Indian Passport (Photo & Address Page)</option>
                <option value="driving_license">Driving License</option>
                <option value="voter_id">Election Commission Voter ID</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1">
                Upload Document Proof (PDF or Photo)
              </label>

              <input
                id="verify-doc-input"
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="application/pdf, image/*"
                className="sr-only"
              />

              <label
                htmlFor="verify-doc-input"
                className="block p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-teal-500 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-teal-50/30"
              >
                {uploadedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileCheck className="h-7 w-7 text-emerald-600" />
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-emerald-950">{uploadedFile.name}</span>
                        <Badge variant="success" className="text-[9px]">Ready to Submit</Badge>
                      </div>
                      <span className="text-[11px] text-slate-500">Size: {uploadedFile.size} • Tap to change</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">
                      Tap to select PDF or image from phone / computer
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Supports PDF, JPG, PNG up to 25MB. Securely encrypted and protected under DPDP Act 2023.
                    </p>
                  </div>
                )}
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-navy-950">
                <Lock className="h-4 w-4 text-teal-700" />
                <span>Security & DPDP 2023 Data Safeguard:</span>
              </div>
              <p>
                Verification files are stored in private, encrypted cloud storage buckets. Access is strictly limited to authorized trust officers via short-lived signed URLs. In compliance with Indian Supreme Court and UIDAI directives, we do not require or collect unmasked Aadhaar biometric credentials.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="teal" size="md" isLoading={isSubmitting}>
                Submit for Verification Review
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
