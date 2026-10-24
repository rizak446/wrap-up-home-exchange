import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || undefined;
    const guests = searchParams.get("guests") ? Number(searchParams.get("guests")) : undefined;
    const minCredits = searchParams.get("minCredits") ? Number(searchParams.get("minCredits")) : undefined;
    const maxCredits = searchParams.get("maxCredits") ? Number(searchParams.get("maxCredits")) : undefined;
    const propertyType = searchParams.get("propertyType") || undefined;
    const verifiedOnly = searchParams.get("verifiedOnly") === "true";
    const sort = (searchParams.get("sort") as any) || "relevance";

    const properties = await repository.getProperties({
      city,
      guests,
      minCredits,
      maxCredits,
      propertyType,
      verifiedOnly,
      sort,
    });

    return NextResponse.json({ success: true, count: properties.length, properties });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hostId, ...propertyData } = body;

    if (!hostId) {
      return NextResponse.json({ success: false, error: "Host ID is required" }, { status: 400 });
    }

    if (!propertyData.title || !propertyData.city || !propertyData.exact_address) {
      return NextResponse.json(
        { success: false, error: "Title, city, and exact address are required" },
        { status: 400 }
      );
    }

    const created = await repository.createProperty(propertyData, hostId);
    return NextResponse.json({ success: true, property: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
