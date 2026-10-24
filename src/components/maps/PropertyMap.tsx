"use client";

import dynamic from "next/dynamic";
import { Property } from "@/types";

interface PropertyMapProps {
  properties: Property[];
  selectedPropertyId?: string | null;
  onSelectProperty?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  isApproximateRadius?: boolean;
}

const DynamicLeafletMap = dynamic(
  () => import("./LeafletMapInner"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-slate-100 rounded-2xl flex flex-col items-center justify-center animate-pulse border border-slate-200">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-slate-500 text-sm font-medium">Loading interactive map...</p>
      </div>
    ),
  }
);

export default function PropertyMap(props: PropertyMapProps) {
  return <DynamicLeafletMap {...props} />;
}
