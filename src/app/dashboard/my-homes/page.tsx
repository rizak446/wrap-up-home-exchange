"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Home, MapPin, Eye, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Property } from "@/types";

export default function MyHomesPage() {
  const { currentUser } = useAuth();
  const [homes, setHomes] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!currentUser) return;
      try {
        const res = await fetch("/api/properties");
        if (res.ok) {
          const data = await res.json();
          setHomes((data.properties || []).filter((p: Property) => p.host_id === currentUser.id));
        }
      } catch (e) {
        console.error("Failed to load user homes", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [currentUser]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 font-serif">My Listed Properties</h1>
          <p className="text-xs text-slate-500">Manage your residences, verify authority, and review published status.</p>
        </div>
        <Link href="/dashboard/add-home">
          <Button variant="teal" size="md">
            <PlusCircle className="h-4 w-4 mr-1.5" />
            Add Another Home
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-48 rounded-3xl bg-slate-200 animate-pulse" />
          <div className="h-48 rounded-3xl bg-slate-200 animate-pulse" />
        </div>
      ) : homes.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-subtle space-y-3">
          <Home className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-navy-950">You have no listed homes yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            List your primary or vacation home in Bhopal, Goa, or anywhere in India to start earning exchange credits!
          </p>
          <Link href="/dashboard/add-home">
            <Button variant="teal" size="sm">
              Launch Listing Wizard
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {homes.map((h) => (
            <div
              key={h.id}
              className="rounded-3xl bg-white border border-slate-200/80 shadow-subtle overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] w-full bg-slate-100">
                <img
                  src={h.images[0]?.image_url}
                  alt={h.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant={h.status === "published" ? "success" : "warning"}>
                    {h.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-navy-950/80 backdrop-blur-md text-white text-xs font-bold">
                    {h.credits_per_night} pts / nt
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-navy-950 text-base">{h.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-teal-600" />
                    <span>{h.neighbourhood}, {h.city}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  {h.bedrooms} Bed • {h.bathrooms} Bath • Max {h.max_guests} Guests
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-teal-700 font-semibold">
                    {h.verification_status === "verified" ? "✓ Verified Property" : "Verification in progress"}
                  </span>
                  <Link href={`/homes/${h.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Public Preview
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
