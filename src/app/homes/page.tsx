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
  Map as MapIcon,
  List,
  SlidersHorizontal,
  X,
  Bed,
  Bath,
  Users,
} from "lucide-react";
import { Property } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PropertyMap from "@/components/maps/PropertyMap";

function ExploreHomesContent() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get("city") || "";
  const initialGuests = searchParams.get("guests") ? Number(searchParams.get("guests")) : 1;

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"split" | "list" | "map">("split");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Filters
  const [city, setCity] = useState(initialCity);
  const [guests, setGuests] = useState(initialGuests);
  const [minCredits, setMinCredits] = useState<number>(0);
  const [maxCredits, setMaxCredits] = useState<number>(200);
  const [propertyType, setPropertyType] = useState<string>("all");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"relevance" | "price_asc" | "price_desc" | "newest">("relevance");

  const fetchHomes = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (city.trim()) params.set("city", city.trim());
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
  }, [city, guests, minCredits, maxCredits, propertyType, verifiedOnly, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* FILTER BAR */}
      <div className="sticky top-20 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 shadow-subtle">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Quick Search Controls */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-sm">
              <MapPin className="h-4 w-4 text-teal-600" />
              <input
                type="text"
                placeholder="Search city, e.g. Goa, Bhopal..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-transparent font-medium text-navy-950 placeholder-slate-400 focus:outline-none w-40 sm:w-48"
              />
              {city && (
                <button onClick={() => setCity("")} className="text-slate-400 hover:text-slate-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none"
            >
              <option value={1}>1+ Guests</option>
              <option value={2}>2+ Guests</option>
              <option value={4}>4+ Guests</option>
              <option value={6}>6+ Guests</option>
            </select>

            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none"
            >
              <option value="all">All Home Types</option>
              <option value="villa">Villas</option>
              <option value="apartment">Apartments</option>
              <option value="independent_house">Independent Houses</option>
              <option value="penthouse">Penthouses</option>
            </select>

            <label className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer px-2.5 py-1.5 rounded-xl hover:bg-slate-100">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span>Verified Only</span>
            </label>
          </div>

          {/* Right Controls: Sort & Map Toggle */}
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-navy-950 focus:outline-none cursor-pointer"
            >
              <option value="relevance">Sort: Recommended</option>
              <option value="price_asc">Credits: Low to High</option>
              <option value="price_desc">Credits: High to Low</option>
              <option value="newest">Newest Additions</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                onClick={() => setViewMode("split")}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  viewMode === "split" ? "bg-white text-navy-950 shadow-sm" : "text-slate-500"
                }`}
                title="Split Map & List"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden lg:inline">Split</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  viewMode === "list" ? "bg-white text-navy-950 shadow-sm" : "text-slate-500"
                }`}
                title="List Only"
              >
                <List className="h-4 w-4" />
                <span className="hidden lg:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  viewMode === "map" ? "bg-white text-navy-950 shadow-sm" : "text-slate-500"
                }`}
                title="Map Only"
              >
                <MapIcon className="h-4 w-4" />
                <span className="hidden lg:inline">Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-navy-950">{properties.length}</strong> verified homes
            {city && <span> in "{city}"</span>}
          </span>
          <span className="text-[11px] text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full font-medium">
            Approximate locations displayed for host privacy
          </span>
        </div>

        {/* LAYOUT CONTAINER */}
        <div
          className={`grid gap-6 ${
            viewMode === "split"
              ? "grid-cols-1 lg:grid-cols-12"
              : viewMode === "map"
              ? "grid-cols-1"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {/* LISTINGS COLUMN */}
          {viewMode !== "map" && (
            <div
              className={`${
                viewMode === "split"
                  ? "lg:col-span-7 space-y-4"
                  : "col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              }`}
            >
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-64 rounded-3xl bg-slate-200/60 animate-pulse border border-slate-200"
                  />
                ))
              ) : properties.length === 0 ? (
                <div className="col-span-full p-12 text-center rounded-3xl bg-white border border-slate-200">
                  <MapPin className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-navy-950">No verified homes match your criteria</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                    Try clearing destination keywords, expanding guest capacity, or resetting filters to view all listings.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setCity("");
                      setGuests(1);
                      setPropertyType("all");
                      setVerifiedOnly(false);
                    }}
                  >
                    Reset All Filters
                  </Button>
                </div>
              ) : (
                properties.map((home) => {
                  const isSelected = home.id === selectedPropertyId;
                  return (
                    <div
                      key={home.id}
                      onMouseEnter={() => setSelectedPropertyId(home.id)}
                      className={`group rounded-3xl bg-white border transition-all duration-300 overflow-hidden flex flex-col sm:flex-row ${
                        viewMode === "split" ? "h-auto sm:h-52" : "flex-col h-auto"
                      } ${
                        isSelected
                          ? "border-teal-500 ring-2 ring-teal-500/20 shadow-luxury"
                          : "border-slate-200/90 shadow-subtle hover:border-slate-300 hover:shadow-card"
                      }`}
                    >
                      {/* Photo Thumbnail */}
                      <Link
                        href={`/homes/${home.id}`}
                        className={`relative overflow-hidden bg-slate-100 flex-shrink-0 ${
                          viewMode === "split" ? "w-full sm:w-56 h-48 sm:h-full" : "w-full aspect-[4/3]"
                        }`}
                      >
                        <img
                          src={home.images[0]?.image_url}
                          alt={home.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-navy-950/80 backdrop-blur-md text-white text-[10px] font-bold">
                            {home.property_type.replace("_", " ")}
                          </span>
                        </div>
                      </Link>

                      {/* Content Info */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span className="flex items-center gap-1 font-semibold text-slate-700">
                              <MapPin className="h-3.5 w-3.5 text-teal-600" />
                              {home.neighbourhood}, {home.city}
                            </span>
                            <span className="flex items-center gap-1 font-bold text-amber-500">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              {home.rating} ({home.review_count})
                            </span>
                          </div>

                          <Link href={`/homes/${home.id}`}>
                            <h3 className="font-bold text-navy-950 text-base group-hover:text-teal-700 transition-colors line-clamp-1">
                              {home.title}
                            </h3>
                          </Link>

                          <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                            {home.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <Bed className="h-3.5 w-3.5 text-slate-400" />
                              {home.bedrooms} bed
                            </span>
                            <span className="flex items-center gap-1">
                              <Bath className="h-3.5 w-3.5 text-slate-400" />
                              {home.bathrooms} bath
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5 text-slate-400" />
                              {home.max_guests} max
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-extrabold text-teal-700">
                              {home.credits_per_night} pts
                            </span>
                            <span className="text-[11px] text-slate-400 block -mt-0.5">/ night</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* MAP COLUMN */}
          {(viewMode === "split" || viewMode === "map") && (
            <div
              className={`${
                viewMode === "split"
                  ? "lg:col-span-5 sticky top-36 h-[600px]"
                  : "col-span-full h-[750px]"
              }`}
            >
              <PropertyMap
                properties={properties}
                selectedPropertyId={selectedPropertyId}
                onSelectProperty={(id) => setSelectedPropertyId(id)}
                height="100%"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExploreHomesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm font-semibold text-slate-500">
          Loading verified homes...
        </div>
      }
    >
      <ExploreHomesContent />
    </Suspense>
  );
}
