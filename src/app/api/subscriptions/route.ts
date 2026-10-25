import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("placeholder")) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("price_monthly_inr", { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, source: "supabase", plans: data });
      }
    }

    // Default fallback plans if Supabase connection is offline
    const fallbackPlans = [
      {
        id: "free",
        name: "Free Explorer",
        slug: "free",
        price_monthly_inr: 0,
        price_annual_inr: 0,
        listing_limit: 1,
        monthly_booking_requests: 2,
        features: [
          "Browse all verified homes across India",
          "1 active home listing",
          "2 booking requests per month",
          "Standard member support",
          "Basic messaging with hosts",
        ],
        is_active: true,
      },
      {
        id: "standard",
        name: "Standard Member",
        slug: "standard",
        price_monthly_inr: 799,
        price_annual_inr: 7990,
        listing_limit: 2,
        monthly_booking_requests: 8,
        features: [
          "Verified Member Identity Badge",
          "Up to 2 active home listings",
          "8 booking requests per month",
          "5% bonus credits earned on every host stay",
          "Priority customer support & dispute mediation",
          "Advanced availability calendar filters",
        ],
        is_active: true,
      },
      {
        id: "premium",
        name: "Premium Concierge",
        slug: "premium",
        price_monthly_inr: 1499,
        price_annual_inr: 14990,
        listing_limit: 5,
        monthly_booking_requests: 999,
        features: [
          "Elite Verification Status & Featured Listing Badge",
          "Up to 5 active home listings",
          "Unlimited monthly booking requests",
          "10% bonus credits earned on hosting",
          "Dedicated travel concierge & emergency stay backup",
          "Early access to newly verified homes",
          "Waived platform booking fees",
        ],
        is_active: true,
      },
    ];

    return NextResponse.json({ success: true, source: "fallback", plans: fallbackPlans });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
