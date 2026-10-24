import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await repository.getPropertyById(id);

    if (!property) {
      return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
    }

    const reviews = await repository.getReviewsForProperty(id);

    return NextResponse.json({ success: true, property, reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, adminId, notes } = body;

    if (!status || !adminId) {
      return NextResponse.json(
        { success: false, error: "Status and adminId are required" },
        { status: 400 }
      );
    }

    const updated = await repository.updatePropertyStatus(id, status, adminId, notes);
    return NextResponse.json({ success: true, property: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
