"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Building,
  Home,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Trash2,
  Star,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  MapPin,
  Lock,
  Camera,
  FileCheck,
  FileText,
  Loader2,
  HelpCircle,
  Clock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MASTER_AMENITIES } from "@/lib/data/mock-db";
import { PropertyImage } from "@/types";

export default function AddHomePage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File input refs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [isCompressingPhotos, setIsCompressingPhotos] = useState(false);
  const [isCompressingDoc, setIsCompressingDoc] = useState(false);

  // Step 1: Identity & Location
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState<string>("apartment");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [exactAddress, setExactAddress] = useState("");

  // Step 2: Spaces & Capacity
  const [bedrooms, setBedrooms] = useState(2);
  const [beds, setBeds] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [maxGuests, setMaxGuests] = useState(4);
  const [squareFeet, setSquareFeet] = useState<number | undefined>(1200);
  const [floorNumber, setFloorNumber] = useState<number | undefined>(2);

  // Step 3: Amenities
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>([
    "am-1", // wifi
    "am-2", // ac
    "am-5", // kitchen
    "am-8", // power backup
  ]);

  // Step 4: Photos (Multiple real image uploads)
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [manualCaption, setManualCaption] = useState("");

  // Step 5: Ownership Proof Verification Document
  const [docType, setDocType] = useState("utility_bill");
  const [docFileName, setDocFileName] = useState<string | null>(null);
  const [docFileRef, setDocFileRef] = useState<string | null>(null);

  // Step 6: Pricing & House Rules
  const [creditsPerNight, setCreditsPerNight] = useState(75);
  const [minStayNights, setMinStayNights] = useState(2);
  const [maxStayNights, setMaxStayNights] = useState(14);
  const [checkInStart, setCheckInStart] = useState("14:00");
  const [checkOutEnd, setCheckOutEnd] = useState("11:00");
  const [advanceBookingDays, setAdvanceBookingDays] = useState(90);
  const [houseRules, setHouseRules] = useState(
    "Quiet hours after 10 PM. No loud parties. Treat our home with reciprocal mutual respect."
  );
  const [cleaningExpectations, setCleaningExpectations] = useState(
    "Please leave dishes in the dishwasher and dispose of kitchen waste."
  );
  const [petPolicy, setPetPolicy] = useState<any>("not_allowed");
  const [smokingPolicy, setSmokingPolicy] = useState<any>("forbidden");

  // Step 7: Legal Attestation
  const [acknowledgedRules, setAcknowledgedRules] = useState(false);
  const [confirmedAuthority, setConfirmedAuthority] = useState(false);

  // Toggle amenity
  const toggleAmenity = (id: string) => {
    setSelectedAmenityIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // HTML5 Canvas image compression for fast mobile photo uploads
  const compressPhoto = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(e.target?.result as string);
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle local photo files selected from Camera / Gallery
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressingPhotos(true);
    setError(null);

    try {
      const newImgs: PropertyImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 25 * 1024 * 1024) continue;
        const compressed = await compressPhoto(file);
        newImgs.push({
          id: `img-${Date.now()}-${i}`,
          property_id: "temp",
          image_url: compressed,
          caption: file.name.replace(/\.[^/.]+$/, ""),
          display_order: images.length + i + 1,
          is_cover: images.length === 0 && i === 0,
        });
      }
      setImages((prev) => [...prev, ...newImgs]);
    } catch (err) {
      console.error("Photo compression error:", err);
      setError("Could not process some photos. Please try different images.");
    } finally {
      setIsCompressingPhotos(false);
      if (e.target) e.target.value = "";
    }
  };

  // Add photo via direct URL
  const handleAddManualPhoto = () => {
    if (!manualImageUrl.trim()) return;
    const newImg: PropertyImage = {
      id: `img-${Date.now()}`,
      property_id: "temp",
      image_url: manualImageUrl.trim(),
      caption: manualCaption.trim() || "Living area",
      display_order: images.length + 1,
      is_cover: images.length === 0,
    };
    setImages([...images, newImg]);
    setManualImageUrl("");
    setManualCaption("");
  };

  const setCoverPhoto = (imgId: string) => {
    setImages(
      images.map((img) => ({
        ...img,
        is_cover: img.id === imgId,
      }))
    );
  };

  const removePhoto = (imgId: string) => {
    const updated = images.filter((img) => img.id !== imgId);
    if (updated.length > 0 && !updated.some((i) => i.is_cover)) {
      updated[0].is_cover = true;
    }
    setImages(updated);
  };

  // Handle Ownership Document proof upload (PDF or Image)
  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setError("Document file size must be less than 25MB.");
      return;
    }

    const fileSizeStr =
      file.size > 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(1) + " MB"
        : Math.round(file.size / 1024) + " KB";

    const displayName = `${file.name} (${fileSizeStr})`;
    setDocFileName(displayName);
    setDocFileRef(displayName);
    setError(null);
  };

  // Step validation before proceeding
  const validateCurrentStep = (): boolean => {
    setError(null);
    if (currentStep === 1) {
      if (!title.trim()) {
        setError("Please enter an evocative Listing Title *");
        return false;
      }
      if (!city.trim()) {
        setError("Please enter the City * where your home is located");
        return false;
      }
      if (!state.trim()) {
        setError("Please enter the State / Province *");
        return false;
      }
      if (!neighbourhood.trim()) {
        setError("Please enter the Locality / Neighbourhood *");
        return false;
      }
      if (!exactAddress.trim()) {
        setError("Please enter the Exact Street Address * (Protected for safety)");
        return false;
      }
      if (!postalCode.trim()) {
        setError("Please enter the Postal / PIN Code *");
        return false;
      }
    } else if (currentStep === 2) {
      if (bedrooms < 0 || beds < 1 || bathrooms < 1 || maxGuests < 1) {
        setError("Please ensure bedroom, bed, bathroom, and guest numbers are valid *");
        return false;
      }
    } else if (currentStep === 4) {
      if (images.length === 0) {
        setError("Please upload at least 1 authentic property photo *");
        return false;
      }
    } else if (currentStep === 5) {
      if (!docFileRef) {
        setError("Please attach an ownership proof document (Electricity Bill, Registry, or Lease) *");
        return false;
      }
    } else if (currentStep === 6) {
      if (creditsPerNight < 10) {
        setError("Please specify at least 10 credits per night *");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 7));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit listing to API and Supabase
  const handleSubmit = async () => {
    if (!currentUser) return;
    if (!acknowledgedRules || !confirmedAuthority) {
      setError("Please complete all required safety & legal authority acknowledgements *");
      return;
    }

    if (images.length === 0) {
      setError("Please upload at least 1 property photo before submission *");
      return;
    }

    if (!docFileRef) {
      setError("Please attach your property ownership or utility document *");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const chosenAmenities = MASTER_AMENITIES.filter((a) => selectedAmenityIds.includes(a.id));

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostId: currentUser.id,
          title: title.trim(),
          property_type: propertyType,
          description: description.trim(),
          country,
          state: state.trim(),
          city: city.trim(),
          neighbourhood: neighbourhood.trim(),
          postal_code: postalCode.trim(),
          exact_address: exactAddress.trim(),
          bedrooms,
          beds,
          bathrooms,
          max_guests: maxGuests,
          square_feet: squareFeet,
          floor_number: floorNumber,
          credits_per_night: creditsPerNight,
          min_stay_nights: minStayNights,
          max_stay_nights: maxStayNights,
          advance_booking_days: advanceBookingDays,
          house_rules: houseRules,
          check_in_start: checkInStart,
          check_out_end: checkOutEnd,
          cleaning_expectations: cleaningExpectations,
          pet_policy: petPolicy,
          smoking_policy: smokingPolicy,
          images,
          amenities: chosenAmenities,
          document_type: docType,
          ownership_document: docFileRef,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to submit property listing");
      } else {
        router.push("/dashboard/my-homes");
      }
    } catch (err: any) {
      setError(err.message || "Network error submitting property");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    "Identity & Location",
    "Rooms & Capacity",
    "Amenities",
    "Photo Gallery",
    "Ownership Proof",
    "Rules & Pricing",
    "Review & Publish",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 px-2 sm:px-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-teal-950 p-6 sm:p-8 rounded-3xl text-white shadow-luxury relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="teal" className="text-[10px] tracking-wider uppercase font-bold py-0.5">
                Official Host Onboarding
              </Badge>
              <span className="text-xs text-teal-300 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Reciprocal Program
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif">
              Become a Wrap-Up Host
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              List your authentic home in India or worldwide. Earn exchange credits every time you host fellow verified travelers.
            </p>
          </div>
          <div className="text-right flex-shrink-0 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-teal-200 block">Moderation SLA</span>
            <span className="text-xs font-bold text-white flex items-center gap-1 justify-end">
              <Clock className="h-3.5 w-3.5 text-teal-400" />
              Reviewed in 2-4 Hours
            </span>
          </div>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-subtle space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[11px]">
              {currentStep}
            </span>
            <span className="font-bold text-navy-950 uppercase tracking-wide">
              Step {currentStep} of 7: {steps[currentStep - 1]}
            </span>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
            {Math.round((currentStep / 7) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-teal-600 to-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
        <div className="hidden sm:grid grid-cols-7 gap-1 pt-1 text-[10px] text-slate-400 font-medium">
          {steps.map((s, idx) => (
            <span
              key={s}
              className={`text-center truncate ${
                idx + 1 === currentStep
                  ? "text-teal-700 font-bold"
                  : idx + 1 < currentStep
                  ? "text-emerald-600 font-semibold"
                  : "text-slate-400"
              }`}
            >
              {idx + 1 < currentStep ? "✓ " : ""}{s}
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-shake">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP CONTAINER */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-luxury space-y-6">
        {/* STEP 1: IDENTITY & LOCATION */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950 font-serif">
                Property Identity & Location
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All fields marked with <span className="text-rose-600 font-bold">*</span> are required for trust and safety verification.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1">
                Listing Title <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Upper Lake Heritage Garden Villa & Terrace"
                className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium placeholder:text-slate-400"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Choose an evocative title mentioning location and architectural charm.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Property Category <span className="text-rose-600">*</span>
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer font-medium bg-white"
                >
                  <option value="apartment">Modern Apartment / Flat</option>
                  <option value="villa">Private Villa & Garden</option>
                  <option value="independent_house">Independent Heritage House</option>
                  <option value="penthouse">Luxury Duplex Penthouse</option>
                  <option value="studio">Artist / Work Studio</option>
                  <option value="cottage">Mountain / Lake Cottage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Country <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="India"
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1">
                Full Description <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the atmosphere, natural light, views, neighborhood vibe, proximity to landmarks, and why guests will love staying here..."
                className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium placeholder:text-slate-400 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  City <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bhopal, Goa, Jaipur"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  State / Province <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Madhya Pradesh, Goa"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  PIN / Postal Code <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 462001"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Locality / Neighbourhood <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={neighbourhood}
                  onChange={(e) => setNeighbourhood(e.target.value)}
                  placeholder="e.g. Shamla Hills, Arera Colony, Candolim"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Exact Street Address <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={exactAddress}
                  onChange={(e) => setExactAddress(e.target.value)}
                  placeholder="House / Flat No., Building, Street Name"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
                <span className="text-[10px] text-teal-700 flex items-center gap-1 mt-1 font-semibold">
                  <Lock className="h-3 w-3" />
                  Protected: Revealed only to confirmed, vetted guests upon exchange confirmation.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SPACES & CAPACITY */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950 font-serif">
                Rooms, Beds & Capacity
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Accurate capacity details ensure guests choose homes matching their travel party.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <span className="block text-xs font-bold text-navy-950">
                  Bedrooms <span className="text-rose-600">*</span>
                </span>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBedrooms(Math.max(0, bedrooms - 1))}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold text-navy-950 w-6">{bedrooms}</span>
                  <button
                    type="button"
                    onClick={() => setBedrooms(bedrooms + 1)}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <span className="block text-xs font-bold text-navy-950">
                  Beds <span className="text-rose-600">*</span>
                </span>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBeds(Math.max(1, beds - 1))}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold text-navy-950 w-6">{beds}</span>
                  <button
                    type="button"
                    onClick={() => setBeds(beds + 1)}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <span className="block text-xs font-bold text-navy-950">
                  Bathrooms <span className="text-rose-600">*</span>
                </span>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBathrooms(Math.max(1, bathrooms - 0.5))}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold text-navy-950 w-6">{bathrooms}</span>
                  <button
                    type="button"
                    onClick={() => setBathrooms(bathrooms + 0.5)}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <span className="block text-xs font-bold text-navy-950">
                  Max Guests <span className="text-rose-600">*</span>
                </span>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMaxGuests(Math.max(1, maxGuests - 1))}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold text-navy-950 w-6">{maxGuests}</span>
                  <button
                    type="button"
                    onClick={() => setMaxGuests(maxGuests + 1)}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Living Area (Square Feet)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={squareFeet || ""}
                  onChange={(e) => setSquareFeet(Number(e.target.value) || undefined)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Floor Number (Optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2"
                  value={floorNumber || ""}
                  onChange={(e) => setFloorNumber(Number(e.target.value) || undefined)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SIGNATURE AMENITIES */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950 font-serif">
                Select Signature Amenities
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Highlight amenities available in your residence for holidaymakers and remote workers.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MASTER_AMENITIES.map((am) => {
                const isSelected = selectedAmenityIds.includes(am.id);
                return (
                  <button
                    key={am.id}
                    type="button"
                    onClick={() => toggleAmenity(am.id)}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between text-xs font-semibold transition-all ${
                      isSelected
                        ? "border-teal-500 bg-teal-50/80 text-teal-950 ring-2 ring-teal-500/20 shadow-xs"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <span>{am.name}</span>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-teal-600 flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: PROPERTY PHOTO GALLERY */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-navy-950 font-serif">
                  Property Photography <span className="text-rose-600">*</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload authentic photos from your phone camera or gallery. Minimum 1 photo required.
                </p>
              </div>
              <Badge variant="teal" className="text-xs py-1">
                {images.length} Photos Added
              </Badge>
            </div>

            {/* Real Upload Trigger */}
            <input
              type="file"
              ref={photoInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              multiple
              className="sr-only"
              id="property-photo-upload"
            />
            <label
              htmlFor="property-photo-upload"
              className="block border-2 border-dashed border-teal-500/60 hover:border-teal-600 bg-teal-50/40 hover:bg-teal-50/70 transition-all rounded-3xl p-6 text-center cursor-pointer shadow-xs"
            >
              {isCompressingPhotos ? (
                <div className="flex items-center justify-center gap-2 text-teal-900 text-xs font-bold animate-pulse">
                  <Loader2 className="h-6 w-6 animate-spin text-teal-700" />
                  <span>Processing & Optimizing Photos...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-sm">
                    <Camera className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-navy-950">
                    Tap to Choose Photos from Camera or Gallery
                  </p>
                  <p className="text-xs text-slate-500">
                    Select living room, bedrooms, kitchen, views, and terrace. Auto-compressed for rapid loading.
                  </p>
                </div>
              )}
            </label>

            {/* Gallery Grid */}
            {images.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-navy-950 block">Uploaded Photo Previews:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 bg-slate-100 group ${
                        img.is_cover ? "border-teal-500 ring-2 ring-teal-500/20 shadow-md" : "border-slate-200"
                      }`}
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-2.5">
                        <div className="flex items-center justify-between">
                          {img.is_cover ? (
                            <Badge variant="teal" className="text-[9px] py-0 font-bold">
                              ★ Cover Photo
                            </Badge>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setCoverPhoto(img.id)}
                              className="px-2 py-0.5 rounded-lg bg-navy-950/80 text-white text-[9px] font-bold hover:bg-teal-600 transition-colors"
                            >
                              Set as Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removePhoto(img.id)}
                            className="p-1 rounded-lg bg-rose-600/90 text-white hover:bg-rose-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-[10px] text-white/90 truncate font-medium">
                          {img.caption || "Living space"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optional URL Adder for desktop */}
            <details className="text-xs text-slate-500 pt-2">
              <summary className="cursor-pointer font-bold text-teal-800 hover:text-teal-950">
                + Or add via external image URL (Optional)
              </summary>
              <div className="flex flex-col sm:flex-row gap-2 mt-2 pt-2 border-t border-slate-100">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={manualImageUrl}
                  onChange={(e) => setManualImageUrl(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
                <input
                  type="text"
                  placeholder="Caption (e.g. Master Suite)"
                  value={manualCaption}
                  onChange={(e) => setManualCaption(e.target.value)}
                  className="p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 sm:w-44"
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleAddManualPhoto}>
                  Add URL
                </Button>
              </div>
            </details>
          </div>
        )}

        {/* STEP 5: OWNERSHIP & LEGAL AUTHORITY PROOF DOCUMENT */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="teal" className="text-[10px] uppercase font-bold">
                  DPDP 2023 Secure Vault
                </Badge>
                <span className="text-xs text-teal-700 font-semibold">Step 5 of 7</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950 font-serif mt-1">
                Property Ownership & Authority Proof <span className="text-rose-600">*</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                To guarantee 100% genuine reciprocal stays, every host must provide proof of residence authority before listings are published live.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1">
                Select Document Verification Type <span className="text-rose-600">*</span>
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer font-medium bg-white"
              >
                <option value="utility_bill">Electricity / Water / Gas Utility Bill (Within 3 months)</option>
                <option value="property_registry">Registered Property Sale Deed / Registry / Conveyance</option>
                <option value="rental_agreement">Registered Rent / Lease Agreement & NOC</option>
                <option value="tax_receipt">Municipal Corporation Property Tax Assessment Receipt</option>
              </select>
            </div>

            {/* Document File Uploader */}
            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1">
                Upload Ownership Document (PDF, PNG, JPG) <span className="text-rose-600">*</span>
              </label>
              <input
                type="file"
                ref={docInputRef}
                onChange={handleDocUpload}
                accept="application/pdf, image/*"
                className="sr-only"
                id="ownership-doc-upload"
              />

              {docFileName ? (
                <label
                  htmlFor="ownership-doc-upload"
                  className="block w-full bg-emerald-50/95 hover:bg-emerald-100/70 transition-colors p-4 rounded-2xl border-2 border-emerald-400 text-left cursor-pointer shadow-xs"
                >
                  <div className="flex items-start gap-3 w-full min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="success" className="text-[10px] py-0.5 px-2 font-bold tracking-wide flex-shrink-0">
                          ✓ Document Attached
                        </Badge>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded-md flex-shrink-0 uppercase">
                          {docType.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-emerald-950 break-all leading-snug">
                        {docFileName}
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        Proof attached and ready for admin verification review
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-emerald-200/80 flex items-center justify-between text-xs text-emerald-800">
                    <span className="text-[11px] text-emerald-700">Need to change file?</span>
                    <span className="font-bold underline hover:text-emerald-950">
                      Tap to replace file →
                    </span>
                  </div>
                </label>
              ) : (
                <label
                  htmlFor="ownership-doc-upload"
                  className="block border-2 border-dashed border-teal-500/60 hover:border-teal-600 bg-teal-50/40 hover:bg-teal-50/70 transition-all rounded-3xl p-6 text-center cursor-pointer shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-sm">
                      <FileText className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-navy-950">
                      Tap to Select Document File (PDF, Image)
                    </p>
                    <p className="text-xs text-slate-500">
                      Max file size: 25MB. Securely encrypted and protected under India DPDP Act 2023.
                    </p>
                  </div>
                </label>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-navy-950">
                <Lock className="h-4 w-4 text-teal-700" />
                <span>Confidentiality & Legal Safe Harbor:</span>
              </div>
              <p>
                Ownership proofs are stored in isolated encrypted cloud storage. They are strictly reviewed by authorized trust officers and are NEVER displayed publicly or shared with guests.
              </p>
            </div>
          </div>
        )}

        {/* STEP 6: PRICING & HOUSE POLICIES */}
        {currentStep === 6 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950 font-serif">
                Exchange Pricing & House Policies
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Set fair credit exchange rates and community stay guidelines.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-navy-950">
                    Exchange Points per Night <span className="text-rose-600">*</span>
                  </span>
                  <span className="text-[11px] text-teal-800">
                    Average for {city || "your city"}: 50 - 120 points/night
                  </span>
                </div>
                <span className="text-2xl font-bold text-teal-800 font-mono">
                  {creditsPerNight} pts
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="250"
                step="5"
                value={creditsPerNight}
                onChange={(e) => setCreditsPerNight(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Min Stay (Nights) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={minStayNights}
                  onChange={(e) => setMinStayNights(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Max Stay (Nights) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={maxStayNights}
                  onChange={(e) => setMaxStayNights(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Pet Policy <span className="text-rose-600">*</span>
                </label>
                <select
                  value={petPolicy}
                  onChange={(e) => setPetPolicy(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium bg-white"
                >
                  <option value="not_allowed">Pets Not Allowed</option>
                  <option value="allowed">Pets Welcome (Pre-approval)</option>
                  <option value="cats_only">Cats Only</option>
                  <option value="dogs_only">Dogs Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Smoking Policy <span className="text-rose-600">*</span>
                </label>
                <select
                  value={smokingPolicy}
                  onChange={(e) => setSmokingPolicy(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium bg-white"
                >
                  <option value="forbidden">Strictly Non-Smoking</option>
                  <option value="outdoor_only">Outdoor Balcony / Terrace Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1">House Rules</label>
              <textarea
                rows={3}
                value={houseRules}
                onChange={(e) => setHouseRules(e.target.value)}
                placeholder="Specific quiet hours, shoe policies, pool rules, etc."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium"
              />
            </div>
          </div>
        )}

        {/* STEP 7: REVIEW & LEGAL ATTESTATION */}
        {currentStep === 7 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950 font-serif">
                Review & Submit for Verification
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review your property listing summary before it is submitted to the admin moderation queue.
              </p>
            </div>

            {/* Listing Summary Preview Card */}
            <div className="rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-50/50">
              <div className="relative aspect-[16/9] w-full bg-slate-100">
                {images.length > 0 ? (
                  <img
                    src={images.find((i) => i.is_cover)?.image_url || images[0].image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                    No cover photo attached
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <Badge variant="warning" className="font-bold text-xs">
                    Pending Admin Moderation
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 rounded-full bg-navy-950/90 text-white text-xs font-bold">
                    {creditsPerNight} pts / night
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-navy-950">{title || "Untitled Property"}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-teal-600 flex-shrink-0" />
                    <span>{neighbourhood}, {city}, {state}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Type</span>
                    <span className="font-bold text-navy-950 capitalize">{propertyType}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Spaces</span>
                    <span className="font-bold text-navy-950">{bedrooms} Bed • {bathrooms} Bath</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Capacity</span>
                    <span className="font-bold text-navy-950">Max {maxGuests} Guests</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Photos</span>
                    <span className="font-bold text-navy-950">{images.length} Photos</span>
                  </div>
                </div>

                {/* Attached Document Summary */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-emerald-700 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="font-bold text-emerald-950 block truncate">
                      Ownership Proof: {docFileName || "Attached Document File"}
                    </span>
                    <span className="text-[10px] text-emerald-700">
                      Type: {docType.toUpperCase()} • Ready for Trust & Safety review
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mandatory Attestation Checkboxes */}
            <div className="space-y-3 p-5 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs">
              <span className="font-bold text-navy-950 block text-xs">
                Host Authority & Legal Attestations <span className="text-rose-600">*</span>:
              </span>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={confirmedAuthority}
                  onChange={(e) => setConfirmedAuthority(e.target.checked)}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                />
                <span className="text-slate-700 leading-snug">
                  I certify under penalty of perjury that I am the legal owner or authorized primary tenant of this residence with full legal authority to host guests. <span className="text-rose-600 font-bold">*</span>
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={acknowledgedRules}
                  onChange={(e) => setAcknowledgedRules(e.target.checked)}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                />
                <span className="text-slate-700 leading-snug">
                  I agree to the Wrap-Up Host Code of Conduct, safety standards, reciprocal exchange terms, and verification guidelines. <span className="text-rose-600 font-bold">*</span>
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEPPER NAVIGATION BUTTONS */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleBack}
              disabled={isSubmitting}
              className="font-bold"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Previous Step
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 7 ? (
            <Button
              type="button"
              variant="teal"
              size="md"
              onClick={handleNext}
              className="font-bold shadow-md px-6"
            >
              Continue to Step {currentStep + 1}
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="teal"
              size="lg"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              className="font-bold shadow-lg px-8 text-sm"
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              Submit Home for Admin Approval
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
