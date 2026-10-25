"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Camera,
  Upload,
  Trash2,
  AlertCircle,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Save,
  CheckCircle2,
  FileText,
  FileCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProfileSettingsPage() {
  const { currentUser, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("India");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  // Photo state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Document verification state
  const [documentType, setDocumentType] = useState("aadhaar");
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [documentFileName, setDocumentFileName] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.full_name || "");
      setCity(currentUser.city || "");
      setCountry(currentUser.country || "India");
      setPhone(currentUser.phone || "");
      setBio(currentUser.bio || "");
      setAvatarUrl(currentUser.avatar_url || null);
      setDocumentType(currentUser.document_type || "aadhaar");
      setDocumentNumber(currentUser.document_number || "");
      setDocumentUrl(currentUser.document_url || null);
    }
  }, [currentUser]);

  // Handle local profile image upload (PNG, JPG, WebP)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (PNG, JPG, or WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image file size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatarUrl(result);
        setSuccessMessage("Photo loaded! Click 'Save Profile' to apply changes.");
        setErrorMessage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle local document file upload (PDF or Image)
  const handleDocFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage("Document file size must be less than 8MB.");
      return;
    }

    setDocumentFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setDocumentUrl(result);
        setSuccessMessage("Document attached! Click 'Save Profile' to save details.");
        setErrorMessage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(null);
    setSuccessMessage("Photo removed. Click 'Save Profile' to apply.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await updateProfile({
        full_name: fullName.trim(),
        city: city.trim(),
        country: country.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl || undefined,
        document_type: documentType,
        document_number: documentNumber.trim() || undefined,
        document_url: documentUrl || undefined,
      });

      if (res.success) {
        setSuccessMessage("Your profile and verification details were saved successfully!");
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setErrorMessage(res.error || "Failed to update profile.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-luxury space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
            <User className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-navy-950 font-serif">
            Sign In to Manage Profile
          </h2>
          <p className="text-xs text-slate-500">
            Please log in with your verified account to view and update your profile photo, personal information, and government identity documents.
          </p>
          <div className="pt-2">
            <Link href="/auth/login">
              <Button variant="teal" size="md" className="w-full font-bold">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-teal-700">
          <User className="h-4 w-4" />
          <span>Member Profile & Verification</span>
        </div>
        <h1 className="text-3xl font-extrabold text-navy-950 font-serif tracking-tight">
          Profile Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Manage your personal account information, upload your verified profile photo, and submit your identity documents for secure membership verification.
        </p>
      </div>

      {/* Notifications / Alerts */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
          <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. PROFILE PHOTO SECTION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-navy-950">Profile Photo</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload a clear photo of yourself. A genuine profile photo helps hosts and guests verify your identity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Preview */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-teal-500/20 border-2 border-white shadow-luxury bg-slate-100 flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName || "User Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User className="h-12 w-12" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-navy-950/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
                title="Change Photo"
              >
                <Camera className="h-6 w-6 mb-1" />
                <span className="text-[10px] font-bold">Change</span>
              </button>
            </div>

            {/* Photo Action Buttons */}
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="teal"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </Button>

                {avatarUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemovePhoto}
                    className="gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </Button>
                )}
              </div>

              <p className="text-[11px] text-slate-400">
                Supports JPG, PNG, or WebP files up to 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* 2. PERSONAL DETAILS SECTION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-navy-950">Personal Details</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These details are saved in your member profile and used for communication during home exchanges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Divas Dwivedi"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={currentUser.email || ""}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Primary login email cannot be changed directly.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="+91 98260..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1.5">
                Primary City
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Bhopal, Goa, Delhi..."
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy-950 mb-1.5">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="India"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy-950 mb-1.5">
                About Me / Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
                placeholder="Tell other community members a little about yourself, your travels, or your lifestyle..."
              />
            </div>
          </div>
        </div>

        {/* 3. IDENTITY DOCUMENT & VERIFICATION DETAILS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-teal-600" />
              <h3 className="text-base font-bold text-navy-950">Identity & Verification Documents</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your government identity details and upload proof for verified member status.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1.5">
                Government Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="aadhaar">Aadhaar Card</option>
                <option value="passport">Passport</option>
                <option value="driving_license">Driving License</option>
                <option value="voter_id">Voter ID Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1.5">
                Document / ID Number
              </label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="e.g. 1234 5678 9012 or Passport No."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Document Upload File */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy-950 mb-1.5">
                Upload Document Proof (Front Side / PDF)
              </label>
              <input
                type="file"
                ref={docFileInputRef}
                onChange={handleDocFileUpload}
                accept="image/png, image/jpeg, image/jpg, application/pdf"
                className="hidden"
              />

              <div
                onClick={() => docFileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-teal-50/30"
              >
                {documentUrl ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="h-6 w-6 text-teal-600" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-teal-900">
                        {documentFileName || "Identity Document Attached"}
                      </p>
                      <span className="text-[10px] text-slate-400">Click to replace file</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="h-6 w-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">
                      Click to choose document file (Image or PDF)
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Max file size: 8MB. Securely encrypted and protected under DPDP Act 2023.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Verification Badge Status */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-teal-600" />
              <div>
                <span className="font-bold text-navy-950 block">Status:</span>
                <span className="text-slate-500 text-[11px]">
                  {currentUser.identity_verified
                    ? "Verified Member"
                    : documentNumber || documentUrl
                    ? "Document Submitted - Verification in Progress"
                    : "Not Verified (Submit documents above)"}
                </span>
              </div>
            </div>
            {currentUser.identity_verified ? (
              <Badge variant="teal" className="text-[10px]">Verified</Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] text-slate-600">Pending</Badge>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="teal"
            size="lg"
            isLoading={isSaving}
            className="font-bold px-8 shadow-md"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Profile & Details
          </Button>
        </div>
      </form>
    </div>
  );
}
