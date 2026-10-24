import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, propertyId, reviewerId, rating, content } = body;

    if (!bookingId || !propertyId || !reviewerId || !rating || !content) {
      return NextResponse.json(
        { success: false, error: "bookingId, propertyId, reviewerId, rating, and content are required" },
        { status: 400 }
      );
    }

    const res = await repository.submitReview({
      bookingId,
      propertyId,
      reviewerId,
      rating: Number(rating),
      content,
    });

    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, review: res.review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
