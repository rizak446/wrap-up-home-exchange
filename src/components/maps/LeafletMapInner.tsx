"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { Property } from "@/types";

interface LeafletMapInnerProps {
  properties: Property[];
  selectedPropertyId?: string | null;
  onSelectProperty?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  isApproximateRadius?: boolean;
}

export default function LeafletMapInner({
  properties,
  selectedPropertyId,
  onSelectProperty,
  center = [20.5937, 78.9629],
  zoom = 5,
  height = "500px",
  isApproximateRadius = false,
}: LeafletMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const circleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      // CartoDB Positron tiles for a sleek, premium, elegant travel map look
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
          maxZoom: 19,
        }
      ).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    if (circleRef.current) {
      circleRef.current.remove();
      circleRef.current = null;
    }

    if (properties.length === 1 && isApproximateRadius) {
      const p = properties[0];
      const approxCenter: [number, number] = [p.latitude, p.longitude];
      map.setView(approxCenter, 13);

      // Privacy shield: Draw an approximate 600m radius circle rather than pinpoint exact house
      const circle = L.circle(approxCenter, {
        color: "#0D9488",
        fillColor: "#14B8A6",
        fillOpacity: 0.15,
        radius: 650,
        weight: 2,
        dashArray: "6, 6",
      }).addTo(map);

      circle.bindPopup(
        `<div style="text-align: center; font-size: 12px; font-family: sans-serif; padding: 4px;">
          <strong>Approximate Neighbourhood</strong><br/>
          ${p.neighbourhood}, ${p.city}<br/>
          <span style="color: #64748B; font-size: 11px;">Exact residential address is shared only after booking confirmation.</span>
        </div>`
      );

      circleRef.current = circle;
    } else if (properties.length > 0) {
      const bounds = L.latLngBounds([]);

      properties.forEach((p) => {
        const isSelected = p.id === selectedPropertyId;
        const iconHtml = `
          <div style="
            background: ${isSelected ? "#0D9488" : "#0A192F"};
            color: #FFFFFF;
            font-weight: 700;
            font-size: 12px;
            padding: 5px 10px;
            border-radius: 9999px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            border: 2px solid ${isSelected ? "#F43F5E" : "#14B8A6"};
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            ${p.credits_per_night} pts
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-leaflet-marker",
          iconSize: [65, 30],
          iconAnchor: [32, 15],
        });

        const marker = L.marker([p.latitude, p.longitude], { icon: customIcon })
          .addTo(map)
          .on("click", () => {
            if (onSelectProperty) onSelectProperty(p.id);
          });

        marker.bindPopup(`
          <div style="min-width: 180px; font-family: sans-serif;">
            <div style="font-weight: 700; font-size: 13px; margin-bottom: 2px;">${p.title}</div>
            <div style="color: #64748B; font-size: 11px; margin-bottom: 6px;">${p.neighbourhood}, ${p.city}</div>
            <div style="font-weight: 700; color: #0D9488; font-size: 13px;">${p.credits_per_night} credits / night</div>
          </div>
        `);

        markersRef.current.push(marker);
        bounds.extend([p.latitude, p.longitude]);
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
      }
    }
  }, [properties, selectedPropertyId, onSelectProperty, center, zoom, isApproximateRadius]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: "100%" }}
      className="rounded-2xl overflow-hidden shadow-subtle border border-slate-200 z-0 relative"
    />
  );
}
