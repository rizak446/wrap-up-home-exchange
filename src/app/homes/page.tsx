"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  MapPin,
  Star,
  ShieldCheck,
  Coins,
  X,
  Bed,
  Bath,
  Users,
  LocateFixed,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Property } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const POPULAR_DESTINATIONS = [
  "All Destinations",
  "Bhopal",
  "Goa",
  "Jaipur",
  "Bengaluru",
  "Mumbai",
  "Delhi",
];

function ExploreHomesContent() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get("city") || "";
  const initialGuests = searchParams.get("guests") ? Number(searchParams.get("guests")) : 1;

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [city, setCity] = useState(initialCity);
  const [debouncedCity, setDebouncedCity] = useState(initialCity);
  const [guests, setGuests] = useState(initialGuests);
  const [minCredits, setMinCredits] = useState<number>(0);
  const [maxCredits, setMaxCredits] = useState<number>(200);
  const [propertyType, setPropertyType] = useState<string>("all");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"relevance" | "price_asc" | "price_desc" | "newest">("relevance");

  // Geolocation state
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Keep city in sync if URL search param changes
  useEffect(() => {
    if (initialCity && initialCity !== city) {
      setCity(initialCity);
    }
  }, [initialCity]);

  // Debounce search input for instant, smooth typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCity(city);
    }, 250);
    return () => clearTimeout(timer);
  }, [city]);

  const handleResetFilters = () => {
    setCity("");
    setGuests(1);
    setPropertyType("all");
    setVerifiedOnly(false);
    setMinCredits(0);
    setMaxCredits(200);
    setSortBy("relevance");
  };

  const hasActiveFilters = Boolean(
    city.trim() !== "" ||
    guests > 1 ||
    propertyType !== "all" ||
    verifiedOnly ||
    minCredits > 0 ||
    maxCredits < 200 ||
    sortBy !== "relevance"
  );

  // Geolocation Detection: Auto-detect location without showing maps
  const handleDetectLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationStatus("Geolocation not supported by browser");
      setTimeout(() => setLocationStatus(null), 3500);
      return;
    }

    setIsDetectingLocation(true);
    setLocationStatus("Detecting location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (res.ok) {
            const data = await res.json();
            const detectedCity = data.city || data.locality || data.principalSubdivision;
            if (detectedCity) {
              setCity(detectedCity);
              setLocationStatus(`Detected: ${detectedCity}`);
              setTimeout(() => setLocationStatus(null), 3000);
              setIsDetectingLocation(false);
              return;
            }
          }
        } catch {
          // Geocoder fallback
        }

        // Proximity calculation against platform destinations
        const knownCities = [
          { name: "Bhopal", lat: 23.2599, lon: 77.4126 },
          { name: "Goa", lat: 15.2993, lon: 74.124 },
          { name: "Jaipur", lat: 26.9124, lon: 75.7873 },
          { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
          { name: "Mumbai", lat: 19.076, lon: 72.8777 },
          { name: "Delhi", lat: 28.7041, lon: 77.1025 },
        ];

        let closest = knownCities[0].name;
        let minDistance = Infinity;

        for (const c of knownCities) {
          const dist = Math.hypot(c.lat - latitude, c.lon - longitude);
          if (dist < minDistance) {
            minDistance = dist;
            closest = c.name;
          }
        }

        setCity(closest);
        setLocationStatus(`Detected: ${closest}`);
        setTimeout(() => setLocationStatus(null), 3000);
        setIsDetectingLocation(false);
      },
      (err) => {
        console.warn("Location error:", err);
        setLocationStatus("Please allow location access");
        setTimeout(() => setLocationStatus(null), 3500);
        setIsDetectingLocation(false);
      },
      { timeout: 7000 }
    );
  };

  const fetchHomes = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedCity.trim()) params.set("city", debouncedCity.trim());
      if (guests > 1) params.set("guests", guests.toString());
      if (minCredits > 0) params.set("minCredits", minCredits.toString());
      if (maxCredits < 200) params.set("maxCredits", maxCredits.toString());
      if (propertyType !== "all") params.set("propertyType", propertyType);
      if (verifiedOnly) params.set("verifiedOnly", "true");
      params.set("sort", sortBy);

      const res = await fetch(`/api/properties?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties || []);
      }
    } catch (e) {
      console.error("Error fetching homes", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHomes();
  }, [debouncedCity, guests, minCredits, maxCredits, propertyType, verifiedOnly, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* TOP SEARCH & FILTER BAR */}
      <div className="sticky top-20 z-30 bg-white border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 py-4 shadow-subtle backdrop-blur-md">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Main Search Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Location Search Input with Direct Auto-Detect */}
            <div className="flex items-center gap-2 flex-1 max-w-xl">
              <div className="relative flex-1 flex items-center bg-slate-100/90 hover:bg-slate-100 rounded-2xl border border-slate-200/90 px-3.5 py-2.5 transition-all focus-within:ring-2 focus-within:ring-teal-500/30 focus-within:border-teal-500 focus-within:bg-white shadow-xs">
                <Search className="h-4 w-4 text-teal-600 flex-shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search city, state or destination..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-transparent font-medium text-navy-950 placeholder-slate-400 focus:outline-none w-full text-sm"
                />
                {city && (
                  <button
                    onClick={() => setCity("")}
                    className="text-slate-400 hover:text-slate-600 p-1 mr-1 rounded-full"
                    title="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}

                {/* Detect My Location Button */}
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white hover:bg-teal-50 text-teal-700 border border-slate-200 text-xs font-semibold shadow-xs transition-colors flex-shrink-0 cursor-pointer disabled:opacity-50"
                  title="Detect my current location"
                >
                  {isDetectingLocation ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-600" />
                  ) : (
                    <LocateFixed className="h-3.5 w-3.5 text-teal-600" />
                  )}
                  <span className="hidden sm:inline">
                    {isDetectingLocation ? "Detecting..." : "Detect Location"}
                  </span>
                </button>
              </div>

              {locationStatus && (
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 animate-fade-in flex-shrink-0">
                  {locationStatus}
                </span>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none hover:bg-slate-200/60 transition-colors"
              >
                <option value={1}>1+ Guests</option>
                <option value={2}>2+ Guests</option>
                <option value={4}>4+ Guests</option>
                <option value={6}>6+ Guests</option>
              </select>

              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none hover:bg-slate-200/60 transition-colors"
              >
                <option value="all">All Home Types</option>
                <option value="villa">Villas</option>
                <option value="apartment">Apartments</option>
                <option value="independent_house">Independent Houses</option>
                <option value="penthouse">Penthouses</option>
              </select>

              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/60 border border-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Verified Only</span>
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-navy-950 focus:outline-none cursor-pointer shadow-xs hover:border-slate-400 transition-colors"
              >
                <option value="relevance">Sort: Recommended</option>
                <option value="price_asc">Credits: Low to High</option>
                <option value="price_desc">Credits: High to Low</option>
                <option value="newest">Newest Additions</option>
              </select>
            </div>
          </div>

          {/* Destination Quick Filters Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
            <span className="text-slate-400 font-semibold text-[11px] flex-shrink-0">
              Popular Destinations:
            </span>
            {POPULAR_DESTINATIONS.map((dest) => {
              const isAll = dest === "All Destinations";
              const isActive = isAll ? !city : city.toLowerCase() === dest.toLowerCase();
              return (
                <button
                  key={dest}
                  onClick={() => setCity(isAll ? "" : dest)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex-shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-navy-950 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-800 border border-slate-200/80"
                  }`}
                >
                  {dest}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Results Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm">
              Showing <strong className="text-navy-950 font-bold">{properties.length}</strong> verified {properties.length === 1 ? "home" : "homes"}
              {debouncedCity && (
                <span> in <strong className="text-teal-700 font-bold">"{debouncedCity}"</strong></span>
              )}
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-slate-400 hover:text-rose-600 font-semibold underline transition-colors ml-2 cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>100% Identity-Verified Homeowners</span>
            </span>
          </div>
        </div>

        {/* FULL WIDTH LISTINGS GRID */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-3xl bg-slate-200/70 animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white border border-slate-200 shadow-subtle max-w-2xl mx-auto my-8">
            <div className="h-14 w-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-navy-950 font-serif">
              No verified homes found {city ? `in "${city}"` : "matching criteria"}
            </h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              We currently have verified home exchanges in Bhopal, Goa, Jaipur, Bengaluru, Mumbai, and Delhi. Try searching one of these popular cities.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {["Bhopal", "Goa", "Jaipur", "Bengaluru"].map((dest) => (
                <Button
                  key={dest}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCity(dest);
                    setGuests(1);
                    setPropertyType("all");
                    setVerifiedOnly(false);
                  }}
                  className="rounded-full text-xs hover:border-teal-400 hover:text-teal-700"
                >
                  Explore {dest}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4 text-slate-500 hover:text-navy-950 cursor-pointer"
              onClick={handleResetFilters}
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((home) => (
              <div
                key={home.id}
                className="group watery-card rounded-3xl bg-white border border-slate-200/90 shadow-subtle hover:border-slate-300 hover:shadow-luxury transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                {/* Photo Thumbnail */}
                <Link
                  href={`/homes/${home.id}`}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 block cursor-pointer"
                >
                  <img
                    src={home.images?.[0]?.image_url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80"}
                    alt={home.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-navy-950/80 backdrop-blur-md text-white text-[11px] font-bold shadow-sm capitalize">
                      {home.property_type.replace("_", " ")}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-navy-950 text-[11px] font-bold shadow-sm flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{home.rating}</span>
                    </span>
                  </div>
                </Link>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-xs font-semibold text-slate-500 mb-1">
                      <MapPin className="h-3.5 w-3.5 text-teal-600 mr-1 flex-shrink-0" />
                      <span className="truncate">{home.neighbourhood}, {home.city}</span>
                    </div>

                    <Link href={`/homes/${home.id}`}>
                      <h3 className="font-bold text-navy-950 text-base group-hover:text-teal-700 transition-colors line-clamp-1 leading-snug">
                        {home.title}
                      </h3>
                    </Link>

                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {home.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-medium">
                        <Bed className="h-3.5 w-3.5 text-slate-400" />
                        {home.bedrooms}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Bath className="h-3.5 w-3.5 text-slate-400" />
                        {home.bathrooms}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        {home.max_guests}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-teal-700">
                        {home.credits_per_night} pts
                      </span>
                      <span className="text-[11px] text-slate-400 block -mt-1 font-medium">
                        / night
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExploreHomesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-24 text-center text-sm font-semibold text-slate-500">
          Loading verified homes...
        </div>
      }
    >
      <ExploreHomesContent />
    </Suspense>
  );
}
