"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MASTER_AMENITIES } from "@/lib/data/mock-db";
import { Amenity, PropertyImage } from "@/types";

export default function AddHomePage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State across 7 steps
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState<any>("apartment");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("Madhya Pradesh");
  const [city, setCity] = useState("Bhopal");
  const [neighbourhood, setNeighbourhood] = useState("Shamla Hills");
  const [postalCode, setPostalCode] = useState("462013");
  const [exactAddress, setExactAddress] = useState("Flat 302, Lake Promenade Towers, Shamla Hills");

  // Step 2: Details
  const [bedrooms, setBedrooms] = useState(2);
  const [beds, setBeds] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [maxGuests, setMaxGuests] = useState(4);
  const [squareFeet, setSquareFeet] = useState<number | undefined>(1800);
  const [floorNumber, setFloorNumber] = useState<number | undefined>(3);

  // Step 3: Amenities
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>([
    "am-1", // wifi
    "am-2", // ac
    "am-5", // kitchen
    "am-8", // power backup
  ]);

  // Step 4: Photos
  const [images, setImages] = useState<PropertyImage[]>([
    {
      id: "img-demo-1",
      property_id: "temp",
      image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
      caption: "Spacious main salon with balcony",
      display_order: 1,
      is_cover: true,
    },
    {
      id: "img-demo-2",
      property_id: "temp",
      image_url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop&q=80",
      caption: "Master bedroom suite",
      display_order: 2,
      is_cover: false,
    },
  ]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageCaption, setNewImageCaption] = useState("");

  // Step 5: Availability
  const [minStayNights, setMinStayNights] = useState(2);
  const [maxStayNights, setMaxStayNights] = useState(14);
  const [checkInStart, setCheckInStart] = useState("14:00");
  const [checkOutEnd, setCheckOutEnd] = useState("11:00");
  const [advanceBookingDays, setAdvanceBookingDays] = useState(90);

  // Step 6: Rules & Pricing
  const [creditsPerNight, setCreditsPerNight] = useState(75);
  const [houseRules, setHouseRules] = useState(
    "Quiet hours after 10 PM. No loud parties. Please treat the home with mutual respect."
  );
  const [cleaningExpectations, setCleaningExpectations] = useState(
    "Please leave dishes in the dishwasher and dispose of kitchen waste."
  );
  const [petPolicy, setPetPolicy] = useState<any>("not_allowed");
  const [smokingPolicy, setSmokingPolicy] = useState<any>("forbidden");

  // Step 7: Attestation
  const [acknowledgedRules, setAcknowledgedRules] = useState(false);
  const [confirmedAuthority, setConfirmedAuthority] = useState(false);

  const toggleAmenity = (id: string) => {
    setSelectedAmenityIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddPhoto = () => {
    if (!newImageUrl.trim()) return;
    const newImg: PropertyImage = {
      id: `img-${Date.now()}`,
      property_id: "temp",
      image_url: newImageUrl.trim(),
      caption: newImageCaption.trim() || undefined,
      display_order: images.length + 1,
      is_cover: images.length === 0,
    };
    setImages([...images, newImg]);
    setNewImageUrl("");
    setNewImageCaption("");
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
    setImages(images.filter((img) => img.id !== imgId));
  };

  const handleSubmit = async () => {
    if (!currentUser) return;
    if (!acknowledgedRules || !confirmedAuthority) {
      setError("Please complete all required safety acknowledgements before submission.");
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
          title,
          property_type: propertyType,
          description,
          country,
          state,
          city,
          neighbourhood,
          postal_code: postalCode,
          exact_address: exactAddress,
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
    "Basic Info",
    "Details",
    "Amenities",
    "Photos",
    "Availability",
    "Exchange Rules",
    "Review & Publish",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Step Indicator Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Step {currentStep} of 7: {steps[currentStep - 1]}
          </span>
          <span className="text-xs text-slate-400">
            {Math.round((currentStep / 7) * 100)}% Complete
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-teal-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP CONTAINER */}
      <div className="rounded-3xl bg-white p-6 sm:p-10 border border-slate-200 shadow-luxury space-y-6">
        {/* STEP 1: BASIC INFORMATION */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-navy-950 font-serif">Basic Property Information</h2>
            <p className="text-xs text-slate-500">Provide an evocative title and describe your home to fellow members and travelers.</p>

            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1">Listing Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Upper Lake Heritage Garden Villa"
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1">Property Category</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="apartment">Modern Apartment</option>
                <option value="villa">Private Villa & Pool</option>
                <option value="independent_house">Independent Heritage House</option>
                <option value="penthouse">Duplex Penthouse</option>
                <option value="studio">Artist / Work Studio</option>
                <option value="cottage">Mountain / Plantation Cottage</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1">Full Description</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the atmosphere, views, natural light, neighbourhood vibe, and what makes your home special..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bhopal, Goa, Jaipur..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Neighbourhood</label>
                <input
                  type="text"
                  required
                  value={neighbourhood}
                  onChange={(e) => setNeighbourhood(e.target.value)}
                  placeholder="Shamla Hills, Candolim..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="462013"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Exact Address with Shield Warning */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-navy-950">
                  Exact Physical Street Address
                </label>
                <span className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Shielded from public view
                </span>
              </div>
              <input
                type="text"
                required
                value={exactAddress}
                onChange={(e) => setExactAddress(e.target.value)}
                placeholder="House / Flat No, Building Name, Street..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Your exact physical address is strictly protected and will never appear on public search results. It is disclosed only to guests whose reservation requests you formally accept.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: PROPERTY DETAILS */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-navy-950 font-serif">Property Capacity & Dimensions</h2>
            <p className="text-xs text-slate-500">Provide accurate bedroom and bed counts to prevent overcrowding.</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Bedrooms</label>
                <input
                  type="number"
                  min={0}
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Total Beds</label>
                <input
                  type="number"
                  min={1}
                  value={beds}
                  onChange={(e) => setBeds(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Bathrooms</label>
                <input
                  type="number"
                  step={0.5}
                  min={0.5}
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Max Guests</label>
                <input
                  type="number"
                  min={1}
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Square Feet (Approx)</label>
                <input
                  type="number"
                  placeholder="e.g. 2400"
                  value={squareFeet || ""}
                  onChange={(e) => setSquareFeet(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Floor Level</label>
                <input
                  type="number"
                  placeholder="e.g. 2"
                  value={floorNumber || ""}
                  onChange={(e) => setFloorNumber(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: AMENITIES */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-navy-950 font-serif">Select Property Amenities</h2>
            <p className="text-xs text-slate-500">Highlight amenities that make your residence comfortable for holidaymakers or remote professionals.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {MASTER_AMENITIES.map((am) => {
                const isSelected = selectedAmenityIds.includes(am.id);
                return (
                  <button
                    key={am.id}
                    type="button"
                    onClick={() => toggleAmenity(am.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between text-xs font-semibold transition-all ${
                      isSelected
                        ? "border-teal-500 bg-teal-50/60 text-teal-900 ring-2 ring-teal-500/20"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span>{am.name}</span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-teal-600 flex-shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: PHOTOS */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-navy-950 font-serif">Property Photography</h2>
            <p className="text-xs text-slate-500">Add vibrant, authentic photography of your residence. Select a cover image.</p>

            {/* Photo Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 bg-slate-100 ${
                    img.is_cover ? "border-teal-500 ring-2 ring-teal-500/20" : "border-slate-200"
                  }`}
                >
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  {img.is_cover && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-bold">
                        Cover
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    {!img.is_cover && (
                      <button
                        type="button"
                        onClick={() => setCoverPhoto(img.id)}
                        className="px-2 py-1 rounded-lg bg-navy-950/80 text-white text-[10px] font-bold"
                      >
                        Set as Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(img.id)}
                      className="p-1 rounded-lg bg-rose-600/90 text-white hover:bg-rose-700 ml-auto"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Image Input */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="block text-xs font-bold text-navy-950">Add Photo from URL or Storage</span>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
                <input
                  type="text"
                  placeholder="Caption (e.g. Master Bedroom)"
                  value={newImageCaption}
                  onChange={(e) => setNewImageCaption(e.target.value)}
                  className="p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 sm:w-48"
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleAddPhoto}>
                  Add Photo
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: AVAILABILITY */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-navy-950 font-serif">Availability & Stay Windows</h2>
            <p className="text-xs text-slate-500">Configure minimum stay lengths and check-in times to suit your schedule.</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Minimum Stay (Nights)</label>
                <input
                  type="number"
                  min={1}
                  value={minStayNights}
                  onChange={(e) => setMinStayNights(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Maximum Stay (Nights)</label>
                <input
                  type="number"
                  min={minStayNights}
                  value={maxStayNights}
                  onChange={(e) => setMaxStayNights(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Check-in Window</label>
                <input
                  type="text"
                  value={checkInStart}
                  onChange={(e) => setCheckInStart(e.target.value)}
                  placeholder="14:00"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Check-out By</label>
                <input
                  type="text"
                  value={checkOutEnd}
                  onChange={(e) => setCheckOutEnd(e.target.value)}
                  placeholder="11:00"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: EXCHANGE RULES & PRICING */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-navy-950 font-serif">Credit Pricing & House Customs</h2>
            <p className="text-xs text-slate-500">Set your nightly exchange credits and specify expectations for visiting members.</p>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
              <label className="block text-xs font-bold text-navy-950 mb-1">Nightly Credits Rate</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={10}
                  max={300}
                  value={creditsPerNight}
                  onChange={(e) => setCreditsPerNight(Number(e.target.value))}
                  className="w-32 p-2.5 rounded-xl border border-slate-300 text-sm font-extrabold text-teal-800"
                />
                <span className="text-xs text-slate-600 font-semibold">credits per night earned by you upon completed stay</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-950 mb-1">House Rules & Customs</label>
              <textarea
                rows={3}
                value={houseRules}
                onChange={(e) => setHouseRules(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Pet Policy</label>
                <select
                  value={petPolicy}
                  onChange={(e) => setPetPolicy(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                >
                  <option value="not_allowed">No Pets</option>
                  <option value="allowed">Pets Allowed</option>
                  <option value="on_request">Pets on Prior Request</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">Smoking Policy</label>
                <select
                  value={smokingPolicy}
                  onChange={(e) => setSmokingPolicy(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                >
                  <option value="forbidden">Strictly Forbidden</option>
                  <option value="allowed_outdoors">Allowed Outdoors Only</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: VERIFICATION AND REVIEW */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-navy-950 font-serif">Review & Submit for Moderation</h2>
            <p className="text-xs text-slate-500">Your property will undergo moderation by our Trust & Safety team before being published.</p>

            {/* Summary Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <div className="flex justify-between font-bold text-sm text-navy-950">
                <span>{title || "Untitled Property"}</span>
                <span className="text-teal-700">{creditsPerNight} pts / night</span>
              </div>
              <div className="text-slate-600">
                {bedrooms} Bed • {bathrooms} Bath • Max {maxGuests} Guests • {city}, {country}
              </div>
              <div className="text-slate-500 italic">
                "{description.slice(0, 160)}..."
              </div>
            </div>

            {/* Legal Attestation Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedAuthority}
                  onChange={(e) => setConfirmedAuthority(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>
                  <strong>Authority to Host:</strong> I attest that I am the legal owner or authorized occupant of this residence, and that hosting temporary exchange guests complies with applicable local building/RWA bylaws.
                </span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acknowledgedRules}
                  onChange={(e) => setAcknowledgedRules(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>
                  <strong>Safe Community Standards:</strong> I agree to provide a clean, secure home with functional emergency precautions, and understand exact address details are revealed only to confirmed guests.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Previous
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 7 ? (
            <Button
              type="button"
              variant="teal"
              size="md"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next Step <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="teal"
              size="md"
              isLoading={isSubmitting}
              onClick={handleSubmit}
            >
              Submit Listing for Verification
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
