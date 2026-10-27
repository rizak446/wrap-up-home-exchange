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
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { compressImage } from "@/lib/image-compression";

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
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);
  const [hasPhotoChanged, setHasPhotoChanged] = useState(false);

  // Document verification state
  const [documentType, setDocumentType] = useState("aadhaar");
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [documentFileName, setDocumentFileName] = useState("");
  const [isCompressingDoc, setIsCompressingDoc] = useState(false);

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

  // Handle local profile image upload (PNG, JPG, WebP, Mobile Camera)
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage("Image file size should be less than 25MB.");
      return;
    }

    setIsCompressingPhoto(true);
    setErrorMessage(null);

    try {
      // Automatically resize & compress high-res mobile camera photos to ~50KB JPEG
      const compressedDataUrl = await compressImage(file, {
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.82,
      });

      setAvatarUrl(compressedDataUrl);
      setHasPhotoChanged(true);
      setSuccessMessage("Photo ready! Click 'Save Photo' or 'Save Profile' to apply.");
    } catch (err: any) {
      console.error("Compression error:", err);
      setErrorMessage("Could not process this image. Please try a different photo.");
    } finally {
      setIsCompressingPhoto(false);
      // Reset input value so the same file can be selected again if needed
      if (e.target) e.target.value = "";
    }
  };

  // Quick single-tap save for just the profile photo
  const handleQuickSavePhoto = async () => {
    if (!avatarUrl) return;
    setIsSavingPhoto(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await updateProfile({
        avatar_url: avatarUrl,
      });

      if (res.success) {
        setHasPhotoChanged(false);
        setSuccessMessage("Profile photo saved successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(res.error || "Failed to save profile photo.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSavingPhoto(false);
    }
  };

  // Handle local document file upload (PDF or Image)
  const handleDocFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage("Document file size must be less than 20MB.");
      return;
    }

    setDocumentFileName(file.name);
    setIsCompressingDoc(true);
    setErrorMessage(null);

    try {
      if (file.type.startsWith("image/")) {
        const compressedDoc = await compressImage(file, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.82,
        });
        setDocumentUrl(compressedDoc);
      } else {
        // PDF handler
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) setDocumentUrl(result);
        };
        reader.readAsDataURL(file);
      }
      setSuccessMessage("Document attached! Remember to click 'Save Profile & Details'.");
    } catch (err: any) {
      console.error("Doc upload error:", err);
      setErrorMessage("Could not process document file.");
    } finally {
      setIsCompressingDoc(false);
    }
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(null);
    setHasPhotoChanged(true);
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
        setHasPhotoChanged(false);
        setSuccessMessage("Your profile and details were saved successfully!");
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
            {/* Avatar Preview with Camera Badge */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-teal-500/20 border-2 border-white shadow-luxury bg-slate-100 flex items-center justify-center relative">
                {isCompressingPhoto ? (
                  <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-teal-700 animate-pulse">
                    <Loader2 className="h-7 w-7 animate-spin mb-1" />
                    <span className="text-[9px] font-bold">Optimizing...</span>
                  </div>
                ) : avatarUrl ? (
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

              {/* Direct Tap/Click Camera Badge */}
              <label
                htmlFor="avatar-photo-input"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-teal-700 hover:bg-teal-800 text-white flex items-center justify-center shadow-md cursor-pointer border-2 border-white transition-transform active:scale-95"
                title="Upload Photo from Camera or Gallery"
              >
                <Camera className="h-4 w-4" />
              </label>
            </div>

            {/* Photo Action Buttons */}
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <input
                  id="avatar-photo-input"
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="sr-only"
                />

                <label
                  htmlFor="avatar-photo-input"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 active:scale-95 shadow-sm transition-all cursor-pointer"
                >
                  {isCompressingPhoto ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Optimizing Photo...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </>
                  )}
                </label>

                {/* Instant Save Photo button if user just picked a new photo */}
                {hasPhotoChanged && avatarUrl && (
                  <Button
                    type="button"
                    variant="teal"
                    size="sm"
                    isLoading={isSavingPhoto}
                    onClick={handleQuickSavePhoto}
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold animate-pulse"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Save Photo Now
                  </Button>
                )}

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

              <p className="text-[11px] text-slate-500">
                Supports phone camera photos, JPG, PNG, or WebP up to 25MB (automatically optimized).
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
                id="doc-upload-input"
                type="file"
                ref={docFileInputRef}
                onChange={handleDocFileUpload}
                accept="image/*, application/pdf"
                className="sr-only"
              />

              <label
                htmlFor="doc-upload-input"
                className="block border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-teal-50/30"
              >
                {isCompressingDoc ? (
                  <div className="flex items-center justify-center gap-2 text-teal-800 text-xs font-bold animate-pulse">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing Document File...</span>
                  </div>
                ) : documentUrl ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="h-6 w-6 text-teal-600" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-teal-900">
                        {documentFileName || "Identity Document Attached"}
                      </p>
                      <span className="text-[10px] text-slate-400">Tap to replace file</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="h-6 w-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">
                      Tap to choose document file (Camera, Gallery, or PDF)
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Max file size: 20MB. Securely encrypted and protected under DPDP Act 2023.
                    </p>
                  </div>
                )}
              </label>
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

        {/* Save Button (Desktop) */}
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

        {/* Mobile Sticky Quick Save Bar */}
        <div className="sm:hidden fixed bottom-3 left-3 right-3 z-40 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-luxury flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-navy-950 truncate">
            {hasPhotoChanged ? "📸 Photo ready to save" : "Profile Details"}
          </span>
          <Button
            type="submit"
            variant="teal"
            size="sm"
            isLoading={isSaving}
            className="font-bold shadow-sm flex-shrink-0"
          >
            <Save className="h-3.5 w-3.5 mr-1" />
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
