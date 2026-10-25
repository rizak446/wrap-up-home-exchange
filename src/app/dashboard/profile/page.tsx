"use client";

import React, { useState, useRef } from "react";
import {
  User,
  Camera,
  Upload,
  Link as LinkIcon,
  Check,
  AlertCircle,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Save,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PRESET_AVATARS = [
  {
    name: "Classic Traveler",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Architect & Host",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Heritage Restorer",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Tech Explorer",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Global Nomad",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
  },
  {
    name: "Creative Resident",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
  },
];

export default function ProfileSettingsPage() {
  const { currentUser, updateProfile, isDemoUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(currentUser?.full_name || "");
  const [city, setCity] = useState(currentUser?.city || "");
  const [country, setCountry] = useState(currentUser?.country || "India");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [bio, setBio] = useState(
    currentUser?.bio ||
      "Passionate traveler and homeowner. Excited to share authentic stays and discover welcoming residences across India."
  );

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState(
    currentUser?.avatar_url ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
  );
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle local image file upload (converts to optimized data URI)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setAvatarUrl(customUrlInput.trim());
    setCustomUrlInput("");
    setShowUrlInput(false);
    setSuccessMessage("Image link applied! Click 'Save Profile' to commit.");
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
        avatar_url: avatarUrl,
      });

      if (res.success) {
        setSuccessMessage("Your profile and photo were updated successfully!");
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-teal-700">
          <User className="h-4 w-4" />
          <span>Member Profile & Identity</span>
        </div>
        <h1 className="text-3xl font-extrabold text-navy-950 font-serif tracking-tight">
          Profile Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Customize your public member appearance, update your verified profile photo, and share your host bio with the HavenSwap community.
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
        {/* PROFILE PHOTO SECTION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-navy-950">Profile Photo</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              A clear, friendly face photo helps build immediate trust with homeowners and guests.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Preview */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-teal-500/30 border-2 border-white shadow-luxury">
                <img
                  src={avatarUrl}
                  alt={fullName || "User Avatar"}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-navy-950/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
                title="Click to upload new photo"
              >
                <Camera className="h-6 w-6 mb-1" />
                <span className="text-[10px] font-bold">Change</span>
              </button>
            </div>

            {/* Upload Buttons & Options */}
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
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

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="gap-1.5"
                >
                  <LinkIcon className="h-3.5 w-3.5 text-slate-500" />
                  Paste Image URL
                </Button>
              </div>

              <p className="text-[11px] text-slate-400">
                Recommended: Square image (.jpg, .png, or .webp), up to 5MB.
              </p>

              {/* Paste URL Input Drawer */}
              {showUrlInput && (
                <div className="pt-2 flex items-center gap-2 max-w-md animate-fadeIn">
                  <input
                    type="url"
                    placeholder="https://example.com/my-photo.jpg"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleApplyCustomUrl}
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Preset Travel Avatars */}
          <div className="pt-4 border-t border-slate-100">
            <span className="block text-xs font-bold text-slate-700 mb-3">
              Or pick from curated community travel avatars:
            </span>
            <div className="flex flex-wrap gap-3">
              {PRESET_AVATARS.map((preset, index) => {
                const isSelected = avatarUrl === preset.url;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setAvatarUrl(preset.url);
                      setSuccessMessage(`Selected "${preset.name}". Click 'Save Profile' to apply.`);
                    }}
                    className={`relative rounded-full p-1 transition-all ${
                      isSelected
                        ? "ring-3 ring-teal-500 scale-105 shadow-md"
                        : "opacity-70 hover:opacity-100 hover:scale-105"
                    }`}
                    title={preset.name}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {isSelected && (
                      <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* PERSONAL DETAILS SECTION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-navy-950">Personal Details</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These details are visible to other members when you list a home or send a stay request.
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
                  value={currentUser?.email || ""}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Primary login email cannot be edited directly.
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
                  placeholder="+91 98..."
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
                  placeholder="Bhopal, Goa, Jaipur..."
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
                About Me / Host Bio
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
                placeholder="Share your travel experiences, hobbies, or what makes your home special..."
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Shown on your public profile and sent along with booking exchange requests.
              </span>
            </div>
          </div>
        </div>

        {/* TRUST & VERIFICATION STATUS */}
        <div className="p-6 rounded-3xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-navy-950 text-sm">Member Verification Status</h4>
                {currentUser?.identity_verified ? (
                  <Badge variant="teal" className="text-[10px] font-bold">Verified</Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-amber-700 bg-amber-50 border-amber-300">Pending Review</Badge>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Complies with India Digital Personal Data Protection (DPDP) Act 2023.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="teal"
            size="lg"
            isLoading={isSaving}
            className="font-bold px-8 shadow-md"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
